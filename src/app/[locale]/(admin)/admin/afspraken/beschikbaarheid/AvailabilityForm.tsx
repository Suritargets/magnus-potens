'use client'

import { useActionState } from 'react'
import { saveAvailability } from './actions'
import type { AvailabilityConfig } from '@/db/schema'

interface Props {
  configs: AvailabilityConfig[]
}

const initialState = { success: false, error: null }

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const inputStyle: React.CSSProperties = {
  background: '#0F1014',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#E9E3D6',
  fontFamily: "'Jost', sans-serif",
  fontSize: 13,
  padding: '7px 10px',
  outline: 'none',
  borderRadius: 1,
  width: 90,
}

export function AvailabilityForm({ configs }: Props) {
  const [state, action, pending] = useActionState(saveAvailability, initialState)

  const configByDay = new Map(configs.map((c) => [c.dayOfWeek, c]))

  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 400, color: '#E9E3D6', margin: '0 0 4px' }}>
          Beschikbaarheid
        </h1>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: '#6E6A63', margin: 0 }}>
          Configure which days and hours are available for consultations.
        </p>
      </div>

      {state.success && (
        <div style={{ background: 'rgba(80,160,80,0.1)', border: '1px solid rgba(80,160,80,0.25)', color: '#7FC97F', fontFamily: "'Jost', sans-serif", fontSize: 13, padding: '10px 14px', marginBottom: 20, borderRadius: 1 }}>
          ✓ Availability saved.
        </div>
      )}
      {state.error && (
        <div style={{ background: 'rgba(200,80,80,0.1)', border: '1px solid rgba(200,80,80,0.25)', color: '#E87777', fontFamily: "'Jost', sans-serif", fontSize: 13, padding: '10px 14px', marginBottom: 20, borderRadius: 1 }}>
          {state.error}
        </div>
      )}

      <form action={action}>
        <div style={{ background: '#15171C', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', marginBottom: 24 }}>
          {/* Header row */}
          <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 90px 90px 100px', gap: 16, padding: '10px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {['Day', 'Active', 'From', 'Until', 'Duration'].map((h) => (
              <p key={h} style={{ fontFamily: "'Jost', sans-serif", fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#5E5A53', margin: 0 }}>
                {h}
              </p>
            ))}
          </div>

          {DAY_NAMES.map((day, dow) => {
            const cfg = configByDay.get(dow)
            return (
              <div
                key={dow}
                style={{ display: 'grid', gridTemplateColumns: '160px 1fr 90px 90px 100px', gap: 16, padding: '12px 18px', borderBottom: dow < 6 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center' }}
              >
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: '#E9E3D6', margin: 0 }}>{day}</p>
                <div>
                  <input
                    type="checkbox"
                    name={`active_${dow}`}
                    id={`active_${dow}`}
                    defaultChecked={cfg?.isActive ?? false}
                    style={{ width: 16, height: 16, accentColor: '#C79E6B', cursor: 'pointer' }}
                  />
                </div>
                <input
                  type="time"
                  name={`start_${dow}`}
                  defaultValue={cfg?.startTime ?? '09:00'}
                  style={inputStyle}
                />
                <input
                  type="time"
                  name={`end_${dow}`}
                  defaultValue={cfg?.endTime ?? '17:00'}
                  style={inputStyle}
                />
                <select
                  name={`duration_${dow}`}
                  defaultValue={String(cfg?.slotDuration ?? 60)}
                  style={{ ...inputStyle, width: 100, cursor: 'pointer', appearance: 'none' }}
                >
                  <option value="15">15 min</option>
                  <option value="30">30 min</option>
                  <option value="45">45 min</option>
                  <option value="60">60 min</option>
                  <option value="90">90 min</option>
                  <option value="120">120 min</option>
                </select>
              </div>
            )
          })}
        </div>

        <button
          type="submit"
          disabled={pending}
          style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#0F1014', background: pending ? '#A67C3E' : '#C79E6B', border: 'none', padding: '12px 28px', cursor: pending ? 'not-allowed' : 'pointer', borderRadius: 1 }}
        >
          {pending ? 'Saving…' : 'Save'}
        </button>
      </form>
    </div>
  )
}
