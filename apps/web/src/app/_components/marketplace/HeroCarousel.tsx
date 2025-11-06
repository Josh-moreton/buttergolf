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
  image: string;
}

const slides: Slide[] = [
  {
    id: "summer-sale",
    title: "SUMMER",
    subtitle: "GOLF SALE",
    ctaText: "SEE THE RANGE",
    ctaLink: "/listings?category=clubs",
    image: imagePaths.clubs.club1,
  },
  {
    id: "just-landed",
    title: "JUST",
    subtitle: "LANDED",
    ctaText: "SHOP NEW ARRIVALS",
    ctaLink: "/listings?sort=newest",
    image: imagePaths.clubs.club2,
  },
  {
    id: "featured-brands",
    title: "SHOP",
    subtitle: "CALLAWAY",
    ctaText: "EXPLORE BRANDS",
    ctaLink: "/listings?brand=callaway",
    image: imagePaths.clubs.club3,
  },
  {
    id: "membership",
    title: "JOIN THE",
    subtitle: "CLUB",
    ctaText: "LEARN MORE",
    ctaLink: "/about",
    image: imagePaths.clubs.club4,
  },
];

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
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
    <Column width="100%" position="relative">
      {/* Carousel Container */}
      <div
        ref={emblaRef}
        style={{
          overflow: "hidden",
          width: "100%",
        }}
      >
        <Row
          {...{
            style: {
              display: "flex",
              touchAction: "pan-y",
              backfaceVisibility: "hidden",
            },
          }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              style={{
                flex: "0 0 100%",
                minWidth: 0,
                position: "relative",
                height: "50vh",
                minHeight: "400px",
                maxHeight: "600px",
              }}
            >
              {/* Background Image */}
              <img
                src={slide.image}
                alt={`${slide.title} ${slide.subtitle}`}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />

              {/* Cream overlay for better text contrast */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(254, 250, 214, 0.7)", // Cream with opacity
                  zIndex: 1,
                }}
              />

              {/* Content Overlay */}
              <Column
                position="absolute"
                top={0}
                left={0}
                width="100%"
                height="100%"
                justifyContent="center"
                alignItems="center"
                paddingHorizontal="$4"
                $md={{ paddingHorizontal: "$8" }}
                zIndex={2}
                gap="$6"
              >
                <Column alignItems="center" gap="$2">
                  {/* Title */}
                  <Text
                    {...{
                      style: {
                        fontFamily: "var(--font-gotham)",
                        fontWeight: 700,
                        fontSize: "clamp(48px, 8vw, 72px)",
                        lineHeight: 1,
                        color: "#E25F2F",
                        textAlign: "center",
                        letterSpacing: "2px",
                      },
                    }}
                  >
                    {slide.title}
                  </Text>

                  {/* Subtitle */}
                  <Text
                    {...{
                      style: {
                        fontFamily: "var(--font-gotham)",
                        fontWeight: 900,
                        fontSize: "clamp(64px, 12vw, 96px)",
                        lineHeight: 1,
                        color: "#E25F2F",
                        textAlign: "center",
                        letterSpacing: "3px",
                      },
                    }}
                  >
                    {slide.subtitle}
                  </Text>
                </Column>

                {/* CTA Button */}
                <Link href={slide.ctaLink} style={{ textDecoration: "none" }}>
                  <Button
                    backgroundColor="$primary"
                    color="$textInverse"
                    paddingHorizontal="$8"
                    paddingVertical="$4"
                    borderRadius="$md"
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
              </Column>
            </div>
          ))}
        </Row>
      </div>

      {/* Dot Navigation */}
      <Row
        position="absolute"
        bottom="$4"
        left="50%"
        {...{
          style: {
            transform: "translateX(-50%)",
          },
        }}
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
  );
}
