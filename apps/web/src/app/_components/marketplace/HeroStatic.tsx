"use client";

import { Column, Row, Text, Button } from "@buttergolf/ui";
import Link from "next/link";
import { imagePaths } from "@buttergolf/assets";

/**
 * Static hero section matching Figma mockup
 * Refactored to use Tamagui components and design tokens
 */
export function HeroStatic() {
    return (
        <Column
            width="100%"
            paddingHorizontal="$md"
            paddingTop="$md"
            backgroundColor="$surface"
        >
            <Row
                width="100%"
                height="50vh"
                minHeight={500}
                maxHeight={700}
                borderRadius="$2xl"
                overflow="hidden"
                {...{
                    style: {
                        backgroundImage: `url(${imagePaths.hero.background})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    } as React.CSSProperties,
                }}
            >
                {/* Left Side - Text Content (50%) */}
                <Column
                    width="100%"
                    $md={{ width: "50%" }}
                    zIndex={2}
                    justifyContent="center"
                    paddingLeft="$8"
                    paddingRight="$4"
                    $lg={{ paddingLeft: "$12", paddingRight: "$8" }}
                >
                    <Column gap="$6" maxWidth={600}>
                        {/* Heading */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <h1
                                style={{
                                    fontFamily: "var(--font-urbanist)",
                                    fontWeight: 900,
                                    fontSize: "clamp(48px, 8vw, 80px)",
                                    lineHeight: 1.1,
                                    color: "#323232",
                                    margin: 0,
                                }}
                            >
                                Swing Smarter.
                            </h1>
                            <h1
                                style={{
                                    fontFamily: "var(--font-urbanist)",
                                    fontWeight: 900,
                                    fontSize: "clamp(48px, 8vw, 80px)",
                                    lineHeight: 1.1,
                                    color: "#323232",
                                    margin: 0,
                                }}
                            >
                                Shop Better.
                            </h1>
                        </div>

                        {/* Subtitle */}
                        <p
                            style={{
                                fontFamily: "var(--font-urbanist)",
                                fontWeight: 500,
                                fontSize: "clamp(16px, 2.5vw, 24px)",
                                lineHeight: 1.5,
                                color: "#545454",
                                margin: 0,
                            }}
                        >
                            Buy, Sell, and Upgrade Your Game
                        </p>

                        {/* CTA Buttons */}
                        <Row gap="$md" flexWrap="wrap" marginTop="$2">
                            <Link href="/sell" style={{ textDecoration: "none" }}>
                                <Button
                                    size="lg"
                                    tone="primary"
                                    paddingHorizontal="$8"
                                    minWidth={160}
                                    borderRadius="$full"
                                >
                                    Sell now
                                </Button>
                            </Link>
                            <Link href="/listings" style={{ textDecoration: "none" }}>
                                <Button
                                    size="lg"
                                    backgroundColor="$secondary"
                                    color="$textInverse"
                                    paddingHorizontal="$8"
                                    minWidth={160}
                                    borderRadius="$full"
                                    hoverStyle={{
                                        backgroundColor: "$secondaryHover",
                                    }}
                                    pressStyle={{
                                        backgroundColor: "$secondaryPress",
                                    }}
                                >
                                    Shop now
                                </Button>
                            </Link>
                        </Row>
                    </Column>
                </Column>

                {/* Right Side - Club Image (50%) */}
                <Column
                    display="none"
                    $md={{ display: "flex" }}
                    width="50%"
                    alignItems="center"
                    justifyContent="center"
                    zIndex={1}
                    paddingLeft="$4"
                    paddingRight="$8"
                    paddingTop="$8"
                    $lg={{ paddingLeft: "$8", paddingRight: "$12", paddingTop: "$12" }}
                >
                    <img
                        src={imagePaths.hero.club}
                        alt="Premium golf driver"
                        style={{
                            width: "130%",
                            height: "130%",
                            maxWidth: "none",
                            maxHeight: "none",
                            objectFit: "contain",
                        }}
                    />
                </Column>
            </Row>
        </Column>
    );
}