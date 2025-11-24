"use client";

import { Row, Column, Text, Button, Image } from "@buttergolf/ui";
import type { ProductCardData } from "@buttergolf/app";
import { Popover } from "tamagui";
import { MoreHorizontal, ExternalLink, Trash2 } from "@tamagui/lucide-icons";

interface HorizontalProductCardProps {
  readonly product: ProductCardData & { description?: string };
  readonly onMakeOffer: (productId: string) => void;
  readonly onBuyNow: (productId: string) => void;
  readonly onRemove: (productId: string) => void;
  readonly onViewDetails: (productId: string) => void;
}

export function HorizontalProductCard({
  product,
  onMakeOffer,
  onBuyNow,
  onRemove,
  onViewDetails,
}: HorizontalProductCardProps) {
  const isSold = product.condition === null; // Simplified sold check

  return (
    <Row
      backgroundColor="$cloudMist"
      borderRadius="$lg"
      padding="$md"
      gap="$lg"
      alignItems="center"
      width="100%"
      shadowColor="rgba(0,0,0,0.08)"
      shadowOffset={{ width: 0, height: 2 }}
      shadowRadius={8}
      elevation={2}
      flexDirection="row"
      $sm={{
        flexDirection: "column",
        gap: "$md",
        alignItems: "stretch",
      }}
      hoverStyle={{
        shadowColor: "rgba(0,0,0,0.12)",
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
      }}
    >
      {/* Product Image - Left */}
      <Image
        source={{ uri: product.imageUrl }}
        alt={product.title}
        width={150}
        height={150}
        borderRadius="$md"
        style={{ objectFit: "cover" }}
        $sm={{
          width: "100%",
          height: 200,
          alignSelf: "center",
        }}
      />

      {/* Product Info - Center (Flex Grow) */}
      <Column flex={1} gap="$sm" minWidth={0}>
        {/* Title */}
        <Text size="$6" fontWeight="700" color="$text" numberOfLines={2}>
          {product.title}
        </Text>

        {/* Category */}
        <Text size="$4" color="$textSecondary">
          {typeof product.category === 'string' ? product.category : product.category?.name || 'Uncategorized'}
        </Text>

        {/* Price */}
        <Text size="$7" fontWeight="700" color="$primary">
          £{product.price.toFixed(2)}
        </Text>

        {/* Description */}
        {product.description && (
          <Text 
            size="$4" 
            color="$textSecondary" 
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {product.description}
          </Text>
        )}

        {/* Seller Info */}
        <Row gap="$xs" alignItems="center">
          <Text size="$3" color="$textSecondary">
            Sold by {product.seller.name}
          </Text>
          {product.seller.ratingCount > 0 && (
            <>
              <Text size="$3" color="$textSecondary">
                •
              </Text>
              <Row gap="$xs" alignItems="center">
                <Text color="$primary" fontSize={12}>
                  ★
                </Text>
                <Text size="$3" color="$textSecondary">
                  {product.seller.averageRating?.toFixed(1)} ({product.seller.ratingCount})
                </Text>
              </Row>
            </>
          )}
        </Row>
      </Column>

      {/* Action Buttons - Right */}
      <Row 
        gap="$sm" 
        flexShrink={0}
        flexDirection="row"
        flexWrap="wrap"
        $sm={{
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        {/* Buy Now Button */}
        <Button
          size="$4"
          backgroundColor="$primary"
          color="$textInverse"
          borderRadius="$full"
          paddingHorizontal="$4"
          paddingVertical="$2"
          disabled={isSold}
          onPress={() => onBuyNow(product.id)}
          minWidth={120}
          $sm={{
            flex: 1,
            minWidth: 0,
          }}
        >
          {isSold ? "Sold Out" : "Buy now"}
        </Button>

        {/* Make an Offer Button */}
        <Button
          size="$4"
          backgroundColor="$secondary"
          color="$textInverse"
          borderRadius="$full"
          paddingHorizontal="$4"
          paddingVertical="$2"
          disabled={isSold}
          onPress={() => onMakeOffer(product.id)}
          minWidth={120}
          $sm={{
            flex: 1,
            minWidth: 0,
          }}
        >
          Make an offer
        </Button>

        {/* More Actions Dropdown */}
        <Popover placement="bottom-end">
          <Popover.Trigger asChild>
            <Button
              size="$4"
              backgroundColor="$surface"
              color="$text"
              borderWidth={1}
              borderColor="$border"
              borderRadius="$full"
              width={48}
              height={48}
              padding={0}
              justifyContent="center"
              alignItems="center"
              icon={<MoreHorizontal size={20} />}
            />
          </Popover.Trigger>

          <Popover.Content
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$border"
            borderRadius="$md"
            padding="$xs"
            shadowColor="rgba(0,0,0,0.12)"
            shadowOffset={{ width: 0, height: 4 }}
            shadowRadius={12}
            elevation={4}
            enterStyle={{ opacity: 0, y: -10 }}
            exitStyle={{ opacity: 0, y: -10 }}
            animation="quick"
          >
            <Column gap="$xs" minWidth={180}>
              {/* View Details */}
              <Button
                size="$4"
                backgroundColor="transparent"
                color="$text"
                justifyContent="flex-start"
                paddingHorizontal="$3"
                paddingVertical="$2"
                borderRadius="$sm"
                icon={<ExternalLink size={16} />}
                onPress={() => onViewDetails(product.id)}
                hoverStyle={{
                  backgroundColor: "$backgroundHover",
                }}
              >
                View Details
              </Button>

              {/* Remove from Favourites */}
              <Button
                size="$4"
                backgroundColor="transparent"
                color="$error"
                justifyContent="flex-start"
                paddingHorizontal="$3"
                paddingVertical="$2"
                borderRadius="$sm"
                icon={<Trash2 size={16} />}
                onPress={() => onRemove(product.id)}
                hoverStyle={{
                  backgroundColor: "$errorLight",
                }}
              >
                Remove from Favourites
              </Button>
            </Column>
          </Popover.Content>
        </Popover>
      </Row>
    </Row>
  );
}
