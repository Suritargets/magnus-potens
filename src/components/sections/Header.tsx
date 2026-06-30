'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '#firm', labelKey: 'firm' },
  { href: '#practice', labelKey: 'practice' },
  { href: '#approach', labelKey: 'approach' },
] as const

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const t = useTranslations('nav')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
        <Link href="/" className="flex flex-col leading-none group">
          <span
            className="text-[15px] tracking-[0.22em] text-mp-text-2 group-hover:text-mp-gold transition-colors duration-300"
            style={{ fontFamily: 'var(--font-marcellus)', }}
          >
            MAGNUS &amp; POTENS
          </span>
          <span
            className="text-[9px] tracking-[0.28em] text-mp-gold mt-[2px]"
            style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}
          >
            LAW &nbsp;|&nbsp; ADVISORS
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-9">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[11px] tracking-[0.18em] uppercase text-mp-muted hover:text-mp-gold transition-colors duration-300"
              style={{ fontFamily: 'var(--font-jost)', fontWeight: 400 }}
            >
              {t(link.labelKey)}
            </a>
          ))}
          <a
            href="#contact"
            className="text-[11px] tracking-[0.18em] uppercase px-5 py-2.5 border transition-all duration-300 hover:bg-mp-gold hover:border-mp-gold hover:text-mp-dark"
            style={{
              fontFamily: 'var(--font-jost)',
              fontWeight: 500,
              color: '#C79E6B',
              borderColor: 'rgba(199, 158, 107, 0.5)',
            }}
          >
            {t('consultation')}
          </a>
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
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-3 py-3 text-[11px] tracking-[0.18em] uppercase text-mp-muted hover:text-mp-gold transition-colors"
                style={{ fontFamily: 'var(--font-jost)' }}
              >
                {t(link.labelKey)}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-3 px-3 py-3 text-[11px] tracking-[0.18em] uppercase text-mp-gold border border-mp-gold/40 hover:bg-mp-gold hover:text-mp-dark transition-all text-center"
              style={{ fontFamily: 'var(--font-jost)', fontWeight: 500 }}
            >
              {t('consultation')}
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
