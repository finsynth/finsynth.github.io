/**
 * The per-desk solution pages (/solutions/<slug>). One entry per segment the
 * navbar's Solutions menu links to; a slug with no entry here falls back to
 * the home page. Copy only: the drawn product panels each `visual` names
 * live in pages/Solution.jsx.
 *
 * The figures in `stats` are the site's own proof points (the same three the
 * home page's metrics band carries), not numbers taken from anyone else's
 * page, so this page never claims more than the home page can stand behind.
 */
export const SOLUTIONS = {
  'private-equity': {
    name: 'Private Equity',
    title: 'Do more deals and deepen your analysis, from LBO build and valuation, to creating IC decks',
    lede:
      'FinSynth builds the model to your template, cites every number back to its source and keeps the audit trail, inside Excel and in the Fia workspace',
    statsLead: 'More capacity. Deeper analysis. Measurable ROI.',
    stats: [
      { value: '80%', label: 'Time saved' },
      { value: '90%', label: 'Less time auditing' },
      { value: '2x', label: 'More coverage' },
    ],
    workflows: [
      {
        key: 'lbo',
        eyebrow: 'First look',
        title: 'First-Look LBO Build',
        body:
          'Build a defensible LBO before IC, to your own template, 90% faster. Pull financials, segments and the management plan into an IC-ready LBO against your layout. Stress-test assumptions and run EBITDA bridge scenarios without leaving the workbook.',
        visual: 'lbo',
      },
      {
        key: 'underwriting',
        eyebrow: 'Underwriting',
        title: 'Full Underwriting Model Build',
        body:
          'Build and audit your underwriting models in a fraction of the time. Hand Fia the CIM and the management plan: it scopes the driver tree, then builds the bottom-up schedules and IC tables to your conventions, with every figure traced to its source.',
        visual: 'underwriting',
      },
      {
        key: 'valuation',
        eyebrow: 'Portfolio',
        title: 'Valuation Modelling and Reporting',
        body:
          'Accelerate comps refreshes, including transaction multiples pulled straight from the source filings. Automate quarter-end consolidations, even when every portco reports on a different template.',
        visual: 'valuation',
      },
      {
        key: 'deck',
        eyebrow: 'Committee',
        title: 'IC Deck',
        body:
          'Turn the live model into IC-ready slides: cases, returns bridge and sensitivities, each figure traceable to its source cell. Cross-checked against the underlying model, with firm context woven in.',
        visual: 'deck',
      },
    ],
    closing: 'See for yourself',
  },
}

export const solutionHref = (slug) => `/solutions/${slug}`
