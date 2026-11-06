export interface Product {
  key: string
  label: string
  href?: string
  desc?: string
  soon?: boolean
}

export const PRODUCTS: Product[] = [
  {
    key: 'excel',
    label: 'FinSynth for Excel',
    href: '/#excel',
    desc: 'One agent, every workflow, inside Excel; every number traced to where it came from',
  },
  {
    key: 'fia',
    label: 'Fia',
    href: '/#fia-agent',
    desc: 'Same FinSynth engine, in a full research workspace',
  },
  // listed ahead of launch so the menu shows the roadmap; no page to send to yet
  { key: 'mcp', label: 'FinSynth MCP (coming soon)', soon: true },
]
