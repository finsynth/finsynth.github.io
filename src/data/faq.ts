export interface FaqItem {
  q: string
  a: string
}

export const FAQS: FaqItem[] = [
  {
    q: 'What can FinSynth do?',
    a: 'FinSynth can run any research work investment teams do every day, across public and private markets: screening for ideas, getting up to speed on new companies, building models and comps, working through datarooms, drafting investment memos and updating on earnings, plus hundreds of other workflows. Every output is traced back to its source.',
  },
  {
    q: 'How do I get access, and what does it cost?',
    a: 'Sign-up with your email and get started for free. Upgrade to pro for more capabilities and higher credits. Talk to us to get your team on FinSynth with enterprise capabilities.',
  },
  {
    q: 'How do I know FinSynth’s outputs are accurate?',
    a: 'Every number and claim links to the exact line in its source, whether that’s a filing, a release, a transcript or your own documents.',
  },
  {
    q: 'Will it stay consistent with our conventions?',
    a: 'Yes. It detects your existing formatting and conventions and matches it. You can also save skills to perform specific, repeatable tasks with consistent results.',
  },
  {
    q: 'What data does FinSynth cover?',
    a: 'FinSynth covers filings, transcripts, reports, presentations and investor relations material for companies globally out of the box. You can add your own documents, such as broker notes, transcripts and deal datarooms, and connect your data providers and tools through MCP.',
  },
  {
    q: 'How is FinSynth different from a general AI assistant?',
    a: 'FinSynth is purpose-built and fine-tuned for investment research and workflows. Workflow depth, domain integrations, and auditability are much stronger for investment research use cases.',
  },
]
