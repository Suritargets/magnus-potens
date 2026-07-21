'use client'

import { useTranslations, useLocale } from 'next-intl'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'

const EASE = [0.22, 1, 0.36, 1] as const

export function Hero() {
  const t = useTranslations('hero')
  const locale = useLocale()
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const logoY = useTransform(scrollY, [0, 700], [0, -70])
  const contentY = useTransform(scrollY, [0, 700], [0, 40])

  const entrance = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, delay, ease: EASE },
  })

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: '#0F1014' }}
    >
      {/* Subtle vertical rule pattern — from the original design reference */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          opacity: 0.06,
          backgroundImage: 'repeating-linear-gradient(90deg, #C79E6B 0 1px, transparent 1px 120px)',
        }}
      />

      {/* Background texture / subtle grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 60% at 70% 50%, rgba(199,158,107,0.04) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 20% 80%, rgba(199,158,107,0.025) 0%, transparent 60%)
          `,
        }}
      />

      {/* Gold glow ring — decorative */}
      <motion.div
        className="absolute pointer-events-none"
        aria-hidden
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 0.6, ease: EASE }}
        style={{
          right: '-8vw',
          top: '50%',
          translateY: '-50%',
          width: '52vw',
          height: '52vw',
          maxWidth: 820,
          maxHeight: 820,
          borderRadius: '50%',
          border: '1px solid rgba(199,158,107,0.08)',
          animation: 'mpGlow 6s ease-in-out infinite',
        }}
      />
      <motion.div
        className="absolute pointer-events-none"
        aria-hidden
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 0.9, ease: EASE }}
        style={{
          right: '-5vw',
          top: '50%',
          translateY: '-50%',
          width: '38vw',
          height: '38vw',
          maxWidth: 600,
          maxHeight: 600,
          borderRadius: '50%',
          border: '1px solid rgba(199,158,107,0.05)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-8 md:px-14 w-full py-32">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          {/* Left column */}
          <motion.div style={{ y: reduce ? 0 : contentY }}>
            {/* Tagline chip */}
            <motion.div className="mp-chip mb-10" {...entrance(0.15)}>
              <span className="mp-rule" />
              {t('tagline')}
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="text-[2.4rem] md:text-[3.2rem] leading-[1.08] font-normal mb-8"
              {...entrance(0.35)}
              style={{
                fontFamily: 'var(--font-cormorant)',
                color: '#F3EEE4',
                letterSpacing: '-0.01em',
              }}
            >
              {t('headline')}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-[15px] leading-relaxed mb-12 max-w-[440px]"
              {...entrance(0.55)}
              style={{
                fontFamily: 'var(--font-jost)',
                fontWeight: 300,
                color: '#A7A29A',
              }}
            >
              {t('subtitle')}
            </motion.p>

            {/* CTAs */}
            <motion.div className="flex flex-col sm:flex-row gap-4" {...entrance(0.75)}>
              <a
                href={`/${locale}/consultation`}
                className="mp-shimmer inline-flex items-center justify-center px-8 py-3.5 text-[11px] tracking-[0.18em] uppercase transition-all duration-300 hover:bg-mp-gold-hover"
                style={{
                  fontFamily: 'var(--font-jost)',
                  fontWeight: 500,
                  backgroundColor: '#C79E6B',
                  color: '#0F1014',
                }}
              >
                {t('cta_primary')}
              </a>
              <a
                href="#practice"
                className="inline-flex items-center justify-center px-8 py-3.5 text-[11px] tracking-[0.18em] uppercase transition-all duration-300 hover:border-mp-gold hover:text-mp-gold"
                style={{
                  fontFamily: 'var(--font-jost)',
                  fontWeight: 400,
                  border: '1px solid rgba(199,158,107,0.35)',
                  color: '#E9E3D6',
                }}
              >
                {t('cta_secondary')}
              </a>
            </motion.div>
          </motion.div>

          {/* Right column — animated logo mark */}
          <motion.div
            className="hidden md:flex items-center justify-center relative"
            style={{ y: reduce ? 0 : logoY }}
          >
            {/* Gold glow blob */}
            <motion.div
              className="absolute pointer-events-none"
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2.4, delay: 1.1, ease: 'easeOut' }}
              style={{
                width: 420,
                height: 420,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(199,158,107,0.28) 0%, transparent 65%)',
                filter: 'blur(20px)',
                animation: 'mpGlow 6s ease-in-out infinite',
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: reduce ? 1 : 0.96, y: reduce ? 0 : 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.9, ease: EASE }}
              style={{
                position: 'relative',
                width: 'min(90%, 640px)',
                aspectRatio: '16 / 9',
                overflow: 'hidden',
              }}
            >
              <video
                src="/logo-motion.mp4"
                autoPlay={!reduce}
                loop={!reduce}
                muted
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #0F1014)' }}
        aria-hidden
      />

      {/* Scroll indicator */}
      <motion.div
        className="absolute z-10"
        style={{
          bottom: 34,
          left: '50%',
          translateX: '-50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6, ease: EASE }}
      >
        <span
          style={{
            fontFamily: 'var(--font-jost)',
            fontSize: 10,
            letterSpacing: '0.3em',
            color: '#6E6A63',
            textTransform: 'uppercase',
          }}
        >
          {t('scroll')}
        </span>
        <div style={{ position: 'relative', width: 1, height: 42, overflow: 'hidden' }}>
          <div
            className="absolute inset-0"
            aria-hidden
            style={{ background: 'linear-gradient(#C79E6B, transparent)' }}
          />
          {!reduce && (
            <motion.div
              className="absolute left-0 w-full"
              aria-hidden
              style={{ height: 16, background: 'linear-gradient(#F3D9A8, transparent)' }}
              animate={{ top: ['-38%', '100%'] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
        </div>
      </motion.div>
    </section>
  )
}
