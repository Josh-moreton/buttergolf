'use client'

import { Card, Image, Text, Row, Column } from '@buttergolf/ui'

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
      padding={0}
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
      <Card.Header padding={0} noBorder>
        <Image
          source={{ uri: imageUrl }}
          width="100%"
          height={200}
          objectFit="cover"
          borderTopLeftRadius="$4"
          borderTopRightRadius="$4"
          backgroundColor="$background"
        />
      </Card.Header>
      <Card.Footer padding="$md" noBorder>
        <Column gap="$xs" fullWidth>
          <Text
            size="md"
            weight="semibold"
            numberOfLines={2}
            ellipse
          >
            {title}
          </Text>
          {condition && (
            <Text size="xs" color="$textSecondary">
              {condition}
            </Text>
          )}
          <Row justify="between" align="center">
            <Text size="lg" weight="bold" color="$primary">
              ${price.toFixed(2)}
            </Text>
          </Row>
        </Column>
      </Card.Footer>
    </Card>
  )
}
