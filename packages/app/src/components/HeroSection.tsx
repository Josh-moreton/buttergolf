'use client'

import { Row, Column, Heading, Button } from '@buttergolf/ui'
import { SearchBar } from './SearchBar'

export function HeroSection() {
  return (
    <Column
      backgroundColor="$surface"
      paddingVertical="$8"
      paddingHorizontal="$4"
      align="center"
      gap="$lg"
      borderBottomWidth={1}
      borderBottomColor="$border"
    >
      <Column align="center" gap="$sm" maxWidth={800}>
        <Heading level={1} size="$10" textAlign="center" fontWeight="700">
          Ready to declutter your golf bag?
        </Heading>
        <Heading level={3} size="$6" textAlign="center" color="secondary" fontWeight="400">
          Buy and sell pre-owned golf equipment with ease
        </Heading>
      </Column>

      <SearchBar />

      <Row gap="$sm" wrap justify="center">
        <Button 
          size="$4" 
          backgroundColor="$primary" 
          color="$textInverse"
          borderRadius="$10"
          hoverStyle={{ backgroundColor: '$primaryHover' }}
          pressStyle={{ backgroundColor: '$primaryPress' }}
        >
          Sell now
        </Button>
        <Button
          size="$4"
          backgroundColor="$secondary"
          color="$text"
          borderRadius="$10"
          hoverStyle={{ backgroundColor: '$secondaryHover' }}
          pressStyle={{ backgroundColor: '$secondaryPress' }}
        >
          Learn how it works
        </Button>
      </Row>
    </Column>
  )
}
