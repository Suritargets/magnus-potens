import type { MetadataRoute } from 'next'
import { db } from '@/db'
import { blogPosts, pages } from '@/db/schema'
import { eq, and, lte } from 'drizzle-orm'
import { locales } from '@/lib/i18n'
import { localePath, languageAlternates } from '@/lib/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []

  // Statische routes per taal (homepage, blog-overzicht, consultatie).
  const staticPaths = ['', '/blog', '/consultation']
  for (const path of staticPaths) {
    for (const locale of locales) {
      entries.push({
        url: localePath(locale, path),
        lastModified: now,
        changeFrequency: path === '' ? 'weekly' : 'daily',
        priority: path === '' ? 1 : 0.7,
        alternates: { languages: languageAlternates(path) },
      })
    }
  }

  // Practice-area detail pages (Dispute Resolution, Litigation, Corporate &
  // Commercial, Regulatory & Compliance, Strategic Advisory, Digital
  // Transformation) — same slugs across all 6 locales.
  const practiceSlugs = [
    'dispute-resolution',
    'litigation',
    'corporate-commercial',
    'regulatory-compliance',
    'strategic-advisory',
    'digital-transformation',
  ]
  for (const slug of practiceSlugs) {
    const path = `/practice/${slug}`
    for (const locale of locales) {
      entries.push({
        url: localePath(locale, path),
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: { languages: languageAlternates(path) },
      })
    }
  }

  // Gepubliceerde blogposts (elke post bestaat maar in één taal).
  const posts = await db
    .select({ slug: blogPosts.slug, locale: blogPosts.locale, updatedAt: blogPosts.updatedAt })
    .from(blogPosts)
    .where(and(eq(blogPosts.status, 'published'), lte(blogPosts.publishedAt, now)))

  for (const post of posts) {
    entries.push({
      url: localePath(post.locale, `/blog/${post.slug}`),
      lastModified: post.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  }

  // Gepubliceerde CMS-pagina's (privacy, terms, ...) — per taal-variant of de
  // taal-onafhankelijke fallback (locale = NULL) voor elke taal die geen
  // eigen variant heeft.
  const cmsPages = await db
    .select({ slug: pages.slug, locale: pages.locale, updatedAt: pages.updatedAt })
    .from(pages)
    .where(eq(pages.published, true))

  const bySlug = new Map<string, typeof cmsPages>()
  for (const p of cmsPages) {
    bySlug.set(p.slug, [...(bySlug.get(p.slug) ?? []), p])
  }

  for (const [slug, variants] of bySlug) {
    const fallback = variants.find((v) => v.locale === null)
    for (const locale of locales) {
      const match = variants.find((v) => v.locale === locale) ?? fallback
      if (!match) continue
      entries.push({
        url: localePath(locale, `/${slug}`),
        lastModified: match.updatedAt,
        changeFrequency: 'yearly',
        priority: 0.4,
      })
    }
  }

  return entries
}
