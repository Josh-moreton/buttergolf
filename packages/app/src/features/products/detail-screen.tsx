"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Column,
  Row,
  ScrollView,
  Text,
  Heading,
  Button,
  Badge,
  Image,
  Spinner,
  Card,
  View,
} from "@buttergolf/ui";
import type { Product } from "../../types/product";
import { useLink } from "solito/navigation";
import { routes } from "../../navigation";
import { ArrowLeft, Heart, Share2, Eye } from "@tamagui/lucide-icons";

// Helper to format condition rating (1-10) to label
function getConditionLabel(rating: number): string {
  if (rating >= 9) return "Like New";
  if (rating >= 7) return "Excellent";
  if (rating >= 5) return "Good";
  if (rating >= 3) return "Fair";
  return "Poor";
}

// Helper to get condition color
function getConditionColor(rating: number): string {
  if (rating >= 9) return "$success";
  if (rating >= 7) return "$info";
  if (rating >= 5) return "$warning";
  return "$error";
}

interface ProductDetailScreenProps {
  productId: string;
  onFetchProduct?: (id: string) => Promise<Product | null>;
}

export function ProductDetailScreen({
  productId,
  onFetchProduct,
}: Readonly<ProductDetailScreenProps>) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const backLink = useLink({ href: routes.products });

  const fetchProduct = useCallback(async () => {
    if (!onFetchProduct || !productId) {
      setLoading(false);
      setError("No product ID provided");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fetchedProduct = await onFetchProduct(productId);
      if (fetchedProduct) {
        setProduct(fetchedProduct);
      } else {
        setError("Product not found");
      }
    } catch (err) {
      console.error("Failed to fetch product:", err);
      setError("Failed to load product");
    } finally {
      setLoading(false);
    }
  }, [onFetchProduct, productId]);

  useEffect(() => {
    void fetchProduct();
  }, [fetchProduct]);

  if (loading) {
    return (
      <Column
        flex={1}
        backgroundColor="$primary"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="lg" color="$pureWhite" />
        <Text color="$textInverse" marginTop="$3">
          Loading product...
        </Text>
      </Column>
    );
  }

  if (error || !product) {
    return (
      <Column flex={1} backgroundColor="$background" padding="$4" gap="$4">
        <Button {...backLink} size="$4" icon={ArrowLeft}>
          Back to Products
        </Button>
        <Column alignItems="center" justifyContent="center" flex={1}>
          <Text color="$error" size="$6">
            {error || "Product not found"}
          </Text>
        </Column>
      </Column>
    );
  }

  const primaryImage = product.images?.[0]?.url || "";
  const formattedCondition = product.condition?.replace("_", " ") || "Unknown";
  const sellerName = `${product.user.firstName || ""} ${product.user.lastName || ""}`.trim() || "Anonymous";
  
  // Calculate average condition from individual ratings
  const hasConditionRatings = product.gripCondition && product.headCondition && product.shaftCondition;
  const avgCondition = hasConditionRatings
    ? Math.round((product.gripCondition! + product.headCondition! + product.shaftCondition!) / 3)
    : null;

  return (
    <ScrollView flex={1} backgroundColor="$background">
      <Column>
        {/* Product Image */}
        {primaryImage && (
          <View position="relative">
            <Image
              source={{ uri: primaryImage }}
              width="100%"
              height={400}
              objectFit="cover"
              backgroundColor="$gray100"
            />
            {/* Back button overlay */}
            <Button
              {...backLink}
              position="absolute"
              top="$4"
              left="$4"
              size="$4"
              circular
              backgroundColor="$pureWhite"
              icon={<ArrowLeft size={20} color="$ironstone" />}
            />
            {/* Action buttons overlay */}
            <Row position="absolute" top="$4" right="$4" gap="$2">
              <Button
                size="$4"
                circular
                backgroundColor="$pureWhite"
                icon={<Heart size={20} color="$ironstone" />}
              />
              <Button
                size="$4"
                circular
                backgroundColor="$pureWhite"
                icon={<Share2 size={20} color="$ironstone" />}
              />
            </Row>
            {/* Sold badge */}
            {product.isSold && (
              <View
                position="absolute"
                bottom="$4"
                left="$4"
                backgroundColor="$error"
                paddingHorizontal="$4"
                paddingVertical="$2"
                borderRadius="$lg"
              >
                <Text color="$pureWhite" fontWeight="700" size="$5">
                  SOLD
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Product Details */}
        <Column padding="$4" gap="$4">
          {/* Price and Title */}
          <Column gap="$2">
            <Text size="$9" fontWeight="800" color="$primary">
              £{product.price.toFixed(2)}
            </Text>
            <Heading level={2}>{product.title}</Heading>
            
            {/* Category, Brand, Model */}
            <Row gap="$2" alignItems="center" flexWrap="wrap">
              <Badge variant="neutral" size="sm">
                <Text size="$2" fontWeight="500">{product.category.name}</Text>
              </Badge>
              {product.brand && (
                <Badge variant="primary" size="sm">
                  <Text size="$2" fontWeight="500">{product.brand.name}</Text>
                </Badge>
              )}
              {product.model && (
                <Text size="$4" color="$textSecondary">
                  Model: {product.model}
                </Text>
              )}
            </Row>

            {/* Views counter */}
            <Row alignItems="center" gap="$1">
              <Eye size={14} color="$slateSmoke" />
              <Text size="$3" color="$textSecondary">
                {product.views} views
              </Text>
            </Row>
          </Column>

          {/* Golf-Specific Details Card */}
          {(product.flex || product.loft || product.woodsSubcategory || product.headCoverIncluded !== null) && (
            <Card variant="outlined" padding="$lg">
              <Column gap="$3">
                <Text size="$5" fontWeight="700" color="$ironstone">
                  Club Details
                </Text>
                <Row flexWrap="wrap" gap="$4">
                  {product.woodsSubcategory && (
                    <Column gap="$1">
                      <Text size="$3" color="$textSecondary">Type</Text>
                      <Text size="$5" fontWeight="600">{product.woodsSubcategory}</Text>
                    </Column>
                  )}
                  {product.flex && (
                    <Column gap="$1">
                      <Text size="$3" color="$textSecondary">Shaft Flex</Text>
                      <Text size="$5" fontWeight="600">{product.flex}</Text>
                    </Column>
                  )}
                  {product.loft && (
                    <Column gap="$1">
                      <Text size="$3" color="$textSecondary">Loft</Text>
                      <Text size="$5" fontWeight="600">{product.loft}</Text>
                    </Column>
                  )}
                  {product.headCoverIncluded !== null && (
                    <Column gap="$1">
                      <Text size="$3" color="$textSecondary">Head Cover</Text>
                      <Text size="$5" fontWeight="600">
                        {product.headCoverIncluded ? "Included ✓" : "Not Included"}
                      </Text>
                    </Column>
                  )}
                </Row>
              </Column>
            </Card>
          )}

          {/* Condition Rating Card */}
          {hasConditionRatings && (
            <Card variant="outlined" padding="$lg">
              <Column gap="$3">
                <Row alignItems="center" justifyContent="space-between">
                  <Text size="$5" fontWeight="700" color="$ironstone">
                    Condition Rating
                  </Text>
                  {avgCondition && (
                    <Badge variant="success" size="sm">
                      <Text size="$3" fontWeight="600">
                        {getConditionLabel(avgCondition)} ({avgCondition}/10)
                      </Text>
                    </Badge>
                  )}
                </Row>
                
                {/* Individual ratings */}
                <Column gap="$3">
                  {/* Grip */}
                  <Row alignItems="center" gap="$3">
                    <Text size="$4" color="$textSecondary" width={60}>Grip</Text>
                    <View flex={1} height={8} backgroundColor="$cloudMist" borderRadius="$full">
                      <View
                        height={8}
                        width={`${(product.gripCondition! / 10) * 100}%`}
                        backgroundColor={getConditionColor(product.gripCondition!)}
                        borderRadius="$full"
                      />
                    </View>
                    <Text size="$4" fontWeight="600" width={30} textAlign="right">
                      {product.gripCondition}/10
                    </Text>
                  </Row>
                  
                  {/* Head */}
                  <Row alignItems="center" gap="$3">
                    <Text size="$4" color="$textSecondary" width={60}>Head</Text>
                    <View flex={1} height={8} backgroundColor="$cloudMist" borderRadius="$full">
                      <View
                        height={8}
                        width={`${(product.headCondition! / 10) * 100}%`}
                        backgroundColor={getConditionColor(product.headCondition!)}
                        borderRadius="$full"
                      />
                    </View>
                    <Text size="$4" fontWeight="600" width={30} textAlign="right">
                      {product.headCondition}/10
                    </Text>
                  </Row>
                  
                  {/* Shaft */}
                  <Row alignItems="center" gap="$3">
                    <Text size="$4" color="$textSecondary" width={60}>Shaft</Text>
                    <View flex={1} height={8} backgroundColor="$cloudMist" borderRadius="$full">
                      <View
                        height={8}
                        width={`${(product.shaftCondition! / 10) * 100}%`}
                        backgroundColor={getConditionColor(product.shaftCondition!)}
                        borderRadius="$full"
                      />
                    </View>
                    <Text size="$4" fontWeight="600" width={30} textAlign="right">
                      {product.shaftCondition}/10
                    </Text>
                  </Row>
                </Column>
              </Column>
            </Card>
          )}

          {/* Legacy condition badge (if no individual ratings) */}
          {!hasConditionRatings && product.condition && (
            <Card variant="outlined" padding="$lg">
              <Row alignItems="center" justifyContent="space-between">
                <Text size="$5" fontWeight="700" color="$ironstone">
                  Condition
                </Text>
                <Badge variant="neutral" size="md">
                  <Text size="$4" fontWeight="500">{formattedCondition}</Text>
                </Badge>
              </Row>
            </Card>
          )}

          {/* Description */}
          {product.description && (
            <Card variant="outlined" padding="$lg">
              <Column gap="$2">
                <Text size="$5" fontWeight="700" color="$ironstone">
                  Description
                </Text>
                <Text size="$5" color="$text" lineHeight={24}>
                  {product.description}
                </Text>
              </Column>
            </Card>
          )}

          {/* Seller Info */}
          <Card variant="outlined" padding="$lg">
            <Column gap="$3">
              <Text size="$5" fontWeight="700" color="$ironstone">
                Seller
              </Text>
              <Row gap="$3" alignItems="center">
                {product.user.imageUrl ? (
                  <Image
                    source={{ uri: product.user.imageUrl }}
                    width={50}
                    height={50}
                    borderRadius={25}
                  />
                ) : (
                  <View
                    width={50}
                    height={50}
                    borderRadius={25}
                    backgroundColor="$primary"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text color="$pureWhite" fontWeight="700" size="$6">
                      {sellerName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <Column gap="$1">
                  <Text size="$5" fontWeight="600">{sellerName}</Text>
                  <Text size="$3" color="$textSecondary">
                    Member since {new Date(product.createdAt).getFullYear()}
                  </Text>
                </Column>
              </Row>
            </Column>
          </Card>

          {/* Additional Images */}
          {product.images && product.images.length > 1 && (
            <Column gap="$3">
              <Text size="$5" fontWeight="700" color="$ironstone">
                More Photos ({product.images.length - 1})
              </Text>
              <Row gap="$2" flexWrap="wrap">
                {product.images.slice(1).map((image, index) => (
                  <Image
                    key={`${image.url}-${index}`}
                    source={{ uri: image.url }}
                    width={100}
                    height={100}
                    objectFit="cover"
                    borderRadius="$md"
                    backgroundColor="$gray100"
                  />
                ))}
              </Row>
            </Column>
          )}

          {/* Action Buttons */}
          <Column gap="$3" marginTop="$2">
            {!product.isSold ? (
              <>
                <Button butterVariant="primary" size="$5" width="100%">
                  Make an Offer
                </Button>
                <Button butterVariant="secondary" size="$5" width="100%">
                  Message Seller
                </Button>
              </>
            ) : (
              <Button
                size="$5"
                width="100%"
                backgroundColor="$cloudMist"
                disabled
              >
                <Text color="$slateSmoke" fontWeight="600">
                  This item has been sold
                </Text>
              </Button>
            )}
          </Column>
        </Column>
      </Column>
    </ScrollView>
  );
}
