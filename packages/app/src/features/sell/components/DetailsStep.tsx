"use client";

import React, { useState, useEffect, useCallback } from "react";
import { TouchableOpacity, Keyboard } from "react-native";
import {
  Column,
  Row,
  Text,
  View,
  Input,
  ScrollView,
  Spinner,
} from "@buttergolf/ui";
import {
  ChevronDown,
  Check,
  Search,
  X,
  Tag,
  Award,
  Layers,
  Star,
} from "@tamagui/lucide-icons";

import type {
  SellFormData,
  Category,
  Brand,
  Model,
  ProductCondition,
} from "../types";
import { CONDITION_OPTIONS } from "../types";

interface DetailsStepProps {
  formData: SellFormData;
  onUpdate: (updates: Partial<SellFormData>) => void;
  onFetchCategories?: () => Promise<Category[]>;
  onSearchBrands?: (query: string) => Promise<Brand[]>;
  onSearchModels?: (brandId: string, query: string) => Promise<Model[]>;
  direction: "forward" | "backward";
}

type ActivePicker = "category" | "brand" | "model" | "condition" | null;

export function DetailsStep({
  formData,
  onUpdate,
  onFetchCategories,
  onSearchBrands,
  onSearchModels,
  direction,
}: Readonly<DetailsStepProps>) {
  const [activePicker, setActivePicker] = useState<ActivePicker>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    if (onFetchCategories) {
      setIsLoading(true);
      onFetchCategories()
        .then(setCategories)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [onFetchCategories]);

  // Search brands when query changes
  useEffect(() => {
    if (activePicker === "brand" && searchQuery && onSearchBrands) {
      const timeoutId = setTimeout(() => {
        setIsLoading(true);
        onSearchBrands(searchQuery)
          .then(setBrands)
          .catch(console.error)
          .finally(() => setIsLoading(false));
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [activePicker, searchQuery, onSearchBrands]);

  // Search models when brand is selected and query changes
  useEffect(() => {
    if (activePicker === "model" && formData.brandId && onSearchModels) {
      const timeoutId = setTimeout(() => {
        setIsLoading(true);
        onSearchModels(formData.brandId, searchQuery)
          .then(setModels)
          .catch(console.error)
          .finally(() => setIsLoading(false));
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [activePicker, formData.brandId, searchQuery, onSearchModels]);

  const openPicker = useCallback((picker: ActivePicker) => {
    Keyboard.dismiss();
    setSearchQuery("");
    setActivePicker(picker);
  }, []);

  const closePicker = useCallback(() => {
    setActivePicker(null);
    setSearchQuery("");
  }, []);

  const selectCategory = useCallback(
    (category: Category) => {
      onUpdate({
        categoryId: category.id,
        categoryName: category.name,
      });
      closePicker();
    },
    [onUpdate, closePicker],
  );

  const selectBrand = useCallback(
    (brand: Brand) => {
      onUpdate({
        brandId: brand.id,
        brandName: brand.name,
        modelId: "",
        modelName: "",
      });
      closePicker();
    },
    [onUpdate, closePicker],
  );

  const selectModel = useCallback(
    (model: Model) => {
      onUpdate({
        modelId: model.id,
        modelName: model.name,
      });
      closePicker();
    },
    [onUpdate, closePicker],
  );

  const selectCondition = useCallback(
    (condition: ProductCondition) => {
      onUpdate({ condition });
      closePicker();
    },
    [onUpdate, closePicker],
  );

  // Get icon for field type
  const getFieldIcon = (field: string, size: number = 20) => {
    switch (field) {
      case "category":
        return <Tag size={size} color="$slateSmoke" />;
      case "brand":
        return <Award size={size} color="$slateSmoke" />;
      case "model":
        return <Layers size={size} color="$slateSmoke" />;
      case "condition":
        return <Star size={size} color="$slateSmoke" />;
      default:
        return null;
    }
  };

  const renderPickerButton = (
    label: string,
    value: string,
    placeholder: string,
    pickerType: ActivePicker,
    disabled = false,
  ) => (
    <Column gap="$2">
      <Row alignItems="center" gap="$1">
        <Text size="$4" fontWeight="600" color="$ironstone">
          {label}
        </Text>
        <Text size="$4" fontWeight="600" color="$error">
          *
        </Text>
      </Row>
      <TouchableOpacity
        onPress={() => !disabled && openPicker(pickerType)}
        disabled={disabled}
        accessibilityLabel={`Select ${label.toLowerCase()}`}
        style={{ opacity: disabled ? 0.5 : 1 }}
      >
        <Row
          backgroundColor={disabled ? "$gray100" : "$pureWhite"}
          borderWidth={2}
          borderColor={value ? "$spicedClementine" : "$cloudMist"}
          borderRadius="$xl"
          paddingHorizontal="$4"
          paddingVertical="$4"
          alignItems="center"
          gap="$3"
        >
          {getFieldIcon(pickerType || "")}
          <Text
            flex={1}
            color={value ? "$ironstone" : "$slateSmoke"}
            size="$6"
            fontWeight={value ? "500" : "400"}
          >
            {value || placeholder}
          </Text>
          <ChevronDown size={20} color="$slateSmoke" />
        </Row>
      </TouchableOpacity>
    </Column>
  );

  // Picker Modal Content
  const renderPickerContent = () => {
    if (!activePicker) return null;

    let title = "";
    let items: { id: string; name: string }[] = [];
    let onSelect: (item: { id: string; name: string }) => void = () => {};
    let showSearch = false;
    let selectedId = "";

    switch (activePicker) {
      case "category":
        title = "Category";
        items = categories;
        onSelect = (item) => selectCategory(item as Category);
        selectedId = formData.categoryId;
        break;
      case "brand":
        title = "Brand";
        items = brands;
        onSelect = (item) => selectBrand(item as Brand);
        showSearch = true;
        selectedId = formData.brandId;
        break;
      case "model":
        title = "Model";
        items = models;
        onSelect = (item) => selectModel(item as Model);
        showSearch = true;
        selectedId = formData.modelId;
        break;
      case "condition":
        title = "Condition";
        items = CONDITION_OPTIONS.map((c) => ({
          id: c.value,
          name: c.label,
        }));
        onSelect = (item) => selectCondition(item.id as ProductCondition);
        selectedId = formData.condition;
        break;
    }

    return (
      <Column
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        backgroundColor="$pureWhite"
        zIndex={100}
      >
        {/* Picker Header */}
        <Row
          paddingHorizontal="$4"
          paddingVertical="$4"
          alignItems="center"
          justifyContent="space-between"
          borderBottomWidth={1}
          borderBottomColor="$cloudMist"
        >
          <TouchableOpacity
            onPress={closePicker}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#F5F5F5",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={20} color="$ironstone" />
          </TouchableOpacity>
          <Text
            fontFamily="$heading"
            size="$7"
            fontWeight="700"
            color="$ironstone"
          >
            Select {title}
          </Text>
          <View width={40} />
        </Row>

        {/* Search Input */}
        {showSearch && (
          <Column paddingHorizontal="$4" paddingVertical="$3">
            <Row
              backgroundColor="$gray100"
              borderRadius="$xl"
              paddingHorizontal="$4"
              paddingVertical="$3"
              alignItems="center"
              gap="$3"
            >
              <Search size={20} color="$slateSmoke" />
              <Input
                flex={1}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={`Search ${title.toLowerCase()}...`}
                placeholderTextColor="$slateSmoke"
                borderWidth={0}
                backgroundColor="transparent"
                size="$6"
                color="$ironstone"
                autoFocus
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <X size={18} color="$slateSmoke" />
                </TouchableOpacity>
              )}
            </Row>
          </Column>
        )}

        {/* Loading State */}
        {isLoading && (
          <Column padding="$6" alignItems="center" gap="$3">
            <Spinner size="sm" color="$spicedClementine" />
            <Text size="$4" color="$slateSmoke">
              Loading...
            </Text>
          </Column>
        )}

        {/* Items List */}
        <ScrollView flex={1} keyboardShouldPersistTaps="handled">
          <Column paddingHorizontal="$4" paddingVertical="$2" gap="$2">
            {items.map((item) => {
              const isSelected = selectedId === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => onSelect(item)}
                  accessibilityLabel={`Select ${item.name}`}
                >
                  <Row
                    paddingHorizontal="$4"
                    paddingVertical="$4"
                    alignItems="center"
                    borderRadius="$xl"
                    backgroundColor={isSelected ? "$lemonHaze" : "transparent"}
                    borderWidth={isSelected ? 2 : 0}
                    borderColor={
                      isSelected ? "$spicedClementine" : "transparent"
                    }
                  >
                    <Column flex={1} gap="$1">
                      <Text
                        size="$6"
                        fontWeight={isSelected ? "600" : "500"}
                        color="$ironstone"
                      >
                        {item.name}
                      </Text>
                    </Column>
                    {isSelected && (
                      <View
                        width={28}
                        height={28}
                        borderRadius="$full"
                        backgroundColor="$spicedClementine"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Check size={16} color="$pureWhite" />
                      </View>
                    )}
                  </Row>
                </TouchableOpacity>
              );
            })}

            {!isLoading && items.length === 0 && (
              <Column padding="$6" alignItems="center" gap="$2">
                <Text size="$5" fontWeight="500" color="$slateSmoke">
                  {showSearch && searchQuery
                    ? "No results found"
                    : "Start typing to search"}
                </Text>
                {showSearch && !searchQuery && (
                  <Text size="$3" color="$slateSmoke">
                    Enter at least 2 characters
                  </Text>
                )}
              </Column>
            )}
          </Column>
        </ScrollView>
      </Column>
    );
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
          padding: 20,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Section */}
        <Column gap="$2" marginBottom="$6">
          <Text
            fontFamily="$heading"
            size="$10"
            fontWeight="800"
            color="$ironstone"
          >
            Item details
          </Text>
          <Text size="$5" fontWeight="400" color="$slateSmoke">
            Help buyers find your item with accurate details
          </Text>
        </Column>

        {/* Form Fields */}
        <Column gap="$5">
          {renderPickerButton(
            "Category",
            formData.categoryName,
            "What type of item is this?",
            "category",
          )}

          {renderPickerButton(
            "Brand",
            formData.brandName,
            "Who makes this item?",
            "brand",
          )}

          {renderPickerButton(
            "Model",
            formData.modelName,
            "Which model is it?",
            "model",
            !formData.brandId,
          )}

          {renderPickerButton(
            "Condition",
            CONDITION_OPTIONS.find((c) => c.value === formData.condition)
              ?.label || "",
            "How would you describe its condition?",
            "condition",
          )}
        </Column>

        {/* Helper Text */}
        <Column marginTop="$6" gap="$2">
          <Row
            backgroundColor="$gray100"
            borderRadius="$lg"
            padding="$3"
            gap="$2"
          >
            <Text size="$3" color="$slateSmoke">
              💡 Accurate details help your item get discovered by the right
              buyers
            </Text>
          </Row>
        </Column>
      </ScrollView>

      {/* Picker Overlay */}
      {renderPickerContent()}
    </Column>
  );
}
