export const ENV = {
  clerkPublishableKey:
    import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_live_Y2xlcmsuZmluc3ludGguYWkk',
  askEndpoint: import.meta.env.PUBLIC_ASK_ENDPOINT || 'https://formspree.io/f/mnpanynp',
  tallyFormId: import.meta.env.PUBLIC_TALLY_FORM_ID || 'GxEy8Q',
} as const
