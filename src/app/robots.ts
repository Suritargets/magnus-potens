import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://magnus-potens.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/sign-in', '/api'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
