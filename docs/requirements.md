# Whac-A-Mole Game - Technical Requirements Document

## 1. Project Overview

### 1.1 Description

A browser-based Whac-A-Mole game featuring three unique mole types with different appearance probabilities and point values. The game runs for 60 seconds and supports both desktop (mouse) and mobile/tablet (touch) input.

### 1.2 Target Platforms

- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Android Chrome)
- Tablet browsers

### 1.3 Technology Stack (Recommended)

- HTML5 Canvas or DOM-based rendering
- Vanilla JavaScript (ES6+) or framework of choice (React, Vue, etc.)
- CSS3 for animations and responsive design
- No backend required (client-side only)

---

## 2. Game Mechanics

### 2.1 Mole Types and Scoring

| Mole Type   | Appearance Probability | Points | Description                    |
| ----------- | ---------------------- | ------ | ------------------------------ |
| Common Mole | 60%                    | 100    | Most frequently appearing mole |
| Rare Mole   | 30%                    | 200    | Medium frequency, higher value |
| Golden Mole | 10%                    | 500    | Rare appearance, highest value |

### 2.2 Game Field Layout

- Grid of 9 holes arranged in a 3x3 pattern
- Each hole can spawn one mole at a time
- Holes should have a "burrow" visual to indicate mole entry/exit points

### 2.3 Mole Behavior

#### Spawn Mechanics

- Moles appear from holes with a "pop-up" animation
- Multiple moles can be active simultaneously (maximum 3 at once recommended)
- Spawn interval: Random between 600ms - 1200ms
- A hole cannot spawn a new mole while one is currently active in that position

#### Active Duration

- Each mole remains visible for a random duration between 800ms - 1500ms
- If not hit, mole retreats back into the hole with a "hide" animation
- Difficulty can increase over time by reducing active duration (optional enhancement)

#### Hit Detection

- A successful hit occurs when the player clicks/taps on a visible mole
- Hit moles should display a "hit" animation before disappearing
- Points are awarded immediately upon successful hit
- A "miss" occurs when clicking on an empty hole or the background (no penalty, but could trigger visual/audio feedback)

### 2.4 Game Timer

- Total game duration: 60 seconds
- Countdown timer displayed prominently on screen
- Timer starts when player initiates the game
- Game ends immediately when timer reaches 0

---

## 3. User Interface Requirements

### 3.1 Screen States

#### 3.1.1 Start Screen

- Game title: "Whac-A-Mole"
- "Start Game" button (prominent, centered)
- High score display (stored in localStorage)
- Brief instructions or "How to Play" section (optional)

#### 3.1.2 Game Screen

- 3x3 grid of mole holes
- Current score display (top-left or top-center)
- Countdown timer display (top-right or top-center)
- Visual distinction between mole types (different colors/appearances)
- Pause button (optional)

#### 3.1.3 Game Over Screen

- "Game Over" or "Time's Up!" message
- Final score display
- High score display (with "New High Score!" indicator if applicable)
- "Play Again" button
- "Main Menu" button (optional)

### 3.2 HUD Elements

| Element     | Position | Format                                                |
| ----------- | -------- | ----------------------------------------------------- |
| Score       | Top area | "Score: X" or just the number                         |
| Timer       | Top area | "0:XX" format (showing seconds remaining)             |
| Mole Legend | Optional | Small icons showing mole types and their point values |

### 3.3 Responsive Design Requirements

- Minimum supported width: 320px (mobile portrait)
- Maximum supported width: 1920px (desktop)
- Game field should scale proportionally to fit screen
- Touch targets must be minimum 44x44px for mobile accessibility
- Maintain aspect ratio of game field across all screen sizes

---

## 4. Input Handling

### 4.1 Desktop Controls

- Mouse click (left button) to hit moles
- Cursor should change to a hammer/mallet icon when over the game area (optional enhancement)
- Click feedback: visual indication of click location

### 4.2 Mobile/Tablet Controls

- Single tap to hit moles
- Prevent default touch behaviors (scrolling, zooming) within game area
- Support for rapid successive taps
- No multi-touch required (single-point input only)

### 4.3 Input Responsiveness

- Maximum input latency: 50ms
- Immediate visual feedback on all interactions
- Prevent "double-hit" on same mole (debounce if necessary)

---

## 5. Visual Requirements

### 5.1 Animations

| Animation     | Duration   | Description                                   |
| ------------- | ---------- | --------------------------------------------- |
| Mole Pop-up   | 150-200ms  | Mole emerges from hole (ease-out)             |
| Mole Hide     | 150-200ms  | Mole retreats into hole (ease-in)             |
| Mole Hit      | 200-300ms  | Hit reaction (shake, stars, or squash effect) |
| Score Pop     | 300-400ms  | Points float up from hit location and fade    |
| Timer Warning | Continuous | Pulsing/color change when ≤10 seconds remain  |

### 5.2 Visual Feedback

- Hover state on holes (desktop only) - subtle highlight
- Click/tap ripple or impact effect
- Score increment animation (number counting up or flashing)
- Screen shake on miss (optional, subtle)

### 5.3 Asset Requirements

#### Provided by Client

- Mole sprites/images for each type (3 variations):
  - Common Mole (idle, hit states)
  - Rare Mole (idle, hit states)
  - Golden Mole (idle, hit states)
- Sound effects (see Section 6)

#### To Be Created by Developer

- Hole/burrow graphic
- Background image or pattern
- UI elements (buttons, score display, timer)
- Cursor/hammer graphic (optional)
- Particle effects (optional)

### 5.4 Recommended Asset Specifications

| Asset        | Format            | Dimensions        | Notes                 |
| ------------ | ----------------- | ----------------- | --------------------- |
| Mole Sprites | PNG (transparent) | 128x128px minimum | 2x for retina support |
| Hole Graphic | PNG (transparent) | 150x80px minimum  | Should frame mole     |
| Background   | PNG/JPG           | 1920x1080px       | Tileable or scalable  |
| UI Icons     | SVG preferred     | Variable          | Scale-independent     |

---

## 6. Audio Requirements

### 6.1 Sound Effects

| Sound         | Trigger              | Notes                    |
| ------------- | -------------------- | ------------------------ |
| Mole Hit      | Successful whack     | Satisfying "bonk" sound  |
| Mole Miss     | Click on empty area  | Optional, subtle sound   |
| Mole Appear   | Mole pops up         | Quick "pop" sound        |
| Game Start    | Game begins          | Cheerful jingle          |
| Game Over     | Timer reaches 0      | End fanfare/buzzer       |
| Timer Warning | 10 seconds remaining | Ticking or urgency sound |
| High Score    | New record achieved  | Victory sound            |

### 6.2 Audio Controls

- Master mute/unmute toggle (persist in localStorage)
- Default state: Audio ON (or OFF for mobile, per platform conventions)
- Audio should not autoplay before user interaction (browser policy compliance)

### 6.3 Audio Format

- Preferred: MP3 for broad compatibility
- Alternative: OGG for Firefox optimization
- Keep file sizes small (<100KB per effect)

---

## 7. Data Persistence

### 7.1 Local Storage Data

| Key          | Type    | Description                   |
| ------------ | ------- | ----------------------------- |
| highScore    | number  | Highest score achieved        |
| audioEnabled | boolean | Sound preference              |
| gamesPlayed  | number  | Total games played (optional) |

### 7.2 Session Data (In-Memory)

- Current score
- Time remaining
- Active moles array
- Game state (menu, playing, paused, gameOver)

---

## 8. Performance Requirements

### 8.1 Frame Rate

- Target: 60 FPS on modern devices
- Minimum acceptable: 30 FPS on low-end devices

### 8.2 Load Time

- Initial load: < 3 seconds on 3G connection
- Total asset size: < 2MB (excluding optional assets)

### 8.3 Memory Management

- Properly dispose of animations and timers on game end
- Reuse object pools for mole instances
- Avoid memory leaks on repeated play sessions

---

## 9. Accessibility Considerations

### 9.1 Visual

- High contrast between moles and background
- Score and timer should be clearly readable
- Color-blind friendly mole differentiation (use shapes/patterns, not just color)

### 9.2 Motor

- Generous hit detection areas
- Adjustable game speed (optional enhancement)
- Minimum touch target size: 44x44px

### 9.3 Audio

- Visual feedback should not rely solely on audio cues
- All critical information (score, time) displayed visually

---

## 10. Optional Enhancements (Future Scope)

These features are NOT required for initial release but may be considered for future versions:

### 10.1 Gameplay Enhancements

- Difficulty levels (Easy, Medium, Hard)
- Progressive difficulty (game speeds up over time)
- Combo system (bonus points for rapid successive hits)
- Power-ups (time freeze, 2x points, etc.)
- Penalty moles (lose points if hit)
- Endless mode (no timer, lives-based)

### 10.2 Social Features

- Online leaderboard
- Share score to social media
- Challenge friends

### 10.3 Customization

- Unlockable hammer/mallet skins
- Unlockable mole themes
- Custom backgrounds

### 10.4 Technical Enhancements

- Offline play (PWA/Service Worker)
- Haptic feedback on mobile
- Achievement system
- Statistics tracking (accuracy, favorite mole type hit, etc.)

---

## 11. File Structure (Suggested)

```
whac-a-mole/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── main.js
│   ├── game.js
│   ├── mole.js
│   ├── ui.js
│   └── audio.js
├── assets/
│   ├── images/
│   │   ├── mole-common.png
│   │   ├── mole-common-hit.png
│   │   ├── mole-rare.png
│   │   ├── mole-rare-hit.png
│   │   ├── mole-golden.png
│   │   ├── mole-golden-hit.png
│   │   ├── hole.png
│   │   └── background.png
│   └── audio/
│       ├── hit.mp3
│       ├── pop.mp3
│       ├── game-start.mp3
│       ├── game-over.mp3
│       └── tick.mp3
└── README.md
```

---

## 12. Testing Checklist

### 12.1 Functional Testing

- [ ] All three mole types appear with correct probabilities
- [ ] Points awarded correctly for each mole type
- [ ] Timer counts down accurately
- [ ] Game ends at exactly 0 seconds
- [ ] Score persists and displays correctly throughout game
- [ ] High score saves and loads from localStorage
- [ ] Start/restart functionality works correctly

### 12.2 Input Testing

- [ ] Mouse clicks register accurately (desktop)
- [ ] Touch taps register accurately (mobile)
- [ ] Rapid successive inputs handled correctly
- [ ] No accidental double-hits on same mole
- [ ] Clicking empty areas doesn't break game

### 12.3 Cross-Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] iOS Safari
- [ ] Android Chrome

### 12.4 Responsive Testing

- [ ] Mobile portrait (320px - 480px)
- [ ] Mobile landscape (480px - 768px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (1024px+)
- [ ] Large desktop (1920px+)

### 12.5 Performance Testing

- [ ] Smooth animations at 60fps
- [ ] No memory leaks after multiple games
- [ ] Assets load within acceptable time
- [ ] No frame drops during gameplay

---

## 13. Acceptance Criteria

The game will be considered complete when:

1. **Core Gameplay**: Player can play a complete 60-second game, hitting moles of all three types for appropriate points
2. **Mole Spawning**: Moles spawn randomly with the specified probability distribution (60%/30%/10%)
3. **Scoring**: Points are correctly awarded (100/200/500) and displayed
4. **Timer**: 60-second countdown functions accurately
5. **Input**: Both mouse and touch inputs work reliably across target platforms
6. **UI Flow**: All screen states (start, game, game over) function correctly
7. **Persistence**: High score saves and loads correctly
8. **Responsiveness**: Game displays correctly on all target screen sizes
9. **Audio**: Sound effects play correctly (when provided) with mute functionality
10. **Performance**: Game runs smoothly without lag or visual glitches

---

## 14. Asset Delivery Specifications

### For Mole Graphics (to be provided by client)

Please provide the following assets:

| Asset Name          | Description               | Recommended Size | Format                |
| ------------------- | ------------------------- | ---------------- | --------------------- |
| mole-common.png     | Common mole, normal state | 256x256px        | PNG with transparency |
| mole-common-hit.png | Common mole, hit state    | 256x256px        | PNG with transparency |
| mole-rare.png       | Rare mole, normal state   | 256x256px        | PNG with transparency |
| mole-rare-hit.png   | Rare mole, hit state      | 256x256px        | PNG with transparency |
| mole-golden.png     | Golden mole, normal state | 256x256px        | PNG with transparency |
| mole-golden-hit.png | Golden mole, hit state    | 256x256px        | PNG with transparency |

**Notes:**

- All moles should face forward
- Keep consistent size/position across all sprites
- Leave transparent padding for animation effects
- Provide @2x versions for retina displays if possible

### For Sound Effects (to be provided by client)

| Sound Name     | Description                     | Max Duration | Format |
| -------------- | ------------------------------- | ------------ | ------ |
| hit.mp3        | Successful mole whack           | 0.5s         | MP3    |
| pop.mp3        | Mole appearing                  | 0.3s         | MP3    |
| miss.mp3       | Clicking empty space (optional) | 0.3s         | MP3    |
| game-start.mp3 | Game beginning                  | 1.5s         | MP3    |
| game-over.mp3  | Game ending                     | 2s           | MP3    |
| tick.mp3       | Timer warning tick              | 0.2s         | MP3    |
| highscore.mp3  | New high score achieved         | 2s           | MP3    |

---

_Document Version: 1.0_  
_Last Updated: January 2025_
