# Image Upload Error Fix

## Error Encountered

```
Console SyntaxError
Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

## Root Cause

The `BLOB_READ_WRITE_TOKEN` environment variable is not configured. When the API tries to upload to Vercel Blob without this token, it fails and returns an HTML error page instead of JSON, causing the parsing error.

## Solution

### Option 1: Set Up Vercel Blob (Recommended for Production)

1. **Create a Vercel Blob Store**:
   - Go to: https://vercel.com/dashboard
   - Select your project: `buttergolf`
   - Navigate to: **Storage** tab
   - Click: **Create Database** → **Blob**
   - Name it: `buttergolf-uploads`
   - Click: **Create**

2. **Copy the Token**:
   - After creation, Vercel will show you: `BLOB_READ_WRITE_TOKEN`
   - Copy this token

3. **Add to Local Environment**:
   Create/edit `apps/web/.env.local`:
   ```bash
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
   ```

4. **Restart Dev Server**:
   ```bash
   pnpm dev:web
   ```

5. **Test Upload**:
   - Navigate to: http://localhost:3000/sell
   - Try uploading an image
   - Should now work! ✅

### Option 2: Mock Upload for Development (Quick Fix)

If you just want to test the sell page without setting up Vercel Blob, you can temporarily mock the upload:

**Create**: `apps/web/src/app/api/upload/route.ts` (replace existing content):

```typescript
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export const runtime = 'edge';

export async function POST(request: Request): Promise<NextResponse> {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // MOCK: Return a placeholder image URL
  return NextResponse.json({
    url: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400',
    pathname: 'mock-image.jpg',
    contentType: 'image/jpeg',
  });
}
```

**Note**: This is only for development testing. Use Option 1 for production.

## Improved Error Handling

I've updated the API route to:
- ✅ Check for `BLOB_READ_WRITE_TOKEN` before attempting upload
- ✅ Return helpful JSON error messages (not HTML)
- ✅ Provide setup instructions in error response
- ✅ Include detailed error information

Now when the token is missing, you'll see:
```json
{
  "error": "Image upload is not configured. Please add BLOB_READ_WRITE_TOKEN to your environment variables.",
  "details": "See docs/VERCEL_BLOB_SETUP.md for setup instructions"
}
```

## Vercel Blob Pricing

**Free Tier** (Hobby):
- ✅ 100GB bandwidth/month
- ✅ Unlimited storage
- ✅ Unlimited reads
- ✅ Perfect for development and MVP

**Pro Plan** (if needed):
- $0.15/GB bandwidth
- Still very affordable for growing apps

## Alternative Services

If you don't want to use Vercel Blob:

1. **Cloudinary** - Free 25GB/month, great image optimization
2. **Uploadthing** - Developer-friendly, 2GB free
3. **Supabase Storage** - Open source, 1GB free
4. **AWS S3** - Most flexible, pay-as-you-go

## Testing the Fix

After setting up:

1. **Start dev server**: `pnpm dev:web`
2. **Navigate to**: http://localhost:3000/sell
3. **Sign in** (required for uploads)
4. **Upload an image**:
   - Drag and drop, or click to select
   - Should see: "Uploading... X%"
   - Should complete successfully
5. **Verify**: Image appears in the preview grid

## Troubleshooting

### Still seeing the error?

1. **Check .env.local exists** in `apps/web/`
2. **Restart dev server** after adding env var
3. **Verify token** starts with `vercel_blob_rw_`
4. **Check console** for detailed error messages

### Token not working?

1. **Regenerate token** in Vercel dashboard
2. **Check project** is connected to Vercel
3. **Verify** you're in the correct project

### Need help?

See full setup guide: `docs/VERCEL_BLOB_SETUP.md`

---

**Status**: ✅ Error handling improved  
**Next Step**: Set up Vercel Blob token  
**Time to fix**: 2-5 minutes
