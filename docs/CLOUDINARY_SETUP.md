# Cloudinary Image Upload & CDN Setup

This guide explains how to set up Cloudinary for image uploads with automatic background removal and branded backgrounds on the ButterGolf marketplace.

## Overview

ButterGolf uses Cloudinary for:

- **Image Hosting**: Permanent CDN-backed image storage
- **Background Removal**: AI-powered background removal on cover photos
- **Branded Backgrounds**: Automatic Vanilla Cream (#FFFAD2) background replacement
- **Auto Optimization**: Free format/quality optimization for all images
- **Global CDN**: Fast image delivery worldwide

## Why Cloudinary?

**Cloudinary is a permanent image hosting solution**, not just a transformation service:

✅ **Permanent URLs** - Images stored indefinitely in your account (like AWS S3)
✅ **CDN delivery** - Global CDN automatically serves optimized images
✅ **No separate storage** - Store Cloudinary URLs in database, not files
✅ **On-the-fly transformations** - Resize, crop, format via URL parameters
✅ **Industry standard** - Used by Netflix, Peloton, Lululemon for product images

We **replaced Vercel Blob entirely** with Cloudinary to consolidate image services.

## Setup Steps

### 1. Create Cloudinary Account

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Choose the free tier (includes 25 GB storage, 25 GB bandwidth)
3. Verify your email

### 2. Get API Credentials

1. Go to **Dashboard** → **Settings** → **Access Keys**
2. Copy your credentials:
   - **Cloud Name** (e.g., `dxxxxxxxx`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

### 3. Add Environment Variables

Add to `apps/web/.env.local`:

```bash
# Cloudinary (Image Uploads & CDN)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

⚠️ **Important**: Only `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is exposed to the client. Keep API key and secret server-side only.

### 4. Add to Vercel (Production)

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add all three variables:
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
3. Apply to **Production**, **Preview**, and **Development** environments
4. Redeploy your application

### 5. Install Dependencies

Already installed:

```bash
pnpm add cloudinary next-cloudinary
```

## How It Works

### Upload Flow

```
1. User uploads image in ImageUpload component
2. useImageUpload hook validates file (type, size)
3. Hook POSTs to /api/upload with file as body
4. API route uploads to Cloudinary with transformations:
   - First image: Background removal + Vanilla Cream background
   - Other images: Auto format/quality optimization only
5. Returns Cloudinary CDN URL
6. URL stored in database and displayed on site
```

### Background Removal Logic

**Cost Optimization Strategy:**

- ✅ **First image only** (cover photo) gets background removal
- ✅ **Vanilla Cream background** (#FFFAD2) applied after removal
- ✅ **Fallback to original** if removal fails (no error shown to user)

**Why first image only?**

- Cover photo is most visible in listings and search results
- Reduces Cloudinary transformation credits (cost control)
- Maintains consistent branded look where it matters most
- Other images show product in context (natural backgrounds useful)

### API Route Implementation

Location: `apps/web/src/app/api/upload/route.ts`

Key features:

- **Authentication**: Clerk user authentication required
- **File validation**: Type, size, format checks
- **Conditional transformation**: Background removal only for `isFirstImage=true`
- **Error handling**: Graceful fallback if transformation fails

### Cloudinary Transformations

**Cover Photo (First Image):**

```javascript
{
  effect: 'background_removal',  // AI-powered background removal
  background: 'rgb:FFFAD2',      // Vanilla Cream brand color (#FFFAD2)
}
```

**Other Images:**

```javascript
// No transformations applied at upload time
// Images stored as-is for natural product context
```

**Note**: Auto format (`f_auto`) and quality (`q_auto`) optimizations are applied via URL delivery parameters, not upload transformations. You can add these to image URLs when displaying them:

```
# With auto optimization
https://res.cloudinary.com/.../f_auto,q_auto/products/{public_id}.jpg
```

## URL Structure

Cloudinary returns permanent CDN URLs:

```
https://res.cloudinary.com/{cloud_name}/image/upload/e_background_removal,b_rgb:FFFAD2/{public_id}.jpg
```

**URL Components:**

- `res.cloudinary.com` - CDN domain
- `{cloud_name}` - Your account identifier
- `image/upload` - Resource type
- `e_background_removal,b_rgb:FFFAD2` - Transformations applied
- `{public_id}` - Unique image identifier (stored in DB)

**On-the-fly transformations** (add to URL for different sizes):

```
# Thumbnail (150x150)
.../w_150,h_150,c_fill/{public_id}.jpg

# Product listing (400x400)
.../w_400,h_400,c_fit/{public_id}.jpg

# Full size
.../{public_id}.jpg
```

## Database Storage

Store the **full Cloudinary URL** in your database:

```typescript
// Prisma schema (packages/db/prisma/schema.prisma)
model Product {
  id     String   @id @default(cuid())
  images String[] // Array of Cloudinary URLs
  // ... other fields
}
```

**Example data:**

```json
{
  "images": [
    "https://res.cloudinary.com/buttergolf/image/upload/e_background_removal,b_rgb:FFFAD2/products/1732000000-abc123.jpg",
    "https://res.cloudinary.com/buttergolf/image/upload/products/1732000001-def456.jpg",
    "https://res.cloudinary.com/buttergolf/image/upload/products/1732000002-ghi789.jpg"
  ]
}
```

## Cost Management

### Free Tier Limits

- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25,000 credits/month
- **Background removal**: ~5-10 credits per image

### Cost Optimization Strategies

1. ✅ **First image only** - We only apply background removal to cover photos
2. ✅ **Auto optimization** - Free format/quality improvements
3. ✅ **CDN caching** - Transformations cached globally
4. ⚠️ **Monitor usage** - Check Cloudinary dashboard monthly
5. 💡 **Upgrade if needed** - Pay-as-you-go pricing for high volume

### Estimated Usage

**Per product listing:**

- Cover photo: ~10 credits (background removal)
- 4 additional photos: 0 credits (auto optimization is free)
- **Total**: ~10 credits per listing

**Free tier capacity:**

- 25,000 credits / 10 credits per listing = **~2,500 product listings/month**

## Testing

### Local Testing

1. Set environment variables in `apps/web/.env.local`
2. Start dev server: `pnpm dev:web`
3. Go to `/sell` page
4. Upload images and verify:
   - First image has Vanilla Cream background
   - Other images are optimized but keep original background
   - Images display correctly in preview

### Production Testing

1. Deploy to Vercel with environment variables set
2. Create a test listing with 5 images
3. Verify in Cloudinary dashboard:
   - Images appear in **Media Library** under `products/` folder
   - Transformations applied to first image
   - View transformation details in image inspector

## Troubleshooting

### Error: "Image upload is not configured"

**Cause**: Missing environment variables

**Fix**: Ensure all three variables are set in `.env.local` (local) or Vercel (production)

### Background removal not working

**Cause**: AI may fail on certain images (no clear subject, low quality, etc.)

**Fix**: Application falls back to original image automatically. User won't see error—just no background removal applied.

### Images not displaying

**Cause**: Incorrect Cloudinary cloud name or public ID

**Fix**: Check database URLs match format: `https://res.cloudinary.com/{cloud_name}/...`

### Rate limit errors

**Cause**: Exceeded free tier limits

**Fix**: Check Cloudinary dashboard usage, consider upgrading plan

## Advanced Features (Future)

Cloudinary supports many advanced features we can add later:

- **AI cropping** - Automatic smart crop to focus on subject
- **AI tagging** - Automatic tag generation for product categorization
- **Multiple backgrounds** - A/B test different background colors
- **Watermarking** - Add ButterGolf watermark to images
- **Image moderation** - Detect inappropriate content automatically

## Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Background Removal Guide](https://cloudinary.com/documentation/background_removal_addon)
- [Node.js SDK Reference](https://cloudinary.com/documentation/node_integration)
- [Next.js Integration](https://next.cloudinary.dev/)

## Support

For issues or questions:

1. Check [Cloudinary Status Page](https://status.cloudinary.com/)
2. Review [Cloudinary Community Forum](https://community.cloudinary.com/)
3. Contact ButterGolf dev team in Slack #engineering
