# Social Media Preview Image

Create a file named `og-image.png` in this folder for social media previews.

## Specifications

- **Filename:** `og-image.png`
- **Dimensions:** 1200 x 630 pixels (1.91:1 aspect ratio)
- **Format:** PNG or JPG
- **Max file size:** Under 1MB recommended

## Design Recommendations

1. Use your game logo (`src/assets/logos/game-logo.png`) as the centerpiece
2. Add a solid or gradient background using your brand color `#8eae7c` (sage green)
3. Ensure the logo is large and centered with padding around edges
4. The image should be visually striking at small preview sizes

## Quick Creation Options

### Option 1: Figma/Canva
1. Create a 1200x630 canvas
2. Fill background with `#8eae7c` or a darker variant
3. Place your game-logo.png centered
4. Export as PNG

### Option 2: Command Line (ImageMagick)
```bash
magick -size 1200x630 xc:"#8eae7c" \
  \( src/assets/logos/game-logo.png -resize 500x500 \) \
  -gravity center -composite public/og-image.png
```

### Option 3: Online Tools
- [Canva](https://canva.com) - Free, easy drag-and-drop
- [Figma](https://figma.com) - Free, more control
- [Pablo by Buffer](https://pablo.buffer.com) - Quick social images

## Testing Your Preview

After deploying, test how your link appears:
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- [OpenGraph.xyz](https://www.opengraph.xyz/) - Universal preview tester
