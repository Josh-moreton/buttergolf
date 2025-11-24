# UI Web Package Setup

This document explains how `@buttergolf/ui-web` is set up and integrated with the Next.js web application.

## Package Structure

```
packages/ui-web/
├── package.json              # Package configuration
├── tsconfig.json             # TypeScript configuration
└── src/
    ├── index.ts              # Public API exports
    ├── utils/
    │   └── cn.ts             # Class name utility (like clsx)
    ├── styles/
    │   ├── tokens.css        # Tailwind @theme with design tokens
    │   └── index.css         # Optional utility classes
    └── components/
        ├── Button.tsx        # Button component
        ├── Text.tsx          # Text, Heading, Label components
        ├── Input.tsx         # Input, Textarea components
        ├── Card.tsx          # Card compound component
        ├── Badge.tsx         # Badge component
        ├── Layout.tsx        # Row, Column, Container, Spacer, Divider
        └── Spinner.tsx       # Loading spinner component
```

## How Tailwind CSS Works in the Monorepo

### Tailwind v4 Configuration

The project uses Tailwind CSS v4, which uses a CSS-first configuration approach:

1. **Design tokens** are defined in `/packages/ui-web/src/styles/tokens.css` using the `@theme` directive
2. **Tailwind base** is imported via `@import "tailwindcss"` in the tokens file
3. **No `tailwind.config.js`** is needed - all configuration is in CSS

### Integration with Next.js

```
apps/web/
├── postcss.config.mjs        # PostCSS with @tailwindcss/postcss
├── src/
│   └── app/
│       └── globals.css       # Imports ui-web tokens
```

**postcss.config.mjs:**
```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

**globals.css:**
```css
/* Import Tailwind CSS with ButterGolf design tokens */
@import "@buttergolf/ui-web/src/styles/tokens.css";

/* ... rest of global styles ... */
```

### Content Detection

Tailwind v4 automatically detects content sources based on imports. Because `globals.css` imports from `@buttergolf/ui-web`, Tailwind scans the ui-web package for classes.

**Important**: The package must be in `transpilePackages` in `next.config.js`:

```js
transpilePackages: [
  "@buttergolf/ui-web",
  // ... other packages
],
```

## Package Configuration

### package.json

```json
{
  "name": "@buttergolf/ui-web",
  "version": "0.0.1",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./*": "./src/*.tsx"
  },
  "peerDependencies": {
    "react": "*",
    "react-dom": "*"
  }
}
```

### tsconfig.json

```json
{
  "extends": "@buttergolf/typescript-config/react-library.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist",
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

## Adding New Components

1. Create the component file in `/packages/ui-web/src/components/`:

```tsx
// NewComponent.tsx
import * as React from "react";
import { cn } from "../utils/cn";

export interface NewComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "special";
}

export const NewComponent = React.forwardRef<HTMLDivElement, NewComponentProps>(
  ({ variant = "default", className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "base-classes",
          variant === "special" && "special-classes",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

NewComponent.displayName = "NewComponent";
```

2. Export from `/packages/ui-web/src/index.ts`:

```ts
export { NewComponent } from "./components/NewComponent";
export type { NewComponentProps } from "./components/NewComponent";
```

3. Use in the web app:

```tsx
import { NewComponent } from "@buttergolf/ui-web";

function MyPage() {
  return <NewComponent variant="special">Hello</NewComponent>;
}
```

## Design Token Updates

To add or modify design tokens:

1. Edit `/packages/ui-web/src/styles/tokens.css`
2. Add new CSS custom properties in the `@theme` block:

```css
@theme {
  /* New color */
  --color-accent: #ff6b6b;

  /* New spacing */
  --spacing-4xl: 5rem;
}
```

3. Use in components via Tailwind classes:

```tsx
<div className="bg-accent p-[var(--spacing-4xl)]">
  Custom token usage
</div>
```

## Dependencies

The ui-web package has minimal dependencies:
- **React** (peer dependency)
- **No Tailwind dependency** - Tailwind is processed by the consuming app

This keeps the package lightweight and avoids version conflicts.

## Best Practices

1. **Use semantic tokens** - Prefer `text-text` over `text-iron` for theme flexibility
2. **Forward refs** - All components support ref forwarding for better composability
3. **className passthrough** - All components accept custom className for extension
4. **TypeScript** - All props are fully typed with exported interfaces
5. **Accessibility** - Include proper ARIA attributes and keyboard support
