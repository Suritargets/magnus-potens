import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  pgEnum,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// --- ENUMS ---
export const userRoleEnum = pgEnum('user_role', ['user', 'admin', 'super_admin'])
export const submissionStatusEnum = pgEnum('submission_status', ['new', 'read', 'replied', 'archived'])

// --- USERS ---
export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  clerkId: text('clerk_id').notNull().unique(),
  email: text('email').notNull(),
  name: text('name'),
  role: userRoleEnum('role').default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// --- CONTACT SUBMISSIONS ---
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

// --- AUDIT LOG ---
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

// --- RATE LIMIT EVENTS ---
export const rateLimitEvents = pgTable('rate_limit_events', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  identifier: text('identifier').notNull(),
  action: text('action').notNull(),
  count: integer('count').default(1).notNull(),
  windowStart: timestamp('window_start').defaultNow().notNull(),
  blocked: boolean('blocked').default(false).notNull(),
})

// --- ERROR LOGS ---
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

// --- CMS PAGES ---
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

// --- TYPES ---
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type ContactSubmission = typeof contactSubmissions.$inferSelect
export type NewContactSubmission = typeof contactSubmissions.$inferInsert
export type AuditLogEntry = typeof auditLog.$inferSelect
export type ErrorLog = typeof errorLogs.$inferSelect
export type Page = typeof pages.$inferSelect
export type NewPage = typeof pages.$inferInsert

// --- BLOG / APPOINTMENT ENUMS ---
export const postStatusEnum = pgEnum('post_status', ['draft', 'published', 'archived'])
export const postCategoryEnum = pgEnum('post_category', ['news', 'event', 'use_case'])
export const appointmentStatusEnum = pgEnum('appointment_status', ['pending', 'confirmed', 'cancelled'])

// --- BLOG POSTS ---
export const blogPosts = pgTable('blog_posts', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  slug: text('slug').unique().notNull(),
  locale: text('locale').default('en').notNull(),
  title: text('title').notNull(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  coverImage: text('cover_image'),
  tags: text('tags'),
  category: postCategoryEnum('category').default('news').notNull(),
  status: postStatusEnum('status').default('draft').notNull(),
  publishedAt: timestamp('published_at'),
  authorId: text('author_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// --- APPOINTMENTS ---
export const appointments = pgTable('appointments', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  date: text('date').notNull(),
  time: text('time').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  address: text('address'),
  topic: text('topic'),
  notes: text('notes'),
  locale: text('locale').default('en').notNull(),
  status: appointmentStatusEnum('status').default('pending').notNull(),
  confirmedAt: timestamp('confirmed_at'),
  cancelledAt: timestamp('cancelled_at'),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// --- AVAILABILITY CONFIG ---
export const availabilityConfig = pgTable('availability_config', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  dayOfWeek: integer('day_of_week').notNull(),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  slotDuration: integer('slot_duration').default(60).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
})

// --- AVAILABILITY OVERRIDES (datum-specifiek: vakantie, feestdag, afwijkende tijden) ---
export const availabilityOverrides = pgTable('availability_overrides', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  date: text('date').unique().notNull(),        // 'YYYY-MM-DD'
  isClosed: boolean('is_closed').default(true).notNull(),
  startTime: text('start_time'),                // alleen bij afwijkende tijden
  endTime: text('end_time'),
  note: text('note'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// --- HOMEPAGE CONTENT (per taal override op de statische vertalingen) ---
export const homepageContent = pgTable('homepage_content', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  locale: text('locale').unique().notNull(),
  content: text('content').notNull(), // JSON: { hero, firm, practice, approach, slogan, contact }
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// --- PAGE VIEWS (eigen lichte analytics, geen cookie, geen derde partij) ---
export const pageViews = pgTable('page_views', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  path: text('path').notNull(),
  locale: text('locale').notNull(),
  referrer: text('referrer'),
  // Eenrichtings-hash van IP + user-agent — nooit het IP zelf opgeslagen.
  visitorHash: text('visitor_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// --- MEDIA ASSETS ---
export const mediaAssets = pgTable('media_assets', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  publicId: text('public_id').notNull(),
  url: text('url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  filename: text('filename').notNull(),
  mimeType: text('mime_type').notNull(),
  size: integer('size'),
  width: integer('width'),
  height: integer('height'),
  alt: text('alt'),
  uploadedBy: text('uploaded_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// --- NEW TYPES ---
export type BlogPost = typeof blogPosts.$inferSelect
export type NewBlogPost = typeof blogPosts.$inferInsert
export type Appointment = typeof appointments.$inferSelect
export type NewAppointment = typeof appointments.$inferInsert
export type AvailabilityConfig = typeof availabilityConfig.$inferSelect
export type NewAvailabilityConfig = typeof availabilityConfig.$inferInsert
export type AvailabilityOverride = typeof availabilityOverrides.$inferSelect
export type NewAvailabilityOverride = typeof availabilityOverrides.$inferInsert
export type MediaAsset = typeof mediaAssets.$inferSelect
export type NewMediaAsset = typeof mediaAssets.$inferInsert
export type HomepageContent = typeof homepageContent.$inferSelect
export type NewHomepageContent = typeof homepageContent.$inferInsert
export type PageView = typeof pageViews.$inferSelect
export type NewPageView = typeof pageViews.$inferInsert

// --- RELATIONS (Drizzle Relations v2) ---
// Enables: db.query.users.findMany({ with: { blogPosts: true } })

export const usersRelations = relations(users, ({ many }) => ({
  blogPosts: many(blogPosts),
  mediaAssets: many(mediaAssets),
  auditLogs: many(auditLog),
  pages: many(pages),
}))

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
  }),
}))

export const mediaAssetsRelations = relations(mediaAssets, ({ one }) => ({
  uploader: one(users, {
    fields: [mediaAssets.uploadedBy],
    references: [users.id],
  }),
}))

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  user: one(users, {
    fields: [auditLog.userId],
    references: [users.id],
  }),
}))

export const pagesRelations = relations(pages, ({ one }) => ({
  creator: one(users, {
    fields: [pages.createdBy],
    references: [users.id],
  }),
}))
