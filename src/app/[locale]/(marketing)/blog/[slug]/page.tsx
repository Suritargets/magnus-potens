export const dynamic = 'force-dynamic'

import { db } from '@/db'
import { blogPosts } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { getLocale, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const locale = await getLocale()
  const t = await getTranslations('blog')

  const [post] = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.slug, slug), eq(blogPosts.status, 'published')))
    .limit(1)

  if (!post) notFound()

  const date = post.publishedAt
    ? new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(post.publishedAt))
    : null

  return (
    <main style={{ background: '#0F1014', minHeight: '100vh', paddingTop: 120 }}>
      {/* Back link */}
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '0 32px 40px' }}>
        <Link
          href={`/${locale}/blog`}
          style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C79E6B', textDecoration: 'none' }}
        >
          {t('back')}
        </Link>
      </div>

      {/* Article header */}
      <article style={{ maxWidth: 820, margin: '0 auto', padding: '0 32px 96px' }}>
        {date && (
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#C79E6B', margin: '0 0 16px' }}>
            {t('published')} {date}
          </p>
        )}
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 400, color: '#E9E3D6', margin: '0 0 24px', lineHeight: 1.1 }}>
          {post.title}
        </h1>
        {post.excerpt && (
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 16, lineHeight: 1.85, color: '#8C877F', margin: '0 0 40px', maxWidth: 680 }}>
            {post.excerpt}
          </p>
        )}

        {/* Cover image */}
        {post.coverImage && (
          <div style={{ position: 'relative', aspectRatio: '16/7', marginBottom: 56, overflow: 'hidden' }}>
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 820px) 100vw, 820px"
            />
          </div>
        )}

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(199,158,107,0.15)', marginBottom: 48 }} />

        {/* Markdown body */}
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>
      </article>
    </main>
  )
}
