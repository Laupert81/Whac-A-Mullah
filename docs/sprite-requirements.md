# Sprite Asset Requirements

This document outlines the requirements for creating and integrating custom sprite assets for the Whac-A-Mole game.

## Directory Structure

Place your sprite assets in the following directory structure:

```
src/assets/sprites/
  ├── moles/
  │   ├── common/
  │   │   ├── mole-common.png
  │   │   └── mole-common-hit.png (optional)
  │   ├── rare/
  │   │   ├── mole-rare.png
  │   │   └── mole-rare-hit.png (optional)
  │   └── golden/
  │       ├── mole-golden.png
  │       └── mole-golden-hit.png (optional)
  ├── holes/
  │   └── hole.png (optional - currently CSS-based)
  └── background/
      └── game-field.png (optional - currently CSS gradient)
```

## 1. Mole Sprites (Required)

### Common Mole (`mole-common.png`)
- **Dimensions**: 256x256px (minimum), 512x512px (recommended for retina displays)
- **Format**: PNG with transparent background
- **Aspect Ratio**: Square (1:1)
- **Content**: Mole character facing forward/camera
- **Color Scheme**: Brown/tan tones (reference color: #8B4513)
- **Animation Considerations**:
  - Will be scaled from 0.8x to 1x during pop-up animation
  - Will rotate and scale during hit animation
  - Ensure character is centered in the image with consistent padding

### Rare Mole (`mole-rare.png`)
- **Dimensions**: 256x256px (minimum), 512x512px (recommended)
- **Format**: PNG with transparent background
- **Aspect Ratio**: Square (1:1)
- **Content**: Distinctive mole character (different from common)
- **Color Scheme**: Blue tones (reference color: #4A90E2)
- **Visual Style**: Should look visually distinct from common mole
- **Animation Considerations**: Same as common mole

### Golden Mole (`mole-golden.png`)
- **Dimensions**: 256x256px (minimum), 512x512px (recommended)
- **Format**: PNG with transparent background
- **Aspect Ratio**: Square (1:1)
- **Content**: Special golden/glowing mole character
- **Color Scheme**: Gold/yellow tones (reference color: #FFD700)
- **Visual Style**: Should appear special/rare with glowing effects
- **Animation Considerations**: 
  - Will have additional glow animation applied via CSS
  - Ensure bright/glowing areas are included in the sprite itself
  - Consider adding sparkle/star effects around the character

### Hit State Sprites (Optional)
If you want custom hit animations instead of CSS transforms:
- **Naming**: `mole-{type}-hit.png` (e.g., `mole-common-hit.png`)
- **Dimensions**: Same as normal sprites
- **Format**: PNG with transparent background
- **Content**: Mole in a "hit" or "dizzy" pose (X eyes, stars, etc.)
- **Usage**: Will replace normal sprite when mole is hit

## 2. Hole/Burrow Sprites (Optional)

Currently, holes are rendered using CSS gradients. If you want custom hole graphics:

### Hole Sprite (`hole.png`)
- **Dimensions**: 300x180px (aspect ratio ~1.67:1, landscape)
- **Format**: PNG with transparent background
- **Content**: Hole/burrow opening seen from above
- **Visual Style**: 
  - Should create depth with shadow/dark interior
  - Must accommodate mole sprite emerging from it
  - Should blend with game field background
- **Color Scheme**: Dark brown/black tones (references: #4a3728, #2d1f14, #1a130d)
- **Note**: Holes are displayed at 90% width and 60% height, positioned at bottom of container

## 3. Background Graphics (Optional)

Currently, the game field uses a CSS gradient. If you want a custom background:

### Game Field Background (`game-field.png`)
- **Dimensions**: 1200x1200px (square, minimum)
- **Format**: PNG or JPG
- **Content**: Game field/ground texture
- **Tiling**: Should be tileable or designed for a single large background
- **Color Scheme**: Should complement mole colors (currently uses purple gradient: #7b4397 to #dc2430)
- **Note**: Will be used as background for the game grid container (max 600px width)

## 4. Technical Specifications

### Image Format Requirements
- **Primary Format**: PNG (for transparency support)
- **Compression**: Optimize for web (use tools like TinyPNG, ImageOptim, or similar)
- **Color Depth**: 32-bit RGBA (for transparency) or 24-bit RGB (for backgrounds)
- **File Size**: Aim for < 100KB per sprite (optimized)

### Retina/High-DPI Displays
- **Recommended**: Provide 2x versions (e.g., 512x512px for 256x256px base)
- **Naming Convention**: Use `@2x` suffix (e.g., `mole-common@2x.png`) OR use single high-res file
- **Implementation**: The code will scale down high-res images automatically

### Transparency
- All mole sprites MUST have transparent backgrounds
- Use proper alpha channel (not white/pink color keys)
- Ensure smooth edges (anti-aliasing)

### Centering & Padding
- Center the character within the canvas
- Leave 10-15% padding around edges
- Ensure consistent positioning across all mole types

## 5. Animation Requirements

Your sprites will be animated via CSS transforms. Consider these effects:

### Pop-Up Animation
- Mole scales from 80% to 100%
- Mole translates upward from below
- Duration: 0.2s

### Hit Animation
- Mole rotates (-10deg to +10deg)
- Mole scales (0.9x to 1.1x to 0.3x)
- Mole moves vertically (bouncing effect)
- Duration: 0.3s
- **Design Tip**: Design your sprite to look good when rotated ±10 degrees

### Hide Animation
- Reverse of pop-up
- Mole scales down and moves down
- Duration: 0.2s

### Golden Mole Glow
- Additional CSS filter animation
- Brightness pulses from 1.2x to 1.4x
- Drop shadow glow effect
- Duration: 2s (looping)

## 6. Design Guidelines

### Visual Consistency
- All mole types should share the same art style
- Keep proportions consistent across types
- Ensure similar visual weight/size

### Readability
- Moles should be clearly visible against the game field
- High contrast between mole and background
- Distinctive features help players identify mole types quickly

### Performance
- Keep sprite count low (use single sprites with CSS animations rather than sprite sheets)
- Optimize file sizes without visible quality loss
- Consider using WebP format (with PNG fallback) for better compression

## 7. File Naming Convention

Use lowercase with hyphens:
- ✅ `mole-common.png`
- ✅ `mole-rare.png`
- ✅ `mole-golden.png`
- ✅ `mole-common-hit.png`
- ❌ `Mole_Common.PNG` (avoid)
- ❌ `moleCommon.png` (avoid)

## 8. Integration Notes

After adding your sprites:
1. Place files in `src/assets/sprites/moles/{type}/` directories
2. Update `Mole.jsx` to use `<img>` tags instead of emoji
3. Update `Mole.css` to reference image paths
4. If using hit state sprites, add logic to swap images on hit
5. Test on various screen sizes and resolutions

## 9. Checklist for Asset Delivery

- [ ] Common mole sprite (256x256px minimum)
- [ ] Rare mole sprite (256x256px minimum)
- [ ] Golden mole sprite (256x256px minimum)
- [ ] All sprites have transparent backgrounds
- [ ] All sprites are optimized for web (< 100KB each)
- [ ] Sprites are centered with consistent padding
- [ ] Visual style is consistent across all mole types
- [ ] (Optional) Hit state sprites for each mole type
- [ ] (Optional) Hole/burrow sprite
- [ ] (Optional) Background image

## 10. Current Implementation Reference

The game currently uses:
- **Moles**: Emoji characters (🐹, 🐭, ✨🐹) with CSS styling
- **Holes**: CSS radial gradients creating burrow effect
- **Background**: CSS linear gradient (purple to red)

Your sprites will replace these CSS-based graphics. The animation timing and transforms will remain the same unless you modify the CSS files.

