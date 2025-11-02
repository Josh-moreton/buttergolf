'use client'

import { Card, Image, Text, XStack, YStack } from '@buttergolf/ui'

// Use compound component pattern
const CardHeader = (Card as any).Header
const CardFooter = (Card as any).Footer

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
}: Readonly<ProductCardProps>) {
  return (
    <Card
      variant="elevated"
      {...{ padding: 0 as any }}
      animation="bouncy"
      backgroundColor="$surface"
      borderColor="$border"
      hoverStyle={{
        borderColor: '$borderHover',
        shadowColor: '$shadowColorHover',
        shadowRadius: 12,
      }}
      pressStyle={{ scale: 0.98 }}
      cursor="pointer"
      onPress={onPress}
      width="100%"
      maxWidth={280}
      interactive
    >
      <CardHeader {...{ padding: 0 as any }} noBorder>
        <Image
          source={{ uri: imageUrl }}
          width="100%"
          height={200}
          objectFit="cover"
          borderTopLeftRadius="$4"
          borderTopRightRadius="$4"
          backgroundColor="$background"
        />
      </CardHeader>
      <CardFooter {...{ padding: '$md' as any }} noBorder>
        <YStack {...{ gap: "xs" as any }} width="100%">
          <Text
            size="md"
            weight="semibold"
            numberOfLines={2}
            ellipse
          >
            {title}
          </Text>
          {condition && (
            <Text size="xs" {...{ color: '$textSecondary' as any }}>
              {condition}
            </Text>
          )}
          <XStack {...{ justify: "between" as any }} alignItems="center">
            <Text size="lg" weight="bold" {...{ color: '$primary' as any }}>
              ${price.toFixed(2)}
            </Text>
          </XStack>
        </YStack>
      </CardFooter>
    </Card>
  )
}
