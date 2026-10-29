/**
 * The per-desk solution pages (/solutions/<slug>). One entry per segment the
 * navbar's Solutions menu links to; a slug with no entry here falls back to
 * the home page. Copy only: the drawn product panels each `visual` names
 * live in pages/Solution.jsx. Five desks: hedge funds, asset managers, sell
 * side, family offices and private markets (the menu's Private Equity).
 */

// the nine pillars run in the same order on every page; only the wording
// changes by audience, so each page lists [title, body] pairs and this maps
// them onto the keys, visuals and timings HowStages expects
const PILLAR_SHAPE = [
  ['workflows', 'workflows', 4800],
  ['surfaces', 'surfaces', 4200],
  ['cited', 'cited', 4200],
  ['format', 'format', 4200],
  ['skills', 'skills', 4200],
  ['dataroom', 'dataroom', 4200],
  ['mcp', 'sources', 5000],
  ['review', 'trace', 9000],
  ['enterprise', 'enterprise', 4200],
];
const howSteps = (pillars) => pillars.map(([title, body], i) => {
  const [key, visual, ms] = PILLAR_SHAPE[i];
  return { key, visual, ms, title, body };
});

// the worked example the three-stage layouts run (Crocs Q3 FY26 actuals into
// a model): shared by every page, each renaming the file and the folder the
// desk would actually keep. The sheet and the cited release lines stay as
// they are, since the numbers are Crocs' either way
const CROCS_EXAMPLE = {
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
  cite: {
    source: 'Q3 FY26 release', where: 'p. 4', from: 8, reviewed: 3, total: 12,
    lines: [
      { row: 0, cell: 'C8', before: 'Third quarter ', mark: 'net revenue of $1,284.6m', after: ', up 8.5% on the prior year. ' },
      { row: 1, cell: 'C9', before: '', mark: 'Gross profit of $512.5m', after: ' represented a gross margin of 39.9%, against 39.7% a year earlier. ' },
      { row: 2, cell: 'C10', before: '', mark: 'Adjusted EBITDA was $208.3m', after: ', compared with $196.4m in the prior year quarter. ' },
      { row: 3, cell: 'C11', before: '', mark: 'Diluted earnings per share of $0.91', after: ', up from $0.84' },
    ],
  },
};
// the example with the desk's own file name and folder swapped in
const exampleFor = ({ file, kind = 'Your template', folder = 'Broker notes', instruction, skill }) => ({
  ...CROCS_EXAMPLE,
  file,
  instruction: instruction || CROCS_EXAMPLE.instruction,
  skill: skill || CROCS_EXAMPLE.skill,
  sources: CROCS_EXAMPLE.sources.map((s) =>
    s.icon === 'sheet' ? { ...s, name: file, kind } : s.icon === 'folder' ? { ...s, name: folder } : s),
});
const howFor = (example, pillars) => ({
  title: 'Fast to draft. Faster to trust',
  eyebrow: 'How your team works with FinSynth',
  example,
  steps: howSteps(pillars),
});

/* the private deal the family offices and private markets desks work through
   on their drawn screens, under the codename a live deal would carry */
const TIDE_BUSINESS = { h: 'Business', p: 'Regional specialty retailer, 64 stores across the Southwest and 31% of sales online; founder-led, raising growth capital', src: 'CIM, p. 6' }
const TIDE_NUMBERS = { h: 'The numbers', kpis: [['Revenue FY25', '$212m'], ['Margin', '14.8%'], ['Leverage', '2.1x'], ['Growth, 3y', '+14%']] }
const TIDE_RISKS = { h: 'Key risks', p: 'Lease renewals on 19 stores fall in FY27; the two largest suppliers are 41% of purchases', src: 'CIM, p. 31' }
const TIDE_ROOM = [['CIM', 'Deck'], ['Mgmt accounts', 'Excel'], ['QoE report', 'PDF'], ['Loan agreement', 'PDF'], ['Lease schedule', 'Excel']]
/* the dataroom read as a thesis test: two findings that hold and the risk to
   raise, each with the line in the room it came from */
const TIDE_POINTS = [
  {
    tag: 'Supported', text: 'Revenue up 14% a year since FY23', src: 'Mgmt accounts',
    doc: 'Mgmt accounts', where: 'p. 4',
    before: 'Net sales of $212.4m in FY25, ', mark: 'up 14.2% on FY24', after: ', with like-for-like growth of 6% and eight new stores.',
  },
  {
    tag: 'Supported', text: 'Margin held through the DC build', src: 'QoE report',
    doc: 'QoE report', where: 'p. 11',
    before: 'Adjusted EBITDA margin was 14.8%, ', mark: 'broadly flat on the prior year', after: ' after $3.1m of one-off distribution centre costs.',
  },
  {
    tag: 'Risk to raise', text: 'Change of control resets the revolver', src: 'Loan agreement', counter: true,
    doc: 'Loan agreement', where: '§7.2',
    before: 'Upon a Change of Control, ', mark: 'all outstanding amounts shall become immediately due and payable', after: ' unless waived by the Required Lenders.',
  },
]

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
    // the use case's number, its name as the row's title, the outcome it
    // delivers as the line under it, then its paragraph. The paragraph is
    // split into scenes: each one names the screen that shows that part,
    // and the stage plays the screens in turn while the copy lights the
    // part being shown. The key is the row's anchor so the block can later
    // lift into its own page
    workflows: [
      {
        key: 'idea-generation',
        num: '01',
        name: 'Screening and idea generation',
        outcome: 'Surface your next idea from the whole universe',
        scenes: [
          { visual: 'screen', copy: 'Ask FinSynth to screen a universe on the numbers and the narrative, from margin inflections to guidance changes to what management said on the last call, as specific as you like,' },
          { visual: 'screen', props: { cite: true }, copy: 'and it returns a shortlist with every data point sourced. Each name is ready to take further.' },
        ],
      },
      {
        key: 'get-up-to-speed',
        num: '02',
        name: 'Get up to speed',
        outcome: 'Form a view on a new name in an afternoon',
        scenes: [
          { visual: 'overview', copy: 'Point FinSynth at a company, sector or market, along with your own broker notes and expert calls, and it maps the business, its segments, key metrics and what management has been saying, each point linked to its source.' },
          { visual: 'audit', copy: 'Taking over a name? It audits the inherited model for hardcodes, broken references and inconsistent formulas too.' },
        ],
      },
      {
        key: 'models-diligence',
        num: '03',
        name: 'Models and diligence',
        outcome: 'Model, value and pressure-test a name in your own template',
        scenes: [
          { visual: 'modelbuild', copy: 'Ask FinSynth to build the model and DCF from the filings,' },
          { visual: 'comps', copy: 'set comps against the peer set' },
          { visual: 'thesis', copy: 'and build the strongest case against your thesis, each figure and claim linked to its source.' },
          { visual: 'modelbuild', copy: 'Every historical lines up with the filings before you start forecasting.' },
        ],
      },
      {
        key: 'monitoring-updates',
        num: '04',
        name: 'Monitoring and updates',
        outcome: 'Stay on top of every name in your book',
        scenes: [
          { visual: 'earnings', copy: 'When a name reports, ask FinSynth to update your model and flag where each line item beat or missed consensus, each figure linked to the exact line in the release.' },
          { visual: 'thesis', props: { ask: 'Does my thesis still hold after Q3?', say: 'Checked against everything reported and said since. Two points hold, one has a strong counter' }, copy: 'Then ask whether your thesis still holds, and it checks it against everything reported and said since.' },
        ],
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
      example: CROCS_EXAMPLE,
      // the nine pillars as approved in the page outline, word for word
      steps: [
        { key: 'workflows', visual: 'workflows', ms: 4800, title: 'Runs your research workflows', body: 'Screening and idea generation, getting up to speed, models and diligence, and monitoring and updates, all from one agent' },
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
  // The four other desks, copy from the same approved outline canvas. The
  // shape is hedge funds': five use cases here instead of four, the nine
  // pillars through howFor, and the Crocs worked example renamed to the
  // desk's own file. Sell Side and Family Offices carry placeholder quotes
  // (see the note on each) until a real pilot quote replaces them.
  'asset-managers': {
    name: 'Asset Managers',
    title: 'Take your research from draft to decision',
    lede:
      'FinSynth is auditable AI research infrastructure, purpose-built for asset management research teams. Its AI agent runs complex institutional-grade workflows like idea generation, model builds, investment memos and holding reviews, tracing every output back to its source.',
    strategiesLead: 'Built to work across investment styles',
    strategies: ['Value', 'Growth', 'Quality', 'Income', 'Core'],
    useCasesHead: { eyebrow: 'Use cases', title: 'Where FinSynth fits into asset management research' },
    workflows: [
      {
        key: 'idea-generation',
        num: '01',
        name: 'Screening and idea generation',
        outcome: 'Surface your next idea from the whole universe',
        scenes: [
          { visual: 'screen', copy: 'Ask FinSynth to screen your investment universe on the numbers and the narrative, from margin trends to guidance changes to what management said on the last call,' },
          { visual: 'screen', props: { cite: true }, copy: 'and it returns a shortlist with every data point sourced. Each name is ready to take further.' },
        ],
      },
      {
        key: 'get-up-to-speed',
        num: '02',
        name: 'Get up to speed',
        outcome: 'Form a view on a new name in an afternoon',
        scenes: [
          { visual: 'overview', copy: 'Point FinSynth at a company, sector or market and it maps the business, its segments, key metrics and what management has been saying, each point linked to its source. Add your own broker notes and expert calls from the Dataroom and it works across those too.' },
        ],
      },
      {
        key: 'models-valuation',
        num: '03',
        name: 'Models and valuation',
        outcome: 'Skip the spreading and start at the forecasts',
        scenes: [
          { visual: 'comps', copy: 'Ask FinSynth to build the model and DCF in your template and set comps against the peer set, each historical and multiple linked to where it was reported.' },
          { visual: 'modelbuild', copy: 'It handles segment recasts and restatements, so the history lines up before you start forecasting.' },
        ],
      },
      {
        key: 'investment-memos',
        num: '04',
        name: 'Investment memos',
        outcome: 'From research to a committee-ready memo',
        scenes: [
          {
            visual: 'memo',
            props: { title: 'Crocs · IC memo', tag: 'Committee format', status: ['Drafting the memo', 'Ready for committee'] },
            copy: 'Ask FinSynth to draft a memo in your committee’s format and it brings together the thesis, valuation, risks and supporting data from your research, each claim linked to its source.',
          },
        ],
      },
      {
        key: 'monitoring-reviews',
        num: '05',
        name: 'Monitoring and holding reviews',
        outcome: 'Know whether the original thesis still holds',
        scenes: [
          { visual: 'earnings', copy: 'When holdings report, ask FinSynth to update your models and flag where results beat or missed consensus, each figure linked to the release.' },
          { visual: 'thesis', props: { ask: 'Does the thesis we bought Crocs on still hold?', say: 'Checked against everything reported and said since. Two points hold, one has a strong counter' }, copy: 'Ask it to review a position and it checks the thesis you bought it on against everything reported and said since.' },
        ],
      },
    ],
    useCasesMore: { lead: '+ Hundreds more', rest: 'research workflows, all in one agent' },
    how: howFor(exampleFor({ file: 'Fund_model_v12.xlsx' }), [
      ['Runs your research workflows', 'Screening and idea generation, getting up to speed, models and valuation, investment memos and holding reviews, all from one agent'],
      ['Works in Excel and on the web', 'Use it as an Excel add-in inside your existing models, or in the web app for research and memos'],
      ['Every output cited', 'Each number and claim links to the exact line in the filing, release, transcript or your own documents'],
      ['Your house format', 'Models, comps and memos built in your templates, the way your firm already works'],
      ['Skills for repeat workflows', 'Teach FinSynth your earnings update or comps routine once, then run it across every holding'],
      ['Dataroom', 'Keep broker notes, expert call transcripts and internal research in folders, and attach them to any session'],
      ['MCP connectors', 'Connect FinSynth to your own data and tools, like Snowflake and Microsoft 365'],
      ['Review citations', 'Select a range of cells and step through the source of every number in one pass'],
      ['Enterprise ready', 'Customer-hosted deployment and SOC 2 Type II certified, built for how firms handle sensitive research'],
    ]),
    quote: {
      title: 'Hear what analysts have to say',
      text: '“It cut my model build time by 80%. What used to be two days of pulling numbers and building, I get through in an afternoon now.”',
      who: 'Long Only Analyst',
    },
    faqHead: { eyebrow: 'FAQ', title: 'Questions asset management teams ask' },
    faqs: [
      { q: 'What is FinSynth?', a: 'FinSynth is auditable AI research infrastructure, purpose-built for asset management research teams. Its AI agent runs complex institutional-grade workflows like idea generation, model builds, investment memos and holding reviews, tracing every output back to its source. It works as an Excel add-in and as a web app.' },
      { q: 'How do asset managers use FinSynth?', a: 'Asset management teams use FinSynth across the investment process: generating ideas, getting up to speed on new names, building models and valuations, drafting investment memos and monitoring holdings, along with hundreds of other research workflows.' },
      { q: 'Does FinSynth work for credit and fixed income teams?', a: 'Yes. Credit teams use FinSynth for issuer research, model builds, peer benchmarking and working through filings and transcripts, with every figure cited.' },
      { q: 'Can FinSynth draft investment committee memos?', a: 'Yes. FinSynth drafts memos in your committee’s format, bringing together the thesis, valuation, risks and supporting data, with every claim linked to its source.' },
      { q: 'Can FinSynth help review existing holdings?', a: 'Yes. Give FinSynth a position and the thesis you bought it on, and it checks each point against the results, guidance and management commentary reported since.' },
      { q: 'Does FinSynth work inside Excel?', a: 'Yes. FinSynth runs as an Excel add-in inside your existing models, and as a web app for research and memos.' },
      { q: 'Can FinSynth use our own research?', a: 'Yes. Keep broker notes, expert call transcripts and internal documents in the Dataroom and attach them to any session. FinSynth can also connect to your own data and tools through MCP.' },
      { q: 'Does it work with our model templates?', a: 'Yes. FinSynth builds models, comps and memos in your own templates, and Skills let you save a routine once and run it again on any name.' },
      { q: 'What markets does FinSynth cover?', a: 'FinSynth covers filings, transcripts, reports, presentations and investor relations material for companies globally.' },
    ],
  },

  'sell-side': {
    name: 'Sell Side',
    title: 'Take your research from draft to published note',
    lede:
      'FinSynth is auditable AI research infrastructure, purpose-built for sell-side research teams. Its AI agent runs complex institutional-grade workflows like initiations, model builds, earnings notes and thematic reports, tracing every output back to its source.',
    strategiesLead: 'Built for research teams at',
    strategies: ['Investment banks', 'Brokerages', 'Independent research', 'Research service providers'],
    useCasesHead: { eyebrow: 'Use cases', title: 'Where FinSynth fits into sell-side research' },
    workflows: [
      {
        key: 'initiations',
        num: '01',
        name: 'Initiations',
        outcome: 'Initiate on a new name in days, not weeks',
        scenes: [
          {
            visual: 'overview',
            props: {
              title: 'Crocs · initiation', tag: 'Groundwork',
              sections: [
                { h: 'Business', p: 'Casual footwear in two brands, Crocs (79% of revenue) and HEYDUDE (21%), sold wholesale and through its own stores and sites', src: 'FY25 10-K, p. 41' },
                { h: 'Segment history', kpis: [['Crocs, 3y', '+9%'], ['HEYDUDE, 3y', '-4%'], ['DTC share', '51%'], ['Op. margin', '25.1%']] },
                { h: 'Key debates', p: 'Whether HEYDUDE wholesale has found a floor; management says the reset is done, with wholesale orders flat in Q3', src: 'Q3 FY26 call, p. 5' },
              ],
              head: ['Sources read', '22 / 22'],
              sources: [['Three 10-Ks', 'Filing'], ['Eight calls', 'Transcript'], ['Past notes', 'Dataroom'], ['Consensus', 'Snowflake']],
            },
            copy: 'Point FinSynth at a company and it pulls together the groundwork for an initiation: the business, its segment history, the key debates and what management has been saying, each point linked to its source. You bring the view and the call.',
          },
        ],
      },
      {
        key: 'models-valuation',
        num: '02',
        name: 'Models and valuation',
        outcome: 'Build, extend and roll forward every coverage model',
        scenes: [
          { visual: 'comps', copy: 'Ask FinSynth to build a model and DCF in your house template and set comps against the peer set, each figure linked to where it was reported.' },
          { visual: 'modelbuild', copy: 'Rolling a model forward or adding a new segment works the same way.' },
        ],
      },
      {
        key: 'earnings-notes',
        num: '03',
        name: 'Earnings notes',
        outcome: 'From preview to published note, every results season',
        scenes: [
          {
            visual: 'memo',
            props: {
              title: 'Crocs · Q3 FY26 note', tag: 'House format',
              sections: [
                { h: 'Headline', p: 'Revenue of $1,284.6m, up 8.5% and 2% ahead of consensus; adjusted EPS of $0.91 against $0.87 expected', src: 'Q3 FY26 release, p. 1' },
                { h: 'Estimates', p: 'FY26 EPS to $3.62 from $3.55 on the Q3 beat and a stronger gross margin; FY27 unchanged', src: 'CROX_coverage_model.xlsx' },
                { h: 'What changed', p: 'Promotional intensity rising in core categories; HEYDUDE wholesale still shrinking', src: 'Q3 FY26 call, p. 7' },
                { h: 'Rating', p: 'Buy, price target $140, unchanged; the margin story holds against peers', src: 'House view' },
              ],
              sources: [['Coverage model', 'Model'], ['Q3 release', 'Filing'], ['Q3 call', 'Transcript'], ['Consensus', 'Snowflake'], ['Past notes', 'Dataroom']],
              status: ['Drafting the note', 'Note ready for review'],
            },
            copy: 'Ask FinSynth for the preview before the print, then to update your coverage model and draft the earnings note in your house format, each figure linked to the exact line in the release.',
          },
          { visual: 'earnings', copy: 'It also flags where results beat or missed consensus and where your estimates may need revising.' },
        ],
      },
      {
        key: 'thematic-reports',
        num: '04',
        name: 'Thematic and sector reports',
        outcome: 'Pull a sector-wide view together in days',
        scenes: [
          {
            visual: 'screen',
            props: { title: 'US footwear · sector view', tag: 'Q3 FY26', criteria: ['Three years of data', 'Guidance', 'Commentary'], head: 'In scope', status: ['Working across the sector', 'Sector view ready'], prompt: null },
            copy: 'Give FinSynth a theme or a sector and it works across every company in scope, bringing the data, disclosures and management commentary into one view, each point linked to its source.',
          },
          {
            visual: 'screen',
            props: { cite: true, title: 'US footwear · sector view', tag: 'Q3 FY26', prompt: null },
            copy: 'Comparisons that used to take weeks of reading come together in one session.',
          },
        ],
      },
      {
        key: 'client-requests',
        num: '05',
        name: 'Client requests',
        outcome: 'Answer the client’s question the same afternoon',
        scenes: [
          { visual: 'thesis', props: { ask: 'A client asks: does the Crocs margin story hold up against peers?', say: 'Pulled from the filings, transcripts and your coverage model. Two points hold, one has a strong counter' }, copy: 'When a client asks for a data cut, a peer comparison or a view on a specific issue, ask FinSynth and it pulls the answer together from filings, transcripts and your own models, with every number sourced. Fast, accurate answers are what win votes.' },
        ],
      },
    ],
    useCasesMore: { lead: '+ Hundreds more', rest: 'research workflows, all in one agent' },
    how: howFor(exampleFor({ file: 'CROX_coverage_model.xlsx', kind: 'House template', folder: 'Past notes', instruction: 'Update the Crocs coverage model for Q3 actuals and flag anything off consensus' }), [
      ['Runs your research workflows', 'Initiations, models and valuation, earnings notes, thematic reports and client requests, all from one agent'],
      ['Works in Excel and on the web', 'Use it as an Excel add-in inside your coverage models, or in the web app for research and notes'],
      ['Every output cited', 'Each number and claim links to the exact line in the filing, release, transcript or your own documents'],
      ['Your house format', 'Models, comps and notes built in your house templates, the way your desk already works'],
      ['Skills for repeat workflows', 'Teach FinSynth your earnings note or comps routine once, then run it on every name you cover'],
      ['Dataroom', 'Keep company presentations, management meeting notes, industry reports and your past notes in folders, and attach them to any session'],
      ['MCP connectors', 'Connect FinSynth to your own data and tools, like Snowflake and Microsoft 365'],
      ['Review citations', 'Before a note goes out, select any range and step through the source of every number in one pass'],
      ['Enterprise ready', 'Customer-hosted deployment and SOC 2 Type II certified, built for how firms handle sensitive research'],
    ]),
    // PLACEHOLDER per the outline canvas: a dummy quote for layout only.
    // Replace with a real sell-side pilot quote before this page goes live.
    quote: {
      title: 'Hear what research analysts have to say',
      text: '“Results season used to mean late nights rebuilding the model and checking every number twice. Now the note is drafted, sourced and ready for review before the morning meeting.”',
      who: 'Equity Research Analyst',
    },
    faqHead: { eyebrow: 'FAQ', title: 'Questions sell-side research teams ask' },
    faqs: [
      { q: 'What is FinSynth?', a: 'FinSynth is auditable AI research infrastructure, purpose-built for sell-side research teams. Its AI agent runs complex institutional-grade workflows like initiations, model builds, earnings notes and thematic reports, tracing every output back to its source. It works as an Excel add-in and as a web app.' },
      { q: 'How do sell-side research teams use FinSynth?', a: 'Sell-side teams use FinSynth across the coverage cycle: initiating on new names, building and maintaining models, publishing earnings notes, writing thematic and sector reports and answering client requests, along with hundreds of other research workflows.' },
      { q: 'Can FinSynth draft notes in our house format?', a: 'Yes. FinSynth drafts earnings notes, initiations and reports in your house template, with every figure and claim linked to its source.' },
      { q: 'Can FinSynth help check a note before it is published?', a: 'Yes. Review citations lets you select any range and step through the source of every number in one pass, so a note can be checked before it goes out.' },
      { q: 'Does FinSynth work for research service providers?', a: 'Yes. Outsourced research teams use FinSynth for model builds, earnings updates, comps and report support across many clients, each in that client’s own template.' },
      { q: 'Does FinSynth work inside Excel?', a: 'Yes. FinSynth runs as an Excel add-in inside your coverage models, and as a web app for research and notes.' },
      { q: 'Can FinSynth use our own research?', a: 'Yes. Keep company presentations, management meeting notes, industry reports and your past notes in the Dataroom and attach them to any session. FinSynth can also connect to your own data and tools through MCP.' },
      { q: 'Does it work with our model templates?', a: 'Yes. FinSynth builds and updates coverage models and comps in your own templates, and Skills let you save a routine once and run it on every name you cover.' },
      { q: 'What markets does FinSynth cover?', a: 'FinSynth covers filings, transcripts, reports, presentations and investor relations material for companies globally.' },
    ],
  },

  'family-offices': {
    name: 'Family Offices',
    title: 'Take your research from draft to decision',
    lede:
      'FinSynth is auditable AI research infrastructure, purpose-built for family office investment teams. Its AI agent runs complex institutional-grade workflows like company research, private deal reviews, valuation and investment memos, tracing every output back to its source.',
    strategiesLead: 'Built to work across the portfolio',
    strategies: ['Public equities', 'Direct deals', 'Co-investments'],
    useCasesHead: { eyebrow: 'Use cases', title: 'Where FinSynth fits into family office research' },
    workflows: [
      {
        key: 'get-up-to-speed',
        num: '01',
        name: 'Get up to speed',
        outcome: 'Form a view on a new name in an afternoon',
        scenes: [
          { visual: 'overview', copy: 'Point FinSynth at a company, sector or market and it maps the business, its segments, key metrics and what management has been saying, each point linked to its source. Add your own broker notes and expert calls from the Dataroom and it works across those too.' },
        ],
      },
      {
        key: 'diligence',
        num: '02',
        name: 'Diligence',
        outcome: 'Test public ideas and work through private deals',
        scenes: [
          { visual: 'thesis', copy: 'Give FinSynth your thesis on a listed name and it tests each point against filings and transcripts, then builds the strongest case against it.' },
          {
            visual: 'overview',
            props: { title: 'Project Tide · deal summary', tag: 'From the Dataroom', sections: [TIDE_BUSINESS, TIDE_NUMBERS, TIDE_RISKS], head: ['Dataroom read', '9 / 9'], sources: TIDE_ROOM },
            copy: 'For a direct deal or co-investment, add the documents to the Dataroom and it summarises the business, the numbers and the key risks, each point linked to the page it came from.',
          },
        ],
      },
      {
        key: 'valuation',
        num: '03',
        name: 'Valuation',
        outcome: 'Value public holdings and private deals against listed peers',
        scenes: [
          { visual: 'comps', copy: 'Ask FinSynth to build comps against the peer set or a model in your template, calendarising and normalising metrics across different fiscal years and reporting formats.' },
          { visual: 'modelbuild', copy: 'Use it to value a listed holding or price a private deal, with every input traced to its source.' },
        ],
      },
      {
        key: 'investment-memos',
        num: '04',
        name: 'Investment memos',
        outcome: 'From research to a decision-ready memo',
        scenes: [
          {
            visual: 'memo',
            props: {
              sections: [
                { h: 'Thesis', p: 'Own channels pass half of the mix by FY27 and gross margin crosses 41%, two points ahead of the Street', src: 'Q3 FY26 call' },
                { h: 'Valuation', p: 'DCF value of $144.80 a share against $118.70 today, 22% upside; trades below the peer set on NTM EV/EBITDA', src: 'Portfolio_model_v4.xlsx' },
                { h: 'Risks', p: 'Promotional intensity rising in core categories; HEYDUDE wholesale still shrinking', src: 'Q3 FY26 10-Q, p. 18' },
                { h: 'Recommendation', p: 'Buy, 2% of the portfolio, $140 target; revisit after the Q4 print', src: 'Your notes' },
              ],
              sources: [['Portfolio model', 'Model'], ['FY25 10-K', 'Filing'], ['Q3 FY26 10-Q', 'Filing'], ['Q3 call', 'Transcript'], ['Broker notes', 'Dataroom']],
              status: ['Drafting the memo', 'Ready for the principals'],
            },
            copy: 'Ask FinSynth to draft a memo for your principals or investment committee and it brings together the thesis, valuation, risks and supporting data from your research, each claim linked to its source.',
          },
        ],
      },
      {
        key: 'monitoring-updates',
        num: '05',
        name: 'Monitoring and updates',
        outcome: 'Every holding’s results in your model, the day they land',
        scenes: [
          { visual: 'earnings', copy: 'When a holding reports, ask FinSynth to update your model and flag where results beat or missed consensus, each figure linked to the release.' },
          { visual: 'thesis', props: { ask: 'Does the original thesis on Crocs still hold?', say: 'Checked against everything reported since. Two points hold, one has a strong counter' }, copy: 'Ask whether the original thesis still holds and it checks it against everything reported since.' },
        ],
      },
    ],
    useCasesMore: { lead: '+ Hundreds more', rest: 'research workflows, all in one agent' },
    how: howFor(exampleFor({ file: 'Portfolio_model_v4.xlsx' }), [
      ['Runs your research workflows', 'Company research, diligence on public and private deals, valuation, investment memos and monitoring, all from one agent'],
      ['Works in Excel and on the web', 'Use it as an Excel add-in inside your existing models, or in the web app for research and memos'],
      ['Every output cited', 'Each number and claim links to the exact line in the filing, release, transcript or your own documents'],
      ['Your house format', 'Models, comps and memos built in your templates, the way your office already works'],
      ['Skills for repeat workflows', 'Teach FinSynth your memo or deal review routine once, then run it on every new opportunity'],
      ['Dataroom', 'Keep deal documents, broker notes, expert call transcripts and internal research in folders, and attach them to any session'],
      ['MCP connectors', 'Connect FinSynth to your own data and tools, like Snowflake and Microsoft 365'],
      ['Review citations', 'Select a range of cells and step through the source of every number in one pass'],
      ['Enterprise ready', 'Customer-hosted deployment and SOC 2 Type II certified, built for how family offices handle sensitive information'],
    ]),
    // PLACEHOLDER per the outline canvas: a dummy quote for layout only.
    // Replace with a real family office pilot quote before this page goes live.
    quote: {
      title: 'Hear what investment teams have to say',
      text: '“We’re a small team covering public names and private deals at the same time. Now we can go deeper on both, and every number holds up when the principals ask where it came from.”',
      who: 'Family Office Investment Director',
    },
    faqHead: { eyebrow: 'FAQ', title: 'Questions family office teams ask' },
    faqs: [
      { q: 'What is FinSynth?', a: 'FinSynth is auditable AI research infrastructure, purpose-built for family office investment teams. Its AI agent runs complex institutional-grade workflows like company research, private deal reviews, valuation and investment memos, tracing every output back to its source. It works as an Excel add-in and as a web app.' },
      { q: 'How do family offices use FinSynth?', a: 'Family office teams use FinSynth across the investment process: researching new names, doing diligence on public ideas and private deals, valuing them, drafting memos for principals and monitoring holdings, along with hundreds of other research workflows.' },
      { q: 'Can FinSynth help review direct deals and co-investments?', a: 'Yes. Add the deal documents to the Dataroom and FinSynth summarises the business, the numbers and the key risks, each point linked to the page it came from.' },
      { q: 'Is FinSynth suitable for a small investment team?', a: 'Yes. FinSynth runs the research workflows a larger team would, so a small team can cover more companies and deals, with every output cited.' },
      { q: 'Can FinSynth draft memos for our principals?', a: 'Yes. FinSynth drafts memos for your principals or investment committee in your own format, bringing together the thesis, valuation and risks, with every claim linked to its source.' },
      { q: 'Does FinSynth work inside Excel?', a: 'Yes. FinSynth runs as an Excel add-in inside your existing models, and as a web app for research and memos.' },
      { q: 'Can FinSynth use our own research?', a: 'Yes. Keep broker notes, expert call transcripts and internal documents in the Dataroom and attach them to any session. FinSynth can also connect to your own data and tools through MCP.' },
      { q: 'Does it work with our model templates?', a: 'Yes. FinSynth builds models, comps and memos in your own templates, and Skills let you save a routine once and run it again on any name.' },
      { q: 'What markets does FinSynth cover?', a: 'FinSynth covers filings, transcripts, reports, presentations and investor relations material for companies globally.' },
    ],
  },

  // the Private Equity entry in the navbar's menu: the page covers buyout,
  // growth equity and private credit, so its slug and name are broader
  'private-markets': {
    name: 'Private Markets',
    title: 'Take your diligence from dataroom to IC memo',
    lede:
      'FinSynth is auditable AI research infrastructure, purpose-built for private markets investment teams. Its AI agent runs complex institutional-grade workflows like deal screening, due diligence, financial spreading and IC memos, on public information and your own documents, tracing every output back to its source.',
    strategiesLead: 'Built to work across strategies',
    strategies: ['Buyout', 'Growth equity', 'Private credit'],
    useCasesHead: { eyebrow: 'Use cases', title: 'Where FinSynth fits into the deal process' },
    // the drawn screens are the public-company set (Crocs); a private deal's
    // CIM pages and dataroom are a visual still to draw
    workflows: [
      {
        key: 'deal-screening',
        num: '01',
        name: 'Deal screening',
        outcome: 'A first read on every deal that lands',
        scenes: [
          {
            visual: 'overview',
            props: {
              title: 'Project Tide · first read', tag: 'From the CIM',
              sections: [
                TIDE_BUSINESS, TIDE_NUMBERS,
                { h: 'Questions worth asking', p: 'Why online margin trails the stores by six points, and whether the FY26 plan assumes the new distribution centre is live', src: 'CIM, p. 23' },
              ],
              head: ['Sources read', '3 / 3'],
              sources: [['CIM', '48 pp'], ['Teaser', '2 pp'], ['Comps set', 'Model']],
            },
            copy: 'Add a CIM or teaser and ask FinSynth for a first read: the business, the numbers, the sector and the questions worth asking, each point linked to the page it came from. Decide quickly which deals deserve the team’s time.',
          },
        ],
      },
      {
        key: 'due-diligence',
        num: '02',
        name: 'Due diligence',
        outcome: 'Work through the full dataroom in hours, not weeks',
        scenes: [
          { visual: 'thesis', props: { ask: 'Work through the dataroom: what holds up, and what are the risks?', say: 'Read every document in the room. Two points hold, one risk to raise with the deal team', points: TIDE_POINTS }, copy: 'Add the full dataroom and ask FinSynth to work through every document, summarising the findings and risks with each one linked to its source. For credit deals, it pulls the key terms and covenants from the credit documents too.' },
        ],
      },
      {
        key: 'spreading-valuation',
        num: '03',
        name: 'Spreading and valuation',
        outcome: 'Every period spread, modelled and benchmarked',
        scenes: [
          { visual: 'modelbuild', copy: 'Ask FinSynth to spread the financials from CIMs, management accounts, scans and messy PDFs into your template,' },
          { visual: 'comps', copy: 'then build the model and benchmark the deal against public comps and market spreads from your data providers, with every figure sourced.' },
        ],
      },
      {
        key: 'credit-ic-memos',
        num: '04',
        name: 'Credit and IC memos',
        outcome: 'Drafted in your template, ready for committee',
        scenes: [
          {
            visual: 'memo',
            props: {
              title: 'Project Tide · IC memo', tag: 'Your template',
              sections: [
                { h: 'Investment case', p: 'A founder-led regional retailer with room to double the store base; growth capital at 7.2x EBITDA against public comps at 9.6x', src: 'Comps_set_v3.xlsx' },
                { h: 'Financials', p: 'Revenue of $212m growing 14% a year, EBITDA margin of 14.8% and net debt at 2.1x', src: 'QoE report, p. 11' },
                { h: 'Risks', p: 'Lease renewals on 19 stores fall in FY27; the two largest suppliers are 41% of purchases', src: 'CIM, p. 31' },
                { h: 'Diligence findings', p: 'Change of control resets the revolver; working capital normalises $2.4m below the CIM figure', src: 'Loan agreement, §7.2' },
              ],
              sources: TIDE_ROOM,
              status: ['Drafting the IC memo', 'Ready for committee'],
            },
            copy: 'Ask FinSynth to draft an IC or credit memo in your template and it brings together the investment case, financials, risks and diligence findings, each claim linked to its source.',
          },
        ],
      },
      {
        key: 'portfolio-monitoring',
        num: '05',
        name: 'Portfolio monitoring',
        outcome: 'Portfolio packs normalised, quarter on quarter',
        scenes: [
          { visual: 'earnings', copy: 'Add each quarter’s portfolio company packs and ask FinSynth to normalise the numbers, compare them with plan and prior quarters, and show what changed, each figure linked to the pack it came from.' },
        ],
      },
    ],
    useCasesMore: { lead: '+ Hundreds more', rest: 'research workflows, all in one agent' },
    how: howFor(exampleFor({ file: 'Comps_set_v3.xlsx', folder: 'Deal dataroom', instruction: 'Update the Crocs comp for Q3 actuals and flag anything off consensus', skill: 'Comp update' }), [
      ['Runs your research workflows', 'Deal screening, due diligence, spreading and valuation, credit and IC memos and portfolio monitoring, all from one agent'],
      ['Works in Excel and on the web', 'Use it as an Excel add-in inside your existing models, or in the web app for research and memos'],
      ['Every output cited', 'Each number and claim links to the exact page in the CIM, dataroom document, credit agreement or filing'],
      ['Your house format', 'Models, spreads and memos built in your templates, the way your team already works'],
      ['Skills for repeat workflows', 'Teach FinSynth your spreading or memo routine once, then run it on every deal'],
      ['Dataroom', 'Keep CIMs, deal datarooms, management accounts and credit documents in folders, and attach them to any session'],
      ['MCP connectors', 'Connect FinSynth to your data providers and tools, like Snowflake and Microsoft 365'],
      ['Review citations', 'Before a memo goes to IC, select any range and step through the source of every number in one pass'],
      ['Enterprise ready', 'Customer-hosted deployment and SOC 2 Type II certified, built for how investment teams handle confidential deal information'],
    ]),
    quote: {
      title: 'Hear what deal teams have to say',
      text: '“Our associates basically stopped doing tie-outs. Click a number in the IC memo and it opens the right page of the CIM.”',
      who: 'Private Equity Fund',
    },
    faqHead: { eyebrow: 'FAQ', title: 'Questions private markets teams ask' },
    faqs: [
      { q: 'What is FinSynth?', a: 'FinSynth is auditable AI research infrastructure, purpose-built for private markets investment teams. Its AI agent runs complex institutional-grade workflows like deal screening, due diligence, financial spreading and IC memos, on public information and your own documents, tracing every output back to its source. It works as an Excel add-in and as a web app.' },
      { q: 'How do private markets teams use FinSynth?', a: 'Private markets teams use FinSynth across the deal process: screening deals, running due diligence, spreading and valuing, drafting credit and IC memos and monitoring portfolio companies, along with hundreds of other research workflows.' },
      { q: 'Does FinSynth work on our own deal documents?', a: 'Yes. Add CIMs, datarooms, management accounts and credit documents to the Dataroom, including scans and messy PDFs, and FinSynth works across them with every finding linked to the page it came from.' },
      { q: 'Does FinSynth work for private credit?', a: 'Yes. Credit teams use FinSynth to spread borrower financials, pull terms and covenants from credit documents, benchmark against market spreads and draft credit memos, with every figure cited.' },
      { q: 'Can FinSynth use public information too?', a: 'Yes. FinSynth fetches filings, transcripts and investor materials for listed companies, so public comps and benchmarks sit alongside your deal documents.' },
      { q: 'Does FinSynth work inside Excel?', a: 'Yes. FinSynth runs as an Excel add-in inside your existing models, and as a web app for research and memos.' },
      { q: 'Can FinSynth connect to our data providers?', a: 'Yes. FinSynth connects to your own data providers and tools through MCP, so market data and internal systems can feed straight into its work.' },
      { q: 'Does it work with our templates?', a: 'Yes. FinSynth builds spreads, models and memos in your own templates, and Skills let you save a routine once and run it on every deal.' },
      { q: 'What public information does FinSynth cover?', a: 'FinSynth covers filings, transcripts, reports, presentations and investor relations material for listed companies globally.' },
    ],
  },
}

export const solutionHref = (slug) => `/solutions/${slug}`
