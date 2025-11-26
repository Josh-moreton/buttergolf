"use client";

import React, { useState, useEffect, useCallback } from "react";
import { TouchableOpacity } from "react-native";
import {
  Column,
  Row,
  Text,
  Heading,
  View,
  Input,
  ScrollView,
  Spinner,
} from "@buttergolf/ui";
import { ChevronDown, Check, Search } from "@tamagui/lucide-icons";

import type { SellFormData, Category, Brand, Model, ProductCondition } from "../types";
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

  const selectCategory = useCallback(
    (category: Category) => {
      onUpdate({
        categoryId: category.id,
        categoryName: category.name,
      });
      setActivePicker(null);
    },
    [onUpdate]
  );

  const selectBrand = useCallback(
    (brand: Brand) => {
      onUpdate({
        brandId: brand.id,
        brandName: brand.name,
        // Reset model when brand changes
        modelId: "",
        modelName: "",
      });
      setActivePicker(null);
      setSearchQuery("");
    },
    [onUpdate]
  );

  const selectModel = useCallback(
    (model: Model) => {
      onUpdate({
        modelId: model.id,
        modelName: model.name,
      });
      setActivePicker(null);
      setSearchQuery("");
    },
    [onUpdate]
  );

  const selectCondition = useCallback(
    (condition: ProductCondition) => {
      onUpdate({ condition });
      setActivePicker(null);
    },
    [onUpdate]
  );

  const renderPickerButton = (
    label: string,
    value: string,
    placeholder: string,
    pickerType: ActivePicker,
    disabled = false
  ) => (
    <Column gap="$1">
      <Text fontSize={14} fontWeight="500" color="$text">
        {label} <Text color="$error">*</Text>
      </Text>
      <TouchableOpacity
        onPress={() => !disabled && setActivePicker(pickerType)}
        disabled={disabled}
        accessibilityLabel={`Select ${label.toLowerCase()}`}
      >
        <Row
          backgroundColor={disabled ? "$cloudMist" : "$surface"}
          borderWidth={1}
          borderColor={activePicker === pickerType ? "$primary" : "$border"}
          borderRadius="$lg"
          paddingHorizontal="$3"
          paddingVertical="$3"
          alignItems="center"
          justifyContent="space-between"
          opacity={disabled ? 0.6 : 1}
        >
          <Text
            color={value ? "$text" : "$textMuted"}
            fontSize={15}
          >
            {value || placeholder}
          </Text>
          <ChevronDown size={20} color="$textSecondary" />
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
        title = "Select Category";
        items = categories;
        onSelect = (item) => selectCategory(item as Category);
        selectedId = formData.categoryId;
        break;
      case "brand":
        title = "Select Brand";
        items = brands;
        onSelect = (item) => selectBrand(item as Brand);
        showSearch = true;
        selectedId = formData.brandId;
        break;
      case "model":
        title = "Select Model";
        items = models;
        onSelect = (item) => selectModel(item as Model);
        showSearch = true;
        selectedId = formData.modelId;
        break;
      case "condition":
        title = "Select Condition";
        items = CONDITION_OPTIONS.map((c) => ({ id: c.value, name: c.label }));
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
        backgroundColor="$background"
        zIndex={100}
      >
        {/* Picker Header */}
        <Row
          paddingHorizontal="$4"
          paddingVertical="$3"
          alignItems="center"
          justifyContent="space-between"
          borderBottomWidth={1}
          borderBottomColor="$border"
        >
          <TouchableOpacity onPress={() => setActivePicker(null)}>
            <Text color="$primary" fontSize={16}>
              Cancel
            </Text>
          </TouchableOpacity>
          <Heading level={4} fontSize={17} fontWeight="600" color="$text">
            {title}
          </Heading>
          <View width={60} />
        </Row>

        {/* Search Input */}
        {showSearch && (
          <Row
            paddingHorizontal="$4"
            paddingVertical="$3"
            borderBottomWidth={1}
            borderBottomColor="$border"
          >
            <Row
              flex={1}
              backgroundColor="$cloudMist"
              borderRadius="$lg"
              paddingHorizontal="$3"
              alignItems="center"
              gap="$2"
            >
              <Search size={18} color="$textSecondary" />
              <Input
                flex={1}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={`Search ${title.toLowerCase().replace("select ", "")}...`}
                placeholderTextColor="$textMuted"
                borderWidth={0}
                backgroundColor="transparent"
                fontSize={15}
              />
            </Row>
          </Row>
        )}

        {/* Loading State */}
        {isLoading && (
          <Column padding="$4" alignItems="center">
            <Spinner size="sm" color="$primary" />
          </Column>
        )}

        {/* Items List */}
        <ScrollView flex={1}>
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => onSelect(item)}
              accessibilityLabel={`Select ${item.name}`}
            >
              <Row
                paddingHorizontal="$4"
                paddingVertical="$3"
                alignItems="center"
                justifyContent="space-between"
                borderBottomWidth={1}
                borderBottomColor="$cloudMist"
                backgroundColor={selectedId === item.id ? "$lemonHaze" : "transparent"}
              >
                <Text fontSize={16} color="$text">
                  {item.name}
                </Text>
                {selectedId === item.id && (
                  <Check size={20} color="$primary" />
                )}
              </Row>
            </TouchableOpacity>
          ))}

          {!isLoading && items.length === 0 && (
            <Column padding="$4" alignItems="center">
              <Text color="$textSecondary">
                {showSearch && searchQuery
                  ? "No results found"
                  : "Start typing to search"}
              </Text>
            </Column>
          )}
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
          padding: 16,
        }}
      >
        {/* Instructions */}
        <Column gap="$2" marginBottom="$4">
          <Heading level={4} fontSize={16} color="$text" fontWeight="600">
            Item details
          </Heading>
          <Text fontSize={14} color="$textSecondary">
            Tell us about what you're selling
          </Text>
        </Column>

        {/* Form Fields */}
        <Column gap="$4">
          {renderPickerButton(
            "Category",
            formData.categoryName,
            "Select a category",
            "category"
          )}

          {renderPickerButton(
            "Brand",
            formData.brandName,
            "Search for a brand",
            "brand"
          )}

          {renderPickerButton(
            "Model",
            formData.modelName,
            "Search for a model",
            "model",
            !formData.brandId // Disabled if no brand selected
          )}

          {renderPickerButton(
            "Condition",
            CONDITION_OPTIONS.find((c) => c.value === formData.condition)?.label || "",
            "Select condition",
            "condition"
          )}
        </Column>
      </ScrollView>

      {/* Picker Overlay */}
      {renderPickerContent()}
    </Column>
  );
}
