'use client'

import { useActionState } from 'react'
import { login, type LoginState } from '@/actions/auth'

const initialState: LoginState = { error: null }

const fieldStyle: React.CSSProperties = {
  width: '100%',
  background: '#15171C',
  border: '1px solid rgba(199,158,107,0.2)',
  color: '#E9E3D6',
  fontFamily: "'Jost', sans-serif",
  fontSize: 14,
  padding: '12px 14px',
  borderRadius: 1,
  outline: 'none',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: "'Jost', sans-serif",
  fontSize: 10,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: '#8C877F',
  marginBottom: 6,
}

export function SignInForm({ locale }: { locale: string }) {
  const [state, action, pending] = useActionState(login, initialState)

  return (
    <form
      action={action}
      style={{
        width: 340,
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        background: '#0F1014',
        border: '1px solid rgba(199,158,107,0.18)',
        padding: '32px 28px',
        borderRadius: 2,
      }}
    >
      <input type="hidden" name="locale" value={locale} />

      {state.error && (
        <div
          style={{
            background: 'rgba(200,80,80,0.1)',
            border: '1px solid rgba(200,80,80,0.25)',
            color: '#E87777',
            fontFamily: "'Jost', sans-serif",
            fontSize: 13,
            padding: '10px 14px',
            borderRadius: 1,
          }}
        >
          {state.error}
        </div>
      )}

      <div>
        <label style={labelStyle}>Username</label>
        <input name="username" type="text" required autoComplete="username" style={fieldStyle} />
      </div>

      <div>
        <label style={labelStyle}>Password</label>
        <input name="password" type="password" required autoComplete="current-password" style={fieldStyle} />
      </div>

      <button
        type="submit"
        disabled={pending}
        style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: 11,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#0F1014',
          background: pending ? '#A67C3E' : '#C79E6B',
          border: 'none',
          padding: '13px 24px',
          cursor: pending ? 'not-allowed' : 'pointer',
          borderRadius: 1,
          marginTop: 8,
        }}
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
