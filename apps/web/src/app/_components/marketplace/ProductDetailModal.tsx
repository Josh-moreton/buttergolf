"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  Column,
  Row,
  Heading,
  Text,
  Button,
  Card,
  Image,
  Badge,
  Spinner,
  XStack,
  YStack,
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

interface Product {
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

interface ProductDetailModalProps {
  productId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDetailModal({
  productId,
  open,
  onOpenChange,
}: ProductDetailModalProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!open || !productId) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);

    fetch(`/api/products/${productId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [productId, open]);

  const selectedImage = product?.images[selectedImageIndex];

  return (
    <Dialog modal open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          backgroundColor="$backgroundPress"
        />
        <Dialog.Content
          bordered
          elevate
          key={`product-${productId}`}
          animateOnly={["transform", "opacity"]}
          animation={[
            "quick",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          gap="$4"
          maxWidth={1000}
          width="90vw"
          maxHeight="90vh"
          padding="$0"
          overflow="hidden"
        >
          {loading && (
            <YStack padding="$8" alignItems="center" justifyContent="center">
              <Spinner size="lg" color="$primary" />
              <Text color="$textSecondary" marginTop="$4">
                Loading product...
              </Text>
            </YStack>
          )}

          {!loading && (error || !product) && (
            <YStack padding="$8" alignItems="center" gap="$4">
              <Heading level={3}>Product Not Found</Heading>
              <Text color="$textSecondary">
                {error || "This product does not exist or has been removed."}
              </Text>
              <Button onPress={() => onOpenChange(false)}>Close</Button>
            </YStack>
          )}

          {!loading && !error && product && (
            <>
              {/* Close Button */}
              <Dialog.Close asChild>
                <Button
                  position="absolute"
                  top="$4"
                  right="$4"
                  size="$3"
                  circular
                  zIndex={1000}
                  backgroundColor="$background"
                  opacity={0.9}
                  hoverStyle={{ opacity: 1 }}
                >
                  ✕
                </Button>
              </Dialog.Close>

              {/* Scrollable Content */}
              <YStack overflow="scroll" maxHeight="90vh" padding="$6" gap="$6">
                <Row gap="$6" flexWrap="wrap">
                  {/* Left Column - Images */}
                  <Column gap="$4" flex={1} minWidth={300}>
                    {/* Main Image */}
                    <Card variant="outlined" padding="$0">
                      <Image
                        source={{ uri: selectedImage?.url || "" }}
                        width="100%"
                        height={400}
                        objectFit="cover"
                        borderRadius="$lg"
                        alt={product?.title || "Product image"}
                      />
                    </Card>

                    {/* Thumbnail Gallery */}
                    {product.images.length > 1 && (
                      <XStack gap="$2" flexWrap="wrap">
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
                              width={60}
                              height={60}
                              objectFit="cover"
                              borderRadius="$sm"
                              alt={`${product?.title} thumbnail ${index + 1}`}
                            />
                          </Card>
                        ))}
                      </XStack>
                    )}
                  </Column>

                  {/* Right Column - Product Info */}
                  <Column gap="$4" flex={1} minWidth={300}>
                    {/* Status Badges */}
                    <Row gap="$2" alignItems="center" flexWrap="wrap">
                      <Badge variant={product.isSold ? "neutral" : "success"}>
                        {product.isSold ? "Sold" : "Available"}
                      </Badge>
                      <Badge variant="info">
                        {product.condition.replace("_", " ")}
                      </Badge>
                      {product.category && (
                        <Badge variant="outline">{product.category.name}</Badge>
                      )}
                    </Row>

                    {/* Title */}
                    <Dialog.Title asChild>
                      <Heading level={2}>{product.title}</Heading>
                    </Dialog.Title>

                    {/* Price */}
                    <Heading level={2} color="$primary">
                      £{product.price.toFixed(2)}
                    </Heading>

                    {/* Brand & Model */}
                    {(product.brand || product.model) && (
                      <Row gap="$6">
                        {product.brand && (
                          <Column gap="$1">
                            <Text size="xs" color="$textMuted">
                              Brand
                            </Text>
                            <Text weight="semibold">{product.brand}</Text>
                          </Column>
                        )}
                        {product.model && (
                          <Column gap="$1">
                            <Text size="xs" color="$textMuted">
                              Model
                            </Text>
                            <Text weight="semibold">{product.model}</Text>
                          </Column>
                        )}
                      </Row>
                    )}

                    {/* Description */}
                    <Card variant="filled" padding="$4">
                      <Column gap="$3">
                        <Heading level={4}>Description</Heading>
                        <Dialog.Description asChild>
                          <Text
                            color="$textSecondary"
                            style={{ whiteSpace: "pre-wrap" }}
                          >
                            {product.description}
                          </Text>
                        </Dialog.Description>
                      </Column>
                    </Card>

                    {/* Quantity Selector (if not sold) */}
                    {!product.isSold && (
                      <Card variant="outlined" padding="$4">
                        <Row gap="$4" alignItems="center">
                          <Text weight="semibold">Quantity:</Text>
                          <Row gap="$2" alignItems="center">
                            <Button
                              size="$3"
                              circular
                              onPress={() =>
                                setQuantity(Math.max(1, quantity - 1))
                              }
                              disabled={quantity <= 1}
                            >
                              -
                            </Button>
                            <Text
                              width={40}
                              textAlign="center"
                              weight="semibold"
                              fontSize="$5"
                            >
                              {quantity}
                            </Text>
                            <Button
                              size="$3"
                              circular
                              onPress={() => setQuantity(quantity + 1)}
                            >
                              +
                            </Button>
                          </Row>
                        </Row>
                      </Card>
                    )}

                    {/* Action Buttons */}
                    <Column gap="$3">
                      <Button
                        size="$5"
                        width="100%"
                        disabled={product.isSold}
                        backgroundColor="$primary"
                        color="$textInverse"
                      >
                        {product.isSold ? "Sold Out" : "Add to Cart"}
                      </Button>
                      <Row gap="$3">
                        <Button size="$4" flex={1}>
                          Contact Seller
                        </Button>
                        <Button size="$4" flex={1}>
                          Add to Wishlist
                        </Button>
                      </Row>
                    </Column>

                    {/* Seller Info */}
                    <Card variant="outlined" padding="$4">
                      <Row gap="$3" alignItems="center">
                        {product.user.imageUrl && (
                          <Image
                            source={{ uri: product.user.imageUrl }}
                            width={48}
                            height={48}
                            borderRadius={24}
                            alt={product.user.name || "Seller"}
                          />
                        )}
                        <Column gap="$1">
                          <Text weight="semibold">
                            {product.user.name || "Anonymous"}
                          </Text>
                          <Text
                            size="xs"
                            color="$textMuted"
                            suppressHydrationWarning
                          >
                            Listed{" "}
                            {new Date(product.createdAt).toLocaleDateString()}
                          </Text>
                        </Column>
                      </Row>
                    </Card>
                  </Column>
                </Row>
              </YStack>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
