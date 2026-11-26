import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import useReveal from '@/hooks/useReveal'
import useMediaQuery from '@/hooks/useMediaQuery'
import WorkflowMarquee from '@/components/home/WorkflowMarquee'
import CertSeals from '@/components/home/CertSeals'
import ExcelMark from '@/components/visuals/ExcelMark'
import { ADDIN_URL } from '@/components/layout/AskParts'

/** The stage swaps visuals both on scroll scrub and on a clock; see useAutoStep for how the two hand off. */

// To use a real logo: add public/assets/img/logos/integrations/<slug>.svg and set logo: '<slug>' on the entry.
const GLYPHS: Record<string, ReactNode> = {
  sec: (
    <>
      <path d="M2 7.5 11 3l9 4.5" />
      <path d="M4.5 7.5v8M9 7.5v8M13 7.5v8M17.5 7.5v8" />
      <path d="M2.5 18.5h17" />
    </>
  ),
  call: (
    <path d="M6.2 3.6 8.6 3l2 4.2-2 1.6a10.5 10.5 0 0 0 4.6 4.6l1.6-2 4.2 2-.6 2.4a2 2 0 0 1-2.2 1.5C10.4 16.6 5.4 11.6 4.7 5.8a2 2 0 0 1 1.5-2.2Z" />
  ),
  web: (
    <>
      <circle cx="11" cy="11" r="8.2" />
      <path d="M2.8 11h16.4" />
      <ellipse cx="11" cy="11" rx="3.6" ry="8.2" />
    </>
  ),
  db: (
    <>
      <ellipse cx="11" cy="5.4" rx="7.4" ry="2.7" />
      <path d="M3.6 5.4v11.2c0 1.5 3.31 2.7 7.4 2.7s7.4-1.2 7.4-2.7V5.4" />
      <path d="M3.6 11c0 1.5 3.31 2.7 7.4 2.7s7.4-1.2 7.4-2.7" />
    </>
  ),
  mail: (
    <>
      <rect x="2.4" y="5" width="17.2" height="12" rx="2" />
      <path d="M3 6.6 11 12l8-5.4" />
    </>
  ),
  deck: (
    <>
      <rect x="2.4" y="3.6" width="17.2" height="11" rx="1.6" />
      <path d="M11 14.6v3.8M7.6 18.4h6.8" />
    </>
  ),
  folder: (
    <path d="M2.6 6.4A1.6 1.6 0 0 1 4.2 4.8h3.6L10 7.1h7.8a1.6 1.6 0 0 1 1.6 1.6v7.9a1.6 1.6 0 0 1-1.6 1.6H4.2a1.6 1.6 0 0 1-1.6-1.6z" />
  ),
  chart: (
    <>
      <path d="M2.6 18.4h16.8" />
      <path d="M3.6 14.6 8 9.4l3.4 3.2 3.2-5.6 3.8 4.4" />
    </>
  ),
  note: (
    <>
      <path d="M5 2.8h8.4L18 7.4v11.8a1.6 1.6 0 0 1-1.6 1.6H5a1.6 1.6 0 0 1-1.6-1.6V4.4A1.6 1.6 0 0 1 5 2.8Z" />
      <path d="M13.4 2.8v4.6H18" />
      <path d="M6.8 11.4h7.8M6.8 15h7.8" />
    </>
  ),
  api: (
    <>
      <path d="M8 2.8v4.4M14 2.8v4.4" />
      <path d="M5.8 7.2h10.4v3.2a5.2 5.2 0 0 1-10.4 0z" />
      <path d="M11 15.6v1.8a2.8 2.8 0 0 1-2.8 2.8H6" />
    </>
  ),
}

const MARKS: Record<string, ReactNode> = {
  onedrive: (
    <path d="M7.3 19.4h11.1a3.55 3.55 0 0 0 .5-7.07 5.2 5.2 0 0 0-8.72-3.3 4.1 4.1 0 0 0-6.08 3.6c0 .2.01.4.04.6A3.5 3.5 0 0 0 7.3 19.4Z" />
  ),
  snowflake: (
    <>
      <path
        d="M12 2.4v19.2M3.7 7.2l16.6 9.6M20.3 7.2 3.7 16.8"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        stroke="currentColor"
      />
    </>
  ),
}

interface PillItem {
  label: string
  sub?: string
  logo?: string
  glyph?: string
  mark?: string
  mono?: string
  tint?: string
}

function Badge({ item }: { item: PillItem }) {
  if (item.logo) {
    return (
      <span className="xvi-badge xvi-badge--mark">
        <img src={`/assets/img/logos/integrations/${item.logo}.svg`} alt="" />
      </span>
    )
  }
  if (item.glyph) {
    return (
      <span className="xvi-badge xvi-badge--glyph">
        <svg
          viewBox="0 0 22 22"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {GLYPHS[item.glyph]}
        </svg>
      </span>
    )
  }
  if (item.mark) {
    return (
      <span className="xvi-badge xvi-badge--mark" style={{ color: item.tint }}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          {MARKS[item.mark]}
        </svg>
      </span>
    )
  }
  return (
    <span className="xvi-badge xvi-badge--mono" style={{ background: item.tint }}>
      {item.mono}
    </span>
  )
}

// `offset` keeps the stagger running across both rows instead of restarting
function PillRow({
  items,
  offset = 0,
  className = '',
}: {
  items: PillItem[]
  offset?: number
  className?: string
}) {
  return (
    <ul className={`xvi-grid${className ? ` ${className}` : ''}`}>
      {items.map((it, i) => (
        <li className="xvi-pill" key={it.label} style={{ '--i': i + offset }}>
          <Badge item={it} />
          <span className="xvi-label">
            {it.label}
            {it.sub && <em className="xvi-sub">{it.sub}</em>}
          </span>
        </li>
      ))}
    </ul>
  )
}

function VisualWorkflows() {
  return (
    <div className="xv-marquee">
      <WorkflowMarquee />
    </div>
  )
}

/* 02 · Fully auditable. Timing lives in the .xvk-* keyframes (9s loop, three 3s beats) and must match this pillar's ms. */
// hit = the workbook cell (row, col) the source fills, value = what lands there, prov = the provenance line under the grid
const SOURCES = [
  {
    k: 'filing',
    kind: 'filing',
    title: 'Apple FY25 10-K',
    status: 'Tracing to the filing',
    kicker: 'Net sales by category',
    value: '416,161',
    hit: [6, 'B'],
    prov: '10-K FY25 · p.31',
  },
  {
    k: 'call',
    kind: 'call',
    title: 'Q3 FY26 earnings call',
    status: 'Tracing to the call',
    kicker: 'CFO prepared remarks',
    value: '47.0–48.0%',
    hit: [9, 'C'],
    prov: 'Q3 FY26 call · 11:48',
  },
  {
    k: 'tracker',
    kind: 'xlsx',
    title: 'iPhone_ASP_tracker.xlsx',
    status: 'Tracing to your tracker',
    kicker: 'Regional pricing',
    value: '872',
    hit: [2, 'C'],
    prov: 'iPhone_ASP_tracker.xlsx · Regional pricing · row 22',
  },
]

const BOOK = { kind: 'xlsx', title: 'AAPL_model_v18.xlsx' }
const ROWS = [
  ['iPhone units (m)', '232', '238'],
  ['iPhone ASP ($)', '847', ''],
  ['iPhone revenue', '196,504', '207,536'],
  ['Services revenue', '108,242', '119,066'],
  ['Other products', '111,415', '114,000'],
  ['Total net sales', '', '440,602'],
  ['Cost of sales', '220,565', '231,757'],
  ['Gross margin %', '47.0%', '47.4%'],
  ['GM guide, next Q', '', ''],
]

const KIND_MARK: Record<string, ReactNode> = {
  filing: <path d="M4 1.5h4.5L12 5v7.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1Z" />,
  call: (
    <path d="M3.9 2.3 5.5 1.9l1.3 2.7-1.3 1a6.8 6.8 0 0 0 3 3l1-1.3 2.7 1.3-.4 1.6a1.3 1.3 0 0 1-1.4 1C6.8 10.8 3.5 7.5 3 3.7a1.3 1.3 0 0 1 .9-1.4Z" />
  ),
  xlsx: (
    <>
      <rect x="2.5" y="2.5" width="9" height="9" rx="1" />
      <path d="M2.5 7h9M7 2.5v9" />
    </>
  ),
}

function KindMark({ kind }: { kind: string }) {
  return (
    <i className={`xvk-kind xvk-kind--${kind}`}>
      <svg
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {KIND_MARK[kind]}
      </svg>
    </i>
  )
}

function CardTab({ c }: { c: { kind: string; title: string } }) {
  return (
    <div className="xvk-head">
      <div className="xvk-tab">
        <KindMark kind={c.kind} />
        <span className="xvk-title">{c.title}</span>
        <span className="xvk-x" />
      </div>
    </div>
  )
}

const CITED_KINDS = [
  { label: 'Public filings', glyph: 'sec' },
  { label: 'Transcripts', glyph: 'call' },
  { label: 'Investor materials', glyph: 'deck' },
  { label: 'Internal files', glyph: 'folder' },
  { label: 'Market data', glyph: 'chart' },
  { label: 'Research notes', glyph: 'note' },
  { label: 'Web', glyph: 'web' },
]

const hitAt = (row: number, col: string) =>
  SOURCES.findIndex((s) => s.hit[0] === row && s.hit[1] === col)

function VisualCascade() {
  return (
    <div className="xvk xvk--ink" aria-hidden="true">
      <div className="xvk-status">
        <span className="xvk-ico">
          <span className="xvk-spin" />
          <span className="xvk-check">
            <svg
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2.5 6.2 5 8.6l4.5-5.2" />
            </svg>
          </span>
        </span>
        <span className="xvk-labels">
          {SOURCES.map((s, i) => (
            <span className={`xvk-lbl xvk-lbl--${i}`} style={{ '--i': i }} key={s.k}>
              {s.status}
            </span>
          ))}
        </span>
      </div>

      {SOURCES.map((s, i) => (
        <article className={`xvk-card xvk-src xvk-src--${i}`} style={{ '--i': i }} key={s.k}>
          <CardTab c={s} />
          <div className="xvk-body xvk-doc">
            {/* the page content fades as the card falls back; the wrapper
                takes that fade so the body (and the stroke it carries in the
                ink tone) stays put, or the card behind loses its edges */}
            <div className="xvk-page">
              <p className="xvk-kicker">{s.kicker}</p>
              <span className="xvk-line" />
              <span className="xvk-line xvk-line--short" />
              <div className="xvk-ex">
                <span className="xvk-line" />
                <b>{s.value}</b>
              </div>
              <span className="xvk-line xvk-line--short" />
            </div>
          </div>
        </article>
      ))}

      <article className="xvk-card xvk-book">
        <CardTab c={BOOK} />
        <div className="xvk-body xvk-sheet">
          <div className="xvk-srow xvk-srow--cols">
            <span className="xvk-rn" />
            <span>A</span>
            <span>B</span>
            <span>C</span>
          </div>
          {ROWS.map(([label, b, c], r) => (
            <div className="xvk-srow" key={label}>
              <span className="xvk-rn">{r + 1}</span>
              <span className="xvk-sl">{label}</span>
              {[
                ['B', b],
                ['C', c],
              ].map(([col, v]) => {
                const h = hitAt(r + 1, col)
                return h < 0 ? (
                  <span className="xvk-num" key={col}>
                    {v}
                  </span>
                ) : (
                  <span className={`xvk-num xvk-hit xvk-hit--${h}`} style={{ '--i': h }} key={col}>
                    {SOURCES[h].value}
                    <i className="xvk-ring" />
                  </span>
                )
              })}
            </div>
          ))}
          <div className="xvk-prov">
            <i />
            <span className="xvk-labels">
              {SOURCES.map((s, i) => (
                <span className={`xvk-lbl xvk-foot xvk-foot--${i}`} key={s.k}>
                  {s.prov}
                </span>
              ))}
            </span>
          </div>
        </div>
      </article>
    </div>
  )
}

function VisualAudit() {
  return (
    <div className="xvc">
      <VisualCascade />
      <PillRow items={CITED_KINDS} className="xvi-grid--tight" />
    </div>
  )
}

/* `s` is the edge a pill hangs off and `x` where that edge sits. Labels are set
 * in px while the field scales, so anchoring the outer edge is what keeps a long
 * label from running off the card and keeps the middle clear for the focal pill.
 */
const SHELF = [
  { label: 'Global Filings', glyph: 'sec', s: 'l', x: 4, y: 13, r: -2.5 },
  { label: 'Emails', glyph: 'mail', s: 'l', x: 16, y: 26, r: -1.5 },
  { label: 'OneDrive', mark: 'onedrive', tint: '#0364B8', s: 'l', x: 3, y: 40, r: 2.2 },
  { label: 'Web', glyph: 'web', s: 'l', x: 5, y: 54, r: 1.6 },
  { label: 'Internal Databases', glyph: 'db', s: 'l', x: 2, y: 68, r: -2 },
  { label: 'FactSet', mono: 'F', tint: '#2C7BE5', s: 'l', x: 18, y: 82, r: -3 },
  { label: 'Databricks', mono: 'D', tint: '#FF3621', s: 'l', x: 7, y: 95, r: -2.2 },
  { label: 'Earnings Transcripts', glyph: 'call', s: 'r', x: 97, y: 6, r: 1.8 },
  { label: 'SharePoint', mono: 'S', tint: '#038387', s: 'r', x: 99, y: 20, r: 3 },
  { label: 'Decks & PDFs', glyph: 'deck', s: 'r', x: 91, y: 34, r: -2.8 },
  { label: 'LSEG', mono: 'L', tint: '#0C1E5B', s: 'r', x: 98, y: 49, r: 2.4 },
  { label: 'Bloomberg', mono: 'B', tint: '#1A1A1A', s: 'r', x: 96, y: 63, r: 2.6 },
  { label: 'Capital IQ', mono: 'S&P', tint: '#D6002A', s: 'r', x: 89, y: 78, r: 1.4 },
  { label: 'Snowflake', mark: 'snowflake', tint: '#29B5E8', s: 'r', x: 99, y: 92, r: -1.8 },
]

function VisualIntegrated() {
  return (
    <div className="xvi">
      <div className="xvi-field">
        {/* each pill gets a slot of its own: the slot carries the placement and
            the slow drift, the pill inside carries the entry. Two animations on
            one element would mean two transforms, and the second simply wins */}
        {SHELF.map((it, i) => (
          <span
            className="xvi-slot"
            key={it.label}
            style={{
              '--i': i,
              '--x': `${it.x}%`,
              '--y': `${it.y}%`,
              '--r': `${it.r}deg`,
              '--ax': it.s === 'l' ? '0%' : '-100%',
            }}
          >
            <span className="xvi-pill xvi-pill--ghost">
              <Badge item={it} />
              <span className="xvi-label">{it.label}</span>
            </span>
          </span>
        ))}
        <span className="xvi-pill xvi-pill--focal">
          <span className="xvi-badge xvi-badge--focal">
            <svg
              viewBox="0 0 22 22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {GLYPHS.api}
            </svg>
          </span>
          <span className="xvi-label">Add your custom MCP</span>
          <span className="xvi-cursor" aria-hidden="true">
            <span className="xvi-click" />
            <svg viewBox="0 0 20 22">
              <path d="M2 1 L2 17.6 L6.2 13.7 L8.8 19.6 L11.7 18.3 L9.1 12.6 L15 12.3 Z" />
            </svg>
          </span>
        </span>
      </div>
    </div>
  )
}

function VisualEnterprise() {
  return (
    <div className="xvs">
      <p className="xvs-eyebrow">FinSynth Security</p>
      <CertSeals />
    </div>
  )
}

/* `ms` is per visual, not shared: one interval either cuts the animated visuals
   short or parks the still ones. The audit cascade needs 9s (three beats, see
   the .xvk-* keyframes in global.css). */
const PILLARS = [
  {
    key: 'workflows',
    title: 'Complex workflows',
    body: 'One agent, every workflow',
    Visual: VisualWorkflows,
    // the marquee has no beginning or end — this is just reading time
    ms: 5000,
  },
  {
    key: 'audit',
    title: 'Fully auditable',
    body: 'Public sources or your own internal files, every number traced to where it came from',
    Visual: VisualAudit,
    // all three beats of the 9s trace, so the tracker gets its turn in the workbook;
    // the swap comes as the loop fades rather than cutting into the next
    // cycle's first beat
    ms: 9000,
  },
  {
    key: 'integrated',
    title: 'Integrated',
    body: 'Out-of-box global coverage, custom integrations supported',
    Visual: VisualIntegrated,
    // the pills stagger in over ~0.8s, and the field is a list to be read
    ms: 5400,
  },
  {
    key: 'enterprise',
    title: 'Enterprise ready',
    body: 'Security and compliance built in from day one',
    Visual: VisualEnterprise,
    // a still image — no animation to wait on
    ms: 4200,
  },
]

// module scope so the array identity is stable across renders and the clock's
// effect doesn't tear itself down every pass
const DWELL = PILLARS.map((p) => p.ms)
const STEP_MS = 4200
const SCROLL_IDLE_MS = 1200

/**
 * Which pillar is on stage. Two drivers:
 * - Scroll: while scrolling, a band centred on the pane's most-visible moment is split into `count` slices.
 *   `scrub: false` turns this off for the stacked layout: there a step change moves ~120px between rows, so
 *   scrubbing resizes the thing it measures (at 390x844 it skipped claim 3).
 * - Clock: when still and on screen, each step holds for its own dwell; it stands down during a scroll
 *   and for SCROLL_IDLE_MS after.
 * `hold` pauses on hover/focus; `goTo` jumps and restarts the wait.
 */
function useAutoStep(
  dwell: number[],
  paneRef: RefObject<HTMLDivElement | null>,
  { scrub = true } = {},
) {
  const count = dwell.length
  const [step, setStep] = useState(0)
  const [held, setHeld] = useState(false)
  const [nudge, setNudge] = useState(0)
  const [onScreen, setOnScreen] = useState(false)
  // read by the clock, written by the scroll listener — a ref rather than state
  // so a scroll doesn't tear down and rebuild the interval on every frame
  const scrolling = useRef(false)

  useEffect(() => {
    if (!scrub) return
    const pane = paneRef.current
    if (!pane) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let idle: ReturnType<typeof setTimeout> | undefined

    const read = () => {
      raf = 0
      const r = pane.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom <= 0 || r.top >= vh) return
      // Spread the steps over a band centred on the pane's most-visible moment, not its whole pass:
      // over the whole pass the first and last steps only lit while the pane was half off screen.
      // Travel is 55% of the viewport around `centre`, widened to the pane's slack when larger;
      // a pane taller than the viewport has negative slack and the 55% floor carries it.
      const centre = (vh - r.height) / 2
      const travel = Math.max(vh * 0.55, Math.abs(vh - r.height))
      const p = (centre + travel / 2 - r.top) / travel
      setStep(Math.min(count - 1, Math.max(0, Math.floor(p * count))))
    }

    const onScroll = () => {
      scrolling.current = true
      clearTimeout(idle)
      idle = setTimeout(() => {
        scrolling.current = false
        setNudge((n) => n + 1)
      }, SCROLL_IDLE_MS)
      if (!raf) raf = requestAnimationFrame(read)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    read()
    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(idle)
      if (raf) cancelAnimationFrame(raf)
      // a scroll may have been in flight when the scrub was switched off, and
      // nothing would clear the flag afterwards — the clock would never run
      scrolling.current = false
    }
  }, [paneRef, count, scrub])

  useEffect(() => {
    const pane = paneRef.current
    if (!pane) return
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.35 })
    io.observe(pane)
    return () => io.disconnect()
  }, [paneRef])

  useEffect(() => {
    if (!onScreen || held) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timer = setTimeout(() => {
      // a scroll in flight owns the rail; the idle handler bumps `nudge` when it
      // stops, which restarts this wait, so the clock picks up where it left
      if (scrolling.current) return
      setStep((s) => (s + 1) % count)
    }, dwell[step] ?? STEP_MS)
    return () => clearTimeout(timer)
    // `nudge` is here only to restart the wait after a row press or a scroll
  }, [dwell, count, step, onScreen, held, nudge])

  return {
    step,
    goTo: (i: number) => {
      setStep(i)
      setNudge((n) => n + 1)
    },
    hold: () => setHeld(true),
    release: () => setHeld(false),
  }
}

export default function ExcelSection({
  id = 'excel',
  title = (
    <>
      FinSynth for <span className="ttl-hl">Excel</span>
    </>
  ),
}: {
  id?: string
  title?: ReactNode
}) {
  const frameRef = useReveal<HTMLDivElement>({ threshold: 0.08 })
  const paneRef = useRef<HTMLDivElement>(null)
  const stacked = useMediaQuery('(max-width: 900px)')
  // and the stack takes no scroll scrub — see useAutoStep
  const { step, goTo, hold, release } = useAutoStep(DWELL, paneRef, { scrub: !stacked })
  // where the install button sits. The shipped place is the head's right; ?cta=1|2|3
  // tries the others beside it: 1 under the title, 2 closing the rail, 3 a foot row
  const [ctaAt, setCtaAt] = useState('')
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get('cta') ?? ''
    if (['1', '2', '3'].includes(v)) setCtaAt(v)
  }, [])
  const cta = (
    <a className="x4e-head-cta" href={ADDIN_URL} target="_blank" rel="noopener noreferrer">
      <ExcelMark />
      Install add-in
    </a>
  )

  return (
    <section className="x4e-sec" id={id}>
      <div className="wrap">
        <div className={`x4e-frame${ctaAt ? ` x4e-frame--cta${ctaAt}` : ''}`} ref={frameRef}>
          <div className="x4e-head x4e-reveal">
            <div className="x4e-head-copy">
              <h2>{title}</h2>
            </div>
            {(ctaAt === '' || ctaAt === '1') && cta}
          </div>

          {/* no x4e-reveal here: that rule animates transform and filter, and
              either one would fight the visuals' crossfade */}
          <div
            className="x4e-pane"
            ref={paneRef}
            onMouseEnter={hold}
            onMouseLeave={release}
            onFocusCapture={hold}
            onBlurCapture={release}
          >
            <ol
              className="x4e-rail"
              style={
                ctaAt === '2' && !stacked
                  ? { gridTemplateRows: `repeat(${PILLARS.length}, 1fr) auto` }
                  : undefined
              }
            >
              {PILLARS.map((p, i) => {
                const { Visual } = p
                return (
                  <li key={p.key}>
                    <button
                      type="button"
                      className={`x4e-item${!stacked && i === step ? ' is-active' : ''}`}
                      aria-current={!stacked && i === step}
                      onClick={() => goTo(i)}
                    >
                      <span className="x4e-item-body">
                        <span className="x4e-item-title">{p.title}</span>
                        <span className="x4e-item-p">{p.body}</span>
                      </span>
                    </button>
                    {/* stacked: every row keeps its visual open and is-active so each loop runs; the rail highlight and auto-step are desktop-only */}
                    {stacked && (
                      <div className="x4e-stage x4e-stage--inline">
                        <div className="x4e-visual is-active">
                          <Visual />
                        </div>
                      </div>
                    )}
                  </li>
                )
              })}
              {ctaAt === '2' && <li className="x4e-rail-cta">{cta}</li>}
            </ol>
            {!stacked && (
              <div className="x4e-stage">
                {PILLARS.map((p, i) => {
                  const { Visual } = p
                  return (
                    <div
                      key={p.key}
                      className={`x4e-visual${i === step ? ' is-active' : ''}`}
                      aria-hidden={i !== step}
                    >
                      <Visual />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          {ctaAt === '3' && (
            <div className="x4e-foot">
              <span className="x4e-foot-note">Install from Microsoft Marketplace</span>
              {cta}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
