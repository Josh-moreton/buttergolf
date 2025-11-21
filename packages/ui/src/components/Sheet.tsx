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

import {
  Sheet as TamaguiSheet,
  Handle as TamaguiHandle,
  Overlay as TamaguiOverlay,
  Frame as TamaguiFrame,
  SheetScrollView as TamaguiSheetScrollView,
} from '@tamagui/sheet';

// Re-export with consistent naming
export const Sheet = TamaguiSheet;
export const Handle = TamaguiHandle;
export const Overlay = TamaguiOverlay;
export const Frame = TamaguiFrame;
export const SheetScrollView = TamaguiSheetScrollView;

// Attach subcomponents for compound component usage
// Note: These must be attached AFTER export for type compatibility
(Sheet as any).Overlay = Overlay;
(Sheet as any).Handle = Handle;
(Sheet as any).Frame = Frame;
(Sheet as any).ScrollView = SheetScrollView;

// Export types
export type { SheetProps } from '@tamagui/sheet';
