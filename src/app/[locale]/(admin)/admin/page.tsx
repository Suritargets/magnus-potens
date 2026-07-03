import { db } from '@/db'
import { contactSubmissions, errorLogs, users, blogPosts, appointments } from '@/db/schema'
import { eq, count, and, gte } from 'drizzle-orm'
import Link from 'next/link'

export default async function AdminDashboard() {
  const today = new Date().toISOString().slice(0, 10)

  const [
    [totalUsers],
    [newMessages],
    [unresolvedErrors],
    [publishedPosts],
    [upcomingAppts],
  ] = await Promise.all([
    db.select({ count: count() }).from(users),
    db.select({ count: count() }).from(contactSubmissions).where(eq(contactSubmissions.status, 'new')),
    db.select({ count: count() }).from(errorLogs).where(eq(errorLogs.resolved, false)),
    db.select({ count: count() }).from(blogPosts).where(eq(blogPosts.status, 'published')),
    db.select({ count: count() }).from(appointments).where(
      and(eq(appointments.status, 'pending'), gte(appointments.date, today))
    ),
  ])

  const stats = [
    {
      label: 'New enquiries',
      value: newMessages.count,
      icon: '✉',
      href: '/admin/berichten',
      accent: newMessages.count > 0,
    },
    {
      label: 'Upcoming appointments',
      value: upcomingAppts.count,
      icon: '◷',
      href: '/admin/afspraken',
      accent: upcomingAppts.count > 0,
    },
    {
      label: 'Published posts',
      value: publishedPosts.count,
      icon: '◧',
      href: '/admin/blog',
      accent: false,
    },
    {
      label: 'Registered users',
      value: totalUsers.count,
      icon: '⊹',
      href: '/admin/gebruikers',
      accent: false,
    },
    {
      label: 'Unresolved errors',
      value: unresolvedErrors.count,
      icon: '△',
      href: '/admin/fouten',
      accent: unresolvedErrors.count > 0,
    },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 28,
            fontWeight: 400,
            color: '#E9E3D6',
            margin: '0 0 6px',
            letterSpacing: '0.02em',
          }}
        >
          Dashboard
        </h1>
        <p
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 13,
            color: '#6E6A63',
            margin: 0,
          }}
        >
          Magnus &amp; Potens — internal control panel
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            style={{
              display: 'block',
              background: '#15171C',
              border: `1px solid ${stat.accent ? 'rgba(199,158,107,0.4)' : 'rgba(255,255,255,0.06)'}`,
              borderRadius: 2,
              padding: '20px 22px',
              textDecoration: 'none',
            }}
          >
            <div style={{ fontSize: 18, color: '#C79E6B', marginBottom: 12 }}>{stat.icon}</div>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 38,
                fontWeight: 400,
                color: stat.accent ? '#C79E6B' : '#E9E3D6',
                margin: '0 0 4px',
                lineHeight: 1,
              }}
            >
              {stat.value}
            </p>
            <p
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 11,
                letterSpacing: '0.14em',
                color: '#6E6A63',
                margin: 0,
                textTransform: 'uppercase',
              }}
            >
              {stat.label}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div
        style={{
          marginTop: 32,
          background: '#15171C',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 2,
          padding: '18px 22px',
        }}
      >
        <p
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 11,
            letterSpacing: '0.24em',
            color: '#C79E6B',
            textTransform: 'uppercase',
            margin: '0 0 12px',
          }}
        >
          Quick links
        </p>
        <ul
          style={{
            margin: 0,
            padding: 0,
            listStyle: 'none',
            fontFamily: "'Jost', sans-serif",
            fontSize: 13,
            color: '#8C877F',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <li>→ <Link href="/admin/berichten" style={{ color: '#C79E6B', textDecoration: 'none' }}>Enquiries</Link> — review and respond to contact form submissions</li>
          <li>→ <Link href="/admin/homepage" style={{ color: '#C79E6B', textDecoration: 'none' }}>Homepage</Link> — edit the public homepage text, per language</li>
          <li>→ <Link href="/admin/blog" style={{ color: '#C79E6B', textDecoration: 'none' }}>Blog</Link> — create and publish insights</li>
          <li>→ <Link href="/admin/afspraken" style={{ color: '#C79E6B', textDecoration: 'none' }}>Afspraken</Link> — review and confirm consultation requests</li>
          <li>→ <Link href="/admin/afspraken/beschikbaarheid" style={{ color: '#C79E6B', textDecoration: 'none' }}>Beschikbaarheid</Link> — configure available days and times</li>
          <li>→ <Link href="/admin/media" style={{ color: '#C79E6B', textDecoration: 'none' }}>Media</Link> — upload and manage images</li>
          <li>→ <Link href="/admin/cms" style={{ color: '#C79E6B', textDecoration: 'none' }}>CMS Pages</Link> — edit and publish page content</li>
          <li>→ <Link href="/admin/fouten" style={{ color: '#C79E6B', textDecoration: 'none' }}>Error logs</Link> — monitor client-side error reports</li>
        </ul>
      </div>
    </div>
  )
}
