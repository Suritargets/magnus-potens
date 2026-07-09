export const dynamic = 'force-dynamic'

import { db } from '@/db'
import { blogPosts } from '@/db/schema'
import { eq, and, lte } from 'drizzle-orm'
import { getLocale, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/blog-categories'
import { localePath, ogLocale } from '@/lib/seo'
import type { Locale } from '@/lib/i18n'

interface Props {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string) {
  const [post] = await db
    .select()
    .from(blogPosts)
    .where(and(
      eq(blogPosts.slug, slug),
      eq(blogPosts.status, 'published'),
      lte(blogPosts.publishedAt, new Date()),
    ))
    .limit(1)
  return post ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: localePath(post.locale, `/blog/${post.slug}`) },
    openGraph: {
      type: 'article',
      siteName: 'Magnus & Potens',
      locale: ogLocale(post.locale as Locale),
      title: post.title,
      description: post.excerpt ?? undefined,
      url: localePath(post.locale, `/blog/${post.slug}`),
      publishedTime: post.publishedAt?.toISOString(),
      // Zelfde val als de homepage: deze openGraph-override vervangt het
      // geheel (geen deep-merge), dus zonder expliciete fallback verliest
      // een post zonder eigen cover-afbeelding zijn og:image helemaal.
      images: post.coverImage
        ? [post.coverImage]
        : [`${process.env.NEXT_PUBLIC_APP_URL ?? 'https://magnus-potens.com'}/opengraph-image.png`],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const locale = await getLocale()
  const t = await getTranslations('blog')

  const post = await getPost(slug)
  if (!post) notFound()

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.coverImage ?? undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { '@type': 'Organization', name: 'Magnus & Potens' },
    publisher: { '@type': 'Organization', name: 'Magnus & Potens' },
    mainEntityOfPage: localePath(post.locale, `/blog/${post.slug}`),
  }

  const date = post.publishedAt
    ? new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(post.publishedAt))
    : null

  return (
    <main style={{ background: '#0F1014', minHeight: '100vh', paddingTop: 120 }}>
      <script
        type="application/ld+json"
        // Escape "<" zodat een titel/excerpt met een letterlijke "</script>"
        // de tag niet kan afsluiten — de payload zelf is JSON, geen HTML.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, '\\u003c') }}
      />
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: "'Jost', sans-serif", fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase',
              color: CATEGORY_COLORS[post.category] ?? '#C79E6B',
              border: `1px solid ${CATEGORY_COLORS[post.category] ?? '#C79E6B'}`,
              padding: '3px 9px', borderRadius: 1,
            }}
          >
            {CATEGORY_LABELS[post.category] ?? post.category}
          </span>
          {date && (
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#C79E6B', margin: 0 }}>
              {t('published')} {date}
            </p>
          )}
        </div>
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
