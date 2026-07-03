'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { saveUser, deleteUser } from './actions'
import type { User } from '@/db/schema'

interface Props {
  user: User | null
  isSelf: boolean
}

const initialState = { success: false, error: null as string | null }

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: "'Jost', sans-serif",
  fontSize: 11,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: '#8C877F',
  marginBottom: 6,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#15171C',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#E9E3D6',
  fontFamily: "'Jost', sans-serif",
  fontSize: 14,
  padding: '10px 14px',
  outline: 'none',
  borderRadius: 1,
  boxSizing: 'border-box',
}

export function UserEditor({ user, isSelf }: Props) {
  const [state, action, pending] = useActionState(saveUser, initialState)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const router = useRouter()

  async function handleDelete() {
    if (!user) return
    if (!confirm(`Delete user "${user.name}"? This cannot be undone.`)) return
    setDeleting(true)
    const result = await deleteUser(user.id)
    if (result.error) {
      setDeleteError(result.error)
      setDeleting(false)
    } else {
      router.push('/admin/gebruikers')
    }
  }

  return (
    <div style={{ maxWidth: 520 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 400, color: '#E9E3D6', margin: 0 }}>
          {user ? user.name : 'New user'}
        </h1>
        {user && !isSelf && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 11,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#E87777',
              background: 'rgba(200,80,80,0.08)',
              border: '1px solid rgba(200,80,80,0.2)',
              padding: '8px 16px',
              cursor: 'pointer',
              borderRadius: 1,
              flexShrink: 0,
            }}
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        )}
      </div>

      {state.error && (
        <div style={{ background: 'rgba(200,80,80,0.1)', border: '1px solid rgba(200,80,80,0.25)', color: '#E87777', fontFamily: "'Jost', sans-serif", fontSize: 13, padding: '10px 14px', marginBottom: 20, borderRadius: 1 }}>
          {state.error}
        </div>
      )}
      {deleteError && (
        <div style={{ background: 'rgba(200,80,80,0.1)', border: '1px solid rgba(200,80,80,0.25)', color: '#E87777', fontFamily: "'Jost', sans-serif", fontSize: 13, padding: '10px 14px', marginBottom: 20, borderRadius: 1 }}>
          {deleteError}
        </div>
      )}
      {isSelf && (
        <div style={{ background: 'rgba(199,158,107,0.08)', border: '1px solid rgba(199,158,107,0.2)', color: '#C79E6B', fontFamily: "'Jost', sans-serif", fontSize: 12, padding: '10px 14px', marginBottom: 20, borderRadius: 1 }}>
          This is your own account — your role can&apos;t be changed here.
        </div>
      )}

      <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {user && <input type="hidden" name="id" value={user.id} />}

        <div>
          <label style={labelStyle}>Username *</label>
          <input
            name="username"
            type="text"
            required
            defaultValue={user?.clerkId ?? ''}
            disabled={!!user}
            style={{ ...inputStyle, opacity: user ? 0.6 : 1 }}
            placeholder="e.g. janedoe"
          />
        </div>

        <div>
          <label style={labelStyle}>Full name *</label>
          <input name="name" type="text" required defaultValue={user?.name ?? ''} style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Role</label>
          <select
            name="role"
            defaultValue={user?.role ?? 'admin'}
            disabled={isSelf}
            style={{ ...inputStyle, appearance: 'none', cursor: isSelf ? 'not-allowed' : 'pointer', opacity: isSelf ? 0.6 : 1 }}
          >
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>
            {user ? 'New password' : 'Password *'}{' '}
            <span style={{ color: '#5E5A53', textTransform: 'none', letterSpacing: 0 }}>
              {user ? '(leave blank to keep current)' : '(min. 8 characters)'}
            </span>
          </label>
          <input name="password" type="password" autoComplete="new-password" style={inputStyle} />
        </div>

        <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
          <button
            type="submit"
            disabled={pending}
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#0F1014',
              background: pending ? '#A67C3E' : '#C79E6B',
              border: 'none',
              padding: '12px 28px',
              cursor: pending ? 'not-allowed' : 'pointer',
              borderRadius: 1,
            }}
          >
            {pending ? 'Saving…' : 'Save'}
          </button>
          <Link
            href="/admin/gebruikers"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#8C877F',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '12px 24px',
              textDecoration: 'none',
              borderRadius: 1,
            }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
