"use server";

import { prisma } from "@buttergolf/db";
import type { ProductCardData } from "@buttergolf/app";

export async function getRecentProducts(
  limit: number = 12
): Promise<ProductCardData[]> {
  try {
    const products = await prisma.product.findMany({
      take: limit,
      where: {
        isSold: false, // Only show available products
      },
      orderBy: { createdAt: "desc" },
      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
          take: 1, // Only get the first image for card view
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return products.map((product) => ({
      id: product.id,
      title: product.title,
      price: product.price,
      condition: product.condition,
      imageUrl:
        product.images[0]?.url ||
        "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400",
      category: product.category.name,
    }));
  } catch (error) {
    console.error("Failed to fetch recent products:", error);
    return [];
  }
}
