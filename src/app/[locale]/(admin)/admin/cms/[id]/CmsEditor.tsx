'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { savePage } from './actions'
import type { Page } from '@/db/schema'

interface Props {
  page: Page | null
}

const initialState = { success: false, error: null }

/* Shared input styles (inline so we don't need Tailwind classes here) */
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
  textTransform: 'uppercase' as const,
  color: '#8C877F',
  marginBottom: 6,
}

export function CmsEditor({ page }: Props) {
  const [state, action, pending] = useActionState(savePage, initialState)

  return (
    <div style={{ maxWidth: 760 }}>
      {/* Header */}
      <h1
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 28,
          fontWeight: 400,
          color: '#E9E3D6',
          margin: '0 0 28px',
        }}
      >
        {page ? page.title : 'New page'}
      </h1>

      {/* Feedback */}
      {state.success && (
        <div
          style={{
            background: 'rgba(80,160,80,0.1)',
            border: '1px solid rgba(80,160,80,0.25)',
            color: '#7FC97F',
            fontFamily: "'Jost', sans-serif",
            fontSize: 13,
            padding: '10px 14px',
            marginBottom: 20,
            borderRadius: 1,
          }}
        >
          ✓ Page saved successfully.
        </div>
      )}
      {state.error && (
        <div
          style={{
            background: 'rgba(200,80,80,0.1)',
            border: '1px solid rgba(200,80,80,0.25)',
            color: '#E87777',
            fontFamily: "'Jost', sans-serif",
            fontSize: 13,
            padding: '10px 14px',
            marginBottom: 20,
            borderRadius: 1,
          }}
        >
          {state.error}
        </div>
      )}

      <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {page && <input type="hidden" name="id" value={page.id} />}

        {/* Title */}
        <Field label="Title *" name="title" defaultValue={page?.title} required inputStyle={inputStyle} labelStyle={labelStyle} />

        {/* Slug + Locale row */}
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '2fr 1fr' }}>
          <Field
            label="Slug *"
            name="slug"
            defaultValue={page?.slug}
            required
            hint="e.g. about-us → /about-us"
            inputStyle={inputStyle}
            labelStyle={labelStyle}
          />
          <div>
            <label htmlFor="locale" style={labelStyle}>Language</label>
            <select id="locale" name="locale" defaultValue={page?.locale ?? ''} style={{ ...inputStyle, appearance: 'none' }}>
              <option value="">All languages (fallback)</option>
              <option value="en">EN — English</option>
              <option value="nl">NL — Nederlands</option>
              <option value="es">ES — Español</option>
              <option value="fr">FR — Français</option>
              <option value="pt">PT — Português</option>
              <option value="zh">ZH — 中文</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <div>
          <label style={labelStyle}>Content (Markdown)</label>
          <textarea
            name="content"
            rows={16}
            defaultValue={page?.content ?? ''}
            style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 13, resize: 'vertical' }}
            placeholder={'# Title\n\nWrite content in Markdown...'}
          />
        </div>

        {/* Meta */}
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
          <Field label="Meta title" name="metaTitle" defaultValue={page?.metaTitle ?? ''} inputStyle={inputStyle} labelStyle={labelStyle} />
          <Field label="Meta description" name="metaDescription" defaultValue={page?.metaDescription ?? ''} inputStyle={inputStyle} labelStyle={labelStyle} />
        </div>

        {/* Published toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input
            type="checkbox"
            id="published"
            name="published"
            value="true"
            defaultChecked={page?.published ?? false}
            style={{ width: 16, height: 16, accentColor: '#C79E6B' }}
          />
          <label
            htmlFor="published"
            style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: '#E9E3D6', cursor: 'pointer' }}
          >
            Publish page
          </label>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
          <button
            type="submit"
            disabled={pending}
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#0F1014',
              background: pending ? '#A67C3E' : '#C79E6B',
              border: 'none',
              padding: '12px 28px',
              cursor: pending ? 'not-allowed' : 'pointer',
              borderRadius: 1,
            }}
          >
            {pending ? 'Saving…' : 'Save'}
          </button>
          <Link
            href="/admin/cms"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#8C877F',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '12px 24px',
              textDecoration: 'none',
              borderRadius: 1,
            }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

function Field({
  label,
  name,
  defaultValue,
  required,
  hint,
  inputStyle,
  labelStyle,
}: {
  label: string
  name: string
  defaultValue?: string
  required?: boolean
  hint?: string
  inputStyle: React.CSSProperties
  labelStyle: React.CSSProperties
}) {
  return (
    <div>
      <label htmlFor={name} style={labelStyle}>{label}</label>
      {hint && (
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: '#6E6A63', marginTop: -4, marginBottom: 6 }}>
          {hint}
        </p>
      )}
      <input
        id={name}
        name={name}
        type="text"
        required={required}
        defaultValue={defaultValue ?? ''}
        style={inputStyle}
      />
    </div>
  )
}
