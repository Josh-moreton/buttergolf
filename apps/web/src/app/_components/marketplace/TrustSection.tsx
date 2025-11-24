"use client";

import Image from "next/image";
import { Row, Column, Text } from "@buttergolf/ui";

const TRUST_ITEMS = [
    {
        icon: "/_assets/icons/golfball.svg",
        title: "Trusted Gear,",
        subtitle: "Tee to Green",
    },
    {
        icon: "/_assets/icons/club.svg",
        title: "Golf Kit, No",
        subtitle: "Guesswork",
    },
    {
        icon: "/_assets/icons/badge.svg",
        title: "Quality You",
        subtitle: "Can Count On",
    },
    {
        icon: "/_assets/icons/tick.svg",
        title: "Checked, Tested,",
        subtitle: "Approved",
    },
];

export function TrustSection() {
    return (
        <Column
            backgroundColor="$background"
            paddingVertical="$10"
        >
            <Column
                maxWidth={1280}
                marginHorizontal="auto"
                paddingHorizontal="$12"
                width="100%"
            >
                {/* Main Heading */}
                <Text
                    style={{ fontSize: "clamp(28px, 5vw, 40px)" }}
                    fontWeight="700"
                    lineHeight={1.2}
                    color="$text"
                    textAlign="center"
                    marginBottom="$16"
                >
                    Fresh takes on second-hand reassurance
                </Text>

                {/* Trust Items Grid */}
                <Column
                    style={{ display: "grid" }}
                    gridTemplateColumns="1"
                    gap="$12"
                    $gtMd={{
                        gridTemplateColumns: "repeat(2, 1fr)",
                    }}
                    $gtLg={{
                        gridTemplateColumns: "repeat(4, 1fr)",
                    }}
                >
                    {TRUST_ITEMS.map((item) => (
                        <Row
                            key={item.icon}
                            alignItems="center"
                            gap="$md"
                            maxWidth={280}
                            marginHorizontal="auto"
                        >
                            {/* Icon */}
                            <Image
                                src={item.icon}
                                alt=""
                                width={56}
                                height={56}
                                style={{
                                    flexShrink: 0,
                                    filter:
                                        "brightness(0) saturate(100%) invert(39%) sepia(89%) saturate(2532%) hue-rotate(352deg) brightness(98%) contrast(93%)",
                                }}
                            />

                            {/* Text */}
                            <Column gap="$xs">
                                <p
                                    style={{
                                        fontFamily: "var(--font-urbanist)",
                                        fontSize: "18px",
                                        fontWeight: 700,
                                        lineHeight: 1.3,
                                        color: "#323232",
                                        margin: 0,
                                        padding: 0,
                                    }}
                                >
                                    {item.title}
                                </p>
                                <p
                                    style={{
                                        fontFamily: "var(--font-urbanist)",
                                        fontSize: "18px",
                                        fontWeight: 500,
                                        lineHeight: 1.3,
                                        color: "#323232",
                                        margin: 0,
                                        padding: 0,
                                    }}
                                >
                                    {item.subtitle}
                                </p>
                            </Column>
                        </Row>
                    ))}
                </Column>
            </Column>
        </Column>
    );
}
