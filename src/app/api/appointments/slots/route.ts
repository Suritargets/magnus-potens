import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { appointments, availabilityConfig } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

export const runtime = 'nodejs'

export async function GET(req: NextRequest): Promise<NextResponse> {
  const date = req.nextUrl.searchParams.get('date')

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Invalid date format. Use YYYY-MM-DD.' }, { status: 400 })
  }

  const dayOfWeek = new Date(date).getUTCDay()

  const [config] = await db
    .select()
    .from(availabilityConfig)
    .where(and(eq(availabilityConfig.dayOfWeek, dayOfWeek), eq(availabilityConfig.isActive, true)))
    .limit(1)

  if (!config) {
    return NextResponse.json({ available: false, slots: [], booked: [] })
  }

  // Generate all slots for this day
  const allSlots = generateSlots(config.startTime, config.endTime, config.slotDuration)

  // Find already booked times
  const bookedRows = await db
    .select({ time: appointments.time })
    .from(appointments)
    .where(
      and(
        eq(appointments.date, date),
        // Exclude cancelled appointments so those slots open back up
        eq(appointments.status, 'pending')
      )
    )

  const bookedTimes = new Set(bookedRows.map((r) => r.time))

  // Also include confirmed ones as booked
  const confirmedRows = await db
    .select({ time: appointments.time })
    .from(appointments)
    .where(and(eq(appointments.date, date), eq(appointments.status, 'confirmed')))

  confirmedRows.forEach((r) => bookedTimes.add(r.time))

  return NextResponse.json({
    available: true,
    slots: allSlots,
    booked: Array.from(bookedTimes),
    config: {
      startTime: config.startTime,
      endTime: config.endTime,
      slotDuration: config.slotDuration,
    },
  })
}

function generateSlots(startTime: string, endTime: string, durationMinutes: number): string[] {
  const slots: string[] = []
  const [startH, startM] = startTime.split(':').map(Number)
  const [endH, endM] = endTime.split(':').map(Number)

  let current = startH * 60 + startM
  const end = endH * 60 + endM

  while (current + durationMinutes <= end) {
    const h = Math.floor(current / 60)
    const m = current % 60
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    current += durationMinutes
  }

  return slots
}
