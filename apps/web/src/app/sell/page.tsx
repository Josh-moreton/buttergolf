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
  Autocomplete,
  type AutocompleteSuggestion,
} from "@buttergolf/ui";
import { ImageUpload } from "@/components/ImageUpload";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
}

interface Model {
  id: string | null;
  name: string;
  source?: string;
  isVerified?: boolean;
  usageCount?: number;
}

interface FormData {
  title: string;
  description: string;
  price: string;
  condition: string;
  brandId: string;
  brandName: string; // For display
  model: string;
  categoryId: string;
  images: string[];
  // Shipping dimensions
  length: string;
  width: string;
  height: string;
  weight: string;
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
    brandId: "",
    brandName: "",
    model: "",
    categoryId: "",
    images: [],
    // Shipping dimensions
    length: "",
    width: "",
    height: "",
    weight: "",
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
      !formData.categoryId ||
      !formData.brandId
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
          // Don't send brandName (display only)
          brandName: undefined,
          // Convert dimensions to numbers (or null if empty)
          length: formData.length ? Number.parseFloat(formData.length) : null,
          width: formData.width ? Number.parseFloat(formData.width) : null,
          height: formData.height ? Number.parseFloat(formData.height) : null,
          weight: formData.weight ? Number.parseFloat(formData.weight) : null,
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
                        padding: "12px 18px",
                        fontSize: "15px",
                        lineHeight: "22px",
                        borderRadius: "24px",
                        border: "1px solid #323232",
                        backgroundColor: "white",
                        width: "100%",
                        fontFamily: "inherit",
                        resize: "vertical",
                        outline: "none",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#F45314";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#323232";
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
                        padding: "12px 18px",
                        fontSize: "15px",
                        borderRadius: "24px",
                        border: "1px solid #323232",
                        backgroundColor: "white",
                        width: "100%",
                        cursor: "pointer",
                        outline: "none",
                        appearance: "none",
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23F45314' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundPosition: "right 18px center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "20px",
                        paddingRight: "48px",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#F45314";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#323232";
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
                      <FormLabel required>Brand</FormLabel>
                      <Autocomplete
                        value={formData.brandName}
                        onValueChange={(value) =>
                          setFormData({ ...formData, brandName: value })
                        }
                        onSelectSuggestion={(suggestion) => {
                          setFormData({
                            ...formData,
                            brandId: suggestion.id || "",
                            brandName: suggestion.name,
                            // Clear model when brand changes
                            model: "",
                          });
                        }}
                        fetchSuggestions={async (query) => {
                          const res = await fetch(
                            `/api/brands?query=${encodeURIComponent(query)}`
                          );
                          const brands: Brand[] = await res.json();
                          return brands.map((b) => ({
                            id: b.id,
                            name: b.name,
                            metadata: { slug: b.slug, logoUrl: b.logoUrl },
                          }));
                        }}
                        placeholder="Search brands (e.g., TaylorMade)"
                        size="md"
                        width="100%"
                        minChars={1}
                        allowCustom={false}
                      />
                      <HelperText>
                        Start typing to search golf brands
                      </HelperText>
                    </Column>

                    <Column gap="$xs" flex={1} minWidth={200}>
                      <FormLabel>Model</FormLabel>
                      <Autocomplete
                        value={formData.model}
                        onValueChange={(value) =>
                          setFormData({ ...formData, model: value })
                        }
                        onSelectSuggestion={(suggestion) => {
                          setFormData({
                            ...formData,
                            model: suggestion.name,
                          });
                        }}
                        fetchSuggestions={async (query) => {
                          if (!formData.brandId) return [];
                          const res = await fetch(
                            `/api/models?brandId=${formData.brandId}&query=${encodeURIComponent(query)}`
                          );
                          const models: Model[] = await res.json();
                          return models.map((m) => ({
                            id: m.id,
                            name: m.name,
                            metadata: {
                              isVerified: m.isVerified,
                              usageCount: m.usageCount,
                            },
                          }));
                        }}
                        placeholder={
                          formData.brandId
                            ? "e.g., Stealth 2"
                            : "Select a brand first"
                        }
                        size="md"
                        width="100%"
                        minChars={0}
                        allowCustom={true}
                        disabled={!formData.brandId}
                      />
                      <HelperText>
                        Type your model or select from suggestions
                      </HelperText>
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
                        padding: "12px 18px",
                        fontSize: "15px",
                        borderRadius: "24px",
                        border: "1px solid #323232",
                        backgroundColor: "white",
                        width: "100%",
                        cursor: "pointer",
                        outline: "none",
                        appearance: "none",
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23F45314' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundPosition: "right 18px center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "20px",
                        paddingRight: "48px",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#F45314";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#323232";
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

                  {/* Shipping Dimensions */}
                  <Column gap="$md" width="100%">
                    <Column gap="$xs" width="100%">
                      <FormLabel>Shipping Dimensions</FormLabel>
                      <Text size="xs" color="$textMuted">
                        Help us calculate accurate shipping costs. Leave blank to use default estimates.
                      </Text>
                    </Column>

                    {/* Dimensions Row */}
                    <Row gap="$sm" flexWrap="wrap">
                      <Column gap="$xs" flex={1} minWidth={120}>
                        <Text size="xs" color="$textSecondary">Length (cm)</Text>
                        <Input
                          value={formData.length}
                          onChangeText={(value) =>
                            setFormData({ ...formData, length: value })
                          }
                          placeholder="30"
                          size="md"
                          width="100%"
                          inputMode="decimal"
                        />
                      </Column>

                      <Column gap="$xs" flex={1} minWidth={120}>
                        <Text size="xs" color="$textSecondary">Width (cm)</Text>
                        <Input
                          value={formData.width}
                          onChangeText={(value) =>
                            setFormData({ ...formData, width: value })
                          }
                          placeholder="20"
                          size="md"
                          width="100%"
                          inputMode="decimal"
                        />
                      </Column>

                      <Column gap="$xs" flex={1} minWidth={120}>
                        <Text size="xs" color="$textSecondary">Height (cm)</Text>
                        <Input
                          value={formData.height}
                          onChangeText={(value) =>
                            setFormData({ ...formData, height: value })
                          }
                          placeholder="10"
                          size="md"
                          width="100%"
                          inputMode="decimal"
                        />
                      </Column>

                      <Column gap="$xs" flex={1} minWidth={120}>
                        <Text size="xs" color="$textSecondary">Weight (g)</Text>
                        <Input
                          value={formData.weight}
                          onChangeText={(value) =>
                            setFormData({ ...formData, weight: value })
                          }
                          placeholder="500"
                          size="md"
                          width="100%"
                          inputMode="decimal"
                        />
                      </Column>
                    </Row>

                    <Card
                      variant="filled"
                      padding="$sm"
                      backgroundColor="$infoLight"
                      borderRadius="$md"
                    >
                      <Row gap="$sm" alignItems="flex-start">
                        <Text fontSize={16}>📦</Text>
                        <Text size="xs" color="$text" lineHeight={16}>
                          Accurate dimensions help buyers understand shipping costs upfront and ensure proper packaging.
                        </Text>
                      </Row>
                    </Card>
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
