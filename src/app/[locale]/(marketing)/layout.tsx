import { Header } from '@/components/sections/Header'
import { Footer } from '@/components/sections/Footer'

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
    </>
  )
}
