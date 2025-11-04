import { Column, Row, Text, Heading, Button, Container } from "@buttergolf/ui";
import { ProductCard } from "@buttergolf/app";
import { getRecentProducts } from "@/app/actions/products";
import Link from "next/link";

export async function RecentlyListedSection() {
  const products = await getRecentProducts(12);

  if (products.length === 0) {
    return (
      <Column backgroundColor="$background" paddingVertical="$8">
        <Container {...{ maxWidth: "lg" as any, padding: "md" as any }}>
          <Column gap="$lg" alignItems="center">
            <Heading level={2}>No Products Yet</Heading>
            <Text {...{ color: "secondary" as any }}>
              Be the first to list a product on ButterGolf!
            </Text>
            <Link href="/sell">
              <Button size="$5">List an Item</Button>
            </Link>
          </Column>
        </Container>
      </Column>
    );
  }

  return (
    <Column backgroundColor="$background" paddingVertical="$8">
      <Container {...{ maxWidth: "lg" as any, padding: "md" as any }}>
        <Column gap="$lg">
          <Row alignItems="center" justifyContent="space-between">
            <Column gap="$xs">
              <Heading level={2}>Recently Listed</Heading>
              <Text {...{ color: "secondary" as any }}>
                Fresh golf gear just added to the marketplace
              </Text>
            </Column>
            <Link href="/products">
              <Button size="$4">View All</Button>
            </Link>
          </Row>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "24px",
              width: "100%",
            }}
          >
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                style={{ textDecoration: "none" }}
              >
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
        </Column>
      </Container>
    </Column>
  );
}

