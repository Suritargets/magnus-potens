'use client'

import { useTranslations } from 'next-intl'
import { motion, useReducedMotion } from 'motion/react'
import { Reveal } from '@/components/motion/Reveal'

const EASE = [0.22, 1, 0.36, 1] as const

interface Pillar {
  num: string
  tag: string
  title: string
  desc: string
}

export function Approach() {
  const t = useTranslations('approach')
  const pillars = t.raw('pillars') as Pillar[]
  const reduce = useReducedMotion()

  return (
    <section
      id="approach"
      className="py-28 md:py-36"
      style={{ backgroundColor: '#0F1014' }}
    >
      <div className="max-w-[1280px] mx-auto px-8 md:px-14">
        {/* Header */}
        <div className="mb-16 md:mb-20">
          <Reveal>
            <div className="mp-chip mb-6">
              <span className="mp-rule" />
              {t('label')}
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <h2
              className="text-[2rem] md:text-[2.6rem] leading-[1.1] font-normal max-w-[460px]"
              style={{
                fontFamily: 'var(--font-cormorant)',
                color: '#F3EEE4',
              }}
            >
              {t('headline')}
            </h2>
          </Reveal>
        </div>

        {/* 4-col pillars — gold gap technique for divider lines */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-px"
          style={{ backgroundColor: 'rgba(199,158,107,0.16)' }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.12 } },
          }}
        >
          {pillars.map((pillar) => (
            <motion.div
              key={pillar.num}
              className="p-8 md:p-10 flex flex-col"
              style={{ backgroundColor: '#0F1014' }}
              variants={{
                hidden: { opacity: 0, y: reduce ? 0 : 24 },
                show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
              }}
            >
              {/* Number */}
              <p
                className="text-[11px] mb-6 tracking-[0.1em]"
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontStyle: 'italic',
                  color: '#C79E6B',
                }}
              >
                {pillar.num}
              </p>

              {/* Tag */}
              <p
                className="text-[9px] tracking-[0.25em] mb-5"
                style={{
                  fontFamily: 'var(--font-jost)',
                  fontWeight: 500,
                  color: 'rgba(199,158,107,0.55)',
                  letterSpacing: '0.25em',
                }}
              >
                {pillar.tag}
              </p>

              {/* Title */}
              <h3
                className="text-[1.25rem] leading-[1.2] font-normal mb-5"
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  color: '#F3EEE4',
                }}
              >
                {pillar.title}
              </h3>

              {/* Gold rule */}
              <div
                className="mb-6"
                style={{
                  width: 28,
                  height: 1,
                  backgroundColor: 'rgba(199,158,107,0.4)',
                }}
              />

              {/* Description */}
              <p
                className="text-[13px] leading-[1.7] mt-auto"
                style={{
                  fontFamily: 'var(--font-jost)',
                  fontWeight: 300,
                  color: '#8C877F',
                }}
              >
                {pillar.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
