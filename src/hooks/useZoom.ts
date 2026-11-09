import { useEffect, useRef } from 'react'
import { zoom } from '@/lib/scroll-effects'

/**
 * Scroll-scrubbed dolly zoom (see lib/scroll-effects). Attach the returned ref
 * to an INNER content wrapper, not an ancestor of a `position: sticky` child.
 * Static sections use `data-zoom` instead.
 */
export default function useZoom<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (ref.current) return zoom(ref.current)
  }, [])

  return ref
}
