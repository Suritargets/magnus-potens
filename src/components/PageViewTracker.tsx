'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useLocale } from 'next-intl'

export function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const locale = useLocale()

  useEffect(() => {
    const payload = JSON.stringify({
      path: pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ''),
      locale,
      referrer: document.referrer || null,
    })

    // sendBeacon werkt ook betrouwbaar tijdens paginanavigatie/unload.
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' })
      navigator.sendBeacon('/api/analytics/track', blob)
    } else {
      fetch('/api/analytics/track', { method: 'POST', body: payload, keepalive: true }).catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams.toString()])

  return null
}
