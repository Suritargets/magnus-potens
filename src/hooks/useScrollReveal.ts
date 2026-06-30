'use client'

import { useEffect, useRef } from 'react'

/**
 * useScrollReveal
 *
 * Attaches an IntersectionObserver to a container ref.
 * When any child with class `mp-reveal` enters the viewport,
 * the class `mp-in` is added — triggering the CSS transition.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('mp-in')
            observer.unobserve(entry.target) // animate once
          }
        })
      },
      { threshold: 0.12 }
    )

    // Observe all .mp-reveal children inside the container
    const targets = container.querySelectorAll('.mp-reveal')
    targets.forEach((el) => observer.observe(el))

    // Also observe the container itself if it has the class
    if (container.classList.contains('mp-reveal')) {
      observer.observe(container)
    }

    return () => observer.disconnect()
  }, [])

  return ref
}
