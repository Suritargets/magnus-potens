import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Reveal } from '@/components/motion/Reveal'
import { languageAlternates, localePath, ogLocale } from '@/lib/seo'
import type { Locale } from '@/lib/i18n'

interface Props {
  params: Promise<{ slug: string }>
}

interface PracticeArea {
  id: string
  num: string
  title: string
  desc: string
}

interface Step {
  num: string
  title: string
  desc: string
}

interface PracticeDetail {
  tagline: string
  bullets: string[]
  intro?: string
  p1?: string
  p2?: string
  howWeWork?: string
  steps?: Step[]
}

const KNOWN_SLUGS = ['dispute-resolution', 'litigation', 'corporate-commercial', 'regulatory-compliance', 'strategic-advisory']

export function generateStaticParams() {
  return KNOWN_SLUGS.map((slug) => ({ slug }))
}

async function getArea(slug: string) {
  if (!KNOWN_SLUGS.includes(slug)) return null
  const t = await getTranslations('practice')
  const areas = t.raw('areas') as PracticeArea[]
  return areas.find((a) => a.id === slug) ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale()
  const area = await getArea(slug)
  if (!area) return {}

  const tdAll = await getTranslations('practiceDetail')
  const detail = tdAll.raw(slug) as PracticeDetail
  const url = localePath(locale, `/practice/${slug}`)
  return {
    title: area.title,
    description: detail.tagline,
    alternates: {
      canonical: url,
      languages: languageAlternates(`/practice/${slug}`),
    },
    openGraph: {
      type: 'website',
      siteName: 'Magnus & Potens',
      locale: ogLocale(locale as Locale),
      title: area.title,
      description: detail.tagline,
      url,
      images: [`${process.env.NEXT_PUBLIC_APP_URL ?? 'https://magnus-potens.com'}/opengraph-image.png`],
    },
    twitter: {
      card: 'summary_large_image',
      title: area.title,
      description: detail.tagline,
    },
  }
}

const bodyText = {
  fontFamily: "'Jost', sans-serif",
  fontSize: 15,
  lineHeight: 1.9,
  color: '#8C877F',
  margin: '0 0 24px',
}

export default async function PracticeAreaPage({ params }: Props) {
  const { slug } = await params
  const locale = await getLocale()
  const area = await getArea(slug)
  if (!area) notFound()

  const t = await getTranslations('practice')
  const tdAll = await getTranslations('practiceDetail')
  const detail = tdAll.raw(slug) as PracticeDetail
  const { tagline, bullets, intro, p1, p2, howWeWork, steps } = detail

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: area.title,
    name: area.title,
    description: tagline,
    provider: { '@type': 'LegalService', name: 'Magnus & Potens' },
    areaServed: 'SR',
    url: localePath(locale, `/practice/${slug}`),
  }

  return (
    <main style={{ background: '#0F1014', minHeight: '100vh', paddingTop: 120 }}>
      <script
        type="application/ld+json"
        // Zelfde escaping als de blogpost-pagina: content is JSON, geen HTML,
        // maar een letterlijke "</script>" in vertaalde tekst mag de tag niet sluiten.
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
              {area.num} — {t('label')}
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
              margin: '0 0 20px',
              maxWidth: 560,
            }}
          >
            {area.title}
          </h1>
        </Reveal>

        {/* Tagline */}
        <Reveal delay={0.16}>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: 'italic',
              fontSize: 22,
              color: '#C79E6B',
              margin: intro ? '0 0 28px' : '0 0 40px',
              maxWidth: 560,
            }}
          >
            {tagline}
          </p>
        </Reveal>

        {/* Intro (emphasized) */}
        {intro && (
          <Reveal delay={0.2}>
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
              {intro}
            </p>
          </Reveal>
        )}

        {p1 && (
          <Reveal delay={0.24}>
            <p style={bodyText}>{p1}</p>
          </Reveal>
        )}

        {p2 && (
          <Reveal delay={0.28}>
            <p style={{ ...bodyText, margin: '0 0 40px' }}>{p2}</p>
          </Reveal>
        )}

        {/* Bullets */}
        <div>
          {bullets.map((bullet, i) => (
            <Reveal key={bullet} delay={0.06 * i}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  padding: '18px 0',
                  borderBottom: i < bullets.length - 1 ? '1px solid rgba(199,158,107,0.15)' : 'none',
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontStyle: 'italic',
                    color: '#C79E6B',
                    fontSize: 18,
                    lineHeight: 1.7,
                  }}
                >
                  —
                </span>
                <p
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 15,
                    lineHeight: 1.75,
                    color: '#B7B2A8',
                    margin: 0,
                  }}
                >
                  {bullet}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* How we work */}
        {steps && steps.length > 0 && (
          <>
            <div style={{ borderTop: '1px solid rgba(199,158,107,0.15)', margin: '64px 0 48px' }} />

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
                {howWeWork}
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
          </>
        )}

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
              ← {t('allAreas')}
            </Link>
          </div>
        </Reveal>
      </article>
    </main>
  )
}
