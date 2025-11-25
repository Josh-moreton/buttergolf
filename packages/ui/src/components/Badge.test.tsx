import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TamaguiProvider, Text } from 'tamagui'
import { config } from '@buttergolf/config'
import { Badge } from './Badge'

// Test wrapper with Tamagui provider
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <TamaguiProvider config={config} defaultTheme="light">
    {children}
  </TamaguiProvider>
)

describe('Badge Component', () => {
  it('renders badge with text content', () => {
    render(
      <TestWrapper>
        <Badge variant="success">
          <Text>Active</Text>
        </Badge>
      </TestWrapper>
    )
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('renders success variant', () => {
    render(
      <TestWrapper>
        <Badge variant="success">
          <Text>Success</Text>
        </Badge>
      </TestWrapper>
    )
    expect(screen.getByText('Success')).toBeInTheDocument()
  })

  it('renders error variant', () => {
    render(
      <TestWrapper>
        <Badge variant="error">
          <Text>Error</Text>
        </Badge>
      </TestWrapper>
    )
    expect(screen.getByText('Error')).toBeInTheDocument()
  })

  it('renders warning variant', () => {
    render(
      <TestWrapper>
        <Badge variant="warning">
          <Text>Warning</Text>
        </Badge>
      </TestWrapper>
    )
    expect(screen.getByText('Warning')).toBeInTheDocument()
  })

  it('renders info variant', () => {
    render(
      <TestWrapper>
        <Badge variant="info">
          <Text>Info</Text>
        </Badge>
      </TestWrapper>
    )
    expect(screen.getByText('Info')).toBeInTheDocument()
  })

  it('renders small size variant', () => {
    render(
      <TestWrapper>
        <Badge variant="primary" size="sm">
          <Text>3</Text>
        </Badge>
      </TestWrapper>
    )
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders medium size variant', () => {
    render(
      <TestWrapper>
        <Badge variant="primary" size="md">
          <Text>New</Text>
        </Badge>
      </TestWrapper>
    )
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('renders large size variant', () => {
    render(
      <TestWrapper>
        <Badge variant="primary" size="lg">
          <Text>Featured</Text>
        </Badge>
      </TestWrapper>
    )
    expect(screen.getByText('Featured')).toBeInTheDocument()
  })

  it('renders outline variant', () => {
    render(
      <TestWrapper>
        <Badge variant="outline">
          <Text>Outline</Text>
        </Badge>
      </TestWrapper>
    )
    expect(screen.getByText('Outline')).toBeInTheDocument()
  })

  it('renders neutral variant', () => {
    render(
      <TestWrapper>
        <Badge variant="neutral">
          <Text>Neutral</Text>
        </Badge>
      </TestWrapper>
    )
    expect(screen.getByText('Neutral')).toBeInTheDocument()
  })

  it('renders dot variant', () => {
    render(
      <TestWrapper>
        <Badge variant="success" dot />
      </TestWrapper>
    )
    // Dot badges typically don't have text content
    // Just verify it renders without crashing
  })
})
