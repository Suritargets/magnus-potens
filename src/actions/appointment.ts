'use server'

import { db } from '@/db'
import { appointments, availabilityConfig } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { parseFormData, appointmentSchema, type ActionResult } from '@/lib/validations'
import { sendAppointmentEmails } from '@/lib/mail'
import { apiRateLimit, getClientIp } from '@/lib/rate-limit'
import { getLocale } from 'next-intl/server'

export async function bookAppointment(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  // Rate limit
  const ip = await getClientIp()
  const { success: allowed } = await apiRateLimit.limit(`appt:${ip}`)
  if (!allowed) {
    return { success: false, error: 'Too many requests. Please try again later.' }
  }

  const raw = {
    date:  formData.get('date'),
    time:  formData.get('time'),
    name:  formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone') || undefined,
    topic: formData.get('topic'),
    notes: formData.get('notes') || undefined,
  }

  const parsed = parseFormData(appointmentSchema, raw)
  if ('error' in parsed) {
    return { success: false, error: parsed.error, fieldErrors: parsed.fieldErrors }
  }

  const data = parsed.data
  const locale = await getLocale()

  // Verify the selected date's day-of-week is active
  const dayOfWeek = new Date(data.date).getUTCDay()
  const [config] = await db
    .select()
    .from(availabilityConfig)
    .where(and(eq(availabilityConfig.dayOfWeek, dayOfWeek), eq(availabilityConfig.isActive, true)))
    .limit(1)

  if (!config) {
    return { success: false, error: 'The selected date is not available for appointments.' }
  }

  // Check the slot is not already taken
  const existing = await db
    .select({ id: appointments.id })
    .from(appointments)
    .where(and(eq(appointments.date, data.date), eq(appointments.time, data.time)))
    .limit(1)

  if (existing.length > 0) {
    return { success: false, error: 'This time slot is no longer available. Please choose another.' }
  }

  try {
    await db.insert(appointments).values({
      date: data.date,
      time: data.time,
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      topic: data.topic,
      notes: data.notes ?? null,
      locale,
      ipAddress: ip,
    })

    await sendAppointmentEmails({
      name:  data.name,
      email: data.email,
      phone: data.phone,
      date:  data.date,
      time:  data.time,
      topic: data.topic,
      notes: data.notes,
    })

    return { success: true, message: 'Consultation requested.' }
  } catch (err) {
    console.error('bookAppointment error:', err)
    return { success: false, error: 'An error occurred. Please try again.' }
  }
}
