'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode, CSSProperties } from 'react'

const EASE = [0.22, 1, 0.36, 1] as const

interface GroupProps {
  children: ReactNode
  stagger?: number
  className?: string
  style?: CSSProperties
}

export function Stagger({ children, stagger = 0.12, className, style }: GroupProps) {
  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  )
}

interface ItemProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function StaggerItem({ children, className, style }: ItemProps) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={className}
      style={style}
      variants={{
        hidden: { opacity: 0, y: reduce ? 0 : 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  )
}
