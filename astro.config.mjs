import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://finsynth.ai',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [react(), sitemap()],
})
