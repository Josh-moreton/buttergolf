/**
 * PageContainer Component
 *
 * A layout component that provides a smooth fade-in and slide-up animation
 * when content is mounted. Uses Tamagui's animation system for cross-platform
 * compatibility (web and mobile).
 *
 * @example
 * ```tsx
 * export default function MyPage() {
 *   return (
 *     <PageContainer>
 *       <Heading>Welcome</Heading>
 *       <Text>Page content fades in smoothly</Text>
 *     </PageContainer>
 *   )
 * }
 * ```
 */

'use client'

import { YStack, type YStackProps } from 'tamagui'

export type PageContainerProps = YStackProps

/**
 * PageContainer - Animated page wrapper with fade-in effect
 *
 * Automatically fades in and slides up content on mount using the 'medium'
 * animation preset from the Tamagui config.
 *
 * Props: Accepts all YStack props (flex, padding, gap, etc.)
 */
export function PageContainer(props: PageContainerProps) {
  return (
    <YStack
      animation="medium"
      enterStyle={{ opacity: 0, y: 20 }}
      opacity={1}
      y={0}
      {...props}
    />
  )
}
