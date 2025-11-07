"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Column,
  Row,
  Container,
  Heading,
  Text,
  Button,
  Card,
  Image,
  Badge,
} from "@buttergolf/ui";

interface ProductImage {
  id: string;
  url: string;
  sortOrder: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface User {
  id: string;
  name: string | null;
  imageUrl: string | null;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: string;
  brand: string | null;
  model: string | null;
  isSold: boolean;
  views: number;
  createdAt: string;
  images: ProductImage[];
  category: Category;
  user: User;
}

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [purchasing, setPurchasing] = useState(false);

  const selectedImage = product.images[selectedImageIndex];

  const handleBuyNow = async () => {
    if (product.isSold) return;

    setPurchasing(true);
    try {
      const response = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const { url } = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (err) {
      console.error("Purchase failed:", err);
      alert(err instanceof Error ? err.message : "Failed to start checkout. Please try again.");
      setPurchasing(false);
    }
  };

  return (
    <Container size="lg" padding="$md">
      <Column gap="$xl" paddingVertical="$10">
        {/* Breadcrumb */}
        <Row gap="$sm" alignItems="center" flexWrap="wrap">
          <Link href="/" style={{ textDecoration: "none" }}>
            <Text color="$textSecondary" hoverStyle={{ color: "$primary" }}>
              Home
            </Text>
          </Link>
          <Text color="$textMuted">/</Text>
          <Link
            href={`/category/${product.category.slug}`}
            style={{ textDecoration: "none" }}
          >
            <Text color="$textSecondary" hoverStyle={{ color: "$primary" }}>
              {product.category.name}
            </Text>
          </Link>
          <Text color="$textMuted">/</Text>
          <Text color="$text">{product.title}</Text>
        </Row>

        {/* Main Content */}
        <Row gap="$xl" flexDirection="column" $lg={{ flexDirection: "row" }}>
          {/* Images */}
          <Column gap="$md" flex={1}>
            {/* Main Image */}
            <Card variant="outlined" padding="$0">
              <Image
                source={{ uri: selectedImage.url }}
                width="100%"
                height={500}
                objectFit="cover"
                borderRadius="$lg"
              />
            </Card>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <Row gap="$sm" flexWrap="wrap">
                {product.images.map((img, index) => (
                  <Card
                    key={img.id}
                    variant="outlined"
                    padding="$0"
                    cursor="pointer"
                    onPress={() => setSelectedImageIndex(index)}
                    {...(index === selectedImageIndex && {
                      borderColor: "$primary",
                      borderWidth: 2,
                    })}
                  >
                    <Image
                      source={{ uri: img.url }}
                      width={80}
                      height={80}
                      objectFit="cover"
                      borderRadius="$md"
                    />
                  </Card>
                ))}
              </Row>
            )}
          </Column>

          {/* Product Info */}
          <Column gap="$lg" flex={1}>
            <Column gap="$md">
              <Row gap="$sm" alignItems="center">
                <Badge variant={product.isSold ? "neutral" : "success"}>
                  {product.isSold ? "Sold" : "Available"}
                </Badge>
                <Badge variant="info">
                  {product.condition.replace("_", " ")}
                </Badge>
              </Row>

              <Heading level={1}>{product.title}</Heading>

              <Heading level={2} color="$primary">
                £{product.price.toFixed(2)}
              </Heading>

              {(product.brand || product.model) && (
                <Row gap="$md">
                  {product.brand && (
                    <Column gap="$xs">
                      <Text size="xs" color="$textMuted">
                        Brand
                      </Text>
                      <Text weight="semibold">{product.brand}</Text>
                    </Column>
                  )}
                  {product.model && (
                    <Column gap="$xs">
                      <Text size="xs" color="$textMuted">
                        Model
                      </Text>
                      <Text weight="semibold">{product.model}</Text>
                    </Column>
                  )}
                </Row>
              )}
            </Column>

            <Card variant="filled" padding="$lg">
              <Column gap="$md">
                <Heading level={4}>Description</Heading>
                <Text color="$textSecondary" style={{ whiteSpace: "pre-wrap" }}>
                  {product.description}
                </Text>
              </Column>
            </Card>

            <Column gap="$md">
              <Button
                size="$5"
                width="100%"
                disabled={product.isSold || purchasing}
                backgroundColor="$primary"
                color="$textInverse"
                onPress={handleBuyNow}
                opacity={purchasing ? 0.6 : 1}
              >
                {product.isSold ? "Sold Out" : purchasing ? "Processing..." : "Buy Now"}
              </Button>
              <Button size="$5" width="100%">
                Add to Wishlist
              </Button>
            </Column>

            <Card variant="outlined" padding="$md">
              <Row gap="$md" alignItems="center">
                {product.user.imageUrl && (
                  <Image
                    source={{ uri: product.user.imageUrl }}
                    width={48}
                    height={48}
                    borderRadius="$full"
                  />
                )}
                <Column gap="$xs">
                  <Text weight="semibold">
                    {product.user.name || "Anonymous"}
                  </Text>
                  <Text size="xs" color="$textMuted">
                    Listed {new Date(product.createdAt).toLocaleDateString()}
                  </Text>
                </Column>
              </Row>
            </Card>
          </Column>
        </Row>
      </Column>
    </Container>
  );
}
