import { EMAILS, SITE } from '@/config/site'
import { ENV } from '@/config/env'

/** Footer, navbar and /careers all read this list. Until TALLY_FORM_ID is set, applyHref falls back to the mailto. */
export const CAREERS_EMAIL = EMAILS.support

export const TALLY_FORM_ID = ENV.tallyFormId

export const ABOUT_US = SITE.description

// Each role: `about` opens the posting; `sections` are rendered in order as a
// heading and a bullet list. A bullet's optional
// `lead` is the bolded first sentence ("Drive engineering execution.").
export interface RoleItem {
  lead?: string
  text: string
}

export interface Role {
  key: string
  title: string
  place: string
  meta: string
  posted: string
  about: string
  sections: { heading: string; items: RoleItem[] }[]
}

export const ROLES: Role[] = [
  {
    key: 'gtm',
    title: 'Founding GTM Lead',
    place: 'NYC',
    meta: 'New York · In person · Full time',
    posted: '2026-08-14',
    about:
      'We are hiring our first dedicated Founding GTM Lead to work closely ' +
      'with leadership to build our B2B GTM motion. Your job is to be the ' +
      'strategist, and to build and run the engine underneath this motion. ' +
      'Our most important goal is to win our first enterprise customers and ' +
      'build relationships strong enough to grow from.',
    sections: [
      {
        heading: 'Key responsibilities',
        items: [
          {
            text: 'Partner with founders on commercial strategy: channel prioritization, pricing and packaging, and how we build credibility and demonstrate value to public market teams.',
          },
          {
            text: 'Own pipeline and deal management from first meeting through signed contract: scheduling, diligence, security reviews, legal coordination, commitment tracking, and the follow-ups that keep deals alive between conversations.',
          },
          {
            text: 'Stand up our GTM infrastructure: own our CRM and build the pipeline tracking and reporting that give leadership an accurate view of the funnel.',
          },
          {
            text: 'Drive B2B marketing and sales enablement: build the decks, one-pagers, case studies, and ROI models.',
          },
          {
            text: 'Build top-of-funnel volume: develop target account lists, run outreach, conduct deep account research, book meetings, and manage early-stage relationships.',
          },
          {
            text: 'Translate what we learn from every call into sharper materials and a smarter motion, fast. What packaging lands, how to price, which partnership structures work, and which channels convert.',
          },
        ],
      },
      {
        heading: 'Ideal candidate',
        items: [
          {
            text: 'You have 4+ years of experience, ideally combining time at a top strategy or consulting firm with operating experience in GTM, BD, partnerships, or growth at a high-growth company. AI B2B SaaS strongly preferred.',
          },
          {
            lead: "You know the buyer's world.",
            text: "You've spent time inside or selling into buy-side or sell-side firms, and you understand how these organizations evaluate and procure new solutions.",
          },
          {
            lead: "You're strategic and operational on the same day.",
            text: 'You can pressure-test a hypothesis with rigor, then immediately turn around and send 30 researched outreach emails. Neither mode feels beneath you or beyond you.',
          },
          {
            lead: "You're comfortable with ambiguity.",
            text: 'What we sell, how we package it, and which channel converts will all shift repeatedly. You find that energizing, not destabilizing.',
          },
          {
            lead: 'You have genuine conviction about the mission.',
            text: "Buyers can sense whether it's real. So can we.",
          },
        ],
      },
    ],
  },
  {
    key: 'eng',
    title: 'Founding Engineer',
    place: 'NYC',
    meta: 'New York · In person · Full time',
    posted: '2026-08-14',
    about:
      "We're hiring a Senior Founding Engineer who will partner directly with " +
      'our CTO to help lead product, engineering, and design. This is not a ' +
      'typical developer role.',
    sections: [
      {
        heading: 'What you will do',
        items: [
          {
            lead: 'Drive engineering execution.',
            text: 'Help with sprint planning, code reviews, and release quality.',
          },
          {
            lead: 'Collaborate cross-functionally.',
            text: 'Work with design, Customer Success, Sales, and GTM to guide product decision making, drive architecture, and shape how we build as we scale.',
          },
          {
            lead: 'Build with ownership.',
            text: 'Ship large features end to end, and define engineering culture and process as we scale.',
          },
          {
            lead: 'Set technical direction.',
            text: 'Make architectural decisions that shape our next three years of growth.',
          },
          {
            lead: 'Mentor and unblock others.',
            text: 'Be the first line of defense for technical and product questions, and help the team move faster.',
          },
        ],
      },
      {
        heading: 'Ideal candidate',
        items: [
          { text: '5+ years of experience' },
          { text: 'Full-stack (React, Next.js, Node, Postgres)' },
          { text: 'Hands-on experience building with LLMs or agentic systems in production' },
          { text: 'Comfortable leading projects' },
          { text: 'Thrives in ambiguous environments and takes ownership end to end' },
          {
            text: "Hungry for growth and impact. There's no ceiling to your growth here, so take on as much responsibility as you're ready for.",
          },
        ],
      },
    ],
  },
]

// also the role value an application arrives under
export const roleLabel = (r: Role) => `${r.title} (${r.place})`

// /careers ids must match `key`
export const roleHref = (r: Role) => `/careers#${r.key}`

// The Tally form needs a hidden field named exactly `role`; falls back to mailto until the form id is set.
export const applyHref = (r: Role) =>
  TALLY_FORM_ID
    ? `https://tally.so/r/${TALLY_FORM_ID}?role=${encodeURIComponent(roleLabel(r))}`
    : `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(`Application: ${roleLabel(r)}`)}`
