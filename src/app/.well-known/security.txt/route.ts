import { NextResponse } from 'next/server'

// RFC 9116 — /.well-known/security.txt: hoe onderzoekers een kwetsbaarheid
// verantwoord kunnen melden.
export async function GET() {
  const body = `Contact: mailto:info@magnus-potens.com
Preferred-Languages: en, nl
Canonical: https://magnus-potens.com/.well-known/security.txt
`

  return new NextResponse(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
