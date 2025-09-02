# CCSE 2025 • Quiz App

React + Vite + TypeScript + Tailwind. Mobile-first, friendly on desktop too.

## Features
- Loads questions from `public/data/data-25.json`.
- Immediate feedback with happy/sad emoji burst animation.
- Stats (kept in `localStorage`): attempts, correct, wrong, and top failed questions.
- Premium gate (for now a boolean). Toggle in `src/utils.ts`: `export const PREMIUM_ENABLED = true|false`.
- Two modes:
  1) All questions (random or sequential)
  2) By task (choose a task, then random or sequential)
- Task color bar on top of each question card. **Update exact colors** in `src/utils.ts` (`TASK_COLORS`) to match the PDF.

## Data placement
Put your JSON here:
```
public/data/data-25.json
```

This repo already includes that file copied from your upload.

## Local dev
```bash
npm i
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Deploy to Vercel
- Push this folder to a GitHub repo.
- Create a new Vercel project from that repo (Framework Preset: **Vite**).
- No special env vars required.
- Ensure `public/data/data-25.json` is present in the repo.

## Customize task colors
In `src/utils.ts` update the `TASK_COLORS` to the exact hex codes from the manual.
Example:
```ts
export const TASK_COLORS = {
  tarea_1: '#HEX1',
  tarea_2: '#HEX2',
  tarea_3: '#HEX3',
  tarea_4: '#HEX4',
  tarea_5: '#HEX5',
} as const
```