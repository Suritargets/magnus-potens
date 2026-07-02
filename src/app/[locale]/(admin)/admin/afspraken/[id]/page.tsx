import { db } from '@/db'
import { appointments } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { AppointmentActions } from './AppointmentActions'

interface Props {
  params: Promise<{ id: string }>
}

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  pending:   { bg: 'rgba(199,158,107,0.1)', color: '#C79E6B' },
  confirmed: { bg: 'rgba(80,160,80,0.12)', color: '#7FC97F' },
  cancelled: { bg: 'rgba(200,80,80,0.1)', color: '#E87777' },
}

const FIELDS = (appt: Awaited<ReturnType<typeof getAppointment>>): [string, string | null | undefined][] => [
  ['Email', appt!.email],
  ['Phone', appt!.phone],
  ['Address', appt!.address],
  ['Date', appt!.date],
  ['Time', appt!.time],
  ['Topic', appt!.topic],
  ['Locale', appt!.locale?.toUpperCase()],
  ['Notes', appt!.notes],
  ['Created', new Date(appt!.createdAt).toLocaleString()],
]

async function getAppointment(id: string) {
  const [appt] = await db.select().from(appointments).where(eq(appointments.id, id)).limit(1)
  return appt ?? null
}

export default async function AfspraakDetailPage({ params }: Props) {
  const { id } = await params
  const appt = await getAppointment(id)
  if (!appt) notFound()

  const s = STATUS_STYLES[appt.status] ?? STATUS_STYLES.pending

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 400, color: '#E9E3D6', margin: '0 0 8px' }}>
            {appt.name}
          </h1>
          <span style={{ background: s.bg, color: s.color, fontFamily: "'Jost', sans-serif", fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '3px 9px', borderRadius: 1 }}>
            {appt.status}
          </span>
        </div>
        <Link href="/admin/afspraken" style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8C877F', textDecoration: 'none' }}>
          ← Back
        </Link>
      </div>

      <div style={{ background: '#15171C', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', marginBottom: 28 }}>
        {FIELDS(appt)
          .filter(([, v]) => v != null)
          .map(([label, value], i, arr) => (
            <div
              key={label}
              style={{ padding: '14px 18px', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', display: 'flex', gap: 24 }}
            >
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#5E5A53', margin: 0, width: 80, flexShrink: 0 }}>
                {label}
              </p>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: '#E9E3D6', margin: 0, wordBreak: 'break-word' }}>
                {value}
              </p>
            </div>
          ))}
      </div>

      {appt.status === 'pending' && <AppointmentActions id={appt.id} />}
    </div>
  )
}
