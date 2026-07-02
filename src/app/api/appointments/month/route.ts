import { NextRequest, NextResponse } from 'next/server'
import { getMonthAvailability } from '@/lib/availability'

export const runtime = 'nodejs'

// GET /api/appointments/month?month=YYYY-MM
// Publieke maand-beschikbaarheid: per dag open/vrij-teller, geen klantgegevens.
export async function GET(req: NextRequest): Promise<NextResponse> {
  const monthParam = req.nextUrl.searchParams.get('month')

  if (!monthParam || !/^\d{4}-\d{2}$/.test(monthParam)) {
    return NextResponse.json({ error: 'Invalid month format. Use YYYY-MM.' }, { status: 400 })
  }

  const [year, month] = monthParam.split('-').map(Number)
  if (month < 1 || month > 12) {
    return NextResponse.json({ error: 'Month out of range.' }, { status: 400 })
  }

  try {
    const days = await getMonthAvailability(year, month)
    return NextResponse.json({ month: monthParam, days })
  } catch {
    return NextResponse.json({ month: monthParam, days: [] })
  }
}
