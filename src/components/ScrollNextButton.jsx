import { useEffect, useState } from 'react'

// Floating bottom-right pill. On the way down it jumps to the bottom of the
// page; once you're there it flips into a back-to-top control. It never hides,
// so there's always a one-tap way to the other end of the page.
function ScrollNextButton() {
  const [atBottom, setAtBottom] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      setAtBottom(window.scrollY + window.innerHeight >= doc.scrollHeight - 120)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const onClick = () => {
    const top = atBottom ? 0 : document.documentElement.scrollHeight
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      className="scroll-next"
      onClick={onClick}
      aria-label={atBottom ? 'Scroll to top' : 'Scroll to bottom'}
    >
      <svg viewBox="0 0 16 16" aria-hidden="true">
        {atBottom ? (
          <path
            d="M8 13V3M3.5 7.5L8 3l4.5 4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M8 3v10M3.5 8.5L8 13l4.5-4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  )
}

export default ScrollNextButton
