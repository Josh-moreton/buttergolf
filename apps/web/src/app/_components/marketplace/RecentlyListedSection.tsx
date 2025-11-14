"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Column } from "@buttergolf/ui";
import type { ProductCardData } from "@buttergolf/app";
import { ProductCard } from "@buttergolf/app";
import { Carousel } from "nuka-carousel";

interface RecentlyListedSectionClientProps {
  readonly products: ProductCardData[];
}

export function RecentlyListedSectionClient({
  products,
}: RecentlyListedSectionClientProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);

  // Calculate cards per view based on screen width
  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth < 768) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else if (window.innerWidth < 1280) {
        setCardsPerView(3);
      } else {
        setCardsPerView(4);
      }
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  const totalPages = Math.ceil(products.length / cardsPerView);

  return (
    <Column paddingVertical="$2xl" backgroundColor="$surface">
      <Column
        maxWidth={1280}
        marginHorizontal="auto"
        paddingHorizontal="$6"
        width="100%"
        gap="$2xl"
      >
        {/* Header - Centered */}
        <Column alignItems="center" gap="$sm" width="100%">
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
        </Column>

        {/* Carousel */}
        <div style={{ width: "100%", position: "relative" }}>
          <Carousel
            autoplay
            autoplayInterval={5000}
            wrapMode="wrap"
            showArrows={false}
            showDots={false}
            swiping
            scrollDistance={cardsPerView}
            afterSlide={(index) => setCurrentSlide(index)}
          >
            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  width: `calc((100% - ${(cardsPerView - 1) * 24}px) / ${cardsPerView})`,
                  padding: "0 12px",
                  boxSizing: "border-box",
                }}
              >
                <Link href={`/products/${product.id}`} style={{ textDecoration: "none" }}>
                  <ProductCard
                    product={product}
                    onFavorite={(productId) => console.log("Favorited:", productId)}
                  />
                </Link>
              </div>
            ))}
          </Carousel>
        </div>

        {/* Pagination Dots - Desktop Only */}
        <div
          style={{
            display: window.innerWidth >= 1024 ? "flex" : "none",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            paddingTop: "16px",
            paddingBottom: "16px",
          }}
        >
          {Array.from({ length: totalPages }).map((_, index) => {
            const pageStart = index * cardsPerView;
            const isActive = currentSlide >= pageStart && currentSlide < pageStart + cardsPerView;

            return (
              <button
                key={index}
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  border: "none",
                  backgroundColor: isActive ? "#F45314" : "#EDEDED",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  padding: 0,
                }}
                aria-label={`Go to page ${index + 1}`}
              />
            );
          })}
        </div>

        {/* View All Button - Centered Below Carousel */}
        <Column alignItems="center" width="100%" paddingTop="$md">
          <Link href="/listings" passHref style={{ textDecoration: "none" }}>
            <button
              style={{
                fontFamily: "var(--font-urbanist)",
                fontSize: "16px",
                fontWeight: 600,
                color: "#FFFFFF",
                backgroundColor: "#F45314",
                border: "none",
                borderRadius: "8px",
                padding: "12px 32px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#E04810";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#F45314";
              }}
            >
              View all listings
            </button>
          </Link>
        </Column>
      </Column>
    </Column>
  );
}
