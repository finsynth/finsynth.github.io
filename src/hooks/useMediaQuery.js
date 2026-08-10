import { useEffect, useState } from 'react'

/**
 * Subscribe to a media query. Most responsive work on this page belongs in CSS;
 * this is for the cases where the layout change is structural — a hover menu
 * that has to become a tap-to-expand list, an animation that shouldn't run on a
 * phone — and the markup or behaviour itself has to differ.
 *
 * Starts false so the first server/hydration pass matches the desktop markup,
 * then corrects on mount.
 */
export default function useMediaQuery(query) {
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
