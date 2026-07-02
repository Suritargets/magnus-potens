import 'server-only'
import { auth } from '@clerk/nextjs/server'
import { cache } from 'react'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import type { User } from '@/db/schema'

export const getCurrentUser = cache(async (): Promise<User | null> => {
  // Dev-only preview: bekijk de admin UI lokaal zonder Clerk.
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

  const { userId } = await auth()
  if (!userId) return null

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, userId))
    .limit(1)

  return user ?? null
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
