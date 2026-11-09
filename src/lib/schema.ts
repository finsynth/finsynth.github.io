import { EMAILS, LINKS, SITE } from '@/config/site'
import type { Role } from '@/data/roles'

type Thing = Record<string, unknown>

const abs = (path: string) => new URL(path, SITE.url).href
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const ORG_ID = `${SITE.url}/#organization`

export function organization(): Thing {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.name,
    url: SITE.url,
    logo: abs(SITE.logo),
    description: SITE.description,
    email: EMAILS.support,
    sameAs: [LINKS.linkedin, LINKS.x],
  }
}

export function website(): Thing {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
    publisher: { '@id': ORG_ID },
  }
}

export function faqPage(items: { q: string; a: string }[]): Thing {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function jobPosting(role: Role): Thing {
  // Google requires description as HTML; built from the same data the page renders
  const description = [
    `<p>${esc(role.about)}</p>`,
    ...role.sections.map(
      (s) =>
        `<h3>${esc(s.heading)}</h3><ul>${s.items.map((it) => `<li>${it.lead ? `<b>${esc(it.lead)}</b> ` : ''}${esc(it.text)}</li>`).join('')}</ul>`,
    ),
  ].join('')
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: role.title,
    description,
    datePosted: role.posted,
    employmentType: 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: SITE.name,
      sameAs: SITE.url,
      logo: abs(SITE.logo),
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'New York',
        addressRegion: 'NY',
        addressCountry: 'US',
      },
    },
    url: abs(`/careers#${role.key}`),
  }
}
