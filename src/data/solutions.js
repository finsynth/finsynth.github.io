/**
 * The per-desk solution pages (/solutions/<slug>). One entry per segment the
 * navbar's Solutions menu links to; a slug with no entry here falls back to
 * the home page. Copy only: the drawn product panels each `visual` names
 * live in pages/Solution.jsx. Hedge Funds is the one page for now; the other
 * desks in the menu land on the home page's why-FinSynth section.
 */
export const SOLUTIONS = {
  // Copy taken from the approved page outline canvas (Oct 2026). The hero lede
  // is the sentence agents are meant to quote, so it stays word-for-word the
  // same wherever hedge funds are described.
  'hedge-funds': {
    name: 'Hedge Funds',
    title: 'Take your research from draft to decision',
    lede:
      'FinSynth is auditable AI research infrastructure, purpose-built for hedge fund research teams. Its AI agent runs complex institutional-grade workflows like idea generation, model builds, comps and earnings updates, tracing every output back to its source.',
    strategiesLead: 'Built to work across strategies',
    strategies: ['Long/short', 'Value', 'Event-driven', 'Activist', 'Credit', 'Multi-strategy'],
    useCasesHead: { eyebrow: 'Use cases', title: 'Where FinSynth fits into hedge fund research' },
    // the four stages of an idea's life, from the approved copy: each row is
    // an outcome-led headline over one short paragraph, and the use case's
    // key is its anchor so the block can later lift into its own page. A use
    // case that spans several screens lists them, and the stage plays each
    // in turn
    workflows: [
      {
        key: 'idea-generation',
        num: '01',
        eyebrow: 'Idea generation',
        title: 'Surface your next idea from the whole universe',
        body:
          'Ask FinSynth to screen a universe on the numbers and the narrative, from margin inflections to guidance changes to what management said on the last call, and it returns a shortlist with every data point sourced. Each name is ready to take further.',
        visual: 'screen',
      },
      {
        key: 'get-up-to-speed',
        num: '02',
        eyebrow: 'Get up to speed',
        title: 'Form a view on a new name in an afternoon',
        body:
          'Point FinSynth at a company, sector or market, along with your own broker notes and expert calls, and it maps the business, its segments, key metrics and what management has been saying, each point linked to its source. Taking over a name? It audits the inherited model for hardcodes, broken references and inconsistent formulas too.',
        visual: ['overview', 'audit'],
      },
      {
        key: 'models-diligence',
        num: '03',
        eyebrow: 'Models and diligence',
        title: 'Model, value and pressure-test a name in your own template',
        body:
          'Ask FinSynth to build the model and DCF from the filings, set comps against the peer set and build the strongest case against your thesis, each figure and claim linked to its source. Every historical lines up with the filings before you start forecasting.',
        visual: ['modelbuild', 'comps', 'thesis'],
      },
      {
        key: 'monitoring-updates',
        num: '04',
        eyebrow: 'Monitoring and updates',
        title: 'Stay on top of every name in your book',
        body:
          'When a name reports, ask FinSynth to update your model and flag where each line item beat or missed consensus, each figure linked to the exact line in the release. Then ask whether your thesis still holds, and it checks it against everything reported and said since.',
        visual: 'earnings',
      },
    ],
    // the line under the four rows
    useCasesMore: { lead: '+ Hundreds more', rest: 'research workflows, all in one agent' },
    // The same rail + stage the home page's Excel section uses: five claims on
    // the left, one visual on stage per claim. `ms` is how long each holds on
    // the auto-step; the citation trace is a 9s loop and gets the longest turn.
    how: {
      title: 'Fast to draft. Faster to trust',
      // the three-stage layouts (?how=columns|workspace|evidence) run one
      // example through every stage: the documents brought in at stage one are
      // the inputs at stage two, and the cell written there is the one verified
      // at stage three. Only this example changes by audience; the stage labels
      // and explanations live in src/components/HowStages.jsx
      eyebrow: 'How your team works with FinSynth',
      example: {
        sources: [
          { icon: 'doc', name: 'Q3 FY26 release', kind: 'Filing', meta: '24 pages' },
          { icon: 'sheet', name: 'Fund_model_v12.xlsx', kind: 'Your template', meta: 'Crocs' },
          { icon: 'plug', name: 'Consensus estimates', kind: 'Snowflake via MCP', meta: '14 brokers' },
          { icon: 'folder', name: 'Broker notes', kind: 'Dataroom', meta: '3 files' },
        ],
        surfaces: ['Excel add-in', 'Web app'],
        file: 'Fund_model_v12.xlsx',
        instruction: 'Update the Crocs model for Q3 actuals and flag anything off consensus',
        skill: 'Earnings update',
        sheet: {
          cols: ['USD m', 'Q3 FY25A', 'Q3 FY26A', 'Cons.', 'vs cons.'],
          rows: [
            ['Revenue', '1,184.2', '1,284.6', '1,258.0', '+2.1%'],
            ['Gross profit', '470.1', '512.5', '504.0', '+1.7%'],
            ['Adj. EBITDA', '196.4', '208.3', '210.0', '-0.8%'],
            ['Diluted EPS', '0.84', '0.91', '0.88', '+3.4%'],
          ],
        },
        done: '4 of 4 cells updated, 12 citations',
        // the release page the stage three scene steps through: one line per
        // cell the model took from it, in the order the scene visits them
        cite: {
          source: 'Q3 FY26 release', where: 'p. 4', from: 8, reviewed: 3, total: 12,
          lines: [
            { row: 0, cell: 'C8', before: 'Third quarter ', mark: 'net revenue of $1,284.6m', after: ', up 8.5% on the prior year. ' },
            { row: 1, cell: 'C9', before: '', mark: 'Gross profit of $512.5m', after: ' represented a gross margin of 39.9%, against 39.7% a year earlier. ' },
            { row: 2, cell: 'C10', before: '', mark: 'Adjusted EBITDA was $208.3m', after: ', compared with $196.4m in the prior year quarter. ' },
            { row: 3, cell: 'C11', before: '', mark: 'Diluted earnings per share of $0.91', after: ', up from $0.84' },
          ],
        },
      },
      // the nine pillars as approved in the page outline, word for word
      steps: [
        { key: 'workflows', visual: 'workflows', ms: 4800, title: 'Runs your research workflows', body: 'Idea generation, getting up to speed, models and diligence, and monitoring and updates, all from one agent' },
        { key: 'surfaces', visual: 'surfaces', ms: 4200, title: 'Works in Excel and on the web', body: 'Use it as an Excel add-in inside your existing models, or in the web app for research and memos' },
        { key: 'cited', visual: 'cited', ms: 4200, title: 'Every output cited', body: 'Each number and claim links to the exact line in the filing, release, transcript or your own documents' },
        { key: 'format', visual: 'format', ms: 4200, title: 'Your house format', body: 'Models, comps and memos built in your templates, the way your fund already works' },
        { key: 'skills', visual: 'skills', ms: 4200, title: 'Skills for repeat workflows', body: 'Teach FinSynth your earnings update or comps routine once, then run it on every name in your book' },
        { key: 'dataroom', visual: 'dataroom', ms: 4200, title: 'Dataroom', body: 'Keep broker notes, expert call transcripts and internal research in folders, and attach them to any session' },
        { key: 'mcp', visual: 'sources', ms: 5000, title: 'MCP connectors', body: 'Connect FinSynth to your own data and tools, like Snowflake and Microsoft 365' },
        { key: 'review', visual: 'trace', ms: 9000, title: 'Review citations', body: 'Select a range of cells and step through the source of every number in one pass' },
        { key: 'enterprise', visual: 'enterprise', ms: 4200, title: 'Enterprise ready', body: 'Customer-hosted deployment and SOC 2 Type II certified, built for how funds handle sensitive research' },
      ],
    },
    // the page's own quote, shown in the home page's Customers treatment
    quote: {
      // the band's title names who is speaking; the home page's default line
      // ("the analysts") is not this page's copy
      title: 'Hear what portfolio managers have to say',
      text: '“We’re seeing the actual leverage of an AI tool, the outputs aren’t just good-looking, they’re easily verifiable.”',
      who: 'L/S Portfolio Manager',
    },
    faqHead: { eyebrow: 'FAQ', title: 'Questions hedge fund teams ask' },
    faqs: [
      { q: 'What is FinSynth?', a: 'FinSynth is auditable AI research infrastructure, purpose-built for hedge fund research teams. Its AI agent runs complex institutional-grade workflows like idea generation, model builds, comps and earnings updates, tracing every output back to its source. It works as an Excel add-in and as a web app.' },
      { q: 'How do hedge funds use FinSynth?', a: 'Hedge fund teams use FinSynth across the life of an idea: generating ideas, getting up to speed on new names, building models and doing diligence, and monitoring positions through earnings, along with hundreds of other research workflows.' },
      { q: 'Does FinSynth work for credit funds?', a: 'Yes. Credit teams use FinSynth to build and audit issuer models, reconcile historicals to the filings, benchmark against peers and test a thesis against filings and transcripts, with every figure cited.' },
      { q: 'How do multi-strategy platforms use FinSynth?', a: "Mostly to get up to speed on new names and inherited models quickly, run earnings updates across a large book, and use Skills to keep every analyst's output in the platform's house format." },
      { q: 'Is FinSynth useful for event-driven strategies?', a: "Yes. Before a catalyst, ask FinSynth to test your thesis against filings and transcripts, or to show how management's story on a topic has shifted across recent calls, with every claim traced to its source." },
      { q: 'Does FinSynth work inside Excel?', a: 'Yes. FinSynth runs as an Excel add-in inside your existing models, and as a web app for research and memos.' },
      { q: 'Can FinSynth use our own research?', a: 'Yes. Keep broker notes, expert call transcripts and internal documents in the Dataroom and attach them to any session. FinSynth can also connect to your own data and tools through MCP.' },
      { q: 'Does it work with our model templates?', a: 'Yes. FinSynth builds models, comps and memos in your own templates, and Skills let you save a routine once and run it again on any name.' },
      { q: 'What markets does FinSynth cover?', a: 'FinSynth covers filings, transcripts, reports, presentations and investor relations material for companies globally.' },
    ],
  },
}

export const solutionHref = (slug) => `/solutions/${slug}`
