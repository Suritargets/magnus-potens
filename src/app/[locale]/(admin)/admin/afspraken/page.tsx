import { db } from '@/db'
import { appointments, availabilityOverrides } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'
import Link from 'next/link'
import { AdminCalendar } from './AdminCalendar'

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  pending:   { bg: 'rgba(199,158,107,0.1)', color: '#C79E6B' },
  confirmed: { bg: 'rgba(80,160,80,0.12)', color: '#7FC97F' },
  cancelled: { bg: 'rgba(200,80,80,0.1)', color: '#E87777' },
}

export default async function AfsprakenPage() {
  const [all, blocks] = await Promise.all([
    db.select().from(appointments).orderBy(desc(appointments.createdAt)),
    db
      .select({ date: availabilityOverrides.date })
      .from(availabilityOverrides)
      .where(eq(availabilityOverrides.isClosed, true)),
  ])

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 400, color: '#E9E3D6', margin: '0 0 4px' }}>
            Afspraken
          </h1>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: '#6E6A63', margin: 0 }}>
            {all.length} appointment{all.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/afspraken/beschikbaarheid"
          style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C79E6B', border: '1px solid rgba(199,158,107,0.3)', padding: '10px 18px', textDecoration: 'none', borderRadius: 1 }}
        >
          Beschikbaarheid →
        </Link>
      </div>

      {/* Maandkalender met klantnamen (alleen zichtbaar in admin) */}
      <AdminCalendar
        appointments={all.map((a) => ({ id: a.id, date: a.date, time: a.time, name: a.name, status: a.status }))}
        blockedDates={blocks.map((b) => b.date)}
      />

      <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, fontWeight: 400, color: '#E9E3D6', margin: '0 0 14px' }}>
        Binnengekomen aanvragen
      </h2>

      {all.length === 0 ? (
        <div style={{ background: '#15171C', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2, padding: '48px 24px', textAlign: 'center' }}>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, color: '#E9E3D6', margin: '0 0 8px' }}>
            No appointments yet.
          </p>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: '#6E6A63', margin: 0 }}>
            Appointments submitted via the consultation page appear here.
          </p>
        </div>
      ) : (
        <div style={{ background: '#15171C', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
          {all.map((appt, i) => {
            const s = STATUS_STYLES[appt.status] ?? STATUS_STYLES.pending
            return (
              <div
                key={appt.id}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: i < all.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', gap: 12 }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: '#E9E3D6', margin: '0 0 2px' }}>
                    {appt.name}
                  </p>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: '#6E6A63', margin: 0 }}>
                    {appt.email} · {appt.date} {appt.time}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
                  <span style={{ background: s.bg, color: s.color, fontFamily: "'Jost', sans-serif", fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 1 }}>
                    {appt.status}
                  </span>
                  <Link
                    href={`/admin/afspraken/${appt.id}`}
                    style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.1em', color: '#C79E6B', textDecoration: 'none' }}
                  >
                    View →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
