"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Row, Column } from "@buttergolf/ui";
import Link from "next/link";
import { imagePaths } from "@buttergolf/assets";

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

const slides: Slide[] = [
  {
    id: "summer-sale",
    title: "SUMMER GOLF",
    subtitle: "SALE",
    ctaText: "SEE THE RANGE",
    ctaLink: "/listings?category=clubs",
  },
  {
    id: "just-landed",
    title: "JUST LANDED",
    subtitle: "NEW ARRIVALS",
    ctaText: "SHOP NEW ARRIVALS",
    ctaLink: "/listings?sort=newest",
  },
  {
    id: "featured-brands",
    title: "SHOP",
    subtitle: "CALLAWAY",
    ctaText: "EXPLORE BRANDS",
    ctaLink: "/listings?brand=callaway",
  },
  {
    id: "membership",
    title: "JOIN",
    subtitle: "THE CLUB",
    ctaText: "LEARN MORE",
    ctaLink: "/about",
  },
];

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Autoplay effect
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  // Keyboard navigation
  useEffect(() => {
    if (!emblaApi) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        emblaApi.scrollPrev();
      } else if (e.key === "ArrowRight") {
        emblaApi.scrollNext();
      }
    };
    globalThis.addEventListener("keydown", handleKeyDown);
    return () => globalThis.removeEventListener("keydown", handleKeyDown);
  }, [emblaApi]);

  return (
    <Row
      width="100%"
      position="relative"
      height="50vh"
      minHeight={400}
      maxHeight={600}
      {...{
        style: {
          backgroundImage: `url(${imagePaths.hero.background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        },
      }}
    >
      {/* Left Side - Carousel Text (50%) */}
      <Column
        width="100%"
        $md={{ width: "50%" }}
        position="relative"
        zIndex={2}
      >
        <div
          ref={emblaRef}
          style={{
            overflow: "hidden",
            width: "100%",
            height: "100%",
          }}
        >
          <Row
            {...{
              style: {
                display: "flex",
                touchAction: "pan-y",
                backfaceVisibility: "hidden",
                height: "100%",
              },
            }}
          >
            {slides.map((slide) => (
              <div
                key={slide.id}
                style={{
                  flex: "0 0 100%",
                  minWidth: 0,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  paddingLeft: "clamp(40px, 8vw, 120px)",
                  paddingRight: "clamp(40px, 8vw, 120px)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    maxWidth: "600px",
                  }}
                >
                  {/* Title - Smaller */}
                  <h2
                    style={{
                      fontFamily: "var(--font-gotham)",
                      fontWeight: 700,
                      fontSize: "clamp(28px, 4vw, 42px)",
                      lineHeight: 1.2,
                      color: "var(--primary)",
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      margin: 0,
                    }}
                  >
                    {slide.title}
                  </h2>

                  {/* Subtitle - MUCH Larger */}
                  <h1
                    style={{
                      fontFamily: "var(--font-gotham)",
                      fontWeight: 900,
                      fontSize: "clamp(64px, 12vw, 120px)",
                      lineHeight: 0.9,
                      color: "var(--primary)",
                      letterSpacing: "4px",
                      textTransform: "uppercase",
                      margin: 0,
                    }}
                  >
                    {slide.subtitle}
                  </h1>

                  {/* Tagline */}
                  <p
                    style={{
                      fontFamily: "var(--font-gotham)",
                      fontWeight: 700,
                      fontSize: "clamp(16px, 2vw, 22px)",
                      lineHeight: 1.3,
                      color: "var(--primary)",
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      margin: "4px 0 0 0",
                    }}
                  >
                    DON'T MISS OUT!
                  </p>

                  {/* CTA Button and Dots Container */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                      marginTop: "16px",
                    }}
                  >
                    <Link
                      href={slide.ctaLink}
                      style={{ textDecoration: "none" }}
                    >
                      <button
                        style={{
                          fontFamily: "var(--font-gotham)",
                          backgroundColor: "var(--primary)",
                          color: "#FFFFFF",
                          padding: "16px 48px",
                          borderRadius: "50px",
                          fontSize: "16px",
                          fontWeight: 700,
                          border: "none",
                          cursor: "pointer",
                          textTransform: "uppercase",
                          letterSpacing: "1.5px",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "var(--primaryHover)";
                          e.currentTarget.style.transform = "scale(1.05)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "var(--primary)";
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      >
                        {slide.ctaText}
                      </button>
                    </Link>

                    {/* Dot Navigation - Next to Button */}
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                      }}
                    >
                      {slides.map((s, index) => (
                        <button
                          key={s.id}
                          onClick={() => scrollTo(index)}
                          style={{
                            width: selectedIndex === index ? "32px" : "12px",
                            height: "12px",
                            borderRadius: "6px",
                            border: "none",
                            backgroundColor:
                              selectedIndex === index
                                ? "var(--primary)"
                                : "color-mix(in display-p3, var(--primary) 30%, transparent)",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            padding: 0,
                          }}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Row>
        </div>
      </Column>

      {/* Right Side - Club Image (50%, Desktop Only) */}
      <Column
        display="none"
        $md={{ display: "flex" }}
        width="50%"
        position="relative"
        alignItems="center"
        justifyContent="center"
        paddingRight="$8"
      >
        <img
          src={imagePaths.hero.club}
          alt="Golf clubs"
          style={{
            maxWidth: "90%",
            maxHeight: "90%",
            objectFit: "contain",
          }}
        />
      </Column>
    </Row>
  );
}
