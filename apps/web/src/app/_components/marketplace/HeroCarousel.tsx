"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Row, Column, Text, Button } from "@buttergolf/ui";
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
                  paddingLeft: "clamp(20px, 5vw, 80px)",
                  paddingRight: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    maxWidth: "600px",
                  }}
                >
                  {/* Title - Smaller */}
                  <h2
                    style={{
                      fontFamily: "var(--font-gotham)",
                      fontWeight: 700,
                      fontSize: "clamp(32px, 5vw, 48px)",
                      lineHeight: 1.1,
                      color: "#E25F2F",
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      margin: 0,
                    }}
                  >
                    {slide.title}
                  </h2>

                  {/* Subtitle - Larger */}
                  <h1
                    style={{
                      fontFamily: "var(--font-gotham)",
                      fontWeight: 900,
                      fontSize: "clamp(48px, 8vw, 72px)",
                      lineHeight: 1,
                      color: "#E25F2F",
                      letterSpacing: "3px",
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
                      fontSize: "clamp(18px, 2.5vw, 24px)",
                      lineHeight: 1.3,
                      color: "#E25F2F",
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      margin: "8px 0 0 0",
                    }}
                  >
                    DON'T MISS OUT!
                  </p>

                  {/* CTA Button */}
                  <Link
                    href={slide.ctaLink}
                    style={{ textDecoration: "none", marginTop: "8px" }}
                  >
                    <Button
                      backgroundColor="$primary"
                      color="$textInverse"
                      paddingHorizontal="$8"
                      paddingVertical="$4"
                      borderRadius="$full"
                      fontSize={16}
                      fontWeight="700"
                      hoverStyle={{
                        backgroundColor: "$primaryHover",
                        scale: 1.05,
                      }}
                      pressStyle={{
                        backgroundColor: "$primaryPress",
                        scale: 0.98,
                      }}
                      {...{
                        style: {
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          textTransform: "uppercase",
                          letterSpacing: "1.5px",
                        },
                      }}
                    >
                      {slide.ctaText}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </Row>
        </div>

        {/* Dot Navigation */}
        <Row
          position="absolute"
          bottom="$6"
          {...{ style: { left: "clamp(20px, 5vw, 80px)" } }}
          gap="$3"
          zIndex={3}
        >
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => scrollTo(index)}
              style={{
                width: selectedIndex === index ? "32px" : "12px",
                height: "12px",
                borderRadius: "6px",
                border: "none",
                backgroundColor:
                  selectedIndex === index
                    ? "#E25F2F"
                    : "rgba(226, 95, 47, 0.3)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                padding: 0,
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </Row>
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
