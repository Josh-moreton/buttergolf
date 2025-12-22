# Image Crop Coordinate Scaling Fix

## 🐛 The Bug

**Symptom**: When cropping images on the sell page, the uploaded image showed a small square of background instead of the cropped area (e.g., club head).

**Root Cause**: Classic coordinate scaling mismatch between displayed and natural image dimensions.

## 📊 Technical Explanation

### The Problem

The image cropping flow had a fundamental coordinate system mismatch:

1. **Original Image**: User uploads 4000px × 3000px photo
2. **Displayed Image**: CSS scales it to ~800px × 600px to fit modal (`maxWidth: "100%", maxHeight: "60vh"`)
3. **User Crops**: Selects club head at coordinates `{ x: 200, y: 200, width: 400, height: 400 }` (relative to 800px displayed image)
4. **Bug**: Code used those coordinates directly on the 4000px natural image
5. **Result**: Drew a tiny 400×400px square from top-left of 4000px image (just background)

### Why No Console Errors?

The code was technically valid:
- Canvas API accepted all parameters
- `drawImage()` executed successfully
- Cloudinary received a valid image
- The crop was just from the **wrong location**

### The Math

```
Scale Factors:
- scaleX = naturalWidth / displayedWidth = 4000 / 800 = 5
- scaleY = naturalHeight / displayedHeight = 3000 / 600 = 5

Before Fix (WRONG):
- Canvas draws from: (200, 200, 400, 400) on 4000px image
- Result: Tiny top-left corner

After Fix (CORRECT):
- Canvas draws from: (200*5, 200*5, 400*5, 400*5) = (1000, 1000, 2000, 2000) on 4000px image
- Result: Actual cropped area in full resolution
```

## 🔧 The Fix

### Code Changes

**File**: `apps/web/src/components/ImageCropModal.tsx`

Added coordinate scaling in the `getCroppedImg` function:

```typescript
// Calculate scale factors
const scaleX = image.naturalWidth / image.width;
const scaleY = image.naturalHeight / image.height;

// Scale canvas to natural dimensions
canvas.width = crop.width * scaleX;
canvas.height = crop.height * scaleY;

// Draw with scaled coordinates
ctx.drawImage(
  image,
  crop.x * scaleX,      // Scale source x
  crop.y * scaleY,      // Scale source y
  crop.width * scaleX,  // Scale source width
  crop.height * scaleY, // Scale source height
  0,                    // Destination x (always 0)
  0,                    // Destination y (always 0)
  crop.width * scaleX,  // Destination width
  crop.height * scaleY  // Destination height
);
```

### Debug Logging

Added comprehensive logging to verify the fix:

#### Client-Side (ImageCropModal.tsx)
```
🖼️ Image Crop Debug: {
  natural: { width: 4000, height: 3000 },
  displayed: { width: 800, height: 600 },
  scale: { x: 5, y: 5 },
  cropDisplayed: { x: 200, y: 200, width: 400, height: 400 },
  cropNatural: { x: 1000, y: 1000, width: 2000, height: 2000 }
}
```

#### Server-Side (api/upload/route.ts)
```
📤 Cloudinary Upload: {
  filename: "1734012345-abc123.jpg",
  contentType: "image/jpeg",
  sizeBytes: 524288,
  sizeMB: "0.50",
  isFirstImage: true,
  userId: "user_abc123"
}

✅ Cloudinary Upload Success: {
  publicId: "products/1734012345-abc123",
  url: "https://res.cloudinary.com/...",
  dimensions: "2000x2000",
  format: "jpg",
  bytes: 524288
}
```

## ✅ Verification Steps

### 1. Test the Fix

1. Go to `/sell` page
2. Upload a photo of a golf club (or any object with distinct features)
3. Adjust crop to focus on specific area (e.g., club head)
4. Click "Apply Crop"

### 2. Check Console Output

**Browser Console** (F12 → Console):
```
🖼️ Image Crop Debug: {
  natural: { width: ..., height: ... },    // Original image size
  displayed: { width: ..., height: ... },  // Scaled display size
  scale: { x: ..., y: ... },               // Should be > 1 for large images
  cropDisplayed: { ... },                   // What you see in modal
  cropNatural: { ... }                      // What gets sent to Cloudinary
}
```

**Server Logs** (terminal running `pnpm dev:web`):
```
📤 Cloudinary Upload: {
  sizeBytes: ...,          // Cropped file size
  dimensions: "...x...",   // Should match cropNatural dimensions
  isFirstImage: true/false
}

✅ Cloudinary Upload Success: {
  dimensions: "...x...",   // Final uploaded size
  url: "https://..."       // Cloudinary URL
}
```

### 3. Verify Uploaded Image

1. Check uploaded image preview in sell form
2. Verify it shows the cropped area (not background)
3. For first image, verify background removal worked correctly

## 🚨 Common Issues to Watch For

### Issue 1: Scale Factor = 1
If `scale.x` and `scale.y` are both `1`, it means:
- Image is displayed at natural size, OR
- Image is very small

This is fine, but unusual for modern phone cameras.

### Issue 2: Very Large Natural Dimensions
If natural dimensions are > 10,000px:
- File size may exceed 10MB limit
- Upload may be slow
- Consider adding image compression before crop

### Issue 3: Different Scale Factors (scaleX ≠ scaleY)
If `scaleX` and `scaleY` differ significantly:
- Image aspect ratio is being distorted by CSS
- May indicate layout issue in modal
- Crop should still work correctly

## 📚 Related Files

| File | Purpose |
|------|---------|
| `apps/web/src/components/ImageCropModal.tsx` | Crop UI and coordinate scaling |
| `apps/web/src/components/ImageUpload.tsx` | Upload UI and file handling |
| `apps/web/src/hooks/useImageUpload.ts` | Upload logic and validation |
| `apps/web/src/app/api/upload/route.ts` | Cloudinary upload endpoint |
| `apps/web/src/app/sell/page.tsx` | Sell form page |

## 🔍 Testing Checklist

- [ ] Upload large image (>2000px) and verify crop works
- [ ] Upload small image (<500px) and verify crop works
- [ ] Crop from different areas (top, bottom, left, right, center)
- [ ] Verify first image gets background removal applied
- [ ] Verify subsequent images upload without background removal
- [ ] Check console logs show correct scaling factors
- [ ] Check server logs show correct dimensions
- [ ] Verify Cloudinary image matches crop selection

## 📝 Prevention

This bug category can be prevented by:

1. **Always scale coordinates** when canvas source differs from display
2. **Add debug logging** for image operations
3. **Test with real photos** (not small test images)
4. **Verify naturalWidth !== width** in tests

## 🎯 Future Improvements

Consider adding:
- [ ] Image compression before upload (reduce file size)
- [ ] Progress bar during crop processing
- [ ] Preview of cropped result before upload
- [ ] Undo/redo crop functionality
- [ ] Save crop settings as preset
