'use client'

import { useActionState } from 'react'
import { useTranslations } from 'next-intl'
import { submitContact } from '@/actions/contact'
import type { ActionResult } from '@/lib/validations'

const initialState: ActionResult = { success: false, error: null, fieldErrors: {} }

const fieldStyle = {
  width: '100%',
  backgroundColor: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(199,158,107,0.18)',
  color: '#E9E3D6',
  padding: '0.75rem 1rem',
  fontSize: '0.875rem',
  outline: 'none',
  transition: 'border-color 0.2s',
  fontFamily: 'var(--font-jost)',
  fontWeight: 300,
}

export function ContactForm() {
  const t = useTranslations('contact.form')
  const [state, action, pending] = useActionState(submitContact, initialState)

  if (state.success) {
    return (
      <div className="py-12 text-center">
        {/* Gold divider line */}
        <div
          className="mx-auto mb-8"
          style={{ width: 40, height: 1, backgroundColor: '#C79E6B' }}
        />
        <h3
          className="text-[1.6rem] font-normal mb-4"
          style={{ fontFamily: 'var(--font-cormorant)', color: '#F3EEE4' }}
        >
          {t('success_title')}
        </h3>
        <p
          className="text-[13px] leading-relaxed"
          style={{ fontFamily: 'var(--font-jost)', fontWeight: 300, color: '#8C877F' }}
        >
          {t('success_message')}
        </p>
      </div>
    )
  }

  const showError = !state.success && !!state.error

  return (
    <form action={action} className="space-y-5" noValidate>
      {/* Honeypot */}
      <input
        type="text"
        name="_hp_website"
        tabIndex={-1}
        className="hidden"
        aria-hidden
      />

      {showError && (
        <div
          className="p-3 text-[13px]"
          style={{
            backgroundColor: 'rgba(255,80,80,0.08)',
            border: '1px solid rgba(255,80,80,0.2)',
            color: '#f87171',
            fontFamily: 'var(--font-jost)',
          }}
        >
          {state.error}
        </div>
      )}

      {/* Name */}
      <div>
        <label
          className="block text-[10px] tracking-[0.18em] uppercase mb-2"
          style={{ fontFamily: 'var(--font-jost)', fontWeight: 500, color: 'rgba(199,158,107,0.6)' }}
        >
          {t('name')}
        </label>
        <input
          name="name"
          type="text"
          required
          style={fieldStyle}
          onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(199,158,107,0.5)' }}
          onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(199,158,107,0.18)' }}
        />
        {state.fieldErrors?.name?.[0] && (
          <p className="mt-1 text-[11px]" style={{ color: '#f87171', fontFamily: 'var(--font-jost)' }}>
            {state.fieldErrors.name[0]}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          className="block text-[10px] tracking-[0.18em] uppercase mb-2"
          style={{ fontFamily: 'var(--font-jost)', fontWeight: 500, color: 'rgba(199,158,107,0.6)' }}
        >
          {t('email')}
        </label>
        <input
          name="email"
          type="email"
          required
          style={fieldStyle}
          onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(199,158,107,0.5)' }}
          onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(199,158,107,0.18)' }}
        />
        {state.fieldErrors?.email?.[0] && (
          <p className="mt-1 text-[11px]" style={{ color: '#f87171', fontFamily: 'var(--font-jost)' }}>
            {state.fieldErrors.email[0]}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label
          className="block text-[10px] tracking-[0.18em] uppercase mb-2"
          style={{ fontFamily: 'var(--font-jost)', fontWeight: 500, color: 'rgba(199,158,107,0.6)' }}
        >
          {t('message')}
        </label>
        <textarea
          name="message"
          rows={5}
          required
          style={{ ...fieldStyle, resize: 'none' }}
          onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(199,158,107,0.5)' }}
          onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(199,158,107,0.18)' }}
        />
        {state.fieldErrors?.message?.[0] && (
          <p className="mt-1 text-[11px]" style={{ color: '#f87171', fontFamily: 'var(--font-jost)' }}>
            {state.fieldErrors.message[0]}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={pending}
        className="w-full py-4 text-[11px] tracking-[0.18em] uppercase transition-all duration-300 disabled:opacity-50"
        style={{
          fontFamily: 'var(--font-jost)',
          fontWeight: 500,
          backgroundColor: '#C79E6B',
          color: '#0F1014',
          border: 'none',
          cursor: pending ? 'not-allowed' : 'pointer',
        }}
        onMouseOver={(e) => {
          if (!pending) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#DDBB85'
        }}
        onMouseOut={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#C79E6B'
        }}
      >
        {pending ? 'Sending...' : t('submit')}
      </button>

      {/* Disclaimer */}
      <p
        className="text-[11px] text-center leading-relaxed"
        style={{ fontFamily: 'var(--font-jost)', fontWeight: 300, color: '#5E5A53' }}
      >
        {t('disclaimer')}
      </p>
    </form>
  )
}
