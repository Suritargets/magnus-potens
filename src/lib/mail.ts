/**
 * Magnus & Potens — Nodemailer | Self-hosted SMTP
 *
 * Geconfigureerd voor een eigen mailserver (Postfix / Postal / Haraka / cPanel Exim).
 * Singleton transport met connection pooling, DKIM support, en dual-format templates.
 */
import 'server-only'
import nodemailer, { type Transporter } from 'nodemailer'

// ── Singleton transport ────────────────────────────────────────────────────────

let _transporter: Transporter | null = null

function getTransporter(): Transporter {
  if (_transporter) return _transporter

  _transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST,                    // bijv. mail.magnus-potens.com
    port:   Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === 'true',       // true = port 465 SSL, false = STARTTLS

    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
      : undefined,                                     // Geen auth = relay zonder login (lokaal)

    // Eigen server: EHLO hostname (moet overeenkomen met PTR/rDNS record)
    name: process.env.SMTP_HOSTNAME ?? process.env.SMTP_HOST,

    tls: {
      // false als je een geldig cert hebt (Let's Encrypt).
      // true voor self-signed certs op interne mailservers.
      rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== 'false',
      minVersion: 'TLSv1.2',
    },

    // Connection pooling — hergebruik verbindingen
    pool:           true,
    maxConnections: 5,
    maxMessages:    200,

    // Timeouts (ms)
    connectionTimeout: 10_000,
    greetingTimeout:   8_000,
    socketTimeout:     30_000,

    // DKIM signing (optioneel maar sterk aanbevolen voor deliverability)
    ...(process.env.DKIM_PRIVATE_KEY
      ? {
          dkim: {
            domainName:   process.env.DKIM_DOMAIN    ?? 'magnus-potens.com',
            keySelector:  process.env.DKIM_SELECTOR  ?? 'default',
            privateKey:   process.env.DKIM_PRIVATE_KEY.replace(/\\n/g, '\n'),
          },
        }
      : {}),
  })

  return _transporter
}

// ── Typen ──────────────────────────────────────────────────────────────────────

export interface MailPayload {
  to:       string | string[]
  subject:  string
  html:     string
  text:     string
  replyTo?: string
}

export interface MailResult {
  success:    boolean
  messageId?: string
  error?:     unknown
}

// ── Core send ─────────────────────────────────────────────────────────────────

export async function sendMail(payload: MailPayload): Promise<MailResult> {
  const from = process.env.SMTP_FROM ?? '"Magnus & Potens" <noreply@magnus-potens.com>'

  try {
    const info = await getTransporter().sendMail({
      from,
      to:      payload.to,
      replyTo: payload.replyTo,
      subject: payload.subject,
      html:    payload.html,
      text:    payload.text,
      headers: {
        'X-Mailer':   'Magnus & Potens Mailer',
        'X-Priority': '3',
      },
    })

    console.warn(`[mail] ✓ ${Array.isArray(payload.to) ? payload.to.join(', ') : payload.to} | ${info.messageId}`)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('[mail] ✗ send failed:', error)
    return { success: false, error }
  }
}

// ── Verbinding testen (gebruik bij server start of healthcheck) ────────────────

export async function verifyMailConnection(): Promise<boolean> {
  try {
    await getTransporter().verify()
    console.warn('[mail] ✓ SMTP verbinding OK')
    return true
  } catch (error) {
    console.error('[mail] ✗ SMTP verbinding mislukt:', error)
    return false
  }
}

// ── HTML helper ────────────────────────────────────────────────────────────────

function escHtml(s: string): string {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}

// ── Email layout (table-based voor Outlook/Gmail compat) ──────────────────────

const C = {
  dark:   '#0F1014',
  card:   '#15171C',
  gold:   '#C79E6B',
  text:   '#E9E3D6',
  muted:  '#8C877F',
  dim:    '#5E5A53',
  border: 'rgba(199,158,107,0.18)',
} as const

function layout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="dark">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:${C.dark};font-family:Georgia,'Times New Roman',serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center" style="padding:48px 20px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

      <!-- Logo header -->
      <tr><td style="padding-bottom:28px;border-bottom:1px solid ${C.border};text-align:center;">
        <p style="margin:0 0 5px;font-family:Arial,sans-serif;font-size:13px;letter-spacing:0.3em;color:${C.gold};text-transform:uppercase;">MAGNUS &amp; POTENS</p>
        <p style="margin:0;font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.4em;color:${C.muted};text-transform:uppercase;">LAW &nbsp;|&nbsp; ADVISORS</p>
      </td></tr>

      <!-- Content -->
      <tr><td style="padding:40px 0;">${body}</td></tr>

      <!-- Footer -->
      <tr><td style="padding-top:24px;border-top:1px solid ${C.border};text-align:center;">
        <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:11px;color:${C.muted};">
          <a href="mailto:info@magnus-potens.com" style="color:${C.gold};text-decoration:none;">info@magnus-potens.com</a>
          &nbsp;·&nbsp;
          <a href="https://magnus-potens.com" style="color:${C.gold};text-decoration:none;">magnus-potens.com</a>
        </p>
        <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.18em;color:${C.dim};text-transform:uppercase;">Discretion · Protection · Purpose</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`
}

// ── Template: notificatie aan het kantoor ─────────────────────────────────────

function ownerHtml(d: { name: string; email: string; message: string; subject?: string }): string {
  return layout(`Nieuwe aanvraag — ${d.name}`, `
    <h2 style="margin:0 0 6px;font-size:30px;font-weight:400;color:${C.text};">Nieuwe aanvraag</h2>
    <p style="margin:0 0 32px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.3em;color:${C.gold};text-transform:uppercase;">Ontvangen via magnus-potens.com</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${C.border};">
      <tr><td style="padding:18px 22px;border-bottom:1px solid ${C.border};">
        <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.3em;color:${C.muted};text-transform:uppercase;">Name</p>
        <p style="margin:0;font-size:18px;color:${C.text};">${escHtml(d.name)}</p>
      </td></tr>
      <tr><td style="padding:18px 22px;border-bottom:1px solid ${C.border};">
        <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.3em;color:${C.muted};text-transform:uppercase;">Email</p>
        <p style="margin:0;font-size:18px;"><a href="mailto:${escHtml(d.email)}" style="color:${C.gold};text-decoration:none;">${escHtml(d.email)}</a></p>
      </td></tr>
      ${d.subject ? `<tr><td style="padding:18px 22px;border-bottom:1px solid ${C.border};">
        <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.3em;color:${C.muted};text-transform:uppercase;">Subject</p>
        <p style="margin:0;font-size:18px;color:${C.text};">${escHtml(d.subject)}</p>
      </td></tr>` : ''}
      <tr><td style="padding:18px 22px;">
        <p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.3em;color:${C.muted};text-transform:uppercase;">Message</p>
        <p style="margin:0;font-size:15px;line-height:1.85;color:#B7B1A6;border-left:2px solid ${C.gold};padding-left:14px;">${escHtml(d.message).replace(/\n/g,'<br>')}</p>
      </td></tr>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
      <tr><td align="center">
        <a href="mailto:${escHtml(d.email)}?subject=Re%3A%20Your%20enquiry%20%E2%80%94%20Magnus%20%26%20Potens"
           style="display:inline-block;background:${C.gold};color:${C.dark};font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;padding:14px 30px;">
          Reply to enquiry
        </a>
      </td></tr>
    </table>`)
}

function ownerText(d: { name: string; email: string; message: string; subject?: string }): string {
  return `NIEUWE AANVRAAG — Magnus & Potens
=====================================
Naam:    ${d.name}
Email:   ${d.email}
${d.subject ? `Onderwerp: ${d.subject}\n` : ''}
Bericht:
${d.message}

-------------------------------------
Beantwoord via: info@magnus-potens.com
`
}

// ── Template: bevestiging aan de client ───────────────────────────────────────

function clientHtml(name: string): string {
  return layout('Your enquiry — Magnus & Potens', `
    <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.42em;color:${C.gold};text-transform:uppercase;">Thank you</p>
    <h2 style="margin:0 0 28px;font-size:38px;font-weight:400;color:${C.text};line-height:1.08;">${escHtml(name)}.</h2>

    <p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:15px;line-height:1.85;color:#A7A29A;">
      Your message has reached us. A member of the firm will respond in confidence shortly.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="3" style="background:${C.gold};"></td>
        <td style="padding:12px 18px;">
          <p style="margin:0;font-size:18px;font-style:italic;line-height:1.6;color:${C.muted};">
            Every enquiry is handled with the discretion and personal attention our clients expect.
          </p>
        </td>
      </tr>
    </table>

    <p style="margin:28px 0 0;font-family:Arial,sans-serif;font-size:12px;color:${C.dim};">
      If this is urgent, reach us directly at
      <a href="mailto:info@magnus-potens.com" style="color:${C.gold};text-decoration:none;">info@magnus-potens.com</a>.
    </p>`)
}

function clientText(name: string): string {
  return `Thank you, ${name}.

Your message has reached us. A member of the firm will respond
in confidence shortly.

Every enquiry is handled with the discretion and personal
attention our clients expect.

For urgent matters: info@magnus-potens.com

— Magnus & Potens | Law & Advisors
  Discretion · Protection · Purpose
  magnus-potens.com
`
}

// ── Publieke API ───────────────────────────────────────────────────────────────

export async function sendContactNotification(data: {
  name:     string
  email:    string
  message:  string
  subject?: string
}): Promise<void> {
  const firm = process.env.CONTACT_EMAIL ?? 'info@magnus-potens.com'

  await Promise.allSettled([
    // 1. Notificatie aan het kantoor
    sendMail({
      to:      firm,
      subject: `New enquiry from ${data.name} — Magnus & Potens`,
      html:    ownerHtml(data),
      text:    ownerText(data),
      replyTo: data.email,
    }),
    // 2. Bevestiging aan de client
    sendMail({
      to:      data.email,
      subject: 'Your enquiry has been received — Magnus & Potens',
      html:    clientHtml(data.name),
      text:    clientText(data.name),
      replyTo: firm,
    }),
  ])
}

// ── Appointment email templates ────────────────────────────────────────────────

function apptClientHtml(d: { name: string; date: string; time: string; topic: string }): string {
  return layout('Appointment confirmed — Magnus & Potens', `
    <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.42em;color:${C.gold};text-transform:uppercase;">Appointment confirmed</p>
    <h2 style="margin:0 0 28px;font-size:38px;font-weight:400;color:${C.text};line-height:1.08;">${escHtml(d.name)}.</h2>
    <p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:15px;line-height:1.85;color:#A7A29A;">
      Your consultation request has been received. We will confirm your appointment and be in touch shortly.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${C.border};">
      <tr><td style="padding:18px 22px;border-bottom:1px solid ${C.border};">
        <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.3em;color:${C.muted};text-transform:uppercase;">Date</p>
        <p style="margin:0;font-size:18px;color:${C.text};">${escHtml(d.date)}</p>
      </td></tr>
      <tr><td style="padding:18px 22px;border-bottom:1px solid ${C.border};">
        <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.3em;color:${C.muted};text-transform:uppercase;">Time</p>
        <p style="margin:0;font-size:18px;color:${C.text};">${escHtml(d.time)}</p>
      </td></tr>
      <tr><td style="padding:18px 22px;">
        <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.3em;color:${C.muted};text-transform:uppercase;">Topic</p>
        <p style="margin:0;font-size:18px;color:${C.text};">${escHtml(d.topic)}</p>
      </td></tr>
    </table>
    <p style="margin:28px 0 0;font-family:Arial,sans-serif;font-size:12px;color:${C.dim};">
      To reschedule or cancel, contact us at
      <a href="mailto:info@magnus-potens.com" style="color:${C.gold};text-decoration:none;">info@magnus-potens.com</a>.
    </p>`)
}

function apptClientText(d: { name: string; date: string; time: string; topic: string }): string {
  return `Appointment confirmed — Magnus & Potens
=========================================
Dear ${d.name},

Your consultation request has been received.

Date:  ${d.date}
Time:  ${d.time}
Topic: ${d.topic}

We will confirm your appointment and be in touch shortly.
To reschedule or cancel: info@magnus-potens.com

— Magnus & Potens | Law & Advisors
  Discretion · Protection · Purpose
  magnus-potens.com
`
}

function apptOwnerHtml(d: {
  name: string
  email: string
  phone?: string
  date: string
  time: string
  topic: string
  notes?: string
}): string {
  return layout(`New appointment request — ${d.name}`, `
    <h2 style="margin:0 0 6px;font-size:30px;font-weight:400;color:${C.text};">New appointment</h2>
    <p style="margin:0 0 32px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.3em;color:${C.gold};text-transform:uppercase;">Via magnus-potens.com</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${C.border};">
      <tr><td style="padding:14px 22px;border-bottom:1px solid ${C.border};">
        <p style="margin:0 0 3px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.3em;color:${C.muted};text-transform:uppercase;">Client</p>
        <p style="margin:0;font-size:17px;color:${C.text};">${escHtml(d.name)}</p>
      </td></tr>
      <tr><td style="padding:14px 22px;border-bottom:1px solid ${C.border};">
        <p style="margin:0 0 3px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.3em;color:${C.muted};text-transform:uppercase;">Email</p>
        <p style="margin:0;font-size:17px;"><a href="mailto:${escHtml(d.email)}" style="color:${C.gold};text-decoration:none;">${escHtml(d.email)}</a></p>
      </td></tr>
      ${d.phone ? `<tr><td style="padding:14px 22px;border-bottom:1px solid ${C.border};">
        <p style="margin:0 0 3px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.3em;color:${C.muted};text-transform:uppercase;">Phone</p>
        <p style="margin:0;font-size:17px;color:${C.text};">${escHtml(d.phone)}</p>
      </td></tr>` : ''}
      <tr><td style="padding:14px 22px;border-bottom:1px solid ${C.border};">
        <p style="margin:0 0 3px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.3em;color:${C.muted};text-transform:uppercase;">Requested date &amp; time</p>
        <p style="margin:0;font-size:17px;color:${C.text};">${escHtml(d.date)} at ${escHtml(d.time)}</p>
      </td></tr>
      <tr><td style="padding:14px 22px;${d.notes ? `border-bottom:1px solid ${C.border};` : ''}">
        <p style="margin:0 0 3px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.3em;color:${C.muted};text-transform:uppercase;">Topic</p>
        <p style="margin:0;font-size:17px;color:${C.text};">${escHtml(d.topic)}</p>
      </td></tr>
      ${d.notes ? `<tr><td style="padding:14px 22px;">
        <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.3em;color:${C.muted};text-transform:uppercase;">Notes</p>
        <p style="margin:0;font-size:14px;line-height:1.75;color:#B7B1A6;border-left:2px solid ${C.gold};padding-left:12px;">${escHtml(d.notes).replace(/\n/g, '<br>')}</p>
      </td></tr>` : ''}
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
      <tr><td align="center">
        <a href="mailto:${escHtml(d.email)}?subject=Re%3A%20Consultation%20Request%20%E2%80%94%20Magnus%20%26%20Potens"
           style="display:inline-block;background:${C.gold};color:${C.dark};font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;padding:13px 28px;">
          Reply to client
        </a>
      </td></tr>
    </table>`)
}

function apptOwnerText(d: {
  name: string
  email: string
  phone?: string
  date: string
  time: string
  topic: string
  notes?: string
}): string {
  return `NEW APPOINTMENT — Magnus & Potens
=====================================
Client: ${d.name}
Email:  ${d.email}
${d.phone ? `Phone:  ${d.phone}\n` : ''}Date:   ${d.date} at ${d.time}
Topic:  ${d.topic}
${d.notes ? `\nNotes:\n${d.notes}\n` : ''}
-------------------------------------
Reply: ${d.email}
`
}

export async function sendAppointmentEmails(data: {
  name:   string
  email:  string
  phone?: string
  date:   string
  time:   string
  topic:  string
  notes?: string
}): Promise<void> {
  const firm = process.env.CONTACT_EMAIL ?? 'info@magnus-potens.com'

  await Promise.allSettled([
    sendMail({
      to:      firm,
      subject: `Appointment request: ${data.name} — ${data.date} ${data.time}`,
      html:    apptOwnerHtml(data),
      text:    apptOwnerText(data),
      replyTo: data.email,
    }),
    sendMail({
      to:      data.email,
      subject: 'Your appointment request — Magnus & Potens',
      html:    apptClientHtml(data),
      text:    apptClientText(data),
      replyTo: firm,
    }),
  ])
}
