import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@buttergolf/db";
import { getUserIdFromRequest } from "@/lib/auth";

/**
 * GET /api/favourites
 * Fetch all products favourited by the authenticated user
 * Returns array of products with their details (images, category, seller info)
 * Supports both web (session cookies) and mobile (Bearer token) authentication
 */
export async function GET(req: NextRequest) {
  try {
    const clerkId = await getUserIdFromRequest(req);

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    if (!user) {
      // User not synced yet, return empty array
      return NextResponse.json({
        products: [],
        pagination: {
          page: 1,
          limit: 24,
          total: 0,
          totalPages: 0,
        },
      });
    }

    // Get pagination params
    const searchParams = req.nextUrl.searchParams;
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "24");
    const skip = (page - 1) * limit;

    // Fetch user's favourites with product details
    const [favourites, totalCount] = await Promise.all([
      prisma.favourite.findMany({
        where: { userId: user.id },
        include: {
          product: {
            include: {
              images: {
                take: 1,
                orderBy: { sortOrder: "asc" },
              },
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  averageRating: true,
                  ratingCount: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.favourite.count({
        where: { userId: user.id },
      }),
    ]);

    // Transform to product data format
    const products = favourites.map((fav) => ({
      id: fav.product.id,
      title: fav.product.title,
      description: fav.product.description,
      price: fav.product.price,
      condition: fav.product.condition,
      imageUrl: fav.product.images[0]?.url || null,
      category: fav.product.category?.name || "Uncategorized",
      seller: fav.product.user
        ? {
            id: fav.product.user.id,
            firstName: fav.product.user.firstName,
            lastName: fav.product.user.lastName,
            averageRating: fav.product.user.averageRating,
            ratingCount: fav.product.user.ratingCount,
          }
        : null,
      createdAt: fav.product.createdAt,
      favouritedAt: fav.createdAt,
    }));

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching favourites:", error);
    return NextResponse.json(
      { error: "Failed to fetch favourites" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/favourites
 * Add a product to the authenticated user's favourites
 * Body: { productId: string }
 * Supports both web (session cookies) and mobile (Bearer token) authentication
 */
export async function POST(req: NextRequest) {
  try {
    const clerkId = await getUserIdFromRequest(req);

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { productId } = body;

    if (!productId || typeof productId !== "string") {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Ensure user exists in database (create if webhook hasn't synced yet)
    const user = await prisma.user.upsert({
      where: { clerkId },
      update: {},
      create: {
        clerkId,
        email: `temp-${clerkId}@buttergolf.app`, // Temporary email, will be updated by webhook
        firstName: "User", // Placeholder, will be updated by webhook
        lastName: "",
      },
    });

    // Create favourite (unique constraint prevents duplicates)
    try {
      const favourite = await prisma.favourite.create({
        data: {
          userId: user.id, // Use database User ID, not Clerk ID
          productId,
        },
      });

      return NextResponse.json(
        {
          success: true,
          favourite: {
            id: favourite.id,
            productId: favourite.productId,
            createdAt: favourite.createdAt,
          },
        },
        { status: 201 },
      );
    } catch (error: unknown) {
      // Handle duplicate favourite (unique constraint violation)
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "P2002"
      ) {
        return NextResponse.json(
          { error: "Product already in favourites" },
          { status: 409 },
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Error adding favourite:", error);
    return NextResponse.json(
      { error: "Failed to add favourite" },
      { status: 500 },
    );
  }
}
