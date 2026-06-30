import { db } from '@/db'
import { blogPosts } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { BlogEditor } from './BlogEditor'

interface Props {
  params: Promise<{ id: string }>
}

export default async function BlogEditPage({ params }: Props) {
  const { id } = await params

  if (id === 'nieuw') {
    return <BlogEditor post={null} />
  }

  const [post] = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.id, id))
    .limit(1)

  if (!post) notFound()

  return <BlogEditor post={post} />
}
