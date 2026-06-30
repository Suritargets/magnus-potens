import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import type { WebhookEvent } from '@clerk/nextjs/server'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    console.error('[Clerk webhook] CLERK_WEBHOOK_SECRET not set')
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(WEBHOOK_SECRET)
  let event: WebhookEvent

  try {
    event = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('[Clerk webhook] Verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'user.created': {
      const { id, email_addresses, first_name, last_name } = event.data
      const primaryEmail = email_addresses.find(
        (e) => e.id === event.data.primary_email_address_id
      )
      if (!primaryEmail) break
      await db.insert(users).values({
        clerkId: id,
        email: primaryEmail.email_address,
        name: [first_name, last_name].filter(Boolean).join(' ') || null,
        role: 'user',
      }).onConflictDoNothing()
      break
    }
    case 'user.updated': {
      const { id, email_addresses, first_name, last_name } = event.data
      const primaryEmail = email_addresses.find(
        (e) => e.id === event.data.primary_email_address_id
      )
      if (!primaryEmail) break
      await db.update(users).set({
        email: primaryEmail.email_address,
        name: [first_name, last_name].filter(Boolean).join(' ') || null,
      }).where(eq(users.clerkId, id))
      break
    }
    case 'user.deleted': {
      const { id } = event.data
      if (!id) break
      await db.delete(users).where(eq(users.clerkId, id))
      break
    }
    default:
      break
  }

  return NextResponse.json({ received: true })
}
