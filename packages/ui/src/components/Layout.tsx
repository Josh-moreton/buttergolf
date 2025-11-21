/**
 * Layout Components
 *
 * Semantic layout components - thin wrappers over Tamagui primitives with better naming.
 * Use Row for horizontal layouts (XStack), Column for vertical layouts (YStack).
 *
 * These are intentionally minimal shims that preserve all Tamagui primitive behavior
 * while providing more semantic naming for application code.
 *
 * ## Responsive Visibility
 *
 * For conditional rendering based on screen size, use the `useMedia()` hook instead of
 * media query props like `$gtMd={{ display: "flex" }}`. This avoids hydration issues
 * and matches the proven pattern used throughout the app.
 *
 * @example
 * ```tsx
 * // ✅ CORRECT - Use useMedia() hook for responsive visibility
 * import { useMedia } from "tamagui";
 * 
 * const media = useMedia();
 * 
 * {media.gtMd && <DesktopSidebar />}
 * {!media.gtMd && <MobileMenu />}
 * ```
 *
 * @example
 * ```tsx
 * // ✅ CORRECT - Basic layout usage
 * <Column gap="$lg">
 *   <Row gap="$md" alignItems="center" justifyContent="space-between">
 *     <Text>Left content</Text>
 *     <Button>Right action</Button>
 *   </Row>
 * </Column>
 * ```
 */

import {
  styled,
  GetProps,
  XStack as TamaguiXStack,
  YStack as TamaguiYStack,
  View as TamaguiView,
} from "tamagui";

// Export raw primitives for advanced usage
export { XStack, YStack, View } from "tamagui";
export type { XStackProps, YStackProps, ViewProps } from "tamagui";

// Row - Semantic name for horizontal layout (XStack)
// Minimal shim - preserves all XStack behavior and props
export const Row = styled(TamaguiXStack, {
  name: "Row",
});

// Column - Semantic name for vertical layout (YStack)
// Minimal shim - preserves all YStack behavior and props
export const Column = styled(TamaguiYStack, {
  name: "Column",
});

// Container - Max-width wrapper for content
// Useful utility for constraining content width
export const Container = styled(TamaguiYStack, {
  name: "Container",

  width: "100%",
  marginHorizontal: "auto",

  variants: {
    size: {
      sm: { maxWidth: 640 },
      md: { maxWidth: 768 },
      lg: { maxWidth: 1024 },
      xl: { maxWidth: 1280 },
      "2xl": { maxWidth: 1536 },
      full: { maxWidth: "100%" },
    },
  } as const,

  defaultVariants: {
    size: "lg",
  },
});

// Spacer - Flexible space component
// Use with flex prop: <Spacer flex={1} />
export const Spacer = styled(TamaguiView, {
  name: "Spacer",
  flex: 1,
});

export type RowProps = GetProps<typeof Row>;
export type ColumnProps = GetProps<typeof Column>;
export type ContainerProps = GetProps<typeof Container>;
export type SpacerProps = GetProps<typeof Spacer>;
