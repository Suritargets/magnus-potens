'use client'

import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { Stagger, StaggerItem } from '@/components/motion/Stagger'

const firmLinks = [
  { label: 'The Firm', href: '#firm' },
  { label: 'Practice', href: '#practice' },
  { label: 'Approach', href: '#approach' },
]

const legalLinks = [
  { label: 'Privacy Policy', slug: 'privacy' },
  { label: 'Terms of Service', slug: 'terms' },
]

export function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale()

  return (
    <footer
      className="pt-16 pb-10"
      style={{
        backgroundColor: '#0F1014',
        borderTop: '1px solid rgba(199,158,107,0.14)',
      }}
    >
      <div className="max-w-[1280px] mx-auto px-8 md:px-14">
        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 mb-14">
          {/* Brand column */}
          <StaggerItem className="md:col-span-1">
            <div className="flex items-center gap-4 mb-5">
              <Image
                src="/images/logo-mark.png"
                alt="Magnus & Potens"
                width={44}
                height={54}
                style={{ height: 54, width: 'auto' }}
              />
              <div className="flex flex-col leading-tight">
                <p
                  className="text-[18px] tracking-[0.26em]"
                  style={{ fontFamily: 'var(--font-marcellus)', color: '#E9E3D6' }}
                >
                  MAGNUS &amp; POTENS
                </p>
                <p
                  className="text-[9.5px] tracking-[0.42em] mt-1"
                  style={{ fontFamily: 'var(--font-jost)', fontWeight: 400, color: '#C79E6B' }}
                >
                  LAW &nbsp;&nbsp;|&nbsp;&nbsp; ADVISORS
                </p>
                <p
                  className="text-[17px] mt-3"
                  style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', color: '#8C877F' }}
                >
                  {t('tagline')}
                </p>
              </div>
            </div>
          </StaggerItem>

          {/* Firm links */}
          <StaggerItem>
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
          </StaggerItem>

          {/* Reach us */}
          <StaggerItem>
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
                  href="mailto:info@magnus-potens.com"
                  className="text-[13px] transition-colors duration-200"
                  style={{
                    fontFamily: 'var(--font-jost)',
                    fontWeight: 300,
                    color: '#6E6A63',
                  }}
                  onMouseOver={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#C79E6B' }}
                  onMouseOut={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#6E6A63' }}
                >
                  info@magnus-potens.com
                </a>
              </li>
              {legalLinks.map((link) => (
                <li key={link.slug}>
                  <a
                    href={`/${locale}/${link.slug}`}
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
          </StaggerItem>
        </Stagger>

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
