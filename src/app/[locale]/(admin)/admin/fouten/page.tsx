import { db } from '@/db'
import { errorLogs } from '@/db/schema'
import { desc } from 'drizzle-orm'
import { formatDate } from '@/lib/utils'

export default async function FoutenPage() {
  const errors = await db
    .select()
    .from(errorLogs)
    .orderBy(desc(errorLogs.createdAt))
    .limit(50)

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
          Error Logs
        </h1>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: '#6E6A63', margin: 0 }}>
          Last {errors.length} entries
        </p>
      </div>

      {errors.length === 0 ? (
        <div
          style={{
            background: 'rgba(80,160,80,0.06)',
            border: '1px solid rgba(80,160,80,0.18)',
            borderRadius: 2,
            padding: '40px 24px',
            textAlign: 'center',
            fontFamily: "'Jost', sans-serif",
            fontSize: 14,
            color: '#7FC97F',
          }}
        >
          ✓ No errors logged. Everything is running cleanly.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {errors.map((e) => (
            <div
              key={e.id}
              style={{
                background: '#15171C',
                border: `1px solid ${e.resolved ? 'rgba(255,255,255,0.04)' : 'rgba(200,80,80,0.2)'}`,
                borderRadius: 2,
                padding: '14px 18px',
                opacity: e.resolved ? 0.5 : 1,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <p
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 13,
                    fontWeight: 500,
                    color: e.resolved ? '#8C877F' : '#E87777',
                    margin: 0,
                    wordBreak: 'break-all',
                  }}
                >
                  {e.message}
                </p>
                {e.resolved && (
                  <span
                    style={{
                      background: 'rgba(80,160,80,0.12)',
                      color: '#7FC97F',
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 9,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      padding: '3px 8px',
                      borderRadius: 1,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Resolved
                  </span>
                )}
              </div>

              {e.url && (
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: '#6E6A63', margin: '6px 0 0' }}>
                  URL: {e.url}
                </p>
              )}

              {e.stack && (
                <details style={{ marginTop: 8 }}>
                  <summary
                    style={{
                      cursor: 'pointer',
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 11,
                      color: '#6E6A63',
                    }}
                  >
                    Stack trace
                  </summary>
                  <pre
                    style={{
                      marginTop: 8,
                      padding: '10px 12px',
                      background: '#0F1014',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 1,
                      fontFamily: 'monospace',
                      fontSize: 11,
                      color: '#8C877F',
                      overflowX: 'auto',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {e.stack}
                  </pre>
                </details>
              )}

              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: '#4E4B46', margin: '8px 0 0' }}>
                {formatDate(e.createdAt)} · IP: {e.ipAddress ?? 'unknown'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
