'use client'

import { useState } from 'react'
import type { Appointment } from '@/db/schema'

const TOPIC_LABELS: Record<string, string> = {
  corporate: 'Corporate & Commercial',
  private_wealth: 'Private Wealth & Family Business',
  strategic: 'Strategic Advisory',
  transactions: 'Transactions & M&A',
  dispute: 'Dispute Resolution',
  regulatory: 'Regulatory & Compliance',
  other: 'Other',
}

function buildSummary(appt: Appointment): string {
  const dateLabel = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(`${appt.date}T00:00:00`))

  const lines = [
    `${appt.name} — ${appt.status.charAt(0).toUpperCase()}${appt.status.slice(1)}`,
    '',
    `Date: ${dateLabel}`,
    `Time: ${appt.time}`,
    `Service: ${TOPIC_LABELS[appt.topic ?? ''] ?? appt.topic ?? '—'}`,
    '',
    `Email: ${appt.email}`,
    `Phone: ${appt.phone}`,
  ]
  if (appt.address) lines.push(`Address: ${appt.address}`)
  if (appt.notes) lines.push('', `Notes: ${appt.notes}`)

  return lines.join('\n')
}

export function CopySummary({ appointment }: { appointment: Appointment }) {
  const [copied, setCopied] = useState(false)
  const summary = buildSummary(appointment)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(summary)
    } catch {
      // Fallback voor browsers zonder clipboard-API toestemming
      const textarea = document.createElement('textarea')
      textarea.value = summary
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ background: '#15171C', border: '1px solid rgba(199,158,107,0.18)', borderRadius: 2, padding: '18px 20px', marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C79E6B', margin: 0 }}>
          Copy summary
        </p>
        <button
          type="button"
          onClick={handleCopy}
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 10,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: copied ? '#7FC97F' : '#0F1014',
            background: copied ? 'rgba(80,160,80,0.12)' : '#C79E6B',
            border: copied ? '1px solid rgba(80,160,80,0.3)' : 'none',
            padding: '7px 16px',
            cursor: 'pointer',
            borderRadius: 1,
          }}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre
        style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: 13,
          lineHeight: 1.7,
          color: '#E9E3D6',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          margin: 0,
          background: '#0F1014',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: 1,
          padding: '14px 16px',
        }}
      >
        {summary}
      </pre>
    </div>
  )
}
