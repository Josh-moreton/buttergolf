"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ProductCardData } from "@buttergolf/app";
import { Button, Column } from "@buttergolf/ui";
import { ProductCard } from "@/components/ProductCard";

interface RecentlyListedSectionClientProps {
  readonly products: ProductCardData[];
}

export function RecentlyListedSectionClient({
  products,
}: RecentlyListedSectionClientProps) {
  const router = useRouter();

  return (
    <div style={{ paddingTop: "64px", paddingBottom: "64px", backgroundColor: "#EDEDED", width: "100%" }}>
      <div
        style={{
          maxWidth: "1440px",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "32px",
          paddingRight: "32px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "64px",
        }}
      >
        {/* Header - Centered */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            width: "100%",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-urbanist)",
              fontSize: "clamp(28px, 5vw, 40px)",
              fontWeight: 700,
              lineHeight: 1.2,
              color: "#323232",
              margin: 0,
              textAlign: "center",
            }}
          >
            Recently listed
          </h2>
          <p
            style={{
              fontFamily: "var(--font-urbanist)",
              fontSize: "clamp(14px, 2.5vw, 18px)",
              fontWeight: 400,
              lineHeight: 1.5,
              color: "#545454",
              margin: 0,
              textAlign: "center",
            }}
          >
            Latest drops, hottest deals - upgrade your game today.
          </p>
        </div>

        {/* 5-column Grid */}
        <Column
          width="100%"
          style={{ display: "grid" }}
          gridTemplateColumns="repeat(2, 1fr)"
          gap="$6"
          $gtSm={{
            gridTemplateColumns: "repeat(3, 1fr)",
          }}
          $gtMd={{
            gridTemplateColumns: "repeat(4, 1fr)",
          }}
          $gtLg={{
            gridTemplateColumns: "repeat(5, 1fr)",
          }}
        >
          {products.slice(0, 5).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => router.push(`/products/${product.id}`)}
            />
          ))}
        </Column>

        <div style={{ display: "none" }}>
          <button

            onClick={() => { }}
            style={{
              pointerEvents: "auto",
              border: "none",
              background: "rgba(0,0,0,0.4)",
              color: "#FFFFFF",
              borderRadius: "9999px",
              width: "32px",
              height: "32px",
              cursor: "pointer",
            }}
            aria-label="Previous"
          >
            
          </button>
          <button

            onClick={() => { }}
            style={{
              pointerEvents: "auto",
              border: "none",
              background: "rgba(0,0,0,0.4)",
              color: "#FFFFFF",
              borderRadius: "9999px",
              width: "32px",
              height: "32px",
              cursor: "pointer",
            }}
            aria-label="Next"
          >

          </button>
        </div>

        {/* View All Button - Centered Below Carousel */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            paddingTop: "8px",
          }}
        >
          <Link href="/listings" passHref style={{ textDecoration: "none" }}>
            <Button
              size="$5"
              backgroundColor="$primary"
              color="$textInverse"
              borderRadius="$full"
              paddingHorizontal="$6"
              paddingVertical="$3"
            >
              View all listings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
