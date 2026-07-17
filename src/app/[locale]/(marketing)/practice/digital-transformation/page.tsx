import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import { getLocale, getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Reveal } from '@/components/motion/Reveal'
import { languageAlternates, localePath, ogLocale } from '@/lib/seo'
import type { Locale } from '@/lib/i18n'

interface Step {
  num: string
  title: string
  desc: string
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = await getTranslations('digitalTransformation')
  const url = localePath(locale, '/practice/digital-transformation')
  const title = t('metaTitle')
  const description = t('metaDescription')
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates('/practice/digital-transformation'),
    },
    openGraph: {
      type: 'website',
      siteName: 'Magnus & Potens',
      locale: ogLocale(locale as Locale),
      title,
      description,
      url,
      images: [`${process.env.NEXT_PUBLIC_APP_URL ?? 'https://magnus-potens.com'}/opengraph-image.png`],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

const bodyText: CSSProperties = {
  fontFamily: "'Jost', sans-serif",
  fontSize: 15,
  lineHeight: 1.9,
  color: '#8C877F',
  margin: '0 0 24px',
}

export default async function DigitalTransformationPage() {
  const locale = await getLocale()
  const t = await getTranslations('digitalTransformation')
  const steps = t.raw('steps') as Step[]

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: t('label'),
    name: t('label'),
    description: t('metaDescription'),
    provider: { '@type': 'LegalService', name: 'Magnus & Potens' },
    areaServed: 'SR',
    url: localePath(locale, '/practice/digital-transformation'),
  }

  return (
    <main style={{ background: '#0F1014', minHeight: '100vh', paddingTop: 120 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd).replace(/</g, '\\u003c') }}
      />
      <article style={{ maxWidth: 700, margin: '0 auto', padding: '0 32px 120px' }}>
        {/* Eyebrow */}
        <Reveal>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <span style={{ display: 'block', width: 30, height: 1, background: '#C79E6B' }} />
            <p
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#C79E6B',
                margin: 0,
              }}
            >
              {t('label')}
            </p>
          </div>
        </Reveal>

        {/* Headline */}
        <Reveal delay={0.1}>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(34px, 5vw, 52px)',
              fontWeight: 400,
              lineHeight: 1.15,
              color: '#E9E3D6',
              margin: '0 0 32px',
              maxWidth: 560,
            }}
          >
            {t('headline1')}
            <br />
            <em style={{ fontStyle: 'italic', color: '#C79E6B' }}>{t('headlineEm')}</em>
          </h1>
        </Reveal>

        {/* Intro (emphasized) */}
        <Reveal delay={0.16}>
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 16,
              fontWeight: 500,
              lineHeight: 1.85,
              color: '#E9E3D6',
              margin: '0 0 28px',
            }}
          >
            {t('intro')}
          </p>
        </Reveal>

        {/* Video */}
        <Reveal delay={0.18}>
          <div
            style={{
              position: 'relative',
              aspectRatio: '16 / 9',
              margin: '0 0 40px',
              border: '1px solid rgba(199,158,107,0.2)',
              overflow: 'hidden',
            }}
          >
            <video
              src="/digital-transformation.mp4"
              controls
              preload="metadata"
              playsInline
              style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
            />
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p style={bodyText}>{t('p1')}</p>
        </Reveal>

        <Reveal delay={0.24}>
          <p style={bodyText}>{t('p2')}</p>
        </Reveal>

        <Reveal delay={0.28}>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: 'italic',
              fontSize: 22,
              color: '#C79E6B',
              margin: '40px 0 28px',
            }}
          >
            {t('subheading')}
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <p style={bodyText}>{t('p3')}</p>
        </Reveal>

        {/* Highlight box */}
        <Reveal delay={0.34}>
          <div
            style={{
              border: '1px solid rgba(199,158,107,0.3)',
              borderRadius: 2,
              padding: '32px 28px',
              margin: '0 0 32px',
            }}
          >
            <p
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 14.5,
                lineHeight: 1.85,
                color: '#8C877F',
                margin: '0 0 20px',
              }}
            >
              {t('boxIntroBefore')}
              <span style={{ color: '#C79E6B' }}>{t('boxIntroHighlight')}</span>
              {t('boxIntroAfter')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
              {[t('option1'), t('option2')].map((option) => (
                <div key={option} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span
                    style={{
                      flexShrink: 0,
                      marginTop: 5,
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      border: '1px solid #C79E6B',
                    }}
                  />
                  <p
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 14.5,
                      lineHeight: 1.7,
                      color: '#E9E3D6',
                      margin: 0,
                    }}
                  >
                    {option}
                  </p>
                </div>
              ))}
            </div>
            <p
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 14.5,
                lineHeight: 1.7,
                color: '#8C877F',
                margin: 0,
              }}
            >
              {t('boxClosing')}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.38}>
          <p style={bodyText}>{t('p4')}</p>
        </Reveal>

        <Reveal delay={0.42}>
          <p style={{ ...bodyText, margin: 0 }}>{t('p5')}</p>
        </Reveal>

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(199,158,107,0.15)', margin: '64px 0 48px' }} />

        {/* How we work */}
        <Reveal>
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#C79E6B',
              margin: '0 0 8px',
            }}
          >
            {t('howWeWork')}
          </p>
        </Reveal>

        <div>
          {steps.map((step, i) => (
            <Reveal key={step.num} delay={0.06 * i}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 24,
                  padding: '20px 0',
                  borderBottom: i < steps.length - 1 ? '1px solid rgba(199,158,107,0.15)' : 'none',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontStyle: 'italic',
                    fontSize: 15,
                    color: '#C79E6B',
                    width: 24,
                    flexShrink: 0,
                  }}
                >
                  {step.num}
                </span>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontWeight: 400,
                      fontSize: 19,
                      color: '#E9E3D6',
                      margin: '0 0 4px',
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 13,
                      color: '#8C877F',
                      margin: 0,
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Back to practice */}
        <Reveal delay={0.1}>
          <div style={{ marginTop: 56 }}>
            <Link
              href={`/${locale}#practice`}
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#C79E6B',
                textDecoration: 'none',
              }}
            >
              ← {t('backLink')}
            </Link>
          </div>
        </Reveal>
      </article>
    </main>
  )
}
