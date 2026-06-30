import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  pgEnum,
} from 'drizzle-orm/pg-core'

// ─── ENUMS ────────────────────────────────────────────────────────────────────
export const userRoleEnum = pgEnum('user_role', ['user', 'admin', 'super_admin'])
export const submissionStatusEnum = pgEnum('submission_status', ['new', 'read', 'replied', 'archived'])

// ─── USERS ────────────────────────────────────────────────────────────────────
export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  clerkId: text('clerk_id').notNull().unique(),
  email: text('email').notNull(),
  name: text('name'),
  role: userRoleEnum('role').default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ─── CONTACT SUBMISSIONS ──────────────────────────────────────────────────────
export const contactSubmissions = pgTable('contact_submissions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject'),
  message: text('message').notNull(),
  status: submissionStatusEnum('status').default('new').notNull(),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─── AUDIT LOG ────────────────────────────────────────────────────────────────
export const auditLog = pgTable('audit_log', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id),
  action: text('action').notNull(),
  resource: text('resource'),
  resourceId: text('resource_id'),
  metadata: text('metadata'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─── RATE LIMIT EVENTS ────────────────────────────────────────────────────────
export const rateLimitEvents = pgTable('rate_limit_events', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  identifier: text('identifier').notNull(),
  action: text('action').notNull(),
  count: integer('count').default(1).notNull(),
  windowStart: timestamp('window_start').defaultNow().notNull(),
  blocked: boolean('blocked').default(false).notNull(),
})

// ─── ERROR LOGS ───────────────────────────────────────────────────────────────
export const errorLogs = pgTable('error_logs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  message: text('message').notNull(),
  digest: text('digest'),
  stack: text('stack'),
  url: text('url'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  resolved: boolean('resolved').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─── CMS PAGES ────────────────────────────────────────────────────────────────
export const pages = pgTable('pages', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  slug: text('slug').unique().notNull(),
  title: text('title').notNull(),
  content: text('content'),
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  published: boolean('published').default(false).notNull(),
  createdBy: text('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ─── TYPES ────────────────────────────────────────────────────────────────────
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type ContactSubmission = typeof contactSubmissions.$inferSelect
export type NewContactSubmission = typeof contactSubmissions.$inferInsert
export type AuditLogEntry = typeof auditLog.$inferSelect
export type ErrorLog = typeof errorLogs.$inferSelect
export type Page = typeof pages.$inferSelect
export type NewPage = typeof pages.$inferInsert
