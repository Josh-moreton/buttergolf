'use client'

import { Column, H1, H3, Button, Row } from '@buttergolf/ui'
import { SearchBar } from './SearchBar'

export function HeroSection() {
  return (
    <Column
      backgroundColor="$surface"
      paddingVertical="$8"
      paddingHorizontal="$4"
      align="center"
      {...{ gap: "lg" as any }}
      borderBottomWidth={1}
      borderBottomColor="$border"
    >
      <Column align="center" {...{ gap: "sm" as any }} maxWidth={800}>
        <H1 size="$10" textAlign="center" fontWeight="700" color="$text">
          Ready to declutter your golf bag?
        </H1>
        <H3 size="$6" textAlign="center" color="$textSecondary" fontWeight="400">
          Buy and sell pre-owned golf equipment with ease
        </H3>
      </Column>

      <SearchBar />

      <Row {...{ gap: "sm" as any }} wrap justify="center">
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
