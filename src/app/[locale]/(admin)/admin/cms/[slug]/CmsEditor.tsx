'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { saveCmsPageVariant, deleteCmsPageVariant } from './actions'
import type { Page } from '@/db/schema'

const TABS = [
  { code: 'all', label: 'ALL', full: 'All languages (fallback)' },
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'nl', label: 'NL', full: 'Nederlands' },
  { code: 'es', label: 'ES', full: 'Español' },
  { code: 'fr', label: 'FR', full: 'Français' },
  { code: 'pt', label: 'PT', full: 'Português' },
  { code: 'zh', label: 'ZH', full: '中文' },
] as const

type TabCode = (typeof TABS)[number]['code']

interface Props {
  slug: string | null
  variants: Partial<Record<TabCode, Page>>
}

const initialState = { success: false, error: null as string | null }

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: "'Jost', sans-serif",
  fontSize: 11,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: '#8C877F',
  marginBottom: 6,
}

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

function Field({
  id, label, name, defaultValue, required, textarea, rows = 3, hint, mono,
}: {
  id: string; label: string; name: string; defaultValue?: string; required?: boolean
  textarea?: boolean; rows?: number; hint?: string; mono?: boolean
}) {
  return (
    <div>
      <label htmlFor={id} style={labelStyle}>{label}</label>
      {hint && (
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: '#6E6A63', marginTop: -4, marginBottom: 6 }}>
          {hint}
        </p>
      )}
      {textarea ? (
        <textarea
          id={id}
          name={name}
          required={required}
          defaultValue={defaultValue ?? ''}
          rows={rows}
          style={{ ...inputStyle, resize: 'vertical', fontFamily: mono ? 'monospace' : inputStyle.fontFamily, fontSize: mono ? 13 : inputStyle.fontSize }}
        />
      ) : (
        <input id={id} name={name} type="text" required={required} defaultValue={defaultValue ?? ''} style={inputStyle} />
      )}
    </div>
  )
}

function LocaleForm({
  slug, tab, data, onSaved,
}: {
  slug: string; tab: (typeof TABS)[number]; data: Page | undefined; onSaved: () => void
}) {
  const [state, action, pending] = useActionState(saveCmsPageVariant, initialState)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    if (state.success) onSaved()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success])

  async function handleDelete() {
    if (!data) return
    if (!confirm(`Delete the ${tab.label} version of this page?`)) return
    setDeleting(true)
    const result = await deleteCmsPageVariant(slug, tab.code)
    if (result.error) {
      setDeleteError(result.error)
      setDeleting(false)
    } else {
      onSaved()
    }
  }

  return (
    <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="tab" value={tab.code} />

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
          No {tab.full} version yet — fill in the fields below and save to create one.
        </div>
      )}

      <Field id={`title-${tab.code}`} label="Title *" name="title" defaultValue={data?.title} required />

      <div>
        <label htmlFor={`content-${tab.code}`} style={labelStyle}>Content (Markdown)</label>
        <textarea
          id={`content-${tab.code}`}
          name="content"
          rows={16}
          defaultValue={data?.content ?? ''}
          style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 13, resize: 'vertical' }}
          placeholder={'# Title\n\nWrite content in Markdown...'}
        />
      </div>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
        <Field id={`metaTitle-${tab.code}`} label="Meta title" name="metaTitle" defaultValue={data?.metaTitle ?? ''} />
        <Field id={`metaDescription-${tab.code}`} label="Meta description" name="metaDescription" defaultValue={data?.metaDescription ?? ''} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <input
          type="checkbox"
          id={`published-${tab.code}`}
          name="published"
          value="true"
          defaultChecked={data?.published ?? false}
          style={{ width: 16, height: 16, accentColor: '#C79E6B' }}
        />
        <label htmlFor={`published-${tab.code}`} style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: '#E9E3D6', cursor: 'pointer' }}>
          Publish {tab.label}
        </label>
      </div>

      <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
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
    </form>
  )
}

export function CmsEditor({ slug: initialSlug, variants: initialVariants }: Props) {
  const router = useRouter()
  const isNew = initialSlug === null
  const [slugValue, setSlugValue] = useState(initialSlug ?? '')
  const firstTabWithData = TABS.find((t) => initialVariants[t.code])?.code ?? 'all'
  const [activeTab, setActiveTab] = useState<TabCode>(firstTabWithData)

  function handleSaved() {
    if (isNew && slugValue) {
      router.push(`/admin/cms/${slugValue}`)
    } else {
      router.refresh()
    }
  }

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 400, color: '#E9E3D6', margin: 0 }}>
          {isNew ? 'New page' : slugValue}
        </h1>
        <Link
          href="/admin/cms"
          style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8C877F', textDecoration: 'none' }}
        >
          ← Back to list
        </Link>
      </div>

      <div style={{ marginBottom: 24, maxWidth: 300 }}>
        <label htmlFor="slug-field" style={labelStyle}>Slug *</label>
        <input
          id="slug-field"
          type="text"
          required
          value={slugValue}
          disabled={!isNew}
          onChange={(e) => setSlugValue(e.target.value.toLowerCase())}
          placeholder="e.g. about-us → /about-us"
          style={{ ...inputStyle, opacity: isNew ? 1 : 0.6 }}
        />
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
                padding: '8px 18px',
                fontFamily: "'Jost', sans-serif",
                fontSize: 11,
                letterSpacing: '0.14em',
                background: active ? '#C79E6B' : 'transparent',
                color: active ? '#0F1014' : hasData ? '#8C877F' : '#4E4B46',
                border: '1px solid rgba(199,158,107,0.25)',
                cursor: 'pointer',
                borderRadius: 1,
              }}
            >
              {t.label}{!hasData && ' +'}
            </button>
          )
        })}
      </div>

      {slugValue ? (
        TABS.map((t) => (
          <div key={t.code} style={{ display: activeTab === t.code ? 'block' : 'none' }}>
            <LocaleForm slug={slugValue} tab={t} data={initialVariants[t.code]} onSaved={handleSaved} />
          </div>
        ))
      ) : (
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: '#6E6A63' }}>
          Enter a slug above to start editing.
        </p>
      )}
    </div>
  )
}
