"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  Column,
  Row,
  Container,
  Heading,
  Text,
  Button,
  Input,
  Card,
} from "@buttergolf/ui";
import { ImageUpload } from "@/components/ImageUpload";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface FormData {
  title: string;
  description: string;
  price: string;
  condition: string;
  brand: string;
  model: string;
  categoryId: string;
  images: string[];
}

const CONDITIONS = [
  { value: "NEW", label: "Brand New" },
  { value: "LIKE_NEW", label: "Like New" },
  { value: "EXCELLENT", label: "Excellent" },
  { value: "GOOD", label: "Good" },
  { value: "FAIR", label: "Fair" },
  { value: "POOR", label: "Poor" },
];

export default function SellPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    price: "",
    condition: "GOOD",
    brand: "",
    model: "",
    categoryId: "",
    images: [],
  });

  // Load categories on mount
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Failed to load categories:", err));
  }, []);

  // Redirect if not signed in
  if (isLoaded && !isSignedIn) {
    router.push("/sign-in?redirect=/sell");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate required fields
    if (
      !formData.title ||
      !formData.description ||
      !formData.price ||
      !formData.categoryId
    ) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (formData.images.length === 0) {
      setError("Please upload at least one image");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: Number.parseFloat(formData.price),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create listing");
      }

      const product = await response.json();
      router.push(`/products/${product.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create listing");
      setLoading(false);
    }
  };

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, url],
    }));
  };

  return (
    <Container {...{ maxWidth: "lg" as any, padding: "md" as any }}>
      <Column gap="$xl" paddingVertical="$10">
        {/* Header */}
        <Column gap="$md" align="center">
          <Heading level={1}>Sell Your Golf Equipment</Heading>
          <Text
            {...{ color: "$textSecondary" as any }}
            textAlign="center"
            maxWidth={600}
          >
            List your pre-owned golf clubs, bags, and accessories. Reach
            thousands of golfers looking for great deals.
          </Text>
        </Column>

        {/* Form */}
        <Card variant="elevated" {...{ padding: "$lg" as any }}>
          <form onSubmit={handleSubmit}>
            <Column gap="$lg">
              {/* Title */}
              <Column gap="$xs">
                <Row gap="$xs">
                  <Text weight="semibold">Title</Text>
                  <Text {...{ color: "$error" as any }}>*</Text>
                </Row>
                <Input
                  value={formData.title}
                  onChangeText={(value) =>
                    setFormData({ ...formData, title: value })
                  }
                  placeholder="e.g., TaylorMade Stealth 2 Driver"
                  size="lg"
                  fullWidth
                  required
                />
                <Text size="xs" {...{ color: "$textMuted" as any }}>
                  Include brand, model, and key details
                </Text>
              </Column>

              {/* Category */}
              <Column gap="$xs">
                <Row gap="$xs">
                  <Text weight="semibold">Category</Text>
                  <Text {...{ color: "$error" as any }}>*</Text>
                </Row>
                <select
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value })
                  }
                  required
                  style={{
                    padding: "12px 16px",
                    fontSize: "16px",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    backgroundColor: "white",
                    width: "100%",
                  }}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </Column>

              {/* Brand & Model */}
              <Row gap="$md" flexWrap="wrap">
                <Column gap="$xs" flex={1} minWidth={200}>
                  <Text weight="semibold">Brand</Text>
                  <Input
                    value={formData.brand}
                    onChangeText={(value) =>
                      setFormData({ ...formData, brand: value })
                    }
                    placeholder="e.g., TaylorMade"
                    size="lg"
                    fullWidth
                  />
                </Column>

                <Column gap="$xs" flex={1} minWidth={200}>
                  <Text weight="semibold">Model</Text>
                  <Input
                    value={formData.model}
                    onChangeText={(value) =>
                      setFormData({ ...formData, model: value })
                    }
                    placeholder="e.g., Stealth 2"
                    size="lg"
                    fullWidth
                  />
                </Column>
              </Row>

              {/* Condition */}
              <Column gap="$xs">
                <Row gap="$xs">
                  <Text weight="semibold">Condition</Text>
                  <Text {...{ color: "$error" as any }}>*</Text>
                </Row>
                <select
                  value={formData.condition}
                  onChange={(e) =>
                    setFormData({ ...formData, condition: e.target.value })
                  }
                  required
                  style={{
                    padding: "12px 16px",
                    fontSize: "16px",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    backgroundColor: "white",
                    width: "100%",
                  }}
                >
                  {CONDITIONS.map((cond) => (
                    <option key={cond.value} value={cond.value}>
                      {cond.label}
                    </option>
                  ))}
                </select>
              </Column>

              {/* Description */}
              <Column gap="$xs">
                <Row gap="$xs">
                  <Text weight="semibold">Description</Text>
                  <Text {...{ color: "$error" as any }}>*</Text>
                </Row>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe the item's condition, history, and any included accessories..."
                  required
                  rows={6}
                  style={{
                    padding: "12px 16px",
                    fontSize: "16px",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    backgroundColor: "white",
                    width: "100%",
                    fontFamily: "inherit",
                    resize: "vertical",
                  }}
                />
                <Text size="xs" {...{ color: "$textMuted" as any }}>
                  Be honest and detailed. Mention any wear, included
                  accessories, and why you're selling.
                </Text>
              </Column>

              {/* Price */}
              <Column gap="$xs">
                <Row gap="$xs">
                  <Text weight="semibold">Price (£)</Text>
                  <Text {...{ color: "$error" as any }}>*</Text>
                </Row>
                <Input
                  value={formData.price}
                  onChangeText={(value) =>
                    setFormData({ ...formData, price: value })
                  }
                  placeholder="0.00"
                  size="lg"
                  fullWidth
                  required
                  inputMode="decimal"
                />
                <Text size="xs" {...{ color: "$textMuted" as any }}>
                  Enter your asking price in GBP
                </Text>
              </Column>

              {/* Images */}
              <Column gap="$xs">
                <Row gap="$xs">
                  <Text weight="semibold">Photos</Text>
                  <Text {...{ color: "$error" as any }}>*</Text>
                </Row>
                <ImageUpload
                  onUploadComplete={handleImageUpload}
                  currentImages={formData.images}
                  maxImages={5}
                />
              </Column>

              {/* Error Message */}
              {error && (
                <Card
                  variant="outlined"
                  {...{
                    padding: "$md" as any,
                    backgroundColor: "$errorLight" as any,
                  }}
                >
                  <Text {...{ color: "$error" as any }}>{error}</Text>
                </Card>
              )}

              {/* Submit Button */}
              <Row gap="$md" paddingTop="$md" justifyContent="flex-end">
                <Button
                  tone="outline"
                  size="lg"
                  onPress={() => router.push("/")}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  tone="primary"
                  size="lg"
                  disabled={loading}
                  onPress={handleSubmit}
                >
                  {loading ? "Creating Listing..." : "Create Listing"}
                </Button>
              </Row>
            </Column>
          </form>
        </Card>
      </Column>
    </Container>
  );
}
