import createIntlMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { locales, defaultLocale } from '@/lib/i18n'
import { SESSION_COOKIE, verifySession } from '@/lib/session'

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
})

const PROTECTED_PATH = /^\/(?:[a-z]{2}\/)?(admin|dashboard)(\/|$)/

// Dev-only preview: admin UI lokaal bekijken zonder in te loggen (zie src/lib/auth.ts)
const devAdminPreview =
  process.env.NODE_ENV === 'development' && process.env.DEV_ADMIN_PREVIEW === 'true'

function handleNonApiRoute(req: NextRequest): NextResponse {
  // App-routes zonder taalprefix (bv. /admin/blog, /sign-in) intern
  // herschrijven naar de default locale, zodat interne links blijven werken.
  const { pathname } = req.nextUrl
  if (/^\/(admin|dashboard|sign-in)(\/|$)/.test(pathname)) {
    const url = req.nextUrl.clone()
    url.pathname = `/${defaultLocale}${pathname}`
    return NextResponse.rewrite(url)
  }
  return intlMiddleware(req)
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // API-routes hebben geen locale-prefix nodig en mogen next-intl niet raken.
  if (pathname.startsWith('/api')) return NextResponse.next()

  if (PROTECTED_PATH.test(pathname) && !devAdminPreview) {
    const token = req.cookies.get(SESSION_COOKIE)?.value
    const session = token ? await verifySession(token) : null

    if (!session) {
      const localeMatch = pathname.match(/^\/([a-z]{2})\//)
      const locale = localeMatch?.[1] ?? defaultLocale
      const url = req.nextUrl.clone()
      url.pathname = `/${locale}/sign-in`
      return NextResponse.redirect(url)
    }
  }

  return handleNonApiRoute(req)
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|xml|txt)).*)',
    '/(api|trpc)(.*)',
  ],
}
