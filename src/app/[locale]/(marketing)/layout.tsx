import { Suspense } from 'react'
import { Header } from '@/components/sections/Header'
import { Footer } from '@/components/sections/Footer'
import { CookieConsent } from '@/components/sections/CookieConsent'
import { PageViewTracker } from '@/components/PageViewTracker'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <CookieConsent />
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  )
}
