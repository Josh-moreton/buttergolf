"use client";

import React from "react";
import { Platform, Image as RNImage } from "react-native";
import {
  Column,
  Row,
  Heading,
  Text,
  Button,
  View,
  Image,
} from "@buttergolf/ui";
import { images } from "@buttergolf/assets";
import { Link } from "solito/link";
import { FadeUpText } from "./FadeUpText";

// Image source types - accepts both React Native require() and web string paths
// Also supports React components (for SVG imports via react-native-svg-transformer)
type ImageSource =
  | string
  | { uri: string }
  | number
  | React.ComponentType<{ width?: number | string; height?: number | string }>;

export interface HeroProps {
  // Content
  readonly heading: string | { line1: string; line2?: string; line3?: string };
  readonly subtitle?: string;

  // CTAs (optional - omit for mobile button-less variant)
  readonly primaryCta?: {
    label: string;
    href: string;
  };
  readonly secondaryCta?: {
    label: string;
    href: string;
  };

  // Images - accepts both require() (mobile) and string (web)
  readonly backgroundImage: ImageSource;
  readonly heroImage?: ImageSource;

  // Layout controls
  readonly showHeroImage?: boolean; // Default: true on desktop, false on mobile
  readonly minHeight?: number; // Default: 500
  readonly maxHeight?: number; // Default: 700

  // Animation controls (desktop only)
  readonly animationVariant?: "fade-up" | "none";
  readonly animationDelay?: number; // Delay before animation starts (in seconds)
}

// Helper to get heading text
function getHeadingText(
  heading: string | { line1: string; line2?: string; line3?: string },
): string {
  if (typeof heading === "string") return heading;
  return [heading.line1, heading.line2, heading.line3]
    .filter(Boolean)
    .join(" ");
}

// Helper to get heading lines as array
function getHeadingLines(
  heading: string | { line1: string; line2?: string; line3?: string },
): string[] {
  if (typeof heading === "string") return [heading];
  return [heading.line1, heading.line2, heading.line3].filter(
    (line): line is string => Boolean(line),
  );
}

// Helper to check if image is an SVG component
function isSvgComponent(
  image: ImageSource,
): image is React.ComponentType<{
  width?: number | string;
  height?: number | string;
}> {
  // SVG imports via react-native-svg-transformer have a .default property that's a component
  if (typeof image === "object" && image !== null && "default" in image) {
    return typeof (image as { default: unknown }).default === "function";
  }
  return typeof image === "function";
}

// Helper to get SVG component from import
function getSvgComponent(
  image: ImageSource,
): React.ComponentType<{
  width?: number | string;
  height?: number | string;
}> | null {
  if (typeof image === "object" && image !== null && "default" in image) {
    return (
      image as {
        default: React.ComponentType<{
          width?: number | string;
          height?: number | string;
        }>;
      }
    ).default;
  }
  if (typeof image === "function") {
    return image as React.ComponentType<{
      width?: number | string;
      height?: number | string;
    }>;
  }
  return null;
}

// Helper to get image source in correct format
function getImageSource(image: ImageSource): { uri: string } | number | null {
  if (isSvgComponent(image)) {
    return null; // SVG components are handled separately
  }
  if (typeof image === "string") {
    return { uri: image };
  }
  return image as { uri: string } | number;
}

// Shared heading style
const headingStyle = {
  fontSize: "clamp(32px, 5vw, 72px)",
  color: "#323232",
  fontWeight: 700,
  lineHeight: 1.1,
  whiteSpace: "normal" as const,
  wordBreak: "keep-all" as const,
};

interface HeroHeadingProps {
  readonly heading: string | { line1: string; line2?: string; line3?: string };
  readonly animationVariant: "fade-up" | "none";
  readonly animationDelay: number;
  readonly multiLine?: boolean;
}

function HeroHeading({
  heading,
  animationVariant,
  animationDelay,
  multiLine = false,
}: HeroHeadingProps) {
  const text = getHeadingText(heading);
  const lines = getHeadingLines(heading);

  if (animationVariant === "fade-up") {
    return (
      <FadeUpText text={text} delay={animationDelay} style={headingStyle} />
    );
  }

  // Multi-line rendering for mobile
  if (multiLine && lines.length > 1) {
    return (
      <Column>
        {lines.map((line, index) => (
          <Heading
            key={index}
            level={1}
            fontSize={40}
            color="$ironstone"
            fontWeight="700"
            lineHeight={46}
          >
            {line}
          </Heading>
        ))}
      </Column>
    );
  }

  // Default: no animation
  return (
    <Heading
      level={1}
      size="$9"
      $md={{ fontSize: "$11" }}
      $lg={{ fontSize: "$14" }}
      color="$ironstone"
      fontWeight="700"
      style={{ whiteSpace: "normal", wordBreak: "keep-all" }}
    >
      {text}
    </Heading>
  );
}

/**
 * Cross-platform Hero component for marketplace
 * Works on both web and React Native mobile
 * Uses Tamagui primitives for full compatibility
 */
export function Hero({
  heading,
  subtitle,
  primaryCta,
  secondaryCta,
  backgroundImage,
  heroImage,
  showHeroImage = true,
  minHeight = 500,
  maxHeight = 700,
  animationVariant = "none",
  animationDelay = 0.8,
}: Readonly<HeroProps>) {
  const heroImageSource = heroImage ? getImageSource(heroImage) : null;
  const HeroSvgComponent = heroImage ? getSvgComponent(heroImage) : null;
  const isWeb = Platform.OS === "web";
  const isMobile = !isWeb;

  // Mobile-specific layout
  if (isMobile) {
    return (
      <Column
        width="100%"
        paddingHorizontal="$4"
        paddingTop="$2"
        backgroundColor="$surface"
      >
        <View
          width="100%"
          height={minHeight}
          maxHeight={maxHeight}
          borderRadius="$2xl"
          overflow="hidden"
          position="relative"
        >
          {/* Background Image */}
          <Image
            source={images.hero.butterBackground}
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            objectFit="cover"
            opacity={0.7}
            zIndex={0}
          />

          {/* Content Container - Side by side layout */}
          <Row
            width="100%"
            height="100%"
            position="absolute"
            top={0}
            left={0}
            zIndex={1}
          >
            {/* Left Side - Text Content (55%) */}
            <Column
              width="55%"
              height="100%"
              justifyContent="center"
              paddingLeft="$4"
            >
              <HeroHeading
                heading={heading}
                animationVariant="none"
                animationDelay={0}
                multiLine={true}
              />
            </Column>

            {/* Right Side - Hero Image (45%) */}
            {showHeroImage && (HeroSvgComponent || heroImageSource) && (
              <Column
                width="45%"
                height="100%"
                justifyContent="flex-end"
                alignItems="center"
              >
                {HeroSvgComponent ? (
                  <HeroSvgComponent width="100%" height="90%" />
                ) : heroImageSource ? (
                  <RNImage
                    source={heroImageSource as number}
                    style={{
                      width: 160,
                      height: minHeight * 0.85,
                    }}
                    resizeMode="contain"
                  />
                ) : null}
              </Column>
            )}
          </Row>
        </View>
      </Column>
    );
  }

  // Web/Desktop layout
  return (
    <Column
      width="100%"
      paddingHorizontal="$md"
      paddingTop="$md"
      backgroundColor="$surface"
    >
      <View
        width="100%"
        height="50vh"
        minHeight={minHeight}
        maxHeight={maxHeight}
        borderRadius="$2xl"
        position="relative"
      >
        {/* Background Container - Clipped for rounded corners */}
        <View
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          borderRadius="$2xl"
          overflow="hidden"
          zIndex={0}
        >
          {/* Background Image - with 70% opacity */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: "url(/_assets/images/butter-background.webp)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              opacity: 0.7,
            }}
          />
        </View>

        {/* Content Container - NOT clipped, allows image overflow */}
        <Row
          width="100%"
          height="100%"
          position="relative"
          zIndex={1}
          flexWrap="wrap"
        >
          {/* Left Side - Text Content */}
          <Column
            width="60%"
            $md={{ width: "55%" }}
            justifyContent="center"
            paddingLeft="$12"
            paddingRight="$2"
            $lg={{ paddingLeft: "$20", paddingRight: "$8" }}
          >
            <Column gap="$6" maxWidth={700}>
              {/* Heading */}
              <HeroHeading
                heading={heading}
                animationVariant={animationVariant}
                animationDelay={animationDelay}
              />

              {/* Subtitle */}
              {subtitle && (
                <Text
                  fontSize={25}
                  color="$slateSmoke"
                  fontWeight="500"
                  marginTop="$2"
                >
                  {subtitle}
                </Text>
              )}

              {/* CTA Buttons */}
              <HeroCTAButtons
                primaryCta={primaryCta}
                secondaryCta={secondaryCta}
              />
            </Column>
          </Column>

          {/* Right Side - Hero Image */}
          {showHeroImage && heroImageSource && (
            <HeroImage source={heroImageSource} />
          )}
        </Row>
      </View>
    </Column>
  );
}

interface HeroCTAButtonsProps {
  readonly primaryCta?: { label: string; href: string };
  readonly secondaryCta?: { label: string; href: string };
}

function HeroCTAButtons({ primaryCta, secondaryCta }: HeroCTAButtonsProps) {
  if (!primaryCta && !secondaryCta) return null;

  // Define button styling inline to avoid butterVariant prop warning
  const primaryButtonProps = {
    size: "$4" as const,
    paddingHorizontal: "$3" as const,
    paddingVertical: "$2" as const,
    backgroundColor: "$primary" as const,
    borderWidth: 1,
    borderColor: "$primaryBorder" as const,
    color: "$textInverse" as const,
  };

  const secondaryButtonProps = {
    size: "$4" as const,
    paddingHorizontal: "$3" as const,
    paddingVertical: "$2" as const,
    backgroundColor: "$secondary" as const,
    borderWidth: 1,
    borderColor: "$secondaryBorder" as const,
    color: "$textInverse" as const,
  };

  return (
    <Row gap="$md" flexWrap="wrap" marginTop="$4">
      {primaryCta && (
        <Link href={primaryCta.href} style={{ textDecoration: "none" }}>
          <Button butterVariant="primary" {...primaryButtonProps}>
            {primaryCta.label}
          </Button>
        </Link>
      )}
      {secondaryCta && (
        <Link href={secondaryCta.href} style={{ textDecoration: "none" }}>
          <Button butterVariant="secondary" {...secondaryButtonProps}>
            {secondaryCta.label}
          </Button>
        </Link>
      )}
    </Row>
  );
}

interface HeroImageProps {
  readonly source: { uri: string } | number;
}

function HeroImage({ source }: HeroImageProps) {
  const isWeb = Platform.OS === "web";

  return (
    <Column
      width="40%"
      height="100%"
      $md={{
        width: "50%",
      }}
      backgroundColor="transparent"
      alignItems="center"
      justifyContent="flex-end"
      paddingRight="$4"
      $lg={{
        paddingRight: "$8",
      }}
    >
      {isWeb ? (
        <img
          src={typeof source === "object" && "uri" in source ? source.uri : ""}
          alt="Premium golf club featured in hero section"
          style={{
            width: "auto",
            height: "45vh",
            maxHeight: "630px",
            objectFit: "none",
            objectPosition: "center bottom",
            marginBottom: 0,
          }}
        />
      ) : (
        <Image
          source={source as Parameters<typeof Image>[0]["source"]}
          width="100%"
          height="100%"
          objectFit="contain"
          marginBottom={0}
        />
      )}
    </Column>
  );
}
