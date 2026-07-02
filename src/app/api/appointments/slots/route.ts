import { NextRequest, NextResponse } from 'next/server'
import { getDayAvailability } from '@/lib/availability'

export const runtime = 'nodejs'

// GET /api/appointments/slots?date=YYYY-MM-DD
// Alle slots van de dag met vrij/bezet status — geen klantgegevens.
export async function GET(req: NextRequest): Promise<NextResponse> {
  const date = req.nextUrl.searchParams.get('date')

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Invalid date format. Use YYYY-MM-DD.' }, { status: 400 })
  }

  try {
    const day = await getDayAvailability(date)
    return NextResponse.json({
      available: day.open,
      slots: day.slots,
    })
  } catch {
    return NextResponse.json({ available: false, slots: [] })
  }
}
