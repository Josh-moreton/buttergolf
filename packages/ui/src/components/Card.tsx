/**
 * Card Component
 * 
 * A versatile container component with elevation, padding, and variant support.
 * Perfect for grouping related content with consistent styling.
 * 
 * @example
 * ```tsx
 * <Card variant="elevated" padding="lg">
 *   <CardHeader>
 *     <Heading level={3}>Card Title</Heading>
 *   </CardHeader>
 *   <CardBody>
 *     <Text>Card content goes here</Text>
 *   </CardBody>
 *   <CardFooter>
 *     <Button>Action</Button>
 *   </CardFooter>
 * </Card>
 * ```
 */

import { styled, GetProps, YStack } from 'tamagui'
import { Card as TamaguiCard, CardHeader as TamaguiCardHeader, CardFooter as TamaguiCardFooter } from '@tamagui/card'

export const Card = styled(TamaguiCard, {
  name: 'Card',
  
  // Base styles
  backgroundColor: '$surface',
  borderRadius: '$lg',
  overflow: 'hidden',
  position: 'relative',
  
  variants: {
    variant: {
      elevated: {
        shadowColor: '$shadowColor',
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
        
        hoverStyle: {
          shadowColor: '$shadowColorHover',
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 4,
        },
      },
      
      outlined: {
        borderWidth: 1,
        borderColor: '$border',
        shadowRadius: 0,
        elevation: 0,
        
        hoverStyle: {
          borderColor: '$borderHover',
        },
      },
      
      filled: {
        backgroundColor: '$card',
        shadowRadius: 0,
        elevation: 0,
        
        hoverStyle: {
          backgroundColor: '$cardHover',
        },
      },
      
      ghost: {
        backgroundColor: 'transparent',
        shadowRadius: 0,
        elevation: 0,
      },
    },

    padding: {
      none: { padding: 0 },
      xs: { padding: '$xs' },
      sm: { padding: '$sm' },
      md: { padding: '$md' },
      lg: { padding: '$lg' },
      xl: { padding: '$xl' },
    },

    interactive: {
      true: {
        cursor: 'pointer',
        
        pressStyle: {
          scale: 0.98,
        },
      },
    },

    fullWidth: {
      true: {
        width: '100%',
      },
    },
  } as const,

  defaultVariants: {
    variant: 'elevated',
    padding: 'md',
  },
})

export const CardHeader = styled(TamaguiCardHeader, {
  name: 'CardHeader',
  
  padding: '$md',
  borderBottomWidth: 1,
  borderBottomColor: '$border',
  
  variants: {
    padding: {
      none: { padding: 0 },
      sm: { padding: '$sm' },
      md: { padding: '$md' },
      lg: { padding: '$lg' },
    },

    noBorder: {
      true: {
        borderBottomWidth: 0,
      },
    },
  } as const,

  defaultVariants: {
    padding: 'md',
  },
})

export const CardBody = styled(YStack, {
  name: 'CardBody',
  
  padding: '$md',
  flex: 1,
  
  variants: {
    padding: {
      none: { padding: 0 },
      sm: { padding: '$sm' },
      md: { padding: '$md' },
      lg: { padding: '$lg' },
    },
  } as const,

  defaultVariants: {
    padding: 'md',
  },
})

export const CardFooter = styled(TamaguiCardFooter, {
  name: 'CardFooter',
  
  padding: '$md',
  borderTopWidth: 1,
  borderTopColor: '$border',
  
  variants: {
    padding: {
      none: { padding: 0 },
      sm: { padding: '$sm' },
      md: { padding: '$md' },
      lg: { padding: '$lg' },
    },

    noBorder: {
      true: {
        borderTopWidth: 0,
      },
    },

    align: {
      left: { justifyContent: 'flex-start' },
      center: { justifyContent: 'center' },
      right: { justifyContent: 'flex-end' },
    },
  } as const,

  defaultVariants: {
    padding: 'md',
    align: 'right',
  },
})

export type CardProps = GetProps<typeof Card>
export type CardHeaderProps = GetProps<typeof CardHeader>
export type CardBodyProps = GetProps<typeof CardBody>
export type CardFooterProps = GetProps<typeof CardFooter>

// Attach subcomponents to Card for compound component pattern
Object.assign(Card, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
})
