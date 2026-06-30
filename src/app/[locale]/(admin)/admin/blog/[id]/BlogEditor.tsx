'use client'

import { useActionState, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { saveBlogPost, deleteBlogPost } from './actions'
import type { BlogPost } from '@/db/schema'

interface Props {
  post: BlogPost | null
}

const initialState = { success: false, error: null }

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

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none',
  cursor: 'pointer',
}

export function BlogEditor({ post }: Props) {
  const [state, action, pending] = useActionState(saveBlogPost, initialState)
  const [tab, setTab] = useState<'write' | 'preview'>('write')
  const [content, setContent] = useState(post?.content ?? '')
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!post?.id) return
    if (!confirm('Delete this post? This cannot be undone.')) return
    setDeleting(true)
    await deleteBlogPost(post.id)
    window.location.href = '/admin/blog'
  }

  return (
    <div style={{ maxWidth: 820 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 400, color: '#E9E3D6', margin: 0 }}>
          {post ? post.title : 'New post'}
        </h1>
        {post && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 11,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#E87777',
              background: 'rgba(200,80,80,0.08)',
              border: '1px solid rgba(200,80,80,0.2)',
              padding: '8px 16px',
              cursor: 'pointer',
              borderRadius: 1,
              flexShrink: 0,
            }}
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        )}
      </div>

      {state.success && (
        <div style={{ background: 'rgba(80,160,80,0.1)', border: '1px solid rgba(80,160,80,0.25)', color: '#7FC97F', fontFamily: "'Jost', sans-serif", fontSize: 13, padding: '10px 14px', marginBottom: 20, borderRadius: 1 }}>
          ✓ Post saved.
        </div>
      )}
      {state.error && (
        <div style={{ background: 'rgba(200,80,80,0.1)', border: '1px solid rgba(200,80,80,0.25)', color: '#E87777', fontFamily: "'Jost', sans-serif", fontSize: 13, padding: '10px 14px', marginBottom: 20, borderRadius: 1 }}>
          {state.error}
        </div>
      )}

      <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {post && <input type="hidden" name="id" value={post.id} />}

        {/* Title */}
        <div>
          <label style={labelStyle}>Title *</label>
          <input name="title" type="text" required defaultValue={post?.title ?? ''} style={inputStyle} />
        </div>

        {/* Slug + Locale row */}
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '2fr 1fr' }}>
          <div>
            <label style={labelStyle}>Slug *</label>
            <input name="slug" type="text" required defaultValue={post?.slug ?? ''} style={inputStyle} placeholder="my-article-slug" />
          </div>
          <div>
            <label style={labelStyle}>Locale</label>
            <select name="locale" defaultValue={post?.locale ?? 'en'} style={selectStyle}>
              <option value="en">EN — English</option>
              <option value="nl">NL — Nederlands</option>
              <option value="es">ES — Español</option>
              <option value="fr">FR — Français</option>
            </select>
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label style={labelStyle}>Excerpt</label>
          <textarea name="excerpt" rows={2} defaultValue={post?.excerpt ?? ''} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Short summary shown in blog listings…" />
        </div>

        {/* Cover image */}
        <div>
          <label style={labelStyle}>Cover image URL</label>
          <input name="coverImage" type="url" defaultValue={post?.coverImage ?? ''} style={inputStyle} placeholder="https://res.cloudinary.com/…" />
        </div>

        {/* Tags */}
        <div>
          <label style={labelStyle}>Tags <span style={{ color: '#5E5A53', textTransform: 'none', letterSpacing: 0 }}>(comma-separated)</span></label>
          <input name="tags" type="text" defaultValue={post?.tags ?? ''} style={inputStyle} placeholder="legal, advisory, corporate" />
        </div>

        {/* Markdown editor with Write/Preview tabs */}
        <div>
          {/* Tab bar */}
          <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
            {(['write', 'preview'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                style={{
                  padding: '6px 18px',
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 10,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  background: tab === t ? '#C79E6B' : 'transparent',
                  color: tab === t ? '#0F1014' : '#8C877F',
                  border: '1px solid rgba(199,158,107,0.2)',
                  cursor: 'pointer',
                  borderRadius: 1,
                }}
              >
                {t === 'write' ? 'Write' : 'Preview'}
              </button>
            ))}
          </div>

          {tab === 'write' ? (
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
              {/* Hidden field so form still submits content in preview mode */}
              <input type="hidden" name="content" value={content} />
              <div
                className="prose prose-invert max-w-none"
                style={{
                  background: '#15171C',
                  border: '1px solid rgba(255,255,255,0.1)',
                  minHeight: 420,
                  padding: '16px 20px',
                  borderRadius: 1,
                }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              </div>
            </>
          )}
        </div>

        {/* Status + submit row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, paddingTop: 4 }}>
          <div style={{ display: 'flex', gap: 12 }}>
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
            <a
              href="/admin/blog"
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
            </a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8C877F' }}>
              Status
            </label>
            <select name="status" defaultValue={post?.status ?? 'draft'} style={{ ...selectStyle, width: 'auto', padding: '10px 28px 10px 12px' }}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </form>
    </div>
  )
}
