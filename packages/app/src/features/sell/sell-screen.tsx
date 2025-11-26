"use client";

import React, { useState, useCallback } from "react";
import { Platform } from "react-native";
import {
  Column,
  Row,
  Text,
  Heading,
  Button,
  View,
  Spinner,
} from "@buttergolf/ui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, X } from "@tamagui/lucide-icons";
import { AnimatePresence } from "tamagui";

import type {
  SellFormData,
  SellStep,
  Category,
  Brand,
  Model,
  ImageData,
} from "./types";
import { SELL_STEPS } from "./types";
import { PhotoStep } from "./components/PhotoStep";
import { DetailsStep } from "./components/DetailsStep";
import { ListingStep } from "./components/ListingStep";
import { ReviewStep } from "./components/ReviewStep";
import { StepIndicator } from "./components/StepIndicator";

export interface SellScreenProps {
  /** Called when user is not authenticated - should redirect to sign-in */
  onRequireAuth?: () => void;
  /** Whether user is authenticated */
  isAuthenticated?: boolean;
  /** Called to fetch categories */
  onFetchCategories?: () => Promise<Category[]>;
  /** Called to search brands */
  onSearchBrands?: (query: string) => Promise<Brand[]>;
  /** Called to search models for a brand */
  onSearchModels?: (brandId: string, query: string) => Promise<Model[]>;
  /** Called to upload an image, returns the URL */
  onUploadImage?: (image: ImageData) => Promise<string>;
  /** Called to submit the listing */
  onSubmitListing?: (data: SellFormData) => Promise<{ id: string }>;
  /** Called when user wants to go back/cancel */
  onClose?: () => void;
  /** Called on successful submission */
  onSuccess?: (productId: string) => void;
}

const initialFormData: SellFormData = {
  images: [],
  categoryId: "",
  categoryName: "",
  brandId: "",
  brandName: "",
  modelId: "",
  modelName: "",
  condition: "GOOD",
  title: "",
  description: "",
  price: "",
};

export function SellScreen({
  onRequireAuth,
  isAuthenticated = false,
  onFetchCategories,
  onSearchBrands,
  onSearchModels,
  onUploadImage,
  onSubmitListing,
  onClose,
  onSuccess,
}: Readonly<SellScreenProps>) {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState<SellStep>(1);
  const [formData, setFormData] = useState<SellFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  // Check auth on mount
  React.useEffect(() => {
    if (!isAuthenticated && onRequireAuth) {
      onRequireAuth();
    }
  }, [isAuthenticated, onRequireAuth]);

  // Update form data helper
  const updateFormData = useCallback((updates: Partial<SellFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  // Navigation handlers
  const goToNextStep = useCallback(() => {
    if (currentStep < 4) {
      setDirection("forward");
      setCurrentStep((prev) => (prev + 1) as SellStep);
    }
  }, [currentStep]);

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setDirection("backward");
      setCurrentStep((prev) => (prev - 1) as SellStep);
    }
  }, [currentStep]);

  // Submit handler
  const handleSubmit = useCallback(async () => {
    if (!onSubmitListing) {
      setError("Submission not configured");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await onSubmitListing(formData);
      onSuccess?.(result.id);
    } catch (err) {
      console.error("Failed to submit listing:", err);
      setError(err instanceof Error ? err.message : "Failed to submit listing");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onSubmitListing, onSuccess]);

  // Validation for each step
  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 1:
        return formData.images.length > 0;
      case 2:
        return (
          formData.categoryId !== "" &&
          formData.brandId !== "" &&
          formData.condition !== undefined
        );
      case 3:
        return (
          formData.title.trim() !== "" &&
          formData.price !== "" &&
          parseFloat(formData.price) > 0
        );
      case 4:
        return true;
      default:
        return false;
    }
  }, [currentStep, formData]);

  // Show loading if checking auth
  if (!isAuthenticated) {
    return (
      <Column
        flex={1}
        backgroundColor="$background"
        alignItems="center"
        justifyContent="center"
        paddingTop={insets.top}
      >
        <Spinner size="lg" color="$primary" />
        <Text color="$textSecondary" marginTop="$3">
          Checking authentication...
        </Text>
      </Column>
    );
  }

  // SELL_STEPS always has 4 elements (steps 1-4), so this is safe
  const stepInfo = SELL_STEPS[currentStep - 1]!;

  return (
    <Column
      flex={1}
      backgroundColor="$background"
      paddingTop={insets.top}
      paddingBottom={insets.bottom}
    >
      {/* Header */}
      <Row
        paddingHorizontal="$4"
        paddingVertical="$3"
        alignItems="center"
        justifyContent="space-between"
        borderBottomWidth={1}
        borderBottomColor="$border"
      >
        <Button
          size="$3"
          chromeless
          onPress={currentStep === 1 ? onClose : goToPreviousStep}
          icon={currentStep === 1 ? <X size={24} /> : <ArrowLeft size={24} />}
          accessibilityLabel={currentStep === 1 ? "Close" : "Go back"}
        />

        <Column alignItems="center">
          <Heading level={3} fontSize={18} fontWeight="600" color="$text">
            {stepInfo.title}
          </Heading>
          <Text fontSize={12} color="$textSecondary">
            Step {currentStep} of 4
          </Text>
        </Column>

        <View width={40} />
      </Row>

      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} totalSteps={4} />

      {/* Error Banner */}
      {error && (
        <Row
          backgroundColor="$error"
          paddingHorizontal="$4"
          paddingVertical="$2"
        >
          <Text color="white" fontSize={14}>
            {error}
          </Text>
        </Row>
      )}

      {/* Step Content */}
      <Column flex={1}>
        <AnimatePresence exitBeforeEnter>
          {currentStep === 1 && (
            <PhotoStep
              key="photo"
              images={formData.images}
              onImagesChange={(images) => updateFormData({ images })}
              onUploadImage={onUploadImage}
              direction={direction}
            />
          )}
          {currentStep === 2 && (
            <DetailsStep
              key="details"
              formData={formData}
              onUpdate={updateFormData}
              onFetchCategories={onFetchCategories}
              onSearchBrands={onSearchBrands}
              onSearchModels={onSearchModels}
              direction={direction}
            />
          )}
          {currentStep === 3 && (
            <ListingStep
              key="listing"
              formData={formData}
              onUpdate={updateFormData}
              direction={direction}
            />
          )}
          {currentStep === 4 && (
            <ReviewStep
              key="review"
              formData={formData}
              onEdit={(step) => {
                setDirection("backward");
                setCurrentStep(step);
              }}
              direction={direction}
            />
          )}
        </AnimatePresence>
      </Column>

      {/* Bottom Navigation */}
      <Row
        paddingHorizontal="$4"
        paddingVertical="$3"
        gap="$3"
        borderTopWidth={1}
        borderTopColor="$border"
        backgroundColor="$background"
      >
        {currentStep < 4 ? (
          <Button
            flex={1}
            size="$5"
            backgroundColor={canProceed() ? "$primary" : "$cloudMist"}
            color={canProceed() ? "$textInverse" : "$textSecondary"}
            borderRadius="$full"
            fontWeight="600"
            onPress={goToNextStep}
            disabled={!canProceed()}
          >
            Continue
          </Button>
        ) : (
          <Button
            flex={1}
            size="$5"
            backgroundColor={isSubmitting ? "$cloudMist" : "$primary"}
            color="$textInverse"
            borderRadius="$full"
            fontWeight="600"
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Listing"}
          </Button>
        )}
      </Row>
    </Column>
  );
}
