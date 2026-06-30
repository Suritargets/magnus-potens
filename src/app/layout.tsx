import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata: Metadata = {
  title: {
    default: 'Magnus & Potens',
    template: '%s | Magnus & Potens',
  },
  description:
    'Boutique legal and advisory counsel for high-net-worth individuals, entrepreneurs, family businesses, and those who lead.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://magnus-potens.com',
    siteName: 'Magnus & Potens',
    title: 'Magnus & Potens — Your Shield. Our Purpose.',
    description:
      'Boutique legal and advisory counsel — protecting rights, guiding decisions, and supporting clients with discretion, strength, and purpose.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Magnus & Potens — Your Shield. Our Purpose.',
    description:
      'Boutique legal and advisory counsel for those who move with purpose.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      {children}
      <SpeedInsights />
    </ClerkProvider>
  )
}
