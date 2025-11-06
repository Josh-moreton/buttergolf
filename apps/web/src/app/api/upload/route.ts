import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export const runtime = 'edge';

export async function POST(request: Request): Promise<NextResponse> {
  // Check if Vercel Blob is configured
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('BLOB_READ_WRITE_TOKEN is not configured');
    return NextResponse.json(
      {
        error: 'Image upload is not configured. Please add BLOB_READ_WRITE_TOKEN to your environment variables.',
        details: 'See docs/VERCEL_BLOB_SETUP.md for setup instructions'
      },
      { status: 500 }
    );
  }

  // Authenticate user
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Get the file from the request
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json(
      { error: 'Filename is required' },
      { status: 400 }
    );
  }

  // Validate file type (images only)
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  const contentType = request.headers.get('content-type');

  if (!contentType || !allowedTypes.includes(contentType)) {
    return NextResponse.json(
      { error: 'Invalid file type. Only images are allowed.' },
      { status: 400 }
    );
  }

  try {
    // Upload to Vercel Blob
    const blob = await put(filename, request.body as ReadableStream, {
      access: 'public',
      contentType,
    });

    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType,
    });
  } catch (error) {
    console.error('Upload error:', error);

    // Provide more specific error messages
    const errorMessage = error instanceof Error ? error.message : 'Upload failed';

    return NextResponse.json(
      {
        error: 'Failed to upload image',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
