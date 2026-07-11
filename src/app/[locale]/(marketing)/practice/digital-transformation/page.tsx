import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import { getLocale } from 'next-intl/server'
import Link from 'next/link'
import { Reveal } from '@/components/motion/Reveal'
import { languageAlternates, localePath } from '@/lib/seo'

const TITLE = 'Digital Transformation'
const DESCRIPTION =
  "Change is no longer optional. We assess your digital maturity, define what matters most, and build a coherent transformation roadmap — independent advice, from strategy through delivery."

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: {
      canonical: localePath(locale, '/practice/digital-transformation'),
      languages: languageAlternates('/practice/digital-transformation'),
    },
  }
}

const STEPS = [
  { num: 'I', title: 'Strategy', desc: 'Maturity assessment & roadmap' },
  { num: 'II', title: 'Partner selection', desc: 'Match a new partner, or oversee one you trust' },
  { num: 'III', title: 'People & capability', desc: 'Skills, capacity, and leadership training' },
  { num: 'IV', title: 'Ongoing oversight', desc: 'Monitoring delivery, keeping the vision on track' },
]

const bodyText: CSSProperties = {
  fontFamily: "'Jost', sans-serif",
  fontSize: 15,
  lineHeight: 1.9,
  color: '#8C877F',
  margin: '0 0 24px',
}

export default async function DigitalTransformationPage() {
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
              {TITLE}
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
            Change is no longer optional
            <br />
            <em style={{ fontStyle: 'italic', color: '#C79E6B' }}>—it is essential.</em>
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
            Advances in AI, analytics, cloud, and connected technologies are rewriting how
            organizations compete, operate, and create value — and traditional business models
            that once succeeded are simply no longer enough.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <p style={bodyText}>
            Digital transformation is not about buying the latest technology; it is a
            company-wide shift in mindset, capabilities, and leadership that turns disruption
            into advantage.
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <p style={bodyText}>
            The organizations that thrive — the true Digital Masters — are those that pair bold
            technological investment with clear strategic vision and strong digital leadership.
          </p>
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
            That is exactly where we come in.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <p style={bodyText}>
            We assess your current digital maturity, define the strategic priorities that matter
            most, and build a coherent transformation roadmap.
          </p>
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
              Because we don&apos;t build the applications ourselves, we provide{' '}
              <span style={{ color: '#C79E6B' }}>independent, sound advice</span> — to either:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
              {[
                'match you with the right execution partner for your vision, or',
                'oversee delivery with a partner you already trust,',
              ].map((option) => (
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
              so every recommendation serves you, and you alone.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.38}>
          <p style={bodyText}>
            We also take a holistic approach to the human side of change — equipping your
            executives, managers, and staff with the digital skills, mindset, and leadership
            capabilities transformation demands. Because technology only delivers when the
            people behind it are ready to lead it.
          </p>
        </Reveal>

        <Reveal delay={0.42}>
          <p style={{ ...bodyText, margin: 0 }}>
            From there, we monitor delivery every step of the way, keeping technology, strategy,
            and culture aligned so the vision stays on track and becomes lasting competitive
            advantage.
          </p>
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
            How We Work
          </p>
        </Reveal>

        <div>
          {STEPS.map((step, i) => (
            <Reveal key={step.num} delay={0.06 * i}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 24,
                  padding: '20px 0',
                  borderBottom: i < STEPS.length - 1 ? '1px solid rgba(199,158,107,0.15)' : 'none',
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
              href="/#practice"
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#C79E6B',
                textDecoration: 'none',
              }}
            >
              ← All practice areas
            </Link>
          </div>
        </Reveal>
      </article>
    </main>
  )
}
