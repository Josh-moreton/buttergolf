"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { ProductCardData } from "@buttergolf/app";
import { ProductCard } from "@buttergolf/app";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface RecentlyListedSectionClientProps {
  readonly products: ProductCardData[];
}

export function RecentlyListedSectionClient({
  products,
}: RecentlyListedSectionClientProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  // Embla state
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      loop: true,
      dragFree: false,
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  // Calculate cards per view based on screen width
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsDesktop(width >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  return (
    <div style={{ paddingTop: "64px", paddingBottom: "64px", backgroundColor: "#FFFFFF" }}>
      <div
        style={{
          maxWidth: "1280px",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "48px",
          paddingRight: "48px",
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

        {/* Carousel (Embla) */}
        <div
          style={{
            width: "100%",
            position: "relative",
          }}
        >
          <div
            ref={emblaRef}
            style={{
              overflow: "hidden",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "32px",
              }}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  style={{
                    flex: "0 0 auto",
                    width: "70vw",
                    maxWidth: "280px",
                    boxSizing: "border-box",
                  }}
                >
                  <Link
                    href={`/products/${product.id}`}
                    style={{ textDecoration: "none", display: "block" }}
                  >
                    <ProductCard
                      product={product}
                      onFavorite={(productId) => console.log("Favorited:", productId)}
                    />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Optional prev/next controls (hidden visually for now) */}
          <div
            style={{
              display: "none",
              justifyContent: "space-between",
              position: "absolute",
              inset: 0,
              alignItems: "center",
              pointerEvents: "none",
            }}
          >
            <button
              type="button"
              onClick={scrollPrev}
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
              onClick={scrollNext}
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
        </div>

        {/* Pagination Dots - Desktop Only (Embla-driven) */}
        <div
          style={{
            display: isDesktop ? "flex" : "none",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            paddingTop: "16px",
            paddingBottom: "16px",
          }}
        >
          {scrollSnaps.map((_, index) => {
            const isActive = index === selectedIndex;

            return (
              <button
                key={index}
                type="button"
                onClick={() => scrollTo(index)}
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
                aria-label={`Go to slide ${index + 1}`}
              />
            );
          })}
        </div>

        {/* View All Button - Centered Below Carousel */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            paddingTop: "24px",
          }}
        >
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
        </div>
      </div>
    </div>
  );
}
