'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { verifyCredentials } from '@/lib/admin-credentials'
import { signSession, SESSION_COOKIE } from '@/lib/session'
import { loginRateLimit, getClientIp } from '@/lib/rate-limit'

export type LoginState = { error: string | null }

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get('username') ?? '')
  const password = String(formData.get('password') ?? '')
  const locale = String(formData.get('locale') ?? 'en')

  const ip = await getClientIp()
  const { success: allowed } = await loginRateLimit.limit(ip)
  if (!allowed) {
    return { error: 'Too many attempts. Please try again in a few minutes.' }
  }

  if (!username || !password) {
    return { error: 'Please enter your username and password.' }
  }

  const credential = await verifyCredentials(username, password)
  if (!credential) {
    return { error: 'Invalid username or password.' }
  }

  // Upsert de admin als DB-gebruiker, zodat authorId/uploadedBy referenties blijven kloppen.
  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, credential.username))
    .limit(1)

  let userId: string
  if (existing) {
    userId = existing.id
    await db
      .update(users)
      .set({ name: credential.name, role: credential.role, updatedAt: new Date() })
      .where(eq(users.id, existing.id))
  } else {
    const [inserted] = await db
      .insert(users)
      .values({
        clerkId: credential.username,
        email: `${credential.username}@magnus-potens.local`,
        name: credential.name,
        role: credential.role,
      })
      .returning()
    userId = inserted.id
  }

  const token = await signSession({
    id: userId,
    username: credential.username,
    name: credential.name,
    role: credential.role,
  })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  redirect(`/${locale}/admin`)
}

export async function logout(locale: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  redirect(`/${locale}/sign-in`)
}
