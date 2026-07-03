import { db } from '@/db'
import { pages, type Page } from '@/db/schema'
import { desc } from 'drizzle-orm'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

interface PageGroup {
  slug: string
  title: string
  locales: string[]
  anyPublished: boolean
  updatedAt: Date
}

function groupBySlug(rows: Page[]): PageGroup[] {
  const bySlug = new Map<string, Page[]>()
  for (const row of rows) {
    bySlug.set(row.slug, [...(bySlug.get(row.slug) ?? []), row])
  }

  return Array.from(bySlug.entries())
    .map(([slug, variants]) => {
      const fallback = variants.find((v) => v.locale === null)
      return {
        slug,
        title: (fallback ?? variants[0]).title,
        locales: variants.map((v) => v.locale ?? 'ALL'),
        anyPublished: variants.some((v) => v.published),
        updatedAt: variants.reduce((latest, v) => (v.updatedAt > latest ? v.updatedAt : latest), variants[0].updatedAt),
      }
    })
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
}

export default async function CmsPage() {
  const allPages = await db
    .select()
    .from(pages)
    .orderBy(desc(pages.updatedAt))

  const groups = groupBySlug(allPages)

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
            {groups.length} page{groups.length !== 1 ? 's' : ''}
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

      {groups.length === 0 ? (
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
          {groups.map((group, i) => (
            <div
              key={group.slug}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderBottom: i < groups.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                gap: 12,
              }}
            >
              <div>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: '#E9E3D6', margin: '0 0 2px' }}>
                  {group.title}
                </p>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: '#6E6A63', margin: 0 }}>
                  /{group.slug}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#4E4B46' }}>
                  {group.locales.join(', ')}
                </span>
                <span
                  style={{
                    background: group.anyPublished ? 'rgba(80,160,80,0.12)' : 'rgba(255,255,255,0.06)',
                    color: group.anyPublished ? '#7FC97F' : '#6E6A63',
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 9,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    padding: '3px 8px',
                    borderRadius: 1,
                  }}
                >
                  {group.anyPublished ? 'Published' : 'Draft'}
                </span>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: '#4E4B46', margin: 0 }}>
                  {formatDate(group.updatedAt)}
                </p>
                <Link
                  href={`/admin/cms/${group.slug}`}
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
