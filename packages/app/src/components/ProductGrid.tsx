'use client'

import { XStack, YStack, H2 } from '@buttergolf/ui'
import { ProductCard, ProductCardProps } from './ProductCard'

interface ProductGridProps {
  title?: string
  products: ProductCardProps[]
}

export function ProductGrid({ title, products }: ProductGridProps) {
  return (
    <YStack padding="$4" {...{ gap: "lg" as any }} width="100%" maxWidth={1280} alignSelf="center">
      {title && (
        <H2 size="$8" fontWeight="600" color="$color">
          {title}
        </H2>
      )}
      <XStack
        flexWrap="wrap"
        {...{ gap: "lg" as any }}
        {...{ justify: "start" as any }}
      >
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </XStack>
    </YStack>
  )
}
