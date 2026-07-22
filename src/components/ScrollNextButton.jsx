import { useEffect, useState } from 'react'

// Floating bottom-right pill: jumps to the top of the next section. Targets
// the page's top-level <section>s and the footer; hides once the last stop
// is on screen so it never dead-ends. Respects the sticky navbar offset.
function ScrollNextButton() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      setHidden(window.scrollY + window.innerHeight >= doc.scrollHeight - 160)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goNext = () => {
    const nav = document.querySelector('.navbar')
    const offset = (nav ? nav.getBoundingClientRect().height : 0) + 1
    const stops = [...document.querySelectorAll('.mainContainer > section, .mainContainer > footer')]
    const next = stops.find((el) => el.getBoundingClientRect().top > offset + 8)
    if (next) {
      window.scrollTo({
        top: window.scrollY + next.getBoundingClientRect().top - offset,
        behavior: 'smooth',
      })
    }
  }

  return (
    <button
      type="button"
      className={`scroll-next${hidden ? ' scroll-next--hidden' : ''}`}
      onClick={goNext}
      aria-label="Scroll to next section"
    >
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path
          d="M8 3v10M3.5 8.5L8 13l4.5-4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

export default ScrollNextButton
