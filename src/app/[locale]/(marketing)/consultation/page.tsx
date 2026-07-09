export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { BookingCalendar } from '@/components/sections/BookingCalendar'
import { Reveal } from '@/components/motion/Reveal'
import { languageAlternates, localePath } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = await getTranslations('consultation')
  return {
    title: t('headline'),
    description: t('subtitle'),
    alternates: { canonical: localePath(locale, '/consultation'), languages: languageAlternates('/consultation') },
  }
}

export default async function ConsultationPage() {
  const t = await getTranslations('consultation')

  return (
    <main style={{ background: '#0F1014', minHeight: '100vh', paddingTop: 120 }}>
      {/* Hero */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '0 32px 56px' }}>
        <Reveal>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.42em', textTransform: 'uppercase', color: '#C79E6B', margin: '0 0 16px' }}>
            {t('label')}
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(38px, 6vw, 60px)', fontWeight: 400, color: '#E9E3D6', margin: '0 0 20px', lineHeight: 1.05 }}>
            {t('headline')}
          </h1>
        </Reveal>
        <Reveal delay={0.22}>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 15, lineHeight: 1.85, color: '#8C877F', maxWidth: 540, margin: 0 }}>
            {t('subtitle')}
          </p>
        </Reveal>
      </section>

      {/* Divider */}
      <div style={{ borderTop: '1px solid rgba(199,158,107,0.15)', margin: '0 32px' }} />

      {/* Booking kalender — full width */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '56px 32px 96px' }}>
        <Reveal delay={0.3}>
          <BookingCalendar />
        </Reveal>
      </section>
    </main>
  )
}
