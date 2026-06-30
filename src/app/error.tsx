'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: error.message,
        digest: error.digest,
        stack: error.stack,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => { /* silent fail */ })
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          backgroundColor: '#0F1014',
          color: '#E9E3D6',
          fontFamily: 'Georgia, serif',
          display: 'flex',
          minHeight: '100vh',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', color: '#C79E6B', textTransform: 'uppercase' }}>
          Magnus &amp; Potens
        </p>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 400, color: '#F3EEE4' }}>
          Something went wrong.
        </h1>
        <p style={{ color: '#A7A29A', maxWidth: '28rem' }}>
          We have been notified. Please accept our apologies for the inconvenience.
        </p>
        {error.digest && (
          <p style={{ fontSize: '0.7rem', color: '#5E5A53', fontFamily: 'monospace' }}>
            Reference: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          style={{
            marginTop: '0.5rem',
            border: '1px solid #C79E6B',
            color: '#C79E6B',
            background: 'transparent',
            padding: '0.625rem 2rem',
            fontSize: '0.8125rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s',
          }}
          onMouseOver={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = '#C79E6B'
            ;(e.currentTarget as HTMLButtonElement).style.color = '#0F1014'
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
            ;(e.currentTarget as HTMLButtonElement).style.color = '#C79E6B'
          }}
        >
          Try again
        </button>
      </body>
    </html>
  )
}
