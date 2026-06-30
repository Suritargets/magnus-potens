import { db } from '@/db'
import { contactSubmissions } from '@/db/schema'
import { desc } from 'drizzle-orm'
import { formatDate } from '@/lib/utils'

const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
  new:      { bg: 'rgba(199,158,107,0.15)', color: '#C79E6B',  label: 'New'      },
  read:     { bg: 'rgba(255,255,255,0.06)', color: '#8C877F',  label: 'Read'     },
  replied:  { bg: 'rgba(80,160,80,0.15)',   color: '#7FC97F',  label: 'Replied'  },
  archived: { bg: 'rgba(255,255,255,0.04)', color: '#6E6A63',  label: 'Archived' },
}

export default async function BerichtenPage() {
  const submissions = await db
    .select()
    .from(contactSubmissions)
    .orderBy(desc(contactSubmissions.createdAt))
    .limit(100)

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 28,
            fontWeight: 400,
            color: '#E9E3D6',
            margin: '0 0 4px',
          }}
        >
          Enquiries
        </h1>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: '#6E6A63', margin: 0 }}>
          {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
        </p>
      </div>

      {submissions.length === 0 ? (
        <div
          style={{
            background: '#15171C',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 2,
            padding: '48px 24px',
            textAlign: 'center',
            fontFamily: "'Jost', sans-serif",
            fontSize: 14,
            color: '#6E6A63',
          }}
        >
          No enquiries yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {submissions.map((s) => {
            const st = statusStyle[s.status] ?? statusStyle.read
            return (
              <div
                key={s.id}
                style={{
                  background: '#15171C',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 2,
                  padding: '16px 20px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div>
                    <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, fontWeight: 500, color: '#E9E3D6', margin: '0 0 2px' }}>
                      {s.name}
                    </p>
                    <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: '#C79E6B', margin: 0 }}>
                      {s.email}
                    </p>
                  </div>
                  <span
                    style={{
                      background: st.bg,
                      color: st.color,
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 10,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      padding: '3px 10px',
                      borderRadius: 1,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {st.label}
                  </span>
                </div>

                {s.subject && (
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 500, color: '#C8C3BA', margin: '10px 0 4px' }}>
                    {s.subject}
                  </p>
                )}
                <p
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 13,
                    color: '#8C877F',
                    margin: '6px 0 10px',
                    lineHeight: 1.6,
                    overflow: 'hidden',
                    maxHeight: '3.2em',
                  } as React.CSSProperties}
                >
                  {s.message}
                </p>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: '#4E4B46', margin: 0 }}>
                  {formatDate(s.createdAt)}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
