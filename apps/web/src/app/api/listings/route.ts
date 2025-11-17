import { NextRequest, NextResponse } from "next/server";
import { prisma, Prisma, ProductCondition } from "@buttergolf/db";
import type { ProductCardData } from "@buttergolf/app";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "24");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ProductWhereInput = {
      isSold: false,
    };

    // Category filter (slug)
    const category = searchParams.get("category");
    if (category) {
      where.category = { slug: category };
    }

    // Condition filter (multiple)
    const conditions = searchParams.getAll("condition") as ProductCondition[];
    if (conditions.length > 0) {
      where.condition = { in: conditions };
    }

    // Price range
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice || maxPrice) {
      where.price = {
        ...(minPrice && { gte: parseFloat(minPrice) }),
        ...(maxPrice && { lte: parseFloat(maxPrice) }),
      };
    }

    // Brand filter (multiple)
    const brands = searchParams.getAll("brand");
    if (brands.length > 0) {
      where.brandId = { in: brands };
    }

    // Search query
    const query = searchParams.get("q");
    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { model: { contains: query, mode: "insensitive" } },
        { brand: { name: { contains: query, mode: "insensitive" } } },
      ];
    }

    // Sort options
    const sort = searchParams.get("sort") || "newest";
    // Default sort
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };

    switch (sort) {
      case "price-asc":
        orderBy = { price: "asc" };
        break;
      case "price-desc":
        orderBy = { price: "desc" };
        break;
      case "popular":
        orderBy = { views: "desc" };
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    // Fetch products
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: {
            orderBy: { sortOrder: "asc" },
            take: 1,
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
              name: true,
              averageRating: true,
              ratingCount: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Get filter options (available brands and price range)
    const [availableBrands, priceAgg] = await Promise.all([
      prisma.brand.findMany({
        where: {
          products: {
            some: { isSold: false },
          },
        },
        select: { name: true },
        orderBy: { name: "asc" },
      }),
      prisma.product.aggregate({
        where: { isSold: false },
        _min: { price: true },
        _max: { price: true },
      }),
    ]);

    // Map to ProductCardData format
    const productCards: ProductCardData[] = products
      .filter((product) => product.user) // Filter out products without users
      .map((product) => ({
        id: product.id,
        title: product.title,
        price: product.price,
        condition: product.condition,
        imageUrl: product.images[0]?.url || "/placeholder-product.jpg",
        category: product.category.name,
        seller: {
          id: product.user.id,
          name: product.user.name,
          averageRating: product.user.averageRating,
          ratingCount: product.user.ratingCount,
        },
      }));

    return NextResponse.json({
      products: productCards,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page < Math.ceil(total / limit),
      filters: {
        availableBrands: availableBrands
          .map((b) => b.name)
          .filter((name): name is string => name !== null),
        priceRange: {
          min: priceAgg._min.price || 0,
          max: priceAgg._max.price || 1000,
        },
      },
    });
  } catch (error) {
    console.error("Listings API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}
