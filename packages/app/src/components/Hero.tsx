"use client";

import { Platform } from "react-native";
import { Column, Row, Heading, Text, Button, View, Image } from "@buttergolf/ui";
import { images } from "@buttergolf/assets";
import { Link } from "solito/link";
import { FadeUpText } from "./FadeUpText";

// Image source types - accepts both React Native require() and web string paths
type ImageSource = string | { uri: string } | number;

export interface HeroProps {
    // Content
    readonly heading: string | { line1: string; line2?: string };
    readonly subtitle: string;

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
function getHeadingText(heading: string | { line1: string; line2?: string }): string {
    if (typeof heading === "string") return heading;
    return [heading.line1, heading.line2].filter(Boolean).join(" ");
}

// Helper to get image source in correct format
function getImageSource(image: ImageSource): { uri: string } | number {
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
    readonly heading: string | { line1: string; line2?: string };
    readonly animationVariant: "fade-up" | "none";
    readonly animationDelay: number;
}

function HeroHeading({ heading, animationVariant, animationDelay }: HeroHeadingProps) {
    const text = getHeadingText(heading);

    if (animationVariant === "fade-up") {
        return (
            <FadeUpText
                text={text}
                delay={animationDelay}
                style={headingStyle}
            />
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
                {/* Background Image - Absolute positioned with 70% opacity */}
                {Platform.OS === "web" ? (
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
                            zIndex: 0,
                        }}
                    />
                ) : (
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
                )}

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
                            <Text
                                fontSize={25}
                                color="$slateSmoke"
                                fontWeight="500"
                                marginTop="$2"
                            >
                                {subtitle}
                            </Text>

                            {/* CTA Buttons */}
                            <HeroCTAButtons primaryCta={primaryCta} secondaryCta={secondaryCta} />
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

    return (
        <Row gap="$md" flexWrap="wrap" marginTop="$4">
            {primaryCta && (
                <Link href={primaryCta.href} style={{ textDecoration: 'none' }}>
                    <Button
                        width={133}
                        height={41}
                        backgroundColor="$primary"
                        borderRadius="$full"
                        color="$vanillaCream"
                        fontWeight="700"
                        fontSize={14}
                    >
                        {primaryCta.label}
                    </Button>
                </Link>
            )}
            {secondaryCta && (
                <Link href={secondaryCta.href} style={{ textDecoration: 'none' }}>
                    <Button
                        width={133}
                        height={41}
                        backgroundColor="$secondary"
                        color="$vanillaCream"
                        borderRadius="$full"
                        fontWeight="700"
                        fontSize={14}
                        hoverStyle={{ backgroundColor: "$secondaryHover" }}
                        pressStyle={{ backgroundColor: "$secondaryPress" }}
                    >
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
                    src={typeof source === 'object' && 'uri' in source ? source.uri : ''}
                    alt="Premium golf club featured in hero section"
                    style={{
                        width: 'auto',
                        height: '115%',
                        maxWidth: '120%',
                        objectFit: 'contain',
                        objectPosition: 'center bottom',
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
