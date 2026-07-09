import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { Hero } from '@/components/sections/Hero'
import { FirmStatement } from '@/components/sections/FirmStatement'
import { Practice } from '@/components/sections/Practice'
import { Approach } from '@/components/sections/Approach'
import { SloganBand } from '@/components/sections/SloganBand'
import { Contact } from '@/components/sections/Contact'
import { languageAlternates, ogLocale } from '@/lib/seo'
import type { Locale } from '@/lib/i18n'

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale
  const t = await getTranslations('hero')

  return {
    title: 'Home',
    description: t('subtitle'),
    alternates: { languages: languageAlternates('') },
    openGraph: {
      type: 'website',
      siteName: 'Magnus & Potens',
      url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://magnus-potens.com',
      locale: ogLocale(locale),
      title: `Magnus & Potens — ${t('tagline')}`,
      description: t('subtitle'),
      // De homepage overschrijft openGraph volledig (geen deep-merge met de
      // root layout), dus de opengraph-image.png file-convention moet hier
      // expliciet herhaald worden — anders heeft alleen de homepage geen
      // og:image terwijl elke andere pagina 'm wel automatisch krijgt.
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://magnus-potens.com'}/opengraph-image.png`,
          width: 1200,
          height: 630,
        },
      ],
    },
  }
}

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FirmStatement />
      <Practice />
      <Approach />
      <SloganBand />
      <Contact />
    </main>
  )
}
