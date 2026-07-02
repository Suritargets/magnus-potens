'use client'

import { useActionState, useState, useCallback, useMemo } from 'react'
import { motion } from 'motion/react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'
import { bookAppointment } from '@/actions/appointment'
import type { AvailabilityConfig } from '@/db/schema'

interface Props {
  availabilityConfigs: AvailabilityConfig[]
  t: {
    headline: string
    subtitle: string
    no_slots: string
    select_date_first: string
    topics: Record<string, string>
    form: Record<string, string>
  }
}

const initialState = { success: false, error: null }

const fieldStyle: React.CSSProperties = {
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

export function AppointmentBooker({ availabilityConfigs, t }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  const [state, action, pending] = useActionState(bookAppointment, initialState)

  const activeDays = useMemo(
    () => new Set(availabilityConfigs.filter((c) => c.isActive).map((c) => c.dayOfWeek)),
    [availabilityConfigs]
  )

  const isDisabledDay = useCallback(
    (date: Date) => {
      const day = date.getDay()
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return !activeDays.has(day) || date < today
    },
    [activeDays]
  )

  async function handleDaySelect(date: Date | undefined) {
    if (!date) return
    setSelectedDate(date)
    setSelectedTime(null)
    setLoadingSlots(true)

    const iso = date.toISOString().slice(0, 10)
    try {
      const res = await fetch(`/api/appointments/slots?date=${iso}`)
      const data = await res.json()
      setAvailableSlots(data.slots ?? [])
      setBookedSlots(data.booked ?? [])
    } catch {
      setAvailableSlots([])
      setBookedSlots([])
    } finally {
      setLoadingSlots(false)
      setStep(2)
    }
  }

  function handleTimeSelect(time: string) {
    setSelectedTime(time)
    setStep(3)
  }

  const dateStr = selectedDate ? selectedDate.toISOString().slice(0, 10) : ''
  const freeSlots = availableSlots.filter((s) => !bookedSlots.includes(s))

  if (state.success) {
    return (
      <div
        style={{
          background: 'rgba(80,160,80,0.06)',
          border: '1px solid rgba(80,160,80,0.2)',
          padding: '40px 32px',
          textAlign: 'center',
          maxWidth: 560,
          margin: '0 auto',
        }}
      >
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#7FC97F', margin: '0 0 12px' }}>
          {t.form.success_title}
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26, fontWeight: 400, color: '#E9E3D6', margin: '0 0 12px' }}>
          {t.form.success_message}
        </p>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: '#8C877F', margin: 0 }}>
          {dateStr} &middot; {selectedTime}
        </p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      {/* Step indicators */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 48 }}>
        {([1, 2, 3] as const).map((n) => (
          <div
            key={n}
            style={{
              flex: 1,
              height: 2,
              background: step >= n ? '#C79E6B' : 'rgba(199,158,107,0.15)',
              transition: 'background 0.3s',
            }}
          />
        ))}
      </div>

      {/* Step 1: Calendar */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C79E6B', margin: '0 0 8px' }}>
            Step 1 - Select a date
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <style>{`
              /* react-day-picker v10 class names */
              .rdp-root { --rdp-accent-color: #C79E6B; --rdp-accent-background-color: rgba(199,158,107,0.1); color: #E9E3D6; font-family: 'Jost', sans-serif; font-size: 13px; }
              .rdp-day { border-radius: 1px !important; }
              .rdp-button_previous, .rdp-button_next, .rdp-month_caption { color: #E9E3D6 !important; }
              .rdp-weekday { color: #8C877F !important; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; }
              .rdp-day[aria-disabled="true"] { color: #3C3A36 !important; opacity: 1 !important; }
            `}</style>
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleDaySelect}
              disabled={isDisabledDay}
              showOutsideDays={false}
            />
          </div>
          {loadingSlots && (
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: '#8C877F', textAlign: 'center', marginTop: 16 }}>
              Loading availability...
            </p>
          )}
        </motion.div>
      )}

      {/* Step 2: Time slots */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C79E6B', margin: 0 }}>
              Step 2 - Select a time
            </p>
            <button
              onClick={() => setStep(1)}
              style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8C877F', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              &larr; Back
            </button>
          </div>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, color: '#E9E3D6', margin: '0 0 28px' }}>
            {selectedDate?.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          {freeSlots.length === 0 ? (
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: '#8C877F', textAlign: 'center', padding: '32px 0' }}>
              {t.no_slots}
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 10 }}>
              {freeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => handleTimeSelect(slot)}
                  style={{
                    padding: '12px 8px',
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 13,
                    letterSpacing: '0.06em',
                    color: '#E9E3D6',
                    background: 'transparent',
                    border: '1px solid rgba(199,158,107,0.3)',
                    cursor: 'pointer',
                    borderRadius: 1,
                    transition: 'border-color 0.15s, background 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#C79E6B'
                    e.currentTarget.style.background = 'rgba(199,158,107,0.08)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(199,158,107,0.3)'
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Step 3: Form */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C79E6B', margin: 0 }}>
              Step 3 - Your details
            </p>
            <button
              onClick={() => setStep(2)}
              style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8C877F', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              &larr; Back
            </button>
          </div>

          {/* Selected date + time summary */}
          <div style={{ background: '#15171C', border: '1px solid rgba(199,158,107,0.15)', padding: '14px 18px', marginBottom: 28, display: 'flex', gap: 32 }}>
            <div>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#8C877F', margin: '0 0 4px' }}>Date</p>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: '#E9E3D6', margin: 0 }}>{dateStr}</p>
            </div>
            <div>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#8C877F', margin: '0 0 4px' }}>Time</p>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: '#E9E3D6', margin: 0 }}>{selectedTime}</p>
            </div>
          </div>

          {state.error && (
            <div style={{ background: 'rgba(200,80,80,0.1)', border: '1px solid rgba(200,80,80,0.25)', color: '#E87777', fontFamily: "'Jost', sans-serif", fontSize: 13, padding: '10px 14px', marginBottom: 20, borderRadius: 1 }}>
              {state.error}
            </div>
          )}

          <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <input type="hidden" name="date" value={dateStr} />
            <input type="hidden" name="time" value={selectedTime ?? ''} />

            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
              <div>
                <label style={labelStyle}>{t.form.name} *</label>
                <input name="name" type="text" required style={fieldStyle} />
              </div>
              <div>
                <label style={labelStyle}>{t.form.email} *</label>
                <input name="email" type="email" required style={fieldStyle} />
              </div>
            </div>

            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
              <div>
                <label style={labelStyle}>{t.form.phone}</label>
                <input name="phone" type="tel" style={fieldStyle} />
              </div>
              <div>
                <label style={labelStyle}>{t.form.topic} *</label>
                <select name="topic" required style={{ ...fieldStyle, appearance: 'none', cursor: 'pointer' }}>
                  <option value="">- select -</option>
                  {Object.entries(t.topics)
                    .filter(([key]) => key !== 'label')
                    .map(([key, label]) => (
                      <option key={key} value={key}>{label as string}</option>
                    ))}
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle}>{t.form.notes}</label>
              <textarea name="notes" rows={3} style={{ ...fieldStyle, resize: 'vertical' }} />
            </div>

            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: '#5E5A53', margin: 0, lineHeight: 1.7 }}>
              {t.form.disclaimer}
            </p>

            <button
              type="submit"
              disabled={pending}
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 11,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#0F1014',
                background: pending ? '#A67C3E' : '#C79E6B',
                border: 'none',
                padding: '14px 32px',
                cursor: pending ? 'not-allowed' : 'pointer',
                borderRadius: 1,
                alignSelf: 'flex-start',
              }}
            >
              {pending ? 'Sending...' : t.form.submit}
            </button>
          </form>
        </motion.div>
      )}
    </div>
  )
}
