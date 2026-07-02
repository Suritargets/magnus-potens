'use client'

import { useActionState } from 'react'
import { addDateBlock, removeDateBlock } from './actions'
import type { AvailabilityOverride } from '@/db/schema'

interface Props {
  overrides: AvailabilityOverride[]
}

const initialState = { success: false, error: null as string | null }

const inputStyle: React.CSSProperties = {
  background: '#0F1014',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#E9E3D6',
  fontFamily: "'Jost', sans-serif",
  fontSize: 13,
  padding: '9px 12px',
  outline: 'none',
  borderRadius: 1,
}

export function DateBlocks({ overrides }: Props) {
  const [state, action, pending] = useActionState(addDateBlock, initialState)

  return (
    <div style={{ marginTop: 48, maxWidth: 680 }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 400, color: '#E9E3D6', margin: '0 0 4px' }}>
        Geblokkeerde datums
      </h2>
      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: '#6E6A63', margin: '0 0 20px' }}>
        Sluit specifieke dagen (vakantie, feestdag). Deze dagen zijn niet boekbaar, ongeacht het weekschema.
      </p>

      {state.error && (
        <div style={{ background: 'rgba(200,80,80,0.1)', border: '1px solid rgba(200,80,80,0.25)', color: '#E87777', fontFamily: "'Jost', sans-serif", fontSize: 13, padding: '10px 14px', marginBottom: 16, borderRadius: 1 }}>
          {state.error}
        </div>
      )}

      <form action={action} style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <input type="date" name="date" required style={{ ...inputStyle, colorScheme: 'dark' }} />
        <input type="text" name="note" placeholder="Reden (optioneel)" style={{ ...inputStyle, flex: 1, minWidth: 180 }} />
        <button
          type="submit"
          disabled={pending}
          style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#0F1014', background: pending ? '#A67C3E' : '#C79E6B', border: 'none', padding: '10px 22px', cursor: pending ? 'not-allowed' : 'pointer', borderRadius: 1 }}
        >
          {pending ? '…' : 'Blokkeer datum'}
        </button>
      </form>

      {overrides.length === 0 ? (
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: '#5E5A53' }}>Geen geblokkeerde datums.</p>
      ) : (
        <div style={{ background: '#15171C', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
          {overrides.map((o, i) => (
            <div
              key={o.id}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '12px 18px', borderBottom: i < overrides.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
            >
              <div>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: '#E9E3D6', margin: 0 }}>
                  {new Date(`${o.date}T00:00:00`).toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                {o.note && (
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: '#6E6A63', margin: '2px 0 0' }}>{o.note}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeDateBlock(o.id)}
                style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#E87777', background: 'none', border: '1px solid rgba(200,80,80,0.25)', padding: '6px 12px', cursor: 'pointer', borderRadius: 1 }}
              >
                Verwijder
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
