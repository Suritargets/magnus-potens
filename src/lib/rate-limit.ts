import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { headers } from 'next/headers'

// ─── REDIS CLIENT ─────────────────────────────────────────────────────────────
let redis: Redis | null = null

function getRedis(): Redis | null {
  if (!redis) {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      return null
    }
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  }
  return redis
}

// ─── RATE LIMITERS (lazy) ─────────────────────────────────────────────────────
// Zonder Upstash env vars: fail-open (geen rate limiting, wél een warning).
// Limiters worden pas geïnitialiseerd bij het eerste .limit() call, zodat
// het ontbreken van env vars de module-load (en daarmee de hele pagina) niet breekt.
type LimitResult = { success: boolean }

interface LazyLimiter {
  limit(key: string): Promise<LimitResult>
}

function createLimiter(prefix: string, limiter: ReturnType<typeof Ratelimit.slidingWindow>): LazyLimiter {
  let instance: Ratelimit | null = null
  return {
    async limit(key: string): Promise<LimitResult> {
      const client = getRedis()
      if (!client) {
        console.warn(`[rate-limit] Upstash env vars niet gezet — ${prefix} staat open`)
        return { success: true }
      }
      if (!instance) {
        instance = new Ratelimit({ redis: client, limiter, analytics: true, prefix })
      }
      return instance.limit(key)
    },
  }
}

// Contact form: max 3 per 10 minutes per IP
export const contactRateLimit = createLimiter('rl:contact', Ratelimit.slidingWindow(3, '10 m'))

// Login attempts: max 5 per 15 minutes per IP
export const loginRateLimit = createLimiter('rl:login', Ratelimit.slidingWindow(5, '15 m'))

// General API: max 30 per minute per IP
export const apiRateLimit = createLimiter('rl:api', Ratelimit.slidingWindow(30, '1 m'))

// ─── HELPER ───────────────────────────────────────────────────────────────────
export async function getClientIp(): Promise<string> {
  const headersList = await headers()
  return (
    headersList.get('x-forwarded-for')?.split(',')[0].trim() ??
    headersList.get('x-real-ip') ??
    'unknown'
  )
}
