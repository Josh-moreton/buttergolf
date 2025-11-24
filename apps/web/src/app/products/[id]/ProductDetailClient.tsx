"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import NextImage from "next/image";
import {
  Column,
  Row,
  Container,
  Text,
  Button,
  Card,
  Image,
} from "@buttergolf/ui";
import { ProductInformation } from "./_components/ProductInformation";
import { MakeOfferModal } from "./_components/MakeOfferModal";

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
  const [makeOfferModalOpen, setMakeOfferModalOpen] = useState(false);
  const router = useRouter();
  const { isSignedIn } = useUser();

  const selectedImage = product.images[selectedImageIndex];

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

  const handleMakeOffer = () => {
    if (!isSignedIn) {
      // Redirect to sign-in page with return URL
      const redirectUrl = typeof globalThis !== "undefined" && globalThis.location
        ? globalThis.location.href
        : `/products/${product.id}`;
      router.push(`/sign-in?redirect_url=${encodeURIComponent(redirectUrl)}`);
      return;
    }
    setMakeOfferModalOpen(true);
  };

  const handleSubmitOffer = async (offerAmount: number) => {
    try {
      const response = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          amount: offerAmount,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Offer submission failed:", response.status, error);
        throw new Error(error.error || "Failed to submit offer");
      }

      const result = await response.json();
      console.log("Offer submitted successfully:", result);

      // Close modal
      setMakeOfferModalOpen(false);

      // Redirect to offer detail page
      router.push(`/offers/${result.id}`);
    } catch (error) {
      console.error("Error submitting offer:", error);
      throw error;
    }
  };

  const handleKeyboardNav = useCallback((e: KeyboardEvent) => {
    if (!lightboxOpen) return;

    if (e.key === "ArrowLeft" && selectedImageIndex > 0) {
      setSelectedImageIndex((prev) => Math.max(0, prev - 1));
    } else if (e.key === "ArrowRight" && selectedImageIndex < product.images.length - 1) {
      setSelectedImageIndex((prev) => Math.min(product.images.length - 1, prev + 1));
    } else if (e.key === "Escape") {
      setLightboxOpen(false);
    }
  }, [lightboxOpen, product.images.length, selectedImageIndex]);

  useEffect(() => {
    globalThis.addEventListener?.("keydown", handleKeyboardNav);
    return () => globalThis.removeEventListener?.("keydown", handleKeyboardNav);
  }, [handleKeyboardNav]);

  return (
    <>
      <Container size="xl" padding="$md" backgroundColor="$pureWhite">
        <Column gap="$lg" paddingVertical="$lg">
          {/* Breadcrumb */}
          <Row gap="$sm" alignItems="center" flexWrap="wrap">
            <Link href="/" style={{ textDecoration: "none" }}>
              <Text size="$3" color="$ironstone" hoverStyle={{ color: "$primary" }}>
                Listings
              </Text>
            </Link>
            <Text size="$3" color="$ironstone">&gt;</Text>
            <Link
              href={`/category/${product.category.slug}`}
              style={{ textDecoration: "none" }}
            >
              <Text size="$3" color="$ironstone" hoverStyle={{ color: "$primary" }}>
                {product.category.name}
              </Text>
            </Link>
            <Text size="$3" color="$ironstone">&gt;</Text>
            <Text size="$3" color="$ironstone" weight="bold">{product.title}</Text>
          </Row>

          {/* Main Content Grid */}
          <Row
            gap="$xl"
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
                maxWidth: "calc(100% - 420px - 32px)"
              }}
            >
              {/* Gallery Row: Thumbnails + Main Image */}
              <Row gap="$sm" alignItems="flex-start">
                {/* Thumbnail Gallery - Left Side */}
                {product.images.length > 1 && (
                  <Column gap="$sm" flexShrink={0}>
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
                        width={64}
                        height={64}
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
                  height={600}
                  $lg={{ height: 650 }}
                >
                  <Image
                    source={{ uri: selectedImage.url }}
                    width="100%"
                    height="100%"
                    objectFit="contain"
                    alt={product.title}
                  />

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
            </Column>

            {/* Right Column - Product Information */}
            <ProductInformation
              product={product}
              onBuyNow={handleBuyNow}
              onMakeOffer={handleMakeOffer}
              purchasing={purchasing}
            />
          </Row>
        </Column>
      </Container>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
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
          <Button
            chromeless
            aria-label="Close image gallery"
            onPress={() => setLightboxOpen(false)}
            position="absolute"
            inset={0}
            backgroundColor="transparent"
            cursor="pointer"
            padding={0}
          />
          {/* Close Button */}
          <Button
            chromeless
            onPress={(e) => {
              e.stopPropagation();
              setLightboxOpen(false);
            }}
            position="absolute"
            top={20}
            right={20}
            backgroundColor="$surface"
            borderRadius="$full"
            width={48}
            height={48}
            display="flex"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            zIndex={10000}
            padding={0}
          >
            <Text size="$8" fontWeight="700" color="$text">✕</Text>
          </Button>

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
          <NextImage
            src={selectedImage.url}
            alt={product.title}
            width={1600}
            height={1200}
            sizes="90vw"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              objectFit: "contain",
              position: "relative",
              zIndex: 1,
            }}
            onClick={(e) => e.stopPropagation()}
            priority
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
              zIndex: 1,
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
              <Text size="$2" color="$textMuted">
                {product.title}
              </Text>
              <Text size="$6" weight="bold" color="$primary">
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

      {/* Make Offer Modal */}
      <MakeOfferModal
        product={product}
        isOpen={makeOfferModalOpen}
        onClose={() => setMakeOfferModalOpen(false)}
        onSubmitOffer={handleSubmitOffer}
      />
    </>
  );
}
