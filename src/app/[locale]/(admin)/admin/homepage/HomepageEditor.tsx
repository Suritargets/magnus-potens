'use client'

import { useActionState, useState } from 'react'
import { saveHomepageContent } from './actions'
import type { HomepageOverride } from '@/lib/homepage-content'

const LOCALES = [
  { code: 'en', label: 'EN' },
  { code: 'nl', label: 'NL' },
  { code: 'es', label: 'ES' },
  { code: 'fr', label: 'FR' },
  { code: 'pt', label: 'PT' },
  { code: 'zh', label: 'ZH' },
] as const

interface Props {
  content: Record<string, Required<HomepageOverride>>
}

const initialState = { success: false, error: null as string | null }

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: "'Jost', sans-serif",
  fontSize: 11,
  letterSpacing: '0.14em',
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

function Field({ label, name, defaultValue, textarea, rows = 2 }: { label: string; name: string; defaultValue: string; textarea?: boolean; rows?: number }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {textarea ? (
        <textarea name={name} defaultValue={defaultValue} rows={rows} style={{ ...inputStyle, resize: 'vertical' }} />
      ) : (
        <input name={name} type="text" defaultValue={defaultValue} style={inputStyle} />
      )}
    </div>
  )
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#15171C', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2, padding: '20px 22px', marginBottom: 20 }}>
      <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, color: '#C79E6B', margin: '0 0 16px' }}>
        {title}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>
    </div>
  )
}

function LocaleForm({ locale, data }: { locale: string; data: Required<HomepageOverride> }) {
  const [state, action, pending] = useActionState(saveHomepageContent, initialState)

  return (
    <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <input type="hidden" name="locale" value={locale} />

      {state.success && (
        <div style={{ background: 'rgba(80,160,80,0.1)', border: '1px solid rgba(80,160,80,0.25)', color: '#7FC97F', fontFamily: "'Jost', sans-serif", fontSize: 13, padding: '10px 14px', marginBottom: 16, borderRadius: 1 }}>
          ✓ Saved — live on the homepage now.
        </div>
      )}
      {state.error && (
        <div style={{ background: 'rgba(200,80,80,0.1)', border: '1px solid rgba(200,80,80,0.25)', color: '#E87777', fontFamily: "'Jost', sans-serif", fontSize: 13, padding: '10px 14px', marginBottom: 16, borderRadius: 1 }}>
          {state.error}
        </div>
      )}

      <SectionCard title="Hero">
        <Field label="Tagline" name="hero_tagline" defaultValue={data.hero.tagline ?? ''} />
        <Field label="Headline" name="hero_headline" defaultValue={data.hero.headline ?? ''} textarea rows={2} />
        <Field label="Subtitle" name="hero_subtitle" defaultValue={data.hero.subtitle ?? ''} textarea rows={3} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Primary button" name="hero_cta_primary" defaultValue={data.hero.cta_primary ?? ''} />
          <Field label="Secondary button" name="hero_cta_secondary" defaultValue={data.hero.cta_secondary ?? ''} />
        </div>
      </SectionCard>

      <SectionCard title="The Firm">
        <Field label="Label" name="firm_label" defaultValue={data.firm.label ?? ''} />
        <Field label="Statement" name="firm_statement" defaultValue={data.firm.statement ?? ''} textarea rows={3} />
        <Field label="Description" name="firm_description" defaultValue={data.firm.description ?? ''} textarea rows={3} />
      </SectionCard>

      <SectionCard title="Practice">
        <Field label="Label" name="practice_label" defaultValue={data.practice.label ?? ''} />
        <Field label="Headline" name="practice_headline" defaultValue={data.practice.headline ?? ''} />
        <Field label="Subtitle" name="practice_subtitle" defaultValue={data.practice.subtitle ?? ''} textarea rows={2} />
        {(data.practice.areas ?? []).map((area, i) => (
          <div key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14, display: 'grid', gap: 10, gridTemplateColumns: '1fr 2fr' }}>
            <input type="hidden" name={`practice_area_${i}_id`} value={area.id ?? ''} />
            <Field label={`Area ${i + 1} — Title`} name={`practice_area_${i}_title`} defaultValue={area.title ?? ''} />
            <Field label={`Area ${i + 1} — Description`} name={`practice_area_${i}_desc`} defaultValue={area.desc ?? ''} textarea rows={2} />
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Approach">
        <Field label="Label" name="approach_label" defaultValue={data.approach.label ?? ''} />
        <Field label="Headline" name="approach_headline" defaultValue={data.approach.headline ?? ''} />
        {(data.approach.pillars ?? []).map((pillar, i) => (
          <div key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14, display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr 2fr' }}>
            <Field label={`Pillar ${i + 1} — Tag`} name={`approach_pillar_${i}_tag`} defaultValue={pillar.tag ?? ''} />
            <Field label="Title" name={`approach_pillar_${i}_title`} defaultValue={pillar.title ?? ''} />
            <Field label="Description" name={`approach_pillar_${i}_desc`} defaultValue={pillar.desc ?? ''} textarea rows={2} />
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Slogan Band">
        <Field label="Label" name="slogan_label" defaultValue={data.slogan.label ?? ''} />
        <Field label="Headline" name="slogan_headline" defaultValue={data.slogan.headline ?? ''} />
      </SectionCard>

      <SectionCard title="Contact">
        <Field label="Label" name="contact_label" defaultValue={data.contact.label ?? ''} />
        <Field label="Headline" name="contact_headline" defaultValue={data.contact.headline ?? ''} />
        <Field label="Description" name="contact_description" defaultValue={data.contact.description ?? ''} textarea rows={2} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Enquiries label" name="contact_enquiries_label" defaultValue={data.contact.enquiries_label ?? ''} />
          <Field label="Email" name="contact_email" defaultValue={data.contact.email ?? ''} />
          <Field label="Appointment label" name="contact_appointment_label" defaultValue={data.contact.appointment_label ?? ''} />
          <Field label="Website" name="contact_website" defaultValue={data.contact.website ?? ''} />
          <Field label="Address label" name="contact_address_label" defaultValue={data.contact.address_label ?? ''} />
          <Field label="Address" name="contact_address" defaultValue={data.contact.address ?? ''} />
        </div>
      </SectionCard>

      <SectionCard title="Footer">
        <Field label="Tagline" name="footer_tagline" defaultValue={data.footer.tagline ?? ''} />
        <Field label="Motto" name="footer_motto" defaultValue={data.footer.motto ?? ''} />
      </SectionCard>

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
          padding: '13px 32px',
          cursor: pending ? 'not-allowed' : 'pointer',
          borderRadius: 1,
          alignSelf: 'flex-start',
        }}
      >
        {pending ? 'Saving…' : `Save ${locale.toUpperCase()}`}
      </button>
    </form>
  )
}

export function HomepageEditor({ content }: Props) {
  const [activeLocale, setActiveLocale] = useState<string>('en')

  return (
    <div style={{ maxWidth: 760 }}>
      {/* Locale tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 24 }}>
        {LOCALES.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setActiveLocale(l.code)}
            style={{
              padding: '8px 22px',
              fontFamily: "'Jost', sans-serif",
              fontSize: 11,
              letterSpacing: '0.16em',
              background: activeLocale === l.code ? '#C79E6B' : 'transparent',
              color: activeLocale === l.code ? '#0F1014' : '#8C877F',
              border: '1px solid rgba(199,158,107,0.25)',
              cursor: 'pointer',
              borderRadius: 1,
            }}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Keep all locale forms mounted (display:none for inactive) so unsaved
          edits in one tab survive switching to another. */}
      {LOCALES.map((l) => (
        <div key={l.code} style={{ display: activeLocale === l.code ? 'block' : 'none' }}>
          <LocaleForm locale={l.code} data={content[l.code]} />
        </div>
      ))}
    </div>
  )
}
