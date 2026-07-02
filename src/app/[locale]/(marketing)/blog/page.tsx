export const dynamic = 'force-dynamic'

import { db } from '@/db'
import { blogPosts } from '@/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { getLocale, getTranslations } from 'next-intl/server'
import { BlogCard } from '@/components/sections/BlogCard'
import { Reveal } from '@/components/motion/Reveal'
import { Stagger, StaggerItem } from '@/components/motion/Stagger'

export default async function BlogPage() {
  const locale = await getLocale()
  const t = await getTranslations('blog')

  let posts: typeof blogPosts.$inferSelect[] = []
  try {
    posts = await db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.status, 'published'), eq(blogPosts.locale, locale)))
      .orderBy(desc(blogPosts.publishedAt))
  } catch {
    // DB not configured yet — show empty state
  }

  return (
    <main style={{ background: '#0F1014', minHeight: '100vh', paddingTop: 120 }}>
      {/* Hero band */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '0 32px 72px' }}>
        <Reveal>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.42em', textTransform: 'uppercase', color: '#C79E6B', margin: '0 0 16px' }}>
            {t('label')}
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(38px, 6vw, 64px)', fontWeight: 400, color: '#E9E3D6', margin: '0 0 20px', lineHeight: 1.05 }}>
            {t('headline')}
          </h1>
        </Reveal>
        <Reveal delay={0.22}>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 15, lineHeight: 1.85, color: '#8C877F', maxWidth: 540, margin: 0 }}>
            {t('subtitle')}
          </p>
        </Reveal>
      </section>

      {/* Divider */}
      <div style={{ borderTop: '1px solid rgba(199,158,107,0.15)', margin: '0 32px' }} />

      {/* Grid */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 32px' }}>
        {posts.length === 0 ? (
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, color: '#5E5A53', textAlign: 'center' }}>
            {t('no_posts')}
          </p>
        ) : (
          <Stagger
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 32,
            }}
          >
            {posts.map((post) => (
              <StaggerItem key={post.id}>
                <BlogCard
                  post={post}
                  locale={locale}
                  readMoreLabel={t('read_more')}
                  publishedLabel={t('published')}
                />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </section>
    </main>
  )
}
