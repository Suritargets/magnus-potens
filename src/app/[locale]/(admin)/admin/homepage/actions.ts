'use server'

import { db } from '@/db'
import { homepageContent } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { requireRole } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { defaultLocale } from '@/lib/i18n'
import type { HomepageOverride } from '@/lib/homepage-content'

type SaveState = { success: boolean; error: string | null }

const NUM = (i: number) => String(i + 1).padStart(2, '0')

export async function saveHomepageContent(
  _prev: SaveState,
  formData: FormData
): Promise<SaveState> {
  try {
    await requireRole('admin', 'super_admin')

    const locale = (formData.get('locale') as string) || 'en'
    const get = (key: string) => ((formData.get(key) as string) ?? '').trim()

    const content: HomepageOverride = {
      hero: {
        tagline: get('hero_tagline'),
        headline: get('hero_headline'),
        subtitle: get('hero_subtitle'),
        cta_primary: get('hero_cta_primary'),
        cta_secondary: get('hero_cta_secondary'),
      },
      firm: {
        label: get('firm_label'),
        statement: get('firm_statement'),
        description: get('firm_description'),
      },
      practice: {
        label: get('practice_label'),
        headline: get('practice_headline'),
        subtitle: get('practice_subtitle'),
        areas: Array.from({ length: 6 }, (_, i) => ({
          id: get(`practice_area_${i}_id`),
          num: NUM(i),
          title: get(`practice_area_${i}_title`),
          desc: get(`practice_area_${i}_desc`),
        })),
      },
      approach: {
        label: get('approach_label'),
        headline: get('approach_headline'),
        pillars: Array.from({ length: 4 }, (_, i) => ({
          num: NUM(i),
          tag: get(`approach_pillar_${i}_tag`),
          title: get(`approach_pillar_${i}_title`),
          desc: get(`approach_pillar_${i}_desc`),
        })),
      },
      slogan: {
        label: get('slogan_label'),
        headline: get('slogan_headline'),
      },
      contact: {
        label: get('contact_label'),
        headline: get('contact_headline'),
        description: get('contact_description'),
        enquiries_label: get('contact_enquiries_label'),
        email: get('contact_email'),
        appointment_label: get('contact_appointment_label'),
        website: get('contact_website'),
        address_label: get('contact_address_label'),
        address: get('contact_address'),
      },
      footer: {
        tagline: get('footer_tagline'),
        motto: get('footer_motto'),
      },
    }

    if (!content.hero?.headline) return { success: false, error: 'Hero headline is required.' }

    const [existing] = await db
      .select({ id: homepageContent.id })
      .from(homepageContent)
      .where(eq(homepageContent.locale, locale))
      .limit(1)

    if (existing) {
      await db
        .update(homepageContent)
        .set({ content: JSON.stringify(content), updatedAt: new Date() })
        .where(eq(homepageContent.locale, locale))
    } else {
      await db.insert(homepageContent).values({ locale, content: JSON.stringify(content) })
    }

    revalidatePath(`/${locale}`)
    if (locale === defaultLocale) revalidatePath('/')

    return { success: true, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { success: false, error: message }
  }
}
