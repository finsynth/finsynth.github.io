/**
 * The open roles, in one place. The footer's Careers column, the navbar's
 * Careers menu, and the /careers page all read this list, so a role can't be
 * open in one and gone from another — the same reason the certification seals
 * are one array.
 *
 * Applications go to a Tally form (TALLY_FORM_ID below). Tally hosts the form
 * and the resume upload; the site only links to it, passing the role along as
 * a hidden field so one form serves every opening. Until the form ID is filled
 * in, applyHref falls back to the mailto the site always published, so the
 * Apply buttons never point at a dead URL.
 */
export const CAREERS_EMAIL = 'support@finsynth.ai'

// The Tally form ID — the trailing segment of the form's share URL
// (https://tally.so/r/<id>). Hardcoded on purpose, like the Formspree endpoint
// in utils/submitAsk.js: it is public by design (it ships in the bundle either
// way), and the site deploys as a prebuilt bundle. An env override still wins
// if VITE_TALLY_FORM_ID is ever set (e.g. to point local dev at a test form).
export const TALLY_FORM_ID = import.meta.env?.VITE_TALLY_FORM_ID || 'GxEy8Q'

// One "About us" for every posting, rendered once at the top of /careers
// rather than repeated per role.
export const ABOUT_US =
  'FinSynth is auditable AI research infrastructure, purpose-built for public ' +
  'markets. Teams using FinSynth save 80% of their time, spend 90% less time ' +
  'auditing models, and cover 2x as many names. We are built for complex, ' +
  'multi-step research work, not just one-click formula help. FinSynth is ' +
  'backed by Accel and industry angels, and trusted by investors at global funds.'

// Each role: `about` opens the posting; `sections` are rendered in order as a
// heading, an optional intro line, and a bullet list. A bullet's optional
// `lead` is the bolded first sentence ("Drive engineering execution.").
export const ROLES = [
  {
    key: 'eng',
    title: 'Founding Engineer',
    place: 'New York',
    meta: 'New York · In person · Full time',
    about:
      "We're hiring a Senior Founding Engineer who will partner directly with " +
      'our CTO to help lead product, engineering, and design. This is not a ' +
      'typical developer role.',
    sections: [
      {
        heading: 'What you will do',
        items: [
          { lead: 'Drive engineering execution.', text: 'Help with sprint planning, code reviews, and release quality.' },
          { lead: 'Collaborate cross-functionally.', text: 'Work with design, Customer Success, Sales, and GTM to guide product decision making, drive architecture, and shape how we build as we scale.' },
          { lead: 'Build with ownership.', text: 'Ship large features end to end, and define engineering culture and process as we scale.' },
          { lead: 'Set technical direction.', text: 'Make architectural decisions that shape our next three years of growth.' },
          { lead: 'Mentor and unblock others.', text: 'Be the first line of defense for technical and product questions, and help the team move faster.' },
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
          { text: "Hungry for growth and impact. There's no ceiling to your growth here, so take on as much responsibility as you're ready for." },
        ],
      },
    ],
  },
  {
    key: 'gtm',
    title: 'Founding GTM Lead',
    place: 'New York',
    meta: 'New York · In person · Full time',
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
          { text: 'Partner with founders on commercial strategy: channel prioritization, pricing and packaging, and how we build credibility and demonstrate value to public market teams.' },
          { text: 'Own pipeline and deal management from first meeting through signed contract: scheduling, diligence, security reviews, legal coordination, commitment tracking, and the follow-ups that keep deals alive between conversations.' },
          { text: 'Stand up our GTM infrastructure: own our CRM and build the pipeline tracking and reporting that give leadership an accurate view of the funnel.' },
          { text: 'Drive B2B marketing and sales enablement: build the decks, one-pagers, case studies, and ROI models.' },
          { text: 'Build top-of-funnel volume: develop target account lists, run outreach, conduct deep account research, book meetings, and manage early-stage relationships.' },
          { text: 'Translate what we learn from every call into sharper materials and a smarter motion, fast. What packaging lands, how to price, which partnership structures work, and which channels convert.' },
        ],
      },
      {
        heading: 'Ideal candidate',
        items: [
          { text: 'You have 4+ years of experience, ideally combining time at a top strategy or consulting firm with operating experience in GTM, BD, partnerships, or growth at a high-growth company. AI B2B SaaS strongly preferred.' },
          { lead: "You know the buyer's world.", text: "You've spent time inside or selling into buy-side or sell-side firms, and you understand how these organizations evaluate and procure new solutions." },
          { lead: "You're strategic and operational on the same day.", text: 'You can pressure-test a hypothesis with rigor, then immediately turn around and send 30 researched outreach emails. Neither mode feels beneath you or beyond you.' },
          { lead: "You're comfortable with ambiguity.", text: 'What we sell, how we package it, and which channel converts will all shift repeatedly. You find that energizing, not destabilizing.' },
          { lead: 'You have genuine conviction about the mission.', text: "Buyers can sense whether it's real. So can we." },
        ],
      },
    ],
  },
]

// Location in brackets, so the role reads first and the city is the aside:
// "Founding GTM Lead (New York)". The footer column and the navbar menu render
// this, and it is also the role value an application arrives under.
export const roleLabel = (r) => `${r.title} (${r.place})`

// Where the navbar/footer role links land: the posting on /careers. Hash ids
// match `key`, and Careers.jsx scrolls to them on load (the content is
// client-rendered, so the browser's native anchor jump fires too early).
export const roleHref = (r) => `/careers#${r.key}`

// Where "Apply" goes: the Tally form, with the role prefilled into a hidden
// `role` field (create it in Tally with exactly that name). Falls back to the
// mailto the site published before the form existed, so the button always
// lands somewhere real.
export const applyHref = (r) =>
  TALLY_FORM_ID
    ? `https://tally.so/r/${TALLY_FORM_ID}?role=${encodeURIComponent(roleLabel(r))}`
    : `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(`Application: ${roleLabel(r)}`)}`
