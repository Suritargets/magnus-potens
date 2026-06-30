'use server'

import { db } from '@/db'
import { blogPosts } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { requireRole } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

type SavePostState = { success: boolean; error: string | null }

export async function saveBlogPost(
  _prev: SavePostState,
  formData: FormData
): Promise<SavePostState> {
  try {
    const user = await requireRole('admin', 'super_admin')

    const id = (formData.get('id') as string | null) || undefined
    const title = (formData.get('title') as string)?.trim()
    const slug = (formData.get('slug') as string)?.trim()
    const content = (formData.get('content') as string) ?? ''
    const excerpt = (formData.get('excerpt') as string)?.trim() || undefined
    const coverImage = (formData.get('coverImage') as string)?.trim() || undefined
    const tags = (formData.get('tags') as string)?.trim() || undefined
    const locale = (formData.get('locale') as string) || 'en'
    const status = (formData.get('status') as 'draft' | 'published' | 'archived') || 'draft'

    if (!title) return { success: false, error: 'Title is required.' }
    if (!slug) return { success: false, error: 'Slug is required.' }
    if (!/^[a-z0-9-]+$/.test(slug)) return { success: false, error: 'Slug may only contain lowercase letters, numbers, and hyphens.' }
    if (!content) return { success: false, error: 'Content is required.' }

    const now = new Date()
    const publishedAt = status === 'published' ? now : undefined

    if (id) {
      await db
        .update(blogPosts)
        .set({ title, slug, content, excerpt, coverImage, tags, locale, status, publishedAt, updatedAt: now })
        .where(eq(blogPosts.id, id))
    } else {
      await db.insert(blogPosts).values({
        title, slug, content, excerpt, coverImage, tags, locale, status,
        publishedAt: publishedAt ?? null,
        authorId: user.id,
      })
    }

    revalidatePath('/admin/blog')
    revalidatePath('/blog')
    revalidatePath(`/blog/${slug}`)

    return { success: true, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { success: false, error: message }
  }
}

export async function deleteBlogPost(id: string): Promise<void> {
  await requireRole('admin', 'super_admin')
  await db.delete(blogPosts).where(eq(blogPosts.id, id))
  revalidatePath('/admin/blog')
  revalidatePath('/blog')
}
