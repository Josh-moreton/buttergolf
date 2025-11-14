"use client";

import Link from "next/link";
import type { ProductCardData } from "@buttergolf/app";
import { Button } from "@buttergolf/ui";
import { ProductCarousel } from "../shared/ProductCarousel";

interface RecentlyListedSectionClientProps {
  readonly products: ProductCardData[];
}

export function RecentlyListedSectionClient({
  products,
}: RecentlyListedSectionClientProps) {

  return (
    <div style={{ paddingTop: "64px", paddingBottom: "64px", backgroundColor: "#EDEDED", width: "100%" }}>
      <div
        style={{
          maxWidth: "100%",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "0",
          paddingRight: "0",
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

        {/* Carousel */}
        <ProductCarousel products={products} autoplay={true} autoplayDelay={5000} />

        <div style={{ display: "none" }}>
          <button
            type="button"
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
            type="button"
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
            paddingBottom: "32px",
          }}
        >
          <Link href="/listings" passHref style={{ textDecoration: "none" }}>
            <Button
              size="lg"
              tone="primary"
              borderRadius="$full"
              paddingHorizontal="$6"
              color="$vanillaCream"
            >
              View all listings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
