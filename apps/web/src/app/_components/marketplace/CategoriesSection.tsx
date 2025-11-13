"use client";

import { useEffect, useRef } from "react";
import { CATEGORIES } from "@buttergolf/db";
import { gsap } from "gsap";
import Link from "next/link";
import { Column, Row, Text } from "@buttergolf/ui";

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
      cards.forEach((card) => {
        const clone = card.cloneNode(true) as HTMLElement;
        track.appendChild(clone);
      });
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!prefersReducedMotion) {
      // Create infinite scroll animation
      animationRef.current = gsap.to(track, {
        x: -totalWidth,
        duration: 40,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
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
      {...{ style: { overflow: "hidden" } }}
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
              href={`/listings?category=${category.slug}`}
              style={{
                position: "relative",
                width: "296px",
                height: "200px",
                borderRadius: "14px",
                overflow: "hidden",
                flexShrink: 0,
                textDecoration: "none",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow =
                  "0 12px 24px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 4px 8px rgba(0, 0, 0, 0.1)";
              }}
            >
              {/* Background Image */}
              <img
                src={category.imageUrl}
                alt={category.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              />

              {/* Gradient Overlay */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "100%",
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)",
                }}
              />

              {/* Category Name */}
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
                  zIndex: 1,
                }}
              >
                {category.name}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Swipe Styles */}
      <style jsx>{`
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
      `}</style>
    </Column>
  );
}
