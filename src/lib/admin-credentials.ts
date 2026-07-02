import 'server-only'
import bcrypt from 'bcryptjs'

export interface AdminCredential {
  username: string
  passwordHash: string
  name: string
  role: 'admin' | 'super_admin'
}

let cache: AdminCredential[] | null = null

function loadCredentials(): AdminCredential[] {
  if (cache) return cache
  const raw = process.env.ADMIN_CREDENTIALS
  if (!raw) {
    cache = []
    return cache
  }
  try {
    // Base64-encoded JSON: voorkomt dat Next.js' env-loader de '$'-tekens in
    // bcrypt-hashes (bv. $2b$10$...) als variabele-interpolatie interpreteert.
    const json = Buffer.from(raw, 'base64').toString('utf-8')
    const parsed = JSON.parse(json) as AdminCredential[]
    cache = parsed.map((c) => ({ ...c, username: c.username.toLowerCase() }))
  } catch (err) {
    console.error('[admin-credentials] ADMIN_CREDENTIALS is invalid:', err)
    cache = []
  }
  return cache
}

export async function verifyCredentials(
  username: string,
  password: string
): Promise<AdminCredential | null> {
  const normalized = username.trim().toLowerCase()
  const match = loadCredentials().find((c) => c.username === normalized)
  if (!match) {
    // Nog steeds een bcrypt-vergelijking uitvoeren om timing-verschil tussen
    // "onbekende gebruiker" en "fout wachtwoord" te voorkomen.
    await bcrypt.compare(password, '$2a$10$invalidsaltinvalidsaltinvalidsu')
    return null
  }
  const ok = await bcrypt.compare(password, match.passwordHash)
  return ok ? match : null
}
