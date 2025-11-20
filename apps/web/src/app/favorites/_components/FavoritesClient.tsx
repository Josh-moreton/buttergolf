"use client";

import { useState, useEffect } from "react";
import { Column, Row, Text, Heading, Spinner } from "@buttergolf/ui";
import { ProductCard } from "@/components/ProductCard";
import type { ProductCardData } from "@buttergolf/app";
import { useRouter } from "next/navigation";
import { FooterSection } from "../../_components/marketplace/FooterSection";

interface FavoritesResponse {
  products: Array<ProductCardData & { favoritedAt: string }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function FavoritesClient() {
  const router = useRouter();
  const [products, setProducts] = useState<FavoritesResponse["products"]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/favorites?page=${page}&limit=24`);

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/sign-in?redirect_url=/favorites");
            return;
          }
          throw new Error("Failed to fetch favorites");
        }

        const data: FavoritesResponse = await response.json();
        setProducts(data.products);
        setTotalPages(data.pagination.totalPages);
      } catch (err) {
        console.error("Error fetching favorites:", err);
        setError(err instanceof Error ? err.message : "Failed to load favorites");
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [page, router]);

  return (
    <>
      {/* Header Section */}
      <Column
        backgroundColor="$background"
        paddingVertical="$2xl"
        paddingHorizontal="$lg"
        borderBottomWidth={1}
        borderBottomColor="$border"
      >
        <Column maxWidth={1400} marginHorizontal="auto" gap="$md" width="100%">
          <Heading level={1} color="$text">
            My Favorites
          </Heading>
          <Text fontSize="$6" color="$textSecondary">
            Your saved golf equipment listings
          </Text>
        </Column>
      </Column>

      {/* Main Content */}
      <Column
        maxWidth={1400}
        marginHorizontal="auto"
        paddingHorizontal="$lg"
        paddingVertical="$2xl"
        gap="$2xl"
      >
        {/* Loading State */}
        {loading && (
          <Column alignItems="center" paddingVertical="$2xl">
            <Spinner size="lg" color="$primary" />
            <Text marginTop="$md" color="$textSecondary">
              Loading your favorites...
            </Text>
          </Column>
        )}

        {/* Error State */}
        {error && !loading && (
          <Column
            alignItems="center"
            paddingVertical="$2xl"
            backgroundColor="$errorLight"
            borderRadius="$md"
            padding="$xl"
          >
            <Text color="$error" weight="semibold" fontSize="$6">
              Error
            </Text>
            <Text marginTop="$xs" color="$error">
              {error}
            </Text>
          </Column>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <Column
            alignItems="center"
            paddingVertical="$2xl"
            gap="$lg"
          >
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#EDEDED"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <Heading level={3} color="$textSecondary" textAlign="center">
              No favorites yet
            </Heading>
            <Text fontSize="$5" color="$textSecondary" textAlign="center" maxWidth={400}>
              Start favoriting golf equipment you love by clicking the heart icon on product cards
            </Text>
            <button
              onClick={() => router.push("/listings")}
              style={{
                marginTop: "16px",
                fontFamily: "var(--font-urbanist)",
                fontSize: "16px",
                fontWeight: 600,
                color: "#FFFAD2",
                backgroundColor: "#F45314",
                border: "none",
                borderRadius: "32px",
                padding: "14px 32px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#d94812";
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#F45314";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Browse Listings
            </button>
          </Column>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <>
            <Row alignItems="center" justifyContent="space-between">
              <Heading level={2} color="$text">
                {products.length === 1
                  ? "1 Favorite"
                  : `${products.length} Favorites`}
              </Heading>
            </Row>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "24px",
                width: "100%",
              }}
            >
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPress={() => router.push(`/products/${product.id}`)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Row gap="$md" alignItems="center" justifyContent="center" marginTop="$xl">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "1px solid #EDEDED",
                    backgroundColor: page === 1 ? "#F5F5F5" : "#FFFFFF",
                    color: page === 1 ? "#999" : "#323232",
                    cursor: page === 1 ? "not-allowed" : "pointer",
                    fontFamily: "var(--font-urbanist)",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  Previous
                </button>

                <Text fontSize="$4" color="$text">
                  Page {page} of {totalPages}
                </Text>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "1px solid #EDEDED",
                    backgroundColor: page === totalPages ? "#F5F5F5" : "#FFFFFF",
                    color: page === totalPages ? "#999" : "#323232",
                    cursor: page === totalPages ? "not-allowed" : "pointer",
                    fontFamily: "var(--font-urbanist)",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  Next
                </button>
              </Row>
            )}
          </>
        )}
      </Column>

      <FooterSection />
    </>
  );
}
