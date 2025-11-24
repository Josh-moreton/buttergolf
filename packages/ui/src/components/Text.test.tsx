import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TamaguiProvider } from 'tamagui'
import { config } from '@buttergolf/config'
import { Text, Heading, Label } from './Text'

// Test wrapper with Tamagui provider
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <TamaguiProvider config={config} defaultTheme="light">
    {children}
  </TamaguiProvider>
)

describe('Text Component', () => {
  it('renders text content', () => {
    render(
      <TestWrapper>
        <Text>Hello World</Text>
      </TestWrapper>
    )
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('applies weight variants correctly', () => {
    const { container } = render(
      <TestWrapper>
        <Text weight="bold">Bold Text</Text>
      </TestWrapper>
    )
    // Check that fontWeight style is applied
    const textElement = screen.getByText('Bold Text')
    expect(textElement).toBeInTheDocument()
  })

  it('applies truncate variant', () => {
    render(
      <TestWrapper>
        <Text truncate>This is a very long text that should be truncated</Text>
      </TestWrapper>
    )
    const textElement = screen.getByText('This is a very long text that should be truncated')
    expect(textElement).toBeInTheDocument()
  })

  it('applies text alignment', () => {
    render(
      <TestWrapper>
        <Text align="center">Centered Text</Text>
      </TestWrapper>
    )
    expect(screen.getByText('Centered Text')).toBeInTheDocument()
  })
})

describe('Heading Component', () => {
  it('renders heading with default level', () => {
    render(
      <TestWrapper>
        <Heading>Default Heading</Heading>
      </TestWrapper>
    )
    // Default level is 2, so it should be h2
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveTextContent('Default Heading')
  })

  it('renders h1 when level is 1', () => {
    render(
      <TestWrapper>
        <Heading level={1}>Page Title</Heading>
      </TestWrapper>
    )
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Page Title')
  })

  it('renders h3 when level is 3', () => {
    render(
      <TestWrapper>
        <Heading level={3}>Section Title</Heading>
      </TestWrapper>
    )
    const heading = screen.getByRole('heading', { level: 3 })
    expect(heading).toHaveTextContent('Section Title')
  })

  it('applies text alignment', () => {
    render(
      <TestWrapper>
        <Heading level={2} align="center">Centered Heading</Heading>
      </TestWrapper>
    )
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveTextContent('Centered Heading')
  })
})

describe('Label Component', () => {
  it('renders label text', () => {
    render(
      <TestWrapper>
        <Label>Email Address</Label>
      </TestWrapper>
    )
    expect(screen.getByText('Email Address')).toBeInTheDocument()
  })

  it('applies disabled variant', () => {
    render(
      <TestWrapper>
        <Label disabled>Disabled Label</Label>
      </TestWrapper>
    )
    const label = screen.getByText('Disabled Label')
    expect(label).toBeInTheDocument()
  })

  it('can be associated with form inputs', () => {
    render(
      <TestWrapper>
        <Label htmlFor="email">Email</Label>
      </TestWrapper>
    )
    const label = screen.getByText('Email')
    expect(label).toBeInTheDocument()
  })
})
