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
      backgroundColor="$backgroundStrong"
      borderColor="$borderColor"
      hoverStyle={{
        borderColor: '$borderColorHover',
        shadowColor: '$shadowColorHover',
        shadowRadius: 12,
      }}
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
          objectFit="cover"
          borderTopLeftRadius="$4"
          borderTopRightRadius="$4"
          backgroundColor="$color2"
        />
      </Card.Header>
      <Card.Footer padding="$3">
        <YStack gap="$2" width="100%">
          <Text
            fontSize="$4"
            fontWeight="600"
            numberOfLines={2}
            ellipse
            color="$color"
          >
            {title}
          </Text>
          {condition && (
            <Text fontSize="$2" color="$color11">
              {condition}
            </Text>
          )}
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$5" fontWeight="700" color="$color12">
              ${price.toFixed(2)}
            </Text>
          </XStack>
        </YStack>
      </Card.Footer>
    </Card>
  )
}
