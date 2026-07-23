'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Reveal } from '@/components/motion/Reveal'
import { Parallax } from '@/components/motion/Parallax'

export function SloganBand() {
  const t = useTranslations('slogan')
  const rawHeadline = t('headline')
  // Support \n in the headline string — split into lines
  const lines = rawHeadline.split('\n')

  return (
    <section
      className="relative py-28 md:py-40 overflow-hidden"
      style={{ backgroundColor: '#15171C' }}
    >
      {/* Watermark — logo mark image, drifts slower than the scroll */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden
      >
        <Parallax speed={0.35}>
          <Image
            src="/images/logo-mark.png"
            alt=""
            width={500}
            height={620}
            style={{ height: 560, width: 'auto', opacity: 0.05 }}
          />
        </Parallax>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-8 md:px-14 text-center">
        {/* Chip */}
        <Reveal className="flex justify-center mb-10">
          <div className="mp-chip">
            <span className="mp-rule" />
            {t('label')}
            <span className="mp-rule" />
          </div>
        </Reveal>

        {/* Headline with gold gradient */}
        <Reveal delay={0.15} duration={1.1}>
          <h2
            className="text-[1.7rem] sm:text-[2.1rem] md:text-[2.6rem] lg:text-[3.3rem] leading-[1.12] font-normal whitespace-normal lg:whitespace-nowrap"
            style={{
              fontFamily: 'var(--font-cormorant)',
              background: 'linear-gradient(135deg, #C79E6B 0%, #DDBB85 40%, #A67C3E 80%, #C79E6B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.01em',
            }}
          >
            {lines.map((line, i) => (
              <span key={i} className="block">
                {i === 1 ? <em>{line}</em> : line}
              </span>
            ))}
          </h2>
        </Reveal>
      </div>
    </section>
  )
}
