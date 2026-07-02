'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

interface ApptLite {
  id: string
  date: string
  time: string
  name: string
  status: string
}

interface Props {
  appointments: ApptLite[]
  blockedDates: string[]
}

const STATUS_COLOR: Record<string, string> = {
  pending: '#C79E6B',
  confirmed: '#7FC97F',
  cancelled: '#E87777',
}

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function AdminCalendar({ appointments, blockedDates }: Props) {
  const now = new Date()
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth() + 1)

  const todayStr = toDateStr(now.getFullYear(), now.getMonth() + 1, now.getDate())
  const blocked = useMemo(() => new Set(blockedDates), [blockedDates])

  const byDate = useMemo(() => {
    const map = new Map<string, ApptLite[]>()
    for (const a of appointments) {
      if (a.status === 'cancelled') continue
      if (!map.has(a.date)) map.set(a.date, [])
      map.get(a.date)!.push(a)
    }
    for (const list of map.values()) list.sort((x, y) => x.time.localeCompare(y.time))
    return map
  }, [appointments])

  const monthLabel = new Intl.DateTimeFormat('nl-NL', { month: 'long', year: 'numeric' }).format(
    new Date(Date.UTC(viewYear, viewMonth - 1, 1))
  )

  const gridCells = useMemo(() => {
    const firstDow = new Date(Date.UTC(viewYear, viewMonth - 1, 1)).getUTCDay()
    const lead = (firstDow + 6) % 7
    const daysInMonth = new Date(Date.UTC(viewYear, viewMonth, 0)).getUTCDate()
    const cells: (number | null)[] = Array.from({ length: lead }, () => null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    while (cells.length % 7 !== 0) cells.push(null)
    return cells
  }, [viewYear, viewMonth])

  function changeMonth(delta: number) {
    let y = viewYear
    let m = viewMonth + delta
    if (m < 1) { m = 12; y-- }
    if (m > 12) { m = 1; y++ }
    setViewYear(y)
    setViewMonth(m)
  }

  return (
    <div style={{ marginBottom: 40 }}>
      {/* Maandnavigatie */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: '#C79E6B', background: 'none', border: '1px solid rgba(199,158,107,0.25)', width: 34, height: 34, cursor: 'pointer', borderRadius: 1 }}
        >
          ←
        </button>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 400, color: '#E9E3D6', margin: 0, textTransform: 'capitalize' }}>
          {monthLabel}
        </h2>
        <button
          type="button"
          onClick={() => changeMonth(1)}
          style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: '#C79E6B', background: 'none', border: '1px solid rgba(199,158,107,0.25)', width: 34, height: 34, cursor: 'pointer', borderRadius: 1 }}
        >
          →
        </button>
      </div>

      {/* Weekdagen */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
        {['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'].map((w) => (
          <p key={w} style={{ fontFamily: "'Jost', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#5E5A53', textAlign: 'center', margin: 0, padding: '6px 0' }}>
            {w}
          </p>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {gridCells.map((d, i) => {
          if (d === null) return <div key={`x${i}`} style={{ minHeight: 86 }} />
          const dateStr = toDateStr(viewYear, viewMonth, d)
          const appts = byDate.get(dateStr) ?? []
          const isToday = dateStr === todayStr
          const isBlocked = blocked.has(dateStr)

          return (
            <div
              key={dateStr}
              style={{
                minHeight: 86,
                padding: 6,
                background: isBlocked ? 'rgba(200,80,80,0.05)' : '#15171C',
                border: isToday ? '1px solid #C79E6B' : '1px solid rgba(255,255,255,0.05)',
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: isBlocked ? '#E87777' : '#8C877F', margin: '0 0 4px', display: 'flex', justifyContent: 'space-between' }}>
                <span>{d}</span>
                {isBlocked && <span style={{ fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Dicht</span>}
              </p>
              {appts.slice(0, 3).map((a) => (
                <Link
                  key={a.id}
                  href={`/admin/afspraken/${a.id}`}
                  style={{
                    display: 'block',
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 10,
                    color: '#E9E3D6',
                    background: 'rgba(199,158,107,0.08)',
                    borderLeft: `2px solid ${STATUS_COLOR[a.status] ?? '#C79E6B'}`,
                    padding: '3px 5px',
                    marginBottom: 3,
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    borderRadius: 1,
                  }}
                  title={`${a.time} — ${a.name}`}
                >
                  {a.time} {a.name}
                </Link>
              ))}
              {appts.length > 3 && (
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 9, color: '#6E6A63', margin: 0 }}>
                  +{appts.length - 3} meer
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
