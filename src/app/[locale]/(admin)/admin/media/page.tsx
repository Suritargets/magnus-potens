import { db } from '@/db'
import { mediaAssets } from '@/db/schema'
import { desc } from 'drizzle-orm'
import Image from 'next/image'
import { MediaUploadButton } from './MediaUploadButton'
import { deleteMediaAsset } from '@/actions/media'

async function DeleteButton({ id }: { id: string }) {
  async function del() {
    'use server'
    await deleteMediaAsset(id)
  }
  return (
    <form action={del} style={{ position: 'absolute', top: 6, right: 6 }}>
      <button
        type="submit"
        style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: 9,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#E87777',
          background: 'rgba(15,16,20,0.85)',
          border: '1px solid rgba(200,80,80,0.25)',
          padding: '4px 8px',
          cursor: 'pointer',
          borderRadius: 1,
        }}
      >
        Delete
      </button>
    </form>
  )
}

export default async function MediaPage() {
  const assets = await db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt))
  const blobConfigured = !!process.env.BLOB_READ_WRITE_TOKEN

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 400, color: '#E9E3D6', margin: '0 0 4px' }}>
            Media
          </h1>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: '#6E6A63', margin: 0 }}>
            {assets.length} asset{assets.length !== 1 ? 's' : ''}
          </p>
        </div>
        {blobConfigured ? (
          <MediaUploadButton />
        ) : (
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: '#C79E6B', margin: 0, maxWidth: 340, textAlign: 'right' }}>
            Vercel Blob is nog niet gekoppeld — maak in het Vercel dashboard een Blob store aan (Storage → Blob) en de BLOB_READ_WRITE_TOKEN wordt automatisch gezet.
          </p>
        )}
      </div>

      {assets.length === 0 ? (
        <div style={{ background: '#15171C', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2, padding: '48px 24px', textAlign: 'center' }}>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, color: '#E9E3D6', margin: '0 0 8px' }}>
            No media yet.
          </p>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: '#6E6A63', margin: 0 }}>
            Click &quot;+ Upload&quot; to add images.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 16,
          }}
        >
          {assets.map((asset) => (
            <div
              key={asset.id}
              style={{ background: '#15171C', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', position: 'relative' }}
            >
              <div style={{ position: 'relative', aspectRatio: '1', background: '#0F1014' }}>
                <Image
                  src={asset.thumbnailUrl ?? asset.url}
                  alt={asset.alt ?? asset.filename}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 50vw, 200px"
                />
              </div>
              <div style={{ padding: '10px 12px' }}>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: '#E9E3D6', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {asset.filename}
                </p>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, color: '#5E5A53', margin: 0 }}>
                  {asset.width && asset.height ? `${asset.width}×${asset.height}` : ''} {asset.mimeType}
                </p>
              </div>
              <DeleteButton id={asset.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
