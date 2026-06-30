import { useTranslations } from 'next-intl'

export function FirmStatement() {
  const t = useTranslations('firm')

  return (
    <section
      id="firm"
      className="py-28 md:py-36"
      style={{ backgroundColor: '#0F1014' }}
    >
      <div className="max-w-[1280px] mx-auto px-8 md:px-14">
        {/* Section chip */}
        <div className="flex justify-center mb-14">
          <div className="mp-chip">
            <span className="mp-rule" />
            {t('label')}
            <span className="mp-rule" />
          </div>
        </div>

        {/* Blockquote statement */}
        <div className="max-w-[780px] mx-auto text-center">
          <blockquote
            className="text-[1.7rem] md:text-[2.1rem] leading-[1.35] font-normal italic mb-10"
            style={{
              fontFamily: 'var(--font-cormorant)',
              color: '#F3EEE4',
              letterSpacing: '0.01em',
            }}
          >
            &ldquo;{t('statement')}&rdquo;
          </blockquote>

          {/* Divider */}
          <div
            className="mx-auto mb-10"
            style={{
              width: 48,
              height: 1,
              backgroundColor: 'rgba(199,158,107,0.4)',
            }}
          />

          {/* Description */}
          <p
            className="text-[15px] leading-[1.75] max-w-[580px] mx-auto"
            style={{
              fontFamily: 'var(--font-jost)',
              fontWeight: 300,
              color: '#8C877F',
            }}
          >
            {t('description')}
          </p>
        </div>
      </div>
    </section>
  )
}
