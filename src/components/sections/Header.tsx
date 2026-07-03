'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { locales } from '@/lib/i18n'

const LOCALES = locales

const anchorSections = [
  { hash: 'firm',     labelKey: 'firm' },
  { hash: 'practice', labelKey: 'practice' },
  { hash: 'approach', labelKey: 'approach' },
] as const

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function switchLocale(newLocale: string) {
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
    setLangOpen(false)
  }

  const navLinkStyle = {
    fontFamily: 'var(--font-jost)',
    fontWeight: 400 as const,
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        backgroundColor: scrolled ? 'rgba(13, 14, 18, 0.86)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(199, 158, 107, 0.1)' : '1px solid transparent',
      }}
    >
      <div className="max-w-[1280px] mx-auto px-8 md:px-14 flex h-[72px] items-center justify-between">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-3 group">
          <Image
            src="/images/logo-mark.png"
            alt="Magnus & Potens"
            width={36}
            height={44}
            className="object-contain"
            style={{ filter: 'drop-shadow(0 0 6px rgba(199,158,107,0.25))' }}
            priority
          />
          <div className="flex flex-col leading-none">
            <span
              className="text-[14px] tracking-[0.22em] text-mp-text-2 group-hover:text-mp-gold transition-colors duration-300"
              style={{ fontFamily: 'var(--font-marcellus)' }}
            >
              MAGNUS &amp; POTENS
            </span>
            <span
              className="text-[9px] tracking-[0.28em] text-mp-gold mt-[2px]"
              style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}
            >
              LAW &nbsp;|&nbsp; ADVISORS
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {anchorSections.map((link) => (
            <a
              key={link.hash}
              href={`/${locale}#${link.hash}`}
              className="mp-underline text-[11px] tracking-[0.18em] uppercase text-mp-muted hover:text-mp-gold transition-colors duration-300"
              style={navLinkStyle}
            >
              {t(link.labelKey)}
            </a>
          ))}

          {/* Blog link */}
          <Link
            href={`/${locale}/blog`}
            className="mp-underline text-[11px] tracking-[0.18em] uppercase text-mp-muted hover:text-mp-gold transition-colors duration-300"
            style={navLinkStyle}
          >
            {t('blog')}
          </Link>

          {/* Consultation CTA */}
          <Link
            href={`/${locale}/consultation`}
            className="mp-shimmer text-[11px] tracking-[0.18em] uppercase px-5 py-2.5 border text-mp-gold transition-all duration-300 hover:bg-mp-gold hover:border-mp-gold hover:text-mp-dark"
            style={{
              fontFamily: 'var(--font-jost)',
              fontWeight: 500,
              borderColor: 'rgba(199, 158, 107, 0.5)',
            }}
          >
            {t('consultation')}
          </Link>

          {/* Language switcher */}
          <div ref={langRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setLangOpen((v) => !v)}
              style={{
                fontFamily: 'var(--font-jost)',
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#6E6A63',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 0',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              {locale.toUpperCase()}
              <span style={{ fontSize: 8 }}>&#9662;</span>
            </button>
            {langOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  background: '#15171C',
                  border: '1px solid rgba(199,158,107,0.15)',
                  minWidth: 64,
                  zIndex: 100,
                }}
              >
                {LOCALES.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => switchLocale(l)}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '8px 14px',
                      fontFamily: 'var(--font-jost)',
                      fontSize: 11,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: l === locale ? '#C79E6B' : '#8C877F',
                      background: l === locale ? 'rgba(199,158,107,0.08)' : 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-mp-muted hover:text-mp-gold transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden border-t"
          style={{
            backgroundColor: 'rgba(13, 14, 18, 0.97)',
            borderColor: 'rgba(199, 158, 107, 0.12)',
          }}
        >
          <nav className="max-w-[1280px] mx-auto px-8 flex flex-col gap-1 py-6">
            {anchorSections.map((link) => (
              <a
                key={link.hash}
                href={`/${locale}#${link.hash}`}
                onClick={() => setOpen(false)}
                className="px-3 py-3 text-[11px] tracking-[0.18em] uppercase text-mp-muted hover:text-mp-gold transition-colors"
                style={navLinkStyle}
              >
                {t(link.labelKey)}
              </a>
            ))}
            <Link
              href={`/${locale}/blog`}
              onClick={() => setOpen(false)}
              className="px-3 py-3 text-[11px] tracking-[0.18em] uppercase text-mp-muted hover:text-mp-gold transition-colors"
              style={navLinkStyle}
            >
              {t('blog')}
            </Link>
            <Link
              href={`/${locale}/consultation`}
              onClick={() => setOpen(false)}
              className="mt-3 px-3 py-3 text-[11px] tracking-[0.18em] uppercase text-mp-gold border border-mp-gold/40 hover:bg-mp-gold hover:text-mp-dark transition-all text-center"
              style={{ fontFamily: 'var(--font-jost)', fontWeight: 500 }}
            >
              {t('consultation')}
            </Link>

            {/* Mobile language switcher */}
            <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid rgba(199,158,107,0.1)' }}>
              <p style={{ fontFamily: 'var(--font-jost)', fontSize: 9, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#5E5A53', marginBottom: 8 }}>
                {t('language')}
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                {LOCALES.map((l) => (
                  <button
                    key={l}
                    onClick={() => { switchLocale(l); setOpen(false) }}
                    style={{
                      fontFamily: 'var(--font-jost)',
                      fontSize: 11,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: l === locale ? '#C79E6B' : '#6E6A63',
                      background: l === locale ? 'rgba(199,158,107,0.1)' : 'none',
                      border: `1px solid ${l === locale ? 'rgba(199,158,107,0.3)' : 'rgba(255,255,255,0.06)'}`,
                      padding: '6px 12px',
                      cursor: 'pointer',
                      borderRadius: 1,
                    }}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
