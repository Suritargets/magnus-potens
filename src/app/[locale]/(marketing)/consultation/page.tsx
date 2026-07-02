export const dynamic = 'force-dynamic'

import { db } from '@/db'
import { availabilityConfig } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { getTranslations } from 'next-intl/server'
import { AppointmentBooker } from '@/components/sections/AppointmentBooker'
import { Reveal } from '@/components/motion/Reveal'

export default async function ConsultationPage() {
  const t = await getTranslations('consultation')

  let configs: typeof availabilityConfig.$inferSelect[] = []
  try {
    configs = await db
      .select()
      .from(availabilityConfig)
      .where(eq(availabilityConfig.isActive, true))
  } catch {
    // DB not configured yet — booker shows no availability
  }

  const tObj = {
    headline: t('headline'),
    subtitle:  t('subtitle'),
    no_slots:  t('no_slots'),
    select_date_first: t('select_date_first'),
    topics: {
      label:         t('topics.label'),
      corporate:     t('topics.corporate'),
      private_wealth: t('topics.private_wealth'),
      strategic:     t('topics.strategic'),
      transactions:  t('topics.transactions'),
      dispute:       t('topics.dispute'),
      regulatory:    t('topics.regulatory'),
      other:         t('topics.other'),
    },
    form: {
      name:            t('form.name'),
      email:           t('form.email'),
      phone:           t('form.phone'),
      topic:           t('form.topic'),
      notes:           t('form.notes'),
      submit:          t('form.submit'),
      disclaimer:      t('form.disclaimer'),
      success_title:   t('form.success_title'),
      success_message: t('form.success_message'),
    },
  }

  return (
    <main style={{ background: '#0F1014', minHeight: '100vh', paddingTop: 120 }}>
      {/* Hero */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '0 32px 72px' }}>
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

      {/* Booker */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 32px' }}>
        <Reveal delay={0.3}>
          <AppointmentBooker availabilityConfigs={configs} t={tObj} />
        </Reveal>
      </section>
    </main>
  )
}
