'use server'

import { contactSchema, parseFormData, type ActionResult } from '@/lib/validations'
import { sendContactNotification } from '@/lib/mail'
import { contactRateLimit, getClientIp } from '@/lib/rate-limit'
import { db } from '@/db'
import { contactSubmissions } from '@/db/schema'

// Signature compatible with useActionState (first arg = previous state)
export async function submitContact(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  // 1. Rate limiting
  const ip = getClientIp()
  const { success: allowed } = await contactRateLimit.limit(ip)
  if (!allowed) {
    return { success: false, error: 'Too many requests. Please try again in 10 minutes.' }
  }

  // 2. Honeypot check
  if (formData.get('_hp_website')) {
    return { success: true } // Silent rejection — bot
  }

  // 3. Validation
  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone') || undefined,
    subject: formData.get('subject') || undefined,
    message: formData.get('message'),
  }

  const parsed = parseFormData(contactSchema, raw)
  if ('error' in parsed) {
    return { success: false, error: parsed.error, fieldErrors: parsed.fieldErrors }
  }

  const data = parsed.data

  try {
    // 4. Save to DB
    await db.insert(contactSubmissions).values({
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      ipAddress: ip,
    })

    // 5. Email notifications
    await sendContactNotification({
      name: data.name,
      email: data.email,
      message: data.message,
      subject: data.subject,
    })

    return { success: true, message: 'Thank you. We will be in touch shortly.' }
  } catch (error) {
    console.error('Contact action error:', error)
    return { success: false, error: 'An error occurred. Please try again later.' }
  }
}
