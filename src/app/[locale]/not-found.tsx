import Link from 'next/link'

export default function NotFound() {
  return (
    <main
      style={{ background: '#0F1014' }}
      className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center"
    >
      {/* Decorative number */}
      <div
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(96px, 18vw, 180px)',
          fontWeight: 400,
          lineHeight: 1,
          background: 'linear-gradient(180deg, #E7CB8E 0%, #C79E6B 48%, #9A7846 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.02em',
        }}
        aria-hidden="true"
      >
        404
      </div>

      {/* Label */}
      <div className="flex items-center gap-3">
        <span style={{ width: 30, height: 1, background: 'rgba(199,158,107,0.5)', display: 'inline-block' }} />
        <span
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 11,
            letterSpacing: '0.4em',
            color: '#C79E6B',
            textTransform: 'uppercase',
          }}
        >
          Page not found
        </span>
        <span style={{ width: 30, height: 1, background: 'rgba(199,158,107,0.5)', display: 'inline-block' }} />
      </div>

      <h1
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(26px, 4vw, 38px)',
          fontWeight: 400,
          color: '#F3EEE4',
          lineHeight: 1.2,
          maxWidth: 480,
          margin: 0,
        }}
      >
        This page does not exist or has been moved.
      </h1>

      <p
        style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: 16,
          lineHeight: 1.8,
          color: '#8C877F',
          fontWeight: 300,
          maxWidth: 380,
          margin: 0,
        }}
      >
        Return to the firm&apos;s homepage, or reach us directly at{' '}
        <a
          href="mailto:info@magnus-potens.com"
          style={{ color: '#C79E6B', textDecoration: 'none' }}
        >
          info@magnus-potens.com
        </a>
        .
      </p>

      <Link
        href="/"
        style={{
          marginTop: 8,
          display: 'inline-block',
          fontFamily: "'Jost', sans-serif",
          fontSize: 12,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#0F1014',
          background: '#C79E6B',
          padding: '14px 32px',
          textDecoration: 'none',
          transition: 'background 0.3s',
        }}
      >
        ← Return home
      </Link>
    </main>
  )
}
