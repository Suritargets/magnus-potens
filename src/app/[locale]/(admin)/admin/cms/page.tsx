import { db } from '@/db'
import { pages } from '@/db/schema'
import { desc } from 'drizzle-orm'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function CmsPage() {
  const allPages = await db
    .select()
    .from(pages)
    .orderBy(desc(pages.updatedAt))

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
            CMS Pages
          </h1>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: '#6E6A63', margin: 0 }}>
            {allPages.length} page{allPages.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/cms/nieuw"
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
          + New page
        </Link>
      </div>

      {allPages.length === 0 ? (
        <div
          style={{
            background: '#15171C',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 2,
            padding: '48px 24px',
            textAlign: 'center',
          }}
        >
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, color: '#E9E3D6', margin: '0 0 8px' }}>
            No pages yet.
          </p>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: '#6E6A63', margin: 0 }}>
            Click &quot;+ New page&quot; to create the first CMS entry.
          </p>
        </div>
      ) : (
        <div
          style={{
            background: '#15171C',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {allPages.map((page, i) => (
            <div
              key={page.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderBottom: i < allPages.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                gap: 12,
              }}
            >
              <div>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: '#E9E3D6', margin: '0 0 2px' }}>
                  {page.title}
                </p>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: '#6E6A63', margin: 0 }}>
                  /{page.slug}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                <span
                  style={{
                    background: page.published ? 'rgba(80,160,80,0.12)' : 'rgba(255,255,255,0.06)',
                    color: page.published ? '#7FC97F' : '#6E6A63',
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 9,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    padding: '3px 8px',
                    borderRadius: 1,
                  }}
                >
                  {page.published ? 'Published' : 'Draft'}
                </span>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: '#4E4B46', margin: 0 }}>
                  {formatDate(page.updatedAt)}
                </p>
                <Link
                  href={`/admin/cms/${page.id}`}
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 11,
                    letterSpacing: '0.1em',
                    color: '#C79E6B',
                    textDecoration: 'none',
                  }}
                >
                  Edit →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
