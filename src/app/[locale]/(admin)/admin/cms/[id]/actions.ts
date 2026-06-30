'use server'

import { db } from '@/db'
import { pages } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { requireRole } from '@/lib/auth'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const pageSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required').max(200),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers and hyphens'),
  content: z.string().optional(),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
  published: z.boolean().optional(),
})

type SavePageState = { success: boolean; error: string | null }

export async function savePage(
  _prev: SavePageState,
  formData: FormData
): Promise<SavePageState> {
  try {
    const user = await requireRole('admin', 'super_admin')

    const raw = {
      id: (formData.get('id') as string | undefined) || undefined,
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      content: formData.get('content') as string,
      metaTitle: formData.get('metaTitle') as string,
      metaDescription: formData.get('metaDescription') as string,
      published: formData.get('published') === 'true',
    }

    const parsed = pageSchema.safeParse(raw)
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]
      return { success: false, error: firstError.message }
    }

    const { id, ...data } = parsed.data

    if (id) {
      await db
        .update(pages)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(pages.id, id))
    } else {
      await db.insert(pages).values({
        ...data,
        createdBy: user.id,
      })
    }

    revalidatePath('/admin/cms')
    revalidatePath(`/${data.slug}`)

    return { success: true, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { success: false, error: message }
  }
}
