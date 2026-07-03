'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { saveBlogPostVariant, deleteBlogPostVariant } from './actions'
import type { BlogPost } from '@/db/schema'

const TABS = [
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'nl', label: 'NL', full: 'Nederlands' },
  { code: 'es', label: 'ES', full: 'Español' },
  { code: 'fr', label: 'FR', full: 'Français' },
  { code: 'pt', label: 'PT', full: 'Português' },
  { code: 'zh', label: 'ZH', full: '中文' },
] as const

type TabCode = (typeof TABS)[number]['code']

interface Props {
  groupId: string | null
  variants: Partial<Record<TabCode, BlogPost>>
}

const initialState = { success: false, error: null as string | null, groupId: undefined as string | undefined }

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#15171C',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#E9E3D6',
  fontFamily: "'Jost', sans-serif",
  fontSize: 14,
  padding: '10px 14px',
  outline: 'none',
  borderRadius: 1,
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: "'Jost', sans-serif",
  fontSize: 11,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: '#8C877F',
  marginBottom: 6,
}

const selectStyle: React.CSSProperties = { ...inputStyle, appearance: 'none', cursor: 'pointer' }

function toDatetimeLocal(date: Date | string | null | undefined): string {
  if (!date) return ''
  const d = new Date(date)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function LocaleForm({
  groupId, tab, data, defaults, onSaved,
}: {
  groupId: string; tab: (typeof TABS)[number]; data: BlogPost | undefined
  defaults: BlogPost | undefined; onSaved: (groupId?: string) => void
}) {
  const [state, action, pending] = useActionState(saveBlogPostVariant, initialState)
  const [previewTab, setPreviewTab] = useState<'write' | 'preview'>('write')
  const [content, setContent] = useState(data?.content ?? '')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const isScheduled = !!data?.publishedAt && new Date(data.publishedAt) > new Date()

  useEffect(() => {
    if (state.success) onSaved(state.groupId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success])

  async function handleDelete() {
    if (!data) return
    if (!confirm(`Delete the ${tab.label} version of this article?`)) return
    setDeleting(true)
    const result = await deleteBlogPostVariant(data.id)
    if (result.error) {
      setDeleteError(result.error)
      setDeleting(false)
    } else {
      onSaved()
    }
  }

  const seed = data ?? defaults

  return (
    <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <input type="hidden" name="groupId" value={groupId} />
      <input type="hidden" name="locale" value={tab.code} />

      {state.success && (
        <div style={{ background: 'rgba(80,160,80,0.1)', border: '1px solid rgba(80,160,80,0.25)', color: '#7FC97F', fontFamily: "'Jost', sans-serif", fontSize: 13, padding: '10px 14px', borderRadius: 1 }}>
          ✓ {tab.label} saved.
        </div>
      )}
      {state.error && (
        <div style={{ background: 'rgba(200,80,80,0.1)', border: '1px solid rgba(200,80,80,0.25)', color: '#E87777', fontFamily: "'Jost', sans-serif", fontSize: 13, padding: '10px 14px', borderRadius: 1 }}>
          {state.error}
        </div>
      )}
      {deleteError && (
        <div style={{ background: 'rgba(200,80,80,0.1)', border: '1px solid rgba(200,80,80,0.25)', color: '#E87777', fontFamily: "'Jost', sans-serif", fontSize: 13, padding: '10px 14px', borderRadius: 1 }}>
          {deleteError}
        </div>
      )}
      {!data && (
        <div style={{ background: 'rgba(199,158,107,0.08)', border: '1px solid rgba(199,158,107,0.2)', color: '#C79E6B', fontFamily: "'Jost', sans-serif", fontSize: 12, padding: '10px 14px', borderRadius: 1 }}>
          No {tab.full} version yet — write the translation below and save to create one.
        </div>
      )}

      <div>
        <label htmlFor={`title-${tab.code}`} style={labelStyle}>Title *</label>
        <input id={`title-${tab.code}`} name="title" type="text" required defaultValue={data?.title ?? ''} style={inputStyle} />
      </div>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '2fr 1fr' }}>
        <div>
          <label htmlFor={`slug-${tab.code}`} style={labelStyle}>Slug *</label>
          <input id={`slug-${tab.code}`} name="slug" type="text" required defaultValue={data?.slug ?? ''} style={inputStyle} placeholder="my-article-slug" />
        </div>
        <div>
          <label htmlFor={`category-${tab.code}`} style={labelStyle}>Category</label>
          <select id={`category-${tab.code}`} name="category" defaultValue={seed?.category ?? 'news'} style={selectStyle}>
            <option value="news">News</option>
            <option value="event">Event</option>
            <option value="use_case">Use Case</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor={`excerpt-${tab.code}`} style={labelStyle}>Excerpt</label>
        <textarea id={`excerpt-${tab.code}`} name="excerpt" rows={2} defaultValue={data?.excerpt ?? ''} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Short summary shown in blog listings…" />
      </div>

      <div>
        <label htmlFor={`coverImage-${tab.code}`} style={labelStyle}>Cover image URL</label>
        <input id={`coverImage-${tab.code}`} name="coverImage" type="url" defaultValue={seed?.coverImage ?? ''} style={inputStyle} placeholder="https://res.cloudinary.com/…" />
      </div>

      <div>
        <label htmlFor={`tags-${tab.code}`} style={labelStyle}>
          Tags <span style={{ color: '#5E5A53', textTransform: 'none', letterSpacing: 0 }}>(comma-separated)</span>
        </label>
        <input id={`tags-${tab.code}`} name="tags" type="text" defaultValue={seed?.tags ?? ''} style={inputStyle} placeholder="legal, advisory, corporate" />
      </div>

      {/* Markdown editor with Write/Preview tabs */}
      <div>
        <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
          {(['write', 'preview'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setPreviewTab(t)}
              style={{
                padding: '6px 18px', fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
                background: previewTab === t ? '#C79E6B' : 'transparent',
                color: previewTab === t ? '#0F1014' : '#8C877F',
                border: '1px solid rgba(199,158,107,0.2)', cursor: 'pointer', borderRadius: 1,
              }}
            >
              {t === 'write' ? 'Write' : 'Preview'}
            </button>
          ))}
        </div>

        {previewTab === 'write' ? (
          <textarea
            name="content"
            rows={22}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 13, resize: 'vertical' }}
            placeholder={'# Heading\n\nWrite in **Markdown**…'}
          />
        ) : (
          <>
            <input type="hidden" name="content" value={content} />
            <div className="prose prose-invert max-w-none" style={{ background: '#15171C', border: '1px solid rgba(255,255,255,0.1)', minHeight: 420, padding: '16px 20px', borderRadius: 1 }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
          </>
        )}
      </div>

      <div>
        <label htmlFor={`publishedAt-${tab.code}`} style={labelStyle}>
          Publish date &amp; time{' '}
          <span style={{ color: '#5E5A53', textTransform: 'none', letterSpacing: 0 }}>
            (leave empty to use now; set a future date to schedule)
          </span>
        </label>
        <input
          id={`publishedAt-${tab.code}`}
          name="publishedAt"
          type="datetime-local"
          defaultValue={toDatetimeLocal(data?.publishedAt)}
          style={{ ...inputStyle, colorScheme: 'dark', maxWidth: 280 }}
        />
        {isScheduled && (
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: '#C79E6B', margin: '6px 0 0' }}>
            Scheduled — this version will only appear publicly once this date/time has passed.
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, paddingTop: 4 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            type="submit"
            disabled={pending}
            style={{
              fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
              color: '#0F1014', background: pending ? '#A67C3E' : '#C79E6B', border: 'none',
              padding: '12px 28px', cursor: pending ? 'not-allowed' : 'pointer', borderRadius: 1,
            }}
          >
            {pending ? 'Saving…' : `Save ${tab.label}`}
          </button>
          {data && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              style={{
                fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
                color: '#E87777', background: 'rgba(200,80,80,0.08)', border: '1px solid rgba(200,80,80,0.2)',
                padding: '12px 20px', cursor: deleting ? 'not-allowed' : 'pointer', borderRadius: 1,
              }}
            >
              {deleting ? 'Deleting…' : `Delete ${tab.label}`}
            </button>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label htmlFor={`status-${tab.code}`} style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8C877F' }}>
            Status
          </label>
          <select id={`status-${tab.code}`} name="status" defaultValue={data?.status ?? 'draft'} style={{ ...selectStyle, width: 'auto', padding: '10px 28px 10px 12px' }}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>
    </form>
  )
}

export function BlogEditor({ groupId: initialGroupId, variants: initialVariants }: Props) {
  const router = useRouter()
  const isNew = initialGroupId === null
  const [groupId, setGroupId] = useState<string | null>(initialGroupId)
  const firstTabWithData = TABS.find((t) => initialVariants[t.code])?.code ?? 'en'
  const [activeTab, setActiveTab] = useState<TabCode>(firstTabWithData)
  const defaults = initialVariants[firstTabWithData]

  function handleSaved(newGroupId?: string) {
    if (isNew && !groupId && newGroupId) {
      setGroupId(newGroupId)
      router.push(`/admin/blog/${newGroupId}`)
    } else {
      router.refresh()
    }
  }

  const title = TABS.map((t) => initialVariants[t.code]?.title).find(Boolean) ?? 'New article'

  return (
    <div style={{ maxWidth: 820 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 400, color: '#E9E3D6', margin: 0 }}>
          {title}
        </h1>
        <Link
          href="/admin/blog"
          style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8C877F', textDecoration: 'none' }}
        >
          ← Back to list
        </Link>
      </div>

      {/* Language tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 24, flexWrap: 'wrap' }}>
        {TABS.map((t) => {
          const hasData = !!initialVariants[t.code]
          const active = activeTab === t.code
          return (
            <button
              key={t.code}
              type="button"
              onClick={() => setActiveTab(t.code)}
              title={t.full}
              style={{
                padding: '8px 18px', fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.14em',
                background: active ? '#C79E6B' : 'transparent',
                color: active ? '#0F1014' : hasData ? '#8C877F' : '#4E4B46',
                border: '1px solid rgba(199,158,107,0.25)', cursor: 'pointer', borderRadius: 1,
              }}
            >
              {t.label}{!hasData && ' +'}
            </button>
          )
        })}
      </div>

      {(isNew && !groupId) ? (
        // Voor een gloednieuw artikel: alleen de actieve taaltab tonen, met
        // een tijdelijke lokale groupId die na de eerste succesvolle save
        // wordt vervangen door de echte (server-gegenereerde) groupId.
        <LocaleForm
          groupId=""
          tab={TABS.find((t) => t.code === activeTab)!}
          data={undefined}
          defaults={undefined}
          onSaved={handleSaved}
        />
      ) : (
        TABS.map((t) => (
          <div key={t.code} style={{ display: activeTab === t.code ? 'block' : 'none' }}>
            <LocaleForm groupId={groupId!} tab={t} data={initialVariants[t.code]} defaults={defaults} onSaved={handleSaved} />
          </div>
        ))
      )}
    </div>
  )
}
