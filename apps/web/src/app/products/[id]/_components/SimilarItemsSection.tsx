"use client";

import Link from "next/link";
import { Column, Heading, Text } from "@buttergolf/ui";
import { ProductCard } from "@buttergolf/app";
import type { ProductCardData } from "@buttergolf/app";

interface SimilarItemsSectionProps {
    products: ProductCardData[];
    category: string;
}

export function SimilarItemsSection({ products, category }: SimilarItemsSectionProps) {
    if (products.length === 0) {
        return null;
    }

    return (
        <Column
            paddingVertical="$10"
            backgroundColor="$cloudMist"
            width="100%"
        >
            <Column
                maxWidth={1200}
                marginHorizontal="auto"
                paddingHorizontal="$6"
                width="100%"
                gap="$2xl"
            >
                {/* Header */}
                <Column gap="$md" alignItems="center">
                    <Heading level={2} color="$secondary" textAlign="center">
                        Similar Items
                    </Heading>
                    <Text color="$textSecondary" textAlign="center">
                        Other {category.toLowerCase()} items you might like
                    </Text>
                </Column>

                {/* Products Grid - Responsive */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(1, 1fr)",
                        gap: "24px",
                        width: "100%",
                    }}
                    className="similar-items-grid"
                >
                    {products.map((product) => (
                        <Link
                            key={product.id}
                            href={`/products/${product.id}`}
                            style={{ textDecoration: "none", display: "block" }}
                        >
                            <ProductCard
                                product={product}
                                onFavorite={(productId) =>
                                    console.log("Favorited:", productId)
                                }
                            />
                        </Link>
                    ))}
                </div>
            </Column>

            <style jsx>{`
        @media (min-width: 640px) {
          .similar-items-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (min-width: 1024px) {
          .similar-items-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
      `}</style>
        </Column>
    );
}
