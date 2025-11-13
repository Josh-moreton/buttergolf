"use client";

import { Row, Column } from "@buttergolf/ui";
import Link from "next/link";
import { imagePaths } from "@buttergolf/assets";

/**
 * Static hero section matching Figma mockup
 * Based on working HeroCarousel pattern
 */
export function HeroStatic() {
    return (
        <Column
            width="100%"
            paddingHorizontal="$md"
            paddingTop="$md"
            backgroundColor="$pureWhite"
        >
            <Row
                width="100%"
                position="relative"
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
                    },
                }}
            >
                {/* Left Side - Text Content (50%) */}
                <Column
                    width="100%"
                    $md={{ width: "50%" }}
                    position="relative"
                    zIndex={2}
                    justifyContent="center"
                    {...{
                        style: {
                            paddingLeft: "clamp(40px, 8vw, 120px)",
                            paddingRight: "clamp(20px, 4vw, 60px)",
                        },
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "24px",
                            maxWidth: "600px",
                        }}
                    >
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
                        <div
                            style={{
                                display: "flex",
                                gap: "16px",
                                flexWrap: "wrap",
                                marginTop: "8px",
                            }}
                        >
                            <Link href="/sell" style={{ textDecoration: "none" }}>
                                <button
                                    style={{
                                        fontFamily: "var(--font-urbanist)",
                                        fontWeight: 600,
                                        fontSize: "16px",
                                        padding: "16px 48px",
                                        borderRadius: "9999px",
                                        border: "none",
                                        backgroundColor: "#F45314",
                                        color: "#FFFFFF",
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                        minWidth: "160px",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = "#E04810";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = "#F45314";
                                    }}
                                >
                                    Sell now
                                </button>
                            </Link>
                            <Link href="/listings" style={{ textDecoration: "none" }}>
                                <button
                                    style={{
                                        fontFamily: "var(--font-urbanist)",
                                        fontWeight: 600,
                                        fontSize: "16px",
                                        padding: "16px 48px",
                                        borderRadius: "9999px",
                                        border: "none",
                                        backgroundColor: "#3E3B2C",
                                        color: "#FFFFFF",
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                        minWidth: "160px",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = "#2E2B1C";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = "#3E3B2C";
                                    }}
                                >
                                    Shop now
                                </button>
                            </Link>
                        </div>
                    </div>
                </Column>

                {/* Right Side - Club Image (50%) */}
                <Column
                    display="none"
                    $md={{ display: "flex" }}
                    width="50%"
                    position="relative"
                    alignItems="center"
                    justifyContent="center"
                    zIndex={1}
                    {...{
                        style: {
                            paddingLeft: "clamp(20px, 4vw, 60px)",
                            paddingRight: "clamp(40px, 8vw, 120px)",
                            paddingTop: "clamp(40px, 8vw, 120px)",
                            paddingBottom: 0,
                        },
                    }}
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