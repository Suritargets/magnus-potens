import { z } from 'zod'

// ─── CONTACT FORM ─────────────────────────────────────────────────────────────
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(20).optional(),
  subject: z.string().max(200).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
  // Honeypot — must be empty
  website: z.string().max(0, 'Bot detected').optional(),
})

export type ContactFormData = z.infer<typeof contactSchema>

// ─── NEWSLETTER ───────────────────────────────────────────────────────────────
export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
})

// ─── QUOTE REQUEST ────────────────────────────────────────────────────────────
export const quoteSchema = z.object({
  name: z.string().min(2).max(100),
  company: z.string().max(100).optional(),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  projectType: z.enum(['website', 'webapp', 'ecommerce', 'fintech', 'other']),
  budget: z.enum(['<5k', '5k-15k', '15k-50k', '>50k', 'unknown']).optional(),
  deadline: z.string().max(100).optional(),
  description: z.string().min(20).max(3000),
})

export type QuoteFormData = z.infer<typeof quoteSchema>

// ─── HELPERS ──────────────────────────────────────────────────────────────────
export type ActionResult<T = void> = {
  success: boolean
  error?: string | null
  data?: T
  message?: string
  fieldErrors?: Record<string, string[]>
}

export function parseFormData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { data: T } | { error: string; fieldErrors: Record<string, string[]> } {
  const result = schema.safeParse(data)
  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {}
    result.error.errors.forEach((err) => {
      const field = err.path.join('.')
      if (!fieldErrors[field]) fieldErrors[field] = []
      fieldErrors[field].push(err.message)
    })
    return { error: 'Validation error', fieldErrors }
  }
  return { data: result.data }
}
