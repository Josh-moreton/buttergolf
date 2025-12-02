# Vercel Blob Setup for Image Uploads

## What is Vercel Blob?

Vercel Blob is a serverless blob storage solution optimized for storing large files like images, videos, and other assets. It's perfect for user-uploaded content in your marketplace.

## Setup Steps

### 1. Create a Vercel Blob Store

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project (buttergolf)
3. Go to the **Storage** tab
4. Click **Create Database** → **Blob**
5. Give it a name (e.g., "buttergolf-uploads")
6. Click **Create**

### 2. Get Your Environment Variables

After creating the blob store, Vercel will provide you with a **read-write token**. Add this to your environment variables:

```bash
# Vercel Blob (for image uploads)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
```

### 3. Add to Your Project

**Local Development** (.env.local):

```bash
BLOB_READ_WRITE_TOKEN=your_token_here
```

**Production** (Vercel Dashboard):

- The token should be automatically added when you create the blob store
- If not, add it manually in: Settings → Environment Variables

## How It Works

1. **User uploads image** → Frontend component (`ImageUpload`)
2. **Image sent to API route** → `/api/upload`
3. **API route uploads to Vercel Blob** → Returns public URL
4. **URL saved to database** → Prisma `ProductImage` model
5. **Image displayed** → Using the public URL from Blob

## Pricing

**Free Tier:**

- 100GB bandwidth/month
- Unlimited storage
- Unlimited reads

**Pro Plan** (if needed):

- $0.15/GB bandwidth
- Perfect for growing marketplaces

## File Limits

Our current setup:

- **Max file size:** 10MB per image
- **Max images per product:** 5
- **Allowed formats:** JPEG, PNG, WebP, GIF
- **Access:** Public (anyone can view with URL)

## Usage in Code

```tsx
import { ImageUpload } from "@/components/ImageUpload";

function CreateListingForm() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleUploadComplete = (url: string) => {
    setImageUrls([...imageUrls, url]);
  };

  return (
    <ImageUpload
      onUploadComplete={handleUploadComplete}
      currentImages={imageUrls}
      maxImages={5}
    />
  );
}
```

## Security

- ✅ Authentication required (Clerk)
- ✅ File type validation
- ✅ File size limits
- ✅ Edge runtime (fast, scalable)
- ✅ Unique filenames (timestamp + random)

## Alternative Solutions

If you don't want to use Vercel Blob:

1. **Cloudinary** - Free tier, image optimization built-in
2. **AWS S3** - Most flexible, requires more setup
3. **Uploadthing** - Developer-friendly, good free tier
4. **Supabase Storage** - Open source, generous free tier

Let me know if you want to switch to any of these!
