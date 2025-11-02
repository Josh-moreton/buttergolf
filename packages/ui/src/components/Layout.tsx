/**
 * Layout Components
 *
 * Semantic layout components with variants for consistent spacing and alignment.
 * Use Row for horizontal layouts, Column for vertical layouts, Container for max-width wrappers.
 *
 * @example
 * ```tsx
 * <Container maxWidth="lg" padding="md">
 *   <Column gap="lg" align="stretch">
 *     <Row gap="md" align="center" justify="between">
 *       <Text>Left content</Text>
 *       <Button>Right action</Button>
 *     </Row>
 *   </Column>
 * </Container>
 * ```
 */

import { styled, GetProps, XStack as TamaguiXStack, YStack as TamaguiYStack, View as TamaguiView } from 'tamagui'

// Export raw primitives for advanced usage
export { XStack, YStack, View } from 'tamagui'
export type { XStackProps, YStackProps, ViewProps } from 'tamagui'

// Row - Horizontal layout with semantic variants
export const Row = styled(TamaguiXStack, {
  name: 'Row',
  
  // Base styles
  flexDirection: 'row',
  alignItems: 'flex-start',
  
  variants: {
    gap: {
      none: { gap: 0 },
      xs: { gap: '$xs' },
      sm: { gap: '$sm' },
      md: { gap: '$md' },
      lg: { gap: '$lg' },
      xl: { gap: '$xl' },
      '2xl': { gap: '$2xl' },
    },
    
    align: {
      start: { alignItems: 'flex-start' },
      center: { alignItems: 'center' },
      end: { alignItems: 'flex-end' },
      stretch: { alignItems: 'stretch' },
      baseline: { alignItems: 'baseline' },
    },
    
    justify: {
      start: { justifyContent: 'flex-start' },
      center: { justifyContent: 'center' },
      end: { justifyContent: 'flex-end' },
      between: { justifyContent: 'space-between' },
      around: { justifyContent: 'space-around' },
      evenly: { justifyContent: 'space-evenly' },
    },
    
    wrap: {
      true: { flexWrap: 'wrap' },
      false: { flexWrap: 'nowrap' },
    },
    
    fullWidth: {
      true: { width: '100%' },
    },
  } as const,
  
  defaultVariants: {
    align: 'start',
    justify: 'start',
  },
})

// Column - Vertical layout with semantic variants
export const Column = styled(TamaguiYStack, {
  name: 'Column',
  
  // Base styles
  flexDirection: 'column',
  alignItems: 'flex-start',
  
  variants: {
    gap: {
      none: { gap: 0 },
      xs: { gap: '$xs' },
      sm: { gap: '$sm' },
      md: { gap: '$md' },
      lg: { gap: '$lg' },
      xl: { gap: '$xl' },
      '2xl': { gap: '$2xl' },
    },
    
    align: {
      start: { alignItems: 'flex-start' },
      center: { alignItems: 'center' },
      end: { alignItems: 'flex-end' },
      stretch: { alignItems: 'stretch' },
    },
    
    justify: {
      start: { justifyContent: 'flex-start' },
      center: { justifyContent: 'center' },
      end: { justifyContent: 'flex-end' },
      between: { justifyContent: 'space-between' },
      around: { justifyContent: 'space-around' },
      evenly: { justifyContent: 'space-evenly' },
    },
    
    fullWidth: {
      true: { width: '100%' },
    },
    
    fullHeight: {
      true: { height: '100%' },
    },
  } as const,
  
  defaultVariants: {
    align: 'start',
    justify: 'start',
  },
})

// Container - Max-width wrapper with semantic sizes
export const Container = styled(TamaguiYStack, {
  name: 'Container',
  
  // Base styles
  width: '100%',
  marginHorizontal: 'auto',
  
  variants: {
    maxWidth: {
      sm: { maxWidth: 640 },
      md: { maxWidth: 768 },
      lg: { maxWidth: 1024 },
      xl: { maxWidth: 1280 },
      '2xl': { maxWidth: 1536 },
      full: { maxWidth: '100%' },
    },
    
    padding: {
      none: { paddingHorizontal: 0 },
      xs: { paddingHorizontal: '$xs' },
      sm: { paddingHorizontal: '$sm' },
      md: { paddingHorizontal: '$md' },
      lg: { paddingHorizontal: '$lg' },
      xl: { paddingHorizontal: '$xl' },
    },
    
    center: {
      true: { alignItems: 'center' },
    },
  } as const,
  
  defaultVariants: {
    maxWidth: 'lg',
    padding: 'md',
  },
})

// Spacer - Flexible space component
export const Spacer = styled(TamaguiView, {
  name: 'Spacer',
  
  variants: {
    size: {
      xs: { flex: 0, width: '$xs', height: '$xs' },
      sm: { flex: 0, width: '$sm', height: '$sm' },
      md: { flex: 0, width: '$md', height: '$md' },
      lg: { flex: 0, width: '$lg', height: '$lg' },
      xl: { flex: 0, width: '$xl', height: '$xl' },
    },
    
    flex: {
      true: { flex: 1 },
      false: { flex: 0 },
    },
  } as const,
  
  defaultVariants: {
    flex: true,
  },
})

export type RowProps = GetProps<typeof Row>
export type ColumnProps = GetProps<typeof Column>
export type ContainerProps = GetProps<typeof Container>
export type SpacerProps = GetProps<typeof Spacer>
