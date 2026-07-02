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

// clerkMiddleware() zelf crasht zonder publishableKey — pas activeren als de
// keys echt gezet zijn. Zonder Clerk blijft de rest van de site gewoon werken.
const hasClerkKey = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith('pk_')

function handleNonApiRoute(req: NextRequest): NextResponse {
  // App-routes zonder taalprefix (bv. /admin/blog, /sign-in) intern
  // herschrijven naar de default locale, zodat interne links blijven werken.
  const { pathname } = req.nextUrl
  if (/^\/(admin|dashboard|sign-in|sign-up)(\/|$)/.test(pathname)) {
    const url = req.nextUrl.clone()
    url.pathname = `/${defaultLocale}${pathname}`
    return NextResponse.rewrite(url)
  }
  return intlMiddleware(req)
}

export default hasClerkKey
  ? clerkMiddleware(async (auth, req: NextRequest) => {
      if (isProtectedRoute(req) && !devAdminPreview) await auth.protect()
      // API-routes hebben geen locale-prefix nodig en mogen next-intl niet raken.
      if (req.nextUrl.pathname.startsWith('/api')) return NextResponse.next()
      return handleNonApiRoute(req)
    })
  : function middleware(req: NextRequest) {
      // Geen Clerk geconfigureerd: admin/dashboard blijven onbereikbaar
      // (geen auth backend) — de rest van de site werkt gewoon door.
      if (isProtectedRoute(req) && !devAdminPreview) {
        const url = req.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
      }
      if (req.nextUrl.pathname.startsWith('/api')) return NextResponse.next()
      return handleNonApiRoute(req)
    }

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
