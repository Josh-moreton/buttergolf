'use client'

import { Column, ScrollView } from '@buttergolf/ui'
import { HeroSection } from '../../components/HeroSection'
import { CategoriesSection } from '../../components/CategoriesSection'
import { ProductGrid } from '../../components/ProductGrid'
import { ProductCardProps } from '../../components/ProductCard'

// Sample products data - will be replaced with real data later
const sampleProducts: ProductCardProps[] = [
  {
    id: '1',
    title: 'TaylorMade Stealth Driver',
    price: 299.99,
    imageUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400&h=400&fit=crop',
    condition: 'Excellent',
  },
  {
    id: '2',
    title: 'Callaway Apex Irons Set',
    price: 799.99,
    imageUrl: 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=400&fit=crop',
    condition: 'Like New',
  },
  {
    id: '3',
    title: 'Titleist Pro V1 Golf Balls (Dozen)',
    price: 39.99,
    imageUrl: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=400&h=400&fit=crop',
    condition: 'New',
  },
  {
    id: '4',
    title: 'Scotty Cameron Putter',
    price: 249.99,
    imageUrl: 'https://images.unsplash.com/photo-1530028828-25e8270e98f3?w=400&h=400&fit=crop',
    condition: 'Good',
  },
  {
    id: '5',
    title: 'Ping G425 Hybrid',
    price: 179.99,
    imageUrl: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=400&h=400&fit=crop',
    condition: 'Excellent',
  },
  {
    id: '6',
    title: 'TaylorMade Golf Bag',
    price: 149.99,
    imageUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400&h=400&fit=crop',
    condition: 'Good',
  },
  {
    id: '7',
    title: 'Cobra Wedge Set',
    price: 129.99,
    imageUrl: 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=400&fit=crop',
    condition: 'Like New',
  },
  {
    id: '8',
    title: 'Nike Golf Polo Shirt',
    price: 29.99,
    imageUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400&h=400&fit=crop',
    condition: 'Excellent',
  },
]

export function HomeScreen() {
  return (
    <ScrollView flex={1} backgroundColor="$background">
      <Column flex={1}>
        <HeroSection />
        <CategoriesSection />
        <ProductGrid title="Featured Items" products={sampleProducts} />
        <ProductGrid title="Recently Added" products={sampleProducts.slice(0, 4)} />
      </Column>
    </ScrollView>
  )
}
