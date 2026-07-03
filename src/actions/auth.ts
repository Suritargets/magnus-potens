'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
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

  const user = await verifyCredentials(username, password)
  if (!user) {
    return { error: 'Invalid username or password.' }
  }

  const token = await signSession({
    id: user.id,
    username: user.clerkId,
    name: user.name ?? user.clerkId,
    role: user.role,
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
