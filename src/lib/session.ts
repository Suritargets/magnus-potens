import { SignJWT, jwtVerify } from 'jose'

export const SESSION_COOKIE = 'mp_session'
const SESSION_DURATION = '7d'

export interface SessionPayload {
  id: string
  username: string
  name: string
  role: 'user' | 'admin' | 'super_admin'
}

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error('AUTH_SECRET is not set')
  return new TextEncoder().encode(secret)
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(getSecret())
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    if (
      typeof payload.id === 'string' &&
      typeof payload.username === 'string' &&
      typeof payload.name === 'string' &&
      typeof payload.role === 'string'
    ) {
      return {
        id: payload.id,
        username: payload.username,
        name: payload.name,
        role: payload.role as SessionPayload['role'],
      }
    }
    return null
  } catch {
    return null
  }
}
