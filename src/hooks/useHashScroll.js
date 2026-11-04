import { useEffect } from 'react'

/**
 * Land a deep link on its section after the page has mounted.
 *
 * The browser jumps to /#security or /careers#eng while the HTML parses, but
 * hydration can still shift layout. Repeat the jump once the island has
 * mounted. `scroll-padding-top` on <html> keeps the target clear of the
 * navbar, the same as for an in-page hash click.
 */
export default function useHashScroll() {
  useEffect(() => {
    const id = window.location.hash.slice(1)
    
    if (id) document.getElementById(id)?.scrollIntoView()
  }, [])
}
