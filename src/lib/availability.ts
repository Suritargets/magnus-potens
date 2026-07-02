import 'server-only'
import { db } from '@/db'
import { appointments, availabilityConfig, availabilityOverrides } from '@/db/schema'
import { and, eq, gte, lte, ne } from 'drizzle-orm'

export function generateSlots(startTime: string, endTime: string, durationMinutes: number): string[] {
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

export interface DayAvailability {
  date: string
  open: boolean
  /** Alle slots van de dag met bezet-status (geen klantgegevens). */
  slots: { time: string; free: boolean }[]
}

/**
 * Beschikbaarheid voor één dag: weekschema + datum-override + geboekte tijden.
 */
export async function getDayAvailability(date: string): Promise<DayAvailability> {
  const dayOfWeek = new Date(`${date}T00:00:00Z`).getUTCDay()

  const [config] = await db
    .select()
    .from(availabilityConfig)
    .where(and(eq(availabilityConfig.dayOfWeek, dayOfWeek), eq(availabilityConfig.isActive, true)))
    .limit(1)

  const [override] = await db
    .select()
    .from(availabilityOverrides)
    .where(eq(availabilityOverrides.date, date))
    .limit(1)

  if (override?.isClosed) return { date, open: false, slots: [] }

  const startTime = override?.startTime ?? config?.startTime
  const endTime = override?.endTime ?? config?.endTime
  const slotDuration = config?.slotDuration ?? 60

  if (!startTime || !endTime || (!config && !override)) {
    return { date, open: false, slots: [] }
  }

  const allSlots = generateSlots(startTime, endTime, slotDuration)

  const bookedRows = await db
    .select({ time: appointments.time })
    .from(appointments)
    .where(and(eq(appointments.date, date), ne(appointments.status, 'cancelled')))

  const booked = new Set(bookedRows.map((r) => r.time))

  return {
    date,
    open: allSlots.length > 0,
    slots: allSlots.map((time) => ({ time, free: !booked.has(time) })),
  }
}

export interface MonthDay {
  date: string
  open: boolean
  freeCount: number
  totalCount: number
}

/**
 * Beschikbaarheid per dag voor een hele maand — 3 queries totaal.
 * Publieke data: alleen aantallen, geen klantgegevens.
 */
export async function getMonthAvailability(year: number, month: number): Promise<MonthDay[]> {
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const mm = String(month).padStart(2, '0')
  const first = `${year}-${mm}-01`
  const last = `${year}-${mm}-${String(daysInMonth).padStart(2, '0')}`

  const [configs, overrides, bookedRows] = await Promise.all([
    db.select().from(availabilityConfig).where(eq(availabilityConfig.isActive, true)),
    db.select().from(availabilityOverrides).where(and(gte(availabilityOverrides.date, first), lte(availabilityOverrides.date, last))),
    db
      .select({ date: appointments.date, time: appointments.time })
      .from(appointments)
      .where(and(gte(appointments.date, first), lte(appointments.date, last), ne(appointments.status, 'cancelled'))),
  ])

  const configByDow = new Map(configs.map((c) => [c.dayOfWeek, c]))
  const overrideByDate = new Map(overrides.map((o) => [o.date, o]))
  const bookedByDate = new Map<string, Set<string>>()
  for (const row of bookedRows) {
    if (!bookedByDate.has(row.date)) bookedByDate.set(row.date, new Set())
    bookedByDate.get(row.date)!.add(row.time)
  }

  const days: MonthDay[] = []
  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${year}-${mm}-${String(d).padStart(2, '0')}`
    const dow = new Date(`${date}T00:00:00Z`).getUTCDay()
    const config = configByDow.get(dow)
    const override = overrideByDate.get(date)

    if (override?.isClosed || (!config && !override?.startTime)) {
      days.push({ date, open: false, freeCount: 0, totalCount: 0 })
      continue
    }

    const startTime = override?.startTime ?? config?.startTime
    const endTime = override?.endTime ?? config?.endTime
    const slotDuration = config?.slotDuration ?? 60

    if (!startTime || !endTime) {
      days.push({ date, open: false, freeCount: 0, totalCount: 0 })
      continue
    }

    const slots = generateSlots(startTime, endTime, slotDuration)
    const booked = bookedByDate.get(date) ?? new Set()
    const freeCount = slots.filter((t) => !booked.has(t)).length

    days.push({ date, open: slots.length > 0, freeCount, totalCount: slots.length })
  }

  return days
}
