# Before You Go

在这里，背起精神行囊

## Website

[Open Before You Go](https://maygirl92.github.io/Before-you-go/)

The current release covers Germany and the United Kingdom. The site is a
responsive, static Next.js application backed by the curated country packages
in `data/countries/`.

The Europe overview uses public-domain Natural Earth country geometry and the
World Bank's 2024 `SP.POP.TOTL` data for its six-step population colour scale.

## Documentation

- `docs/A-Build-PRD-v2.1.md` — product behaviour and implementation source of truth.
- `docs/B-Curation-Handbook-v2.1.md` — curation and content source of truth.
- `docs/C-Country-Replication-Standard-v1.0.md` — reusable data, visual and delivery standard for future country sections.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000/`, then choose Germany or the United Kingdom.

## Validation

```bash
npm test
npm run build
```

## Build-time cover matching

The public site never calls TMDB with a private token. To resolve a country's
screen covers locally, copy `.env.local.example` to `.env.local`, add a
current TMDB read token, then run:

```bash
npm run covers:tmdb -- uk
npm run covers:apply -- uk
```

Review the generated match report before applying candidates. Only the final
public cover URLs and their source pages belong in `works.json`; `.env.local`
is ignored by Git.

GitHub Pages is built and published automatically from `main` by the workflow
in `.github/workflows/deploy-pages.yml`.
