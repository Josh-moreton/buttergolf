/**
 * Sheet Component
 *
 * Bottom sheet/drawer component for mobile-friendly overlays.
 * Re-exports official @tamagui/sheet with compound component pattern.
 *
 * @see https://tamagui.dev/ui/sheet
 *
 * @example
 * ```tsx
 * <Sheet modal open={isOpen} onOpenChange={setOpen} snapPoints={[85]}>
 *   <Sheet.Overlay />
 *   <Sheet.Frame>
 *     <Sheet.Handle />
 *     <Sheet.ScrollView>
 *       <YStack padding="$4" gap="$4">
 *         <Heading>Sheet Title</Heading>
 *         <Text>Content here</Text>
 *       </YStack>
 *     </Sheet.ScrollView>
 *   </Sheet.Frame>
 * </Sheet>
 * ```
 */

// Re-export Sheet and its components
// Note: Tamagui Sheet is a ForwardRefExoticComponent that comes with built-in compound components.
// We re-export both the main Sheet component and individual subcomponents for flexibility.
export {
  Sheet,
  Handle,
  Overlay,
  Frame,
  SheetScrollView,
} from '@tamagui/sheet';

// Export types
export type { SheetProps } from '@tamagui/sheet';
