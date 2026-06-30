import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <main
      style={{ background: '#0F1014', minHeight: '100vh' }}
      className="flex flex-col items-center justify-center gap-8 p-8"
    >
      {/* Brand mark */}
      <div className="text-center" style={{ marginBottom: 8 }}>
        <p
          style={{
            fontFamily: "'Marcellus', Georgia, serif",
            fontSize: 16,
            letterSpacing: '0.28em',
            color: '#E9E3D6',
            margin: '0 0 4px',
          }}
        >
          MAGNUS &amp; POTENS
        </p>
        <p
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 9,
            letterSpacing: '0.42em',
            color: '#C79E6B',
            margin: 0,
          }}
        >
          LAW &nbsp;|&nbsp; ADVISORS
        </p>
      </div>

      <SignUp />
    </main>
  )
}
