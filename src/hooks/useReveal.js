import { useEffect, useRef } from 'react'
import { reveal } from '@/lib/scroll-effects'

/**
 * Scroll-reveal: adds the `is-in` class to the returned ref once the element
 * scrolls into view, then disconnects. Fires once — reveals are entrances,
 * not repeatable transitions. Static sections use `data-reveal` instead.
 */
export default function useReveal({ threshold = 0.15 } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) return reveal(ref.current, threshold)
  }, [threshold])

  return ref
}
