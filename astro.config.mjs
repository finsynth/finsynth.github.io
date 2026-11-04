import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import { SITE } from './src/config/site.ts'

export default defineConfig({
  site: SITE.url,
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [react(), sitemap()],
})
