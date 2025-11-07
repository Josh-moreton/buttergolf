"use client";

import { useState } from "react";
import { Button, Card, Image, Text, Row, Column } from "@buttergolf/ui";
import type { ProductCardData } from "@buttergolf/app";
import { ProductDetailModal } from "./ProductDetailModal";

interface RecentlyListedSectionClientProps {
  readonly products: ProductCardData[];
}

function ListingCard({ product }: { readonly product: ProductCardData }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Card
        padding={0}
        borderRadius="$md"
        overflow="hidden"
        cursor="pointer"
        hoverStyle={{ scale: 1.01 }}
        onPress={() => setModalOpen(true)}
      >
        <Image
          source={{ uri: product.imageUrl }}
          width="100%"
          height={180}
          objectFit="cover"
          alt={product.title}
        />
        <Column padding="$md" gap="$xs">
          <Text weight="bold" numberOfLines={2}>
            {product.title}
          </Text>
          <Row alignItems="center" justifyContent="space-between">
            <Text fontSize="$7" weight="bold" fontWeight="800">
              £{product.price.toFixed(2)}
            </Text>
            <Text fontSize="$2" opacity={0.7}>
              {product.condition?.replace("_", " ") || ""}
            </Text>
          </Row>
          <Button size="$4" onPress={() => setModalOpen(true)}>
            View details
          </Button>
        </Column>
      </Card>

      {modalOpen && (
        <ProductDetailModal
          productId={product.id}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      )}
    </>
  );
}

export function RecentlyListedSectionClient({
  products,
}: RecentlyListedSectionClientProps) {
  return (
    <Column paddingVertical="$8" backgroundColor="$surface">
      <Column
        maxWidth={1280}
        marginHorizontal="auto"
        paddingHorizontal="$6"
        width="100%"
        gap="$6"
      >
        <Row alignItems="center" justifyContent="space-between">
          <Text fontSize="$9" weight="bold">
            Recently listed
          </Text>
          <Button size="$4">View all</Button>
        </Row>

        {/* Grid Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "24px",
            width: "100%",
          }}
        >
          {products.map((product) => (
            <ListingCard key={product.id} product={product} />
          ))}
        </div>
      </Column>
    </Column>
  );
}
