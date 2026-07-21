import { useEffect, useRef } from 'react'

/**
 * Scroll-reveal: adds the `is-in` class to the returned ref once the element
 * scrolls into view, then disconnects. Mirrors the inline observer used by
 * HowItWorks/Footer/FAQ so every section reveals with the same staging.
 * Fires once — reveals are entrances, not repeatable transitions.
 */
export default function useReveal({ threshold = 0.15 } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('is-in')
            io.disconnect()
          }
        })
      },
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return ref
}
