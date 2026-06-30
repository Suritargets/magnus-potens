import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import crypto from 'crypto'

export const runtime = 'nodejs'

export async function POST(_req: NextRequest): Promise<NextResponse> {
  try {
    await requireRole('admin', 'super_admin')
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiSecret = process.env.CLOUDINARY_API_SECRET
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY

  if (!apiSecret || !cloudName || !apiKey) {
    return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 500 })
  }

  const timestamp = Math.round(Date.now() / 1000)
  const folder = 'magnus-potens'

  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`
  const signature = crypto
    .createHash('sha256')
    .update(paramsToSign + apiSecret)
    .digest('hex')

  return NextResponse.json({ timestamp, signature, apiKey, cloudName, folder })
}
