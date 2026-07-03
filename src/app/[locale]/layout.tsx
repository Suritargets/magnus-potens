import { NextIntlClientProvider, type AbstractIntlMessages } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales, type Locale } from '@/lib/i18n'
import { getHomepageOverride, mergeHomepageMessages } from '@/lib/homepage-content'
import { Cormorant_Garamond, Marcellus, Jost } from 'next/font/google'
import '@/styles/globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const marcellus = Marcellus({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-marcellus',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-jost',
  display: 'swap',
})

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  const locale = locales.includes(rawLocale as Locale) ? (rawLocale as Locale) : null

  if (!locale) notFound()

  const [messages, override] = await Promise.all([
    getMessages(),
    getHomepageOverride(locale),
  ])
  const mergedMessages = mergeHomepageMessages(messages, override) as AbstractIntlMessages

  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${marcellus.variable} ${jost.variable}`}
    >
      <body
        className="min-h-screen antialiased"
        style={{ backgroundColor: '#0F1014', color: '#E9E3D6' }}
      >
        <NextIntlClientProvider messages={mergedMessages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
