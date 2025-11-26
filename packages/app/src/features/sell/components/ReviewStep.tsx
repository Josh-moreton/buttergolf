"use client";

import React from "react";
import { TouchableOpacity } from "react-native";
import {
  Column,
  Row,
  Text,
  Heading,
  View,
  Image,
  ScrollView,
} from "@buttergolf/ui";
import { Pencil } from "@tamagui/lucide-icons";

import type { SellFormData, SellStep } from "../types";
import { CONDITION_OPTIONS } from "../types";

interface ReviewStepProps {
  formData: SellFormData;
  onEdit: (step: SellStep) => void;
  direction: "forward" | "backward";
}

interface ReviewSectionProps {
  title: string;
  step: SellStep;
  onEdit: (step: SellStep) => void;
  children: React.ReactNode;
}

function ReviewSection({ title, step, onEdit, children }: Readonly<ReviewSectionProps>) {
  return (
    <Column
      backgroundColor="$surface"
      borderRadius="$lg"
      borderWidth={1}
      borderColor="$border"
      overflow="hidden"
    >
      <Row
        paddingHorizontal="$3"
        paddingVertical="$2"
        alignItems="center"
        justifyContent="space-between"
        backgroundColor="$cloudMist"
        borderBottomWidth={1}
        borderBottomColor="$border"
      >
        <Text fontSize={14} fontWeight="600" color="$text">
          {title}
        </Text>
        <TouchableOpacity
          onPress={() => onEdit(step)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel={`Edit ${title.toLowerCase()}`}
        >
          <Row alignItems="center" gap="$1">
            <Pencil size={14} color="$primary" />
            <Text fontSize={13} color="$primary" fontWeight="500">
              Edit
            </Text>
          </Row>
        </TouchableOpacity>
      </Row>
      <Column padding="$3">{children}</Column>
    </Column>
  );
}

export function ReviewStep({
  formData,
  onEdit,
  direction,
}: Readonly<ReviewStepProps>) {
  const conditionLabel =
    CONDITION_OPTIONS.find((c) => c.value === formData.condition)?.label || "";

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    if (isNaN(num)) return "£0.00";
    return `£${num.toFixed(2)}`;
  };

  return (
    <Column
      flex={1}
      animation="quick"
      enterStyle={{
        opacity: 0,
        x: direction === "forward" ? 50 : -50,
      }}
      exitStyle={{
        opacity: 0,
        x: direction === "forward" ? -50 : 50,
      }}
    >
      <ScrollView
        flex={1}
        contentContainerStyle={{
          padding: 16,
        }}
      >
        {/* Instructions */}
        <Column gap="$2" marginBottom="$4">
          <Heading level={4} fontSize={16} color="$text" fontWeight="600">
            Review your listing
          </Heading>
          <Text fontSize={14} color="$textSecondary">
            Make sure everything looks good before submitting
          </Text>
        </Column>

        <Column gap="$3">
          {/* Photos Section */}
          <ReviewSection title="Photos" step={1} onEdit={onEdit}>
            <Row gap="$2" flexWrap="wrap">
              {formData.images.map((image, index) => (
                <View
                  key={`review-image-${index}`}
                  width={70}
                  height={70}
                  borderRadius="$md"
                  overflow="hidden"
                  borderWidth={index === 0 ? 2 : 0}
                  borderColor={index === 0 ? "$primary" : "transparent"}
                >
                  <Image
                    source={{ uri: image.uri }}
                    width="100%"
                    height="100%"
                    objectFit="cover"
                  />
                </View>
              ))}
            </Row>
            <Text fontSize={12} color="$textSecondary" marginTop="$2">
              {formData.images.length} photo{formData.images.length !== 1 ? "s" : ""} added
            </Text>
          </ReviewSection>

          {/* Details Section */}
          <ReviewSection title="Item Details" step={2} onEdit={onEdit}>
            <Column gap="$2">
              <Row justifyContent="space-between">
                <Text fontSize={14} color="$textSecondary">
                  Category
                </Text>
                <Text fontSize={14} color="$text" fontWeight="500">
                  {formData.categoryName || "Not set"}
                </Text>
              </Row>
              <Row justifyContent="space-between">
                <Text fontSize={14} color="$textSecondary">
                  Brand
                </Text>
                <Text fontSize={14} color="$text" fontWeight="500">
                  {formData.brandName || "Not set"}
                </Text>
              </Row>
              <Row justifyContent="space-between">
                <Text fontSize={14} color="$textSecondary">
                  Model
                </Text>
                <Text fontSize={14} color="$text" fontWeight="500">
                  {formData.modelName || "Not set"}
                </Text>
              </Row>
              <Row justifyContent="space-between">
                <Text fontSize={14} color="$textSecondary">
                  Condition
                </Text>
                <Text fontSize={14} color="$text" fontWeight="500">
                  {conditionLabel}
                </Text>
              </Row>
            </Column>
          </ReviewSection>

          {/* Listing Info Section */}
          <ReviewSection title="Listing Info" step={3} onEdit={onEdit}>
            <Column gap="$3">
              <Column gap="$1">
                <Text fontSize={12} color="$textSecondary">
                  Title
                </Text>
                <Text fontSize={15} color="$text" fontWeight="500">
                  {formData.title || "No title"}
                </Text>
              </Column>

              {formData.description && (
                <Column gap="$1">
                  <Text fontSize={12} color="$textSecondary">
                    Description
                  </Text>
                  <Text fontSize={14} color="$text" numberOfLines={3}>
                    {formData.description}
                  </Text>
                </Column>
              )}

              <Column gap="$1">
                <Text fontSize={12} color="$textSecondary">
                  Price
                </Text>
                <Text fontSize={20} color="$primary" fontWeight="700">
                  {formatPrice(formData.price)}
                </Text>
              </Column>
            </Column>
          </ReviewSection>

          {/* Terms Notice */}
          <Column
            backgroundColor="$lemonHaze"
            borderRadius="$lg"
            padding="$3"
            marginTop="$2"
          >
            <Text fontSize={13} color="$secondary" lineHeight={20}>
              By submitting this listing, you confirm that you have the right to
              sell this item and agree to our terms of service.
            </Text>
          </Column>
        </Column>
      </ScrollView>
    </Column>
  );
}
