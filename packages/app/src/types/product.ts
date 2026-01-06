export interface ProductImage {
  url: string;
  alt?: string;
}

export interface ProductUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export type ProductCondition =
  | "NEW"
  | "LIKE_NEW"
  | "EXCELLENT"
  | "GOOD"
  | "FAIR"
  | "POOR";

export interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  condition: ProductCondition | null;
  images: ProductImage[];
  user: ProductUser;
  category: ProductCategory;
  createdAt: Date;
  updatedAt: Date;
}

export type PromotionType = "BUMP" | "WARDROBE_SPOTLIGHT";

export interface ProductCardData {
  id: string;
  title: string;
  price: number;
  condition: ProductCondition | null;
  imageUrl: string;
  category: string;
  seller: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    averageRating: number | null;
    ratingCount: number;
  };
  // Promotion fields
  activePromotion?: {
    type: PromotionType;
    expiresAt: Date;
  } | null;
}
