'use server'

import { db } from '@/db'
import { users } from '@/db/schema'
import { eq, ne, and } from 'drizzle-orm'
import { requireRole, getCurrentUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'

type SaveState = { success: boolean; error: string | null }

export async function saveUser(_prev: SaveState, formData: FormData): Promise<SaveState> {
  try {
    await requireRole('super_admin')

    const id = formData.get('id') as string | null
    // Het username-veld is 'disabled' in de UI wanneer een bestaande gebruiker
    // wordt bewerkt (username is onveranderlijk), dus disabled inputs worden
    // door de browser NIET in de FormData meegestuurd — alleen valideren/lezen
    // bij het aanmaken van een nieuwe gebruiker.
    const username = ((formData.get('username') as string) ?? '').trim().toLowerCase()
    const name = ((formData.get('name') as string) ?? '').trim()
    const submittedRole = (formData.get('role') as 'admin' | 'super_admin' | null) ?? null
    const password = (formData.get('password') as string) ?? ''

    if (!name) return { success: false, error: 'Name is required.' }
    if (!id && !username) return { success: false, error: 'Username is required.' }
    if (!id && !/^[a-z0-9_.-]+$/.test(username)) return { success: false, error: 'Username may only contain lowercase letters, numbers, dots, dashes and underscores.' }
    if (!id && !password) return { success: false, error: 'Password is required for a new user.' }
    if (password && password.length < 8) return { success: false, error: 'Password must be at least 8 characters.' }

    if (id) {
      const current = await getCurrentUser()
      // Bij het bewerken van je eigen account is de rol-select disabled in de
      // UI (dus afwezig in de FormData) — behoud altijd de huidige rol i.p.v.
      // op de afwezige/onverwachte waarde te vertrouwen.
      const isSelf = current?.id === id
      const role = isSelf ? current!.role : (submittedRole ?? 'admin')

      const updates: Partial<typeof users.$inferInsert> = {
        name,
        role,
        updatedAt: new Date(),
      }
      if (password) updates.passwordHash = await bcrypt.hash(password, 10)

      await db.update(users).set(updates).where(eq(users.id, id))
    } else {
      const role = submittedRole ?? 'admin'
      const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.clerkId, username)).limit(1)
      if (existing) return { success: false, error: 'That username is already taken.' }

      const passwordHash = await bcrypt.hash(password, 10)
      await db.insert(users).values({
        clerkId: username,
        email: `${username}@magnus-potens.local`,
        name,
        role,
        passwordHash,
      })
    }

    revalidatePath('/admin/gebruikers')
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { success: false, error: message }
  }

  redirect('/admin/gebruikers')
}

export async function deleteUser(id: string): Promise<{ error: string | null }> {
  await requireRole('super_admin')

  const current = await getCurrentUser()
  if (current?.id === id) return { error: "You can't delete your own account." }

  const [target] = await db.select({ role: users.role }).from(users).where(eq(users.id, id)).limit(1)
  if (target?.role === 'super_admin') {
    const otherSuperAdmins = await db
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.role, 'super_admin'), ne(users.id, id)))
    if (otherSuperAdmins.length === 0) {
      return { error: 'At least one super_admin must remain.' }
    }
  }

  await db.delete(users).where(eq(users.id, id))
  revalidatePath('/admin/gebruikers')
  return { error: null }
}
