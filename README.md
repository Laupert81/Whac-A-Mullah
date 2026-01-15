# Whac-A-Mullah

A satirical browser-based game in support of Iranian freedom, built with React. Hit mullahs to score points in this Whac-A-Mole parody featuring three unique mullah types with different appearance probabilities and point values. The game runs for 60 seconds and supports both desktop (mouse) and mobile/tablet (touch) input.

**FREE IRAN** 🇮🇷

## Features

- 🎮 **Three Mullah Types**:
  - Jannati - 50% probability, 100 points
  - Mohseni-Eje'i - 30% probability, 200 points
  - Khamenei - 20% probability, 500 points

- ⏱️ **60-Second Gameplay** - Score as many points as possible before time runs out
- 🎯 **Responsive Design** - Works on desktop, tablet, and mobile devices
- 📲 **Progressive Web App (PWA)** - Installable on mobile and desktop for offline play
- 🔊 **Sound Effects & Victory Music** - Audio feedback with mute/unmute toggle
- 💾 **High Score Tracking** - Persists high scores in localStorage
- 🔨 **Custom Hammer Cursor** - Animated hammer that follows your cursor/tap
- 🖼️ **Custom Sprites** - Unique character designs for each mullah type
- 🏆 **Victory Celebration** - Themed game over screen celebrating your victory

## Technology Stack

- **React 18** - Component-based UI framework
- **Vite 5** - Fast build tool and dev server
- **vite-plugin-pwa** - Progressive Web App support with service workers
- **CSS3** - Animations and responsive design
- **Web Audio API** - Sound effects and music

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

## Game Mechanics

- **Mullah Spawning**: Mullahs appear randomly in the 3x3 grid
  - Maximum 3 mullahs active simultaneously
  - Spawn interval: 600-1200ms (random)
  - Active duration: 800-1500ms (random)

- **Hit Detection**: Click or tap on mullahs to score points
- **Timer**: 60-second countdown with visual warning in final 10 seconds
- **Scoring**: Points are awarded immediately and displayed with pop-up animations

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
│   │   │   └── moles/       # Mullah sprites (common, rare, golden)
│   │   └── victory/         # Victory screen assets
│   ├── components/          # React components
│   │   ├── StartScreen.jsx
│   │   ├── GameScreen.jsx
│   │   ├── GameOverScreen.jsx
│   │   ├── Mole.jsx         # Mullah character component
│   │   ├── Hole.jsx
│   │   ├── Hammer.jsx       # Custom cursor component
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
│   │   ├── moleTypes.js     # Mullah type definitions
│   │   ├── audioManager.js
│   │   └── hitDetection.js
│   ├── styles/              # Global styles
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
- **iOS Safari**: Tap Share → "Add to Home Screen"
- **Android Chrome**: Tap menu (⋮) → "Add to Home screen" or "Install app"

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
- **Music**: K. Kasyanov

## License

MIT
