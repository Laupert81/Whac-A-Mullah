# Whac-A-Mullah

A satirical browser-based game in support of Iranian freedom, built with React. Hit mullahs to score points in this Whac-A-Mole parody featuring three unique mullah types with different appearance probabilities and point values — plus a penalty cat you need to avoid. Progress through endless levels of increasing difficulty, compete on the global leaderboard, and track your personal bests.

**FREE IRAN**

## Features

- **Four Character Types**:
  - Jannati (common, 44%) — 100 points
  - Mohseni-Eje'i (rare, 26%) — 200 points
  - Khamenei (golden, 18%) — 500 points
  - Cat (penalty, 12%) — -200 points, breaks combo

- **Endless Level System** — 30-second levels with escalating difficulty. Meet the score threshold to advance to the next level with faster moles, shorter windows, and more simultaneous spawns.

- **Combo System** — Build consecutive hit streaks for score multipliers (1.5x at 3 hits, 2x at 5, 3x at 8+). Milestone celebrations at 5/10/15/20/25 combos.

- **Global Leaderboard** — Top 10 scores tracked via Upstash Redis. Finish in the top 10 to enter your name.

- **Personal Bests** — Best score, accuracy, combo, and highest level tracked across sessions with "New!" badges when records are broken.

- **Game Stats** — Post-game breakdown showing accuracy, max combo, level reached, and moles hit by type.

- **Progressive Web App (PWA)** — Installable on mobile and desktop for offline play.

- **Sound Effects & Music** — Start screen music, in-game audio feedback, victory music, and combo milestone sounds. Mute/unmute toggle.

- **Responsive Design** — Works on desktop, tablet, and mobile devices.

- **Custom Hammer Cursor** — Animated hammer that follows your cursor/tap.

- **Custom Sprites** — Unique character designs for each mullah type and the penalty cat.

- **Victory Celebration** — Themed game over screen with animated flag, stats, and personal bests.

## Technology Stack

- **React 18** — Component-based UI with hooks and Context API
- **Vite 5** — Fast build tool and dev server
- **vite-plugin-pwa** — Progressive Web App support with Workbox service workers
- **Upstash Redis** — Global leaderboard and play counter
- **Vercel Analytics** — Page tracking
- **CSS3** — Animations, responsive design, CSS custom properties for theming
- **Web Audio API** — Sound effects and music with iOS unlock handling

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to the URL shown in the terminal (typically `http://localhost:5173`)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory. You can preview the production build with:

```bash
npm run preview
```

### Environment Variables (Optional)

For the global leaderboard and play counter:

- `VITE_KV_REST_API_URL` — Upstash Redis REST URL
- `VITE_KV_REST_API_TOKEN` — Upstash Redis REST token

The game works without these; the leaderboard simply won't be available.

## Game Mechanics

- **Level System**: Each level lasts 30 seconds. Score enough points to meet the threshold and advance. Threshold scales by 1.3x per level (500, 650, 845, ...).

- **Difficulty Scaling**:
  - Spawn interval decreases (-30ms min, -50ms max per level)
  - Active duration decreases (-30ms min, -50ms max per level)
  - Max simultaneous moles increases (+1 every 3 levels, cap 7)

- **Mullah Spawning**: Mullahs appear randomly in the 3x3 grid
  - Spawn interval: 600–1200ms at level 1 (decreases per level)
  - Active duration: 800–1500ms at level 1 (decreases per level)

- **Hit Detection**: Click or tap on mullahs to score points
- **Scoring**: Points are multiplied by combo multiplier and displayed with pop-up animations

## Project Structure

```
whac-a-mullah/
├── src/
│   ├── assets/
│   │   ├── logos/           # Game and studio logos
│   │   ├── sounds/          # Hit sound effects
│   │   ├── sprites/         # Game graphics
│   │   │   ├── background/  # Game field background
│   │   │   ├── hammer/      # Hammer cursor sprites
│   │   │   ├── holes/       # Hole graphics
│   │   │   └── moles/       # Mullah sprites (common, rare, golden, cat)
│   │   └── victory/         # Victory screen assets
│   ├── components/          # React components
│   │   ├── StartScreen.jsx
│   │   ├── GameScreen.jsx
│   │   ├── GameOverScreen.jsx
│   │   ├── LevelTransition.jsx
│   │   ├── LeaderboardModal.jsx
│   │   ├── NicknamePrompt.jsx
│   │   ├── Mole.jsx
│   │   ├── Hole.jsx
│   │   ├── Hammer.jsx
│   │   ├── GameGrid.jsx
│   │   ├── HUD.jsx
│   │   ├── AudioControls.jsx
│   │   └── ScorePopup.jsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useGameTimer.js
│   │   ├── useMoleSpawner.js
│   │   ├── useLocalStorage.js
│   │   └── usePWAInstall.js
│   ├── contexts/            # React Context
│   │   └── GameContext.jsx
│   ├── utils/               # Utility functions
│   │   ├── levelConfig.js   # Level difficulty scaling
│   │   ├── moleTypes.js     # Mullah type definitions
│   │   ├── audioManager.js
│   │   ├── analytics.js     # Leaderboard & play counter
│   │   └── hitDetection.js
│   ├── data/
│   │   └── changelog.json
│   ├── styles/
│   │   ├── App.css
│   │   └── animations.css
│   ├── App.jsx
│   └── main.jsx
├── public/                  # Static assets (PWA icons, favicon)
├── docs/                    # Documentation
├── index.html
├── package.json
└── vite.config.js
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- iOS Safari
- Android Chrome

## PWA Installation

The game can be installed as a Progressive Web App for offline play:

- **Desktop (Chrome/Edge)**: Click the install icon in the address bar
- **iOS Safari**: Tap Share > "Add to Home Screen"
- **Android Chrome**: Tap menu > "Add to Home screen" or "Install app"

## Performance

- Target: 60 FPS on modern devices
- Optimized with React.memo for component re-renders
- Proper cleanup of timers and intervals
- GPU-accelerated CSS animations
- Service worker caching for offline play

## About

This game was created by a backend developer (not a game developer) to learn new tech and show support for the brave people protesting in Iran.

The code may be messy and the art is... what it is. Feedback, bug fixes, and contributions are welcome!

## Contact

- Email: whac-a-mullah@outlook.com
- GitHub: [Laupert81/Whac-A-Mullah](https://github.com/Laupert81/Whac-A-Mullah)

## Credits

- **Code & Graphics**: A Grumpy Norwegian
- **Music**: Amirhossein Eftekhari, K. Kasyanov

## License

MIT
