import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Reveal } from '@/components/motion/Reveal'
import { languageAlternates, localePath } from '@/lib/seo'

interface Props {
  params: Promise<{ slug: string }>
}

interface PracticeArea {
  id: string
  num: string
  title: string
  desc: string
}

const KNOWN_SLUGS = ['dispute-resolution', 'litigation', 'corporate-commercial', 'regulatory-compliance']

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

  const td = await getTranslations(`practiceDetail.${slug}`)
  return {
    title: area.title,
    description: td('tagline'),
    alternates: {
      canonical: localePath(locale, `/practice/${slug}`),
      languages: languageAlternates(`/practice/${slug}`),
    },
  }
}

export default async function PracticeAreaPage({ params }: Props) {
  const { slug } = await params
  const locale = await getLocale()
  const area = await getArea(slug)
  if (!area) notFound()

  const t = await getTranslations('practice')
  const td = await getTranslations(`practiceDetail.${slug}`)
  const bullets = td.raw('bullets') as string[]

  return (
    <main style={{ background: '#0F1014', minHeight: '100vh', paddingTop: 120 }}>
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
              margin: '0 0 40px',
              maxWidth: 560,
            }}
          >
            {td('tagline')}
          </p>
        </Reveal>

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
