import { useEffect, useRef, useState } from 'react'

/**
 * The self-completing workflow checklist — an auto-scrolling column that loops
 * seamlessly (a vertical marquee). Rows near the top of the masked window read
 * as "handled" — black text + a ticked box — while rows lower down stay grey
 * with an empty box. Each row's box ticks on (and off) as it crosses the
 * active line, so the checklist reads as continuously completing itself.
 *
 * Shared by WhatSection ("One agent, every workflow") and ExcelSection's
 * "Complex workflows" pillar visual — styling lives on the .what-* classes.
 */
const WORKFLOWS = [
  'Building models',
  'Earnings updates',
  'Peer benchmarking',
  'Model audits',
  'Catalyst analysis',
  'Filing analysis',
  'Scenario modeling',
  'Consensus tracking',
  'Deal analysis',
  'Sector mapping',
  'Portfolio monitoring',
  'Thesis testing',
]

function Tick() {
  return (
    <svg className="what-tick" viewBox="0 0 14 14" aria-hidden="true">
      <path
        d="M3 7.4l2.7 2.7L11 4.1"
        fill="none" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

// Fraction of the viewport height that divides "active" (above) from "upcoming"
// (below). ~0.42 keeps roughly the top two rows black and the rest grey.
const ACTIVE_LINE = 0.42

export default function WorkflowMarquee() {
  const viewportRef = useRef(null)
  const itemRefs = useRef([])

  // Duplicated once so the vertical marquee loops seamlessly (translateY -50%).
  const loop = [...WORKFLOWS, ...WORKFLOWS]
  const [active, setActive] = useState(() => loop.map(() => false))

  // The marquee moves every frame via CSS, so we poll on rAF: a row is "active"
  // (black + ticked) once its middle rises above the active line and until it
  // exits the top of the window. The class flip drives the CSS tick/untick
  // transitions, so boxes animate as rows cross the line — no manual tweening.
  useEffect(() => {
    const vp = viewportRef.current
    if (!vp) return
    let raf = 0
    const measure = () => {
      const box = vp.getBoundingClientRect()
      const line = box.top + box.height * ACTIVE_LINE
      setActive((prev) => {
        let changed = false
        const next = itemRefs.current.map((el, i) => {
          if (!el) return prev[i]
          const r = el.getBoundingClientRect()
          const mid = r.top + r.height / 2
          const on = mid < line && mid > box.top
          if (on !== prev[i]) changed = true
          return on
        })
        return changed ? next : prev
      })
      raf = requestAnimationFrame(measure)
    }
    raf = requestAnimationFrame(measure)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="what-list-viewport" ref={viewportRef}>
      <ul className="what-list">
        {loop.map((w, i) => (
          <li
            key={i}
            ref={(el) => (itemRefs.current[i] = el)}
            className={`what-item${active[i] ? ' is-checked' : ''}`}
            aria-hidden={i >= WORKFLOWS.length}
          >
            <span className="what-check"><Tick /></span>
            <span className="what-label">{w}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
