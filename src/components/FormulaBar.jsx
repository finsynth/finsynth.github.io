import { useEffect, useState } from 'react'

export default function FormulaBar() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const hero = document.querySelector('.hero-s2')
    if (!hero) return
    const onScroll = () => {
      // hide once the hero has scrolled past the navbar + bar
      setHidden(hero.getBoundingClientRect().bottom <= 76)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className={`formula-bar${hidden ? ' formula-bar-hidden' : ''}`}>
      <div className="formula-bar-namebox">C3</div>
      <span className="formula-bar-fx">ƒ<em>x</em></span>
      <div className="formula-bar-formula">="FinSynth is the audit-first spreadsheet agent for finance"</div>
    </div>
  );
}
