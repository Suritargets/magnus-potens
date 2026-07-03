import { NextResponse } from 'next/server'
import enMessages from '@/messages/en.json'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://magnus-potens.com'

// llms.txt (llmstxt.org) — een korte, structuurvaste beschrijving van de site
// voor AI/LLM-crawlers, los van de HTML-rendering. Onderdeel van GEO
// (Generative Engine Optimization) naast de reguliere sitemap/robots/JSON-LD.
export async function GET() {
  const body = `# Magnus & Potens

> ${enMessages.firm.statement}

Magnus & Potens is a boutique legal and advisory firm. Practice areas: Corporate & Commercial, Litigation, Strategic Advisory, Digital Transformation, Dispute Resolution, Regulatory & Compliance.

The site is available in English, Dutch, Spanish, French, Portuguese, and Simplified Chinese (locale prefixes /nl, /es, /fr, /pt, /zh; English has no prefix).

## Pages

- [Home](${BASE_URL}/): firm overview, practice areas, approach, contact
- [Insights](${BASE_URL}/blog): articles and perspectives from the firm
- [Consultation](${BASE_URL}/consultation): book a confidential consultation
- [Privacy Policy](${BASE_URL}/privacy)
- [Terms of Service](${BASE_URL}/terms)

## Contact

- Email: info@magnus-potens.com
- Website: ${BASE_URL}

## Notes

- Consultations are by appointment; use the booking form on the Consultation page.
- Website content is general information and does not constitute legal advice.
`

  return new NextResponse(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
