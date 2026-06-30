'use client'

import { CldUploadWidget } from 'next-cloudinary'
import { saveMediaAsset, type CloudinaryResult } from '@/actions/media'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function MediaUploadButton() {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)

  return (
    <CldUploadWidget
      signatureEndpoint="/api/media/sign"
      options={{ sources: ['local', 'url'], multiple: true, maxFiles: 10 }}
      onSuccess={async (result) => {
        if (result.info && typeof result.info === 'object' && 'public_id' in result.info) {
          setUploading(true)
          await saveMediaAsset(result.info as CloudinaryResult)
          router.refresh()
          setUploading(false)
        }
      }}
    >
      {({ open }) => (
        <button
          onClick={() => open()}
          disabled={uploading}
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 11,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#0F1014',
            background: uploading ? '#A67C3E' : '#C79E6B',
            border: 'none',
            padding: '10px 20px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            borderRadius: 1,
            whiteSpace: 'nowrap',
          }}
        >
          {uploading ? 'Saving…' : '+ Upload'}
        </button>
      )}
    </CldUploadWidget>
  )
}
