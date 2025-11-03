# Layout Component Type Safety Guide

## Overview

This guide covers best practices for using layout components (`Row`, `Column`, `Container`) with full type safety in the ButterGolf application. Our semantic layout components are built on Tamagui primitives and provide excellent TypeScript support.

## Table of Contents

1. [Basic Usage](#basic-usage)
2. [Type Imports](#type-imports)
3. [Common Patterns](#common-patterns)
4. [Type Assertions](#type-assertions)
5. [Advanced Patterns](#advanced-patterns)
6. [Troubleshooting](#troubleshooting)

---

## Basic Usage

### Importing Components

```tsx
// ✅ CORRECT - Import components from @buttergolf/ui
import { Row, Column, Container } from '@buttergolf/ui'

// ✅ CORRECT - Import types with 'type' keyword for better tree-shaking
import { Row, Column, type RowProps, type ColumnProps } from '@buttergolf/ui'
```

### Basic Layout Examples

```tsx
// Horizontal layout
<Row gap="$md" align="center" justify="between">
  <Text>Left content</Text>
  <Button>Right action</Button>
</Row>

// Vertical layout
<Column gap="$lg" align="stretch">
  <Heading level={2}>Title</Heading>
  <Text>Description</Text>
  <Button>Action</Button>
</Column>

// Container with max width
<Container maxWidth="lg" padding="md">
  <Text>Constrained content</Text>
</Container>
```

---

## Type Imports

### Best Practice: Use Type-Only Imports

```tsx
// ✅ CORRECT - Explicit type-only import (better for tree-shaking and clarity)
import { Row, type RowProps } from '@buttergolf/ui'

// ✅ ALSO CORRECT - Without type keyword (runtime + type import)
import { Row, RowProps } from '@buttergolf/ui'

// ❌ AVOID - No need to import if you're not using the type explicitly
import type { RowProps } from '@buttergolf/ui'
```

### When to Import Types

You typically need to import prop types when:

1. **Creating wrapper components:**
```tsx
import { Row, type RowProps } from '@buttergolf/ui'

interface CardWrapperProps extends RowProps {
  highlighted?: boolean
}

function CardWrapper({ highlighted, ...props }: CardWrapperProps) {
  return <Row {...props} backgroundColor={highlighted ? '$primaryLight' : '$surface'} />
}
```

2. **Typing component props that accept layout components:**
```tsx
import { ComponentType } from 'react'
import { type RowProps } from '@buttergolf/ui'

interface LayoutSectionProps {
  Layout: ComponentType<RowProps>
  children: React.ReactNode
}
```

3. **Creating reusable layout utilities:**
```tsx
import { type ColumnProps } from '@buttergolf/ui'

type FormGroupProps = ColumnProps & {
  label: string
  error?: string
}
```

---

## Common Patterns

### 1. Extending Layout Components

```tsx
// ✅ CORRECT - Extend props with proper typing
import { Row, type RowProps } from '@buttergolf/ui'

interface CustomRowProps extends RowProps {
  highlighted?: boolean
  bordered?: boolean
}

function CustomRow({ highlighted, bordered, children, ...rest }: CustomRowProps) {
  return (
    <Row
      {...rest}
      borderWidth={bordered ? 1 : 0}
      borderColor="$border"
      backgroundColor={highlighted ? '$primaryLight' : 'transparent'}
    >
      {children}
    </Row>
  )
}
```

### 2. Conditional Layout Variants

```tsx
// ✅ CORRECT - Use conditional props
<Row 
  gap="$md" 
  align="center"
  {...(isMobile && { flexDirection: 'column' })}
>
  {children}
</Row>

// ✅ CORRECT - Use media queries
<Row 
  gap="$md"
  flexDirection="row"
  $sm={{ flexDirection: 'column' }}
>
  {children}
</Row>
```

### 3. Dynamic Component Selection

```tsx
// ✅ CORRECT - Conditional rendering
const Layout = isHorizontal ? Row : Column
return <Layout gap="$md">{children}</Layout>

// ✅ CORRECT - With proper typing
import { ComponentType } from 'react'
import { Row, Column, type RowProps, type ColumnProps } from '@buttergolf/ui'

type LayoutComponent = ComponentType<RowProps | ColumnProps>

function DynamicLayout({ horizontal, children }: { 
  horizontal: boolean
  children: React.ReactNode 
}) {
  const Layout: LayoutComponent = horizontal ? Row : Column
  return <Layout gap="$md">{children}</Layout>
}
```

### 4. Forwarding Refs

```tsx
// ✅ CORRECT - Forward refs when needed
import { forwardRef } from 'react'
import { Row, type RowProps } from '@buttergolf/ui'

interface CardWrapperProps extends RowProps {
  highlighted?: boolean
}

export const CardWrapper = forwardRef<HTMLDivElement, CardWrapperProps>(
  ({ highlighted, children, ...props }, ref) => {
    return (
      <Row 
        ref={ref} 
        {...props}
        backgroundColor={highlighted ? '$primaryLight' : '$surface'}
      >
        {children}
      </Row>
    )
  }
)

CardWrapper.displayName = 'CardWrapper'
```

---

## Type Assertions

### When Type Assertions Are Needed

Tamagui has strict typing for some props that don't accept our semantic tokens directly. In these cases, type assertions are the recommended approach:

```tsx
// ✅ CORRECT - Use type assertion for variant props that need tokens
<Container {...{ maxWidth: "lg" as any, padding: "md" as any }}>
  Content
</Container>

// ✅ CORRECT - Use spread syntax to avoid TypeScript errors
<Text {...{ color: "$textMuted" as any }}>
  Muted text
</Text>

// ✅ CORRECT - For Spinner color prop
<Spinner size="lg" {...{ color: "$primary" as any }} />
```

### Why This Pattern Is Safe

1. **Tamagui's runtime handles these correctly** - The types are just overly strict
2. **Our design tokens are validated** - All `$` tokens exist in our config
3. **This is documented in Copilot instructions** - It's an approved pattern

### Alternative: Direct Token Usage

For some props, you can use tokens directly:

```tsx
// ✅ Direct token usage (works for many props)
<Row gap="$md" padding="$lg">
  Content
</Row>

// ✅ Direct token for colors (on some components)
<View backgroundColor="$surface" borderColor="$border">
  Content
</View>
```

---

## Advanced Patterns

### 1. Creating Styled Extensions

If you need to create styled versions of layout components:

```tsx
import { styled, GetProps } from 'tamagui'
import { Row } from '@buttergolf/ui'

// ✅ CORRECT - Always export GetProps type
export const HighlightedRow = styled(Row, {
  backgroundColor: '$primaryLight',
  padding: '$md',
  borderRadius: '$md',
})

export type HighlightedRowProps = GetProps<typeof HighlightedRow>
```

### 2. Generic Layout Wrapper

```tsx
import { ComponentType, ReactNode } from 'react'
import { Row, Column, type RowProps, type ColumnProps } from '@buttergolf/ui'

type LayoutProps = RowProps | ColumnProps

interface GenericLayoutProps<T extends LayoutProps = LayoutProps> {
  Layout: ComponentType<T>
  layoutProps?: T
  children: ReactNode
}

function GenericLayout<T extends LayoutProps>({ 
  Layout, 
  layoutProps, 
  children 
}: GenericLayoutProps<T>) {
  return <Layout {...layoutProps}>{children}</Layout>
}

// Usage
<GenericLayout Layout={Row} layoutProps={{ gap: '$md', align: 'center' }}>
  {children}
</GenericLayout>
```

### 3. Composition with Context

```tsx
import { createContext, useContext, ComponentType } from 'react'
import { Row, Column, type RowProps } from '@buttergolf/ui'

const LayoutContext = createContext<{
  Layout: ComponentType<RowProps>
  gap: string
}>({
  Layout: Column,
  gap: '$md'
})

function useLayoutContext() {
  return useContext(LayoutContext)
}

function LayoutProvider({ children, horizontal = false, gap = '$md' }) {
  return (
    <LayoutContext.Provider value={{ Layout: horizontal ? Row : Column, gap }}>
      {children}
    </LayoutContext.Provider>
  )
}

function LayoutConsumer({ children }) {
  const { Layout, gap } = useLayoutContext()
  return <Layout gap={gap}>{children}</Layout>
}
```

---

## Troubleshooting

### Common TypeScript Errors

#### Error: "Type 'X' is not assignable to type 'Y'"

```tsx
// ❌ WRONG - Using variant value incorrectly
<Row gap="md">  // Should be "$md"

// ✅ CORRECT
<Row gap="$md">
```

#### Error: "Property 'X' does not exist on type 'IntrinsicAttributes'"

This usually means you're trying to use a variant that doesn't exist:

```tsx
// ❌ WRONG - 'size' variant doesn't exist on Row
<Row size="lg">

// ✅ CORRECT - Use direct props
<Row height="$lg">
```

#### Error: Type issues with conditional props

```tsx
// ❌ WRONG - TypeScript can't infer union types
const props: RowProps = condition ? propsA : propsB

// ✅ CORRECT - Use type assertion or spread
<Row {...(condition ? propsA : propsB)}>
```

### Type Inference Issues

If TypeScript can't infer types correctly:

1. **Be explicit about types:**
```tsx
const layoutProps: RowProps = {
  gap: '$md',
  align: 'center',
}
```

2. **Use type assertions for problematic props:**
```tsx
<Container {...{ maxWidth: "lg" as any }}>
```

3. **Check that you're using the correct component:**
```tsx
// Row and Column have different props
<Row justify="between">  // ✅ Has justify
<Column justify="between">  // ✅ Also has justify
```

---

## Best Practices Summary

1. ✅ **Always use semantic layout components** (`Row`, `Column`, `Container`) instead of raw `XStack`/`YStack`
2. ✅ **Import types with the `type` keyword** for better tree-shaking
3. ✅ **Use type assertions (`as any`)** when Tamagui's types are too strict
4. ✅ **Export `GetProps` types** when creating styled extensions
5. ✅ **Forward refs** when creating wrapper components that need them
6. ✅ **Use media queries** for responsive layouts instead of conditional rendering
7. ✅ **Prefer composition** over inheritance for complex layouts
8. ✅ **Document complex type patterns** in comments

---

## ESLint Rules (Recommended)

Consider adding these rules to prevent common issues:

```json
{
  "rules": {
    "no-restricted-imports": [
      "error",
      {
        "paths": [
          {
            "name": "tamagui",
            "importNames": ["XStack", "YStack"],
            "message": "Use Row/Column from @buttergolf/ui instead of XStack/YStack"
          }
        ]
      }
    ]
  }
}
```

---

## Additional Resources

- [Tamagui Documentation](https://tamagui.dev/docs/intro/introduction)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Copilot Instructions](/github/copilot-instructions.md) - Our project conventions

---

## Questions or Issues?

If you encounter type safety issues not covered in this guide:

1. Check the [Tamagui documentation](https://tamagui.dev/docs)
2. Review existing code for similar patterns
3. Ask in the team chat or create a GitHub issue
4. Update this guide with your solution!
