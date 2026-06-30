import { useTranslations } from 'next-intl'

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
      {/* Watermark logo text */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden
      >
        <p
          className="text-[22vw] md:text-[16vw] leading-none font-normal tracking-widest opacity-[0.025]"
          style={{
            fontFamily: 'var(--font-marcellus)',
            color: '#C79E6B',
          }}
        >
          M&amp;P
        </p>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-8 md:px-14 text-center">
        {/* Chip */}
        <div className="flex justify-center mb-10">
          <div className="mp-chip">
            <span className="mp-rule" />
            {t('label')}
            <span className="mp-rule" />
          </div>
        </div>

        {/* Headline with gold gradient */}
        <h2
          className="text-[3rem] md:text-[5rem] lg:text-[6.5rem] leading-[1.04] font-normal"
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
      </div>
    </section>
  )
}
