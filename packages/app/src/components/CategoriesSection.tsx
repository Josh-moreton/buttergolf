'use client'

import { Row, ScrollView } from '@buttergolf/ui'
import { CategoryButton } from './CategoryButton'

const categories = [
  'All',
  'Drivers',
  'Irons',
  'Wedges',
  'Putters',
  'Woods',
  'Hybrids',
  'Bags',
  'Balls',
  'Apparel',
  'Accessories',
]

export function CategoriesSection() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      paddingVertical="$4"
      paddingHorizontal="$4"
      borderBottomWidth={1}
      borderBottomColor="$border"
    >
      <Row gap="$2">
        {categories.map((category, index) => (
          <CategoryButton
            key={category}
            label={category}
            active={index === 0}
          />
        ))}
      </Row>
    </ScrollView>
  )
}
