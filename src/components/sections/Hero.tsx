import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'

export function Hero() {
  const t = useTranslations('hero')
  const locale = useLocale()

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: '#0F1014' }}
    >
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
      <div
        className="absolute pointer-events-none"
        aria-hidden
        style={{
          right: '-8vw',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '52vw',
          height: '52vw',
          maxWidth: 820,
          maxHeight: 820,
          borderRadius: '50%',
          border: '1px solid rgba(199,158,107,0.08)',
          animation: 'mpGlow 6s ease-in-out infinite',
        }}
      />
      <div
        className="absolute pointer-events-none"
        aria-hidden
        style={{
          right: '-5vw',
          top: '50%',
          transform: 'translateY(-50%)',
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
          <div>
            {/* Tagline chip */}
            <div className="mp-chip mb-10">
              <span className="mp-rule" />
              {t('tagline')}
            </div>

            {/* Headline */}
            <h1
              className="text-[2.4rem] md:text-[3.2rem] leading-[1.08] font-normal mb-8"
              style={{
                fontFamily: 'var(--font-cormorant)',
                color: '#F3EEE4',
                letterSpacing: '-0.01em',
              }}
            >
              {t('headline')}
            </h1>

            {/* Subtitle */}
            <p
              className="text-[15px] leading-relaxed mb-12 max-w-[440px]"
              style={{
                fontFamily: 'var(--font-jost)',
                fontWeight: 300,
                color: '#A7A29A',
              }}
            >
              {t('subtitle')}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`/${locale}/consultation`}
                className="inline-flex items-center justify-center px-8 py-3.5 text-[11px] tracking-[0.18em] uppercase transition-all duration-300 hover:bg-mp-gold-hover"
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
            </div>
          </div>

          {/* Right column — logo mark */}
          <div className="hidden md:flex items-center justify-center relative">
            {/* Gold glow blob */}
            <div
              className="absolute pointer-events-none"
              aria-hidden
              style={{
                width: 420,
                height: 420,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(199,158,107,0.28) 0%, transparent 65%)',
                filter: 'blur(20px)',
                animation: 'mpGlow 6s ease-in-out infinite',
              }}
            />
            <Image
              src="/images/logo-mark.png"
              alt="Magnus & Potens monogram"
              width={340}
              height={420}
              priority
              style={{
                position: 'relative',
                height: 'clamp(260px, 46vh, 440px)',
                width: 'auto',
                filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.6))',
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #0F1014)' }}
        aria-hidden
      />
    </section>
  )
}
