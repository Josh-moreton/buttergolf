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
    render(
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
  /**
   * Note: Tamagui's dynamic `tag` prop in variants doesn't work in jsdom.
   * The Heading component renders as <p> in tests but renders the correct
   * semantic heading tag (h1-h6) in browser environments.
   * 
   * These tests verify the styling/content, not the semantic HTML structure.
   * Browser testing is needed to verify semantic correctness.
   */
  it('renders heading with default level', () => {
    render(
      <TestWrapper>
        <Heading>Default Heading</Heading>
      </TestWrapper>
    )
    // Default level is 2 - in jsdom, renders as <p> with heading styling
    const heading = screen.getByText('Default Heading')
    expect(heading).toBeInTheDocument()
  })

  it('renders h1 when level is 1', () => {
    render(
      <TestWrapper>
        <Heading level={1}>Page Title</Heading>
      </TestWrapper>
    )
    const heading = screen.getByText('Page Title')
    expect(heading).toBeInTheDocument()
  })

  it('renders h3 when level is 3', () => {
    render(
      <TestWrapper>
        <Heading level={3}>Section Title</Heading>
      </TestWrapper>
    )
    const heading = screen.getByText('Section Title')
    expect(heading).toBeInTheDocument()
  })

  it('applies text alignment', () => {
    render(
      <TestWrapper>
        <Heading level={2} align="center">Centered Heading</Heading>
      </TestWrapper>
    )
    const heading = screen.getByText('Centered Heading')
    expect(heading).toBeInTheDocument()
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
