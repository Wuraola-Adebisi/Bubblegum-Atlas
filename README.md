# Bubblegum Atlas

Design system and map engine for two event sites: a wedding weekend and a brand pop-up. This repo currently holds the style tile (tokens, type, lines, shapes and the scene shift).

## Run

```
npm install
npm run dev
```

## Build

```
npm run build
npm run preview
```

## Where things are

- `src/index.css`: design tokens, the single source of truth
- `src/lib/`: color and scene helpers
- `src/tile/`: style tile sections
- `docs/`: studio playbook and project brief

Stack: React, TypeScript, Vite, Tailwind CSS v4, Fontsource fonts. Deployed on Vercel.
