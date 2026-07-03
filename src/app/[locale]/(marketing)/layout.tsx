import { Header } from '@/components/sections/Header'
import { Footer } from '@/components/sections/Footer'
import { CookieConsent } from '@/components/sections/CookieConsent'

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
    </>
  )
}
