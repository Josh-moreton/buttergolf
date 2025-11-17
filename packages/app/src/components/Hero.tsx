"use client";

import React from "react";
import { Column, Row, Heading, Text, Button, Image, View } from "@buttergolf/ui";
import { Link } from "solito/link";
import { AnimatedHeroText } from "./AnimatedHeroText";
import { TypewriterHero } from "./TypewriterHero";
import { ScaleBounceHero } from "./ScaleBounceHero";

// Image source types - accepts both React Native require() and web string paths
type ImageSource = string | { uri: string } | number;

export interface HeroProps {
    // Content
    heading: string | { line1: string; line2: string };
    subtitle: string;

    // CTAs (optional - omit for mobile button-less variant)
    primaryCta?: {
        label: string;
        href: string;
    };
    secondaryCta?: {
        label: string;
        href: string;
    };

    // Images - accepts both require() (mobile) and string (web)
    backgroundImage: ImageSource;
    heroImage?: ImageSource;

    // Layout controls
    showHeroImage?: boolean; // Default: true on desktop, false on mobile
    minHeight?: number; // Default: 500
    maxHeight?: number; // Default: 700

    // Animation controls (desktop only)
    animationVariant?: "split-character" | "typewriter" | "scale-bounce" | "none";
    animationDelay?: number; // Delay before animation starts (in seconds)
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
    animationDelay = 0.8, // Wait for hero fade-in to complete
}: HeroProps) {
    // Determine if heading is split into two lines
    const headingLine1 = typeof heading === "string" ? heading : heading.line1;
    const headingLine2 = typeof heading === "string" ? undefined : heading.line2;

    const mobileHeadingWords = React.useMemo(() => {
        const combined =
            typeof heading === "string"
                ? heading
                : [heading.line1, heading.line2].filter(Boolean).join(" ");

        return combined
            .split(/\s+/)
            .map((word) => word.trim())
            .filter(Boolean);
    }, [heading]);

    // Determine image source format (React Native require() or web string)
    const backgroundSource =
        typeof backgroundImage === "string"
            ? ({ uri: backgroundImage } as const)
            : backgroundImage;

    const heroImageSource =
        heroImage && typeof heroImage === "string"
            ? ({ uri: heroImage } as const)
            : heroImage;

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
                overflow="hidden"
                position="relative"
            >
                {/* Background Image - Absolute positioned */}
                <Image
                    source={backgroundSource as Parameters<typeof Image>[0]["source"]}
                    width="100%"
                    height="100%"
                    position="absolute"
                    top={0}
                    left={0}
                    resizeMode="cover"
                    zIndex={0}
                    alt=""
                    accessibilityRole="none"
                />

                {/* Content Container - Absolute positioned on top */}
                <Row
                    width="100%"
                    height="100%"
                    position="absolute"
                    top={0}
                    left={0}
                    zIndex={1}
                    flexWrap="wrap"
                >
                    {/* Left Side - Text Content */}
                    <Column
                        width="60%"
                        $md={{ width: "50%" }}
                        justifyContent="center"
                        paddingLeft="$4"
                        paddingRight="$2"
                        $lg={{ paddingLeft: "$12", paddingRight: "$8" }}
                    >
                        <Column gap="$6" maxWidth={600}>
                            {/* Heading */}
                            <Column gap="$1">
                                <Column display="flex" $md={{ display: "none" }} gap="$1">
                                    {mobileHeadingWords.map((word, index) => (
                                        <Heading
                                            key={`${word}-${index}`}
                                            level={1}
                                            fontSize="$9"
                                            color="$ironstone"
                                            fontWeight="700"
                                            numberOfLines={1}
                                            ellipsizeMode="clip"
                                        >
                                            {word}
                                        </Heading>
                                    ))}
                                </Column>
                                <Column display="none" $md={{ display: "flex" }} gap="$1">
                                    {/* Line 1 - Animated */}
                                    {animationVariant === "split-character" ? (
                                        <AnimatedHeroText text={headingLine1} delay={animationDelay}>
                                            <Heading
                                                level={1}
                                                fontSize="$11"
                                                $md={{ fontSize: "$12" }}
                                                $lg={{ fontSize: "$14" }}
                                                color="$ironstone"
                                                fontWeight="700"
                                            >
                                                {headingLine1.split("").map((char, i) => (
                                                    <span
                                                        key={i}
                                                        className="char"
                                                        style={{
                                                            display: "inline-block",
                                                            opacity: 0,
                                                            whiteSpace: char === " " ? "pre" : "normal",
                                                        }}
                                                    >
                                                        {char === " " ? "\u00A0" : char}
                                                    </span>
                                                ))}
                                            </Heading>
                                        </AnimatedHeroText>
                                    ) : animationVariant === "typewriter" ? (
                                        <TypewriterHero text={headingLine1} delay={animationDelay} showCursor={false}>
                                            <Heading
                                                level={1}
                                                fontSize="$11"
                                                $md={{ fontSize: "$12" }}
                                                $lg={{ fontSize: "$14" }}
                                                color="$ironstone"
                                                fontWeight="700"
                                            >
                                                {headingLine1}
                                            </Heading>
                                        </TypewriterHero>
                                    ) : animationVariant === "scale-bounce" ? (
                                        <ScaleBounceHero text={headingLine1} delay={animationDelay}>
                                            <Heading
                                                level={1}
                                                fontSize="$11"
                                                $md={{ fontSize: "$12" }}
                                                $lg={{ fontSize: "$14" }}
                                                color="$ironstone"
                                                fontWeight="700"
                                            >
                                                {headingLine1}
                                            </Heading>
                                        </ScaleBounceHero>
                                    ) : (
                                        <Heading
                                            level={1}
                                            fontSize="$11"
                                            $md={{ fontSize: "$12" }}
                                            $lg={{ fontSize: "$14" }}
                                            color="$ironstone"
                                            fontWeight="700"
                                        >
                                            {headingLine1}
                                        </Heading>
                                    )}

                                    {/* Line 2 - Animated (if exists) */}
                                    {headingLine2 && (
                                        <>
                                            {animationVariant === "split-character" ? (
                                                <AnimatedHeroText text={headingLine2} delay={animationDelay + 0.3}>
                                                    <Heading
                                                        level={1}
                                                        fontSize="$11"
                                                        $md={{ fontSize: "$12" }}
                                                        $lg={{ fontSize: "$14" }}
                                                        color="$ironstone"
                                                        fontWeight="700"
                                                    >
                                                        {headingLine2.split("").map((char, i) => (
                                                            <span
                                                                key={i}
                                                                className="char"
                                                                style={{
                                                                    display: "inline-block",
                                                                    opacity: 0,
                                                                    whiteSpace: char === " " ? "pre" : "normal",
                                                                }}
                                                            >
                                                                {char === " " ? "\u00A0" : char}
                                                            </span>
                                                        ))}
                                                    </Heading>
                                                </AnimatedHeroText>
                                            ) : animationVariant === "typewriter" ? (
                                                <TypewriterHero text={headingLine2} delay={animationDelay + 0.5} showCursor={true}>
                                                    <Heading
                                                        level={1}
                                                        fontSize="$11"
                                                        $md={{ fontSize: "$12" }}
                                                        $lg={{ fontSize: "$14" }}
                                                        color="$ironstone"
                                                        fontWeight="700"
                                                    >
                                                        {headingLine2}
                                                    </Heading>
                                                </TypewriterHero>
                                            ) : animationVariant === "scale-bounce" ? (
                                                <ScaleBounceHero text={headingLine2} delay={animationDelay + 0.3}>
                                                    <Heading
                                                        level={1}
                                                        fontSize="$11"
                                                        $md={{ fontSize: "$12" }}
                                                        $lg={{ fontSize: "$14" }}
                                                        color="$ironstone"
                                                        fontWeight="700"
                                                    >
                                                        {headingLine2}
                                                    </Heading>
                                                </ScaleBounceHero>
                                            ) : (
                                                <Heading
                                                    level={1}
                                                    fontSize="$11"
                                                    $md={{ fontSize: "$12" }}
                                                    $lg={{ fontSize: "$14" }}
                                                    color="$ironstone"
                                                    fontWeight="700"
                                                >
                                                    {headingLine2}
                                                </Heading>
                                            )}
                                        </>
                                    )}
                                </Column>
                            </Column>

                            {/* Subtitle */}
                            <Text
                                display="none"
                                $md={{ display: "flex", fontSize: "$7" }}
                                $lg={{ fontSize: "$8" }}
                                color="$slateSmoke"
                                fontWeight="500"
                            >
                                {subtitle}
                            </Text>

                            {/* CTA Buttons - Only render if CTAs provided */}
                            {(primaryCta || secondaryCta) && (
                                <Row gap="$md" flexWrap="wrap" marginTop="$2">
                                    {primaryCta && (
                                        <Link href={primaryCta.href} style={{ textDecoration: 'none' }}>
                                            <Button
                                                size="lg"
                                                tone="primary"
                                                paddingHorizontal="$8"
                                                minWidth={160}
                                                borderRadius="$full"
                                                color="$vanillaCream"
                                                fontWeight="700"
                                            >
                                                {primaryCta.label}
                                            </Button>
                                        </Link>
                                    )}
                                    {secondaryCta && (
                                        <Link href={secondaryCta.href} style={{ textDecoration: 'none' }}>
                                            <Button
                                                size="lg"
                                                backgroundColor="$secondary"
                                                color="$vanillaCream"
                                                paddingHorizontal="$8"
                                                minWidth={160}
                                                borderRadius="$full"
                                                fontWeight="700"
                                                hoverStyle={{
                                                    backgroundColor: "$secondaryHover",
                                                }}
                                                pressStyle={{
                                                    backgroundColor: "$secondaryPress",
                                                }}
                                            >
                                                {secondaryCta.label}
                                            </Button>
                                        </Link>
                                    )}
                                </Row>
                            )}
                        </Column>
                    </Column>

                    {/* Right Side - Hero Image (Side by side on all screens) */}
                    {showHeroImage && heroImageSource && (
                        <Column
                            width="40%"
                            height="100%"
                            $md={{
                                width: "50%",
                                paddingLeft: "$4",
                                paddingRight: "$8",
                                paddingTop: "$8",
                                paddingBottom: 0,
                            }}
                            backgroundColor="transparent"
                            alignItems="flex-end"
                            justifyContent="flex-end"
                            paddingRight={0}
                            marginBottom={0}
                            $lg={{
                                paddingLeft: "$8",
                                paddingRight: "$12",
                                paddingTop: "$12",
                            }}
                        >
                            <Image
                                source={heroImageSource as Parameters<typeof Image>[0]["source"]}
                                width="115%"
                                height="auto"
                                aspectRatio={1}
                                marginBottom={-20}
                                $md={{ width: "115%", height: "115%", marginBottom: -48 }}
                                $lg={{ width: "120%", height: "120%", marginBottom: -56 }}
                                resizeMode="contain"
                                alt="Premium golf club featured in hero section"
                                accessibilityLabel="Premium golf club featured in hero section"
                            />
                        </Column>
                    )}
                </Row>
            </View>
        </Column>
    );
}
