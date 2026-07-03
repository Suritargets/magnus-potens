import { db } from '@/db'
import { users } from '@/db/schema'
import { desc } from 'drizzle-orm'
import { formatDate } from '@/lib/utils'
import { requireRole, getCurrentUser } from '@/lib/auth'
import Link from 'next/link'

const roleStyle: Record<string, { bg: string; color: string }> = {
  super_admin: { bg: 'rgba(180,120,220,0.14)', color: '#C79EDB' },
  admin:       { bg: 'rgba(199,158,107,0.14)', color: '#C79E6B' },
  user:        { bg: 'rgba(255,255,255,0.06)', color: '#8C877F' },
}

export default async function GebruikersPage() {
  await requireRole('admin', 'super_admin')
  const current = await getCurrentUser()
  const isSuperAdmin = current?.role === 'super_admin'

  const allUsers = await db
    .select()
    .from(users)
    .orderBy(desc(users.createdAt))

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, gap: 16 }}>
        <div>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 28,
              fontWeight: 400,
              color: '#E9E3D6',
              margin: '0 0 4px',
            }}
          >
            Users
          </h1>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: '#6E6A63', margin: 0 }}>
            {allUsers.length} registered
          </p>
        </div>
        {isSuperAdmin && (
          <Link
            href="/admin/gebruikers/nieuw"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 11,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#0F1014',
              background: '#C79E6B',
              padding: '10px 20px',
              textDecoration: 'none',
              borderRadius: 1,
              whiteSpace: 'nowrap',
            }}
          >
            + New user
          </Link>
        )}
      </div>

      <div
        style={{
          background: '#15171C',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Name', 'Email', 'Role', 'Registered', ''].map((h) => (
                <th
                  key={h}
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 10,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: '#6E6A63',
                    fontWeight: 400,
                    padding: '12px 16px',
                    textAlign: 'left',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allUsers.map((u) => {
              const rs = roleStyle[u.role] ?? roleStyle.user
              return (
                <tr
                  key={u.id}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <td style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: '#E9E3D6', padding: '11px 16px' }}>
                    {u.name ?? '—'}
                  </td>
                  <td style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: '#8C877F', padding: '11px 16px' }}>
                    {u.email}
                  </td>
                  <td style={{ padding: '11px 16px' }}>
                    <span
                      style={{
                        background: rs.bg,
                        color: rs.color,
                        fontFamily: "'Jost', sans-serif",
                        fontSize: 9,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        padding: '3px 8px',
                        borderRadius: 1,
                      }}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: '#6E6A63', padding: '11px 16px' }}>
                    {formatDate(u.createdAt)}
                  </td>
                  <td style={{ padding: '11px 16px', textAlign: 'right' }}>
                    {isSuperAdmin && (
                      <Link
                        href={`/admin/gebruikers/${u.id}`}
                        style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.1em', color: '#C79E6B', textDecoration: 'none' }}
                      >
                        Edit →
                      </Link>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {allUsers.length === 0 && (
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 13,
              color: '#6E6A63',
              textAlign: 'center',
              padding: '40px 24px',
              margin: 0,
            }}
          >
            No users registered yet.
          </p>
        )}
      </div>
    </div>
  )
}
