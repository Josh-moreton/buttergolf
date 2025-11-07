import { Suspense } from "react";
import { prisma } from "@buttergolf/db";
import type { ProductCardData } from "@buttergolf/app";
import { ListingsClient } from "./ListingsClient";

interface SearchParams {
  category?: string;
  condition?: string | string[];
  minPrice?: string;
  maxPrice?: string;
  brand?: string | string[];
  sort?: string;
  page?: string;
}

interface Props {
  searchParams: SearchParams;
}

export const dynamic = "force-dynamic";

async function getListings(searchParams: SearchParams) {
  const page = parseInt(searchParams.page || "1");
  const limit = 24;
  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = { isSold: false };

  if (searchParams.category) {
    where.category = { slug: searchParams.category };
  }

  const conditions = Array.isArray(searchParams.condition)
    ? searchParams.condition
    : searchParams.condition
    ? [searchParams.condition]
    : [];
  if (conditions.length > 0) {
    where.condition = { in: conditions };
  }

  const minPrice = searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined;
  const maxPrice = searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined;
  if (minPrice || maxPrice) {
    where.price = {
      ...(minPrice && { gte: minPrice }),
      ...(maxPrice && { lte: maxPrice }),
    };
  }

  const brands = Array.isArray(searchParams.brand)
    ? searchParams.brand
    : searchParams.brand
    ? [searchParams.brand]
    : [];
  if (brands.length > 0) {
    where.brand = { in: brands };
  }

  // Sort options
  const sort = searchParams.sort || "newest";
  let orderBy: any = { createdAt: "desc" };

  switch (sort) {
    case "price-asc":
      orderBy = { price: "asc" };
      break;
    case "price-desc":
      orderBy = { price: "desc" };
      break;
    case "popular":
      orderBy = [{ views: "desc" }, { favorites: "desc" }];
      break;
    case "newest":
    default:
      orderBy = { createdAt: "desc" };
      break;
  }

  // Fetch products and total count
  const [products, total, availableBrands, priceAgg] = await Promise.all([
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
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
    prisma.product.findMany({
      where: { isSold: false, brand: { not: null } },
      select: { brand: true },
      distinct: ["brand"],
      orderBy: { brand: "asc" },
    }),
    prisma.product.aggregate({
      where: { isSold: false },
      _min: { price: true },
      _max: { price: true },
    }),
  ]);

  // Map to ProductCardData format
  const productCards: ProductCardData[] = products.map((product) => ({
    id: product.id,
    title: product.title,
    price: product.price,
    condition: product.condition,
    imageUrl: product.images[0]?.url || "/placeholder-product.jpg",
    category: product.category.name,
  }));

  return {
    products: productCards,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    hasMore: page < Math.ceil(total / limit),
    filters: {
      availableBrands: availableBrands
        .map((p) => p.brand)
        .filter((b): b is string => b !== null),
      priceRange: {
        min: priceAgg._min.price || 0,
        max: priceAgg._max.price || 10000,
      },
    },
  };
}

export default async function ListingsPage({ searchParams }: Props) {
  const data = await getListings(searchParams);

  return (
    <Suspense
      fallback={
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          minHeight: "50vh" 
        }}>
          <div>Loading...</div>
        </div>
      }
    >
      <ListingsClient
        initialProducts={data.products}
        initialTotal={data.total}
        initialFilters={data.filters}
        initialPage={data.page}
        initialHasMore={data.hasMore}
      />
    </Suspense>
  );
}

export const metadata = {
  title: "Shop All Products | ButterGolf",
  description: "Browse our complete collection of golf equipment and accessories",
};
