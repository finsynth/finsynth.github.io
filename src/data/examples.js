// The three curated sample prompts the hero's "Explore" modal offers
// (src/components/TryItModal.jsx). Each carries only what that flow renders:
//
//   prompt — shown in the sample row, typed into the box, and matched on submit
//            (an exact-prompt match tags the request with its `id`)
//   file   — the workbook name shown on the "your workbook is ready" card
//   id     — the tag sent to the backend so we know which sample was asked
//
// Nothing else is rendered: the modal ends in email capture and the result is
// delivered by email, so there is no on-page table, citation or download here.

export const PROMPTS = [
  {
    id: 'nflx-growth-decomp',
    prompt:
      "Netflix stopped reporting net adds and ARM. Rebuild both from what they disclose now, and show me what's really driving their growth.",
    file: 'Netflix_Growth_Decomposition.xlsx',
  },
  {
    id: 'heico-revenue-decomp',
    prompt:
      'Build a full revenue decomposition for HEICO Corporation for the last 6 quarters',
    file: 'HEICO_Revenue_Decomposition.xlsx',
  },
  {
    id: 'indigo-fuel-fx-scenario',
    prompt:
      "I want you to look into IndiGo's key catalysts affecting growth and margins and then model in detail each of the catalyst with commentary to see potential impact of Hormuz, fuel price and FX off of FY26 for FY27-29 on Indigo and its relevant competitors",
    file: 'IndiGo_Fuel_FX_Scenario.xlsx',
  },
]
