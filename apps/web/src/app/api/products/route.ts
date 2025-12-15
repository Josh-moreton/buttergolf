import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma, ProductCondition } from "@buttergolf/db";

export async function POST(request: Request) {
  try {
    // Authenticate user
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get or create user from database
    // This ensures user exists even if webhook hasn't fired yet
    let user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      // Create user if not found (fallback for webhook delays)
      // In production, the webhook should handle this
      // We need to fetch the full user profile to get the name
      const clerkUser = await currentUser();

      if (!clerkUser) {
        return NextResponse.json({ error: "User not found" }, { status: 401 });
      }

      // Build user name from Clerk profile
      // Priority: firstName + lastName > username > email prefix
      let userName = "";
      if (clerkUser.firstName || clerkUser.lastName) {
        userName = [clerkUser.firstName, clerkUser.lastName]
          .filter(Boolean)
          .join(" ");
      } else if (clerkUser.username) {
        userName = clerkUser.username;
      } else if (clerkUser.emailAddresses?.[0]?.emailAddress) {
        // Use email prefix as fallback
        userName = clerkUser.emailAddresses[0].emailAddress.split("@")[0];
      } else {
        // Last resort fallback
        userName = "Golf Enthusiast";
      }

      user = await prisma.user.create({
        data: {
          clerkId,
          email:
            clerkUser.emailAddresses?.[0]?.emailAddress ||
            `user-${clerkId}@temp.local`,
          name: userName,
          imageUrl: clerkUser.imageUrl || null,
        },
      });
    }

    // Parse request body
    const body = await request.json();
    const {
      title,
      description,
      price,
      condition,
      brandId,
      model,
      clubKind, // Optional: used for creating/updating ClubModel
      categoryId,
      images,
      // Golf club specific fields
      flex,
      loft,
      // Shipping dimensions
      length,
      width,
      height,
      weight,
    } = body;

    // Validate required fields
    if (!title || !description || !price || !categoryId || !condition) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: "At least one image is required" },
        { status: 400 },
      );
    }

    // Validate condition enum
    if (!Object.values(ProductCondition).includes(condition)) {
      return NextResponse.json(
        { error: "Invalid condition value" },
        { status: 400 },
      );
    }

    // Validate brandId exists if provided
    if (brandId) {
      const brandExists = await prisma.brand.findUnique({
        where: { id: brandId },
      });
      if (!brandExists) {
        return NextResponse.json({ error: "Invalid brandId" }, { status: 400 });
      }
    }

    // If model and brandId provided, create or update ClubModel record
    if (model && brandId && clubKind) {
      const existingModel = await prisma.clubModel.findUnique({
        where: {
          brandId_name_kind: {
            brandId,
            name: model,
            kind: clubKind,
          },
        },
      });

      if (existingModel) {
        // Increment usage count
        await prisma.clubModel.update({
          where: { id: existingModel.id },
          data: {
            usageCount: { increment: 1 },
            // Auto-verify after 3+ uses
            isVerified:
              existingModel.usageCount >= 2 ? true : existingModel.isVerified,
          },
        });
      } else {
        // Create new ClubModel
        await prisma.clubModel.create({
          data: {
            brandId,
            name: model,
            kind: clubKind,
            usageCount: 1,
            isVerified: false,
          },
        });
      }
    }

    // Create product with images
    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: Number(price),
        condition,
        brandId: brandId || null,
        model: model || null,
        userId: user.id,
        categoryId,
        // Golf club specific fields
        flex: flex || null,
        loft: loft || null,
        // Shipping dimensions
        length: length ? Number(length) : null,
        width: width ? Number(width) : null,
        height: height ? Number(height) : null,
        weight: weight ? Number(weight) : null,
        images: {
          create: images.map((url: string, index: number) => ({
            url,
            sortOrder: index,
          })),
        },
      },
      include: {
        images: true,
        category: true,
        brand: true,
        user: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const userId = searchParams.get("userId");
    const isSold = searchParams.get("isSold");

    const products = await prisma.product.findMany({
      where: {
        ...(categoryId && { categoryId }),
        ...(userId && { userId }),
        ...(isSold !== null && { isSold: isSold === "true" }),
      },
      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
        category: true,
        user: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
