"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  Column,
  Row,
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

// Label component for form fields
const FormLabel = ({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) => (
  <Row gap="$xs" marginBottom="$xs">
    <Text size="sm" weight="medium" color="$text">
      {children}
    </Text>
    {required && <Text color="$error">*</Text>}
  </Row>
);

// Helper text component
const HelperText = ({ children }: { children: React.ReactNode }) => (
  <Text size="xs" color="$textMuted" marginTop="$xs">
    {children}
  </Text>
);

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
    <Column
      backgroundColor="$background"
      minHeight="100vh"
      alignItems="center"
      width="100%"
    >
      <Column
        maxWidth={1100}
        paddingHorizontal="$8"
        width="100%"
        alignSelf="center"
        marginHorizontal="auto"
      >
        <Column
          gap="$xl"
          paddingVertical="$10"
          width="100%"
          alignItems="stretch"
        >
          {/* Header */}
          <Column gap="$sm" alignItems="center">
            <Heading level={2}>Sell an item</Heading>
          </Column>

          {/* Main Form Card */}
          <Card
            variant="elevated"
            padding="$0"
            backgroundColor="$surface"
            borderRadius="$lg"
            overflow="hidden"
            width="100%"
          >
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <Column gap="$0" width="100%" alignItems="stretch">
                {/* Photo Upload Section - Prominent at top */}
                <Column
                  gap="$md"
                  padding="$6"
                  backgroundColor="$background"
                  borderBottomWidth={1}
                  borderBottomColor="$border"
                  width="100%"
                >
                  <ImageUpload
                    onUploadComplete={handleImageUpload}
                    currentImages={formData.images}
                    maxImages={5}
                  />
                  <Card
                    variant="filled"
                    padding="$sm"
                    backgroundColor="$infoLight"
                    borderRadius="$md"
                  >
                    <Row gap="$sm" alignItems="flex-start">
                      <Text fontSize={18}>📸</Text>
                      <Text size="xs" color="$text" lineHeight={18}>
                        Catch your buyers&apos; eye — use quality photos. Good
                        lighting and clear images help your item sell faster!
                      </Text>
                    </Row>
                  </Card>
                </Column>

                {/* Form Fields Section */}
                <Column gap="$md" padding="$6" width="100%">
                  {/* Title */}
                  <Column gap="$xs" width="100%">
                    <FormLabel required>Title</FormLabel>
                    <Input
                      value={formData.title}
                      onChangeText={(value) =>
                        setFormData({ ...formData, title: value })
                      }
                      placeholder="e.g. Titleist a 2023 Driver"
                      size="md"
                      width="100%"
                      required
                    />
                    <HelperText>
                      Include brand, model, and key details
                    </HelperText>
                  </Column>

                  {/* Description */}
                  <Column gap="$xs" width="100%">
                    <FormLabel required>Describe your item</FormLabel>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="e.g. only used for one season, minor scratches on the shaft..."
                      required
                      rows={3}
                      style={{
                        padding: "12px 14px",
                        fontSize: "15px",
                        lineHeight: "22px",
                        borderRadius: "8px",
                        border: "1px solid #d1d5db",
                        backgroundColor: "white",
                        width: "100%",
                        fontFamily: "inherit",
                        resize: "vertical",
                        outline: "none",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#E25F2F"; // Pure Butter orange
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#d1d5db";
                      }}
                    />
                    <HelperText>
                      Be honest and detailed. Mention any wear, included
                      accessories, and why you&apos;re selling.
                    </HelperText>
                  </Column>

                  {/* Category */}
                  <Column gap="$xs" width="100%">
                    <FormLabel required>Category</FormLabel>
                    <select
                      value={formData.categoryId}
                      onChange={(e) =>
                        setFormData({ ...formData, categoryId: e.target.value })
                      }
                      required
                      style={{
                        padding: "12px 14px",
                        fontSize: "15px",
                        borderRadius: "8px",
                        border: "1px solid #d1d5db",
                        backgroundColor: "white",
                        width: "100%",
                        cursor: "pointer",
                        outline: "none",
                        appearance: "none",
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundPosition: "right 12px center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "20px",
                        paddingRight: "40px",
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

                  {/* Brand & Model Row */}
                  <Row gap="$md" flexWrap="wrap">
                    <Column gap="$xs" flex={1} minWidth={200}>
                      <FormLabel>Brand</FormLabel>
                      <Input
                        value={formData.brand}
                        onChangeText={(value) =>
                          setFormData({ ...formData, brand: value })
                        }
                        placeholder="e.g., TaylorMade"
                        size="md"
                        width="100%"
                      />
                    </Column>

                    <Column gap="$xs" flex={1} minWidth={200}>
                      <FormLabel>Model</FormLabel>
                      <Input
                        value={formData.model}
                        onChangeText={(value) =>
                          setFormData({ ...formData, model: value })
                        }
                        placeholder="e.g., Stealth 2"
                        size="md"
                        width="100%"
                      />
                    </Column>
                  </Row>

                  {/* Condition */}
                  <Column gap="$xs" width="100%">
                    <FormLabel required>Condition</FormLabel>
                    <select
                      value={formData.condition}
                      onChange={(e) =>
                        setFormData({ ...formData, condition: e.target.value })
                      }
                      required
                      style={{
                        padding: "12px 14px",
                        fontSize: "15px",
                        borderRadius: "8px",
                        border: "1px solid #d1d5db",
                        backgroundColor: "white",
                        width: "100%",
                        cursor: "pointer",
                        outline: "none",
                        appearance: "none",
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundPosition: "right 12px center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "20px",
                        paddingRight: "40px",
                      }}
                    >
                      {CONDITIONS.map((cond) => (
                        <option key={cond.value} value={cond.value}>
                          {cond.label}
                        </option>
                      ))}
                    </select>
                  </Column>

                  {/* Price */}
                  <Column gap="$xs" width="100%">
                    <FormLabel required>Price</FormLabel>
                    <Row gap="$sm" alignItems="center">
                      <Text size="lg" weight="semibold">
                        £
                      </Text>
                      <Input
                        value={formData.price}
                        onChangeText={(value) =>
                          setFormData({ ...formData, price: value })
                        }
                        placeholder="0.00"
                        size="md"
                        width="100%"
                        required
                        inputMode="decimal"
                      />
                    </Row>
                    <HelperText>Enter your asking price in GBP</HelperText>
                  </Column>

                  {/* Error Message */}
                  {error && (
                    <Card
                      variant="filled"
                      padding="$md"
                      backgroundColor="$errorLight"
                      borderRadius="$md"
                    >
                      <Text color="$error">{error}</Text>
                    </Card>
                  )}
                </Column>

                {/* Action Buttons - Sticky footer style */}
                <Column
                  gap="$sm"
                  padding="$5"
                  backgroundColor="$background"
                  borderTopWidth={1}
                  borderTopColor="$border"
                  width="100%"
                >
                  <Row gap="$sm" justifyContent="space-between" width="100%">
                    <Button
                      chromeless
                      size="$5"
                      onPress={() => router.push("/")}
                      disabled={loading}
                      flex={1}
                    >
                      Save draft
                    </Button>
                    <Button
                      backgroundColor="$primary"
                      color="$white"
                      size="$5"
                      disabled={loading}
                      onPress={() => handleSubmit({} as React.FormEvent)}
                      flex={1}
                      hoverStyle={{ backgroundColor: "$primaryHover" }}
                      pressStyle={{ backgroundColor: "$primaryPress" }}
                    >
                      {loading ? "Uploading..." : "Upload"}
                    </Button>
                  </Row>
                  <Text size="xs" color="$textMuted" textAlign="center">
                    What do you think of our upload process?{" "}
                    <Text size="xs" color="$primary" cursor="pointer">
                      Give feedback
                    </Text>
                  </Text>
                </Column>
              </Column>
            </form>
          </Card>
        </Column>
      </Column>
    </Column>
  );
}
