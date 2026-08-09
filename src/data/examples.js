// The three worked examples the site demos, in one place: the hero's ask popup
// (src/components/Hero.jsx) and the "Say hello to your new co-worker" composer
// (src/components/HowItWorks.jsx) both read from here, so a prompt or a figure
// is only ever edited once.
//
// Each example is a full sheet: the prompt the user asks, the answer FinSynth
// streams back (`response`), the workbook name it hands off (`file`), a
// tailored closing CTA, and the table itself.

export const PROMPTS = [
  {
    id: 'aapl-gross-margin',
    icon: 'trend',
    label: 'Gross margin, nine quarters',
    prompt:
      "Pull Apple's gross margin for the last nine quarters, and flag any quarter it moved more than 200 basis points",
    response:
      "Nine quarters, checked one by one against a real threshold. Nothing here crossed 200bps, and FinSynth says so instead of manufacturing a story that isn't there.",
    file: 'Apple_Gross_Margin.xlsx',
    cta: 'Click any number to cross-check and our webapp takes you straight to the source, the relevant passage highlighted.',
    table: {
      note: 'USD millions unless noted · fiscal year Oct–Sep · as-of 2026-07-22',
      cols: ['Quarter', 'Period Ending', 'Revenue', 'Gross Profit', 'Gross Margin', 'QoQ Δ (bps)', '>200 bps'],
      // source-pulled figures rendered as blue cited links (computed columns stay plain)
      linkCols: [2, 3],
      rows: [
        ['Q2 2024', '30-Mar-24', '90,753', '42,271', '46.6%', '', ''],
        ['Q3 2024', '29-Jun-24', '85,777', '39,678', '46.3%', '(32)', ''],
        ['Q4 2024', '28-Sep-24', '94,930', '43,879', '46.2%', '(3)', ''],
        ['Q1 2025', '28-Dec-24', '124,300', '58,275', '46.9%', '66', ''],
        ['Q2 2025', '29-Mar-25', '95,359', '44,867', '47.1%', '17', ''],
        ['Q3 2025', '28-Jun-25', '94,036', '43,718', '46.5%', '(56)', ''],
        ['Q4 2025', '27-Sep-25', '102,466', '48,341', '47.2%', '69', ''],
        ['Q1 2026', '27-Dec-25', '143,756', '69,231', '48.2%', '98', ''],
        ['Q2 2026', '28-Mar-26', '111,184', '54,781', '49.3%', '111', ''],
      ],
    },
  },
  {
    id: 'semi-comps',
    icon: 'table',
    label: 'Semiconductor comps table',
    prompt:
      'Build a comparables table for the ten largest semiconductor names on EV/EBITDA, P/E, and revenue growth',
    response:
      "Ten names, median and mean calculated automatically. It also catches the details an analyst would: SK hynix flagged as KRW-listed, Intel's P/E marked n/a on negative earnings, not left as a broken number.",
    file: 'Semiconductor_Comps.xlsx',
    cta: 'Click any number to cross-check and our webapp takes you straight to the source, the relevant passage highlighted.',
    table: {
      note: 'USD · Mkt Cap in $B · P/E and EV/EBITDA trailing (TTM) · Rev growth = latest completed FY (YoY) · as-of 2026-07-22',
      cols: ['Company', 'Ticker', 'Mkt Cap ($B)', 'P/E (TTM)', 'EV/EBITDA', 'Rev Growth (FY YoY)', 'Growth FY'],
      // source-pulled figures rendered as blue cited links (computed columns / aggregate rows stay plain)
      linkCols: [2, 3, 4, 5],
      rows: [
        ['NVIDIA', 'NVDA', '5,020.8', '31.75', '30.09', '65.5%', 'FY2026'],
        ['Taiwan Semiconductor', 'TSM', '2,202.2', '27.58', '18.49', '31.6%', 'FY2025'],
        ['Broadcom', 'AVGO', '1,838.8', '64.32', '44.77', '23.9%', 'FY2025'],
        ['SK hynix', '000660.KS', '1,220.5', '17.38', '14.33', '46.8%', 'FY2025'],
        ['Micron', 'MU', '1,096.4', '21.91', '15.72', '48.9%', 'FY2025'],
        ['AMD', 'AMD', '887.7', '181.55', '118.34', '34.3%', 'FY2025'],
        ['ASML', 'ASML', '694.3', '57.54', '44.97', '9.8%', 'FY2025'],
        ['Intel', 'INTC', '530.0', 'n/a', '38.23', '-0.5%', 'FY2025'],
        ['Applied Materials', 'AMAT', '448.2', '53.10', '48.22', '4.4%', 'FY2025'],
        ['Lam Research', 'LRCX', '402.7', '60.82', '51.18', '23.7%', 'FY2025'],
        ['Median', '', '992.1', '53.10', '41.50', '27.7%', ''],
        ['Mean', '', '1,434.2', '57.33', '42.43', '28.8%', ''],
      ],
    },
  },
  {
    id: 'meta-guidance',
    icon: 'refresh',
    label: 'Guidance vs. actuals, twelve quarters',
    prompt:
      "Track how Meta's guidance has compared to what it actually delivered, over the last twelve quarters",
    response:
      'Twelve quarters of guidance versus actuals, categorized and summarized: 7 quarters beat the top of the range, 5 landed inside it, 0 missed. A track record, not just a data pull.',
    file: 'Meta_Guidance_vs_Actual.xlsx',
    cta: 'Click any number to cross-check and our webapp takes you straight to the source, the relevant passage highlighted.',
    table: {
      note: 'USD millions · Guidance = next-quarter revenue range (stated in $B, shown here in $M) · Actual = reported total revenue · as-of 2026-07-22',
      cols: ['Quarter', 'Guide Low', 'Guide High', 'Guide Mid', 'Actual Rev', 'Act − Mid', 'Act vs Mid %', 'Act − High', 'Result vs Range'],
      // source-pulled figures rendered as blue cited links (computed columns stay plain)
      linkCols: [1, 2, 4],
      rows: [
        ['Jun-23A', '29,500', '32,000', '30,750', '31,999', '1,249', '4.1%', '(1)', 'In range'],
        ['Sep-23A', '32,000', '34,500', '33,250', '34,146', '896', '2.7%', '(354)', 'In range'],
        ['Dec-23A', '36,500', '40,000', '38,250', '40,111', '1,861', '4.9%', '111', 'Above high'],
        ['Mar-24A', '34,500', '37,000', '35,750', '36,455', '705', '2.0%', '(545)', 'In range'],
        ['Jun-24A', '36,500', '39,000', '37,750', '39,071', '1,321', '3.5%', '71', 'Above high'],
        ['Sep-24A', '38,500', '41,000', '39,750', '40,589', '839', '2.1%', '(411)', 'In range'],
        ['Dec-24A', '45,000', '48,000', '46,500', '48,385', '1,885', '4.1%', '385', 'Above high'],
        ['Mar-25A', '39,500', '41,800', '40,650', '42,314', '1,664', '4.1%', '514', 'Above high'],
        ['Jun-25A', '42,500', '45,500', '44,000', '47,516', '3,516', '8.0%', '2,016', 'Above high'],
        ['Sep-25A', '47,500', '50,500', '49,000', '51,242', '2,242', '4.6%', '742', 'Above high'],
        ['Dec-25A', '56,000', '59,000', '57,500', '59,893', '2,393', '4.2%', '893', 'Above high'],
        ['Mar-26A', '53,500', '56,500', '55,000', '56,311', '1,311', '2.4%', '(189)', 'In range'],
      ],
    },
  },
]

// Fallback for a query the user types themselves (not one of the examples).
export const DEFAULT_RESULT = {
  response:
    "On it. I've pulled the figures, traced each one back to its source filing, and staged the update for your review. Nothing is written to your model until you approve every cell.",
  file: 'FinSynth_Output.xlsx',
  cta: 'Click any number to cross-check and our webapp takes you straight to the source, the relevant passage highlighted.',
  table: {
    cols: ['Metric', 'Value', 'Source'],
    linkCols: [1],
    rows: [
      ['Revenue', '$391.0B', '10-K · p.31'],
      ['Gross margin', '46.2%', '10-K · p.32'],
      ['Operating income', '$123.2B', '10-K · p.31'],
    ],
  },
}

// ── Citations ──
// Every blue figure in a result table came from a document, and clicking it in
// the chat opens that document (src/components/HowItWorks.jsx → the source
// pane). `citeFor` builds the citation from the row that was clicked, so the
// excerpt on screen always carries the same number the visitor clicked — the
// two can never drift apart, which is the whole point of a citation.
//
// What each citation names is the filing an analyst would actually open:
// - a quarter inside a fiscal year → that quarter's 10-Q (Part I, Item 1)
// - a fiscal Q4 → the earnings release (8-K, Ex. 99.1), because a 10-K states
//   the year, not the fourth quarter, so the quarter is only stated there
// - forward guidance → the prior quarter's release, under "Outlook"
// - a market multiple → the market snapshot the table was priced off
//
// `href` is the filer's EDGAR filing index for that form type: a real, stable
// page. We don't mint accession numbers we haven't looked up.

const EDGAR_CIK = (cik, type) =>
  `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${cik}&type=${type}&dateb=&owner=include&count=40`
const EDGAR_TICKER = (ticker, type) =>
  `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&ticker=${ticker}&type=${type}&dateb=&owner=include&count=40`
const DART = 'https://engdart.fss.or.kr/'

const AS_OF = '22-Jul-2026'

// '(1,249)' / '48.9%' → number; parenthesised figures are negative, as in a filing
const num = (cell) => {
  const raw = String(cell ?? '').trim()
  const n = Number(raw.replace(/[^0-9.]/g, ''))
  if (!Number.isFinite(n)) return NaN
  return /^\(/.test(raw) ? -n : n
}
const millions = (n) => n.toLocaleString('en-US')
// 29,500 ($M, as stored) → '29.5' ($B, as stated aloud in a release)
const billions = (cell) => {
  const v = num(cell) / 1000
  return v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)
}

function citeApple(row, ci) {
  const [quarter, ending, revenue, grossProfit] = row
  // Apple's fiscal Q4 is only stated as a quarter in the earnings release —
  // the 10-K reports the year.
  const q4 = quarter.startsWith('Q4')
  return {
    doc: q4 ? 'Apple Inc. — Form 8-K, Exhibit 99.1' : 'Apple Inc. — Form 10-Q',
    meta: q4
      ? `${quarter} earnings release · three months ended ${ending}`
      : `${quarter} · quarter ended ${ending}`,
    section: q4
      ? 'Condensed Consolidated Statements of Operations (unaudited)'
      : 'Part I, Item 1 — Condensed Consolidated Statements of Operations (unaudited)',
    unit: 'In millions',
    lines: [
      { label: 'Total net sales', value: revenue, hit: ci === 2 },
      { label: 'Total cost of sales', value: millions(num(revenue) - num(grossProfit)), hit: false },
      { label: 'Gross margin', value: grossProfit, hit: ci === 3 },
    ],
    note:
      'Apple labels gross profit “Gross margin” on this statement. The percentage in the answer is that line over total net sales; cost of sales is shown for the tie-out.',
    href: EDGAR_CIK('0000320193', q4 ? '8-K' : '10-Q'),
    hrefLabel: `Open Apple’s ${q4 ? '8-K' : '10-Q'} filings on SEC EDGAR`,
  }
}

const QTR_MONTHS = ['Mar', 'Jun', 'Sep', 'Dec']
const QTR_ORDINAL = ['first', 'second', 'third', 'fourth']
const QTR_END = { Mar: 'March 31', Jun: 'June 30', Sep: 'September 30', Dec: 'December 31' }

// 'Sep-23A' → { mon: 'Sep', year: 2023, i: 2 }
const parseQuarter = (label) => {
  const [mon, yy] = String(label).replace(/A$/, '').split('-')
  return { mon, year: 2000 + Number(yy), i: QTR_MONTHS.indexOf(mon) }
}

function citeMeta(row, ci) {
  const [label, low, high, , actual] = row
  const { mon, year, i } = parseQuarter(label)

  // Guide low / high: stated a quarter earlier, in that release's outlook.
  if (ci === 1 || ci === 2) {
    const prior = i === 0
      ? { mon: 'Dec', year: year - 1 }
      : { mon: QTR_MONTHS[i - 1], year }
    return {
      doc: 'Meta Platforms, Inc. — Form 8-K, Exhibit 99.1',
      meta: `${prior.mon}-${String(prior.year).slice(2)} earnings release · CFO outlook`,
      section: 'Outlook',
      // built from the row, so the highlighted figure is the cell that was clicked
      quote: [
        { t: `We expect ${QTR_ORDINAL[i]} quarter ${year} total revenue to be in the range of $` },
        { t: billions(low), hit: ci === 1 },
        { t: '–' },
        { t: billions(high), hit: ci === 2 },
        { t: ' billion.' },
      ],
      note: `Guidance is given one quarter ahead, so this ${prior.mon}-${String(prior.year).slice(2)} release is where the ${label.replace(/A$/, '')} range was set. The answer scores it against what Meta went on to report.`,
      href: EDGAR_CIK('0001326801', '8-K'),
      hrefLabel: 'Open Meta’s 8-K filings on SEC EDGAR',
    }
  }

  // Actual revenue: the quarter's own statement of income.
  const q4 = mon === 'Dec'
  return {
    doc: q4 ? 'Meta Platforms, Inc. — Form 8-K, Exhibit 99.1' : 'Meta Platforms, Inc. — Form 10-Q',
    meta: `Three months ended ${QTR_END[mon]}, ${year}`,
    section: q4
      ? 'Condensed Consolidated Statements of Income (unaudited)'
      : 'Part I, Item 1 — Condensed Consolidated Statements of Income (unaudited)',
    unit: 'In millions',
    lines: [{ label: 'Revenue', value: actual, hit: true }],
    note: q4
      ? 'A 10-K states the fiscal year, not its fourth quarter, so the quarter is taken from the Q4 earnings release.'
      : 'Total revenue as reported for the quarter — compared in the answer against the range guided three months earlier.',
    href: EDGAR_CIK('0001326801', q4 ? '8-K' : '10-Q'),
    hrefLabel: `Open Meta’s ${q4 ? '8-K' : '10-Q'} filings on SEC EDGAR`,
  }
}

const SEMI_METRIC = {
  2: { label: 'Market capitalisation', basis: 'Shares outstanding from the latest filing cover page × close price.' },
  3: { label: 'P/E (TTM)', basis: 'Close price ÷ diluted EPS over the four most recent reported quarters.' },
  4: { label: 'EV/EBITDA (TTM)', basis: 'Enterprise value ÷ EBITDA over the four most recent reported quarters.' },
}

function citeSemi(row, ci) {
  const [name, ticker, , , , growth, fy] = row
  const krx = ticker.endsWith('.KS')

  // Revenue growth comes out of the annual report, not the tape.
  if (ci === 5) {
    return {
      doc: krx ? `${name} — Annual Report (${fy})` : `${name} — Form 10-K (${fy})`,
      meta: krx ? `${ticker} · filed with Korea’s DART, not the SEC` : `${ticker} · fiscal year ${fy.replace('FY', '')}`,
      section: krx
        ? 'Consolidated Statements of Comprehensive Income'
        : 'Part II, Item 8 — Consolidated Statements of Operations',
      lines: [{ label: `Revenue growth, ${fy} vs. prior year`, value: growth, hit: true }],
      note: `Computed from total revenue in the ${fy} and prior-year consolidated statements of operations — not from a vendor growth field.`,
      href: krx ? DART : EDGAR_TICKER(ticker, '10-K'),
      hrefLabel: krx ? 'Open DART (Korean filings)' : `Open ${ticker}’s 10-K filings on SEC EDGAR`,
    }
  }

  const metric = SEMI_METRIC[ci]
  // the table's units live in its column headers; the document has to carry
  // its own, or the excerpt reads as a bare number
  const value = ci === 2 ? `$${row[ci]}B` : `${row[ci]}×`
  return {
    doc: `Market snapshot — ${AS_OF}`,
    meta: `${name} (${ticker}) · ${krx ? 'KRX close, converted to USD' : 'consolidated exchange close'}`,
    section: 'Price and trailing multiples',
    lines: [{ label: metric.label, value, hit: true }],
    note: `${metric.basis} Per-share and earnings inputs come from ${krx ? 'the annual report' : 'the filings'}, so every multiple traces back to a statement rather than stopping at a vendor field.`,
    href: krx ? DART : EDGAR_TICKER(ticker, '10-Q'),
    hrefLabel: krx ? 'Open DART (Korean filings)' : `Open ${ticker}’s filings on SEC EDGAR`,
  }
}

const CITERS = {
  'aapl-gross-margin': citeApple,
  'semi-comps': citeSemi,
  'meta-guidance': citeMeta,
}

// The citation behind one cell of one example's table. Returns null when the
// cell isn't a sourced figure, which is also the guard the table renders on.
export function citeFor(example, rowIndex, colIndex) {
  const table = example?.table
  const citer = CITERS[example?.id]
  if (!table || !citer) return null
  const row = table.rows[rowIndex]
  if (!row) return null
  const cell = row[colIndex]
  // computed columns, aggregate rows and blanks aren't sourced
  if (!cell || cell === 'n/a') return null
  if (row[0] === 'Median' || row[0] === 'Mean') return null
  if (!table.linkCols?.includes(colIndex)) return null
  return { id: `${example.id}-${rowIndex}-${colIndex}`, cell, ...citer(row, colIndex) }
}

// Match free-typed text to a curated example so a typed-out version of one of
// the suggestions still gets its own workbook. Exact prompt first, then a
// loose signal match on the distinctive terms of each example. Returns null
// when nothing matches — the caller falls back to the generic result.
export function matchExample(text) {
  const q = (text || '').trim().toLowerCase()
  if (!q) return null
  const exact = PROMPTS.find((p) => p.prompt.toLowerCase() === q)
  if (exact) return exact
  const SIGNALS = {
    'aapl-gross-margin': [['apple', 'aapl'], ['gross margin', 'margin', 'basis point', 'bps']],
    'semi-comps': [['semiconductor', 'semis', 'chip'], ['comp', 'comparable', 'ev/ebitda', 'p/e', 'multiple']],
    'meta-guidance': [['meta', 'facebook'], ['guidance', 'guided', 'guide', 'actual', 'beat']],
  }
  // require a hit in every signal group so "apple" alone doesn't claim the
  // margin sheet and "guidance" alone doesn't claim the Meta one
  for (const p of PROMPTS) {
    const groups = SIGNALS[p.id]
    if (groups && groups.every((g) => g.some((term) => q.includes(term)))) return p
  }
  return null
}
