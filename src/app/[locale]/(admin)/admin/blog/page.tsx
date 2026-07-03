import { db } from '@/db'
import { blogPosts } from '@/db/schema'
import { desc } from 'drizzle-orm'
import Link from 'next/link'
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/blog-categories'

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  published: { bg: 'rgba(80,160,80,0.12)', color: '#7FC97F' },
  scheduled: { bg: 'rgba(199,158,107,0.14)', color: '#C79E6B' },
  draft:     { bg: 'rgba(255,255,255,0.06)', color: '#6E6A63' },
  archived:  { bg: 'rgba(199,158,107,0.1)', color: '#C79E6B' },
}

export default async function BlogAdminPage() {
  const posts = await db
    .select()
    .from(blogPosts)
    .orderBy(desc(blogPosts.updatedAt))

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 400, color: '#E9E3D6', margin: '0 0 4px' }}>
            Blog
          </h1>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: '#6E6A63', margin: 0 }}>
            {posts.length} post{posts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/blog/nieuw"
          style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#0F1014', background: '#C79E6B', padding: '10px 20px', textDecoration: 'none', borderRadius: 1, whiteSpace: 'nowrap' }}
        >
          + New post
        </Link>
      </div>

      {posts.length === 0 ? (
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
          {posts.map((post, i) => {
            const isScheduled = post.status === 'published' && !!post.publishedAt && new Date(post.publishedAt) > new Date()
            const s = STATUS_STYLES[isScheduled ? 'scheduled' : post.status] ?? STATUS_STYLES.draft
            const dateLabel = post.publishedAt
              ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(post.publishedAt))
              : null
            return (
              <div
                key={post.id}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: i < posts.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', gap: 12 }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: '#E9E3D6', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {post.title}
                  </p>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: '#6E6A63', margin: 0, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span>/{post.slug}</span>
                    <span style={{ textTransform: 'uppercase', fontSize: 9, letterSpacing: '0.1em', color: '#4E4B46' }}>{post.locale}</span>
                    <span style={{ color: CATEGORY_COLORS[post.category] ?? '#4E4B46', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      {CATEGORY_LABELS[post.category] ?? post.category}
                    </span>
                    {dateLabel && (
                      <span style={{ fontSize: 11, color: '#5E5A53' }}>
                        {isScheduled ? 'Scheduled for' : 'Published'} {dateLabel}
                      </span>
                    )}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
                  <span style={{ background: s.bg, color: s.color, fontFamily: "'Jost', sans-serif", fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 1 }}>
                    {isScheduled ? 'scheduled' : post.status}
                  </span>
                  <Link
                    href={`/admin/blog/${post.id}`}
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
