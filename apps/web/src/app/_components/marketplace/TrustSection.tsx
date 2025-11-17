"use client";

import { Row, Column } from "@buttergolf/ui";

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
        <div
            style={{
                backgroundColor: "#FFFFFF",
                paddingTop: "80px",
                paddingBottom: "80px",
            }}
        >
            <div
                style={{
                    maxWidth: "1280px",
                    marginLeft: "auto",
                    marginRight: "auto",
                    paddingLeft: "48px",
                    paddingRight: "48px",
                }}
            >
                {/* Main Heading */}
                <h2
                    style={{
                        fontFamily: "var(--font-urbanist)",
                        fontSize: "clamp(28px, 5vw, 40px)",
                        fontWeight: 700,
                        lineHeight: 1.2,
                        color: "#323232",
                        textAlign: "center",
                        margin: 0,
                        marginBottom: "64px",
                    }}
                >
                    Fresh takes on second-hand reassurance
                </h2>

                {/* Trust Items Grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                        gap: "48px",
                        justifyItems: "center",
                    }}
                >
                    {TRUST_ITEMS.map((item, index) => (
                        <Row
                            key={index}
                            alignItems="center"
                            gap="$md"
                            maxWidth={280}
                        >
                            {/* Icon */}
                            <img
                                src={item.icon}
                                alt=""
                                style={{
                                    width: "56px",
                                    height: "56px",
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
                                    }}
                                >
                                    {item.subtitle}
                                </p>
                            </Column>
                        </Row>
                    ))}
                </div>
            </div>
        </div>
    );
}
