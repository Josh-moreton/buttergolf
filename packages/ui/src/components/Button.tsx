// Simple re-export from Tamagui core
import { styled, Stack } from 'tamagui'

export const Button = styled(Stack, {
  name: 'Button',
  tag: 'button',
  backgroundColor: '$background',
  paddingHorizontal: '$4',
  paddingVertical: '$2',
  borderRadius: '$4',
  cursor: 'pointer',
  
  pressStyle: {
    opacity: 0.8,
  },
  
  hoverStyle: {
    backgroundColor: '$backgroundHover',
  },
})

export type ButtonProps = React.ComponentProps<typeof Button>
