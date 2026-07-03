import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { requireRole, getCurrentUser } from '@/lib/auth'
import { UserEditor } from './UserEditor'

interface Props {
  params: Promise<{ id: string }>
}

export default async function UserDetailPage({ params }: Props) {
  await requireRole('super_admin')
  const { id } = await params

  if (id === 'nieuw') {
    return <UserEditor user={null} isSelf={false} />
  }

  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1)
  if (!user) notFound()

  const current = await getCurrentUser()
  return <UserEditor user={user} isSelf={current?.id === user.id} />
}
