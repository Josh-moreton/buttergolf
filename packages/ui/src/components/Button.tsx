/**
 * Button Component
 * 
 * A versatile button component with multiple variants for different use cases.
 * Supports various sizes, tones, and states across both web and mobile platforms.
 * 
 * @example
 * ```tsx
 * <Button size="md" tone="primary">Click me</Button>
 * <Button size="lg" tone="secondary" disabled>Disabled</Button>
 * <Button size="sm" tone="outline">Outline button</Button>
 * ```
 */

import { styled, GetProps, Button as TamaguiButton } from 'tamagui'

export const Button = styled(TamaguiButton, {
  name: 'Button',
  
  // Base styles
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
  cursor: 'pointer',
  borderRadius: '$md',
  fontWeight: '600',
  userSelect: 'none',
  
  // No default size here - use defaultVariants instead
  
  // Disabled state
  disabledStyle: {
    opacity: 0.5,
    cursor: 'not-allowed',
    pointerEvents: 'none',
  },

  variants: {
    size: {
      sm: {
        height: '$buttonSm',
        paddingHorizontal: '$3',
        paddingVertical: '$2',
        fontSize: '$3',
        gap: '$2',
      },
      md: {
        height: '$buttonMd',
        paddingHorizontal: '$4',
        paddingVertical: '$3',
        fontSize: '$4',
        gap: '$2.5',
      },
      lg: {
        height: '$buttonLg',
        paddingHorizontal: '$5',
        paddingVertical: '$4',
        fontSize: '$5',
        gap: '$3',
      },
    },

    tone: {
      primary: {
        backgroundColor: '$primary',
        color: '$white',
        borderWidth: 0,
        
        hoverStyle: {
          backgroundColor: '$primaryHover',
        },
        
        pressStyle: {
          backgroundColor: '$primaryPress',
        },
        
        focusStyle: {
          shadowColor: '$primaryFocus',
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 0 },
        },
      },

      secondary: {
        backgroundColor: '$secondary',
        color: '$gray900',
        borderWidth: 0,
        
        hoverStyle: {
          backgroundColor: '$secondaryHover',
        },
        
        pressStyle: {
          backgroundColor: '$secondaryPress',
        },
        
        focusStyle: {
          shadowColor: '$secondaryFocus',
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 0 },
        },
      },

      outline: {
        backgroundColor: 'transparent',
        color: '$primary',
        borderWidth: 1,
        borderColor: '$primary',
        
        hoverStyle: {
          backgroundColor: '$primaryLight',
          borderColor: '$primaryHover',
        },
        
        pressStyle: {
          backgroundColor: '$primaryLight',
          borderColor: '$primaryPress',
        },
        
        focusStyle: {
          borderWidth: 2,
          borderColor: '$primaryFocus',
        },
      },

      ghost: {
        backgroundColor: 'transparent',
        color: '$text',
        borderWidth: 0,
        
        hoverStyle: {
          backgroundColor: '$backgroundHover',
        },
        
        pressStyle: {
          backgroundColor: '$backgroundPress',
        },
        
        focusStyle: {
          backgroundColor: '$backgroundPress',
        },
      },

      success: {
        backgroundColor: '$success',
        color: '$white',
        borderWidth: 0,
        
        hoverStyle: {
          backgroundColor: '$successDark',
        },
        
        pressStyle: {
          backgroundColor: '$successDark',
        },
      },

      error: {
        backgroundColor: '$error',
        color: '$white',
        borderWidth: 0,
        
        hoverStyle: {
          backgroundColor: '$errorDark',
        },
        
        pressStyle: {
          backgroundColor: '$errorDark',
        },
      },
    },

    fullWidth: {
      true: {
        width: '100%',
      },
    },

    loading: {
      true: {
        opacity: 0.7,
        cursor: 'wait',
      },
    },
  } as const,

  defaultVariants: {
    size: 'md',
    tone: 'primary',
  },
})

export type ButtonProps = GetProps<typeof Button>
