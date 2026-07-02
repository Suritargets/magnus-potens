export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'

const adminNav = [
  { href: '/admin',                         label: 'Dashboard',      icon: '◈' },
  { href: '/admin/berichten',               label: 'Enquiries',      icon: '✉' },
  { href: '/admin/blog',                    label: 'Blog',           icon: '◧' },
  { href: '/admin/afspraken',               label: 'Afspraken',      icon: '◷' },
  { href: '/admin/media',                   label: 'Media',          icon: '⊡' },
  { href: '/admin/gebruikers',              label: 'Users',          icon: '⊹' },
  { href: '/admin/cms',                     label: 'CMS Pages',      icon: '◻' },
  { href: '/admin/fouten',                  label: 'Error logs',     icon: '△' },
]

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const user = await getCurrentUser()

  if (!user) redirect(`/${locale}/sign-in`)
  if (user.role !== 'admin' && user.role !== 'super_admin') redirect(`/${locale}`)

  return (
    <div
      className="flex min-h-screen"
      style={{ background: '#0F1014', color: '#E9E3D6' }}
    >
      {/* Sidebar */}
      <aside
        className="w-56 shrink-0 flex flex-col p-5"
        style={{
          background: '#15171C',
          borderRight: '1px solid rgba(199,158,107,0.14)',
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: 32, paddingBottom: 20, borderBottom: '1px solid rgba(199,158,107,0.14)' }}>
          <p
            style={{
              fontFamily: "'Marcellus', Georgia, serif",
              fontSize: 13,
              letterSpacing: '0.22em',
              color: '#E9E3D6',
              margin: '0 0 3px',
            }}
          >
            MAGNUS &amp; POTENS
          </p>
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 8,
              letterSpacing: '0.38em',
              color: '#C79E6B',
              margin: 0,
            }}
          >
            ADMIN
          </p>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1">
          {adminNav.map((link) => (
            <Link
              key={link.href}
              href={`/${locale}${link.href}`}
              className="flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors hover:bg-white/5"
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 13,
                letterSpacing: '0.04em',
                color: '#A7A29A',
                textDecoration: 'none',
              }}
            >
              <span style={{ color: '#C79E6B', fontSize: 12, width: 14 }}>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ paddingTop: 16, borderTop: '1px solid rgba(199,158,107,0.1)' }}>
          <Link
            href={`/${locale}`}
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 11,
              letterSpacing: '0.12em',
              color: '#6E6A63',
              textDecoration: 'none',
            }}
          >
            ← Back to site
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  )
}
