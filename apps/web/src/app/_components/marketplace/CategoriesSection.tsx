"use client";

import { useEffect, useRef } from "react";
import { CATEGORIES } from "@buttergolf/db";
import { gsap } from "gsap";
import Link from "next/link";
import Image from "next/image";
import { Column } from "@buttergolf/ui";

export function CategoriesSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!trackRef.current) return;

    const track = trackRef.current;
    const cards = Array.from(track.children) as HTMLElement[];
    if (cards.length === 0) return;

    // Calculate total width
    const cardWidth = cards[0].offsetWidth;
    const gap = 24;
    const totalWidth = (cardWidth + gap) * CATEGORIES.length;

    // Clone cards for seamless loop - only if not already cloned
    if (cards.length === CATEGORIES.length) {
      for (const card of cards) {
        const clone = card.cloneNode(true) as HTMLElement;
        track.appendChild(clone);
      }
    }

    // Check for reduced motion preference
    const prefersReducedMotion =
      globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches ??
      false;

    if (!prefersReducedMotion) {
      // Create infinite scroll animation
      animationRef.current = gsap.to(track, {
        x: -totalWidth,
        duration: 40,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => Number.parseFloat(x) % totalWidth),
        },
      });

      // Pause on hover (desktop only)
      const handleMouseEnter = () => animationRef.current?.pause();
      const handleMouseLeave = () => animationRef.current?.play();

      track.addEventListener("mouseenter", handleMouseEnter);
      track.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        track.removeEventListener("mouseenter", handleMouseEnter);
        track.removeEventListener("mouseleave", handleMouseLeave);
        animationRef.current?.kill();
      };
    }
  }, []);

  return (
    <Column
      width="100%"
      paddingVertical="$2xl"
      backgroundColor="$surface"
      overflow="hidden"
    >
      <Column
        maxWidth={1200}
        marginHorizontal="auto"
        paddingHorizontal="$md"
        marginBottom="$2xl"
      >
        {/* Headings */}
        <Column gap="$sm" alignItems="center">
          <h2
            style={{
              fontFamily: "var(--font-urbanist)",
              fontSize: "clamp(24px, 5vw, 32px)",
              fontWeight: 600,
              lineHeight: 1.2,
              color: "#323232",
              margin: 0,
            }}
          >
            Shop by category
          </h2>
          <p
            style={{
              fontFamily: "var(--font-urbanist)",
              fontSize: "clamp(16px, 3vw, 18px)",
              fontWeight: 400,
              lineHeight: 1.5,
              color: "#545454",
              margin: 0,
            }}
          >
            Find exactly what you need - faster.
          </p>
        </Column>
      </Column>

      {/* Carousel Container - Full Width */}
      <div
        style={{
          position: "relative",
          width: "100%",
          overflowX: "hidden",
          overflowY: "visible",
          WebkitOverflowScrolling: "touch",
          padding: "20px 0",
        }}
        className="categories-carousel-container"
      >
        <div
          ref={trackRef}
          style={{
            display: "flex",
            gap: "24px",
            willChange: "transform",
          }}
          className="categories-track"
        >
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="category-card"
              style={{
                position: "relative",
                width: "296px",
                height: "329px", // 9:10 aspect ratio (296 * 1.1111)
                borderRadius: "14px",
                flexShrink: 0,
                textDecoration: "none",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "14px",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 280px, 296px"
                  style={{
                    objectFit: "cover",
                    borderRadius: "14px",
                  }}
                  priority={false}
                />

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)",
                    borderRadius: "14px",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    bottom: "16px",
                    left: "16px",
                    fontFamily: "var(--font-urbanist)",
                    fontSize: "24px",
                    fontWeight: 600,
                    lineHeight: 1,
                    color: "#FFFAD2",
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  {category.name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Swipe Styles */}
      <style>{`
        @media (max-width: 768px) {
          .categories-carousel-container {
            overflow-x: auto;
            overflow-y: hidden;
            -webkit-overflow-scrolling: touch;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          .categories-carousel-container::-webkit-scrollbar {
            display: none;
          }

          .categories-track {
            transform: none !important;
          }

          .categories-track > a {
            scroll-snap-align: center;
            width: 280px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .categories-track {
            transform: none !important;
          }

          .categories-carousel-container {
            overflow-x: auto;
            scroll-snap-type: x mandatory;
          }

          .categories-track > a {
            scroll-snap-align: start;
          }
        }

        .category-card:hover {
          transform: scale(1.05);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </Column>
  );
}
