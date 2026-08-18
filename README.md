# Before You Go

在这里，背起精神行囊

## Website

[Open Before You Go](https://maygirl92.github.io/Before-you-go/)

The current release covers Germany. The site is a responsive, static Next.js
application backed by the curated records in `data/works.json` and the
configuration in `data/config.json`.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000/de`.

## Validation

```bash
npm test
npm run build
```

GitHub Pages is built and published automatically from `main` by the workflow
in `.github/workflows/deploy-pages.yml`.
