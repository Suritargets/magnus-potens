'use server'

import { db } from '@/db'
import { blogPosts } from '@/db/schema'
import { eq, and, ne } from 'drizzle-orm'
import { requireRole } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { locales } from '@/lib/i18n'

type SaveState = { success: boolean; error: string | null; groupId?: string }

export async function saveBlogPostVariant(
  _prev: SaveState,
  formData: FormData
): Promise<SaveState> {
  try {
    const user = await requireRole('admin', 'super_admin')

    const groupIdRaw = (formData.get('groupId') as string) || ''
    const locale = formData.get('locale') as string
    const title = (formData.get('title') as string)?.trim()
    const slug = (formData.get('slug') as string)?.trim()
    const content = (formData.get('content') as string) ?? ''
    const excerpt = (formData.get('excerpt') as string)?.trim() || undefined
    const coverImage = (formData.get('coverImage') as string)?.trim() || undefined
    const tags = (formData.get('tags') as string)?.trim() || undefined
    const category = (formData.get('category') as 'news' | 'event' | 'use_case') || 'news'
    const status = (formData.get('status') as 'draft' | 'published' | 'archived') || 'draft'
    const publishedAtRaw = (formData.get('publishedAt') as string)?.trim()

    if (!title) return { success: false, error: 'Title is required.' }
    if (!slug) return { success: false, error: 'Slug is required.' }
    if (!/^[a-z0-9-]+$/.test(slug)) return { success: false, error: 'Slug may only contain lowercase letters, numbers, and hyphens.' }
    if (!content) return { success: false, error: 'Content is required.' }
    if (!(locales as readonly string[]).includes(locale)) return { success: false, error: 'Invalid language.' }

    const now = new Date()
    let publishedAt: Date | undefined
    if (publishedAtRaw) {
      const parsed = new Date(publishedAtRaw)
      if (isNaN(parsed.getTime())) return { success: false, error: 'Invalid publish date.' }
      publishedAt = parsed
    } else if (status === 'published') {
      publishedAt = now
    }

    const groupId = groupIdRaw || crypto.randomUUID()

    const [existing] = await db
      .select({ id: blogPosts.id })
      .from(blogPosts)
      .where(and(eq(blogPosts.translationGroupId, groupId), eq(blogPosts.locale, locale)))
      .limit(1)

    // Slug is globally uniek over alle artikelen/talen heen — controleer los
    // van de (group, locale)-match, met uitzondering van de rij die we zelf bewerken.
    const [slugConflict] = await db
      .select({ id: blogPosts.id })
      .from(blogPosts)
      .where(existing ? and(eq(blogPosts.slug, slug), ne(blogPosts.id, existing.id)) : eq(blogPosts.slug, slug))
      .limit(1)
    if (slugConflict) return { success: false, error: 'That slug is already used by another post.' }

    if (existing) {
      await db
        .update(blogPosts)
        .set({ title, slug, content, excerpt, coverImage, tags, category, status, publishedAt, updatedAt: now })
        .where(eq(blogPosts.id, existing.id))
    } else {
      await db.insert(blogPosts).values({
        title, slug, content, excerpt, coverImage, tags, locale, category, status,
        publishedAt: publishedAt ?? null,
        translationGroupId: groupId,
        authorId: user.id,
      })
    }

    revalidatePath('/admin/blog')
    revalidatePath(`/${locale}/blog`)
    revalidatePath(`/${locale}/blog/${slug}`)

    return { success: true, error: null, groupId }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { success: false, error: message }
  }
}

export async function deleteBlogPostVariant(id: string): Promise<{ error: string | null }> {
  await requireRole('admin', 'super_admin')

  const [post] = await db.select({ slug: blogPosts.slug, locale: blogPosts.locale }).from(blogPosts).where(eq(blogPosts.id, id)).limit(1)
  await db.delete(blogPosts).where(eq(blogPosts.id, id))

  revalidatePath('/admin/blog')
  if (post) {
    revalidatePath(`/${post.locale}/blog`)
    revalidatePath(`/${post.locale}/blog/${post.slug}`)
  }

  return { error: null }
}
