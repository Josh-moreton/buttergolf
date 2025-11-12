# Copilot Instructions for ButterGolf

## Project Overview

ButterGolf is a cross-platform application built with a modern monorepo architecture, supporting both web (Next.js) and mobile (Expo) platforms. The project leverages Tamagui for cross-platform UI components and styling, ensuring a consistent user experience across all platforms.

This guide also documents our authentication setup using Clerk for both platforms, how it integrates with Prisma, and patterns to follow when adding new features in this turborepo.

## Architecture

### Monorepo Structure

- **Build System**: Turborepo 2.5.8 for build orchestration and caching
- **Package Manager**: pnpm 10.20.0 with workspace protocol
- **Apps**:
  - `apps/web` - Next.js 16.0.1 (App Router) web application
  - `apps/mobile` - Expo ~54.0.20 mobile application (iOS/Android)
- **Packages**:
  - `packages/ui` - Shared Tamagui-based cross-platform UI components
  - `packages/db` - Prisma database client and schema (PostgreSQL)
  - `packages/eslint-config` - Shared ESLint configurations
  - `packages/typescript-config` - Shared TypeScript configurations

### Technology Stack

- **UI Framework**: Tamagui 1.135.6 for cross-platform UI components and theming
- **Database**: Prisma 6.x with PostgreSQL
- **React**: 19.2.0 (aligned across web and mobile)
- **React Native**: 0.81.5
- **React Native Web**: 0.21.2 (enables React Native components on web)
- **TypeScript**: 5.9.2 (strict mode)
- **Styling**: Tailwind CSS v4 (web), Tamagui (cross-platform)
- **Bundlers**:
  - Metro (mobile) - custom workspace-aware configuration
  - Webpack (Next.js)
- **Babel**: Custom configuration with `@tamagui/babel-plugin`
- **Auth**: Clerk (Web: `@clerk/nextjs`, Mobile: `@clerk/clerk-expo`)
- **Payments**: Stripe (Web: `stripe` + `@stripe/stripe-js` + `@stripe/react-stripe-js`, Mobile: `@stripe/stripe-react-native`)

## Critical Commands

```bash
# Development
pnpm dev:web       # Start Next.js dev server (localhost:3000)
pnpm dev:mobile    # Start Expo dev server

# Building
pnpm build         # Build all apps and packages
pnpm build:web     # Build web app only
pnpm build:mobile  # Build mobile app only

# Type checking
pnpm check-types   # Run TypeScript compiler across workspace

# Cleaning
pnpm clean-install # Remove node_modules and reinstall dependencies
pnpm clean         # Clean build outputs

# Linting
pnpm lint          # Lint all packages

# Database (Prisma)
pnpm db:generate        # Generate Prisma Client
pnpm db:push            # Push schema to database (dev)
pnpm db:migrate:dev     # Create and apply migration
pnpm db:studio          # Open Prisma Studio GUI
pnpm db:seed            # Seed database with sample data

# Auth (Clerk)
# See docs/AUTH_SETUP_CLERK.md for details. Ensure env vars are set before running apps.
```

## Package Naming Convention

All internal packages use the `@buttergolf/` namespace:

- `@buttergolf/ui` - Cross-platform UI components
- `@buttergolf/db` - Prisma database client
- `@buttergolf/eslint-config` - Shared ESLint configurations
- `@buttergolf/typescript-config` - Shared TypeScript configurations
- Use workspace protocol: `"@buttergolf/ui": "workspace:*"`

## Tamagui Configuration & Theme System

### Core Config Location

- **Config Package**: `packages/config` - Dedicated package for Tamagui configuration
- **Config File**: `packages/config/src/tamagui.config.ts` (source of truth)
- **Base Config**: Extends `@tamagui/config/v4` (using latest v4)
- **Re-export**: `packages/ui/tamagui.config.ts` - Thin re-export for backward compatibility
- **TypeScript Paths**: Defined in `/tsconfig.base.json`

**Note**: The dedicated `@buttergolf/config` package allows proper versioning and reusability across the monorepo.

### Complete Token System

Our design system uses a comprehensive token system with semantic naming for maintainability and theme consistency.

#### Color Tokens

**Brand Colors (10-shade scales)**:

```tsx
// Primary Brand (Butter Orange) - Pure Butter heritage brand
$butter50 to $butter900   // 10 shades from lightest to darkest
$primary: $butter400      // Main brand color (#E25F2F - Butter Orange)
$primaryLight: $butter100 // Light variant for backgrounds
$primaryHover: $butter500 // Hover state
$primaryPress: $butter700 // Press/active state
$primaryFocus: $butter400 // Focus state

// Secondary Brand (Navy) - Modern contrast accent
$navy50 to $navy900       // 10 shades
$secondary: $navy500      // Main secondary color (#1A2E44 - Navy)
$secondaryLight: $navy100
$secondaryHover: $navy600
$secondaryPress: $navy700
$secondaryFocus: $navy500
```

**Semantic Status Colors**:

```tsx
$success: $teal500; // Positive actions/states
$successLight: $teal100; // Light background
$successDark: $teal700; // Dark variant

$error: $red600; // Error states
$errorLight: $red100; // Error backgrounds
$errorDark: $red700; // Dark error

$warning: $butter500; // Warning states
$warningLight: $butter100;
$warningDark: $butter700;

$info: $blue500; // Informational states
$infoLight: $blue100;
$infoDark: $blue700;
```

**Neutral Colors (Gray scale)**:

```tsx
$gray50 to $gray900       // 10 shades for text, borders, backgrounds
```

**Text Colors (Semantic)**:

```tsx
$text: $charcoal; // Primary text (#1E1E1E - warm charcoal in light theme)
$textSecondary: #4A4A4A; // Secondary text
$textTertiary: $gray600; // Tertiary text
$textMuted: $gray500; // Muted/placeholder text
$textInverse: $white; // Text on dark backgrounds
```

**Background Colors**:

```tsx
$background: $cream; // Main app background (#FEFAD6 - Pure Butter cream)
$backgroundHover; // Hover state backgrounds
$backgroundPress; // Press state backgrounds
$backgroundFocus; // Focus state backgrounds
$surface: $white; // Surface/card backgrounds
$card: "#F6F7FB"; // Card-specific background
$cardHover; // Card hover state
```

**Border Colors**:

```tsx
$border: $gray300; // Default borders
$borderHover: $gray400; // Hover state borders
$borderFocus: $butter400; // Focus state borders (uses primary)
$borderPress: $butter500; // Press state borders
```

**Shadow Colors**:

```tsx
$shadowColor; // Default shadow
$shadowColorHover; // Hover state shadow
$shadowColorPress; // Press state shadow
$shadowColorFocus; // Focus state shadow (with primary tint)
```

#### Spacing Tokens

```tsx
$xs: 4px
$sm: 8px
$md: 16px
$lg: 24px
$xl: 32px
$2xl: 48px
$3xl: 64px
```

#### Size Tokens

```tsx
// Component-specific sizes
$buttonSm: 32px
$buttonMd: 40px
$buttonLg: 48px
$inputSm: 32px
$inputMd: 40px
$inputLg: 48px
$iconSm: 16px
$iconMd: 20px
$iconLg: 24px
$iconXl: 32px
```

#### Radius Tokens

```tsx
$xs: 3px      // was 2px - softer, more playful
$sm: 6px      // was 4px
$md: 10px     // was 8px
$lg: 14px     // was 12px
$xl: 18px     // was 16px
$2xl: 26px    // was 24px
$full: 9999px // Perfect circles
```

#### Z-Index Tokens

```tsx
$dropdown: 1000;
$sticky: 1020;
$fixed: 1030;
$modalBackdrop: 1040;
$modal: 1050;
$popover: 1060;
$tooltip: 1070;
```

### Theme System

**Light Theme** (default):

- Background: Cream (#FEFAD6) for warm, vintage feel
- Text: Warm charcoal (#1E1E1E) for readability
- Primary: Butter Orange (#E25F2F) for brand consistency
- All semantic colors optimized for light backgrounds

**Dark Theme**:

- Background: Navy (#020508) for modern contrast
- Text: Light gray (#f9fafb)
- Primary: Lighter butter (#FFE38A) for dark background contrast
- All semantic colors adjusted for dark backgrounds with proper contrast

**Sub-Themes for State Changes**:

Tamagui automatically looks for sub-themes matching the pattern `[currentTheme]_[subThemeName]`. We have the following sub-themes:

- `light_active` / `dark_active` - For active/selected states (menu items, tabs, etc.)
- `light_error` / `dark_error` - For error states
- `light_success` / `dark_success` - For success states
- `light_warning` / `dark_warning` - For warning states

**Theme Switching & State-Based Styling**:

```tsx
import { Theme } from "tamagui";

// ✅ CORRECT - Use Theme component for state-based styling
<Theme name={isActive ? "active" : null}>
  <Text>Menu Item</Text>  {/* Automatically gets active theme colors */}
</Theme>

// ✅ CORRECT - Static theme switching
<Theme name="dark">
  <View backgroundColor="$background">
    <Text color="$text">Automatically uses dark theme tokens</Text>
  </View>
</Theme>

// ❌ WRONG - Don't use conditional variant props (causes TypeScript errors)
<Text color={isActive ? "primary" : "default"}>Menu Item</Text>

// ❌ WRONG - Don't use conditional expressions with variants
const color: "primary" | "default" = isActive ? "primary" : "default"
<Text color={color}>Menu Item</Text>
```

**Key Learning**: When you need to change styling based on state (active, hover, selected, etc.), wrap the component in a `<Theme>` component instead of using conditional variant props. This is type-safe, performant, and the proper Tamagui pattern.

### Key Tamagui Concepts

#### Component Creation

```tsx
// Use styled() for optimized components
import { View, styled } from "tamagui";

export const Button = styled(View, {
  name: "Button", // Required for compiler optimization
  backgroundColor: "$background",
  pressStyle: {
    backgroundColor: "$backgroundPress",
  },
  variants: {
    size: {
      sm: { height: "$8", paddingHorizontal: "$3" },
      md: { height: "$10", paddingHorizontal: "$4" },
      lg: { height: "$12", paddingHorizontal: "$5" },
    },
  },
});
```

#### Theme Access

```tsx
import { useTheme } from "tamagui";

function MyComponent() {
  const theme = useTheme();
  return <View backgroundColor={theme.background.val} />;
}
```

#### Token Usage

- Prefix tokens with `$`: `fontSize="$lg"`, `padding="$4"`
- Tokens are defined in your Tamagui config
- Available token categories: `size`, `space`, `color`, `radius`, `zIndex`

### Tamagui Package Structure

The `@buttergolf/ui` package is source-first (no build step):

```json
{
  "main": "src/index.ts",
  "types": "src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  }
}
```

**Important**: Components must be re-exports from Tamagui packages:

```tsx
// packages/ui/src/components/Button.tsx
export { Button } from "@tamagui/button";
export type { ButtonProps } from "@tamagui/button";
```

## Platform-Specific Patterns

### Next.js (Web) Configuration

**Key Files**:

- `/apps/web/next.config.ts`
- `/apps/web/src/app/layout.tsx`

**Critical Next.js + Tamagui Setup**:

```typescript
// next.config.ts
const config: NextConfig = {
  transpilePackages: [
    "@buttergolf/ui",
    "react-native-web",
    "@tamagui/core",
    "tamagui",
  ],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "react-native$": "react-native-web",
    };
    return config;
  },
};
```

**Root Layout Pattern**:

```tsx
// apps/web/src/app/layout.tsx
import { TamaguiProvider } from "tamagui";
import { config } from "@buttergolf/config";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <TamaguiProvider config={config} defaultTheme="light">
          {children}
        </TamaguiProvider>
      </body>
    </html>
  );
}
```

### Expo (Mobile) Configuration

**Key Files**:

- `/apps/mobile/metro.config.js`
- `/apps/mobile/babel.config.js`
- `/apps/mobile/App.tsx`

**Metro Configuration**:
The Metro config is workspace-aware and watches the root:

```javascript
// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];
config.resolver.disableHierarchicalLookup = true;
```

**Babel Configuration**:

```javascript
// babel.config.js
module.exports = {
  presets: ["babel-preset-expo"],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./"],
        alias: {
          "@buttergolf/ui": "../../packages/ui/src",
        },
      },
    ],
    "tamagui/babel",
  ],
};
```

## Cross-Platform Component Patterns

### Import Pattern

```tsx
// Always import from @buttergolf/ui for cross-platform components
import { Button, Text } from "@buttergolf/ui";

function MyScreen() {
  return (
    <View>
      <Text>Hello World</Text>
      <Button onPress={() => console.log("pressed")}>Click me</Button>
    </View>
  );
}
```

### Tamagui Provider Usage

Both platforms require wrapping the app in `TamaguiProvider`:

```tsx
import { TamaguiProvider } from "tamagui";
import { config } from "@buttergolf/config";

function App() {
  return (
    <TamaguiProvider config={config} defaultTheme="light">
      {/* Your app */}
    </TamaguiProvider>
  );
}
```

### Media Queries (Cross-Platform)

```tsx
import { useMedia } from "tamagui";

function ResponsiveComponent() {
  const media = useMedia();

  return (
    <View
      width="100%"
      $gtMd={{ width: "50%" }} // Greater than medium breakpoint
    >
      {media.gtMd ? <DesktopView /> : <MobileView />}
    </View>
  );
}
```

### Theme Switching (Cross-Platform)

```tsx
import { Theme } from "tamagui";

function ThemedComponent() {
  return (
    <Theme name="dark">
      <View backgroundColor="$background">
        <Text color="$color">Dark theme content</Text>
      </View>
    </Theme>
  );
}
```

## Component Library Guidelines

### Production-Ready Component Library

We have **8 hardened component families** in `packages/ui` (~1,500 lines of production code):

1. **Button** - 6 tones (primary, secondary, outline, ghost, success, error), 3 sizes
2. **Typography** - Text, Heading (h1-h6), Label with full variants
3. **Layout** - Row, Column, Container, Spacer for flexible layouts
4. **Card** - 4 variants (elevated, outlined, filled, ghost) with compound components
5. **Input** - 3 sizes with validation states (error, success, disabled)
6. **Badge** - 8 variants for status indicators
7. **Spinner** - Loading indicators with size variants
8. **Image & ScrollView** - Enhanced re-exports with proper typing

### Critical Component Usage Patterns

#### ✅ **ALWAYS Use Semantic Tokens**

```tsx
// ✅ CORRECT - Use semantic tokens
<Button backgroundColor="$primary" color="$textInverse">
  Submit
</Button>

<Text color="$textMuted">Helper text</Text>

<View borderColor="$border" backgroundColor="$surface">
  Content
</View>

// ❌ WRONG - Never use numbered colors or raw hex
<Button backgroundColor="$butter500">Submit</Button>  // Too specific
<Button backgroundColor="#E25F2F">Submit</Button>    // No theming
<Text color="$color">Text</Text>                     // Old token name
<View borderColor="$borderColor">Content</View>      // Old token name
```

#### ✅ **ALWAYS Use Component Variants (When They Exist)**

```tsx
// ✅ CORRECT - Use built-in variants
<Button size="lg" tone="primary">Submit</Button>
<Text size="sm" weight="semibold">Helper text</Text>
<Card variant="elevated" padding="lg">Content</Card>
<Input size="md" error fullWidth />

// ❌ WRONG - Don't manually style with primitives
<Button paddingHorizontal="$5" height={48}>Submit</Button>
<Text fontSize="$3">Helper text</Text>
```

#### ✅ **ALWAYS Use Compound Components for Cards**

```tsx
// ✅ CORRECT - Use compound components
<Card variant="elevated">
  <Card.Header>
    <Heading level={3}>Title</Heading>
  </Card.Header>
  <Card.Body>
    <Text>Content</Text>
  </Card.Body>
  <Card.Footer align="right">
    <Button>Action</Button>
  </Card.Footer>
</Card>

// ❌ WRONG - Don't use old CardHeader/CardFooter imports
<Card>
  <CardHeader padding="$4">Title</CardHeader>
  <CardBody>Content</CardBody>
</Card>
```

#### ✅ **ALWAYS Use Layout Components**

```tsx
// ✅ CORRECT - Use semantic layout components with native Tamagui props
<Column gap="$lg">
  <Heading level={2}>Title</Heading>
  <Text>Description</Text>
  <Button>Action</Button>
</Column>

<Row gap="$md" alignItems="center" justifyContent="space-between">
  <Text>Left content</Text>
  <Button>Right action</Button>
</Row>

<Container size="lg" paddingHorizontal="$md">
  <Text>Constrained content</Text>
</Container>

// ❌ WRONG - Don't use raw YStack/XStack when semantic components exist
<YStack gap="$6" alignItems="stretch">
  <Text marginBottom="$4">Title</Text>
  <Text>Content</Text>
</YStack>
```

**Note**: Row and Column are thin wrappers over XStack/YStack - they preserve ALL native Tamagui props like `alignItems`, `justifyContent`, `flexWrap`, etc. Use these native props directly.

#### ✅ **Using Colors in Text Components**

```tsx
// ✅ CORRECT - Use direct token references
<Text color="$text">Default text</Text>
<Text color="$textSecondary">Secondary text</Text>
<Text color="$textTertiary">Tertiary text</Text>
<Text color="$textMuted">Muted text</Text>
<Text color="$textInverse">Inverse text (for dark backgrounds)</Text>
<Text color="$primary">Primary colored</Text>
<Text color="$success">Success message</Text>
<Text color="$error">Error message</Text>
<Text color="$warning">Warning message</Text>

// ❌ WRONG - Don't use old token names
<Text color="$color">Text</Text>           // Old token
<Text color="$color11">Text</Text>         // Numbered color
```

**Important**: The Text component does NOT have color variants. Use direct token references with the `$` prefix for all color styling.

### Understanding Variants vs Direct Token Props

**CRITICAL DISTINCTION:** Tamagui has two ways to use design tokens:

#### 1️⃣ **Custom Variants** (For NEW Component APIs Only)

Variants are **named options** defined in `styled()` components. They use **plain strings WITHOUT `$`** that map to tokens internally.

```tsx
// ✅ CORRECT - Using custom variants (NO $ prefix)
<Button size="lg">          // "lg" is a variant option
<Text color="muted">        // "muted" is a variant option (if it existed - it doesn't!)
<Card padding="lg">         // "lg" is a variant option

// Defined in styled() like this:
const Button = styled(View, {
  variants: {
    size: {
      lg: { height: '$10', paddingHorizontal: '$4' },
    }
  }
})
```

**⚠️ IMPORTANT:** Never create variants for props that **already exist on the base component** (like `gap`, `padding`, `margin`, `alignItems`, `justifyContent`). This causes TypeScript intersection type errors!

**When to use:** Component-specific props that have a fixed set of semantic options (button size/tone, card variant, input size).

#### 2️⃣ **Direct Token Props** (For Layout & Styling)

Direct props accept token values **WITH `$`** for ad-hoc styling on any Tamagui component. This is how Tamagui's built-in components work.

```tsx
// ✅ CORRECT - Using direct token props (WITH $ prefix)
<Row gap="$xl">                         // Use tokens directly - gap is native to XStack
<Column gap="$lg">                      // Use tokens directly - gap is native to YStack
<View padding="$md">                    // Direct token reference
<YStack gap="$4">                       // Direct token reference
<Text fontSize="$5" color="$textMuted"> // Direct token references
<View backgroundColor="$surface">       // Direct token reference
<View borderRadius="$lg">               // Direct token reference
```

**When to use:** Layout spacing (gap, padding, margin), geometric properties (width, height, borderRadius), colors, and any prop that exists natively on the base component.

### Real-World Examples

```tsx
// ✅ CORRECT - Mixed usage based on context

// Layout components use DIRECT TOKENS for native props
<Row gap="$md" alignItems="center">     // gap="$md" - direct token (native prop)
  <Column gap="$lg">                     // gap="$lg" - direct token (native prop)
    <Text color="$textMuted" size="sm">  // color - direct token, size - variant
      Helper text
    </Text>
  </Column>
</Row>

// Primitives use direct tokens (flexible, ad-hoc)
<View padding="$4" backgroundColor="$surface" borderRadius="$md">
  <YStack gap="$3">
    <Text fontSize="$4" color="$text">Direct token usage</Text>
  </YStack>
</View>

// Components use their defined variants
<Button size="lg" tone="primary">      // size/tone - variants
  Submit
</Button>

<Card variant="elevated" padding="lg">  // variant/padding - variants
  <Card.Body>
    <Text>Content</Text>
  </Card.Body>
</Card>
```

### Token Usage Cheat Sheet

```tsx
// ✅ CORRECT - Direct tokens (WITH $ prefix) for layout components
<Row gap="$xl">                   // Row/Column use DIRECT tokens (gap is native to XStack)
<Column gap="$lg">                // Don't use variants for native props!
<YStack gap="$4">                 // Direct prop on primitive
<View padding="$md">              // Direct prop on primitive
<Text fontSize="$5" color="$textMuted"> // Direct props (not using variants)
<View borderRadius="$lg">         // Direct geometric prop
<View backgroundColor="$surface"> // Direct color token

// ✅ CORRECT - Custom variants (NO $ prefix) for component-specific props
<Button size="lg">                // Button component variant
<Text size="md">                  // Text size variant (exists)
<Card padding="lg">               // Card padding variant (custom, not native padding)
<Container size="lg">             // Container size variant

// ❌ WRONG - Creating variants for native props
<Row gap="md">                    // ❌ gap exists natively, use gap="$md"
<Column gap="lg">                 // ❌ gap exists natively, use gap="$lg"

// ❌ WRONG - Mixing them up
<Button size="$lg">               // ❌ Don't use $ with variants
<Text color="muted">              // ❌ Text has NO color variants, use color="$textMuted"
<View padding="md">               // ❌ Missing $ for direct prop

// ❌ WRONG - Using specific/old tokens
<View backgroundColor="$butter500"> // ❌ Too specific, use semantic
<Text color="$color">             // ❌ Old token name
<View borderColor="$borderColor"> // ❌ Old token name
```

#### ⚠️ **Type Safety Workarounds**

Some Tamagui props have strict typing that doesn't accept our semantic tokens. Use type assertions when needed:

```tsx
// When you need to use semantic tokens that TypeScript doesn't accept
<Text {...{ color: "muted" as any }}>Muted text</Text>
<View {...{ backgroundColor: "$surface" as any }}>Content</View>

// Or use inline style objects
<Text style={{ color: "$textMuted" }}>Text</Text>
```

### Creating New Components

1. **Add to `packages/ui/src/components/`**:

```tsx
// packages/ui/src/components/MyComponent.tsx
import { styled, GetProps, View } from "tamagui";

export const MyComponent = styled(View, {
  name: "MyComponent", // Required for compiler optimization

  // Base styles using semantic tokens
  backgroundColor: "$surface",
  borderRadius: "$md",
  borderWidth: 1,
  borderColor: "$border",
  padding: "$md",

  // Interactive states
  hoverStyle: {
    borderColor: "$borderHover",
  },

  pressStyle: {
    backgroundColor: "$backgroundPress",
  },

  focusStyle: {
    borderColor: "$borderFocus",
    borderWidth: 2,
  },

  variants: {
    size: {
      sm: { padding: "$sm" },
      md: { padding: "$md" },
      lg: { padding: "$lg" },
    },

    tone: {
      primary: {
        borderColor: "$primary",
        backgroundColor: "$primaryLight",
      },
      error: {
        borderColor: "$error",
        backgroundColor: "$errorLight",
      },
    },
  } as const,

  defaultVariants: {
    size: "md",
  },
});

export type MyComponentProps = GetProps<typeof MyComponent>;
```

2. **Export from `packages/ui/src/index.ts`**:

```tsx
export { MyComponent } from "./components/MyComponent";
export type { MyComponentProps } from "./components/MyComponent";
```

3. **Document in `packages/ui/README.md`** with usage examples

### Component API Reference

#### Button

```tsx
<Button
  size="sm | md | lg" // Size variant (default: md)
  tone="primary | secondary | outline | ghost | success | error" // Style variant
  fullWidth={boolean} // Full width button
  disabled={boolean} // Disabled state
  loading={boolean} // Loading state
>
  Button Text
</Button>
```

#### Text

```tsx
<Text
  size="xs | sm | md | lg | xl" // Font size (default: md)
  weight="normal | medium | semibold | bold" // Font weight
  align="left | center | right" // Text alignment
  truncate={boolean} // Truncate with ellipsis
  color="$token" // Use direct token references (e.g., "$text", "$textSecondary", "$primary")
>
  Text content
</Text>
```

**Note**: Text does NOT have color variants. Always use direct token references like `color="$textMuted"` or `color="$primary"`.

#### Heading

```tsx
<Heading
  level={1 | 2 | 3 | 4 | 5 | 6} // Heading level (h1-h6)
  align="left | center | right" // Text alignment
  color="$token" // Use direct token references (e.g., "$text", "$primary")
>
  Heading text
</Heading>
```

**Note**: Heading does NOT have color variants. Use direct token references for colors.

#### Row (Horizontal Layout)

```tsx
<Row
  gap="$xs | $sm | $md | $lg | $xl" // Gap between children (use tokens)
  alignItems="flex-start | center | flex-end | stretch | baseline" // Vertical alignment
  justifyContent="flex-start | center | flex-end | space-between | space-around | space-evenly" // Horizontal alignment
  flexWrap="wrap | nowrap" // Allow wrapping
  width="100%" // Full width (or any other value)
>
  {children}
</Row>
```

**Note**: Row is a thin wrapper over XStack - use native React Native flexbox props, not custom variants.

#### Column (Vertical Layout)

```tsx
<Column
  gap="$xs | $sm | $md | $lg | $xl" // Gap between children (use tokens)
  alignItems="flex-start | center | flex-end | stretch" // Horizontal alignment
  justifyContent="flex-start | center | flex-end | space-between | space-around | space-evenly" // Vertical alignment
  width="100%" // Full width
  height="100%" // Full height
>
  {children}
</Column>
```

**Note**: Column is a thin wrapper over YStack - use native React Native flexbox props, not custom variants.

#### Card

```tsx
<Card
  variant="elevated | outlined | filled | ghost" // Card style (default: elevated)
  padding="none | xs | sm | md | lg | xl" // Padding (default: md)
  interactive={boolean} // Adds hover/press effects
  fullWidth={boolean} // Full width
>
  <Card.Header padding="md" noBorder={boolean}>
    Header content
  </Card.Header>

  <Card.Body padding="md">Main content</Card.Body>

  <Card.Footer padding="md" align="left | center | right" noBorder={boolean}>
    Footer content
  </Card.Footer>
</Card>
```

#### Input

```tsx
<Input
  size="sm | md | lg" // Size variant (default: md)
  error={boolean} // Error state
  success={boolean} // Success state
  disabled={boolean} // Disabled state
  fullWidth={boolean} // Full width
  placeholder="..." // Placeholder text
/>
```

#### Badge

```tsx
<Badge
  variant="primary | secondary | success | error | warning | info | neutral | outline"
  size="sm | md | lg" // Size variant (default: md)
  dot={boolean} // Minimal dot indicator
>
  Badge text
</Badge>
```

#### Container

```tsx
<Container
  size="sm | md | lg | xl | 2xl | full" // Max width (default: lg)
  padding="none | xs | sm | md | lg | xl" // Horizontal padding (default: md)
  center={boolean} // Center align content
>
  {children}
</Container>
```

### Compound Components Pattern

For complex components with sub-components:

```tsx
// packages/ui/src/components/Accordion.tsx
import { createStyledContext, styled, YStack } from "tamagui";

const AccordionContext = createStyledContext({
  size: "$md" as any,
});

export const AccordionFrame = styled(YStack, {
  context: AccordionContext,
});

export const AccordionItem = styled(YStack, {
  context: AccordionContext,
  // Uses context.size
});

// Main export
export const Accordion = AccordionFrame as typeof AccordionFrame & {
  Item: typeof AccordionItem;
};

Accordion.Item = AccordionItem;
```

## TypeScript Configuration

### Path Mappings

All path mappings are centralized in `/tsconfig.base.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@buttergolf/ui": ["packages/ui/src"],
      "@buttergolf/*": ["packages/*/src"]
    }
  }
}
```

Each app extends this base configuration.

### Type Checking

- Run `pnpm check-types` before committing
- Strict mode is enabled across the workspace
- No implicit any, unused locals, or unused parameters allowed

## Styling Conventions

### Tamagui Styling Patterns

1. **Inline Styles with Tokens**:

```tsx
<View
  backgroundColor="$blue10"
  padding="$4"
  borderRadius="$4"
  hoverStyle={{
    backgroundColor: "$blue11",
  }}
/>
```

2. **Media Queries**:

```tsx
<View
  width={200}
  $sm={{ width: 300 }} // Small screens
  $md={{ width: 400 }} // Medium screens
  $lg={{ width: 500 }} // Large screens
/>
```

3. **Pseudo States**:

```tsx
<Button
  backgroundColor="$blue10"
  hoverStyle={{ backgroundColor: "$blue11" }}
  pressStyle={{ backgroundColor: "$blue9" }}
  focusStyle={{ borderColor: "$blue8" }}
/>
```

4. **Group Styling**:

```tsx
<View group="card">
  <Text $group-card-hover={{ color: "$blue10" }}>
    Hover the parent to see me change
  </Text>
</View>
```

### Tailwind CSS (Web Only)

Used in Next.js for web-specific styling when Tamagui doesn't fit:

```tsx
<div className="container mx-auto px-4">{/* Tailwind classes */}</div>
```

## Build & Compilation

### Turborepo Configuration

Located at `/turbo.json`:

- Defines task pipelines
- Manages build outputs: `.next`, `.expo`
- Caches build artifacts
- Persistent tasks: `dev`, `start`

### Build Outputs

- **Web**: `.next/` (gitignored)
- **Mobile**: `.expo/` (gitignored)
- **Tamagui**: `.tamagui/` (gitignored) - generated component builds

### Performance Optimization

- Tamagui compiler extracts styles to CSS at build time
- Metro bundler configured for monorepo with workspace watching
- Next.js transpiles packages for web compatibility

## Common Workflows

### Adding a New Feature

1. Create cross-platform UI components in `packages/ui`
2. Use components in both `apps/web` and `apps/mobile`
3. Test on both platforms before committing
4. Run type checking: `pnpm check-types`

### Adding Dependencies

```bash
# Root workspace
pnpm add <package> -w

# Specific app or package
pnpm add <package> --filter @buttergolf/ui
pnpm add <package> --filter web
pnpm add <package> --filter mobile
```

### Updating Dependencies

```bash
# Update all Tamagui packages (keep versions aligned)
pnpm up '@tamagui/*@latest' -r

# Update all dependencies
pnpm up -r
```

## Debugging

### TypeScript Errors

- Check path mappings in `tsconfig.base.json`
- Ensure all `@buttergolf/*` packages are properly defined
- Verify peer dependencies are satisfied

### Module Resolution Issues

- Clear Metro bundler cache: `pnpm dev:mobile --clear`
- Clear Next.js cache: `rm -rf apps/web/.next`
- Reinstall dependencies: `pnpm clean-install`

### Tamagui Specific

- Verify Tamagui config is exported correctly from `tamagui.config.ts`
- Check that all apps have `TamaguiProvider` at the root
- Ensure `@tamagui/babel-plugin` is in babel config (mobile)
- Verify `transpilePackages` includes all Tamagui packages (web)

## Database (Prisma)

### Package: `@buttergolf/db`

The database package uses Prisma 6.x as the ORM with PostgreSQL.

**Key Files**:

- `packages/db/prisma/schema.prisma` - Database schema
- `packages/db/src/index.ts` - Prisma Client singleton export
- `packages/db/prisma/seed.ts` - Database seeding script
- `packages/db/.env` - Database connection string

**Schema Models** (example - customize for your app):

- `User` - User accounts
- `Round` - Golf rounds played
- `Hole` - Individual hole scores

### Using the Database in Apps

1. **Add to dependencies**:

```json
{
  "dependencies": {
    "@buttergolf/db": "workspace:*"
  }
}
```

2. **Import and use**:

```typescript
import { prisma } from "@buttergolf/db";

// Query data
const users = await prisma.user.findMany();

// Create data
const round = await prisma.round.create({
  data: {
    userId: user.id,
    courseName: "Pebble Beach",
    score: 72,
  },
});
```

### Database Workflow

1. **Modify schema**: Edit `packages/db/prisma/schema.prisma`
2. **Generate client**: `pnpm db:generate`
3. **Push to database**: `pnpm db:push` (dev) or `pnpm db:migrate:dev --name change-name` (with migration)
4. **Seed data**: `pnpm db:seed` (optional)

### Database Setup Options

**Local PostgreSQL with Docker**:

```bash
docker run --name buttergolf-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=buttergolf \
  -p 5432:5432 \
  -d postgres:16
```

**Prisma Postgres (Cloud)**:

```bash
pnpm --filter @buttergolf/db prisma-platform-login
pnpm --filter @buttergolf/db prisma-postgres-create-database --name buttergolf
```

**Other providers**: Supabase, Neon, Railway, etc. - just update `DATABASE_URL` in `.env`

### Important Notes

- The Prisma Client is generated to `node_modules/.prisma/client` (not committed)
- Always run `pnpm db:generate` after schema changes
- Use `pnpm db:studio` to view/edit data in a GUI
- The `.prisma` folder is in `.gitignore`
- Each app/package that uses the database imports the singleton client from `@buttergolf/db`

## Authentication (Clerk)

We use Clerk for user auth on both platforms. The web app uses `@clerk/nextjs`; the Expo app uses `@clerk/clerk-expo`. User records are synchronized to our database via a Clerk webhook and the `User` model includes a `clerkId` to map identities.

### Packages

- Web: `@clerk/nextjs`, `svix` (webhook signature verification)
- Mobile: `@clerk/clerk-expo`, `expo-auth-session`, `expo-secure-store`

### Environment variables

Place values in your shell or in environment files (see `.env.example` and `docs/AUTH_SETUP_CLERK.md`).

- Web (Next.js)
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - `CLERK_WEBHOOK_SECRET` (for the user sync webhook)
- Mobile (Expo)
  - `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`

Important: Only publishable keys may be exposed to the client (`NEXT_PUBLIC_*` / `EXPO_PUBLIC_*`). Keep secret keys server-only.

### Web wiring (Next.js App Router)

- Provider: `apps/web/src/app/NextTamaguiProvider.tsx`
  - Wraps the app in `<ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>` and then our Tamagui provider.
- Header: `apps/web/src/app/_components/AuthHeader.tsx`
  - Shows SignedOut `SignInButton` and SignedIn `UserButton`, plus simple navigation.
- Auth routes:
  - Sign-in: `apps/web/src/app/sign-in/[[...sign-in]]/page.tsx`
  - Sign-up: `apps/web/src/app/sign-up/[[...sign-up]]/page.tsx`
- Protecting routes (server components):
  - Example: `apps/web/src/app/rounds/page.tsx`
  - Use `const { userId } = await auth(); if (!userId) redirect('/sign-in')`
- SSG vs SSR with Clerk:
  - The root layout/page are marked `export const dynamic = 'force-dynamic'` to avoid needing the Clerk publishable key at build time. If you provide build-time env vars for Clerk, you can remove the flag on a page-by-page basis to re-enable SSG.

### Webhook (user sync to Prisma)

- Route: `apps/web/src/app/api/clerk/webhook/route.ts`
- Verifies Svix signature using `svix` lib and upserts users into Prisma:
  - `where: { clerkId }`
  - Sets `email`, `name`, `imageUrl`
- Events: `user.created`, `user.updated`
- Prisma schema has `User.clerkId @unique` (see `packages/db/prisma/schema.prisma`).

### Mobile wiring (Expo)

- Provider: `apps/mobile/App.tsx`
  - Wraps the app in `<ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY} tokenCache={SecureStore}>`
  - Uses `<SignedIn>` to render navigation and `<SignedOut>` to render a simple OAuth screen.
- OAuth sign-in (dev friendly):
  - Uses `useOAuth({ strategy: 'oauth_google' })` and, on iOS, `oauth_apple`.
  - Note: `useOAuth` is being deprecated upstream; the code is annotated and can be migrated later to the new API when convenient.
- Deep linking scheme:
  - `apps/mobile/app.json` includes `"scheme": "buttergolf"`.
  - With the Expo Auth Session proxy (default in dev), no extra dashboard redirect URL is required.

### Local development flow

1. Set env variables (see `.env.example` and `docs/AUTH_SETUP_CLERK.md`).
2. Start web: `pnpm dev:web` and visit `/sign-in` or use the header button.
3. Start mobile: `pnpm dev:mobile` and sign in with Google/Apple.
4. (Optional) Configure the Clerk webhook to `http://localhost:3000/api/clerk/webhook` with events `user.created` and `user.updated` to sync users into Prisma.

### Notes and patterns

- Use server checks with `auth()` and `redirect()` in App Router pages to protect content.
- Keep the DB source of truth synced by webhook; do not create new `PrismaClient` instances outside `@buttergolf/db`.
- If you hit build-time errors about "Missing publishableKey", either set the build-time env vars or mark the page/layout as `dynamic` as above.
- When adding new protected routes, follow the `rounds/page.tsx` pattern.

For a detailed setup, see `docs/AUTH_SETUP_CLERK.md`.

## Web Application Header Structure

### ButterHeader Component

The web application uses a unified butter-themed header with the Pure Butter brand identity.

**Location**: `apps/web/src/app/_components/header/ButterHeader.tsx`

**Key Features**:

- Single header bar with butter orange background (`$primary` - #E25F2F)
- Fixed positioning at top (below optional TrustBar)
- Height: ~80px (reduced from previous 180px three-layer header)
- Sticky with shadow effect on scroll
- Responsive with mobile-first design

**Layout Structure**:

```
┌─────────────────────────────────────────────────────────────┐
│ [Logo]  HOME  FEATURES  ABOUT  CONTACT    [Search 🔍]  [❤️][🛒][👤] │
└─────────────────────────────────────────────────────────────┘
```

**Components**:

1. **Logo** (Left):
   - Uses `logo-white.png` (50px height) on orange background
   - Links to homepage
   - Always visible

2. **Center Navigation** (Desktop only, hidden on mobile):
   - HOME | FEATURES | ABOUT US | CONTACT US
   - Gotham Medium, 14px
   - White text with underline on hover
   - Hidden below `$lg` breakpoint

3. **Search Bar** (Right side):
   - Desktop: Semi-transparent white pill shape (250px width)
   - Mobile: Search icon only (expands to full bar in mobile menu)
   - Background: `rgba(255, 255, 255, 0.2)` with backdrop blur
   - Hover: Increases opacity to 0.3

4. **Action Icons** (Far right):
   - User icon (or UserButton when signed in)
   - Wishlist (heart icon with badge count)
   - Cart (cart icon with badge count)
   - Mobile menu toggle (hamburger, hidden on desktop)
   - All icons: 24px, white color, 44x44px touch targets
   - Hover opacity: 0.8

5. **Mobile Menu Overlay**:
   - Full-screen overlay with butter orange background
   - Large navigation links (XL size, bold)
   - Search bar at bottom
   - Closes on link click or close button

### TrustBar Component

**Location**: `apps/web/src/app/_components/marketplace/TrustBar.tsx`

**Features**:

- Cream background (`$background` - #FEFAD6)
- Fixed at top (40px height)
- Dismissible with close button (X icon on right)
- Contains promotional message: "Give 10%, Get 10%. Refer a friend."
- Uses local state to hide when dismissed
- Z-index: 100 (above header)

**Layout in Root**:

```tsx
// apps/web/src/app/layout.tsx
<body>
  <NextTamaguiProvider>
    <ServiceWorkerRegistration />
    <TrustBar /> {/* Top: 0px, 40px tall */}
    <ButterHeader /> {/* Top: 40px, 80px tall */}
    <AppPromoBanner /> {/* Below header */}
    {children}
  </NextTamaguiProvider>
</body>
```

**Total Header Stack Height**:

- With TrustBar: 40px (trust) + 80px (header) = 120px
- Without TrustBar (dismissed): 80px (header only)

### Header Best Practices

1. **Color Usage**:
   - Always use `$primary` for header background (butter orange)
   - Always use `$textInverse` for text/icons on orange background
   - Badge counts use `$navy500` background for contrast

2. **Navigation Links**:
   - Use Next.js `Link` component for client-side navigation
   - Add `onClick` handlers to close mobile menu when navigating
   - Use uppercase text for navigation items (brand consistency)

3. **Responsive Behavior**:
   - Desktop (`$lg`+): Show center nav, inline search, all icons
   - Tablet (`$md` - `$lg`): Hide center nav, show hamburger menu
   - Mobile (`< $md`): Search icon only, hamburger menu with full overlay

4. **Sticky Behavior**:
   - Tracks scroll position with `useState` and `useEffect`
   - Adds shadow when scrolled (`stickyMenu` state)
   - Shadow: `rgba(0,0,0,0.12)` with 6px radius

5. **Authentication Integration**:
   - Uses Clerk's `<SignedIn>` and `<SignedOut>` components
   - Shows UserButton when authenticated
   - Shows user icon with sign-in modal when not authenticated
   - UserButton has white filter applied for visibility on orange background

### Migration Notes

**Old Header** (`MarketplaceHeader.tsx`):

- Three-layer structure (TrustBar + Main Header + Nav Bar)
- Total height: 180px
- Green theme (#13a063)
- Search on left side
- Complex desktop menu with categories

**New Header** (`ButterHeader.tsx`):

- Single unified layer
- Total height: 80px (with optional 40px TrustBar)
- Butter orange theme (#E25F2F)
- Search on right side
- Simplified navigation
- Mobile-first with full-screen overlay

**Breaking Changes**:

- Page layouts expecting 180px margin-top should be updated to 120px (or 80px if TrustBar dismissed)
- Desktop category menu moved to dedicated CategoryGrid component (see homepage refactor)
- Logo now requires white version (`logo-white.png`) instead of orange

## Payments (Stripe)

We use Stripe for payment processing and marketplace functionality (Stripe Connect). The web app handles all payment operations server-side, while the mobile app uses native Stripe SDK for optimal UX.

### Packages

- **Web**: `stripe` (Node.js SDK), `@stripe/stripe-js` (client-side), `@stripe/react-stripe-js` (React components)
- **Mobile**: `@stripe/stripe-react-native` (native iOS/Android SDK)
- **Webhook verification**: Built into `stripe` package

### Architecture

```
┌─────────────────┐
│   Mobile App    │ ──→ Native Stripe SDK (@stripe/stripe-react-native)
│   (React Native)│     └─→ API calls to Next.js backend
└─────────────────┘

┌─────────────────┐
│   Web App       │ ──→ Stripe.js (@stripe/stripe-js)
│   (Next.js)     │     └─→ Server-side Stripe API (stripe)
└─────────────────┘
         │
         ↓
┌─────────────────┐
│ Stripe Connect  │ ──→ Marketplace seller onboarding
│ (Platform)      │     └─→ Automated payouts to sellers
└─────────────────┘
```

### Environment Variables

Place values in `apps/web/.env.local` (see `.env.example`):

```bash
# Stripe Payment Processing
STRIPE_SECRET_KEY=sk_test_...              # Server-side API key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Client-side key
STRIPE_WEBHOOK_SECRET=whsec_...            # Webhook signature verification
```

**Important**:

- Use **test keys** (sk*test*/pk*test*) for development
- Use **live keys** (sk*live*/pk*live*) for production
- Never expose secret keys to clients (only `NEXT_PUBLIC_*` variables)

### Setup Steps

1. **Create Stripe Account**:
   - Create a new Account (not Organization) in Stripe Dashboard
   - Name it "ButterGolf"

2. **Get API Keys**:
   - Navigate to: Developers → API keys
   - Ensure **Test mode** is enabled (toggle at top)
   - Copy both keys to `.env.local`

3. **Enable Stripe Connect**:
   - Go to: Settings → Connect settings
   - Choose: **Platform or marketplace**
   - This enables seller onboarding and automated payouts

4. **Set Up Webhooks**:
   - Go to: Developers → Webhooks
   - Add endpoint: `http://localhost:3000/api/stripe/webhook` (dev) or `https://yourdomain.com/api/stripe/webhook` (prod)
   - Select events:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `account.updated` (Connect)
     - `account.application.authorized` (Connect)
     - `account.application.deauthorized` (Connect)
   - Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### Web Implementation Pattern

**Server-side (API Routes)**:

```typescript
// apps/web/src/lib/stripe.ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

// Use this singleton for all server-side Stripe operations
```

**Client-side (React Components)**:

```tsx
// apps/web/src/app/checkout/page.tsx
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
```

### Mobile Implementation Pattern

**IMPORTANT**: Always use the native React Native SDK on mobile for optimal UX and Apple Pay/Google Pay support.

```tsx
// apps/mobile/App.tsx or payment component
import { StripeProvider } from "@stripe/stripe-react-native";

export default function App() {
  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
    >
      {/* Your app components */}
    </StripeProvider>
  );
}

// Payment screen
import { useStripe } from "@stripe/stripe-react-native";

function PaymentScreen() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  // Fetch payment intent from your API
  // Initialize and present native payment sheet
}
```

### Stripe Connect (Seller Onboarding)

For marketplace functionality (sellers receiving payouts):

```typescript
// Create Connect account
const account = await stripe.accounts.create({
  type: "express",
  country: "US",
  email: sellerEmail,
  capabilities: {
    card_payments: { requested: true },
    transfers: { requested: true },
  },
});

// Generate onboarding link
const accountLink = await stripe.accountLinks.create({
  account: account.id,
  refresh_url: `${baseUrl}/seller/onboarding/refresh`,
  return_url: `${baseUrl}/seller/onboarding/complete`,
  type: "account_onboarding",
});

// Redirect seller to accountLink.url for embedded onboarding
```

### Best Practices

1. **Server-side validation**: Never trust client data - always verify payments server-side
2. **Webhook handling**: Always verify webhook signatures using `STRIPE_WEBHOOK_SECRET`
3. **Idempotency**: Use idempotency keys for payment operations to prevent duplicates
4. **Error handling**: Catch and handle Stripe errors gracefully (card declined, etc.)
5. **Native SDK on mobile**: Always use `@stripe/stripe-react-native` - don't use web views for payments
6. **Test mode first**: Complete full payment flow in test mode before going live
7. **Connect Express accounts**: Use Express for sellers (simplest onboarding, Stripe handles compliance)

### Common Workflows

**Checkout Flow**:

1. User adds products to cart
2. Backend creates Stripe Checkout Session (or Payment Intent)
3. Frontend receives client secret
4. Mobile: Present native payment sheet / Web: Redirect to Stripe Checkout
5. User completes payment
6. Webhook confirms payment → Update order status in DB

**Seller Onboarding**:

1. User clicks "Become a Seller"
2. Backend creates Stripe Connect account
3. Backend generates onboarding link
4. User completes onboarding (embedded in app or redirect)
5. Webhook confirms account activated → Enable seller features

**Marketplace Payouts**:

- Stripe automatically handles payouts to connected accounts
- Platform fee: Deduct before transfer or use application_fee
- Schedule: Configure in Connect settings (daily, weekly, monthly)

### Testing

Use Stripe test cards:

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

Full list: https://stripe.com/docs/testing

### Production Checklist

- [ ] Switch to live API keys in production environment
- [ ] Update webhook endpoint to production URL
- [ ] Test complete checkout flow with real cards (small amounts)
- [ ] Verify Connect onboarding works end-to-end
- [ ] Monitor webhook delivery in Stripe Dashboard
- [ ] Set up payout schedule for sellers
- [ ] Review and accept terms for going live

For detailed Stripe documentation: https://stripe.com/docs

## Documentation References

- **Tamagui Full Documentation**: https://tamagui.dev/llms-full.txt
- **Tamagui Core Concepts**: https://tamagui.dev/docs/intro/introduction
- **Prisma Documentation**: https://www.prisma.io/docs
- **Expo Documentation**: https://docs.expo.dev/
- **Next.js Documentation**: https://nextjs.org/docs
- **Turborepo Documentation**: https://turbo.build/repo/docs

## Context7 MCP Server (Up-to-Date Library Documentation)

**CRITICAL: Always use Context7 for library documentation, code generation, setup steps, and API references.**

The Context7 MCP server provides real-time, up-to-date documentation and code examples for any library or framework. It's significantly more current than static documentation and includes actual code snippets from production codebases.

### When to Use Context7

**ALWAYS use Context7 automatically when:**

1. **Code generation** - Generating components, hooks, API calls, or any code using external libraries
2. **Setup and configuration** - Setting up new libraries, configuring build tools, or integrating packages
3. **Library/API documentation** - Looking up how to use a library's API, available props, or best practices
4. **Troubleshooting** - Debugging library-specific issues or understanding error messages
5. **Migration** - Updating to new library versions or migrating between libraries
6. **Examples** - Finding real-world code examples and usage patterns

**Do NOT wait for the user to explicitly ask** - proactively use Context7 whenever you need library information.

### Usage Pattern

**Step 1: Resolve Library ID**

Always start by resolving the library name to get the Context7-compatible library ID:

```typescript
// Use mcp_upstash_conte_resolve-library-id
libraryName: "react-router" // or "@stripe/stripe-react-native", "tamagui", etc.
```

**Step 2: Get Library Documentation**

Once you have the library ID, fetch focused documentation:

```typescript
// Use mcp_upstash_conte_get-library-docs
context7CompatibleLibraryID: "/remix-run/react-router" // from step 1
tokens: 3000 // Adjust based on need (default: 5000)
topic: "hooks" // Optional: focus on specific area like "routing", "authentication", etc.
```

### Selection Guidelines

When `resolve-library-id` returns multiple matches:

1. **Prioritize official documentation** (Trust Score 9-10)
2. **Choose based on version** - Use versioned ID if user specifies version (e.g., `/org/project/v5.2.1`)
3. **Prefer higher Code Snippet counts** - More examples = better documentation
4. **Match description to intent** - Read descriptions to find the most relevant match

### Real-World Examples

#### Example 1: Implementing Stripe Payment

```typescript
// ✅ CORRECT - Use Context7 automatically
// Step 1: Resolve Stripe library
await mcp_upstash_conte_resolve-library-id({ libraryName: "@stripe/stripe-react-native" })
// Step 2: Get payment integration docs
await mcp_upstash_conte_get-library-docs({
  context7CompatibleLibraryID: "/stripe/stripe-react-native",
  tokens: 3000,
  topic: "payment sheet"
})
// Step 3: Generate code using the examples from Context7

// ❌ WRONG - Don't rely on static knowledge or outdated documentation
// Generating code without checking current API patterns
```

#### Example 2: Adding Navigation

```typescript
// ✅ CORRECT - Check latest React Router patterns
await mcp_upstash_conte_resolve-library-id({ libraryName: "react-router" })
await mcp_upstash_conte_get-library-docs({
  context7CompatibleLibraryID: "/remix-run/react-router",
  tokens: 2000,
  topic: "navigation hooks"
})

// ❌ WRONG - Using potentially outdated patterns from training data
```

#### Example 3: Tamagui Component Setup

```typescript
// ✅ CORRECT - Get current Tamagui best practices
await mcp_upstash_conte_resolve-library-id({ libraryName: "tamagui" })
await mcp_upstash_conte_get-library-docs({
  context7CompatibleLibraryID: "/tamagui/tamagui",
  tokens: 2000,
  topic: "styled components"
})
```

### Integration with Existing Workflow

**Before writing code that uses external libraries:**

1. Use Context7 to get current documentation
2. Review code examples and API patterns
3. Generate code following the examples
4. Reference Context7 output in code comments if helpful

**When user asks about libraries:**

- Don't just answer from static knowledge
- Fetch Context7 docs first
- Provide answer based on current documentation
- Include relevant code examples from Context7

### Benefits

- **Up-to-date**: Docs reflect latest library versions and best practices
- **Real examples**: Code snippets from production codebases, not just docs
- **Comprehensive**: Covers edge cases and common pitfalls
- **Accurate**: Based on actual library implementations, not LLM training data
- **Efficient**: Targeted documentation (use `topic` parameter) reduces token usage

### Remember

**Context7 is not optional** - it's a critical tool for ensuring code quality and accuracy. Always use it proactively when working with external libraries, frameworks, or APIs. Don't wait to be asked - make it part of your standard workflow.

## Best Practices

### Design System & Components

1. **ALWAYS use semantic tokens** - Use `$primary`, `$text`, `$border` instead of `$butter500`, `$color`, `$borderColor`
2. **ALWAYS use component variants** - Use `<Button size="lg" tone="primary">` instead of manual styling
3. **ALWAYS use Text color variants** - Use `<Text color="muted">` instead of `<Text color="$textMuted">`
4. **ALWAYS use compound components for Cards** - Use `<Card.Header>` instead of `<CardHeader>`
5. **ALWAYS use layout components** - Use `<Row>`, `<Column>`, `<Container>` instead of raw `<XStack>`/`<YStack>`
6. **NEVER use numbered colors** - Don't use `$color9`, `$color11`, `$blue10`, etc.
7. **NEVER use old token names** - Don't use `$borderColor`, `$textDark`, `$bg`, etc.
8. **NEVER mix Tamagui and Tailwind** - Keep Tamagui for components, Tailwind for page layouts only

### Understanding Variants vs Direct Token Props

**CRITICAL DISTINCTION:** Tamagui has two ways to use design tokens:

#### 1️⃣ **Custom Variants** (For NEW Component APIs Only)

Variants are **named options** defined in `styled()` components. They use **plain strings WITHOUT `$`** that map to tokens internally.

```tsx
// ✅ CORRECT - Using custom variants (NO $ prefix)
<Button size="lg">          // "lg" is a variant option
<Text color="muted">        // "muted" is a variant option
<Card padding="lg">         // "lg" is a variant option

// Defined in styled() like this:
const Button = styled(View, {
  variants: {
    size: {
      lg: { height: '$10', paddingHorizontal: '$4' },
    }
  }
})
```

**⚠️ IMPORTANT:** Never create variants for props that **already exist on the base component** (like `gap`, `padding`, `margin`). This causes TypeScript intersection type errors!

**When to use:** Component-specific props that have a fixed set of semantic options (button size/tone, card variant, text color schemes).

#### 2️⃣ **Direct Token Props** (For Layout & Styling)

Direct props accept token values **WITH `$`** for ad-hoc styling on any Tamagui component. This is how Tamagui's built-in components work.

```tsx
// ✅ CORRECT - Using direct token props (WITH $ prefix)
<Row gap="$xl">                         // Use tokens directly - gap is native to XStack
<Column gap="$lg">                      // Use tokens directly - gap is native to YStack
<View padding="$md">                    // Direct token reference
<YStack gap="$4">                       // Direct token reference
<Text fontSize="$5">                    // Direct token reference
<View backgroundColor="$surface">       // Direct token reference
<View borderRadius="$lg">               // Direct token reference
```

**When to use:** Layout spacing (gap, padding, margin), geometric properties (width, height, borderRadius), and any prop that exists natively on the base component.

### When to Use Which Pattern

#### ✅ Use Custom Variants For:

1. **Component identity** - Button size/tone, Input size, Card variant
2. **Semantic options** - Text colors (muted, secondary)
3. **Design system boundaries** - Enforcing approved sizes/colors
4. **Component-specific props** - Container maxWidth, Card padding
5. **Better DX** - Autocomplete, type safety, prevents one-offs

#### ✅ Use Direct Tokens For:

1. **Layout spacing** - padding, margin on containers
2. **Geometric props** - borderRadius, borderWidth, width, height
3. **One-off containers** - Temporary View/YStack wrappers
4. **Advanced layouts** - Complex positioning, absolute positioning
5. **Prototyping** - Quick iteration before creating variants

### Real-World Examples

```tsx
// ✅ CORRECT - Mixed usage based on context

// Layout components use DIRECT TOKENS for native props
<Row gap="$md" align="center">          // gap="$md" - direct token (native prop)
  <Column gap="$lg">                     // gap="$lg" - direct token (native prop)
    <Text color="muted" size="sm">       // color="muted" - variant (component-specific)
      Helper text
    </Text>
  </Column>
</Row>

// Primitives use direct tokens (flexible, ad-hoc)
<View padding="$4" backgroundColor="$surface" borderRadius="$md">
  <YStack gap="$3">
    <Text fontSize="$4">Direct token usage</Text>
  </YStack>
</View>

// Components use their defined variants
<Button size="lg" tone="primary">      // size/tone - variants
  Submit
</Button>

<Card variant="elevated" padding="lg">  // variant/padding - variants
  <Card.Body>
    <Text>Content</Text>
  </Card.Body>
</Card>
```

### Token Usage Cheat Sheet

```tsx
// ✅ CORRECT - Direct tokens (WITH $ prefix) for layout components
<Row gap="$xl">                   // Row/Column use DIRECT tokens (gap is native to XStack)
<Column gap="$lg">                // Don't use variants for native props!
<YStack gap="$4">                 // Direct prop on primitive
<View padding="$md">              // Direct prop on primitive
<Text fontSize="$5">              // Direct prop (not using size variant)
<View borderRadius="$lg">         // Direct geometric prop
<View backgroundColor="$surface"> // Direct color token

// ✅ CORRECT - Custom variants (NO $ prefix) for component-specific props
<Button size="lg">                // Button component variant
<Text color="muted">              // Text component variant
<Card padding="lg">               // Card component variant (custom, not native padding)
<Container size="lg">             // Container component variant

// ❌ WRONG - Creating variants for native props
<Row gap="md">                    // ❌ gap exists natively, use gap="$md"
<Column gap="lg">                 // ❌ gap exists natively, use gap="$lg"

// ❌ WRONG - Mixing them up
<Button size="$lg">               // ❌ Don't use $ with variants
<Text color="$textMuted">         // ❌ Use variant name "muted"
<View padding="md">               // ❌ Missing $ for direct prop

// ❌ WRONG - Using specific/old tokens
<View backgroundColor="$butter500"> // ❌ Too specific, use semantic
<Text color="$color">             // ❌ Old token name
<View borderColor="$borderColor"> // ❌ Old token name
```

### Component Usage Cheat Sheet

```tsx
// ✅ CORRECT Component Usage
<Button size="lg" tone="primary">Submit</Button>
<Text color="muted" size="sm">Helper text</Text>
<Card variant="elevated" padding="lg">
  <Card.Header><Heading level={3}>Title</Heading></Card.Header>
  <Card.Body><Text>Content</Text></Card.Body>
</Card>
<Row gap="$md" align="center">
  <Text>Label</Text>
  <Spacer flex />
  <Button>Action</Button>
</Row>

// ❌ WRONG Component Usage
<Button paddingHorizontal="$5" backgroundColor="$butter500">Submit</Button>
<Text fontSize="$3" color="$gray500">Helper text</Text>
<Row gap="md">Wrong - use gap="$md"</Row>
<Card elevate size="$4" bordered>
  <CardHeader padding="$3">Title</CardHeader>
</Card>
<XStack gap="$4" alignItems="center">
  <Text>Label</Text>
  <View flex={1} />
  <Button>Action</Button>
</XStack>
```

### Component Design Decision Matrix

Use this matrix when creating or updating components:

| Property Type              | Use Variant                      | Use Direct Token           | Example                                            |
| -------------------------- | -------------------------------- | -------------------------- | -------------------------------------------------- |
| **Spacing (gap, padding)** | ❌ DON'T (native props)          | ✅ Always use tokens       | `<Row gap="$md">` (gap is native to XStack)        |
| **Sizing (width, height)** | ✅ For semantic sizes (sm/md/lg) | ⚠️ For specific dimensions | `<Button size="lg">` vs `<View width={200}>`       |
| **Colors**                 | ✅ For semantic colors           | ❌ Never use direct        | `<Text color="muted">` not `color="$gray500"`      |
| **Typography (fontSize)**  | ✅ For component variants        | ⚠️ For direct styling      | `<Text size="sm">` vs `<Text fontSize="$3">`       |
| **Border radius**          | ⚠️ Rare (use defaults)           | ✅ For geometric control   | Usually inherit, or `borderRadius="$md"`           |
| **Alignment**              | ✅ Always use variants           | ❌ Never direct            | `<Row align="center">` never `alignItems="center"` |
| **Component state**        | ✅ Always (tone, variant)        | ❌ Never                   | `<Button tone="primary">` never manual colors      |

**Legend:**

- ✅ Preferred approach
- ⚠️ Use case dependent
- ❌ Avoid/Never

### Variant Design Guidelines

When creating a new component, add variants for:

1. **Must Have:**
   - `size` - If component has sizing (sm, md, lg)
   - `variant` or `tone` - Visual style variations
2. **Should Have:**
   - Component-specific semantics (e.g., `align` for Row, `level` for Heading)
   - Common states (active, disabled) if not in base component
3. **Nice to Have:**
   - `fullWidth` / `fullHeight` - If commonly needed
   - Spacing variants if component commonly wraps content

4. **Don't Variant:**
   - One-off values (use direct props)
   - Geometric properties (width, height numbers)
   - Complex positioning (absolute, z-index)

### General Best Practices

9. **Always use Tamagui components** from `@buttergolf/ui` for cross-platform consistency
10. **Keep React versions aligned** across web and mobile (currently 19.2.0)
11. **Use workspace protocol** for internal dependencies: `"workspace:*"`
12. **Export types** alongside components for better DX
13. **Test on both platforms** before considering features complete
14. **Leverage media queries** for responsive design instead of platform checks
15. **Keep Metro and Babel configs** in sync with Tamagui requirements
16. **Run type checking** regularly during development
17. **Use `name` prop** on styled components for better compiler optimization
18. **Use Prisma Client singleton** from `@buttergolf/db` - never create new instances
19. **Run `pnpm db:generate`** after any schema changes
20. **Use migrations** (`db:migrate:dev`) for production-bound changes, `db:push` for quick dev iteration
21. **Define variants for common patterns** - If you're writing the same props 3+ times, make it a variant
22. **Use direct tokens for one-offs** - Don't create variants for rarely-used combinations
23. **NEVER use inline `style` prop with Tamagui components** - It bypasses the optimizing compiler and causes text rendering/hydration issues. Always use Tamagui's native props instead (e.g., `whiteSpace="pre-wrap"` not `style={{ whiteSpace: "pre-wrap" }}`)
24. **NEVER override lineHeight on Tamagui Text/Heading base styles** - Each size variant should define its own lineHeight. Setting a base lineHeight causes text overlap. Let size variants control lineHeight (e.g., `fontSize: "$10", lineHeight: "$10"`)

## Known Issues & Gotchas

1. **TypeScript Errors in UI Package**: Some Tamagui component re-exports may show TypeScript errors about missing module exports, but runtime typically works fine
2. **React Version Alignment**: Keep React at 19.2.0 across all packages to avoid peer dependency conflicts
3. **Metro Cache**: Clear Metro cache frequently when making config changes
4. **Path Aliases**: Always use TypeScript path mappings instead of relative imports for cross-package references
5. **Tamagui Build Folder**: The `.tamagui` directory is auto-generated - add to `.gitignore`

## Code Generation Hints

When generating new code:

- **USE CONTEXT7 FIRST** - Before generating code with external libraries, use Context7 MCP to get current documentation
- Default to Tamagui components over React Native primitives
- Use `styled()` for component definitions
- Include `name` property for compiler optimization
- Export both component and type
- Use semantic tokens ($ prefix) - NEVER use numbered colors
- ALWAYS use component variants instead of manual styling
- ALWAYS use Text color variants (color="muted" not color="$textMuted")
- ALWAYS use compound components for Cards
- ALWAYS use layout components (Row, Column, Container)
- Include responsive variants with media queries
- Add hover/press/focus styles where appropriate
- Follow compound component pattern for complex UIs
- Always wrap in TamaguiProvider when creating new entry points

## Common UI Patterns

### Form with Validation

```tsx
<Column gap="$lg" fullWidth>
  <Column gap="$xs">
    <Row gap="$xs">
      <Label htmlFor="email">Email</Label>
      <Text color="error">*</Text>
    </Row>
    <Input id="email" type="email" size="md" error={!!emailError} fullWidth />
    {emailError && (
      <Text size="sm" color="error">
        {emailError}
      </Text>
    )}
  </Column>

  <Button size="lg" tone="primary" fullWidth>
    Submit
  </Button>
</Column>
```

### Product Card

```tsx
<Card variant="elevated" padding="none" fullWidth>
  <Card.Header padding="none" noBorder>
    <Image
      source={{ uri: product.imageUrl }}
      width="100%"
      height={200}
      borderTopLeftRadius="$lg"
      borderTopRightRadius="$lg"
    />
  </Card.Header>

  <Card.Body padding="lg">
    <Column gap="$sm">
      <Heading level={4}>{product.name}</Heading>
      <Text color="secondary">{product.category}</Text>
      <Row align="center" justify="between">
        <Text size="xl" weight="bold">
          ${product.price}
        </Text>
        <Badge variant="success">In Stock</Badge>
      </Row>
    </Column>
  </Card.Body>

  <Card.Footer align="right">
    <Button tone="outline" size="md">
      Add to Cart
    </Button>
  </Card.Footer>
</Card>
```

### Dashboard Stats

```tsx
<Row gap="$lg" wrap>
  <Card variant="filled" padding="lg" flex={1}>
    <Column gap="$sm">
      <Row align="center" gap="$sm">
        <Badge variant="success" dot />
        <Text color="secondary">Active Users</Text>
      </Row>
      <Heading level={2}>1,234</Heading>
      <Text size="sm" color="success">
        +12% from last month
      </Text>
    </Column>
  </Card>

  <Card variant="filled" padding="lg" flex={1}>
    <Column gap="$sm">
      <Row align="center" gap="$sm">
        <Badge variant="info" dot />
        <Text color="secondary">Revenue</Text>
      </Row>
      <Heading level={2}>$45.2K</Heading>
      <Text size="sm" color="info">
        +8% from last month
      </Text>
    </Column>
  </Card>
</Row>
```

### Loading State

```tsx
<Card variant="elevated" padding="lg">
  <Column gap="$md" align="center">
    <Spinner size="lg" color="$primary" />
    <Text color="secondary">Loading content...</Text>
  </Column>
</Card>
```

### Alert/Notification

```tsx
<Card variant="outlined" padding="md">
  <Row gap="$md" align="start">
    <Badge variant="error" size="sm" />
    <Column gap="$xs" flex={1}>
      <Text weight="semibold">Error</Text>
      <Text color="secondary">Something went wrong. Please try again.</Text>
    </Column>
    <Button tone="ghost" size="sm">
      Dismiss
    </Button>
  </Row>
</Card>
```

### Responsive Layout

```tsx
<Container size="lg">
  <Column
    gap="$md"
    $gtMd={{ gap: "$lg" }} // Larger gap on desktop
  >
    <Row
      flexDirection="column"
      $gtSm={{ flexDirection: "row" }} // Horizontal on tablet+
      gap="$md"
    >
      <Column flex={1}>Content 1</Column>
      <Column flex={1}>Content 2</Column>
    </Row>
  </Column>
</Container>
```

## SEO Foundations (Next.js Web)

### Sitemap & robots.txt

The web app uses `next-sitemap` to automatically generate XML sitemaps and robots.txt files:

- **Configuration**: `apps/web/next-sitemap.config.js`
- **Generation**: Automatically runs after build via `postbuild` script
- **Environment**: Set `SITE_URL` environment variable for production URLs
- **Exclusions**: API routes, auth pages, and error pages are excluded

**When to Update:**

- Adding new public routes → Ensure they're not in the exclude list
- Adding admin/draft routes → Add to exclude list
- Changing route structure → Update transform function priorities

**Validation:**

- After build, check `apps/web/public/sitemap.xml` exists
- Verify `apps/web/public/robots.txt` references the sitemap
- Submit sitemap to Google Search Console in production

### Structured Data (JSON-LD)

Structured data enables rich search results and helps search engines understand content:

- **Helper Component**: `apps/web/src/components/seo/SeoJsonLd.tsx`
- **Usage**: Import and add to any page component

**Available Schema Types:**

- **Home/Organization**: `Organization` + `WebSite` (with SearchAction)
- **Product Pages**: `Product` with offers, brand, availability
- **Blog/Articles**: `BlogPosting` or `Article` (when implemented)

**Example Usage:**

```tsx
import { SeoJsonLd } from "@/components/seo";

export default function MyPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Product Name",
    description: "Product description",
    // ... more fields
  };

  return (
    <>
      <YourPageContent />
      <SeoJsonLd data={schema} />
    </>
  );
}
```

**Best Practices:**

- Use absolute HTTPS URLs for images and links
- Populate from source of truth (database, CMS, props)
- Include all required fields for the schema type
- Test with [Google Rich Results Test](https://search.google.com/test/rich-results)

### Mobile App Deep Linking

Universal Links (iOS) and App Links (Android) configuration:

**Web Side:**

- `.well-known/apple-app-site-association` - iOS configuration
- `.well-known/assetlinks.json` - Android configuration
- Both files located in `apps/web/public/.well-known/`

**Mobile Side:**

- iOS: `bundleIdentifier` and `associatedDomains` in `apps/mobile/app.json`
- Android: `package` and `intentFilters` in `apps/mobile/app.json`

**Setup Requirements:**

1. Update Team ID in `apple-app-site-association`
2. Update package names to match your app
3. Add SHA256 fingerprint to `assetlinks.json` (from Android keystore)
4. Ensure files are accessible at `https://yourdomain.com/.well-known/*`

**Testing:**

- iOS: Tap a link in Messages/Mail with app installed
- Android: Tap a link in browser/app with app installed
- Verify app opens instead of browser

### CI/CD Integration

**GitHub Actions Workflow**: `.github/workflows/seo-check.yml`

Automatically validates:

- ✅ Sitemap generation
- ✅ robots.txt existence and format
- ✅ JSON-LD component usage
- ✅ .well-known files for app linking

**Runs on:**

- Pull requests affecting web app routes or components
- Manual workflow dispatch

### PR Checklist for SEO Changes

When adding or modifying pages:

- [ ] Updated `next-sitemap.config.js` if route should be excluded
- [ ] Added JSON-LD structured data for new page types
- [ ] Tested structured data with Google Rich Results Test
- [ ] Verified sitemap includes new routes (or excludes appropriately)
- [ ] Updated deep linking paths if mobile app should handle route

### Staging vs Production

**Staging:**

- Use environment variables to control indexing
- Consider password protection or `ROBOTS_DISALLOW_ALL=true`
- Test sitemap generation works correctly

**Production:**

- Set `SITE_URL` to production domain
- Ensure robots.txt allows indexing
- Submit sitemap to Google Search Console
- Monitor Search Console for errors

### Common Issues

**Sitemap not generating:**

- Check `postbuild` script runs after Next.js build
- Verify `SITE_URL` environment variable is set
- Check build logs for next-sitemap errors

**JSON-LD not appearing:**

- Ensure server-side rendering is enabled (not client-only)
- Check browser source (not inspector) for script tag
- Validate JSON syntax with online validator

**Deep links not working:**

- Verify .well-known files are publicly accessible (200 OK)
- Check Team ID and package names match exactly
- Test on physical device (simulators have limitations)
- Review Android logcat for App Links verification

## Tamagui Documentation

If you want all docs as a single document, see docs/TAMAGUI_DOCUMENTATION.md.

> Tamagui is a complete UI solution for React Native and Web, with a fully-featured UI kit, styling engine, and optimizing compiler.

This documentation covers all aspects of using Tamagui, from installation to advanced usage.

## Core

Core documentation covers the fundamental styling and configuration aspects of Tamagui:

- [Animations](https://tamagui.dev/docs/core/animations.md): Animation system and utilities
- [Config V4](https://tamagui.dev/docs/core/config-v4.md): Version 4 configuration guide
- [Configuration](https://tamagui.dev/docs/core/configuration.md): General configuration options
- [Exports](https://tamagui.dev/docs/core/exports.md): Available exports and utilities
- [Font Language](https://tamagui.dev/docs/core/font-language.md): Font and language settings
- [Stack and Text](https://tamagui.dev/docs/core/stack-and-text.md): Basic layout components
- [Styled](https://tamagui.dev/docs/core/styled.md): Styled component system
- [Theme](https://tamagui.dev/docs/core/theme.md): Theming system
- [Tokens](https://tamagui.dev/docs/core/tokens.md): Design tokens and variables
- [Use Media](https://tamagui.dev/docs/core/use-media.md): Media query hooks
- [Use Theme](https://tamagui.dev/docs/core/use-theme.md): Theme hooks
- [Variants](https://tamagui.dev/docs/core/variants.md): Component variants system

## Compiler

Documentation about Tamagui's optimizing compiler:

- [Compiler Installation](https://tamagui.dev/docs/intro/compiler-install.md): How to install and setup the compiler
- [Why a Compiler?](https://tamagui.dev/docs/intro/why-a-compiler.md): Benefits and reasoning behind the compiler
- [Benchmarks](https://tamagui.dev/docs/intro/benchmarks.md): Performance benchmarks and comparisons

## Components

All component documentation can be accessed at https://tamagui.dev/ui/[component-name]

Available components:

- [Accordion](https://tamagui.dev/ui/accordion.md): Expandable content sections
- [AlertDialog](https://tamagui.dev/ui/alert-dialog.md): Modal dialog for important actions
- [Anchor](https://tamagui.dev/ui/anchor.md): Link component with styling options
- [Avatar](https://tamagui.dev/ui/avatar.md): User avatar display component
- [Button](https://tamagui.dev/ui/button.md): A customizable button component with variants and themes
- [Card](https://tamagui.dev/ui/card.md): Container component for grouped content
- [Checkbox](https://tamagui.dev/ui/checkbox.md): Selection control component
- [Dialog](https://tamagui.dev/ui/dialog.md): Modal dialog component
- [Form](https://tamagui.dev/ui/form.md): Form components and validation
- [Group](https://tamagui.dev/ui/group.md): Component grouping utilities
- [Headings](https://tamagui.dev/ui/headings.md): Typography heading components
- [HTML Elements](https://tamagui.dev/ui/html-elements.md): Basic HTML element components
- [Image](https://tamagui.dev/ui/image.md): Image display component
- [Inputs](https://tamagui.dev/ui/inputs.md): Text input components
- [Label](https://tamagui.dev/ui/label.md): Accessible label components
- [LinearGradient](https://tamagui.dev/ui/linear-gradient.md): Gradient background component
- [ListItem](https://tamagui.dev/ui/list-item.md): List item component
- [LucideIcons](https://tamagui.dev/ui/lucide-icons.md): Icon component library
- [NewInputs](https://tamagui.dev/ui/new-inputs.md): Enhanced input components
- [Popover](https://tamagui.dev/ui/popover.md): Floating content component
- [Portal](https://tamagui.dev/ui/portal.md): Render content in different DOM locations
- [Progress](https://tamagui.dev/ui/progress.md): Progress indicators
- [RadioGroup](https://tamagui.dev/ui/radio-group.md): Radio button selection group
- [ScrollView](https://tamagui.dev/ui/scroll-view.md): Scrollable container component
- [Select](https://tamagui.dev/ui/select.md): Dropdown selection component
- [Separator](https://tamagui.dev/ui/separator.md): Visual separators
- [Shapes](https://tamagui.dev/ui/shapes.md): Basic shape components
- [Sheet](https://tamagui.dev/ui/sheet.md): Bottom sheet and modal components
- [Slider](https://tamagui.dev/ui/slider.md): Range input components
- [Spinner](https://tamagui.dev/ui/spinner.md): Loading indicator component
- [Stacks](https://tamagui.dev/ui/stacks.md): Layout stack components
- [Switch](https://tamagui.dev/ui/switch.md): Toggle switch components
- [Tabs](https://tamagui.dev/ui/tabs.md): Tabbed interface components
- [TamaguiImage](https://tamagui.dev/ui/tamagui-image.md): Enhanced image component
- [Text](https://tamagui.dev/ui/text.md): Text display component
- [Toast](https://tamagui.dev/ui/toast.md): Notification component
- [ToggleGroup](https://tamagui.dev/ui/toggle-group.md): Group of toggle buttons
- [Tooltip](https://tamagui.dev/ui/tooltip.md): Informational tooltips
- [Unspaced](https://tamagui.dev/ui/unspaced.md): Remove spacing utilities
- [VisuallyHidden](https://tamagui.dev/ui/visually-hidden.md): Hide content visually while keeping it accessible
