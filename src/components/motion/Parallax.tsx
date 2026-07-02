'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import type { ReactNode, CSSProperties } from 'react'

interface Props {
  children: ReactNode
  /** Positive = moves slower than scroll (background depth). ~0.1–0.3 subtle. */
  speed?: number
  className?: string
  style?: CSSProperties
}

export function Parallax({ children, speed = 0.15, className, style }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [speed * 120, speed * -120])

  return (
    <motion.div ref={ref} className={className} style={{ ...style, y: reduce ? 0 : y }}>
      {children}
    </motion.div>
  )
}
