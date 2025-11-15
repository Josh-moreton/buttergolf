"use client";

import React, { useEffect, useState } from "react";
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
} from "@buttergolf/ui";
import type { Product } from "../../types/product";
import { useLink } from "solito/navigation";
import { routes } from "../../navigation";
import { ArrowLeft } from "@tamagui/lucide-icons";

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

  useEffect(() => {
    if (onFetchProduct && productId) {
      setLoading(true);
      setError(null);
      onFetchProduct(productId)
        .then((fetchedProduct) => {
          if (fetchedProduct) {
            setProduct(fetchedProduct);
          } else {
            setError("Product not found");
          }
        })
        .catch((err) => {
          console.error("Failed to fetch product:", err);
          setError("Failed to load product");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setError("No product ID provided");
    }
  }, [productId, onFetchProduct]);

  if (loading) {
    return (
      <Column
        flex={1}
        backgroundColor="$primary"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="lg" color="$primary" />
        <Text color="$textSecondary" marginTop="$3">
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
          <Text color="$error" fontSize="$6">
            {error || "Product not found"}
          </Text>
        </Column>
      </Column>
    );
  }

  const primaryImage = product.images?.[0]?.url || "";
  const formattedCondition = product.condition?.replace("_", " ") || "Unknown";

  return (
    <ScrollView flex={1} backgroundColor="$background">
      <Column gap="$4">
        {/* Product Image */}
        {primaryImage && (
          <Image
            source={{ uri: primaryImage }}
            width="100%"
            height={400}
            objectFit="cover"
            backgroundColor="$gray100"
          />
        )}

        {/* Product Details */}
        <Column padding="$4" gap="$4">
          <Button
            {...backLink}
            size="$3"
            chromeless
            icon={ArrowLeft}
            alignSelf="flex-start"
          >
            Back
          </Button>

          <Column gap="$2">
            <Heading level={2}>{product.title}</Heading>

            <Row gap="$2" alignItems="center">
              <Text size="sm" color="$textSecondary">
                {product.category.name}
              </Text>
              {product.condition && (
                <Badge variant="neutral" size="sm">
                  <Text size="xs" weight="medium">
                    {formattedCondition}
                  </Text>
                </Badge>
              )}
            </Row>

            <Text size="xl" weight="bold" color="$primary">
              £{product.price.toFixed(2)}
            </Text>
          </Column>

          {/* Description */}
          {product.description && (
            <Card variant="outlined" {...{ padding: "md" as any }}>
              <Column gap="$2">
                <Text fontSize="$5" weight="semibold">
                  Description
                </Text>
                <Text size="md" color="$textSecondary">
                  {product.description}
                </Text>
              </Column>
            </Card>
          )}

          {/* Seller Info */}
          <Card variant="outlined" {...{ padding: "md" as any }}>
            <Column gap="$2">
              <Text size="md" weight="semibold">
                Seller
              </Text>
              <Row gap="$2" alignItems="center">
                {product.user.imageUrl && (
                  <Image
                    source={{ uri: product.user.imageUrl }}
                    width={40}
                    height={40}
                    borderRadius="$full"
                  />
                )}
                <Text fontSize="$5">{product.user.name || "Anonymous"}</Text>
              </Row>
            </Column>
          </Card>

          {/* Additional Images */}
          {product.images && product.images.length > 1 && (
            <Column gap="$2">
              <Text size="md" weight="semibold">
                More Images
              </Text>
              <Row gap="$2" flexWrap="wrap">
                {product.images.slice(1).map((image) => (
                  <Image
                    key={image.url}
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

          {/* Contact Seller Button */}
          <Button
            size="$5"
            backgroundColor="$primary"
            color="$textInverse"
            width="100%"
          >
            Contact Seller
          </Button>
        </Column>
      </Column>
    </ScrollView>
  );
}
