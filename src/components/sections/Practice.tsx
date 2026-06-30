'use client'

import { useTranslations } from 'next-intl'

interface PracticeArea {
  num: string
  title: string
  desc: string
}

export function Practice() {
  const t = useTranslations('practice')
  const areas = t.raw('areas') as PracticeArea[]

  return (
    <section
      id="practice"
      className="py-28 md:py-36"
      style={{ backgroundColor: '#F2ECE0' }}
    >
      <div className="max-w-[1280px] mx-auto px-8 md:px-14">
        {/* Header */}
        <div className="mb-16">
          <div className="mp-chip mb-6" style={{ color: '#A67C3E' }}>
            <span className="mp-rule" style={{ backgroundColor: '#A67C3E' }} />
            {t('label')}
          </div>
          <h2
            className="text-[2rem] md:text-[2.6rem] leading-[1.1] font-normal max-w-[520px] mb-5"
            style={{
              fontFamily: 'var(--font-cormorant)',
              color: '#1A1814',
            }}
          >
            {t('headline')}
          </h2>
          <p
            className="text-[14px] leading-relaxed max-w-[480px]"
            style={{
              fontFamily: 'var(--font-jost)',
              fontWeight: 300,
              color: '#6E6A63',
            }}
          >
            {t('subtitle')}
          </p>
        </div>

        {/* 3x2 grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ borderTop: '1px solid rgba(26, 24, 20, 0.14)' }}
        >
          {areas.map((area, index) => {
            const isLastRow = index >= 3
            const isLastInRow = (index + 1) % 3 === 0
            return (
              <div
                key={area.num}
                className="p-8 md:p-10 group"
                style={{
                  borderRight: !isLastInRow ? '1px solid rgba(26, 24, 20, 0.14)' : 'none',
                  borderBottom: !isLastRow ? '1px solid rgba(26, 24, 20, 0.14)' : 'none',
                  transition: 'background 0.3s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(199,158,107,0.06)'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent'
                }}
              >
                <p
                  className="text-[11px] mb-5 tracking-[0.1em]"
                  style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontStyle: 'italic',
                    color: '#C79E6B',
                  }}
                >
                  {area.num}
                </p>
                <h3
                  className="text-[1.15rem] leading-[1.2] mb-4 font-normal"
                  style={{
                    fontFamily: 'var(--font-cormorant)',
                    color: '#1A1814',
                  }}
                >
                  {area.title}
                </h3>
                <p
                  className="text-[13px] leading-relaxed"
                  style={{
                    fontFamily: 'var(--font-jost)',
                    fontWeight: 300,
                    color: '#6E6A63',
                  }}
                >
                  {area.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
