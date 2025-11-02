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
// Primary Brand (Green) - Golf course inspired
$green50 to $green900     // 10 shades from lightest to darkest
$primary: $green500       // Main brand color (#13a063)
$primaryLight: $green100  // Light variant for backgrounds
$primaryHover: $green600  // Hover state
$primaryPress: $green700  // Press/active state
$primaryFocus: $green500  // Focus state

// Secondary Brand (Amber/Gold) - Premium accent
$amber50 to $amber900     // 10 shades
$secondary: $amber400     // Main secondary color (#f2b705)
$secondaryLight: $amber100
$secondaryHover: $amber500
$secondaryPress: $amber600
$secondaryFocus: $amber400
```

**Semantic Status Colors**:

```tsx
$success: $teal500; // Positive actions/states
$successLight: $teal100; // Light background
$successDark: $teal700; // Dark variant

$error: $red600; // Error states
$errorLight: $red100; // Error backgrounds
$errorDark: $red700; // Dark error

$warning: $amber400; // Warning states
$warningLight: $amber100;
$warningDark: $amber700;

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
$text: $gray900; // Primary text (dark in light theme)
$textSecondary: $gray700; // Secondary text
$textTertiary: $gray600; // Tertiary text
$textMuted: $gray500; // Muted/placeholder text
$textInverse: $white; // Text on dark backgrounds
```

**Background Colors**:

```tsx
$background: $offWhite; // Main app background (#fbfbf9)
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
$borderFocus: $green500; // Focus state borders (uses primary)
$borderPress: $green600; // Press state borders
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
$xs: 2px
$sm: 4px
$md: 8px
$lg: 12px
$xl: 16px
$2xl: 24px
$full: 9999px    // Perfect circles
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

- Background: Off-white (#fbfbf9) for reduced eye strain
- Text: Dark gray (#111827) for readability
- Primary: Green 500 for brand consistency
- All semantic colors optimized for light backgrounds

**Dark Theme**:

- Background: Dark gray (#111827)
- Text: Light gray (#f9fafb)
- Primary: Green 400 (lighter for dark backgrounds)
- All semantic colors adjusted for dark backgrounds with proper contrast

**Theme Switching**:

```tsx
import { Theme } from "@buttergolf/ui";

// Use dark theme for a section
<Theme name="dark">
  <View backgroundColor="$background">
    <Text color="$text">Automatically uses dark theme tokens</Text>
  </View>
</Theme>;
```

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
import { config } from "@buttergolf/ui";

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
import { config } from "@buttergolf/ui"; // or your tamagui.config

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
<Button backgroundColor="$green500">Submit</Button>  // Too specific
<Button backgroundColor="#13a063">Submit</Button>    // No theming
<Text color="$color">Text</Text>                     // Old token name
<View borderColor="$borderColor">Content</View>      // Old token name
```

#### ✅ **ALWAYS Use Component Variants**

```tsx
// ✅ CORRECT - Use built-in variants
<Button size="lg" tone="primary">Submit</Button>
<Text size="sm" color="muted">Helper text</Text>
<Card variant="elevated" padding="lg">Content</Card>
<Input size="md" error fullWidth />

// ❌ WRONG - Don't manually style with primitives
<Button paddingHorizontal="$5" height={48}>Submit</Button>
<Text fontSize="$3" color="$gray500">Helper text</Text>
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
// ✅ CORRECT - Use semantic layout components
<Column gap="$lg" align="stretch">
  <Heading level={2}>Title</Heading>
  <Text>Description</Text>
  <Button>Action</Button>
</Column>

<Row gap="$md" align="center" justify="between">
  <Text>Left content</Text>
  <Button>Right action</Button>
</Row>

<Container maxWidth="lg" padding="md">
  <Text>Constrained content</Text>
</Container>

// ❌ WRONG - Don't use raw YStack/XStack with manual styling
<YStack gap="$6" alignItems="stretch">
  <Text marginBottom="$4">Title</Text>
  <Text>Content</Text>
</YStack>
```

#### ✅ **Text Color Variants**

```tsx
// Available Text color variants (use these instead of token names)
<Text color="default">Default text</Text>        // $text
<Text color="secondary">Secondary text</Text>     // $textSecondary
<Text color="tertiary">Tertiary text</Text>       // $textTertiary
<Text color="muted">Muted text</Text>             // $textMuted
<Text color="inverse">Inverse text</Text>         // $textInverse (for dark backgrounds)
<Text color="primary">Primary colored</Text>      // $primary
<Text color="success">Success message</Text>      // $success
<Text color="error">Error message</Text>          // $error
<Text color="warning">Warning message</Text>      // $warning

// ❌ WRONG - Don't use old token names directly
<Text color="$color">Text</Text>           // Old token
<Text color="$color11">Text</Text>         // Numbered color
<Text color="$textDark">Text</Text>        // Old token
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
  color="default | secondary | tertiary | muted | inverse | primary | error | success | warning"
  weight="normal | medium | semibold | bold" // Font weight
  align="left | center | right" // Text alignment
  truncate={boolean} // Truncate with ellipsis
>
  Text content
</Text>
```

#### Heading

```tsx
<Heading
  level={1 | 2 | 3 | 4 | 5 | 6} // Heading level (h1-h6)
  color="default | primary | secondary" // Color variant
  align="left | center | right" // Text alignment
>
  Heading text
</Heading>
```

#### Row (Horizontal Layout)

```tsx
<Row
  gap="xs | sm | md | lg | xl" // Gap between children
  align="start | center | end | stretch | baseline" // Align items
  justify="start | center | end | between | around | evenly" // Justify content
  wrap={boolean} // Allow wrapping
  fullWidth={boolean} // Full width
>
  {children}
</Row>
```

#### Column (Vertical Layout)

```tsx
<Column
  gap="xs | sm | md | lg | xl" // Gap between children
  align="start | center | end | stretch" // Align items
  justify="start | center | end | between | around | evenly" // Justify content
  fullWidth={boolean} // Full width
  fullHeight={boolean} // Full height
>
  {children}
</Column>
```

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
  maxWidth="sm | md | lg | xl | 2xl | full" // Max width (default: lg)
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

## Documentation References

- **Tamagui Full Documentation**: https://tamagui.dev/llms-full.txt
- **Tamagui Core Concepts**: https://tamagui.dev/docs/intro/introduction
- **Prisma Documentation**: https://www.prisma.io/docs
- **Expo Documentation**: https://docs.expo.dev/
- **Next.js Documentation**: https://nextjs.org/docs
- **Turborepo Documentation**: https://turbo.build/repo/docs

## Best Practices

### Design System & Components

1. **ALWAYS use semantic tokens** - Use `$primary`, `$text`, `$border` instead of `$green500`, `$color`, `$borderColor`
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
<Container maxWidth="lg">         // Container component variant

// ❌ WRONG - Creating variants for native props
<Row gap="md">                    // ❌ gap exists natively, use gap="$md"
<Column gap="lg">                 // ❌ gap exists natively, use gap="$lg"

// ❌ WRONG - Mixing them up
<Button size="$lg">               // ❌ Don't use $ with variants
<Text color="$textMuted">         // ❌ Use variant name "muted"
<View padding="md">               // ❌ Missing $ for direct prop

// ❌ WRONG - Using specific/old tokens
<View backgroundColor="$green500"> // ❌ Too specific, use semantic
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
<Button paddingHorizontal="$5" backgroundColor="$green500">Submit</Button>
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

## Known Issues & Gotchas

1. **TypeScript Errors in UI Package**: Some Tamagui component re-exports may show TypeScript errors about missing module exports, but runtime typically works fine
2. **React Version Alignment**: Keep React at 19.2.0 across all packages to avoid peer dependency conflicts
3. **Metro Cache**: Clear Metro cache frequently when making config changes
4. **Path Aliases**: Always use TypeScript path mappings instead of relative imports for cross-package references
5. **Tamagui Build Folder**: The `.tamagui` directory is auto-generated - add to `.gitignore`

## Code Generation Hints

When generating new code:

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
<Container maxWidth="lg">
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
