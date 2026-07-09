export const dynamic = 'force-dynamic'

import { db } from '@/db'
import { pages } from '@/db/schema'
import { eq, and, or, isNull, asc } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { languageAlternates, localePath } from '@/lib/seo'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

// Geeft de vertaling voor `locale` terug als die bestaat, anders de
// taal-onafhankelijke fallback-rij (locale = NULL). Er kunnen door de unieke
// (slug, locale)-constraint hoogstens deze twee rijen matchen.
async function getPage(slug: string, locale: string) {
  const [page] = await db
    .select()
    .from(pages)
    .where(and(eq(pages.slug, slug), eq(pages.published, true), or(eq(pages.locale, locale), isNull(pages.locale))))
    .orderBy(asc(pages.locale))
    .limit(1)
  return page ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params
  const page = await getPage(slug, locale)
  if (!page) return {}
  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || undefined,
    alternates: { canonical: localePath(locale, `/${slug}`), languages: languageAlternates(`/${slug}`) },
  }
}

export default async function CmsPage({ params }: Props) {
  const { slug, locale } = await params
  const page = await getPage(slug, locale)
  if (!page) notFound()

  return (
    <main style={{ background: '#0F1014', minHeight: '100vh', paddingTop: 120 }}>
      <article style={{ maxWidth: 820, margin: '0 auto', padding: '0 32px 96px' }}>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 400,
            color: '#E9E3D6',
            margin: '0 0 48px',
            lineHeight: 1.1,
          }}
        >
          {page.title}
        </h1>

        <div style={{ borderTop: '1px solid rgba(199,158,107,0.15)', marginBottom: 48 }} />

        <div className="prose prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{page.content ?? ''}</ReactMarkdown>
        </div>
      </article>
    </main>
  )
}
