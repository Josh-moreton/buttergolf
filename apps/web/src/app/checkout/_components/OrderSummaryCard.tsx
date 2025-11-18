"use client";

import Image from "next/image";
import { Column, Row, Text, Card } from "@buttergolf/ui";

interface OrderSummaryCardProps {
    product: {
        title: string;
        price: number;
        imageUrl: string | null;
    };
    shippingCost?: number;
}

export function OrderSummaryCard({ product, shippingCost = 9.99 }: Readonly<OrderSummaryCardProps>) {
    const buyerProtectionFee = 1;
    const subtotal = product.price + buyerProtectionFee;
    const total = subtotal + shippingCost;

    return (
        <div style={{ position: "sticky", top: 120, width: "100%" }}>
            <Card
                backgroundColor="$cloudMist"
                borderRadius="$xl"
                padding="$xl"
                width="100%"
            >
                <Column gap="$lg">
                    {/* Product Image */}
                    {product.imageUrl && (
                        <Image
                            src={product.imageUrl}
                            alt={product.title}
                            width={400}
                            height={400}
                            style={{
                                width: "100%",
                                height: "auto",
                                objectFit: "cover",
                                borderRadius: "16px",
                            }}
                        />
                    )}

                    {/* Product Title */}
                    <Text weight="semibold" fontSize="$6" color="$ironstone">
                        {product.title}
                    </Text>

                    {/* Order Breakdown */}
                    <Column gap="$md">
                        <Text weight="semibold" fontSize="$4" color="$ironstone">
                            Order breakdown
                        </Text>

                        {/* Item Price */}
                        <Row justifyContent="space-between" alignItems="center">
                            <Text fontSize="$3" color="$ironstone">
                                Item
                            </Text>
                            <Text fontSize="$3" color="$ironstone">
                                £{product.price.toFixed(2)}
                            </Text>
                        </Row>

                        {/* Buyer Protection Fee */}
                        <Row justifyContent="space-between" alignItems="center">
                            <Text fontSize="$3" color="$ironstone">
                                Buyer protection fee
                            </Text>
                            <Text fontSize="$3" color="$ironstone">
                                £{buyerProtectionFee.toFixed(2)}
                            </Text>
                        </Row>

                        {/* Subtotal */}
                        <Row justifyContent="space-between" alignItems="center">
                            <Text fontSize="$3" weight="semibold" color="$ironstone">
                                Subtotal
                            </Text>
                            <Text fontSize="$3" weight="semibold" color="$ironstone">
                                £{subtotal.toFixed(2)}
                            </Text>
                        </Row>

                        {/* Postage and Packaging */}
                        <Row justifyContent="space-between" alignItems="center">
                            <Text fontSize="$3" color="$ironstone">
                                Postage and packaging
                            </Text>
                            <Text fontSize="$3" color="$ironstone">
                                £{shippingCost.toFixed(2)}
                            </Text>
                        </Row>

                        {/* Divider */}
                        <div
                            style={{
                                width: "100%",
                                height: "1px",
                                backgroundColor: "#323232",
                                opacity: 0.2,
                            }}
                        />

                        {/* Total */}
                        <Row justifyContent="space-between" alignItems="center">
                            <Text fontSize="$6" weight="bold" color="$ironstone">
                                Total
                            </Text>
                            <Text fontSize="$6" weight="bold" color="$ironstone">
                                £{total.toFixed(2)}
                            </Text>
                        </Row>
                    </Column>

                    {/* Terms and Conditions */}
                    <Column gap="$xs">
                        <Text weight="semibold" fontSize="$3" color="$ironstone">
                            Terms and conditions
                        </Text>
                        <Text fontSize="$2" color="$ironstone" lineHeight="$1">
                            Consectetur adipiscing elit. Nulla facilisi. Suspendisse potenti. Vivamus a urna sed libero convallis malesuada.
                        </Text>
                    </Column>
                </Column>
            </Card>
        </div>
    );
}
