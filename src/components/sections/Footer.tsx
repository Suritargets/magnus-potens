'use client'

import { useTranslations } from 'next-intl'

const firmLinks = [
  { label: 'The Firm', href: '#firm' },
  { label: 'Practice', href: '#practice' },
  { label: 'Approach', href: '#approach' },
]

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
]

export function Footer() {
  const t = useTranslations('footer')

  return (
    <footer
      className="pt-16 pb-10"
      style={{
        backgroundColor: '#0F1014',
        borderTop: '1px solid rgba(199,158,107,0.14)',
      }}
    >
      <div className="max-w-[1280px] mx-auto px-8 md:px-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 mb-14">
          {/* Brand column */}
          <div className="md:col-span-1">
            {/* Logo */}
            <div className="mb-5">
              <p
                className="text-[15px] tracking-[0.22em] mb-1"
                style={{ fontFamily: 'var(--font-marcellus)', color: '#F3EEE4' }}
              >
                MAGNUS &amp; POTENS
              </p>
              <p
                className="text-[9px] tracking-[0.28em]"
                style={{ fontFamily: 'var(--font-jost)', fontWeight: 300, color: '#C79E6B' }}
              >
                LAW &nbsp;|&nbsp; ADVISORS
              </p>
            </div>
            <p
              className="text-[13px] leading-relaxed mt-5 max-w-[240px]"
              style={{ fontFamily: 'var(--font-jost)', fontWeight: 300, color: '#5E5A53' }}
            >
              {t('tagline')}
            </p>
          </div>

          {/* Firm links */}
          <div>
            <p
              className="text-[9px] tracking-[0.25em] uppercase mb-6"
              style={{
                fontFamily: 'var(--font-jost)',
                fontWeight: 500,
                color: 'rgba(199,158,107,0.5)',
              }}
            >
              {t('firm_col')}
            </p>
            <ul className="space-y-3">
              {firmLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-[13px] transition-colors duration-200"
                    style={{
                      fontFamily: 'var(--font-jost)',
                      fontWeight: 300,
                      color: '#6E6A63',
                    }}
                    onMouseOver={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#C79E6B' }}
                    onMouseOut={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#6E6A63' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Reach us */}
          <div>
            <p
              className="text-[9px] tracking-[0.25em] uppercase mb-6"
              style={{
                fontFamily: 'var(--font-jost)',
                fontWeight: 500,
                color: 'rgba(199,158,107,0.5)',
              }}
            >
              {t('reach_col')}
            </p>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:counsel@magnus-potens.com"
                  className="text-[13px] transition-colors duration-200"
                  style={{
                    fontFamily: 'var(--font-jost)',
                    fontWeight: 300,
                    color: '#6E6A63',
                  }}
                  onMouseOver={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#C79E6B' }}
                  onMouseOut={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#6E6A63' }}
                >
                  counsel@magnus-potens.com
                </a>
              </li>
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-[13px] transition-colors duration-200"
                    style={{
                      fontFamily: 'var(--font-jost)',
                      fontWeight: 300,
                      color: '#6E6A63',
                    }}
                    onMouseOver={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#C79E6B' }}
                    onMouseOut={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#6E6A63' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row justify-between items-center gap-3 pt-8"
          style={{ borderTop: '1px solid rgba(199,158,107,0.08)' }}
        >
          <p
            className="text-[11px]"
            style={{ fontFamily: 'var(--font-jost)', fontWeight: 300, color: '#5E5A53' }}
          >
            {t('copyright')}
          </p>
          <p
            className="text-[11px] tracking-[0.12em]"
            style={{ fontFamily: 'var(--font-jost)', fontWeight: 300, color: 'rgba(199,158,107,0.35)' }}
          >
            {t('motto')}
          </p>
        </div>
      </div>
    </footer>
  )
}
