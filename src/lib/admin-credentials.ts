import 'server-only'
import bcrypt from 'bcryptjs'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import type { User } from '@/db/schema'

/**
 * Verifieert username/wachtwoord tegen de users-tabel (clerkId = username,
 * passwordHash = bcrypt). Wachtwoorden en rollen zijn dus zelf-service
 * beheerbaar via /admin/gebruikers — geen env-var meer nodig.
 */
export async function verifyCredentials(username: string, password: string): Promise<User | null> {
  const normalized = username.trim().toLowerCase()

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, normalized))
    .limit(1)

  if (!user || !user.passwordHash) {
    // Nog steeds een bcrypt-vergelijking uitvoeren om timing-verschil tussen
    // "onbekende gebruiker" en "fout wachtwoord" te voorkomen.
    await bcrypt.compare(password, '$2a$10$invalidsaltinvalidsaltinvalidsu')
    return null
  }

  const ok = await bcrypt.compare(password, user.passwordHash)
  return ok ? user : null
}
