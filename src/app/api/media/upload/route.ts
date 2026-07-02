import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { db } from '@/db'
import { mediaAssets } from '@/db/schema'
import { requireRole } from '@/lib/auth'

export const runtime = 'nodejs'

const MAX_SIZE = 8 * 1024 * 1024 // 8MB
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'])

// POST /api/media/upload — multipart form met 'file'; admin-only, naar Vercel Blob.
export async function POST(req: NextRequest): Promise<NextResponse> {
  let user
  try {
    user = await requireRole('admin', 'super_admin')
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: 'Vercel Blob is niet geconfigureerd. Maak een Blob store aan in het Vercel dashboard (Storage → Blob).' },
      { status: 503 }
    )
  }

  const formData = await req.formData()
  const file = formData.get('file')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Geen bestand ontvangen.' }, { status: 400 })
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: 'Alleen afbeeldingen (jpeg, png, webp, gif, svg) zijn toegestaan.' }, { status: 400 })
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Bestand is te groot (max 8MB).' }, { status: 400 })
  }

  try {
    const blob = await put(`media/${file.name}`, file, {
      access: 'public',
      addRandomSuffix: true,
    })

    const [asset] = await db
      .insert(mediaAssets)
      .values({
        publicId:   blob.pathname,
        url:        blob.url,
        thumbnailUrl: blob.url,
        filename:   file.name,
        mimeType:   file.type,
        size:       file.size,
        uploadedBy: user.id === 'dev-preview' ? null : user.id,
      })
      .returning()

    return NextResponse.json({ success: true, asset })
  } catch (err) {
    console.error('media upload error:', err)
    return NextResponse.json({ error: 'Upload mislukt. Probeer opnieuw.' }, { status: 500 })
  }
}
