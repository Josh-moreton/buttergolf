import Link from "next/link";
import { Button, Card, Image, Text, Row, Column, Badge } from "@buttergolf/ui";
import type { ProductCardData } from "@buttergolf/app";
import { AnimatedAddToCartButton } from "../../../components/AnimatedAddToCartButton";
import { useCart } from "../../../context/CartContext";

interface RecentlyListedSectionClientProps {
  readonly products: ProductCardData[];
}

function ListingCard({ product }: { readonly product: ProductCardData }) {
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
      minHeight={440}
      display="flex"
      flexDirection="column"
    >
      <div style={{ position: "relative" }}>
        <Link href={`/products/${product.id}`} style={{ textDecoration: "none" }}>
          {/* 1:1 Aspect Ratio Container */}
          <div style={{ position: "relative", paddingBottom: "100%", overflow: "hidden", width: "100%" }}>
            <Image
              source={{ uri: product.imageUrl }}
              width="100%"
              height="100%"
              objectFit="cover"
              borderTopLeftRadius="$lg"
              borderTopRightRadius="$lg"
              alt={product.title}
              position="absolute"
              top={0}
              left={0}
            />
          </div>
        </Link>

        {/* NEW Badge Overlay */}
        {product.condition === "NEW" && (
          <Badge
            variant="success"
            size="sm"
            {...{ style: { position: "absolute", top: 8, right: 8, zIndex: 10 } }}
          >
            <Text>NEW</Text>
          </Badge>
        )}
      </div>

      <Column padding="$md" gap="$md" flex={1} justifyContent="space-between">
        <Link href={`/products/${product.id}`} style={{ textDecoration: "none" }}>
          <Column gap="$xs">
            <Text size="md" weight="semibold" numberOfLines={2} minHeight={42}>
              {product.title}
            </Text>
            <Row gap="$sm" alignItems="center" justifyContent="space-between" minHeight={24}>
              <Text size="sm" color="$textSecondary" numberOfLines={1}>
                {product.category}
              </Text>
              {product.condition && product.condition !== "NEW" && (
                <Badge variant="neutral" size="sm">
                  <Text size="xs" weight="medium">
                    {product.condition.replace("_", " ")}
                  </Text>
                </Badge>
              )}
            </Row>
            <Text size="lg" weight="bold" color="$primary" minHeight={28}>
              £{product.price.toFixed(2)}
            </Text>
          </Column>
        </Link>
        <AnimatedAddToCartButton onAddToCart={handleAddToCart} />
      </Column>
    </Card>
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
            <Button size="md" tone="outline">View all</Button>
          </Link>
        </Row>

        {/* Grid Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gridAutoRows: "1fr",
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
