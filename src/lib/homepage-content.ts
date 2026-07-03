import 'server-only'
import { db } from '@/db'
import { homepageContent } from '@/db/schema'
import { eq } from 'drizzle-orm'

export interface PracticeArea {
  num: string
  title: string
  desc: string
}

export interface ApproachPillar {
  num: string
  tag: string
  title: string
  desc: string
}

export interface HomepageOverride {
  hero?: Partial<{ tagline: string; headline: string; subtitle: string; cta_primary: string; cta_secondary: string }>
  firm?: Partial<{ label: string; statement: string; description: string }>
  practice?: Partial<{ label: string; headline: string; subtitle: string; areas: PracticeArea[] }>
  approach?: Partial<{ label: string; headline: string; pillars: ApproachPillar[] }>
  slogan?: Partial<{ label: string; headline: string }>
  contact?: Partial<{
    label: string
    headline: string
    description: string
    enquiries_label: string
    email: string
    appointment_label: string
    website: string
  }>
}

const OVERRIDABLE_SECTIONS = ['hero', 'firm', 'practice', 'approach', 'slogan', 'contact'] as const

/** Haalt de DB-override voor een taal op; null als er nog niets is opgeslagen. */
export async function getHomepageOverride(locale: string): Promise<HomepageOverride | null> {
  try {
    const [row] = await db
      .select()
      .from(homepageContent)
      .where(eq(homepageContent.locale, locale))
      .limit(1)
    if (!row) return null
    return JSON.parse(row.content) as HomepageOverride
  } catch {
    return null
  }
}

/**
 * Merget de DB-override over de statische vertalingen heen — alleen voor de
 * homepage-secties (hero/firm/practice/approach/slogan/contact). Overige
 * namespaces (nav, blog, consultation, footer, cookies) blijven ongemoeid.
 */
export function mergeHomepageMessages(
  base: Record<string, unknown>,
  override: HomepageOverride | null
): Record<string, unknown> {
  if (!override) return base
  const merged = { ...base }
  for (const section of OVERRIDABLE_SECTIONS) {
    const sectionOverride = override[section]
    if (sectionOverride) {
      merged[section] = { ...(base[section] as object), ...sectionOverride }
    }
  }
  return merged
}
