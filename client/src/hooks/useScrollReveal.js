import { useEffect, useRef } from 'react'

/**
 * Attaches an IntersectionObserver to the returned ref. When the element
 * enters the viewport, `.is-visible` is added, which theme.css uses to
 * animate elements marked with [data-reveal="fade-up" | "fade-in" | ...].
 * Automatically does nothing (renders visible immediately) if the user
 * has requested reduced motion.
 */
export function useScrollReveal(options = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      node.classList.add('is-visible')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('is-visible')
          observer.unobserve(node)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px', ...options },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return ref
}
