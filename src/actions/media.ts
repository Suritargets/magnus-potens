'use server'

import { db } from '@/db'
import { mediaAssets } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { requireRole } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { del } from '@vercel/blob'

export async function deleteMediaAsset(id: string): Promise<void> {
  await requireRole('admin', 'super_admin')

  const [asset] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, id)).limit(1)
  if (!asset) return

  // Blob eerst verwijderen; DB alleen als dat lukt (of als blob al weg is)
  try {
    await del(asset.url)
  } catch (err) {
    console.warn('Blob delete failed (mogelijk al verwijderd):', err)
  }

  await db.delete(mediaAssets).where(eq(mediaAssets.id, id))
  revalidatePath('/admin/media')
}
