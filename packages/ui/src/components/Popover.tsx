/**
 * Popover Component
 *
 * Lightweight popover component for context menus, tooltips, and quick actions.
 * Re-exports official @tamagui/popover with compound component pattern.
 *
 * @see https://tamagui.dev/ui/popover
 *
 * @example
 * ```tsx
 * <Popover>
 *   <PopoverTrigger asChild>
 *     <Button>Open Popover</Button>
 *   </PopoverTrigger>
 *   <PopoverContent>
 *     <YStack padding="$4" gap="$2">
 *       <Text>Popover content here</Text>
 *       <PopoverClose asChild>
 *         <Button size="$3">Close</Button>
 *       </PopoverClose>
 *     </YStack>
 *   </PopoverContent>
 * </Popover>
 * ```
 */

// Re-export Popover and its components
export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  PopoverArrow,
  PopoverClose,
} from "@tamagui/popover";

// Export types
export type { PopoverProps } from "@tamagui/popover";
