/**
 * Badge Component
 * 
 * A small label component for status indicators, counts, and tags.
 * Supports multiple variants and sizes.
 * 
 * @example
 * ```tsx
 * <Badge variant="success">Active</Badge>
 * <Badge variant="error" size="sm">3</Badge>
 * <Badge variant="info">New</Badge>
 * ```
 */

import { styled, GetProps, View } from 'tamagui'

export const Badge = styled(View, {
  name: 'Badge',
  
  // Base styles
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
  borderRadius: '$full',
  
  variants: {
    variant: {
      primary: {
        backgroundColor: '$primary',
        color: '$white',
      },
      
      secondary: {
        backgroundColor: '$secondary',
        color: '$gray900',
      },
      
      success: {
        backgroundColor: '$successLight',
        color: '$successDark',
      },
      
      error: {
        backgroundColor: '$errorLight',
        color: '$errorDark',
      },
      
      warning: {
        backgroundColor: '$warningLight',
        color: '$warningDark',
      },
      
      info: {
        backgroundColor: '$infoLight',
        color: '$infoDark',
      },
      
      neutral: {
        backgroundColor: '$gray200',
        color: '$gray700',
      },
      
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '$border',
        color: '$text',
      },
    },

    size: {
      sm: {
        paddingHorizontal: '$2',
        paddingVertical: '$1',
        fontSize: '$2',
        minHeight: 20,
        minWidth: 20,
      },
      md: {
        paddingHorizontal: '$2.5',
        paddingVertical: '$1.5',
        fontSize: '$3',
        minHeight: 24,
        minWidth: 24,
      },
      lg: {
        paddingHorizontal: '$3',
        paddingVertical: '$2',
        fontSize: '$4',
        minHeight: 28,
        minWidth: 28,
      },
    },

    dot: {
      true: {
        width: 8,
        height: 8,
        borderRadius: '$full',
        padding: 0,
        minWidth: 8,
        minHeight: 8,
      },
    },
  } as const,

  defaultVariants: {
    variant: 'neutral',
    size: 'md',
  },
})

export type BadgeProps = GetProps<typeof Badge>
