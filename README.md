# finsynth.ai

The FinSynth website. Built with [Astro](https://astro.build): every page is plain HTML, and React is used only for the parts that need to be interactive.

## Setup

You need Node 24 (see `.nvmrc`).

```bash
nvm use
npm ci
cp .env.example .env.local
```

Open `.env.local` and fill in the values. Anything left empty falls back to the production defaults.

## Run

| Command           | What it does                                    |
| ----------------- | ----------------------------------------------- |
| `npm run dev`     | Start the site locally at http://localhost:4321 |
| `npm run build`   | Build the site into `dist/`                     |
| `npm run preview` | Serve the built `dist/` locally                 |
| `npm run check`   | Type-check the project                          |
| `npm run format`  | Format files with Prettier (pass the paths)     |

## Where things live

```
src/
  pages/        one file per page (index, careers, support, solutions/[slug], 404)
  components/   layout, home, shared, careers, visuals, seo
  views/        page bodies used by the pages
  data/         content: roles, solutions, FAQ, products
  config/       site links, emails, environment values
  styles/       global.css
  assets/fonts/ self-hosted Geist fonts
public/         images and files served as-is
```
