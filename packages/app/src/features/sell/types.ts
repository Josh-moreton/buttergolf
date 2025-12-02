/**
 * Types for the sell flow
 */

export type { ProductCondition } from "../../types/product";
import type { ProductCondition } from "../../types/product";

export interface SellFormData {
  // Step 1: Photos
  images: ImageData[];

  // Step 2: Item Details
  categoryId: string;
  categoryName: string;
  brandId: string;
  brandName: string;
  modelId: string;
  modelName: string;
  condition: ProductCondition;

  // Step 3: Listing Info
  title: string;
  description: string;
  price: string;
}

export interface ImageData {
  uri: string;
  width?: number;
  height?: number;
  base64?: string;
}

export const CONDITION_OPTIONS: { value: ProductCondition; label: string }[] = [
  { value: "NEW", label: "New" },
  { value: "LIKE_NEW", label: "Like New" },
  { value: "EXCELLENT", label: "Excellent" },
  { value: "GOOD", label: "Good" },
  { value: "FAIR", label: "Fair" },
  { value: "POOR", label: "Poor" },
];

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Brand {
  id: string;
  name: string;
}

export interface Model {
  id: string;
  name: string;
  brandId: string;
}

export type SellStep = 1 | 2 | 3 | 4;

export const SELL_STEPS = [
  { step: 1 as const, title: "Photos", description: "Add up to 5 photos" },
  {
    step: 2 as const,
    title: "Details",
    description: "Category, brand & condition",
  },
  {
    step: 3 as const,
    title: "Listing",
    description: "Title, description & price",
  },
  { step: 4 as const, title: "Review", description: "Review and submit" },
];
