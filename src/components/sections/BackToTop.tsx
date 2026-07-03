'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

const SHOW_AFTER_PX = 480

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > SHOW_AFTER_PX)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      style={{
        position: 'fixed',
        right: 20,
        bottom: 20,
        zIndex: 150,
        width: 44,
        height: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        background: '#15171C',
        border: '1px solid rgba(199,158,107,0.3)',
        color: '#C79E6B',
        cursor: 'pointer',
        boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.25s ease, transform 0.25s ease, border-color 0.2s ease',
      }}
      onMouseOver={(e) => { e.currentTarget.style.borderColor = 'rgba(199,158,107,0.7)' }}
      onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(199,158,107,0.3)' }}
    >
      <ArrowUp size={18} strokeWidth={1.75} />
    </button>
  )
}
