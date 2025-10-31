'use client'

import { Button, Text } from '@buttergolf/ui'

export interface CategoryButtonProps {
  label: string
  active?: boolean
  onPress?: () => void
}

export function CategoryButton({
  label,
  active = false,
  onPress,
}: CategoryButtonProps) {
  return (
    <Button
      size="$3"
      paddingHorizontal="$4"
      borderRadius="$10"
      theme={active ? 'blue' : undefined}
      backgroundColor={active ? '$blue10' : '$backgroundPress'}
      borderColor={active ? '$blue10' : '$borderColor'}
      pressStyle={{ scale: 0.97 }}
      onPress={onPress}
    >
      <Text
        color={active ? '$color' : '$color'}
        fontWeight={active ? '600' : '400'}
      >
        {label}
      </Text>
    </Button>
  )
}
