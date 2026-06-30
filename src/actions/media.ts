'use server'

import { db } from '@/db'
import { mediaAssets } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { requireRole } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export interface CloudinaryResult {
  public_id: string
  secure_url: string
  original_filename: string
  format: string
  bytes: number
  width?: number
  height?: number
}

export async function saveMediaAsset(result: CloudinaryResult): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requireRole('admin', 'super_admin')

    await db.insert(mediaAssets).values({
      publicId:     result.public_id,
      url:          result.secure_url,
      thumbnailUrl: result.secure_url.replace('/upload/', '/upload/w_400,q_auto,f_auto/'),
      filename:     result.original_filename,
      mimeType:     `image/${result.format}`,
      size:         result.bytes,
      width:        result.width,
      height:       result.height,
      uploadedBy:   user.id,
    })

    revalidatePath('/admin/media')

    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { success: false, error: message }
  }
}

export async function deleteMediaAsset(id: string): Promise<void> {
  await requireRole('admin', 'super_admin')
  await db.delete(mediaAssets).where(eq(mediaAssets.id, id))
  revalidatePath('/admin/media')
}
