import { useEffect, useRef, useState } from 'react'

// Never hides: jumps to the bottom, then flips to back-to-top. Outline-only, so it samples the background
// behind it and switches between a white and a dark outline.
function ScrollNextButton() {
  const [atBottom, setAtBottom] = useState(false)
  const [onDark, setOnDark] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const doc = document.documentElement

    // Find the topmost painted (non-transparent) background behind the button
    // and decide whether it reads as dark, so the outline can contrast it.
    const sampleBg = () => {
      const btn = btnRef.current
      if (!btn) return
      const r = btn.getBoundingClientRect()
      const x = r.left + r.width / 2
      const y = r.top + r.height / 2
      for (const el of document.elementsFromPoint(x, y)) {
        if (btn.contains(el)) continue
        const m = getComputedStyle(el).backgroundColor.match(/rgba?\(([^)]+)\)/)
        if (!m) continue
        const [cr, cg, cb, a = 1] = m[1].split(',').map((s) => parseFloat(s))
        if (a <= 0) continue
        setOnDark(0.299 * cr + 0.587 * cg + 0.114 * cb < 140)
        return
      }
      setOnDark(false)
    }

    const onScroll = () => {
      setAtBottom(window.scrollY + window.innerHeight >= doc.scrollHeight - 120)
      sampleBg()
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
      ref={btnRef}
      type="button"
      className={`scroll-next${onDark ? ' scroll-next--on-dark' : ''}`}
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
