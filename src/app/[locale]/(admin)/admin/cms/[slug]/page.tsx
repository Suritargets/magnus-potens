import { db } from '@/db'
import { pages, type Page } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { requireRole } from '@/lib/auth'
import { CmsEditor } from './CmsEditor'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function CmsPageEditorRoute({ params }: Props) {
  await requireRole('admin', 'super_admin')
  const { slug } = await params

  if (slug === 'nieuw') {
    return <CmsEditor slug={null} variants={{}} />
  }

  const rows = await db.select().from(pages).where(eq(pages.slug, slug))
  if (rows.length === 0) notFound()

  const variants: Partial<Record<string, Page>> = {}
  for (const row of rows) variants[row.locale ?? 'all'] = row

  return <CmsEditor slug={slug} variants={variants} />
}
