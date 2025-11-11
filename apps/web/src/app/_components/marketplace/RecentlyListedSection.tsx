import { useState } from "react";
import Link from "next/link";
import { Button, Card, Image, Text, Row, Column, Badge } from "@buttergolf/ui";
import type { ProductCardData } from "@buttergolf/app";
import { ProductDetailModal } from "./ProductDetailModal";
import { AnimatedAddToCartButton } from "../../../components/AnimatedAddToCartButton";
import { useCart } from "../../../context/CartContext";

interface RecentlyListedSectionClientProps {
  readonly products: ProductCardData[];
}

function ListingCard({ product }: { readonly product: ProductCardData }) {
  const [modalOpen, setModalOpen] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = async () => {
    await addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
    });
  };

  return (
    <>
      <Card
        variant="elevated"
        padding={0}
        animation="bouncy"
        backgroundColor="$surface"
        borderColor="$border"
        hoverStyle={{
          borderColor: "$borderHover",
          shadowColor: "$shadowColorHover",
          shadowRadius: 12,
        }}
        width="100%"
      >
        <div
          onClick={() => setModalOpen(true)}
          style={{ cursor: "pointer" }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setModalOpen(true);
            }
          }}
        >
          <Image
            source={{ uri: product.imageUrl }}
            width="100%"
            height={200}
            objectFit="cover"
            borderTopLeftRadius="$lg"
            borderTopRightRadius="$lg"
            alt={product.title}
          />
        </div>
        <Column padding="$md" gap="$md">
          <div
            onClick={() => setModalOpen(true)}
            style={{ cursor: "pointer" }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setModalOpen(true);
              }
            }}
          >
            <Column gap="$xs">
              <Text size="md" weight="semibold" numberOfLines={2}>
                {product.title}
              </Text>
              <Row gap="$sm" alignItems="center" justifyContent="space-between">
                <Text size="sm" color="$textSecondary">
                  {product.category}
                </Text>
                {product.condition && (
                  <Badge variant="neutral" size="sm">
                    <Text size="xs" weight="medium">
                      {product.condition.replace("_", " ")}
                    </Text>
                  </Badge>
                )}
              </Row>
              <Text size="lg" weight="bold" color="$primary">
                £{product.price.toFixed(2)}
              </Text>
            </Column>
          </div>
          <AnimatedAddToCartButton onAddToCart={handleAddToCart} />
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
          <Link href="/listings" passHref>
            <Button size="$4">View all</Button>
          </Link>
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
