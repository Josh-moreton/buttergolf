"use client";

import React from "react";
import { Column, Row, Heading, Text, Button, Image, View } from "@buttergolf/ui";
import { Link } from "solito/link";

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
                                            fontWeight="900"
                                            numberOfLines={1}
                                            ellipsizeMode="clip"
                                        >
                                            {word}
                                        </Heading>
                                    ))}
                                </Column>
                                <Column display="none" $md={{ display: "flex" }} gap="$1">
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
                                    {headingLine2 && (
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
                                        <Link href={primaryCta.href}>
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
                                        <Link href={secondaryCta.href}>
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
                            marginBottom={-20}
                            $lg={{
                                paddingLeft: "$8",
                                paddingRight: "$12",
                                paddingTop: "$12",
                            }}
                        >
                            <Image
                                source={heroImageSource as Parameters<typeof Image>[0]["source"]}
                                width="130%"
                                height="auto"
                                aspectRatio={1}
                                $md={{ width: "120%", height: "120%" }}
                                $lg={{ width: "130%", height: "130%" }}
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
