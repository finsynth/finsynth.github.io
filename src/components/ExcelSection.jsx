import { useEffect, useRef, useState } from 'react'
import useReveal from '../hooks/useReveal'
import useMediaQuery from '../hooks/useMediaQuery'
import WorkflowMarquee from './WorkflowMarquee'
import CertSeals from './CertSeals'

/**
 * "FinSynth for Excel" — the Security section's bordered frame and headline.
 * All four claims sit in a rail on the left, always visible; only the visual
 * on the right swaps — scrubbed as the section scrolls past, and on a clock
 * while it sits still — and each rail row jumps the stage to it. See
 * useAutoStep for how the two hand off.
 *
 * The pane used to pin inside a scroll budget several screens deep, so the
 * section cost four screenfuls of scrolling to get past. It's an ordinary
 * block now that scrolls with the rest of the page; the scrubbing rides that
 * ordinary travel rather than buying screenfuls of its own.
 *
 * The visuals are drawn, not photographed — each depicts the claim beside it.
 * When product shots exist, swap a Visual for <img src="…" alt="" /> inside
 * .x4e-visual and the cell takes care of the rest.
 */

const VB = '0 0 640 320'

/* ── shared source badges ─────────────────────────────────────────────────
 * Each pill carries one of three badge kinds:
 *   · glyph — a drawn outline mark for the categorical sources (filings,
 *     transcripts, the web) that have no logo of their own
 *   · mark  — a white disc holding a brand's shape, where the shape is simple
 *     enough to draw honestly (OneDrive, Snowflake, …)
 *   · mono  — a brand-tinted disc with the brand's letters, the fallback for
 *     everything whose logo is a wordmark
 * Drop a real SVG into public/assets/img/logos/integrations/<slug>.svg and give
 * the entry `logo: '<slug>'` to promote it over the fallback badge.
 */
const GLYPHS = {
  // filings — the classic filing-office portico
  sec: <><path d="M2 7.5 11 3l9 4.5" /><path d="M4.5 7.5v8M9 7.5v8M13 7.5v8M17.5 7.5v8" /><path d="M2.5 18.5h17" /></>,
  // earnings calls — a handset
  call: <path d="M6.2 3.6 8.6 3l2 4.2-2 1.6a10.5 10.5 0 0 0 4.6 4.6l1.6-2 4.2 2-.6 2.4a2 2 0 0 1-2.2 1.5C10.4 16.6 5.4 11.6 4.7 5.8a2 2 0 0 1 1.5-2.2Z" />,
  web: <><circle cx="11" cy="11" r="8.2" /><path d="M2.8 11h16.4" /><ellipse cx="11" cy="11" rx="3.6" ry="8.2" /></>,
  // internal databases — the stacked cylinder
  db: <><ellipse cx="11" cy="5.4" rx="7.4" ry="2.7" /><path d="M3.6 5.4v11.2c0 1.5 3.31 2.7 7.4 2.7s7.4-1.2 7.4-2.7V5.4" /><path d="M3.6 11c0 1.5 3.31 2.7 7.4 2.7s7.4-1.2 7.4-2.7" /></>,
  // emails — the envelope
  mail: <><rect x="2.4" y="5" width="17.2" height="12" rx="2" /><path d="M3 6.6 11 12l8-5.4" /></>,
  // decks — a slide on its stand
  deck: <><rect x="2.4" y="3.6" width="17.2" height="11" rx="1.6" /><path d="M11 14.6v3.8M7.6 18.4h6.8" /></>,
  // internal files — the folder
  folder: <path d="M2.6 6.4A1.6 1.6 0 0 1 4.2 4.8h3.6L10 7.1h7.8a1.6 1.6 0 0 1 1.6 1.6v7.9a1.6 1.6 0 0 1-1.6 1.6H4.2a1.6 1.6 0 0 1-1.6-1.6z" />,
  // custom APIs — the plug
  api: <><path d="M8 2.8v4.4M14 2.8v4.4" /><path d="M5.8 7.2h10.4v3.2a5.2 5.2 0 0 1-10.4 0z" /><path d="M11 15.6v1.8a2.8 2.8 0 0 1-2.8 2.8H6" /></>,
}

// brand shapes simple enough to draw rather than fake with letters
const MARKS = {
  onedrive: <path d="M7.3 19.4h11.1a3.55 3.55 0 0 0 .5-7.07 5.2 5.2 0 0 0-8.72-3.3 4.1 4.1 0 0 0-6.08 3.6c0 .2.01.4.04.6A3.5 3.5 0 0 0 7.3 19.4Z" />,
  snowflake: <><path d="M12 2.4v19.2M3.7 7.2l16.6 9.6M20.3 7.2 3.7 16.8" strokeWidth="2" strokeLinecap="round" fill="none" stroke="currentColor" /></>,
}

function Badge({ item }) {
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
        <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {GLYPHS[item.glyph]}
        </svg>
      </span>
    )
  }
  if (item.mark) {
    return (
      <span className="xvi-badge xvi-badge--mark" style={{ color: item.tint }}>
        <svg viewBox="0 0 24 24" fill="currentColor">{MARKS[item.mark]}</svg>
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
function PillRow({ items, offset = 0, className = '' }) {
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

// 01 · Complex workflows — the self-completing workflow checklist, the same
// marquee that anchors "One agent, every workflow", scaled to the cell.
function VisualWorkflows() {
  return (
    <div className="xv-marquee">
      <WorkflowMarquee />
    </div>
  )
}

/* 02 · Fully auditable — sources on the left, the workbook on the right, and a
 * connector carrying each one into the cell it lands in. Three documents rather
 * than two, and deliberately unalike: a filing, a call transcript, and someone's
 * own model, because the claim the copy makes is that anything gets cited, not
 * just the figures in filings.
 *
 * The citation rides inside the cell — value on the first line, source on the
 * second — rather than only in the formula bar. A formula bar tells you what is
 * in the selected cell; the point here is that every cell carries its source
 * whether or not anyone has selected it, so the sheet is auditable at a glance.
 * The rest of the shelf follows as pills, so "anything" reads as a real list
 * rather than a promise. */
const CITED_KINDS = [
  { label: 'Public filings', glyph: 'sec' },
  { label: 'Transcripts', glyph: 'call' },
  { label: 'Internal files', glyph: 'folder' },
  { label: 'Emails', glyph: 'mail' },
  { label: 'Decks', glyph: 'deck' },
  { label: 'Databases', glyph: 'db' },
  { label: 'Web', glyph: 'web' },
]

function VisualCited() {
  // three sources, three cells. Unalike on purpose: a filing, a transcript and
  // someone's own model, so the trio reads as "anything" rather than "filings"
  const TRACES = [
    { k: 'filing', glyph: 'sec', doc: 'Apple FY24 filing', row: 0, cite: '10-K FY24 · p.47' },
    { k: 'call', glyph: 'call', doc: 'Q4 earnings call', row: 4, cite: 'Q4 call · 14:22' },
    { k: 'model', glyph: 'folder', doc: 'Coverage model', row: 7, cite: 'Model.xlsx · row 22' },
  ]

  // Two columns: source cards down the left, a worksheet down the right.
  //
  // The left column is an accordion. At rest all three cards are collapsed to a
  // header; the one currently being cited opens to show the passage inside it
  // with the line the value came from highlighted, and the cards below it move
  // down to make room. Because the open card is always EXP tall and the other
  // two always COL, the stack ends at the same y whichever one is open, so the
  // column doesn't grow and shrink as the loop runs.
  //
  // Each card carries its document title and nothing else in words — a drawn
  // glyph for the kind, bars for the passage. Titles are what an analyst would
  // read at a glance, and stripping the rest keeps the eye on the one line of
  // the passage that is actually highlighted.
  const CARD = { x: 22, w: 250 }
  const COL = 54       // a collapsed card: just the header
  const EXP = 140      // the open card: header, passage, highlighted line
  const STEP = COL + 10
  const TOP = 32
  // card j's top when card `open` is the one expanded; pass open = -1 for the
  // all-collapsed rest state
  const cardY = (j, open) => TOP + STEP * j + (open >= 0 && j > open ? EXP - COL : 0)
  const cardMid = (i) => cardY(i, i) + EXP / 2
  const BX = CARD.x + CARD.w       // the badge straddles the card's right edge
  const BR = 14                    // badge radius

  // The sheet: a real worksheet rather than three tiles — column heads, row
  // numbers, nine rows already carrying figures. The claim is about the numbers
  // an analyst already has, so the grid has to look full before anything lands
  // in it; a sparse sheet would read as "FinSynth fills this in".
  const SH = { x: 358, y: 34, w: 262, head: 22, rh: 26, n: 9 }
  const CA = 378, CB = 506, CC = 568, CEND = 620
  const rowY = (r) => SH.y + SH.head + SH.rh * r
  const cellMid = (r) => rowY(r) + SH.rh / 2
  // the cited range is A:B of one row — the label and the figure it belongs to
  const BLOCK = { x: CA, w: CC - CA, h: SH.rh }

  const SHEET = [
    { label: 'Net revenue', b: '1,842', c: '1,704' },
    { label: 'Cost of sales', b: '1,104', c: '1,040' },
    { label: 'Gross profit', b: '738', c: '664' },
    { label: 'Operating inc.', b: '336', c: '298' },
    { label: 'Pricing power', b: 'Intact', c: '' },
    { label: 'R&D', b: '214', c: '201' },
    { label: 'Services rev', b: '612', c: '549' },
    { label: 'Gross margin', b: '40.1%', c: '38.9%' },
    { label: 'FX impact', b: '(18)', c: '(11)' },
  ]

  // kind as a drawn mark, so the card says its type without spending a word
  const CardGlyph = ({ t, y, on }) => (
    <>
      <rect className="xv-tag" x={CARD.x + 14} y={y + 12} width="30" height="30" rx="9" />
      <g className={on ? 'xvq-gl xvq-gl--on' : 'xvq-gl'} transform={`translate(${CARD.x + 20.75} ${y + 18.75}) scale(0.75)`}>
        {GLYPHS[t.glyph]}
      </g>
    </>
  )

  // the header every card carries, open or shut: the mark and the title
  const CardHead = ({ t, y, on }) => (
    <>
      <CardGlyph t={t} y={y} on={on} />
      <text className="xv-ink" x={CARD.x + 54} y={y + 32}>{t.doc}</text>
    </>
  )

  const CardShut = ({ t, y }) => (
    <g>
      <rect className="xv-panel" x={CARD.x} y={y} width={CARD.w} height={COL} rx="12" />
      <CardHead t={t} y={y} />
    </g>
  )

  // the open card: the header, then the passage, with the line the figure was
  // read off banded in accent and the figure itself repeated at its right —
  // this is the "show me where you got that" moment, drawn out
  const CardOpen = ({ t, y }) => (
    <g>
      <rect className="xv-panel" x={CARD.x} y={y} width={CARD.w} height={EXP} rx="12" />
      <rect className="xv-panel--hit" fill="none" x={CARD.x} y={y} width={CARD.w} height={EXP} rx="12" />
      <CardHead t={t} y={y} on />
      <line className="xv-grid" x1={CARD.x} y1={y + 58} x2={CARD.x + CARD.w} y2={y + 58} />
      <rect className="xv-bar" x={CARD.x + 16} y={y + 70} width="200" height="5" rx="2.5" />
      <rect className="xv-bar" x={CARD.x + 16} y={y + 82} width="148" height="5" rx="2.5" />
      <rect className="xvq-band" x={CARD.x + 12} y={y + 94} width={CARD.w - 24} height="28" rx="6" />
      <rect className="xvq-quote" x={CARD.x + 12} y={y + 94} width="2.5" height="28" />
      <rect className="xv-bar-hit" x={CARD.x + 24} y={y + 105} width="86" height="5" rx="2.5" />
      <text className="xvq-found" x={CARD.x + CARD.w - 16} y={y + 112} textAnchor="end">{SHEET[t.row].b}</text>
      <rect className="xv-bar" x={CARD.x + 16} y={y + 128} width="176" height="5" rx="2.5" />
    </g>
  )

  // the cited cell, lit in place. The sheet keeps its own row: same figure, same
  // column, same neighbours, selected the way a spreadsheet selects a range —
  // a wash inside an accent outline, with the row's header lit alongside it.
  //
  // This was an opaque accent block laid over two rows. It covered column C
  // beside it and read as a tooltip dropped onto the sheet rather than as the
  // sheet's own cell coming alive, which undercuts the claim: the whole point
  // is that these are the numbers already in your workbook.
  //
  // The white patch under the wash is doing real work. The resting row is
  // already drawn beneath this group, so without it the accent label and figure
  // would sit on top of their own grey ghosts.
  //
  // The citation can't ride inside the cell any more without covering the row
  // under it, so it sits on a caption line below the grid, in the same accent
  // that marks the selection.
  const Landing = ({ t }) => {
    const y = rowY(t.row)
    const r = SHEET[t.row]
    return (
      <g>
        <rect className="xvq-rowlit" x={SH.x + 1} y={y} width={CA - SH.x - 1} height={SH.rh} />
        <rect className="xvq-clear" x={BLOCK.x} y={y} width={BLOCK.w} height={BLOCK.h} />
        <rect className="xvq-sel" x={BLOCK.x} y={y} width={BLOCK.w} height={BLOCK.h} />
        {/* the divider between A and B, redrawn over the wash — a selected range
            still shows its inner edges, and without this the two cells merge */}
        <line className="xvq-seldiv" x1={CB} y1={y} x2={CB} y2={y + BLOCK.h} />
        <rect className="xvq-selbox" x={BLOCK.x} y={y} width={BLOCK.w} height={BLOCK.h} />
        <text className="xvq-cl xvq-lit" x={CA + 12} y={y + 17}>{r.label}</text>
        <text className="xvq-cn xvq-lit" x={CC - 10} y={y + 17} textAnchor="end">{r.b}</text>
        <rect className="xvq-citemark" x={CA} y={rowY(SH.n) + 11} width="7" height="7" rx="2" />
        <text className="xvq-cite" x={CA + 13} y={rowY(SH.n) + 18}>{t.cite}</text>
      </g>
    )
  }

  return (
    <svg className="xv" viewBox={VB} role="img" aria-hidden="true">
      <text className="xv-mono" x={CARD.x + 2} y={22}>Every source</text>
      <text className="xv-mono" x={SH.x} y={22}>Your workbook</text>

      {/* rest state: three shut cards, and a sheet already full of figures. The
          cells are not empty waiting to be filled — they are numbers an analyst
          would have to take on trust until the citation arrives */}
      {TRACES.map((t, i) => <CardShut t={t} y={cardY(i, -1)} key={t.k} />)}

      <rect className="xv-panel" x={SH.x} y={SH.y} width={SH.w} height={SH.head + SH.rh * SH.n} rx="8" />
      <rect className="xv-tag" x={SH.x + 1} y={SH.y + 1} width={SH.w - 2} height={SH.head - 1} rx="7" />
      <text className="xvq-head" x={(CA + CB) / 2} y={SH.y + 15} textAnchor="middle">A</text>
      <text className="xvq-head" x={(CB + CC) / 2} y={SH.y + 15} textAnchor="middle">B</text>
      <text className="xvq-head" x={(CC + CEND) / 2} y={SH.y + 15} textAnchor="middle">C</text>
      {[CA, CB, CC].map((x) => (
        <line className="xv-grid" key={`v${x}`} x1={x} y1={SH.y} x2={x} y2={rowY(SH.n)} />
      ))}
      {SHEET.map((r, i) => (
        <g key={r.label}>
          <line className="xv-grid" x1={SH.x} y1={rowY(i)} x2={SH.x + SH.w} y2={rowY(i)} />
          <text className="xvq-rn" x={(SH.x + CA) / 2} y={rowY(i) + 17} textAnchor="middle">{i + 1}</text>
          <text className="xvq-cl" x={CA + 12} y={rowY(i) + 17}>{r.label}</text>
          <text className="xvq-cn" x={CC - 10} y={rowY(i) + 17} textAnchor="end">{r.b}</text>
          <text className="xvq-cn" x={CEND - 10} y={rowY(i) + 17} textAnchor="end">{r.c}</text>
        </g>
      ))}

      {/* One trace lit at a time. Each redraws the whole left column in its own
          open state over an opaque ground, rather than animating the cards into
          position: the beats already cross-fade, so a fade between two finished
          layouts is what the eye gets either way, and this keeps the geometry
          arithmetic instead of a stack of per-card keyframes.
          Timing in .xvq-trace, index.css. */}
      {TRACES.map((t, i) => (
        <g className={`xvq-trace xvq-trace--${i}`} key={`trace-${t.k}`}>
          <rect className="xvq-back" x="14" y="26" width={CARD.w + 20} height="282" />
          {TRACES.map((u, j) => (
            j === i
              ? <CardOpen t={u} y={cardY(j, i)} key={u.k} />
              : <CardShut t={u} y={cardY(j, i)} key={u.k} />
          ))}
          {/* stops at the sheet's outer edge rather than at the selection: the
              row-number gutter sits between the two, and a line run through it
              crosses the row number on its way in. The lit gutter carries the
              eye the rest of the way. */}
          <path
            className="xvq-conn"
            d={`M${BX + BR + 2} ${cardMid(i)} C ${BX + BR + 44} ${cardMid(i)}, ${SH.x - 46} ${cellMid(t.row)}, ${SH.x - 2} ${cellMid(t.row)}`}
          />
          <Landing t={t} />
          {/* the arrow points back at the card, not forward at the cell: the
              claim is that the figure traces to where it came from */}
          <circle className="xvq-badge" cx={BX} cy={cardMid(i)} r={BR} />
          <path
            className="xvq-mark"
            d={`M${BX + 5} ${cardMid(i)} h-8 M${BX - 0.5} ${cardMid(i) - 3.5} l-3.5 3.5 l3.5 3.5`}
          />
        </g>
      ))}
    </svg>
  )
}

function VisualAudit() {
  return (
    <div className="xvc">
      <VisualCited />
      <PillRow items={CITED_KINDS} className="xvi-grid--tight" />
    </div>
  )
}

/* 03 · Integrated — the shelf as a field rather than a list. Everything
 * FinSynth already reads is scattered across the ground at low contrast, and
 * the single thing left for the reader to do sits in the middle at full
 * strength. Two rows under a "Custom APIs" rule ran here before; the rule made
 * the named systems read as the boundary of what's supported, which is the
 * opposite of the claim. Held in the centre instead, "Add your custom MCP" is
 * the offer and the shelf behind it is the evidence.
 *
 * `y` is a percentage of the field and `r` a few degrees of tilt, hand-set
 * rather than generated. `s` says which edge the pill hangs off and `x` is
 * where that edge sits: labels are set in pixels while the field scales with
 * the stage, so anchoring the outer edge is the only way a long label like
 * "Earnings Transcripts" can never run off the card. It also keeps the two
 * flanks from ever reaching each other, which leaves the middle band clear
 * for the focal pill and means collisions can only happen down one flank.
 * The two flanks sit half a step out of phase so the field scatters rather
 * than pairing off into rows.
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
            <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              {GLYPHS.api}
            </svg>
          </span>
          <span className="xvi-label">Add your custom MCP</span>
          {/* a pointer arriving on the pill and clicking it. The rest of the
              field is inventory; this is the one thing left for the reader to
              do, and a cursor landing on it says that faster than any styling
              of the pill itself can */}
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

/* 04 · Enterprise ready — the certification seals, and nothing else.
 *
 * Two rounds of artwork ran here before: a ticked dial drawn in SVG, then a
 * supplied shield render (enterprise-shield-keyed.png, still on disk). Both
 * were pictures standing in for the claim; the seals are the claim's actual
 * evidence, so they hold the stage on their own now and get the whole cell to
 * be read in.
 *
 * The same seals also caption the Security section further down: this stage is
 * where the claim gets made in passing, that section is where it gets spelled
 * out, and the evidence belongs with both. They render from one component
 * (CertSeals) so the two can never disagree about what we hold. */
function VisualEnterprise() {
  return (
    <div className="xvs">
      {/* was SVG text inside the dial, then the shield's caption; with the art
          gone it labels the seal row */}
      <p className="xvs-eyebrow">FinSynth Security</p>
      <CertSeals />
    </div>
  )
}

/* `ms` is how long the claim holds the stage, and it is set from its visual's
   own animation rather than shared: a single interval short enough for the
   still visuals cut the animated ones off part-way through, and one long enough
   for the animated ones parked the still ones on screen with nothing happening.
   The audit trace is the constraint — its loop runs three beats over 9s (one
   per source; see .xvq-trace in index.css), and at the 4.2s every claim used to
   get, the last two beats never played at all. */
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
    // all three beats of the 9s citation cycle, so every source gets shown
    // landing; the swap comes in the quiet after the third rather than cutting
    // into the next cycle's first beat
    ms: 9000,
  },
  {
    key: 'integrated',
    title: 'Integrated',
    // the visual shows the field of sources; the copy says what it covers out
    // of the box and that anything missing can still be wired in
    body: 'Out-of-box global coverage, custom integrations supported',
    Visual: VisualIntegrated,
    // the pills stagger in over ~0.8s, and the field is a list to be read
    ms: 5400,
  },
  {
    key: 'enterprise',
    title: 'Enterprise ready',
    // names the posture; the Security section further down the page spells out
    // the specific claims (SOC 2, zero-trust, no training on your data)
    body: 'Security and compliance built in from day one',
    Visual: VisualEnterprise,
    // a still image — no animation to wait on
    ms: 4200,
  },
]

// module scope so the array identity is stable across renders and the clock's
// effect doesn't tear itself down every pass
const DWELL = PILLARS.map(p => p.ms)
const STEP_MS = 4200
// how long after the last scroll event the clock waits before taking back over
const SCROLL_IDLE_MS = 1200

/**
 * Which pillar the pane is showing — driven from two places at once.
 *
 * **Scroll.** While the reader is scrolling, the claim tracks the pane's travel
 * through the viewport: a band centred on the pane's most-visible moment is
 * split into `count` slices and the slice under the reader is the claim on
 * stage. So scrolling the section past does walk the rail, rather than leaving
 * it wherever the clock happened to stop. See `read` for why the band is
 * centred rather than spread over the pane's whole pass across the screen.
 *
 * `scrub: false` switches this half off, and the stacked layout needs it: there
 * the active claim carries the visual inside its own row, so every step change
 * moves ~120px of height from one row to another. Scrubbing that off scroll
 * position means the scroll is resizing the thing it is measuring — measured at
 * 390x844 the page below the pane jumped ±124px on the way past and the band
 * shifted enough under its own output that claim 3 was skipped outright (1 → 4).
 * Taps and the clock drive the stack instead, and nothing moves under the thumb.
 *
 * **The clock.** Standing still, the claims keep advancing on their own, so a
 * reader parked on the section still sees all four. Each claim holds for its own
 * `dwell` — one timer per step rather than one interval for the set, so a claim
 * whose visual animates gets long enough to finish it and a still one doesn't
 * sit there. The clock only runs while the pane is on screen and stands down
 * while a scroll is in flight (plus SCROLL_IDLE_MS after it, so the last
 * scrubbed claim gets a full turn before the clock moves on).
 *
 * `hold` stops the clock on hover or keyboard focus so a claim being read
 * doesn't slide out from under the reader. `goTo` jumps to a step and restarts
 * the wait, so pressing a row always buys a full turn on the claim it selected.
 */
function useAutoStep(dwell, paneRef, { scrub = true } = {}) {
  const count = dwell.length
  const [step, setStep] = useState(0)
  const [held, setHeld] = useState(false)
  const [nudge, setNudge] = useState(0)
  const [onScreen, setOnScreen] = useState(false)
  // read by the clock, written by the scroll listener — a ref rather than state
  // so a scroll doesn't tear down and rebuild the interval on every frame
  const scrolling = useRef(false)

  // scroll scrub
  useEffect(() => {
    if (!scrub) return
    const pane = paneRef.current
    if (!pane) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let idle = 0

    const read = () => {
      raf = 0
      const r = pane.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom <= 0 || r.top >= vh) return
      // The band the four claims are spread over is centred on the pane's
      // most-visible moment, not on its whole pass across the screen.
      //
      // Spread over the whole pass — `(vh - r.top) / (vh + r.height)`, which
      // this was — the first and last claims are only ever lit while the pane
      // is half off screen: measured at 1908x1026 the pane is 681 tall, so
      // through the entire window where it is 100% visible p only ran .40 to
      // .60 and just claims 2 and 3 came up. Two of the four were never on
      // stage while the reader could see the stage.
      //
      // `centre` is the top offset at which the pane sits centred in the
      // viewport; travel spans 55% of the viewport around it, widened to the
      // pane's own slack when that is larger so a pane much shorter than the
      // screen still uses its full still-visible run. For a pane taller than
      // the viewport (the stacked layout) the slack is negative and the 55%
      // floor carries it.
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
        // restart the clock's wait so the claim scrolled to gets a full turn
        setNudge(n => n + 1)
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

  // is the pane on screen? the clock only runs while it is
  useEffect(() => {
    const pane = paneRef.current
    if (!pane) return
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.35 })
    io.observe(pane)
    return () => io.disconnect()
  }, [paneRef])

  // the clock — a fresh timer per step, so each claim holds for its own dwell
  useEffect(() => {
    if (!onScreen || held) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timer = setTimeout(() => {
      // a scroll in flight owns the rail; the idle handler bumps `nudge` when it
      // stops, which restarts this wait, so the clock picks up where it left
      if (scrolling.current) return
      setStep(s => (s + 1) % count)
    }, dwell[step] ?? STEP_MS)
    return () => clearTimeout(timer)
    // `nudge` is here only to restart the wait after a row press or a scroll
  }, [dwell, count, step, onScreen, held, nudge])

  return {
    step,
    goTo: i => { setStep(i); setNudge(n => n + 1) },
    hold: () => setHeld(true),
    release: () => setHeld(false),
  }
}

/**
 * The section is rendered twice on the page: once as "FinSynth for Excel",
 * and once after the footer as the "FIA Agent" coming-soon teaser — same
 * frame, same rail and stage, different headline. `id` keeps the two anchors
 * distinct; `badge` hangs a pill (e.g. "Coming soon") off the headline.
 */
export default function ExcelSection({
  id = 'excel',
  title = <>FinSynth for <span className="ttl-hl">Excel</span></>,
  badge,
}) {
  const frameRef = useReveal({ threshold: 0.08 })
  const paneRef = useRef(null)
  // Narrow screens read the pane as an accordion instead of two columns: the
  // active claim's visual is mounted directly under its own row, so the picture
  // is always beside the words it belongs to rather than below all four of them.
  const stacked = useMediaQuery('(max-width: 900px)')
  // and the stack takes no scroll scrub — see useAutoStep
  const { step, goTo, hold, release } = useAutoStep(DWELL, paneRef, { scrub: !stacked })

  return (
    <section className="x4e-sec" id={id}>
      <div className="wrap">
        <div className="x4e-frame" ref={frameRef}>

          <div className="x4e-head x4e-reveal">
            <div className="x4e-head-copy">
              <h2>
                {title}
                {badge && <span className="x4e-badge">{badge}</span>}
              </h2>
            </div>
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
            {/* all four claims stay on screen the whole time — nothing swaps
                out from under the reader. The rail doubles as the navigation:
                the highlighted row is the one whose visual the stage shows,
                and pressing a row jumps the stage to it. */}
            <ol className="x4e-rail">
              {PILLARS.map((p, i) => {
                const { Visual } = p
                return (
                  <li key={p.key}>
                    <button
                      type="button"
                      className={`x4e-item${i === step ? ' is-active' : ''}`}
                      aria-current={i === step}
                      onClick={() => goTo(i)}
                    >
                      <span className="x4e-item-body">
                        <span className="x4e-item-title">{p.title}</span>
                        <span className="x4e-item-p">{p.body}</span>
                      </span>
                    </button>
                    {/* stacked: the one visual on show rides under its own row.
                        Mounted only while active, so its animation starts from
                        the top each time the claim comes round rather than
                        being caught mid-loop the way the always-mounted
                        desktop stage needs the gate below for. */}
                    {stacked && i === step && (
                      <div className="x4e-stage x4e-stage--inline">
                        <div className="x4e-visual is-active">
                          <Visual />
                        </div>
                      </div>
                    )}
                  </li>
                )
              })}
            </ol>
            {/* only the visuals crossfade; every step's copy stays put */}
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
        </div>
      </div>
    </section>
  )
}
