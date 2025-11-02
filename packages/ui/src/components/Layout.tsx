/**
 * Layout Components
 *
 * Re-exports of Tamagui's base layout primitives.
 * Use XStack for horizontal layouts, YStack for vertical layouts.
 *
 * @example
 * ```tsx
 * <YStack maxWidth={1024} width="100%" marginHorizontal="auto" paddingHorizontal="$4">
 *   <XStack gap="$4" alignItems="center">
 *     <YStack flex={1} gap="$2">
 *       <Text>Content</Text>
 *     </YStack>
 *   </XStack>
 * </YStack>
 * ```
 */

export { XStack, YStack, View } from "tamagui";
export type { XStackProps, YStackProps, ViewProps } from "tamagui";
