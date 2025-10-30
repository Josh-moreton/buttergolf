# Copilot Instructions for ButterGolf

## Project Overview

ButterGolf is a cross-platform application built with a modern monorepo architecture, supporting both web (Next.js) and mobile (Expo) platforms. The project leverages Tamagui for cross-platform UI components and styling, ensuring a consistent user experience across all platforms.

## Architecture

### Monorepo Structure
- **Build System**: Turborepo 2.5.8 for build orchestration and caching
- **Package Manager**: pnpm 9.0.0 with workspace protocol
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
```

## Package Naming Convention

All internal packages use the `@buttergolf/` namespace:
- `@buttergolf/ui` - Cross-platform UI components
- `@buttergolf/db` - Prisma database client
- `@buttergolf/eslint-config` - Shared ESLint configurations
- `@buttergolf/typescript-config` - Shared TypeScript configurations
- Use workspace protocol: `"@buttergolf/ui": "workspace:*"`

## Tamagui Configuration

### Core Config Location
- **Config File**: `/tamagui.config.ts` (root level)
- **Base Config**: Extends `@tamagui/config/v3`
- **TypeScript Paths**: Defined in `/tsconfig.base.json`

### Key Tamagui Concepts

#### Component Creation
```tsx
// Use styled() for optimized components
import { View, styled } from 'tamagui'

export const Button = styled(View, {
  name: 'Button', // Required for compiler optimization
  backgroundColor: '$background',
  pressStyle: {
    backgroundColor: '$backgroundPress',
  },
  variants: {
    size: {
      sm: { height: '$8', paddingHorizontal: '$3' },
      md: { height: '$10', paddingHorizontal: '$4' },
      lg: { height: '$12', paddingHorizontal: '$5' },
    },
  },
})
```

#### Theme Access
```tsx
import { useTheme } from 'tamagui'

function MyComponent() {
  const theme = useTheme()
  return <View backgroundColor={theme.background.val} />
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
export { Button } from '@tamagui/button'
export type { ButtonProps } from '@tamagui/button'
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
    '@buttergolf/ui',
    'react-native-web',
    '@tamagui/core',
    'tamagui',
  ],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-native$': 'react-native-web',
    }
    return config
  },
}
```

**Root Layout Pattern**:
```tsx
// apps/web/src/app/layout.tsx
import { TamaguiProvider } from 'tamagui'
import { config } from '@buttergolf/ui'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <TamaguiProvider config={config} defaultTheme="light">
          {children}
        </TamaguiProvider>
      </body>
    </html>
  )
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
const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

config.watchFolders = [workspaceRoot]
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]
config.resolver.disableHierarchicalLookup = true
```

**Babel Configuration**:
```javascript
// babel.config.js
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@buttergolf/ui': '../../packages/ui/src',
        },
      },
    ],
    'tamagui/babel',
  ],
}
```

## Cross-Platform Component Patterns

### Import Pattern
```tsx
// Always import from @buttergolf/ui for cross-platform components
import { Button, Text } from '@buttergolf/ui'

function MyScreen() {
  return (
    <View>
      <Text>Hello World</Text>
      <Button onPress={() => console.log('pressed')}>
        Click me
      </Button>
    </View>
  )
}
```

### Tamagui Provider Usage
Both platforms require wrapping the app in `TamaguiProvider`:
```tsx
import { TamaguiProvider } from 'tamagui'
import { config } from '@buttergolf/ui' // or your tamagui.config

function App() {
  return (
    <TamaguiProvider config={config} defaultTheme="light">
      {/* Your app */}
    </TamaguiProvider>
  )
}
```

### Media Queries (Cross-Platform)
```tsx
import { useMedia } from 'tamagui'

function ResponsiveComponent() {
  const media = useMedia()
  
  return (
    <View
      width="100%"
      $gtMd={{ width: '50%' }}  // Greater than medium breakpoint
    >
      {media.gtMd ? <DesktopView /> : <MobileView />}
    </View>
  )
}
```

### Theme Switching (Cross-Platform)
```tsx
import { Theme } from 'tamagui'

function ThemedComponent() {
  return (
    <Theme name="dark">
      <View backgroundColor="$background">
        <Text color="$color">Dark theme content</Text>
      </View>
    </Theme>
  )
}
```

## Component Library Guidelines

### Creating New Components

1. **Add to `packages/ui/src/components/`**:
```tsx
// packages/ui/src/components/Card.tsx
import { styled, YStack } from 'tamagui'

export const Card = styled(YStack, {
  name: 'Card',
  backgroundColor: '$background',
  borderRadius: '$4',
  padding: '$4',
  shadowColor: '$shadowColor',
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 4 },
  
  variants: {
    elevated: {
      true: {
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
      },
    },
  },
})
```

2. **Export from `packages/ui/src/index.ts`**:
```tsx
export { Card } from './components/Card'
export type { CardProps } from './components/Card'
```

3. **Component Types**: Always export component types for consumers

### Compound Components Pattern
For complex components with sub-components:
```tsx
// packages/ui/src/components/Accordion.tsx
import { createStyledContext, styled, YStack } from 'tamagui'

const AccordionContext = createStyledContext({
  size: '$md' as any,
})

export const AccordionFrame = styled(YStack, {
  context: AccordionContext,
})

export const AccordionItem = styled(YStack, {
  context: AccordionContext,
  // Uses context.size
})

// Main export
export const Accordion = AccordionFrame as typeof AccordionFrame & {
  Item: typeof AccordionItem
}

Accordion.Item = AccordionItem
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
    backgroundColor: '$blue11',
  }}
/>
```

2. **Media Queries**:
```tsx
<View
  width={200}
  $sm={{ width: 300 }}  // Small screens
  $md={{ width: 400 }}  // Medium screens
  $lg={{ width: 500 }}  // Large screens
/>
```

3. **Pseudo States**:
```tsx
<Button
  backgroundColor="$blue10"
  hoverStyle={{ backgroundColor: '$blue11' }}
  pressStyle={{ backgroundColor: '$blue9' }}
  focusStyle={{ borderColor: '$blue8' }}
/>
```

4. **Group Styling**:
```tsx
<View group="card">
  <Text $group-card-hover={{ color: '$blue10' }}>
    Hover the parent to see me change
  </Text>
</View>
```

### Tailwind CSS (Web Only)
Used in Next.js for web-specific styling when Tamagui doesn't fit:
```tsx
<div className="container mx-auto px-4">
  {/* Tailwind classes */}
</div>
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
import { prisma } from '@buttergolf/db'

// Query data
const users = await prisma.user.findMany()

// Create data
const round = await prisma.round.create({
  data: {
    userId: user.id,
    courseName: 'Pebble Beach',
    score: 72,
  }
})
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

## Documentation References

- **Tamagui Full Documentation**: https://tamagui.dev/llms-full.txt
- **Tamagui Core Concepts**: https://tamagui.dev/docs/intro/introduction
- **Prisma Documentation**: https://www.prisma.io/docs
- **Expo Documentation**: https://docs.expo.dev/
- **Next.js Documentation**: https://nextjs.org/docs
- **Turborepo Documentation**: https://turbo.build/repo/docs

## Best Practices

1. **Always use Tamagui components** from `@buttergolf/ui` for cross-platform consistency
2. **Keep React versions aligned** across web and mobile (currently 19.2.0)
3. **Use workspace protocol** for internal dependencies: `"workspace:*"`
4. **Export types** alongside components for better DX
5. **Test on both platforms** before considering features complete
6. **Use Tamagui tokens** (`$`) for all design system values
7. **Leverage media queries** for responsive design instead of platform checks
8. **Keep Metro and Babel configs** in sync with Tamagui requirements
9. **Run type checking** regularly during development
10. **Use `name` prop** on styled components for better compiler optimization
11. **Use Prisma Client singleton** from `@buttergolf/db` - never create new instances
12. **Run `pnpm db:generate`** after any schema changes
13. **Use migrations** (`db:migrate:dev`) for production-bound changes, `db:push` for quick dev iteration

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
- Use tokens ($ prefix) for all style values
- Include responsive variants with media queries
- Add hover/press/focus styles where appropriate
- Follow compound component pattern for complex UIs
- Always wrap in TamaguiProvider when creating new entry points
