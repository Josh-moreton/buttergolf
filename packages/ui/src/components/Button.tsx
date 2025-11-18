/**
 * Button Component
 *
 * Standard Tamagui Button with ButterGolf branding defaults.
 * Uses standard Tamagui numeric size tokens ($1-$16).
 *
 * @example
 * ```tsx
 * <Button size="$4">Medium button</Button>
 * <Button size="$6" backgroundColor="$primary" color="$textInverse">Primary CTA</Button>
 * <Button size="$3" backgroundColor="transparent" color="$primary" borderWidth={2} borderColor="$primary">Outline</Button>
 * <Button chromeless>Ghost button</Button>
 * ```
 */

// Re-export standard Tamagui Button with no custom variants
export { Button } from "tamagui";
export type { ButtonProps } from "tamagui";
