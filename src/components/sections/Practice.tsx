'use client'

import { useLocale, useTranslations } from 'next-intl'
import { motion, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import { Reveal } from '@/components/motion/Reveal'

const EASE = [0.22, 1, 0.36, 1] as const

interface PracticeArea {
  id: string
  num: string
  title: string
  desc: string
}

// Only areas with a published detail page get a slug — matched by locale-independent
// id, not the translated title — others render as static (non-linked) cards.
const DETAIL_SLUGS: Record<string, string> = {
  'digital-transformation': '/practice/digital-transformation',
}

export function Practice() {
  const t = useTranslations('practice')
  const locale = useLocale()
  const areas = t.raw('areas') as PracticeArea[]
  const reduce = useReducedMotion()

  return (
    <section
      id="practice"
      className="py-28 md:py-36"
      style={{ backgroundColor: '#F2ECE0' }}
    >
      <div className="max-w-[1280px] mx-auto px-8 md:px-14">
        {/* Header */}
        <div className="mb-16">
          <Reveal>
            <div className="mp-chip mb-6" style={{ color: '#A67C3E' }}>
              <span className="mp-rule" style={{ backgroundColor: '#A67C3E' }} />
              {t('label')}
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <h2
              className="text-[2rem] md:text-[2.6rem] leading-[1.1] font-normal max-w-[520px] mb-5"
              style={{
                fontFamily: 'var(--font-cormorant)',
                color: '#1A1814',
              }}
            >
              {t('headline')}
            </h2>
          </Reveal>
          <Reveal delay={0.22}>
            <p
              className="text-[14px] leading-relaxed max-w-[480px]"
              style={{
                fontFamily: 'var(--font-jost)',
                fontWeight: 300,
                color: '#6E6A63',
              }}
            >
              {t('subtitle')}
            </p>
          </Reveal>
        </div>

        {/* 3x2 grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ borderTop: '1px solid rgba(26, 24, 20, 0.14)' }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {areas.map((area, index) => {
            const isLastRow = index >= 3
            const isLastInRow = (index + 1) % 3 === 0
            const href = DETAIL_SLUGS[area.id] ? `/${locale}${DETAIL_SLUGS[area.id]}` : undefined
            const cardContent = (
              <>
                <p
                  className="text-[11px] mb-5 tracking-[0.1em]"
                  style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontStyle: 'italic',
                    color: '#C79E6B',
                  }}
                >
                  {area.num}
                </p>
                <h3
                  className="text-[1.15rem] leading-[1.2] mb-4 font-normal"
                  style={{
                    fontFamily: 'var(--font-cormorant)',
                    color: '#1A1814',
                  }}
                >
                  {area.title}
                </h3>
                <p
                  className="text-[13px] leading-relaxed"
                  style={{
                    fontFamily: 'var(--font-jost)',
                    fontWeight: 300,
                    color: '#6E6A63',
                  }}
                >
                  {area.desc}
                </p>
              </>
            )
            return (
              <motion.div
                key={area.num}
                className="group"
                variants={{
                  hidden: { opacity: 0, y: reduce ? 0 : 24 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
                }}
                style={{
                  borderRight: !isLastInRow ? '1px solid rgba(26, 24, 20, 0.14)' : 'none',
                  borderBottom: !isLastRow ? '1px solid rgba(26, 24, 20, 0.14)' : 'none',
                  transition: 'background 0.3s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(199,158,107,0.06)'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent'
                }}
              >
                {href ? (
                  <Link href={href} className="block p-8 md:p-10" style={{ textDecoration: 'none', color: 'inherit' }}>
                    {cardContent}
                  </Link>
                ) : (
                  <div className="p-8 md:p-10">{cardContent}</div>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
