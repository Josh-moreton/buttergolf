"use client";

import { Card, Image, Text, Row, Column, Badge, Button } from "@buttergolf/ui";
import type { ProductCardData } from "@buttergolf/app";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface ProductCardWithCartProps {
    product: ProductCardData;
}

export function ProductCardWithCart({
    product,
}: Readonly<ProductCardWithCartProps>) {
    const router = useRouter();
    const [purchasing, setPurchasing] = useState(false);

    const handleBuyNow = () => {
        setPurchasing(true);
        router.push(`/checkout?productId=${product.id}`);
    };

    const handleCardClick = () => {
        router.push(`/products/${product.id}`);
    };

    return (
        <Card
            variant="elevated"
            padding={0}
            animation="bouncy"
            backgroundColor="$surface"
            borderColor="$border"
            hoverStyle={{
                borderColor: "$borderHover",
                shadowColor: "$shadowColorHover",
                shadowRadius: 12,
            }}
            width="100%"
            maxWidth={280}
            minHeight={440}
            display="flex"
            flexDirection="column"
        >
            <Card.Header padding={0} noBorder {...{ style: { position: "relative" } }}>
                <div
                    onClick={handleCardClick}
                    style={{ cursor: "pointer" }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleCardClick();
                        }
                    }}
                >
                    {/* 1:1 Aspect Ratio Container */}
                    <div style={{ position: "relative", paddingBottom: "100%", overflow: "hidden", width: "100%" }}>
                        <Image
                            source={{ uri: product.imageUrl }}
                            width="100%"
                            height="100%"
                            objectFit="cover"
                            borderTopLeftRadius="$lg"
                            borderTopRightRadius="$lg"
                            backgroundColor="$background"
                            position="absolute"
                            top={0}
                            left={0}
                        />
                    </div>
                </div>

                {/* NEW Badge Overlay */}
                {product.condition === "NEW" && (
                    <Badge
                        variant="success"
                        size="sm"
                        {...{ style: { position: "absolute", top: 8, right: 8, zIndex: 10 } }}
                    >
                        <Text>NEW</Text>
                    </Badge>
                )}
            </Card.Header>
            <Card.Body padding="$md" flex={1} display="flex">
                <Column gap="$md" width="100%" height="100%" justifyContent="space-between">
                    <div
                        onClick={handleCardClick}
                        style={{ cursor: "pointer" }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleCardClick();
                            }
                        }}
                    >
                        <Column gap="$xs" width="100%">
                            <Text size="md" weight="semibold" numberOfLines={2} minHeight={42}>
                                {product.title}
                            </Text>
                            <Row gap="$sm" alignItems="center" justifyContent="space-between" minHeight={24}>
                                <Text size="sm" color="$textSecondary" numberOfLines={1}>
                                    {product.category}
                                </Text>
                                {product.condition && product.condition !== "NEW" && (
                                    <Badge variant="neutral" size="sm">
                                        <Text size="xs" weight="medium">
                                            {product.condition.replace("_", " ")}
                                        </Text>
                                    </Badge>
                                )}
                            </Row>
                            <Text size="lg" weight="bold" color="$primary" minHeight={28}>
                                £{product.price.toFixed(2)}
                            </Text>
                        </Column>
                    </div>
                    <Button
                        size="md"
                        tone="primary"
                        fullWidth
                        onPress={handleBuyNow}
                        disabled={purchasing}
                        opacity={purchasing ? 0.6 : 1}
                    >
                        {purchasing ? "Processing..." : "Buy Now"}
                    </Button>
                </Column>
            </Card.Body>
        </Card>
    );
}
