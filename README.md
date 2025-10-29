# ButterGolf Monorepo

A monorepo setup for ButterGolf using Turborepo, Next.js (web), and Expo (iOS/Android).

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `web`: a [Next.js](https://nextjs.org/) app for the website
- `mobile`: an [Expo](https://expo.dev/) app for iOS/Android mobile experience
- `@repo/ui`: a shared React component library compatible with both web and React Native
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm 9.0.0 (specified in package.json)

### Installation

1. Clone the repository
2. Install dependencies:

```sh
pnpm install
```

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Development

Run all apps in development mode:

```sh
pnpm dev
```

Run specific apps:

```sh
# Web app only
pnpm dev:web

# Mobile app only
pnpm dev:mobile
```

Or use turbo filters directly:

```sh
# Web app
pnpm turbo dev --filter=web

# Mobile app
pnpm turbo dev --filter=mobile
```

### Build

Build all apps and packages:

```sh
pnpm build
```

Build a specific app:

```sh
pnpm turbo build --filter=web
# or
pnpm turbo build --filter=mobile
```

### Linting & Type Checking

```sh
# Lint all packages
pnpm lint

# Type check all packages
pnpm check-types
```

## Monorepo Setup Details

### Metro Configuration (Expo)

The iOS app uses a custom `metro.config.js` that:

- Watches all files in the monorepo (workspace root)
- Resolves modules from both project and workspace `node_modules`
- Disables hierarchical lookup for consistent resolution
- Uses Turborepo cache when possible

### Shared Packages

The `@repo/ui` package is configured to work with both React (web) and React Native (iOS):

- Uses peer dependencies for framework compatibility
- React Native is marked as optional for web-only usage
- Components can be imported in both Next.js and Expo apps

### Turborepo Configuration

The `turbo.json` is configured to:

- Handle both Next.js (`.next/**`) and Expo (`.expo/**`) build outputs
- Support persistent dev servers for both platforms
- Run tasks with proper dependency ordering

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started at [vercel.com](https://vercel.com/signup).

To enable remote caching:

```sh
pnpm turbo login
pnpm turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)
