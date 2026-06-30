import type { Metadata } from 'next'
import { Hero } from '@/components/sections/Hero'
import { FirmStatement } from '@/components/sections/FirmStatement'
import { Practice } from '@/components/sections/Practice'
import { Approach } from '@/components/sections/Approach'
import { SloganBand } from '@/components/sections/SloganBand'
import { Contact } from '@/components/sections/Contact'

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Magnus & Potens — boutique legal and advisory counsel for those who move with purpose. Your Shield. Our Purpose.',
}

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FirmStatement />
      <Practice />
      <Approach />
      <SloganBand />
      <Contact />
    </main>
  )
}
