'use client'

import { Card, Image, Text, YStack, XStack } from '@buttergolf/ui'

export interface ProductCardProps {
  id: string
  title: string
  price: number
  imageUrl: string
  condition?: string
  onPress?: () => void
}

export function ProductCard({
  title,
  price,
  imageUrl,
  condition,
  onPress,
}: ProductCardProps) {
  return (
    <Card
      elevate
      size="$4"
      bordered
      animation="bouncy"
      pressStyle={{ scale: 0.98 }}
      cursor="pointer"
      onPress={onPress}
      width="100%"
      maxWidth={280}
    >
      <Card.Header padding="$0">
        <Image
          source={{ uri: imageUrl }}
          width="100%"
          height={200}
          resizeMode="cover"
          borderTopLeftRadius="$4"
          borderTopRightRadius="$4"
          backgroundColor="$gray3"
        />
      </Card.Header>
      <Card.Footer padding="$3">
        <YStack gap="$2" width="100%">
          <Text
            fontSize="$4"
            fontWeight="600"
            numberOfLines={2}
            ellipse
          >
            {title}
          </Text>
          {condition && (
            <Text fontSize="$2" color="$gray11">
              {condition}
            </Text>
          )}
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$5" fontWeight="700" color="$blue10">
              ${price.toFixed(2)}
            </Text>
          </XStack>
        </YStack>
      </Card.Footer>
    </Card>
  )
}
