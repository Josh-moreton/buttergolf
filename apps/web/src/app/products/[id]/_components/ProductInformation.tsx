"use client";

import { useState } from "react";
import { Column, Row, Text, Button, Heading } from "@buttergolf/ui";

interface User {
    id: string;
    name: string | null;
    imageUrl: string | null;
    averageRating?: number | null;
    ratingCount?: number;
}

interface ProductInformationProps {
    product: {
        id: string;
        title: string;
        price: number;
        condition: string;
        brand: string | null;
        model: string | null;
        category: {
            id: string;
            name: string;
            slug: string;
        };
        user: User;
        description: string;
        isSold: boolean;
    };
    onBuyNow: () => void;
    onMakeOffer: () => void;
    purchasing: boolean;
}

export function ProductInformation({
    product,
    onBuyNow,
    onMakeOffer,
    purchasing,
}: ProductInformationProps) {
    const [isFavorite, setIsFavorite] = useState(false);

    const formatCondition = (condition: string) => {
        return condition.replace(/_/g, " ");
    };

    const averageRating = product.user.averageRating || 0;
    const ratingCount = product.user.ratingCount || 0;

    return (
        <Column
            backgroundColor="$cloudMist"
            borderRadius="$xl"
            padding="$lg"
            gap="$md"
            width="100%"
            $lg={{
                width: 420,
                flexShrink: 0,
            }}
        >
            {/* Header: Title, Price, Favorite */}
            <Row justifyContent="space-between" alignItems="flex-start" gap="$sm">
                <Column gap="$xs" flex={1}>
                    <Heading level={2} size="$7" color="$ironstone">
                        {product.title}
                    </Heading>
                    <Row alignItems="baseline" gap="$sm">
                        <Text fontSize={20} fontWeight="700" color="$spicedClementine">
                            £{product.price.toFixed(2)}
                        </Text>
                        <div
                            style={{
                                width: 16,
                                height: 16,
                                borderRadius: "50%",
                                border: "2px solid #545454",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                fontSize: "10px",
                                color: "#545454",
                            }}
                            title="Price information"
                        >
                            i
                        </div>
                    </Row>
                </Column>
                <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: "white",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease",
                        padding: 0,
                        flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                    }}
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill={isFavorite ? "#F45314" : "none"}
                        stroke={isFavorite ? "#F45314" : "#323232"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ flexShrink: 0 }}
                    >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                </button>
            </Row>

            {/* Divider */}
            <div style={{ height: 1, backgroundColor: "#CCCCCC", width: "100%" }} />

            {/* Seller Info */}
            <Column gap="$sm">
                <Row justifyContent="space-between" alignItems="center">
                    <Column gap="$xs" flex={1}>
                        <Text size="$3" color="$slateSmoke" weight="bold">
                            Posted by {product.user.name || "Unknown"}
                        </Text>
                        <Text size="$2" color="$slateSmoke">
                            Member for 3 years
                        </Text>
                        {ratingCount > 0 && (
                            <Row gap="$xs" alignItems="center">
                                <span style={{ color: "#F45314", fontSize: "14px" }}>★</span>
                                <Text size="$3" color="$ironstone" weight="semibold">
                                    {averageRating.toFixed(1)}
                                </Text>
                                <Text size="$2" color="$slateSmoke">
                                    ({ratingCount})
                                </Text>
                            </Row>
                        )}
                    </Column>
                    <Button
                        size="md"
                        backgroundColor="$spicedClementine"
                        color="$vanillaCream"
                        borderRadius="$full"
                        paddingHorizontal="$5"
                        hoverStyle={{ backgroundColor: "$spicedClementineHover" }}
                    >
                        View profile
                    </Button>
                </Row>
            </Column>

            {/* Divider */}
            <div style={{ height: 1, backgroundColor: "#CCCCCC", width: "100%" }} />

            {/* Product Specifications */}
            <Row gap="$md">
                <Column gap="$md" flex={1}>
                    <Text size="$3" color="$ironstone" weight="bold">
                        Category
                    </Text>
                    <Text size="$3" color="$ironstone" weight="bold">
                        Brand
                    </Text>
                    <Text size="$3" color="$ironstone" weight="bold">
                        Product
                    </Text>
                    <Text size="$3" color="$ironstone" weight="bold">
                        Product
                    </Text>
                    <Text size="$3" color="$ironstone" weight="bold">
                        Condition
                    </Text>
                </Column>
                <Column gap="$md" flex={1}>
                    <Text size="$3" color="$ironstone">
                        {product.category.name}
                    </Text>
                    <Text size="$3" color="$ironstone">
                        {product.brand || "N/A"}
                    </Text>
                    <Text size="$3" color="$ironstone">
                        {product.model || "N/A"}
                    </Text>
                    <Text size="$3" color="$ironstone">
                        {product.model || "N/A"}
                    </Text>
                    <Text size="$3" color="$ironstone">
                        {formatCondition(product.condition)}
                    </Text>
                </Column>
            </Row>

            {/* Divider */}
            <div style={{ height: 1, backgroundColor: "#CCCCCC", width: "100%" }} />

            {/* Product Description */}
            <Column gap="$md">
                <Text size="$3" color="$ironstone" weight="bold">
                    Product Description
                </Text>
                <Text size="$3" color="$ironstone" lineHeight={1.6} whiteSpace="pre-wrap">
                    {product.description}
                </Text>
            </Column>

            {/* Divider */}
            <div style={{ height: 1, backgroundColor: "#CCCCCC", width: "100%" }} />

            {/* CTA Buttons */}
            <Column gap="$md" width="100%">
                <Button
                    size="lg"
                    width="100%"
                    backgroundColor="$spicedClementine"
                    color="$vanillaCream"
                    borderRadius="$full"
                    height={56}
                    disabled={product.isSold || purchasing}
                    onPress={onBuyNow}
                    pressStyle={{ backgroundColor: "$spicedClementinePress" }}
                    hoverStyle={{ backgroundColor: "$spicedClementineHover" }}
                >
                    {product.isSold ? "Sold Out" : purchasing ? "Processing..." : "Buy now"}
                </Button>
                <Button
                    size="lg"
                    width="100%"
                    backgroundColor="$ironstone"
                    color="$vanillaCream"
                    borderRadius="$full"
                    height={56}
                    disabled={product.isSold || purchasing}
                    onPress={onMakeOffer}
                    pressStyle={{ opacity: 0.8 }}
                    hoverStyle={{ opacity: 0.9 }}
                >
                    Make an offer
                </Button>
            </Column>

            {/* View Price Breakdown Link */}
            <Row justifyContent="center" width="100%">
                <button
                    style={{
                        background: "transparent",
                        border: "none",
                        color: "#545454",
                        fontSize: "14px",
                        textDecoration: "underline",
                        cursor: "pointer",
                        padding: 0,
                    }}
                >
                    View price breakdown
                </button>
            </Row>
        </Column>
    );
}
