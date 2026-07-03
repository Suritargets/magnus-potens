'use server'

import { db } from '@/db'
import { pages } from '@/db/schema'
import { eq, and, isNull } from 'drizzle-orm'
import { requireRole } from '@/lib/auth'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { locales } from '@/lib/i18n'

const TAB_CODES = ['all', ...locales] as const

const variantSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers and hyphens'),
  tab: z.enum(TAB_CODES),
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().optional(),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
  published: z.boolean().optional(),
})

type SaveState = { success: boolean; error: string | null }

export async function saveCmsPageVariant(
  _prev: SaveState,
  formData: FormData
): Promise<SaveState> {
  try {
    const user = await requireRole('admin', 'super_admin')

    const raw = {
      slug: formData.get('slug') as string,
      tab: formData.get('tab') as string,
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      metaTitle: formData.get('metaTitle') as string,
      metaDescription: formData.get('metaDescription') as string,
      published: formData.get('published') === 'true',
    }

    const parsed = variantSchema.safeParse(raw)
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]
      return { success: false, error: firstError.message }
    }

    const { slug, tab, ...data } = parsed.data
    const locale = tab === 'all' ? null : tab
    const localeMatch = locale === null ? isNull(pages.locale) : eq(pages.locale, locale)

    const [existing] = await db
      .select({ id: pages.id })
      .from(pages)
      .where(and(eq(pages.slug, slug), localeMatch))
      .limit(1)

    if (existing) {
      await db
        .update(pages)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(pages.id, existing.id))
    } else {
      await db.insert(pages).values({
        ...data,
        slug,
        locale,
        createdBy: user.id,
      })
    }

    revalidatePath('/admin/cms')
    for (const l of locales) revalidatePath(`/${l}/${slug}`)
    revalidatePath(`/${slug}`)

    return { success: true, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { success: false, error: message }
  }
}

export async function deleteCmsPageVariant(slug: string, tab: string): Promise<{ error: string | null }> {
  await requireRole('admin', 'super_admin')

  const locale = tab === 'all' ? null : tab
  const localeMatch = locale === null ? isNull(pages.locale) : eq(pages.locale, locale)

  await db.delete(pages).where(and(eq(pages.slug, slug), localeMatch))

  revalidatePath('/admin/cms')
  for (const l of locales) revalidatePath(`/${l}/${slug}`)
  revalidatePath(`/${slug}`)

  return { error: null }
}
