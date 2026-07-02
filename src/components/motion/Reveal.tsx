'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode, CSSProperties } from 'react'

const EASE = [0.22, 1, 0.36, 1] as const

interface Props {
  children: ReactNode
  delay?: number
  y?: number
  duration?: number
  className?: string
  style?: CSSProperties
}

export function Reveal({ children, delay = 0, y = 26, duration = 0.9, className, style }: Props) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}
