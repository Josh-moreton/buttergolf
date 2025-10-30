'use client'

import { YStack, XStack, Text, Button, H1, H2 } from '@buttergolf/ui'

/**
 * Test screen to verify Tamagui shorthands work correctly
 */
export function TestScreen() {
  return (
    <YStack
      f={1}
      jc="center"
      ai="center"
      p="$4"
      gap="$4"
      bg="$background"
    >
      <H1 ta="center" col="$color">
        Tamagui Shorthands Test ✅
      </H1>
      
      <H2 ta="center" col="$color">
        This component uses Tamagui shorthands
      </H2>
      
      <YStack gap="$2" p="$3" bg="$backgroundHover" br="$4" w="100%" maw={400}>
        <Text>• f={'{1}'} (flex: 1)</Text>
        <Text>• jc="center" (justifyContent: center)</Text>
        <Text>• ai="center" (alignItems: center)</Text>
        <Text>• p="$4" (padding with token)</Text>
        <Text>• bg="$background" (backgroundColor with token)</Text>
        <Text>• br="$4" (borderRadius with token)</Text>
        <Text>• gap="$4" (gap with token)</Text>
        <Text>• ta="center" (textAlign: center)</Text>
      </YStack>
      
      <XStack gap="$3" fw="wrap" jc="center">
        <Button size="$4" theme="blue">
          Primary Button
        </Button>
        <Button size="$4" variant="outlined">
          Outlined Button
        </Button>
      </XStack>
    </YStack>
  )
}
