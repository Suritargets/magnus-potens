'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateAppointmentStatus } from './actions'

interface Props {
  id: string
}

export function AppointmentActions({ id }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function handleStatus(status: 'confirmed' | 'cancelled') {
    startTransition(async () => {
      await updateAppointmentStatus(id, status)
      router.refresh()
    })
  }

  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <button
        onClick={() => handleStatus('confirmed')}
        disabled={pending}
        style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#0F1014', background: '#C79E6B', border: 'none', padding: '12px 24px', cursor: pending ? 'not-allowed' : 'pointer', borderRadius: 1 }}
      >
        Confirm
      </button>
      <button
        onClick={() => handleStatus('cancelled')}
        disabled={pending}
        style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#E87777', background: 'rgba(200,80,80,0.08)', border: '1px solid rgba(200,80,80,0.2)', padding: '12px 24px', cursor: pending ? 'not-allowed' : 'pointer', borderRadius: 1 }}
      >
        Cancel
      </button>
    </div>
  )
}
