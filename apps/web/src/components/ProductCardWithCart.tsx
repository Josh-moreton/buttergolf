"use client";

import { Card, Image, Text, Row, Column, Badge } from "@buttergolf/ui";
import type { ProductCardData } from "@buttergolf/app";
import { AnimatedAddToCartButton } from "../components/AnimatedAddToCartButton";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";

export interface ProductCardWithCartProps {
    product: ProductCardData;
}

export function ProductCardWithCart({
    product,
}: Readonly<ProductCardWithCartProps>) {
    const { addItem } = useCart();
    const router = useRouter();

    const handleAddToCart = async () => {
        await addItem({
            productId: product.id,
            title: product.title,
            price: product.price,
            imageUrl: product.imageUrl,
        });
    };

    const handleCardClick = () => {
        router.push(`/listings/${product.id}`);
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
        >
            <Card.Header padding={0} noBorder>
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
                    <Image
                        source={{ uri: product.imageUrl }}
                        width="100%"
                        height={200}
                        objectFit="cover"
                        borderTopLeftRadius="$lg"
                        borderTopRightRadius="$lg"
                        backgroundColor="$background"
                    />
                </div>
            </Card.Header>
            <Card.Body padding="$md">
                <Column gap="$md" width="100%">
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
                            <Text size="md" weight="semibold" numberOfLines={2}>
                                {product.title}
                            </Text>
                            <Row gap="$sm" alignItems="center" justifyContent="space-between">
                                <Text size="sm" color="$textSecondary">
                                    {product.category}
                                </Text>
                                {product.condition && (
                                    <Badge variant="neutral" size="sm">
                                        <Text size="xs" weight="medium">
                                            {product.condition.replace("_", " ")}
                                        </Text>
                                    </Badge>
                                )}
                            </Row>
                            <Text size="lg" weight="bold" color="$primary">
                                £{product.price.toFixed(2)}
                            </Text>
                        </Column>
                    </div>
                    <AnimatedAddToCartButton onAddToCart={handleAddToCart} />
                </Column>
            </Card.Body>
        </Card>
    );
}
