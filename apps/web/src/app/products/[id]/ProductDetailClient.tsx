"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Spinner,
} from "@buttergolf/ui";
import type { ProductCardData } from "@buttergolf/app";

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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showMobileBar, setShowMobileBar] = useState(false);
  const router = useRouter();

  const selectedImage = product.images[selectedImageIndex];

  // Generate deterministic viewer count from product ID (avoid hydration mismatch)
  const viewerCount = useMemo(() => {
    // Convert product ID to a number for consistent random-like value
    let hash = 0;
    for (let i = 0; i < product.id.length; i++) {
      hash = ((hash << 5) - hash) + product.id.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    // Use hash to generate value between 20-70
    return 20 + (Math.abs(hash) % 50);
  }, [product.id]);

  // Handle scroll for mobile bar
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 400;
      setShowMobileBar(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBuyNow = () => {
    if (product.isSold) return;

    setPurchasing(true);
    // Navigate to embedded checkout page
    router.push(`/checkout?productId=${product.id}`);
  };

  const handleKeyboardNav = (e: KeyboardEvent) => {
    if (!lightboxOpen) return;

    if (e.key === "ArrowLeft" && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    } else if (e.key === "ArrowRight" && selectedImageIndex < product.images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    } else if (e.key === "Escape") {
      setLightboxOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyboardNav);
    return () => window.removeEventListener("keydown", handleKeyboardNav);
  }, [lightboxOpen, selectedImageIndex]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Listed yesterday";
    if (diffDays < 7) return `Listed ${diffDays} days ago`;
    if (diffDays < 30) return `Listed ${Math.floor(diffDays / 7)} weeks ago`;
    return `Listed ${date.toLocaleDateString()}`;
  };

  return (
    <>
      <Container size="lg" padding="$md">
        <Column gap="$lg" paddingVertical="$lg">
          {/* Breadcrumb */}
          <Row gap="$sm" alignItems="center" flexWrap="wrap">
            <Link href="/" style={{ textDecoration: "none" }}>
              <Text size="sm" color="$textSecondary" hoverStyle={{ color: "$primary" }}>
                Home
              </Text>
            </Link>
            <Text size="sm" color="$textMuted">/</Text>
            <Link
              href={`/category/${product.category.slug}`}
              style={{ textDecoration: "none" }}
            >
              <Text size="sm" color="$textSecondary" hoverStyle={{ color: "$primary" }}>
                {product.category.name}
              </Text>
            </Link>
            <Text size="sm" color="$textMuted">/</Text>
            <Text size="sm" color="$text">{product.title}</Text>
          </Row>

          {/* Main Content Grid */}
          <Row
            gap="$2xl"
            flexDirection="column"
            $lg={{ flexDirection: "row", alignItems: "flex-start" }}
            alignItems="stretch"
          >
            {/* Left Column - Image Gallery */}
            <Column
              gap="$lg"
              flex={1}
              minWidth={0}
              $lg={{
                flexBasis: "60%",
                maxWidth: "calc(100% - 420px - 48px)"
              }}
            >
              {/* Gallery Row: Thumbnails + Main Image */}
              <Row gap="$md" alignItems="flex-start">
                {/* Thumbnail Gallery - Left Side */}
                {product.images.length > 1 && (
                  <Column gap="$md" flexShrink={0}>
                    {product.images.map((img, index) => (
                      <Card
                        key={img.id}
                        variant="outlined"
                        padding="$0"
                        cursor="pointer"
                        onPress={() => setSelectedImageIndex(index)}
                        borderColor={index === selectedImageIndex ? "$primary" : "$border"}
                        borderWidth={index === selectedImageIndex ? 3 : 1}
                        backgroundColor="$surface"
                        hoverStyle={{
                          borderColor: "$primary",
                          transform: "scale(1.05)",
                        }}
                        animation="quick"
                        width={80}
                        height={80}
                        overflow="hidden"
                        borderRadius="$lg"
                        position="relative"
                      >
                        <Image
                          source={{ uri: img.url }}
                          width="100%"
                          height="100%"
                          objectFit="cover"
                          alt={`${product.title} - Image ${index + 1}`}
                        />
                      </Card>
                    ))}
                  </Column>
                )}

                {/* Main Image */}
                <Card
                  variant="outlined"
                  padding="$0"
                  overflow="hidden"
                  backgroundColor="$surface"
                  borderRadius="$xl"
                  cursor="pointer"
                  onPress={() => setLightboxOpen(true)}
                  position="relative"
                  flex={1}
                >
                  <div style={{ position: "relative", paddingBottom: "100%", overflow: "hidden" }}>
                    <Image
                      source={{ uri: selectedImage.url }}
                      width="100%"
                      height="100%"
                      objectFit="cover"
                      alt={product.title}
                      position="absolute"
                      top={0}
                      left={0}
                    />
                  </div>

                  {/* Image Counter */}
                  {product.images.length > 1 && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 16,
                        right: 16,
                        background: "rgba(0, 0, 0, 0.7)",
                        color: "white",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      {selectedImageIndex + 1} / {product.images.length}
                    </div>
                  )}
                </Card>
              </Row>

              {/* Product Description */}
              <Card
                variant="filled"
                padding="$xl"
                backgroundColor="$background"
                borderRadius="$xl"
              >
                <Column gap="$lg">
                  <Heading level={3} color="$secondary">
                    Description
                  </Heading>
                  <Text
                    color="$text"
                    size="md"
                    whiteSpace="pre-wrap"
                  >
                    {product.description}
                  </Text>
                </Column>
              </Card>

              {/* Specifications Table */}
              <Card
                variant="outlined"
                padding="$xl"
                borderRadius="$xl"
                backgroundColor="$surface"
              >
                <Column gap="$lg">
                  <Heading level={3} color="$secondary">
                    Specifications
                  </Heading>
                  <Column gap="$sm">
                    {product.brand && (
                      <Row
                        justifyContent="space-between"
                        paddingVertical="$sm"
                        borderBottomWidth={1}
                        borderBottomColor="$border"
                      >
                        <Text size="sm" color="$textMuted">
                          Brand
                        </Text>
                        <Text size="sm" weight="semibold">
                          {product.brand}
                        </Text>
                      </Row>
                    )}
                    {product.model && (
                      <Row
                        justifyContent="space-between"
                        paddingVertical="$sm"
                        borderBottomWidth={1}
                        borderBottomColor="$border"
                      >
                        <Text size="sm" color="$textMuted">
                          Model
                        </Text>
                        <Text size="sm" weight="semibold">
                          {product.model}
                        </Text>
                      </Row>
                    )}
                    <Row
                      justifyContent="space-between"
                      paddingVertical="$sm"
                      borderBottomWidth={1}
                      borderBottomColor="$border"
                    >
                      <Text size="sm" color="$textMuted">
                        Condition
                      </Text>
                      <Text size="sm" weight="semibold">
                        {product.condition.replace("_", " ")}
                      </Text>
                    </Row>
                    <Row
                      justifyContent="space-between"
                      paddingVertical="$sm"
                      borderBottomWidth={1}
                      borderBottomColor="$border"
                    >
                      <Text size="sm" color="$textMuted">
                        Category
                      </Text>
                      <Text size="sm" weight="semibold">
                        {product.category.name}
                      </Text>
                    </Row>
                    <Row justifyContent="space-between" paddingVertical="$sm">
                      <Text size="sm" color="$textMuted">
                        Listed
                      </Text>
                      <Text size="sm" weight="semibold">
                        {formatDate(product.createdAt)}
                      </Text>
                    </Row>
                  </Column>
                </Column>
              </Card>
            </Column>

            {/* Right Column - Sticky Product Info */}
            <Column
              gap="$lg"
              flex={0}
              width="100%"
              $lg={{
                width: 420,
                flexShrink: 0,
              }}
            >
              {/* Status and Title Card */}
              <Card
                variant="elevated"
                padding="$xl"
                backgroundColor="$surface"
                borderRadius="$xl"
              >
                <Column gap="$lg">
                  {/* Status Badges */}
                  <Row gap="$sm" alignItems="center" flexWrap="wrap">
                    <Badge variant={product.isSold ? "neutral" : "success"} size="lg">
                      {product.isSold ? "Sold Out" : "Available"}
                    </Badge>
                    <Badge variant="info" size="lg">
                      {product.condition.replace("_", " ")}
                    </Badge>
                    {product.category && (
                      <Badge variant="outline" size="lg">
                        {product.category.name}
                      </Badge>
                    )}
                  </Row>

                  {/* Title */}
                  <Heading level={1} size="$9">
                    {product.title}
                  </Heading>

                  {/* Price */}
                  <Row alignItems="baseline" gap="$sm">
                    <Heading level={2} color="$primary" size="$10">
                      £{product.price.toFixed(2)}
                    </Heading>
                  </Row>

                  {/* Trust Signals */}
                  <Card variant="filled" padding="$md" backgroundColor="$background">
                    <Column gap="$xs">
                      <Row gap="$sm" alignItems="center">
                        <Text size="sm">✓</Text>
                        <Text size="sm" color="$textSecondary">
                          Secure checkout
                        </Text>
                      </Row>
                      <Row gap="$sm" alignItems="center">
                        <Text size="sm">✓</Text>
                        <Text size="sm" color="$textSecondary">
                          Buyer protection included
                        </Text>
                      </Row>
                      <Row gap="$sm" alignItems="center">
                        <Text size="sm">👁️</Text>
                        <Text size="sm" color="$textSecondary">
                          {viewerCount} people viewing
                        </Text>
                      </Row>
                    </Column>
                  </Card>
                </Column>
              </Card>

              {/* CTA Buttons */}
              <Column gap="$md">
                <Button
                  size="lg"
                  tone="primary"
                  width="100%"
                  disabled={product.isSold || purchasing}
                  onPress={handleBuyNow}
                  opacity={purchasing ? 0.6 : 1}
                  height={56}
                  hoverStyle={{
                    backgroundColor: "$primaryHover",
                    transform: "scale(1.02)",
                  }}
                  pressStyle={{
                    backgroundColor: "$primaryPress",
                    transform: "scale(0.98)",
                  }}
                >
                  {product.isSold ? "Sold Out" : purchasing ? "Processing..." : "Buy Now"}
                </Button>
                <Button
                  size="lg"
                  tone="outline"
                  width="100%"
                  height={56}
                  borderColor="$primary"
                  borderWidth={2}
                  color="$primary"
                  hoverStyle={{
                    backgroundColor: "$primaryLight",
                  }}
                >
                  Add to Wishlist ♥
                </Button>
              </Column>

              {/* Delivery & Returns Info */}
              <Card
                variant="outlined"
                padding="$lg"
                backgroundColor="$surface"
                borderRadius="$lg"
              >
                <Column gap="$md">
                  <Row gap="$sm" alignItems="center">
                    <Text size="lg">📦</Text>
                    <Column gap="$xs" flex={1}>
                      <Text size="sm" weight="semibold">
                        Fast Delivery
                      </Text>
                      <Text size="xs" color="$textMuted">
                        Seller typically ships within 2 business days
                      </Text>
                    </Column>
                  </Row>
                  <Row gap="$sm" alignItems="center">
                    <Text size="lg">↩️</Text>
                    <Column gap="$xs" flex={1}>
                      <Text size="sm" weight="semibold">
                        Returns Accepted
                      </Text>
                      <Text size="xs" color="$textMuted">
                        30-day return policy. Item must be unused.
                      </Text>
                    </Column>
                  </Row>
                </Column>
              </Card>

              {/* Seller Info Card */}
              <Card
                variant="outlined"
                padding="$lg"
                backgroundColor="$surface"
                borderRadius="$lg"
              >
                <Column gap="$md">
                  <Text weight="semibold" color="$secondary">
                    Seller Information
                  </Text>
                  <Row gap="$md" alignItems="center">
                    {product.user.imageUrl ? (
                      <Image
                        source={{ uri: product.user.imageUrl }}
                        width={56}
                        height={56}
                        borderRadius="$full"
                        backgroundColor="$background"
                      />
                    ) : (
                      <div
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: "50%",
                          background: "#E25F2F",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "24px",
                          fontWeight: "bold",
                        }}
                      >
                        {product.user.name?.charAt(0) || "?"}
                      </div>
                    )}
                    <Column gap="$xs" flex={1}>
                      <Text weight="semibold">{product.user.name || "Anonymous"}</Text>
                      <Row gap="$xs" alignItems="center">
                        <Badge variant="success" size="sm">
                          ✓ Verified
                        </Badge>
                      </Row>
                    </Column>
                  </Row>
                  <Button size="$4" width="100%" backgroundColor="$secondary" color="$textInverse">
                    Contact Seller
                  </Button>
                </Column>
              </Card>
            </Column>
          </Row>
        </Column>
      </Container>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxOpen(false);
            }}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              background: "white",
              border: "none",
              borderRadius: "50%",
              width: 48,
              height: 48,
              fontSize: "24px",
              cursor: "pointer",
              zIndex: 10000,
            }}
          >
            ✕
          </button>

          {/* Navigation Arrows */}
          {selectedImageIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex(selectedImageIndex - 1);
              }}
              style={{
                position: "absolute",
                left: 20,
                background: "white",
                border: "none",
                borderRadius: "50%",
                width: 48,
                height: 48,
                fontSize: "24px",
                cursor: "pointer",
                zIndex: 10000,
              }}
            >
              ←
            </button>
          )}

          {selectedImageIndex < product.images.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex(selectedImageIndex + 1);
              }}
              style={{
                position: "absolute",
                right: 20,
                background: "white",
                border: "none",
                borderRadius: "50%",
                width: 48,
                height: 48,
                fontSize: "24px",
                cursor: "pointer",
                zIndex: 10000,
              }}
            >
              →
            </button>
          )}

          {/* Main Image */}
          <img
            src={selectedImage.url}
            alt={product.title}
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              objectFit: "contain",
            }}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Image Counter */}
          <div
            style={{
              position: "absolute",
              bottom: 30,
              left: "50%",
              transform: "translateX(-50%)",
              background: "white",
              padding: "10px 20px",
              borderRadius: "25px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            {selectedImageIndex + 1} / {product.images.length}
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Bar */}
      {showMobileBar && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "white",
            borderTop: "2px solid #E25F2F",
            padding: "16px",
            zIndex: 1000,
            boxShadow: "0 -4px 12px rgba(0,0,0,0.1)",
            display: "none",
          }}
          className="mobile-sticky-bar"
        >
          <Row gap="$md" alignItems="center" justifyContent="space-between">
            <Column gap="$xs">
              <Text size="xs" color="$textMuted">
                {product.title}
              </Text>
              <Text size="lg" weight="bold" color="$primary">
                £{product.price.toFixed(2)}
              </Text>
            </Column>
            <Button
              size="$4"
              backgroundColor="$primary"
              color="$textInverse"
              onPress={handleBuyNow}
              disabled={product.isSold || purchasing}
              paddingHorizontal="$6"
            >
              {product.isSold ? "Sold" : "Buy Now"}
            </Button>
          </Row>
        </div>
      )}

      {/* Responsive CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media (min-width: 1024px) {
            .product-sidebar {
              position: sticky;
              top: 100px;
            }
          }

          @media (max-width: 1024px) {
            .mobile-sticky-bar {
              display: flex !important;
            }
          }
        `
      }} />
    </>
  );
}
