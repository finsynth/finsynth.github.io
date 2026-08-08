import useReveal from '../hooks/useReveal'
import WorkflowMarquee from './WorkflowMarquee'

/**
 * "What" — the full set of workflows FinSynth handles, as the self-completing
 * checklist marquee (see WorkflowMarquee.jsx) beside the section heading.
 * The band stays on white.
 */
export default function WhatSection() {
  const revealRef = useReveal({ threshold: 0.08 })

  return (
    <section className="what-sec" id="use-cases">
      <div className="what-stage" ref={revealRef}>
        {/* heading sits beside the scrolling list, vertically centred on it */}
        <div className="what-copy">
          <p className="hiw-eyebrow what-eyebrow">FinSynth does it all</p>
          <h2 className="what-heading">One agent,<br /><span className="ttl-hl">every workflow</span></h2>
        </div>

        <WorkflowMarquee />
      </div>
    </section>
  )
}
