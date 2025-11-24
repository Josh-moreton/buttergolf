# Background Pattern Setup

## Overview

The Butter Golf branded background pattern is used for product images after background removal. When sellers upload product photos, the first image automatically gets:
1. AI-powered background removal
2. Branded "Butter Golf" tiled pattern as the new background

## Files

- **Pattern Image**: `apps/web/public/backgrounds/butter-pattern.png` - The diagonal "Butter Golf" wordmark pattern
- **Upload Script**: `scripts/upload-background-pattern.ts` - One-time script to upload pattern to Cloudinary
- **API Route**: `apps/web/src/app/api/upload/route.ts` - Applies the pattern during image upload

## Setup (One-Time)

### 1. Upload the Background Pattern to Cloudinary

Run this command from the project root:

```bash
pnpm tsx scripts/upload-background-pattern.ts
```

This will:
- Upload `butter-pattern.png` to Cloudinary
- Store it at `backgrounds/butter-pattern`
- Make it available for use in transformations

### 2. Verify the Upload

The script will output:
```
✅ Background pattern uploaded successfully!
📍 Public ID: backgrounds/butter-pattern
🔗 URL: https://res.cloudinary.com/buttergolf/image/upload/backgrounds/butter-pattern.png
📐 Dimensions: [width]x[height]
```

## How It Works

### Transformation Pipeline

When a seller uploads the first product image:

```typescript
{
  effect: 'background_removal',  // 1. Remove original background
},
{
  underlay: 'backgrounds:butter-pattern',  // 2. Apply branded pattern
  width: 'iw',                             // 3. Match original image width
  height: 'ih',                            // 4. Match original image height
  flags: 'layer_apply,tiled',              // 5. Tile pattern to fill
}
```

### URL Structure

Original upload:
```
https://res.cloudinary.com/buttergolf/image/upload/v1234567890/products/my-product.jpg
```

With transformation:
```
https://res.cloudinary.com/buttergolf/image/upload/
  e_background_removal/
  u_backgrounds:butter-pattern,w_iw,h_ih,fl_layer_apply.tiled/
  products/my-product.jpg
```

## Cost Optimization

- Background removal applied **only to first image** (cover photo)
- Other product images upload without transformation
- Estimated cost: ~10 credits per listing on Cloudinary free tier

## Updating the Pattern

If you need to change the background pattern:

1. Replace `apps/web/public/backgrounds/butter-pattern.png` with new image
2. Re-run: `pnpm tsx scripts/upload-background-pattern.ts`
3. The script uses `overwrite: true` so it will replace the existing pattern

## Testing

1. Go to `/sell` page
2. Upload a product image with a clear subject and background
3. The first image should display with the Butter Golf pattern behind the product
4. Verify in browser DevTools that the Cloudinary URL includes the transformation parameters

## Troubleshooting

### Pattern not appearing

- Check Cloudinary dashboard: Media Library → backgrounds folder
- Verify `butter-pattern` exists
- Check browser console for upload errors

### Pattern looks distorted

- The `tiled` flag repeats the pattern to fill the space
- If the pattern tile is too large/small, edit the source image size
- Recommended tile size: 200-400px square for optimal tiling

### Upload fails

- Verify Cloudinary credentials in `.env.local`:
  - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
- Check free tier limits (25 transformation credits/month)

## Related Documentation

- [Cloudinary Background Removal](https://cloudinary.com/documentation/background_removal_addon)
- [Cloudinary Layers](https://cloudinary.com/documentation/layers)
- [Image Upload API](../apps/web/src/app/api/upload/route.ts)
