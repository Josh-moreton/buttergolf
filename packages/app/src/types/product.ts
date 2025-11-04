export interface ProductImage {
  url: string;
  alt?: string;
}

export interface ProductUser {
  id: string;
  name: string | null;
  imageUrl: string | null;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  condition: string | null;
  images: ProductImage[];
  user: ProductUser;
  category: ProductCategory;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCardData {
  id: string;
  title: string;
  price: number;
  condition: string | null;
  imageUrl: string;
  category: string;
}
