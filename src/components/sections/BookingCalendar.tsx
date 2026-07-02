'use client'

import { useActionState, useCallback, useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useLocale, useTranslations } from 'next-intl'
import { bookAppointment } from '@/actions/appointment'

const EASE = [0.22, 1, 0.36, 1] as const
const GOLD = '#C79E6B'
const TEXT = '#E9E3D6'
const MUTED = '#8C877F'
const FAINT = '#5E5A53'
const CARD_BG = '#15171C'
const BORDER = 'rgba(199,158,107,0.18)'

const SERVICE_KEYS = ['corporate', 'private_wealth', 'strategic', 'transactions', 'dispute', 'regulatory', 'other'] as const

interface MonthDay {
  date: string
  open: boolean
  freeCount: number
  totalCount: number
}

interface Slot {
  time: string
  free: boolean
}

type Step = 'date' | 'service' | 'details' | 'done'

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

const initialState = { success: false, error: null as string | null, message: undefined as string | undefined }

export function BookingCalendar() {
  const t = useTranslations('consultation')
  const locale = useLocale()

  const now = new Date()
  const todayStr = toDateStr(now.getFullYear(), now.getMonth() + 1, now.getDate())

  // Kalender state
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth() + 1) // 1-12
  const [monthCache, setMonthCache] = useState<Record<string, MonthDay[]>>({})
  const [loadingMonth, setLoadingMonth] = useState(false)

  // Selectie state
  const [step, setStep] = useState<Step>('date')
  const [calendarOpen, setCalendarOpen] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [daySlots, setDaySlots] = useState<Slot[] | null>(null)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [service, setService] = useState<string | null>(null)
  const [notes, setNotes] = useState('')

  const [state, action, pending] = useActionState(bookAppointment, initialState)

  useEffect(() => {
    if (state.success) setStep('done')
  }, [state.success])

  const monthKey = `${viewYear}-${String(viewMonth).padStart(2, '0')}`

  // Maanddata laden
  useEffect(() => {
    if (monthCache[monthKey]) return
    let cancelled = false
    setLoadingMonth(true)
    fetch(`/api/appointments/month?month=${monthKey}`)
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled) setMonthCache((prev) => ({ ...prev, [monthKey]: json.days ?? [] }))
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoadingMonth(false)
      })
    return () => {
      cancelled = true
    }
  }, [monthKey, monthCache])

  const days = monthCache[monthKey]
  const dayByDate = useMemo(() => new Map((days ?? []).map((d) => [d.date, d])), [days])

  const monthLabel = useMemo(
    () =>
      // timeZone UTC: labels moeten de kalenderdatum tonen, niet de lokale verschuiving
      new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
        new Date(Date.UTC(viewYear, viewMonth - 1, 1))
      ),
    [locale, viewYear, viewMonth]
  )

  const weekdayLabels = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' })
    // Ma t/m zo — 5 jan 2026 is een maandag
    return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(Date.UTC(2026, 0, 5 + i))))
  }, [locale])

  // Grid: maandag-start
  const gridCells = useMemo(() => {
    const firstDow = new Date(Date.UTC(viewYear, viewMonth - 1, 1)).getUTCDay() // 0=zo
    const lead = (firstDow + 6) % 7 // ma-start offset
    const daysInMonth = new Date(Date.UTC(viewYear, viewMonth, 0)).getUTCDate()
    const cells: (number | null)[] = Array.from({ length: lead }, () => null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    while (cells.length % 7 !== 0) cells.push(null)
    return cells
  }, [viewYear, viewMonth])

  const changeMonth = useCallback(
    (delta: number) => {
      let y = viewYear
      let m = viewMonth + delta
      if (m < 1) { m = 12; y-- }
      if (m > 12) { m = 1; y++ }
      // Niet vóór de huidige maand navigeren
      if (y < now.getFullYear() || (y === now.getFullYear() && m < now.getMonth() + 1)) return
      setViewYear(y)
      setViewMonth(m)
    },
    [viewYear, viewMonth, now]
  )

  const selectDay = useCallback((dateStr: string) => {
    setSelectedDate(dateStr)
    setSelectedTime(null)
    setDaySlots(null)
    setLoadingSlots(true)
    setCalendarOpen(false) // accordion dicht: tijdslots komen naar boven
    fetch(`/api/appointments/slots?date=${dateStr}`)
      .then((r) => r.json())
      .then((json) => setDaySlots(json.slots ?? []))
      .catch(() => setDaySlots([]))
      .finally(() => setLoadingSlots(false))
  }, [])

  const selectedDateLabel = selectedDate
    ? new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(
        new Date(`${selectedDate}T00:00:00`)
      )
    : ''

  const labelStyle = {
    display: 'block',
    fontFamily: "'Jost', sans-serif",
    fontSize: 10,
    letterSpacing: '0.2em',
    textTransform: 'uppercase' as const,
    color: MUTED,
    marginBottom: 6,
  }

  const fieldStyle = {
    width: '100%',
    background: '#0F1014',
    border: `1px solid ${BORDER}`,
    color: TEXT,
    fontFamily: "'Jost', sans-serif",
    fontSize: 14,
    padding: '12px 14px',
    borderRadius: 1,
    outline: 'none',
  }

  // ─── Voortgangsindicator ────────────────────────────────────────────────
  const steps: { key: Step; label: string }[] = [
    { key: 'date', label: t('calendar.step_date') },
    { key: 'service', label: t('calendar.step_service') },
    { key: 'details', label: t('calendar.step_details') },
  ]
  const stepIndex = step === 'done' ? 3 : steps.findIndex((s) => s.key === step)

  return (
    <div>
      {/* Stappen indicator */}
      {step !== 'done' && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 40 }}>
          {steps.map((s, i) => (
            <div key={s.key} style={{ flex: 1 }}>
              <div
                style={{
                  height: 2,
                  background: i <= stepIndex ? GOLD : 'rgba(199,158,107,0.15)',
                  transition: 'background 0.4s',
                  marginBottom: 8,
                }}
              />
              <p
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 10,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: i <= stepIndex ? GOLD : FAINT,
                  margin: 0,
                }}
              >
                {i + 1}. {s.label}
              </p>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* ─── STAP 1: Kalender + tijdslots ─────────────────────────────── */}
        {step === 'date' && (
          <motion.div
            key="date"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {/* Kalender — accordion: klapt dicht zodra een datum gekozen is */}
            <AnimatePresence initial={false} mode="wait">
              {calendarOpen ? (
                <motion.div
                  key="calendar-open"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  style={{ overflow: 'hidden' }}
                >
                  {/* Maandnavigatie */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                    <button
                      type="button"
                      onClick={() => changeMonth(-1)}
                      aria-label="Previous month"
                      style={{
                        fontFamily: "'Jost', sans-serif", fontSize: 18, color: GOLD,
                        background: 'none', border: `1px solid ${BORDER}`, width: 42, height: 42,
                        cursor: 'pointer', borderRadius: 1,
                      }}
                    >
                      ←
                    </button>
                    <h2
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: 'clamp(24px, 3.5vw, 34px)',
                        fontWeight: 400,
                        color: TEXT,
                        margin: 0,
                        textTransform: 'capitalize',
                      }}
                    >
                      {monthLabel}
                    </h2>
                    <button
                      type="button"
                      onClick={() => changeMonth(1)}
                      aria-label="Next month"
                      style={{
                        fontFamily: "'Jost', sans-serif", fontSize: 18, color: GOLD,
                        background: 'none', border: `1px solid ${BORDER}`, width: 42, height: 42,
                        cursor: 'pointer', borderRadius: 1,
                      }}
                    >
                      →
                    </button>
                  </div>

                  {/* Weekdag headers */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 6 }}>
                    {weekdayLabels.map((w) => (
                      <p
                        key={w}
                        style={{
                          fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: '0.22em',
                          textTransform: 'uppercase', color: FAINT, textAlign: 'center', margin: 0, padding: '8px 0',
                        }}
                      >
                        {w}
                      </p>
                    ))}
                  </div>

                  {/* Dagen grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, opacity: loadingMonth && !days ? 0.5 : 1 }}>
                    {gridCells.map((d, i) => {
                      if (d === null) return <div key={`x${i}`} />
                      const dateStr = toDateStr(viewYear, viewMonth, d)
                      const info = dayByDate.get(dateStr)
                      const isPast = dateStr < todayStr
                      const isToday = dateStr === todayStr
                      const bookable = !isPast && !!info?.open && info.freeCount > 0
                      const isSelected = selectedDate === dateStr

                      return (
                        <button
                          key={dateStr}
                          type="button"
                          disabled={!bookable}
                          onClick={() => selectDay(dateStr)}
                          style={{
                            aspectRatio: '1.15',
                            minHeight: 64,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 4,
                            background: isSelected ? 'rgba(199,158,107,0.14)' : bookable ? CARD_BG : 'transparent',
                            border: isSelected
                              ? `1px solid ${GOLD}`
                              : bookable
                                ? `1px solid ${BORDER}`
                                : '1px solid rgba(255,255,255,0.04)',
                            cursor: bookable ? 'pointer' : 'default',
                            borderRadius: 1,
                            transition: 'border-color 0.25s, background 0.25s, transform 0.25s',
                          }}
                          onMouseEnter={(e) => {
                            if (bookable && !isSelected) {
                              e.currentTarget.style.borderColor = GOLD
                              e.currentTarget.style.transform = 'translateY(-2px)'
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (bookable && !isSelected) {
                              e.currentTarget.style.borderColor = BORDER
                              e.currentTarget.style.transform = 'none'
                            }
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "'Cormorant Garamond', Georgia, serif",
                              fontSize: 20,
                              color: bookable ? TEXT : 'rgba(233,227,214,0.22)',
                              lineHeight: 1,
                              borderBottom: isToday ? `1px solid ${GOLD}` : 'none',
                              paddingBottom: isToday ? 2 : 0,
                            }}
                          >
                            {d}
                          </span>
                          {bookable && (
                            <span
                              style={{
                                fontFamily: "'Jost', sans-serif",
                                fontSize: 9,
                                letterSpacing: '0.1em',
                                color: GOLD,
                              }}
                            >
                              {info!.freeCount} {t('calendar.free_short')}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  key="calendar-collapsed"
                  type="button"
                  onClick={() => setCalendarOpen(true)}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                    background: CARD_BG,
                    border: `1px solid ${BORDER}`,
                    borderRadius: 1,
                    padding: '18px 22px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    overflow: 'hidden',
                  }}
                >
                  <div>
                    <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, margin: '0 0 4px' }}>
                      {t('calendar.step_date')}
                    </p>
                    <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, color: TEXT, margin: 0, textTransform: 'capitalize' }}>
                      {selectedDateLabel}
                    </p>
                  </div>
                  <span
                    style={{
                      fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.14em',
                      textTransform: 'uppercase', color: MUTED, display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
                    }}
                  >
                    {t('calendar.change_date')} <span style={{ fontSize: 14 }}>✎</span>
                  </span>
                </motion.button>
              )}
            </AnimatePresence>

            {/* Tijdslots — komt naar boven zodra de kalender dichtklapt */}
            <AnimatePresence>
              {selectedDate && !calendarOpen && (
                <motion.div
                  key={selectedDate}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.08 }}
                  style={{ overflow: 'hidden', marginTop: 16 }}
                >
                  <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 1, padding: '24px 22px' }}>
                    <p
                      style={{
                        fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.22em',
                        textTransform: 'uppercase', color: GOLD, margin: '0 0 18px',
                      }}
                    >
                      {t('calendar.step_time')}
                    </p>

                    {loadingSlots ? (
                      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: MUTED }}>…</p>
                    ) : daySlots && daySlots.length === 0 ? (
                      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: MUTED }}>{t('no_slots')}</p>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 10 }}>
                        {(daySlots ?? []).map((slot) => (
                          <button
                            key={slot.time}
                            type="button"
                            disabled={!slot.free}
                            onClick={() => {
                              setSelectedTime(slot.time)
                              setStep('service')
                            }}
                            style={{
                              padding: '13px 8px',
                              fontFamily: "'Jost', sans-serif",
                              fontSize: 13,
                              letterSpacing: '0.06em',
                              color: slot.free ? TEXT : 'rgba(233,227,214,0.25)',
                              background: slot.free ? 'transparent' : 'rgba(255,255,255,0.03)',
                              border: slot.free ? `1px solid rgba(199,158,107,0.35)` : '1px solid rgba(255,255,255,0.05)',
                              cursor: slot.free ? 'pointer' : 'not-allowed',
                              borderRadius: 1,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: 3,
                              transition: 'border-color 0.2s, background 0.2s',
                            }}
                            onMouseEnter={(e) => {
                              if (slot.free) {
                                e.currentTarget.style.borderColor = GOLD
                                e.currentTarget.style.background = 'rgba(199,158,107,0.08)'
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (slot.free) {
                                e.currentTarget.style.borderColor = 'rgba(199,158,107,0.35)'
                                e.currentTarget.style.background = 'transparent'
                              }
                            }}
                          >
                            {slot.time}
                            {!slot.free && (
                              <span style={{ fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                                {t('calendar.booked')}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ─── STAP 2: Service + bericht ────────────────────────────────── */}
        {step === 'service' && (
          <motion.div
            key="service"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <BackButton onClick={() => setStep('date')} label={t('calendar.back')} />
            <SelectionSummary
              items={[
                { label: t('calendar.date'), value: selectedDateLabel },
                { label: t('calendar.time'), value: selectedTime ?? '' },
              ]}
            />

            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, margin: '28px 0 18px' }}>
              {t('calendar.step_service')}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
              {SERVICE_KEYS.map((key) => {
                const active = service === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setService(key)}
                    style={{
                      padding: '18px 16px',
                      textAlign: 'left',
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: 17,
                      color: active ? '#0F1014' : TEXT,
                      background: active ? GOLD : CARD_BG,
                      border: active ? `1px solid ${GOLD}` : `1px solid ${BORDER}`,
                      cursor: 'pointer',
                      borderRadius: 1,
                      transition: 'all 0.25s',
                    }}
                    onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = GOLD }}
                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.borderColor = BORDER }}
                  >
                    {t(`topics.${key}`)}
                  </button>
                )
              })}
            </div>

            <div style={{ marginTop: 28 }}>
              <label style={labelStyle}>{t('calendar.message_label')}</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder={t('calendar.message_placeholder')}
                style={{ ...fieldStyle, resize: 'vertical' }}
              />
            </div>

            <button
              type="button"
              disabled={!service}
              onClick={() => setStep('details')}
              className="mp-shimmer"
              style={{
                marginTop: 28,
                fontFamily: "'Jost', sans-serif",
                fontSize: 11,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#0F1014',
                background: service ? GOLD : 'rgba(199,158,107,0.3)',
                border: 'none',
                padding: '15px 40px',
                cursor: service ? 'pointer' : 'not-allowed',
                borderRadius: 1,
              }}
            >
              {t('calendar.continue')} →
            </button>
          </motion.div>
        )}

        {/* ─── STAP 3: Gegevens ─────────────────────────────────────────── */}
        {step === 'details' && (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <BackButton onClick={() => setStep('service')} label={t('calendar.back')} />
            <SelectionSummary
              items={[
                { label: t('calendar.date'), value: selectedDateLabel },
                { label: t('calendar.time'), value: selectedTime ?? '' },
                { label: t('calendar.service'), value: service ? t(`topics.${service}`) : '' },
              ]}
            />

            {state.error && (
              <div
                style={{
                  background: 'rgba(200,80,80,0.1)', border: '1px solid rgba(200,80,80,0.25)',
                  color: '#E87777', fontFamily: "'Jost', sans-serif", fontSize: 13,
                  padding: '10px 14px', margin: '24px 0 0', borderRadius: 1,
                }}
              >
                {state.error}
              </div>
            )}

            <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 28 }}>
              <input type="hidden" name="date" value={selectedDate ?? ''} />
              <input type="hidden" name="time" value={selectedTime ?? ''} />
              <input type="hidden" name="topic" value={service ?? ''} />
              <input type="hidden" name="notes" value={notes} />

              <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                <div>
                  <label style={labelStyle}>{t('form.name')} *</label>
                  <input name="name" type="text" required style={fieldStyle} />
                </div>
                <div>
                  <label style={labelStyle}>{t('form.phone')} *</label>
                  <input name="phone" type="tel" required style={fieldStyle} />
                </div>
              </div>
              <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                <div>
                  <label style={labelStyle}>{t('form.email')} *</label>
                  <input name="email" type="email" required style={fieldStyle} />
                </div>
                <div>
                  <label style={labelStyle}>{t('form.address')}</label>
                  <input name="address" type="text" style={fieldStyle} />
                </div>
              </div>

              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: FAINT, margin: 0, lineHeight: 1.7 }}>
                {t('form.disclaimer')}
              </p>

              <button
                type="submit"
                disabled={pending}
                className="mp-shimmer"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 11,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#0F1014',
                  background: pending ? '#A67C3E' : GOLD,
                  border: 'none',
                  padding: '15px 40px',
                  cursor: pending ? 'not-allowed' : 'pointer',
                  borderRadius: 1,
                  alignSelf: 'flex-start',
                }}
              >
                {pending ? '…' : t('form.submit')}
              </button>
            </form>
          </motion.div>
        )}

        {/* ─── STAP 4: Bevestiging ──────────────────────────────────────── */}
        {step === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ textAlign: 'center', padding: '48px 0' }}
          >
            <div
              style={{
                width: 72, height: 72, borderRadius: '50%', border: `1px solid ${GOLD}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 28px', color: GOLD, fontSize: 30,
                background: 'rgba(199,158,107,0.06)',
              }}
            >
              ✓
            </div>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 400, color: TEXT, margin: '0 0 14px',
              }}
            >
              {t('form.success_title')}
            </h2>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 15, lineHeight: 1.8, color: MUTED, maxWidth: 460, margin: '0 auto 28px' }}>
              {t('form.success_message')}
            </p>
            <div
              style={{
                display: 'inline-flex', gap: 32, padding: '16px 28px',
                background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 1,
              }}
            >
              <SummaryItem label={t('calendar.date')} value={selectedDateLabel} />
              <SummaryItem label={t('calendar.time')} value={selectedTime ?? ''} />
              <SummaryItem label={t('calendar.service')} value={service ? t(`topics.${service}`) : ''} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function BackButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.16em',
        textTransform: 'uppercase', color: '#8C877F', background: 'none', border: 'none',
        cursor: 'pointer', padding: 0, marginBottom: 20,
      }}
    >
      ← {label}
    </button>
  )
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ textAlign: 'left' }}>
      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#8C877F', margin: '0 0 4px' }}>
        {label}
      </p>
      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: '#E9E3D6', margin: 0, textTransform: 'capitalize' }}>
        {value}
      </p>
    </div>
  )
}

function SelectionSummary({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div
      style={{
        display: 'flex', flexWrap: 'wrap', gap: 32, padding: '16px 20px',
        background: '#15171C', border: '1px solid rgba(199,158,107,0.18)', borderRadius: 1,
      }}
    >
      {items.map((item) => (
        <SummaryItem key={item.label} label={item.label} value={item.value} />
      ))}
    </div>
  )
}
