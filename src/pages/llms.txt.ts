import { LINKS, SITE } from '@/config/site'
import { PRODUCTS } from '@/data/products'
import { ROLES, roleLabel } from '@/data/roles'
import { SOLUTIONS, solutionHref } from '@/data/solutions'

// https://llmstxt.org — a plain-markdown map of the site for LLM tools
export function GET() {
  const url = (path: string) => new URL(path, SITE.url).href
  const solutions = Object.entries(SOLUTIONS).map(
    ([slug, sol]) => `- [FinSynth for ${sol.name}](${url(solutionHref(slug))}): ${sol.lede}`,
  )
  const body = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    '## Product',
    '',
    `- [Home](${url('/')}): ${SITE.title}`,
    ...PRODUCTS.filter((p) => p.href && p.desc).map(
      (p) => `- [${p.label}](${url(p.href!)}): ${p.desc}`,
    ),
    `- [Web app](${LINKS.app}): sign in to use the FinSynth agent`,
    '',
    '## Solutions',
    '',
    ...solutions,
    '',
    '## Company',
    '',
    `- [Careers](${url('/careers')}): open roles: ${ROLES.map(roleLabel).join(', ')}`,
    `- [Support](${url('/support')}): raise a ticket with the FinSynth team`,
    `- [Book a call](${LINKS.bookCall})`,
    '',
  ].join('\n')
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
