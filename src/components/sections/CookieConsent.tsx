'use client'

import { useEffect, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'

const STORAGE_KEY = 'mp-cookie-consent'

export function CookieConsent() {
  const t = useTranslations('cookies')
  const locale = useLocale()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setVisible(false)
  }

  function reject() {
    // Er is niets te blokkeren (alleen strikt noodzakelijke cookies, geen
    // tracking) — "weigeren" betekent hier alleen: banner sluiten en de
    // keuze onthouden, zodat niet bij elk bezoek opnieuw gevraagd wordt.
    localStorage.setItem(STORAGE_KEY, 'rejected')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      style={{
        position: 'fixed',
        left: 16,
        right: 16,
        bottom: 16,
        zIndex: 200,
        maxWidth: 640,
        margin: '0 auto',
        background: '#15171C',
        border: '1px solid rgba(199,158,107,0.25)',
        borderRadius: 2,
        padding: '18px 20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 16,
        boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
      }}
    >
      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, lineHeight: 1.6, color: '#A7A29A', margin: 0, flex: '1 1 320px' }}>
        {t('message')}{' '}
        <a
          href={`/${locale}/privacy`}
          style={{ color: '#C79E6B', textDecoration: 'underline' }}
        >
          {t('learn_more')}
        </a>
      </p>
      <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
        <button
          type="button"
          onClick={reject}
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 11,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#8C877F',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.12)',
            padding: '11px 22px',
            cursor: 'pointer',
            borderRadius: 1,
          }}
        >
          {t('reject')}
        </button>
        <button
          type="button"
          onClick={accept}
          className="mp-shimmer"
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 11,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#0F1014',
            background: '#C79E6B',
            border: 'none',
            padding: '11px 24px',
            cursor: 'pointer',
            borderRadius: 1,
          }}
        >
          {t('accept')}
        </button>
      </div>
    </div>
  )
}
