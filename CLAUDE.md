# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

- `npm run dev` — Start Vite dev server
- `npm run build` — Production build (outputs to `dist/`)
- `npm run preview` — Preview production build locally

No test runner, linter, or formatter is configured.

## Tech Stack

- **React 18** (functional components, hooks only) with **Vite 5**
- Plain JavaScript (no TypeScript)
- CSS files per component (no CSS-in-JS), CSS custom properties for theming
- PWA via `vite-plugin-pwa` with Workbox service worker
- `@upstash/redis` for a global play counter (env vars: `VITE_KV_REST_API_URL`, `VITE_KV_REST_API_TOKEN`)
- `@vercel/analytics` for page tracking
- Deployed on Vercel

## Architecture

The app is a whac-a-mole browser game with three screen states: `menu` → `playing` → `gameOver`.

**State management:** `GameContext` (React Context in `src/contexts/GameContext.jsx`) holds all global state — score, high score, combo, audio prefs, and game phase.

**Game loop** is driven by two custom hooks:
- `useGameTimer` — 60-second countdown at 100ms precision
- `useMoleSpawner` — manages mole lifecycle (spawn intervals 600–1200ms, active 800–1500ms, max 3 simultaneous, 9 holes in a 3×3 grid)

**Mole types** defined in `src/utils/moleTypes.js` with weighted probabilities:
- Jannati (common, 44%, 100pts), Mohseni-Eje'i (rare, 26%, 200pts), Khamenei (golden, 18%, 500pts), Cat (penalty, 12%, −200pts, breaks combo)

**Combo system:** consecutive hits build multipliers (3–4 hits → 1.5×, 5–7 → 2×, 8+ → 3×). Milestones at 5/10/15/20/25 with celebrations.

**Audio:** `src/utils/audioManager.js` is a singleton using Web Audio API with fallback tones, audio pooling, and iOS unlock handling.

**Data persistence:** localStorage for high scores/prefs; Upstash Redis for global play count (fire-and-forget).

## Key Directories

- `src/components/` — React components (GameScreen, StartScreen, GameOverScreen, Hole, Mole, Hammer, HUD, etc.)
- `src/hooks/` — Custom hooks (game timer, mole spawner, localStorage, PWA install/update)
- `src/utils/` — Audio manager, hit detection, mole type definitions, analytics
- `src/contexts/` — GameContext provider
- `src/assets/` — Sprites (organized by mole type), sounds (MP3), logos, victory assets
- `docs/` — Requirements and sprite specifications
