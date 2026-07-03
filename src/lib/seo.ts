import { locales, defaultLocale, type Locale } from '@/lib/i18n'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://magnus-potens.com'

const OG_LOCALES: Record<Locale, string> = {
  en: 'en_GB',
  nl: 'nl_NL',
  es: 'es_ES',
  fr: 'fr_FR',
  pt: 'pt_PT',
  zh: 'zh_CN',
}

// localePrefix: 'as-needed' laat de default locale zonder prefix (/ i.p.v. /en).
export function localePath(locale: string, path: string): string {
  const prefix = locale === defaultLocale ? '' : `/${locale}`
  return `${BASE_URL}${prefix}${path}`
}

// hreflang-alternates voor Metadata.alternates.languages — één ingang per taal
// plus x-default, zodat zoekmachines de juiste taalvariant per bezoeker tonen.
export function languageAlternates(path: string): Record<string, string> {
  const entries = locales.map((l) => [l, localePath(l, path)] as const)
  return Object.fromEntries([...entries, ['x-default', localePath(defaultLocale, path)]])
}

export function ogLocale(locale: Locale): string {
  return OG_LOCALES[locale] ?? OG_LOCALES[defaultLocale]
}
