import 'server-only'
import { cookies } from 'next/headers'
import { cache } from 'react'
import { SESSION_COOKIE, verifySession } from '@/lib/session'
import type { User } from '@/db/schema'

export const getCurrentUser = cache(async (): Promise<User | null> => {
  // Dev-only preview: bekijk de admin UI lokaal zonder in te loggen.
  // Werkt uitsluitend met NODE_ENV=development én DEV_ADMIN_PREVIEW=true in .env.local.
  if (process.env.NODE_ENV === 'development' && process.env.DEV_ADMIN_PREVIEW === 'true') {
    return {
      id: 'dev-preview',
      clerkId: 'dev-preview',
      email: 'dev@localhost',
      name: 'Dev Preview',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null

  const session = await verifySession(token)
  if (!session) return null

  return {
    id: session.id,
    clerkId: session.username,
    email: `${session.username}@magnus-potens.local`,
    name: session.name,
    role: session.role,
    createdAt: new Date(0),
    updatedAt: new Date(0),
  }
})

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')
  return user
}

export async function requireRole(
  ...roles: Array<'user' | 'admin' | 'super_admin'>
): Promise<User> {
  const user = await requireAuth()
  if (!roles.includes(user.role)) {
    throw new Error(`Forbidden: requires role ${roles.join(' or ')}`)
  }
  return user
}

export async function hasRole(
  ...roles: Array<'user' | 'admin' | 'super_admin'>
): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false
  return roles.includes(user.role)
}
