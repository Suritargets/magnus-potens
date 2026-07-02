import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import createIntlMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { locales, defaultLocale } from '@/lib/i18n'

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
})

const isProtectedRoute = createRouteMatcher([
  '/:locale/dashboard(.*)',
  '/:locale/admin(.*)',
  '/dashboard(.*)',
  '/admin(.*)',
])

// Dev-only preview: admin UI lokaal bekijken zonder Clerk (zie src/lib/auth.ts)
const devAdminPreview =
  process.env.NODE_ENV === 'development' && process.env.DEV_ADMIN_PREVIEW === 'true'

export default clerkMiddleware(async (auth, req: NextRequest) => {
  if (isProtectedRoute(req) && !devAdminPreview) await auth.protect()

  // App-routes zonder taalprefix (bv. /admin/blog, /sign-in) intern
  // herschrijven naar de default locale, zodat interne links blijven werken.
  const { pathname } = req.nextUrl
  if (/^\/(admin|dashboard|sign-in|sign-up)(\/|$)/.test(pathname)) {
    const url = req.nextUrl.clone()
    url.pathname = `/${defaultLocale}${pathname}`
    return NextResponse.rewrite(url)
  }

  return intlMiddleware(req)
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
