import { db } from '@/db'
import { blogPosts, type BlogPost } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { requireRole } from '@/lib/auth'
import { BlogEditor } from './BlogEditor'

interface Props {
  params: Promise<{ groupId: string }>
}

export default async function BlogEditorRoute({ params }: Props) {
  await requireRole('admin', 'super_admin')
  const { groupId } = await params

  if (groupId === 'nieuw') {
    return <BlogEditor groupId={null} variants={{}} />
  }

  const rows = await db.select().from(blogPosts).where(eq(blogPosts.translationGroupId, groupId))
  if (rows.length === 0) notFound()

  const variants: Partial<Record<string, BlogPost>> = {}
  for (const row of rows) variants[row.locale] = row

  return <BlogEditor groupId={groupId} variants={variants} />
}
