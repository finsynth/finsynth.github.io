import { useEffect } from 'react'

/**
 * Land a deep link on its section after the page has mounted.
 *
 * The site is client-rendered, so the browser's native anchor jump for
 * /#security or /careers#eng fires before the target exists — and main.jsx
 * pins the window to the top on load anyway. Repeat the jump once React has
 * put the element in the DOM. `scroll-padding-top` on <html> keeps the target
 * clear of the navbar, the same as for an in-page hash click.
 */
export default function useHashScroll() {
  useEffect(() => {
    const id = window.location.hash.slice(1)
    
    if (id) document.getElementById(id)?.scrollIntoView()
  }, [])
}
