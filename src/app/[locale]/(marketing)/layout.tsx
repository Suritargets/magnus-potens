import { Suspense } from 'react'
import { Header } from '@/components/sections/Header'
import { Footer } from '@/components/sections/Footer'
import { CookieConsent } from '@/components/sections/CookieConsent'
import { BackToTop } from '@/components/sections/BackToTop'
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
      <BackToTop />
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  )
}
