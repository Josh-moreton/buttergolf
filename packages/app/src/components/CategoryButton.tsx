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
      backgroundColor={active ? '$color9' : '$backgroundPress'}
      borderColor={active ? '$color9' : '$borderColor'}
      hoverStyle={{
        backgroundColor: active ? '$color10' : '$backgroundHover',
        borderColor: active ? '$color10' : '$borderColorHover',
      }}
      pressStyle={{ 
        scale: 0.97,
        backgroundColor: active ? '$color11' : '$backgroundPress',
      }}
      onPress={onPress}
    >
      <Text
        color={active ? '$background' : '$color'}
        fontWeight={active ? '600' : '400'}
      >
        {label}
      </Text>
    </Button>
  )
}
