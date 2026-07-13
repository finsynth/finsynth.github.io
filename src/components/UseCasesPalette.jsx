import { useEffect, useRef, useState } from 'react';

/* NOTE: all figures below (cell counts, ticker counts, sources, multiples,
   revenue values) are ILLUSTRATIVE PLACEHOLDERS for the mockup — confirm
   before launch. */

/* ── Icons (16x16, line style — matches existing icon set) ── */

const ICON_SEARCH = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
    <circle cx="7" cy="7" r="5" /><path d="M11 11l3.5 3.5" />
  </svg>
)
const ICON_TABLE = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
    <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" /><path d="M1.5 6.5h13M6 6.5v7" />
  </svg>
)
const ICON_REFRESH = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
    <path d="M13 5.5A5.2 5.2 0 1 0 13.6 9" /><path d="M13.8 2.5v3.2h-3.2" />
  </svg>
)
const ICON_SCALE = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
    <path d="M8 2.2v10.6" /><path d="M3 5.2h4.4M8.6 5.2h4.4" />
    <path d="M3 5.2 1.6 8.6h2.8L3 5.2Z" /><path d="M13 5.2 11.6 8.6h2.8L13 5.2Z" />
    <path d="M4.5 13.4h7" />
  </svg>
)
const ICON_BOLT = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
    <path d="M8.8 1.5 3.5 9h4l-.8 5.5L12.5 7h-4l.3-5.5z" strokeLinejoin="round" />
  </svg>
)
const ICON_SHIELD = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
    <path d="M4 1.8h6l3 3v9.4H4z" /><path d="M10 1.8v3h3" /><path d="M6 9.2l1.5 1.5 3-3" />
  </svg>
)
const ICON_FLAG = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
    <path d="M4 14V2" /><path d="M4 2.5h8l-2 3 2 3H4" />
  </svg>
)
const ICON_PENCIL = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
    <path d="M11 2.5l2.5 2.5-8 8-3 .8.8-3z" />
  </svg>
)
const ICON_RETURN = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M13 3v5a2 2 0 0 1-2 2H4" /><path d="M6.5 7 3 10l3.5 3" />
  </svg>
)
const ICON_FILE_TEXT = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
    <path d="M4 1.8h6l3 3v9.4H4z" /><path d="M10 1.8v3h3" /><path d="M6 8h4M6 10.4h4" />
  </svg>
)
const ICON_BELL = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
    <path d="M8 2.2c-2 0-3.2 1.6-3.2 3.6v2.4l-1 1.8h8.4l-1-1.8V5.8C11.2 3.8 10 2.2 8 2.2Z" strokeLinejoin="round" />
    <path d="M6.6 12.4a1.4 1.4 0 0 0 2.8 0" />
  </svg>
)
const ICON_ARROW_RIGHT = (
  <svg viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M1 5h12M9 1l4 4-4 4" />
  </svg>
)
const ICON_ALERT_TRIANGLE = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
    <path d="M8 2.2 14.5 13.5H1.5Z" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M8 6.5v3.2M8 11.8h.01" />
  </svg>
)

/* ── Data — copy is final, keep as written ── */

const GROUPS = [
  { id: 'build', label: 'Build models', icon: ICON_TABLE, text: 'Build a 3-statement model for AAPL from the latest filings' },
  { id: 'earnings', label: 'Earnings updates', icon: ICON_REFRESH, text: 'Update my NVDA model. It just reported.' },
  { id: 'peer', label: 'Peer benchmarking', icon: ICON_SCALE, text: 'Comp the group on EV/EBITDA, P/E and growth' },
  { id: 'speed', label: 'Get up to speed', icon: ICON_BOLT, text: 'Get me to a view on a name I just picked up' },
  { id: 'audit', label: 'Audit & QA', icon: ICON_SHIELD, text: 'Check this model before it goes to the IC' },
  { id: 'catalyst', label: 'Catalyst analysis', icon: ICON_FLAG, text: 'Map the catalysts into year-end' },
]

const GHOST_ROW = { id: 'ghost', text: 'or literally anything' }

const PHRASES = [
  'build a model from the filings',
  'update NVDA, it just reported',
  'comp the whole group',
  'check this before the IC',
]
const PHRASES_SHORT = ['filings', 'NVDA', 'comps', 'the IC']

/* ── Rotating ghost-typer hook ── */

function useGhostTyper(phrases, paused, reducedMotion) {
  const [ghost, setGhost] = useState('')
  const timerRef = useRef(null)
  const pausedRef = useRef(paused)
  const tickRef = useRef(() => {})

  useEffect(() => { pausedRef.current = paused }, [paused])

  useEffect(() => {
    clearTimeout(timerRef.current)
    if (reducedMotion) { setGhost(phrases[0] || ''); return }

    const s = { phraseIdx: 0, charIdx: 0, phase: 'typing' }
    function schedule(fn, ms) { timerRef.current = setTimeout(fn, ms) }
    function tick() {
      if (pausedRef.current) { timerRef.current = null; return }
      const phrase = phrases[s.phraseIdx] || ''
      if (s.phase === 'typing') {
        s.charIdx++
        setGhost(phrase.slice(0, s.charIdx))
        if (s.charIdx >= phrase.length) { s.phase = 'hold'; schedule(tick, 1400) }
        else schedule(tick, 45)
      } else if (s.phase === 'hold') {
        s.phase = 'deleting'
        schedule(tick, 30)
      } else {
        s.charIdx = Math.max(0, s.charIdx - 1)
        setGhost(phrase.slice(0, s.charIdx))
        if (s.charIdx <= 0) {
          s.phraseIdx = (s.phraseIdx + 1) % phrases.length
          s.phase = 'typing'
          schedule(tick, 300)
        } else {
          schedule(tick, 30)
        }
      }
    }
    tickRef.current = tick
    setGhost('')
    schedule(tick, 45)
    return () => clearTimeout(timerRef.current)
  }, [reducedMotion, phrases])

  useEffect(() => {
    if (!paused && !reducedMotion && timerRef.current === null) tickRef.current()
  }, [paused, reducedMotion])

  return ghost
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return matches
}

/* ── Shared bits ── */

function Chip({ children }) {
  return <span className="cmdk-chip">{children}</span>
}

/* ── Result previews (one per group) — each a distinct artifact ── */

function StatusLine({ children }) {
  return <div className="cmdk-status"><span className="cmdk-dot" />{children}</div>
}

// BUILD MODELS — mini spreadsheet (with one active cell) + source-trace strip.
// Tallest result; its rendered height sets the fixed height for all six.
function ResultBuild() {
  return (
    <div className="cmdk-result">
      <div className="cmdk-sheet">
        <div className="cmdk-sheet-row cmdk-sheet-head">
          <span className="cmdk-sheet-rn" />
          <span>A</span>
          <span>B</span>
        </div>
        <div className="cmdk-sheet-row">
          <span className="cmdk-sheet-rn">4</span>
          <span className="cmdk-sheet-lab">Revenue</span>
          <span className="cmdk-sheet-val cmdk-sheet-active">
            391,035
            <span className="cmdk-fill-handle" aria-hidden="true" />
          </span>
        </div>
        <div className="cmdk-sheet-row">
          <span className="cmdk-sheet-rn">5</span>
          <span className="cmdk-sheet-lab">Cost of revenue</span>
          <span className="cmdk-sheet-val cmdk-sheet-neg">(210,352)</span>
        </div>
      </div>
      <div className="cmdk-trace">
        <span className="cmdk-trace-ic" aria-hidden="true">{ICON_FILE_TEXT}</span>
        <div className="cmdk-trace-body">
          <p className="cmdk-trace-src">B4 traces to · Annual report · p.31</p>
          <p className="cmdk-trace-quote">
            Total net sales were <span className="cmdk-trace-hl">391,035</span> for the fiscal year.
          </p>
        </div>
      </div>
      <StatusLine>46 cells written. Every input traces to source.</StatusLine>
    </div>
  )
}

// EARNINGS UPDATES — real diff, two side-by-side delta cards.
function ResultEarnings() {
  return (
    <div className="cmdk-result">
      <div className="cmdk-diff-head">
        <span className="cmdk-diff-head-ic" aria-hidden="true">{ICON_BELL}</span>
        New interim filing detected
      </div>
      <div className="cmdk-diff-cards">
        <div className="cmdk-diff-card">
          <p className="cmdk-diff-card-lab">B14 · REVENUE</p>
          <p className="cmdk-diff-card-vals">
            <span className="cmdk-old">88.10</span>
            <span className="cmdk-diff-arrow" aria-hidden="true">{ICON_ARROW_RIGHT}</span>
            <span className="cmdk-new-val">94.90</span>
          </p>
          <p className="cmdk-diff-card-delta">+7.7%</p>
        </div>
        <div className="cmdk-diff-card">
          <p className="cmdk-diff-card-lab">C22 · GROSS MARGIN</p>
          <p className="cmdk-diff-card-vals">
            <span className="cmdk-old">41.8%</span>
            <span className="cmdk-diff-arrow" aria-hidden="true">{ICON_ARROW_RIGHT}</span>
            <span className="cmdk-new-val">43.2%</span>
          </p>
          <p className="cmdk-diff-card-delta">+140 bps</p>
        </div>
      </div>
      <StatusLine>17 cells refreshed and re-cited to the new filing.</StatusLine>
    </div>
  )
}

// PEER BENCHMARKING — polished comps table, subject row tinted.
const COMPS = [
  { t: 'AAPL', ev: '22.4x', pe: '29.1x', rev: '+6.1%', subject: true },
  { t: 'MSFT', ev: '24.8x', pe: '33.6x', rev: '+15.7%' },
  { t: 'META', ev: '15.9x', pe: '26.8x', rev: '+18.9%' },
]

function ResultPeer() {
  return (
    <div className="cmdk-result">
      <div className="cmdk-comps2">
        <div className="cmdk-comps2-row cmdk-comps2-head">
          <span className="cmdk-comps2-tick">Ticker</span>
          <span className="cmdk-comps2-num">EV/EBITDA</span>
          <span className="cmdk-comps2-num cmdk-comps2-pe">P/E</span>
          <span className="cmdk-comps2-num">Rev YoY</span>
        </div>
        {COMPS.map(r => (
          <div key={r.t} className={`cmdk-comps2-row${r.subject ? ' cmdk-comps2-subject' : ''}`}>
            <span className="cmdk-comps2-tick">{r.t}</span>
            <span className="cmdk-comps2-num">{r.ev}</span>
            <span className="cmdk-comps2-num cmdk-comps2-pe">{r.pe}</span>
            <span className="cmdk-comps2-num cmdk-pos">{r.rev}</span>
          </div>
        ))}
      </div>
      <StatusLine>12 names in one pass. Every cell cited.</StatusLine>
    </div>
  )
}

// GET UP TO SPEED — briefing cards, each a tag + insight + source chip.
const BRIEF_CARDS = [
  { tag: 'Business', text: 'Data-center revenue is now 88% of total', chip: 'Interim' },
  { tag: 'Guidance', text: 'Raised for next quarter', chip: 'Call' },
  { tag: 'Driver', text: 'Next-gen product ramp', chip: 'Call' },
]

function ResultSpeed() {
  return (
    <div className="cmdk-result">
      <div className="cmdk-brief-cards">
        {BRIEF_CARDS.map(c => (
          <div className="cmdk-brief-card" key={c.tag}>
            <span className="cmdk-brief-tag">{c.tag}</span>
            <span className="cmdk-flex1">{c.text}</span>
            <Chip>{c.chip}</Chip>
          </div>
        ))}
      </div>
      <StatusLine>Summary, drivers, and risks. All sourced.</StatusLine>
    </div>
  )
}

// AUDIT & QA — scorecard verdict bar + two flag rows.
const AUDIT_FLAGS = [
  { status: 'warn', icon: ICON_ALERT_TRIANGLE, text: 'C12 WACC input is stale', meta: 'prior quarter' },
  { status: 'bad', icon: ICON_FLAG, text: 'D7 Terminal growth uncited', meta: 'no source' },
]

function ResultAudit() {
  return (
    <div className="cmdk-result">
      <div className="cmdk-verdict">
        <span className="cmdk-verdict-num">38</span>
        <span className="cmdk-verdict-clean">clean</span>
        <span className="cmdk-verdict-warn">2 stale</span>
        <span className="cmdk-verdict-bad">1 uncited</span>
      </div>
      <div className="cmdk-verdict-bar">
        <span className="cmdk-verdict-seg cmdk-verdict-seg-ok" style={{ flex: 38 }} />
        <span className="cmdk-verdict-seg cmdk-verdict-seg-warn" style={{ flex: 2 }} />
        <span className="cmdk-verdict-seg cmdk-verdict-seg-bad" style={{ flex: 1 }} />
      </div>
      <div className="cmdk-flag-rows">
        {AUDIT_FLAGS.map(f => (
          <div className="cmdk-flag-row" key={f.text}>
            <span className={`cmdk-flag-ic cmdk-flag-ic-${f.status}`} aria-hidden="true">{f.icon}</span>
            <span className="cmdk-flex1">{f.text}</span>
            <span className="cmdk-flag-meta">{f.meta}</span>
          </div>
        ))}
      </div>
      <StatusLine>41 cells traced. 3 flags raised before the IC saw them.</StatusLine>
    </div>
  )
}

// CATALYST ANALYSIS — horizontal timeline, one node per catalyst.
const TIMELINE = [
  { date: 'Q3 print', text: 'Guidance raised', chip: 'Interim', done: true },
  { date: 'Nov', text: '$10B buyback', chip: 'Filing', done: true },
  { date: '2H next yr', text: 'Next-gen ramp', chip: 'Call', done: false },
]

function ResultCatalyst() {
  return (
    <div className="cmdk-result">
      <div className="cmdk-timeline">
        {TIMELINE.map(t => (
          <div className={`cmdk-tl-node${t.done ? ' cmdk-tl-done' : ''}`} key={t.text}>
            <span className="cmdk-tl-date">{t.date}</span>
            <span className="cmdk-tl-text">{t.text}</span>
            <Chip>{t.chip}</Chip>
          </div>
        ))}
      </div>
      <StatusLine>Every catalyst tied to a line in a filing.</StatusLine>
    </div>
  )
}

const RESULTS = {
  build: ResultBuild,
  earnings: ResultEarnings,
  peer: ResultPeer,
  speed: ResultSpeed,
  audit: ResultAudit,
  catalyst: ResultCatalyst,
}

/* Mirrors each result's closing status line — read out by the sr-only live
   region below, since the visual regions stay mounted (for the collapse
   transition) and so don't reliably fire aria-live on their own. */
const ANNOUNCE = {
  build: '46 cells written. Every input traces to source.',
  earnings: '17 cells refreshed and re-cited to the new filing.',
  peer: '12 names in one pass. Every cell cited.',
  speed: 'Summary, drivers, and risks. All sourced.',
  audit: '41 cells traced. 3 flags raised before the IC saw them.',
  catalyst: 'Every catalyst tied to a line in a filing.',
}

/* ── Row + expandable result wrapper ── */

function Row({ id, icon, text, ghost, selected, onHover, onActivate }) {
  return (
    <div
      id={`cmdk-row-${id}`}
      role="option"
      aria-selected={selected}
      className={`cmdk-row${selected ? ' selected' : ''}${ghost ? ' cmdk-row-ghost' : ''}`}
      onMouseEnter={onHover}
      onClick={onActivate}
    >
      <span className="cmdk-row-ic" aria-hidden="true">{icon}</span>
      <span className="cmdk-row-text">{text}</span>
      {!ghost && selected && <span className="cmdk-return" aria-hidden="true">{ICON_RETURN}</span>}
    </div>
  )
}

function ResultWrap({ open, children }) {
  return (
    <div className={`cmdk-result-wrap${open ? ' open' : ''}`}>
      <div>{children}</div>
    </div>
  )
}

/* ── Section ──────────────────────────────────── */

export default function UseCasesPalette() {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState('build')
  const [inputFocused, setInputFocused] = useState(false)
  const inputRef = useRef(null)
  // Browsers re-fire mouseenter on a row that shifts under a *stationary*
  // cursor right after a layout reflow (e.g. filtering, keyboard nav).
  // Briefly ignore hover after such a change so that phantom event can't
  // silently steal selection back from the keyboard; re-arm shortly after.
  const mouseArmedRef = useRef(true)
  const rearmTimerRef = useRef(null)
  useEffect(() => () => clearTimeout(rearmTimerRef.current), [])
  function disarmBriefly() {
    // Longer than the 180ms result expand/collapse transition, which keeps
    // reflowing rows (and can keep re-triggering phantom hover) while it runs.
    mouseArmedRef.current = false
    clearTimeout(rearmTimerRef.current)
    rearmTimerRef.current = setTimeout(() => { mouseArmedRef.current = true }, 260)
  }

  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const isMobile = useMediaQuery('(max-width: 640px)')

  const paused = inputFocused || query.length > 0
  const ghostText = useGhostTyper(isMobile ? PHRASES_SHORT : PHRASES, paused, reducedMotion)

  const filteredGroups = query === ''
    ? GROUPS
    : GROUPS.filter(g => g.text.toLowerCase().includes(query.toLowerCase()))

  const visibleRows = [...filteredGroups.map(g => g.id), 'ghost']

  useEffect(() => {
    disarmBriefly()
    if (selectedId === 'ghost' || selectedId === null) return
    if (!filteredGroups.some(g => g.id === selectedId)) {
      setSelectedId(filteredGroups[0]?.id ?? null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  function focusGhost() {
    disarmBriefly()
    setSelectedId(null)
    inputRef.current?.focus()
  }

  function handleHover(id) {
    if (!mouseArmedRef.current) return
    setSelectedId(id)
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      disarmBriefly()
      if (visibleRows.length === 0) return
      const idx = visibleRows.indexOf(selectedId)
      let next
      if (e.key === 'ArrowDown') next = idx === -1 ? 0 : (idx + 1) % visibleRows.length
      else next = idx === -1 ? visibleRows.length - 1 : (idx - 1 + visibleRows.length) % visibleRows.length
      setSelectedId(visibleRows[next])
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedId === 'ghost') focusGhost()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      disarmBriefly()
      setSelectedId('build')
    }
  }

  return (
    <section className="cmdk-section" id="use-cases">
      <div className="wrap">
        <div className="cmdk-frame">
          <h2 className="cmdk-h2">One agent. Every analyst workflow.</h2>
        </div>

        <div className="cmdk-card">
          <div className="cmdk-search-row">
            <span className="cmdk-search-ic" aria-hidden="true">{ICON_SEARCH}</span>
            <div className="cmdk-search-text-wrap" onClick={() => inputRef.current?.focus()}>
              <span className="cmdk-search-prefix">Ask FinSynth to</span>
              <div className="cmdk-input-stack">
                <input
                  ref={inputRef}
                  type="text"
                  className="cmdk-input"
                  aria-label="Ask FinSynth"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls="cmdk-listbox"
                  aria-activedescendant={selectedId ? `cmdk-row-${selectedId}` : undefined}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  onKeyDown={handleKeyDown}
                />
                {query === '' && (
                  <span className="cmdk-ghost-overlay" aria-hidden="true">
                    {ghostText}<span className="cmdk-caret" />
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="sr-only" aria-live="polite">
            {selectedId && ANNOUNCE[selectedId] ? `${GROUPS.find(g => g.id === selectedId)?.text}. ${ANNOUNCE[selectedId]}` : ''}
          </div>

          <div
            className="cmdk-list"
            id="cmdk-listbox"
            role="listbox"
            aria-label="FinSynth use cases"
          >
            {filteredGroups.length === 0 ? (
              <div className="cmdk-empty">FinSynth will figure it out. Just ask.</div>
            ) : (
              filteredGroups.map(g => (
                <div key={g.id} className="cmdk-group">
                  <p className="cmdk-group-label">{g.label}</p>
                  <Row
                    id={g.id}
                    icon={g.icon}
                    text={g.text}
                    selected={selectedId === g.id}
                    onHover={() => handleHover(g.id)}
                    onActivate={() => { disarmBriefly(); setSelectedId(g.id); inputRef.current?.focus() }}
                  />
                  <ResultWrap open={selectedId === g.id}>
                    {RESULTS[g.id] && (() => { const R = RESULTS[g.id]; return <R /> })()}
                  </ResultWrap>
                </div>
              ))
            )}
            <div className="cmdk-group cmdk-group-ghost">
              <Row
                id="ghost"
                icon={ICON_PENCIL}
                text={GHOST_ROW.text}
                ghost
                selected={selectedId === 'ghost'}
                onHover={() => handleHover('ghost')}
                onActivate={focusGhost}
              />
            </div>
          </div>

          <div className="cmdk-footer">
            <span className="cmdk-footer-tag">Runs inside your Excel</span>
            <span className="cmdk-footer-keys">↑↓ browse&nbsp;&nbsp;&nbsp;↵ run</span>
          </div>
        </div>
      </div>
    </section>
  )
}
