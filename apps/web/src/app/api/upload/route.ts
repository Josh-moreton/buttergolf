import { v2 as cloudinary, UploadApiOptions } from "cloudinary";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { verifyToken } from "@clerk/backend";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Get user ID from either Clerk session (web) or Bearer token (mobile).
 * Mobile apps send Authorization: Bearer <token> header.
 */
async function getUserId(request: Request): Promise<string | null> {
  // First try Clerk's built-in auth (works for web with cookies)
  const { userId } = await auth();
  if (userId) {
    return userId;
  }

  // If no session, try to verify Bearer token (for mobile apps)
  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    try {
      const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY!,
      });
      return payload.sub; // sub is the user ID
    } catch (error) {
      console.error("Token verification failed:", error);
      return null;
    }
  }

  return null;
}

export async function POST(request: Request): Promise<NextResponse> {
  // Handle CORS for mobile requests
  const origin = request.headers.get("origin");
  const corsHeaders = {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  // Check if Cloudinary is configured
  if (
    !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    console.error("Cloudinary is not configured");
    return NextResponse.json(
      {
        error:
          "Image upload is not configured. Please add Cloudinary credentials to your environment variables.",
        details:
          "Required: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET",
      },
      { status: 500, headers: corsHeaders },
    );
  }

  // Authenticate user (supports both web cookies and mobile Bearer token)
  const userId = await getUserId(request);

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: corsHeaders },
    );
  }

  // Get the file from the request
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");
  const isFirstImage = searchParams.get("isFirstImage") === "true";

  if (!filename) {
    return NextResponse.json(
      { error: "Filename is required" },
      { status: 400 },
    );
  }

  // Validate file type (images only)
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];
  const contentType = request.headers.get("content-type");

  if (!contentType || !allowedTypes.includes(contentType)) {
    return NextResponse.json(
      { error: "Invalid file type. Only images are allowed." },
      { status: 400, headers: corsHeaders },
    );
  }

  try {
    // Convert request body to base64 for Cloudinary upload
    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = `data:${contentType};base64,${buffer.toString("base64")}`;

    // Debug logging
    console.log("📤 Cloudinary Upload:", {
      filename,
      contentType,
      sizeBytes: buffer.length,
      sizeMB: (buffer.length / (1024 * 1024)).toFixed(2),
      isFirstImage,
      userId,
    });

    // Build upload options
    const uploadOptions: UploadApiOptions = {
      folder: "products",
      public_id: filename.replace(/\.[^/.]+$/, ""), // Remove file extension
      resource_type: "image",
    };

    // Apply background removal transformation ONLY to first image
    // This transformation is applied to the ALREADY CROPPED image blob from ImageCropModal
    if (isFirstImage) {
      uploadOptions.transformation = [
        {
          effect: "background_removal",
        },
        {
          underlay: "backgrounds:butter-pattern",
          flags: "tiled",
        },
        {
          flags: "layer_apply",
        },
        {
          // Crop the final result back to the original (cropped) image dimensions
          // gravity: "center" ensures we crop equally from all sides, keeping the original image intact
          crop: "crop",
          width: "iw",
          height: "ih",
          gravity: "center",
        },
      ];
    }

    // Debug: Log the image dimensions being uploaded
    console.log("📐 Uploading image data:", {
      base64Length: base64Image.length,
      estimatedSizeKB: Math.round((base64Image.length * 0.75) / 1024),
      isFirstImage,
    });

    // Upload the CROPPED image to Cloudinary with transformation
    // The blob is already cropped by ImageCropModal, SDK applies background transformation to it
    const result = await cloudinary.uploader.upload(base64Image, uploadOptions);

    console.log("✅ Cloudinary Upload Success:", {
      publicId: result.public_id,
      url: result.secure_url,
      dimensions: `${result.width}x${result.height}`,
      format: result.format,
      bytes: result.bytes,
    });

    return NextResponse.json(
      {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      },
      { headers: corsHeaders },
    );
  } catch (error) {
    console.error("Upload error:", error);

    // Provide more specific error messages
    const errorMessage =
      error instanceof Error ? error.message : "Upload failed";

    // If background removal fails, provide helpful error
    if (errorMessage.includes("background_removal")) {
      return NextResponse.json(
        {
          error: "Background removal failed",
          details:
            "The image may not be suitable for automatic background removal. Please try a different image or contact support.",
          fallback: "Upload will proceed without background removal",
        },
        { status: 500, headers: corsHeaders },
      );
    }

    return NextResponse.json(
      {
        error: "Failed to upload image",
        details: errorMessage,
      },
      { status: 500, headers: corsHeaders },
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS(request: Request): Promise<NextResponse> {
  const origin = request.headers.get("origin");
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": origin || "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}
