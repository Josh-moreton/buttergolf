/**
 * Layout Components
 * 
 * Core layout primitives for building flexible, responsive UIs.
 * Includes Row (XStack), Column (YStack), Container, and Spacer components.
 * 
 * @example
 * ```tsx
 * <Container maxWidth="lg">
 *   <Row gap="md" align="center">
 *     <Column flex={1} gap="sm">
 *       <Text>Content</Text>
 *     </Column>
 *   </Row>
 * </Container>
 * ```
 */

import { styled, GetProps, XStack, YStack, View } from 'tamagui'

/**
 * Row - Horizontal layout component (flex-direction: row)
 */
export const Row = styled(XStack, {
  name: 'Row',
  
  flexDirection: 'row',
  
  variants: {
    gap: {
      xs: { gap: '$xs' },
      sm: { gap: '$sm' },
      md: { gap: '$md' },
      lg: { gap: '$lg' },
      xl: { gap: '$xl' },
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
})

/**
 * Column - Vertical layout component (flex-direction: column)
 */
export const Column = styled(YStack, {
  name: 'Column',
  
  flexDirection: 'column',
  
  variants: {
    gap: {
      xs: { gap: '$xs' },
      sm: { gap: '$sm' },
      md: { gap: '$md' },
      lg: { gap: '$lg' },
      xl: { gap: '$xl' },
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
})

/**
 * Container - Constrained width container with responsive max-width
 */
export const Container = styled(View, {
  name: 'Container',
  
  width: '100%',
  marginHorizontal: 'auto',
  paddingHorizontal: '$md',
  
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
      true: {
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
  } as const,

  defaultVariants: {
    maxWidth: 'lg',
    padding: 'md',
  },
})

/**
 * Spacer - Flexible space component for layouts
 */
export const Spacer = styled(View, {
  name: 'Spacer',
  
  variants: {
    size: {
      xs: { 
        width: '$1', 
        height: '$1',
      },
      sm: { 
        width: '$2', 
        height: '$2',
      },
      md: { 
        width: '$4', 
        height: '$4',
      },
      lg: { 
        width: '$6', 
        height: '$6',
      },
      xl: { 
        width: '$8', 
        height: '$8',
      },
    },

    flex: {
      true: {
        flex: 1,
      },
    },
  } as const,
})

export type RowProps = GetProps<typeof Row>
export type ColumnProps = GetProps<typeof Column>
export type ContainerProps = GetProps<typeof Container>
export type SpacerProps = GetProps<typeof Spacer>
