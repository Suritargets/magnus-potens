import { useTranslations } from 'next-intl'
import { ContactForm } from './ContactForm'

export function Contact() {
  const t = useTranslations('contact')

  return (
    <section
      id="contact"
      className="py-28 md:py-36"
      style={{ backgroundColor: '#0F1014' }}
    >
      <div className="max-w-[1280px] mx-auto px-8 md:px-14">
        {/* Chip */}
        <div className="mp-chip mb-8">
          <span className="mp-rule" />
          {t('label')}
        </div>

        {/* 2-col layout */}
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">
          {/* Left — info */}
          <div>
            <h2
              className="text-[2.2rem] md:text-[3rem] leading-[1.1] font-normal mb-7"
              style={{
                fontFamily: 'var(--font-cormorant)',
                color: '#F3EEE4',
              }}
            >
              {t('headline')}
            </h2>
            <p
              className="text-[14px] leading-[1.8] mb-12 max-w-[400px]"
              style={{
                fontFamily: 'var(--font-jost)',
                fontWeight: 300,
                color: '#8C877F',
              }}
            >
              {t('description')}
            </p>

            {/* Contact details */}
            <div className="space-y-8">
              <div>
                <p
                  className="text-[9px] tracking-[0.25em] uppercase mb-2"
                  style={{
                    fontFamily: 'var(--font-jost)',
                    fontWeight: 500,
                    color: 'rgba(199,158,107,0.6)',
                  }}
                >
                  {t('enquiries_label')}
                </p>
                <a
                  href={`mailto:${t('email')}`}
                  className="text-[15px] transition-colors hover:text-mp-gold"
                  style={{
                    fontFamily: 'var(--font-jost)',
                    fontWeight: 300,
                    color: '#E9E3D6',
                  }}
                >
                  {t('email')}
                </a>
              </div>

              <div>
                <p
                  className="text-[9px] tracking-[0.25em] uppercase mb-2"
                  style={{
                    fontFamily: 'var(--font-jost)',
                    fontWeight: 500,
                    color: 'rgba(199,158,107,0.6)',
                  }}
                >
                  {t('appointment_label')}
                </p>
                <p
                  className="text-[14px]"
                  style={{
                    fontFamily: 'var(--font-jost)',
                    fontWeight: 300,
                    color: '#8C877F',
                  }}
                >
                  {t('website')}
                </p>
              </div>
            </div>
          </div>

          {/* Right — contact form card */}
          <div
            className="rounded-none p-8 md:p-10"
            style={{
              backgroundColor: '#15171C',
              border: '1px solid rgba(199,158,107,0.14)',
            }}
          >
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}
