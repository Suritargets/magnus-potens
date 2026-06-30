import { db } from '@/db'
import { pages } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { CmsEditor } from './CmsEditor'

interface Props {
  params: Promise<{ id: string }>
}

export default async function CmsEditPage({ params }: Props) {
  const { id } = await params

  // "nieuw" → empty editor
  if (id === 'nieuw') {
    return <CmsEditor page={null} />
  }

  const [page] = await db
    .select()
    .from(pages)
    .where(eq(pages.id, id))
    .limit(1)

  if (!page) notFound()

  return <CmsEditor page={page} />
}
