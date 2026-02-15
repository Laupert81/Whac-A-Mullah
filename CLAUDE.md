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
- `@upstash/redis` for global leaderboard and play counter (env vars: `VITE_KV_REST_API_URL`, `VITE_KV_REST_API_TOKEN`)
- `@vercel/analytics` for page tracking
- Deployed on Vercel
- Music/large assets served from Vercel Blob storage (external URLs, not bundled)

## Architecture

The app is a whac-a-mole browser game with three screen states: `menu` → `playing` → `gameOver`.

### State Management

`GameContext` (`src/contexts/GameContext.jsx`) holds all global state via React Context:
- Score, high score, combo system, audio prefs, game phase
- **Level system:** `currentLevel`, `levelScore` (score earned in current level only, used for threshold checks)
- **Game stats:** `totalHits`, `totalMisses`, `hitsByType`, `maxCombo` (per-session, reset each game)
- **Personal bests:** `bestScore`, `bestAccuracy`, `bestCombo`, `highestLevel` (persisted via localStorage)
- **Nickname:** saved for leaderboard auto-submission on repeat plays

### Level System

`src/utils/levelConfig.js` exports `getLevelConfig(level)` which returns all difficulty parameters for a level. Each level is 30 seconds. Score must meet `scoreThreshold` (500 × 1.3^(level-1)) to advance. Difficulty scales via spawn intervals, active durations, and max simultaneous moles. Cat probability is fixed at 12%.

`GameScreen.jsx` orchestrates the level loop: timer expires → check threshold → show `LevelTransition` overlay → call `advanceLevel()` → restart timer and spawner with new config. Failure to meet threshold triggers game over.

### Game Loop

Driven by two custom hooks that accept configuration:
- `useGameTimer(isActive, onTimeUp, duration)` — countdown at 100ms precision
- `useMoleSpawner(isActive, onMoleSpawn, difficultyConfig)` — manages mole lifecycle using config values from `getLevelConfig()`, falls back to hardcoded defaults when no config provided

### Mole Types

Defined in `src/utils/moleTypes.js` with weighted probabilities:
- Jannati (common, 44%, 100pts), Mohseni-Eje'i (rare, 26%, 200pts), Khamenei (golden, 18%, 500pts), Cat (penalty, 12%, -200pts, breaks combo)

`selectRandomMoleType(customProbabilities)` accepts optional overrides for individual type probabilities.

### Combo System

Consecutive hits build multipliers (3-4 hits → 1.5×, 5-7 → 2×, 8+ → 3×). Milestones at 5/10/15/20/25 with celebrations. Uses a ref (`comboRef`) for synchronous access in callbacks alongside async state updates.

### Audio

`src/utils/audioManager.js` is a singleton class using Web Audio API with fallback tones, audio pooling for concurrent playback, and iOS unlock handling. Music tracks (intro, victory) are loaded from external Vercel Blob URLs. Supports `playMusic`/`stopMusic`/`fadeOutMusic`. The `play(soundName, options)` method accepts an optional `{ playbackRate }` for pitch shifting (used for combo milestone sounds that increase in pitch with higher multipliers).

### Leaderboard & Analytics

`src/utils/analytics.js` uses Upstash Redis sorted sets:
- `addToLeaderboard(name, score, level)` — stores as `name:timestamp:level` member
- `getLeaderboard(limit)` — returns parsed entries with name, score, level, timestamp
- `checkIsTop10(score)` — checks eligibility before prompting for nickname
- Fire-and-forget pattern; all functions gracefully handle missing Redis config

### Data Persistence

- **localStorage:** high scores, audio prefs, personal bests, nickname (via `useLocalStorage` hook)
- **Upstash Redis:** global play count, leaderboard (fire-and-forget)

## Key Directories

- `src/components/` — React components with co-located CSS files
- `src/hooks/` — Custom hooks (game timer, mole spawner, localStorage, PWA install/update)
- `src/utils/` — Audio manager, hit detection, mole types, level config, analytics
- `src/contexts/` — GameContext provider
- `src/assets/` — Sprites (organized by mole type), sounds (MP3), logos, victory assets
- `src/data/` — `changelog.json` (rendered in StartScreen's changelog modal, version display)
- `docs/` — Requirements and sprite specifications
