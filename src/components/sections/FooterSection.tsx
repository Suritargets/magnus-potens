'use client'

import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { Stagger, StaggerItem } from '@/components/motion/Stagger'
import { PRACTICE_DETAIL_SLUGS } from '@/lib/practice-links'

// Mirrors the header's main nav (Header.tsx) so the footer always lists the
// full menu, not just a subset. Anchor links are locale-prefixed (not bare
// "#firm") because the footer renders on every marketing page, not only the
// homepage where those anchors live.
const firmLinks = [
  { labelKey: 'firm', getHref: (locale: string) => `/${locale}#firm` },
  { labelKey: 'approach', getHref: (locale: string) => `/${locale}#approach` },
  { labelKey: 'practice', getHref: (locale: string) => `/${locale}#practice` },
  { labelKey: 'blog', getHref: (locale: string) => `/${locale}/blog` },
  { labelKey: 'digitalTransformation', getHref: (locale: string) => `/${locale}/practice/digital-transformation` },
  { labelKey: 'consultation', getHref: (locale: string) => `/${locale}/consultation` },
] as const

interface PracticeArea {
  id: string
  num: string
  title: string
  desc: string
}

export function Footer() {
  const t = useTranslations('footer')
  const tNav = useTranslations('nav')
  const tPractice = useTranslations('practice')
  const locale = useLocale()
  const areas = tPractice.raw('areas') as PracticeArea[]

  const legalLinks = [
    { label: t('privacy_label'), slug: 'privacy' },
    { label: t('terms_label'), slug: 'terms' },
  ]

  return (
    <footer
      className="pt-16 pb-10"
      style={{
        backgroundColor: '#0F1014',
        borderTop: '1px solid rgba(199,158,107,0.14)',
      }}
    >
      <div className="max-w-[1280px] mx-auto px-8 md:px-14">
        <Stagger className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-10 mb-14">
          {/* Brand column */}
          <StaggerItem className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/images/logo-mark.png"
                alt="Magnus & Potens"
                width={36}
                height={44}
                className="object-contain"
                style={{ filter: 'drop-shadow(0 0 6px rgba(199,158,107,0.25))' }}
              />
              <div className="flex flex-col leading-none">
                <p
                  className="text-[14px] tracking-[0.22em]"
                  style={{ fontFamily: 'var(--font-marcellus)', color: '#E9E3D6' }}
                >
                  MAGNUS &amp; POTENS
                </p>
                <p
                  className="text-[9px] tracking-[0.28em] mt-[2px]"
                  style={{ fontFamily: 'var(--font-jost)', fontWeight: 300, color: '#C79E6B' }}
                >
                  LAW FIRM &nbsp;|&nbsp; ADVISORS
                </p>
              </div>
            </div>
            <p
              className="text-[15px] mb-2"
              style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', color: '#8C877F' }}
            >
              {t('tagline')}
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-[9px] tracking-[0.25em] uppercase mb-1" style={{ fontFamily: 'var(--font-jost)', fontWeight: 500, color: 'rgba(199,158,107,0.5)' }}>
                  Enquiries
                </p>
                <a
                  href="mailto:info@magnus-potens.com"
                  className="text-[13px] transition-colors duration-200"
                  style={{ fontFamily: 'var(--font-jost)', fontWeight: 300, color: '#6E6A63' }}
                  onMouseOver={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#C79E6B' }}
                  onMouseOut={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#6E6A63' }}
                >
                  info@magnus-potens.com
                </a>
                <a
                  href="tel:+597552146"
                  className="text-[13px] transition-colors duration-200 block mt-1"
                  style={{ fontFamily: 'var(--font-jost)', fontWeight: 300, color: '#6E6A63' }}
                  onMouseOver={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#C79E6B' }}
                  onMouseOut={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#6E6A63' }}
                >
                  +597 552 146
                </a>
              </div>
              <div>
                <p className="text-[9px] tracking-[0.25em] uppercase mb-1" style={{ fontFamily: 'var(--font-jost)', fontWeight: 500, color: 'rgba(199,158,107,0.5)' }}>
                  By appointment
                </p>
                <p className="text-[13px]" style={{ fontFamily: 'var(--font-jost)', fontWeight: 300, color: '#6E6A63' }}>
                  magnus-potens.com
                </p>
              </div>
              <div>
                <p className="text-[9px] tracking-[0.25em] uppercase mb-1" style={{ fontFamily: 'var(--font-jost)', fontWeight: 500, color: 'rgba(199,158,107,0.5)' }}>
                  Address
                </p>
                <p className="text-[13px]" style={{ fontFamily: 'var(--font-jost)', fontWeight: 300, color: '#6E6A63' }}>
                  Ming Doelmanstraat # 15, Paramaribo, Suriname
                </p>
              </div>
            </div>
          </StaggerItem>

          {/* Firm nav links */}
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
                <li key={link.labelKey}>
                  <a
                    href={link.getHref(locale)}
                    className="text-[13px] transition-colors duration-200"
                    style={{
                      fontFamily: 'var(--font-jost)',
                      fontWeight: 300,
                      color: '#6E6A63',
                    }}
                    onMouseOver={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#C79E6B' }}
                    onMouseOut={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#6E6A63' }}
                  >
                    {tNav(link.labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </StaggerItem>

          {/* Practice areas */}
          <StaggerItem>
            <p
              className="text-[9px] tracking-[0.25em] uppercase mb-6"
              style={{
                fontFamily: 'var(--font-jost)',
                fontWeight: 500,
                color: 'rgba(199,158,107,0.5)',
              }}
            >
              {tPractice('label')}
            </p>
            <ul className="space-y-3">
              {areas.map((area) => {
                const slug = PRACTICE_DETAIL_SLUGS[area.id]
                return (
                  <li key={area.id}>
                    <a
                      href={slug ? `/${locale}${slug}` : `/${locale}#practice`}
                      className="text-[13px] transition-colors duration-200"
                      style={{
                        fontFamily: 'var(--font-jost)',
                        fontWeight: 300,
                        color: '#6E6A63',
                      }}
                      onMouseOver={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#C79E6B' }}
                      onMouseOut={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#6E6A63' }}
                    >
                      {area.title}
                    </a>
                  </li>
                )
              })}
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
