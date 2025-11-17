"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  Column,
  Row,
  Container,
  Text,
  Button,
  Card,
  Image,
  Badge,
  Spinner,
} from "@buttergolf/ui";
import type { ProductCardData } from "@buttergolf/app";
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

  const handleMakeOffer = () => {
    if (!isSignedIn) {
      // Redirect to sign-in page with return URL
      router.push(`/sign-in?redirect_url=${encodeURIComponent(window.location.href)}`);
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

      // Show success message
      alert(`Offer of £${offerAmount.toFixed(2)} submitted successfully! The seller will be notified.`);
    } catch (error) {
      console.error("Error submitting offer:", error);
      throw error;
    }
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

  return (
    <>
      <Container size="xl" padding="$md" backgroundColor="$pureWhite">
        <Column gap="$lg" paddingVertical="$lg">
          {/* Breadcrumb */}
          <Row gap="$sm" alignItems="center" flexWrap="wrap">
            <Link href="/" style={{ textDecoration: "none" }}>
              <Text size="sm" color="$ironstone" hoverStyle={{ color: "$primary" }}>
                Listings
              </Text>
            </Link>
            <Text size="sm" color="$ironstone">&gt;</Text>
            <Link
              href={`/category/${product.category.slug}`}
              style={{ textDecoration: "none" }}
            >
              <Text size="sm" color="$ironstone" hoverStyle={{ color: "$primary" }}>
                {product.category.name}
              </Text>
            </Link>
            <Text size="sm" color="$ironstone">&gt;</Text>
            <Text size="sm" color="$ironstone" weight="bold">{product.title}</Text>
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
