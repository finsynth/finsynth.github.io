export const ENV = {
  clerkPublishableKey:
    import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_live_Y2xlcmsuZmluc3ludGguYWkk',
  tallyFormId: import.meta.env.PUBLIC_TALLY_FORM_ID || 'GxEy8Q',
} as const
