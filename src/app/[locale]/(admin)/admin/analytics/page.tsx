export const dynamic = 'force-dynamic'

import { db } from '@/db'
import { pageViews } from '@/db/schema'
import { sql, gte, and } from 'drizzle-orm'
import { requireRole } from '@/lib/auth'

function daysAgo(n: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

async function getStats() {
  const since7d = daysAgo(7)
  const since30d = daysAgo(30)
  const since14d = daysAgo(14)

  const [[views7d], [views30d], [uniques7d], [uniques30d], topPages, dailyTrend] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(pageViews).where(gte(pageViews.createdAt, since7d)),
    db.select({ count: sql<number>`count(*)::int` }).from(pageViews).where(gte(pageViews.createdAt, since30d)),
    db.select({ count: sql<number>`count(distinct ${pageViews.visitorHash})::int` }).from(pageViews).where(gte(pageViews.createdAt, since7d)),
    db.select({ count: sql<number>`count(distinct ${pageViews.visitorHash})::int` }).from(pageViews).where(gte(pageViews.createdAt, since30d)),
    db
      .select({ path: pageViews.path, count: sql<number>`count(*)::int` })
      .from(pageViews)
      .where(gte(pageViews.createdAt, since7d))
      .groupBy(pageViews.path)
      .orderBy(sql`count(*) desc`)
      .limit(8),
    db
      .select({
        day: sql<string>`to_char(${pageViews.createdAt}, 'YYYY-MM-DD')`,
        count: sql<number>`count(*)::int`,
      })
      .from(pageViews)
      .where(gte(pageViews.createdAt, since14d))
      .groupBy(sql`to_char(${pageViews.createdAt}, 'YYYY-MM-DD')`)
      .orderBy(sql`to_char(${pageViews.createdAt}, 'YYYY-MM-DD')`),
  ])

  return {
    views7d: views7d.count,
    views30d: views30d.count,
    uniques7d: uniques7d.count,
    uniques30d: uniques30d.count,
    topPages,
    dailyTrend,
  }
}

export default async function AnalyticsPage() {
  await requireRole('admin', 'super_admin')

  let stats: Awaited<ReturnType<typeof getStats>> | null = null
  try {
    stats = await getStats()
  } catch {
    // DB niet bereikbaar — toon lege staat i.p.v. crash
  }

  const cardStyle: React.CSSProperties = {
    background: '#15171C',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 2,
    padding: '20px 22px',
  }

  // Laatste 14 dagen als complete reeks (ook dagen zonder bezoek tonen als 0)
  const trendMap = new Map((stats?.dailyTrend ?? []).map((d) => [d.day, d.count]))
  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const d = daysAgo(13 - i)
    const key = d.toISOString().slice(0, 10)
    return { day: key, count: trendMap.get(key) ?? 0 }
  })
  const maxCount = Math.max(1, ...last14Days.map((d) => d.count))

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 400, color: '#E9E3D6', margin: '0 0 4px' }}>
          Analytics
        </h1>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: '#6E6A63', margin: 0 }}>
          First-party, cookieless page views — no third-party tracking.
        </p>
      </div>

      {!stats ? (
        <div style={{ ...cardStyle, textAlign: 'center', padding: '48px 24px' }}>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, color: '#E9E3D6', margin: 0 }}>
            No data available yet.
          </p>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" style={{ marginBottom: 28 }}>
            {[
              { label: 'Page views (7d)', value: stats.views7d },
              { label: 'Page views (30d)', value: stats.views30d },
              { label: 'Unique visitors (7d)', value: stats.uniques7d },
              { label: 'Unique visitors (30d)', value: stats.uniques30d },
            ].map((stat) => (
              <div key={stat.label} style={cardStyle}>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 34, fontWeight: 400, color: '#E9E3D6', margin: '0 0 4px', lineHeight: 1 }}>
                  {stat.value}
                </p>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6E6A63', margin: 0 }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Trend */}
          <div style={{ ...cardStyle, marginBottom: 28 }}>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C79E6B', margin: '0 0 18px' }}>
              Last 14 days
            </p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 100 }}>
              {last14Days.map((d) => (
                <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }} title={`${d.day}: ${d.count}`}>
                  <div
                    style={{
                      width: '100%',
                      height: Math.max(2, (d.count / maxCount) * 80),
                      background: d.count > 0 ? 'linear-gradient(180deg, #DDBB85, #C79E6B)' : 'rgba(255,255,255,0.05)',
                      borderRadius: 1,
                    }}
                  />
                  <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 8, color: '#4E4B46' }}>
                    {d.day.slice(8, 10)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top pages */}
          <div style={cardStyle}>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C79E6B', margin: '0 0 16px' }}>
              Top pages (7d)
            </p>
            {stats.topPages.length === 0 ? (
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: '#6E6A63', margin: 0 }}>No views yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {stats.topPages.map((p) => {
                  const maxTop = stats.topPages[0].count
                  return (
                    <div key={p.path} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: '#E9E3D6', width: 220, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.path}
                      </span>
                      <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', height: 6, borderRadius: 1 }}>
                        <div style={{ width: `${(p.count / maxTop) * 100}%`, background: '#C79E6B', height: '100%', borderRadius: 1 }} />
                      </div>
                      <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: '#8C877F', width: 36, textAlign: 'right', flexShrink: 0 }}>
                        {p.count}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
