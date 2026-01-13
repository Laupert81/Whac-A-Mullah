# Custom Home Screen Icons

To add custom home screen icons for your PWA, place your icon files in this `public/` folder.

## Required Icon Files

Create and place these files in the `public/` folder:

### 1. PWA Icons (for Android/Chrome)
- **`pwa-192x192.png`** - 192x192 pixels (required)
- **`pwa-512x512.png`** - 512x512 pixels (required)

### 2. Apple Touch Icon (for iOS)
- **`apple-touch-icon.png`** - 180x180 pixels

### 3. Favicon (for browser tabs)
- **`favicon.ico`** - 16x16, 32x32, 48x48 pixels (multi-size ICO file)

## Quick Setup Steps

1. **Create your icon design**
   - Start with a 512x512 pixel square image
   - Use PNG format with transparency support
   - Keep it simple and recognizable at small sizes

2. **Generate all required sizes**
   - Use an image editor (Photoshop, GIMP, Figma, etc.) or online tool
   - Resize your icon to each required size
   - Save each size with the exact filename listed above

3. **Place files in `public/` folder**
   ```
   public/
   ├── pwa-192x192.png
   ├── pwa-512x512.png
   ├── apple-touch-icon.png
   └── favicon.ico
   ```

4. **Build your app**
   ```bash
   npm run build
   ```

## Icon Design Tips

- **Keep it simple**: Icons should be recognizable at small sizes (192x192)
- **Use high contrast**: Ensure your icon stands out on various backgrounds
- **Avoid text**: Text becomes unreadable at small sizes
- **Test at different sizes**: Preview your icon at 192x192 to see how it looks on mobile
- **Consider safe zone**: Keep important elements in the center 80% of the icon (for maskable icons)

## Online Icon Generators

If you need help generating multiple sizes, you can use:
- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Favicon.io](https://favicon.io/)

## Using a Single Source Icon

If you have one large icon (e.g., `icon.png` at 512x512), you can:
1. Use an online tool to generate all sizes
2. Or use image editing software to resize manually
3. Save each size with the exact filenames listed above
