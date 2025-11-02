'use client'

import { Row, Column, H2 } from '@buttergolf/ui'
import { ProductCard, ProductCardProps } from './ProductCard'

interface ProductGridProps {
  title?: string
  products: ProductCardProps[]
}

export function ProductGrid({ title, products }: ProductGridProps) {
  return (
    <Column padding="$4" gap="$4" width="100%" maxWidth={1280} alignSelf="center">
      {title && (
        <H2 size="$8" fontWeight="600" color="$color">
          {title}
        </H2>
      )}
      <Row
        wrap={true}
        gap="$4"
        justify="start"
      >
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </Row>
    </Column>
  )
}
