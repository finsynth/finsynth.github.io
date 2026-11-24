import { useEffect, useState } from 'react'

/**
 * For structural changes only (markup or behaviour must differ); everything else belongs in CSS.
 * Starts false so the hydration pass matches the desktop markup, then corrects on mount.
 */
export default function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia(query)
    const sync = () => setMatches(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [query])

  return matches
}
