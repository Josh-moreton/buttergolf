"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
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

interface Product {
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

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (!params.id) return;

    fetch(`/api/products/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <Container {...{ maxWidth: "lg" as any, padding: "md" as any }}>
        <Column gap="$xl" paddingVertical="$10" alignItems="center">
          <Spinner size="lg" {...{ color: "$primary" as any }} />
          <Text {...{ color: "$textSecondary" as any }}>
            Loading product...
          </Text>
        </Column>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container {...{ maxWidth: "lg" as any, padding: "md" as any }}>
        <Column gap="$lg" paddingVertical="$10" alignItems="center">
          <Heading level={2}>Product Not Found</Heading>
          <Text {...{ color: "$textSecondary" as any }}>
            {error || "This product does not exist or has been removed."}
          </Text>
          <Button size="$5" onPress={() => router.push("/")}>
            Back to Home
          </Button>
        </Column>
      </Container>
    );
  }

  const selectedImage = product.images[selectedImageIndex];

  return (
    <Container {...{ maxWidth: "lg" as any, padding: "md" as any }}>
      <Column gap="$xl" paddingVertical="$10">
        {/* Breadcrumb */}
        <Row gap="$sm" alignItems="center" flexWrap="wrap">
          <Link href="/" style={{ textDecoration: "none" }}>
            <Text
              {...{ color: "$textSecondary" as any }}
              hoverStyle={{ color: "$primary" }}
            >
              Home
            </Text>
          </Link>
          <Text {...{ color: "$textMuted" as any }}>/</Text>
          <Link
            href={`/category/${product.category.slug}`}
            style={{ textDecoration: "none" }}
          >
            <Text
              {...{ color: "$textSecondary" as any }}
              hoverStyle={{ color: "$primary" }}
            >
              {product.category.name}
            </Text>
          </Link>
          <Text {...{ color: "$textMuted" as any }}>/</Text>
          <Text {...{ color: "$text" as any }}>{product.title}</Text>
        </Row>

        {/* Main Content */}
        <Row gap="$xl" flexDirection="column" $lg={{ flexDirection: "row" }}>
          {/* Images */}
          <Column gap="$md" flex={1}>
            {/* Main Image */}
            <Card variant="outlined" {...{ padding: "$0" as any }}>
              <Image
                source={{ uri: selectedImage.url }}
                width="100%"
                height={500}
                objectFit="cover"
                borderRadius="$lg"
              />
            </Card>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <Row gap="$sm" flexWrap="wrap">
                {product.images.map((img, index) => (
                  <Card
                    key={img.id}
                    variant="outlined"
                    {...{ padding: "$0" as any }}
                    cursor="pointer"
                    onPress={() => setSelectedImageIndex(index)}
                    {...(index === selectedImageIndex && {
                      borderColor: "$primary" as any,
                      borderWidth: 2,
                    })}
                  >
                    <Image
                      source={{ uri: img.url }}
                      width={80}
                      height={80}
                      objectFit="cover"
                      borderRadius="$md"
                    />
                  </Card>
                ))}
              </Row>
            )}
          </Column>

          {/* Product Info */}
          <Column gap="$lg" flex={1}>
            <Column gap="$md">
              <Row gap="$sm" alignItems="center">
                <Badge variant={product.isSold ? "neutral" : "success"}>
                  {product.isSold ? "Sold" : "Available"}
                </Badge>
                <Badge variant="info">
                  {product.condition.replace("_", " ")}
                </Badge>
              </Row>

              <Heading level={1}>{product.title}</Heading>

              <Heading level={2} {...{ color: "$primary" as any }}>
                £{product.price.toFixed(2)}
              </Heading>

              {(product.brand || product.model) && (
                <Row gap="$md">
                  {product.brand && (
                    <Column gap="$xs">
                      <Text size="xs" {...{ color: "$textMuted" as any }}>
                        Brand
                      </Text>
                      <Text weight="semibold">{product.brand}</Text>
                    </Column>
                  )}
                  {product.model && (
                    <Column gap="$xs">
                      <Text size="xs" {...{ color: "$textMuted" as any }}>
                        Model
                      </Text>
                      <Text weight="semibold">{product.model}</Text>
                    </Column>
                  )}
                </Row>
              )}
            </Column>

            <Card variant="filled" {...{ padding: "$lg" as any }}>
              <Column gap="$md">
                <Heading level={4}>Description</Heading>
                <Text
                  {...{ color: "$textSecondary" as any }}
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {product.description}
                </Text>
              </Column>
            </Card>

            <Column gap="$md">
              <Button size="$5" width="100%" disabled={product.isSold}>
                {product.isSold ? "Sold Out" : "Contact Seller"}
              </Button>
              <Button size="$5" width="100%">
                Add to Wishlist
              </Button>
            </Column>

            <Card variant="outlined" {...{ padding: "$md" as any }}>
              <Row gap="$md" alignItems="center">
                {product.user.imageUrl && (
                  <Image
                    source={{ uri: product.user.imageUrl }}
                    width={48}
                    height={48}
                    borderRadius="$full"
                  />
                )}
                <Column gap="$xs">
                  <Text weight="semibold">
                    {product.user.name || "Anonymous"}
                  </Text>
                  <Text size="xs" {...{ color: "$textMuted" as any }}>
                    Listed {new Date(product.createdAt).toLocaleDateString()}
                  </Text>
                </Column>
              </Row>
            </Card>
          </Column>
        </Row>
      </Column>
    </Container>
  );
}
