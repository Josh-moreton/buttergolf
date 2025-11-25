import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TamaguiProvider } from 'tamagui'
import { config } from '@buttergolf/config'
import { Button } from './Button'

// Test wrapper with Tamagui provider
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <TamaguiProvider config={config} defaultTheme="light">
    {children}
  </TamaguiProvider>
)

describe('Button Component', () => {
  it('renders button with text', () => {
    render(
      <TestWrapper>
        <Button>Click Me</Button>
      </TestWrapper>
    )
    expect(screen.getByText('Click Me')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(
      <TestWrapper>
        <Button onPress={handleClick}>Click Me</Button>
      </TestWrapper>
    )

    const button = screen.getByText('Click Me')
    fireEvent.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('can be disabled', () => {
    const handleClick = vi.fn()
    render(
      <TestWrapper>
        <Button disabled onPress={handleClick}>Disabled Button</Button>
      </TestWrapper>
    )

    const button = screen.getByText('Disabled Button')
    fireEvent.click(button)
    // Click should not trigger when disabled
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('renders with different sizes', () => {
    const { rerender } = render(
      <TestWrapper>
        <Button size="$3">Small</Button>
      </TestWrapper>
    )
    expect(screen.getByText('Small')).toBeInTheDocument()

    rerender(
      <TestWrapper>
        <Button size="$5">Medium</Button>
      </TestWrapper>
    )
    expect(screen.getByText('Medium')).toBeInTheDocument()

    rerender(
      <TestWrapper>
        <Button size="$6">Large</Button>
      </TestWrapper>
    )
    expect(screen.getByText('Large')).toBeInTheDocument()
  })

  it('renders chromeless variant', () => {
    render(
      <TestWrapper>
        <Button chromeless>Ghost Button</Button>
      </TestWrapper>
    )
    expect(screen.getByText('Ghost Button')).toBeInTheDocument()
  })

  it('renders with custom colors', () => {
    render(
      <TestWrapper>
        <Button backgroundColor="$primary" color="$textInverse">
          Primary Button
        </Button>
      </TestWrapper>
    )
    expect(screen.getByText('Primary Button')).toBeInTheDocument()
  })
})
