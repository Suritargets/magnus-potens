import { NextResponse } from 'next/server'
import { db } from '@/db'
import { errorLogs } from '@/db/schema'
import { headers } from 'next/headers'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
    const userAgent = headersList.get('user-agent') ?? 'unknown'

    await db.insert(errorLogs).values({
      message: String(body.message ?? 'Unknown error').slice(0, 500),
      digest:  body.digest ?? null,
      stack:   body.stack ? String(body.stack).slice(0, 2000) : null,
      url:     body.url ? String(body.url).slice(0, 500) : null,
      ipAddress: ip,
      userAgent,
    })

    return NextResponse.json({ ok: true })
  } catch {
    // Never throw from the error route — would cause an infinite loop
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
