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

  // Copy taken from the approved page outline canvas (Oct 2026). The hero lede
  // is the sentence agents are meant to quote, so it stays word-for-word the
  // same wherever hedge funds are described.
  'hedge-funds': {
    name: 'Hedge Funds',
    title: 'Take your research from draft to decision',
    lede:
      'FinSynth is auditable AI research infrastructure, purpose-built for hedge fund research teams. Its AI agent runs complex institutional-grade workflows like earnings updates, consensus comparison, model audits and comps, tracing every output back to its source.',
    strategiesLead: 'Built to work across strategies',
    strategies: ['Long/short', 'Value', 'Event-driven', 'Activist', 'Credit', 'Multi-strategy'],
    statsLead: 'More capacity. Deeper analysis. Measurable ROI.',
    stats: [
      { value: '80%', label: 'Time saved' },
      { value: '90%', label: 'Less time auditing' },
      { value: '2x', label: 'More coverage' },
    ],
    useCasesHead: { eyebrow: 'Use cases', title: 'Where FinSynth fits into hedge fund research' },
    workflows: [
      {
        key: 'earnings-updates',
        eyebrow: 'Earnings updates',
        title: 'From the release to your model, before the open',
        body:
          'Ask FinSynth to update your model and it fills in the reported figures in your existing layout, each one linked to the exact line in the release. It also flags where each line item beat or missed consensus, and by how much.',
        visual: 'earnings',
      },
      {
        key: 'get-up-to-speed',
        eyebrow: 'Get up to speed',
        title: 'Form a view on a new name in an afternoon',
        body:
          'Point FinSynth at a company, sector or market and it maps the business, its segments, key metrics and what management has been saying, each point linked to its source. Add your own broker notes and expert calls from the Dataroom and it works across those too.',
        visual: 'overview',
      },
      {
        key: 'model-builds',
        eyebrow: 'Model and DCF builds',
        title: 'Skip the spreading and start at the forecasts',
        body:
          'Ask FinSynth to build a model and DCF in your template and it spreads the historicals from the filings, each figure linked to where it was reported. It handles segment recasts and restatements, so the history lines up before you start forecasting.',
        visual: 'modelbuild',
      },
      {
        key: 'comps',
        eyebrow: 'Comps and peer benchmarking',
        title: 'Fresh comps for every new idea, in your template',
        body:
          'Name the peer set and FinSynth builds the comps in your template, calendarising and normalising metrics across different fiscal years and reporting formats. Click any multiple to see the inputs behind it and where each one came from.',
        visual: 'comps',
      },
      {
        key: 'thesis-testing',
        eyebrow: 'Thesis testing',
        title: 'Find where your thesis is weakest before the market does',
        body:
          "Give FinSynth your thesis and it tests each point against filings, transcripts and your own research, then builds the strongest case against it, with every claim cited. Before a catalyst, ask how management's story on a topic has shifted across recent calls.",
        visual: 'thesis',
      },
      {
        key: 'model-audits',
        eyebrow: 'Model audits',
        title: 'Trust an inherited model on day one',
        body:
          'Share a model you inherited and FinSynth reviews it for hardcodes, broken references and inconsistent formulas, linking each issue to the exact cell. It also reconciles the historicals back to the filings, so you know which numbers to trust.',
        visual: 'audit',
      },
    ],
    more: { lead: '+ Hundreds more', rest: 'research workflows, all in one agent' },
    // The same rail + stage the home page's Excel section uses: five claims on
    // the left, one visual on stage per claim. `ms` is how long each holds on
    // the auto-step; the citation trace is a 9s loop and gets the longest turn.
    how: {
      title: 'Fast to draft, faster to trust',
      steps: [
        { key: 'workflows', visual: 'workflows', ms: 5000, title: 'Ask in Excel or on the web', body: 'Earnings updates, model builds, comps, thesis testing, audits and memos from one agent, as an add-in inside your models or in the web app' },
        { key: 'cite', visual: 'cite', ms: 9000, title: 'Every output cited', body: 'Each number and claim links to the exact line in the filing, release, transcript or your own documents. Select a range and step through the source of every cell in one pass' },
        { key: 'format', visual: 'format', ms: 5200, title: 'Your house format', body: 'Models, comps and memos built in your templates. Save a routine once as a Skill and run it on every name in your book' },
        { key: 'sources', visual: 'sources', ms: 5400, title: 'Your own research, connected', body: 'Keep broker notes, expert calls and internal research in the Dataroom, and connect your own data and tools through MCP' },
        { key: 'enterprise', visual: 'enterprise', ms: 4200, title: 'Enterprise ready', body: 'Customer-hosted deployment and SOC 2 Type II certified, built for how funds handle sensitive research' },
      ],
    },
    // the home page's Customers section, quotes and all: every voice in it is a hedge fund analyst
    testimonials: true,
    faqHead: { eyebrow: 'FAQ', title: 'Questions hedge fund teams ask' },
    faqs: [
      { q: 'What is FinSynth?', a: 'FinSynth is auditable AI research infrastructure, purpose-built for hedge fund research teams. Its AI agent runs complex institutional-grade workflows like earnings updates, consensus comparison, model audits and comps, tracing every output back to its source. It works as an Excel add-in and as a web app.' },
      { q: 'How do hedge funds use FinSynth?', a: 'Hedge fund teams use FinSynth for earnings updates, getting up to speed on new names, model and DCF builds, comps and peer benchmarking, thesis testing and model audits, along with hundreds of other research workflows.' },
      { q: 'Does FinSynth work for credit funds?', a: 'Yes. Credit teams use FinSynth to build and audit issuer models, reconcile historicals to the filings, benchmark against peers and test a thesis against filings and transcripts, with every figure cited.' },
      { q: 'How do multi-strategy platforms use FinSynth?', a: "Mostly to get up to speed on new names and inherited models quickly, run earnings updates across a large book, and use Skills to keep every analyst's output in the platform's house format." },
      { q: 'Is FinSynth useful for event-driven strategies?', a: "Yes. Before a catalyst, ask FinSynth to test your thesis against filings and transcripts, or to show how management's story on a topic has shifted across recent calls, with every claim traced to its source." },
      { q: 'Does FinSynth work inside Excel?', a: 'Yes. FinSynth runs as an Excel add-in inside your existing models, and as a web app for research and memos.' },
      { q: 'Can FinSynth use our own research?', a: 'Yes. Keep broker notes, expert call transcripts and internal documents in the Dataroom and attach them to any session. FinSynth can also connect to your own data and tools through MCP.' },
      { q: 'Does it work with our model templates?', a: 'Yes. FinSynth builds models, comps and memos in your own templates, and Skills let you save a routine once and run it again on any name.' },
      { q: 'What markets does FinSynth cover?', a: 'FinSynth has global coverage of public companies, including US, European, Hong Kong and China A-share filings.' },
    ],
    closing: 'See FinSynth in action',
    closingSub: 'Book a demo with our team, or start for free today',
  },
}

export const solutionHref = (slug) => `/solutions/${slug}`
