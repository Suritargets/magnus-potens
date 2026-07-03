import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { pageViews } from '@/db/schema'
import { getClientIp } from '@/lib/rate-limit'
import { isBot, hashVisitor } from '@/lib/analytics'

export const runtime = 'nodejs'

// POST /api/analytics/track — first-party, cookieless page view logging.
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const userAgent = req.headers.get('user-agent')
    if (isBot(userAgent)) return NextResponse.json({ ok: true })

    const body = await req.json().catch(() => null)
    const path = typeof body?.path === 'string' ? body.path.slice(0, 500) : null
    const locale = typeof body?.locale === 'string' ? body.locale.slice(0, 5) : 'en'
    const referrer = typeof body?.referrer === 'string' ? body.referrer.slice(0, 500) : null

    if (!path) return NextResponse.json({ error: 'Missing path' }, { status: 400 })

    const ip = await getClientIp()
    const visitorHash = hashVisitor(ip, userAgent ?? '')

    await db.insert(pageViews).values({ path, locale, referrer, visitorHash })

    return NextResponse.json({ ok: true })
  } catch {
    // Analytics mag nooit de pagina breken — stil falen.
    return NextResponse.json({ ok: false })
  }
}
