import { db } from '@/db'
import { blogPosts, type BlogPost } from '@/db/schema'
import { desc } from 'drizzle-orm'
import Link from 'next/link'
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/blog-categories'

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  published: { bg: 'rgba(80,160,80,0.12)', color: '#7FC97F' },
  scheduled: { bg: 'rgba(199,158,107,0.14)', color: '#C79E6B' },
  draft:     { bg: 'rgba(255,255,255,0.06)', color: '#6E6A63' },
  archived:  { bg: 'rgba(199,158,107,0.1)', color: '#C79E6B' },
}

interface ArticleGroup {
  groupId: string
  title: string
  category: string
  locales: string[]
  status: string
  isScheduled: boolean
  dateLabel: string | null
  updatedAt: Date
}

function groupByArticle(rows: BlogPost[]): ArticleGroup[] {
  const byGroup = new Map<string, BlogPost[]>()
  for (const row of rows) {
    const key = row.translationGroupId ?? row.id
    byGroup.set(key, [...(byGroup.get(key) ?? []), row])
  }

  return Array.from(byGroup.entries())
    .map(([groupId, variants]) => {
      const primary = variants.find((v) => v.locale === 'en') ?? variants[0]
      const isScheduled = primary.status === 'published' && !!primary.publishedAt && new Date(primary.publishedAt) > new Date()
      const dateLabel = primary.publishedAt
        ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(primary.publishedAt))
        : null
      return {
        groupId,
        title: primary.title,
        category: primary.category,
        locales: variants.map((v) => v.locale),
        status: primary.status,
        isScheduled,
        dateLabel,
        updatedAt: variants.reduce((latest, v) => (v.updatedAt > latest ? v.updatedAt : latest), variants[0].updatedAt),
      }
    })
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
}

export default async function BlogAdminPage() {
  const posts = await db
    .select()
    .from(blogPosts)
    .orderBy(desc(blogPosts.updatedAt))

  const groups = groupByArticle(posts)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 400, color: '#E9E3D6', margin: '0 0 4px' }}>
            Blog
          </h1>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: '#6E6A63', margin: 0 }}>
            {groups.length} article{groups.length !== 1 ? 's' : ''} · {posts.length} translation{posts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/blog/nieuw"
          style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#0F1014', background: '#C79E6B', padding: '10px 20px', textDecoration: 'none', borderRadius: 1, whiteSpace: 'nowrap' }}
        >
          + New post
        </Link>
      </div>

      {groups.length === 0 ? (
        <div style={{ background: '#15171C', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2, padding: '48px 24px', textAlign: 'center' }}>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, color: '#E9E3D6', margin: '0 0 8px' }}>
            No posts yet.
          </p>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: '#6E6A63', margin: 0 }}>
            Click &quot;+ New post&quot; to create the first blog entry.
          </p>
        </div>
      ) : (
        <div style={{ background: '#15171C', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
          {groups.map((group, i) => {
            const s = STATUS_STYLES[group.isScheduled ? 'scheduled' : group.status] ?? STATUS_STYLES.draft
            return (
              <div
                key={group.groupId}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: i < groups.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', gap: 12 }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: '#E9E3D6', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {group.title}
                  </p>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: '#6E6A63', margin: 0, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ textTransform: 'uppercase', fontSize: 9, letterSpacing: '0.1em', color: '#4E4B46' }}>
                      {group.locales.join(', ')}
                    </span>
                    <span style={{ color: CATEGORY_COLORS[group.category] ?? '#4E4B46', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      {CATEGORY_LABELS[group.category] ?? group.category}
                    </span>
                    {group.dateLabel && (
                      <span style={{ fontSize: 11, color: '#5E5A53' }}>
                        {group.isScheduled ? 'Scheduled for' : 'Published'} {group.dateLabel}
                      </span>
                    )}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
                  <span style={{ background: s.bg, color: s.color, fontFamily: "'Jost', sans-serif", fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 1 }}>
                    {group.isScheduled ? 'scheduled' : group.status}
                  </span>
                  <Link
                    href={`/admin/blog/${group.groupId}`}
                    style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.1em', color: '#C79E6B', textDecoration: 'none' }}
                  >
                    Edit →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
