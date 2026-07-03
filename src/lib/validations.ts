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

// ─── CMS PAGE ─────────────────────────────────────────────────────────────────
export const pageSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  content: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  published: z.boolean().optional(),
})

export type PageFormData = z.infer<typeof pageSchema>

// ─── BLOG POST ────────────────────────────────────────────────────────────────
export const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  excerpt: z.string().max(400).optional(),
  content: z.string().min(1, 'Content is required'),
  coverImage: z.string().url('Invalid URL').optional().or(z.literal('')),
  tags: z.string().optional(),
  locale: z.enum(['en', 'nl', 'es', 'fr', 'pt', 'zh']).default('en'),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  publishedAt: z.string().optional(),
})

export type BlogPostFormData = z.infer<typeof blogPostSchema>

// ─── APPOINTMENT ──────────────────────────────────────────────────────────────
export const appointmentSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Please enter a phone number').max(30),
  address: z.string().max(200).optional(),
  topic: z.string().min(1, 'Please select a service').max(100),
  notes: z.string().max(1000).optional(),
})

export type AppointmentFormData = z.infer<typeof appointmentSchema>

// ─── AVAILABILITY CONFIG ──────────────────────────────────────────────────────
export const availabilityConfigSchema = z.object({
  dayOfWeek: z.coerce.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  slotDuration: z.coerce.number().int().min(15).max(240).default(60),
  isActive: z.boolean().default(true),
})

export type AvailabilityConfigFormData = z.infer<typeof availabilityConfigSchema>

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
