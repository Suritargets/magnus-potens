import { getHomepageOverride, mergeHomepageMessages, type HomepageOverride } from '@/lib/homepage-content'
import { HomepageEditor } from './HomepageEditor'
import enDefaults from '@/messages/en.json'
import nlDefaults from '@/messages/nl.json'
import esDefaults from '@/messages/es.json'
import frDefaults from '@/messages/fr.json'
import ptDefaults from '@/messages/pt.json'
import zhDefaults from '@/messages/zh.json'
import { locales } from '@/lib/i18n'

const DEFAULTS: Record<string, Record<string, unknown>> = {
  en: enDefaults,
  nl: nlDefaults,
  es: esDefaults,
  fr: frDefaults,
  pt: ptDefaults,
  zh: zhDefaults,
}

export default async function HomepageContentPage() {

  const overrides = await Promise.all(locales.map((l) => getHomepageOverride(l)))

  const content: Record<string, Required<HomepageOverride>> = {}
  locales.forEach((locale, i) => {
    content[locale] = mergeHomepageMessages(DEFAULTS[locale], overrides[i]) as Required<HomepageOverride>
  })

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 400, color: '#E9E3D6', margin: '0 0 4px' }}>
          Homepage Content
        </h1>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: '#6E6A63', margin: 0 }}>
          Edit the text shown on the public homepage, per language. Changes go live immediately after saving.
        </p>
      </div>

      <HomepageEditor content={content} />
    </div>
  )
}
