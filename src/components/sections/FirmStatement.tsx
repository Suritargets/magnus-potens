import { useTranslations } from 'next-intl'
import { Reveal } from '@/components/motion/Reveal'

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
        <Reveal className="flex justify-center mb-14">
          <div className="mp-chip">
            <span className="mp-rule" />
            {t('label')}
            <span className="mp-rule" />
          </div>
        </Reveal>

        {/* Blockquote statement */}
        <div className="max-w-[780px] mx-auto text-center">
          <Reveal delay={0.15}>
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
          </Reveal>

          {/* Divider */}
          <Reveal delay={0.3}>
            <div
              className="mx-auto mb-10"
              style={{
                width: 48,
                height: 1,
                backgroundColor: 'rgba(199,158,107,0.4)',
              }}
            />
          </Reveal>

          {/* Description */}
          <Reveal delay={0.4}>
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
          </Reveal>
        </div>
      </div>
    </section>
  )
}
