# Whac-A-Mole Game

A browser-based Whac-A-Mole game built with React, featuring three unique mole types with different appearance probabilities and point values. The game runs for 60 seconds and supports both desktop (mouse) and mobile/tablet (touch) input.

## Features

- 🎮 **Three Mole Types**:
  - Common Mole (🐹) - 60% probability, 100 points
  - Rare Mole (🐭) - 30% probability, 200 points
  - Golden Mole (✨🐹) - 10% probability, 500 points

- ⏱️ **60-Second Gameplay** - Score as many points as possible before time runs out
- 🎯 **Responsive Design** - Works on desktop, tablet, and mobile devices
- 🔊 **Audio Feedback** - Placeholder sound effects with mute/unmute toggle
- 💾 **High Score Tracking** - Persists high scores in localStorage
- ♿ **Accessibility** - ARIA labels, keyboard support, high contrast mode, screen reader support

## Technology Stack

- **React 18** - Component-based UI framework
- **Vite** - Fast build tool and dev server
- **CSS3** - Animations and responsive design
- **Web Audio API** - Placeholder sound effects

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

- **Mole Spawning**: Moles appear randomly in the 3x3 grid
  - Maximum 3 moles active simultaneously
  - Spawn interval: 600-1200ms (random)
  - Active duration: 800-1500ms (random)

- **Hit Detection**: Click or tap on moles to score points
- **Timer**: 60-second countdown with visual warning in final 10 seconds
- **Scoring**: Points are awarded immediately and displayed with pop-up animations

## Project Structure

```
whac-a-mole/
├── src/
│   ├── components/       # React components
│   │   ├── StartScreen.jsx
│   │   ├── GameScreen.jsx
│   │   ├── GameOverScreen.jsx
│   │   ├── Mole.jsx
│   │   ├── Hole.jsx
│   │   ├── GameGrid.jsx
│   │   ├── HUD.jsx
│   │   ├── AudioControls.jsx
│   │   └── ScorePopup.jsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useGameTimer.js
│   │   ├── useMoleSpawner.js
│   │   └── useLocalStorage.js
│   ├── contexts/         # React Context
│   │   └── GameContext.jsx
│   ├── utils/            # Utility functions
│   │   ├── moleTypes.js
│   │   ├── audioManager.js
│   │   └── hitDetection.js
│   ├── styles/           # Global styles
│   │   ├── App.css
│   │   └── animations.css
│   ├── App.jsx
│   └── main.jsx
├── public/               # Static assets
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

## Accessibility Features

- ARIA labels and roles for screen readers
- Keyboard navigation support
- High contrast mode support
- Reduced motion support for animations
- Minimum 44x44px touch targets for mobile
- Color-blind friendly mole differentiation (uses emoji + patterns)

## Performance

- Target: 60 FPS on modern devices
- Optimized with React.memo for component re-renders
- Proper cleanup of timers and intervals
- GPU-accelerated CSS animations

## License

MIT

