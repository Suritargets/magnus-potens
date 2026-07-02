'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

export function MediaUploadButton() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    setError(null)

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/media/upload', { method: 'POST', body: formData })
        const json = await res.json()

        if (!res.ok) {
          setError(json.error ?? 'Upload mislukt.')
          break
        }
      }
      router.refresh()
    } catch {
      setError('Upload mislukt. Controleer je verbinding.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div style={{ textAlign: 'right' }}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        style={{ display: 'none' }}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: 11,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: '#0F1014',
          background: uploading ? '#A67C3E' : '#C79E6B',
          border: 'none',
          padding: '11px 24px',
          cursor: uploading ? 'not-allowed' : 'pointer',
          borderRadius: 1,
        }}
      >
        {uploading ? 'Uploaden…' : '↑ Upload afbeelding'}
      </button>
      {error && (
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: '#E87777', margin: '8px 0 0', maxWidth: 320 }}>
          {error}
        </p>
      )}
    </div>
  )
}
