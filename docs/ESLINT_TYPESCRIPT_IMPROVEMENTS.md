# ESLint Rules & TypeScript Improvements for Variant-Based Components

## Overview

This document outlines strategies to enforce proper usage of variant-based styled components through ESLint rules and improved TypeScript types. The goal is to **prevent raw prop usage** on our styled components (`Row`, `Column`, `Text`, etc.) and ensure developers use the semantic variants instead.

---

## Part 1: ESLint Rules to Prevent Raw Props

### Strategy

Create custom ESLint rules that detect and warn/error when:

1. Raw Tamagui props are used on styled components from `@buttergolf/ui`
2. Type casts like `as any` are used to bypass type checking
3. Non-variant props are used (e.g., `fontSize={14}` instead of `size="sm"`)

### Implementation Options

#### Option A: Custom ESLint Plugin (Recommended)

Create a custom ESLint plugin specifically for ButterGolf component usage.

**Location**: `packages/eslint-plugin-buttergolf/`

**Rules to Implement**:

1. **`no-raw-props-on-styled-components`** - Detects raw props on styled components
2. **`no-type-cast-workarounds`** - Detects `as any` type casts on component props
3. **`use-variant-props`** - Suggests variant props when raw props are detected
4. **`no-dollar-token-colors`** - Enforces semantic color variants over token strings

##### Rule 1: `no-raw-props-on-styled-components`

**Purpose**: Prevent raw Tamagui props on styled components from `@buttergolf/ui`

```javascript
// packages/eslint-plugin-buttergolf/src/rules/no-raw-props-on-styled-components.js

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow raw Tamagui props on styled components",
      category: "Best Practices",
      recommended: true,
    },
    fixable: "code",
    messages: {
      rawPropOnStyledComponent:
        'Use variant prop "{{variant}}" instead of raw prop "{{prop}}" on {{component}}',
      rawFontSize:
        "Use size variant (xs/sm/md/lg/xl) instead of fontSize on Text component",
      rawFontWeight:
        "Use weight variant (normal/medium/semibold/bold) instead of fontWeight on Text component",
      rawJustifyContent:
        "Use justify variant instead of justifyContent on Row/Column",
      rawAlignItems: "Use align variant instead of alignItems on Row/Column",
      rawGap:
        'Use gap variant (xs/sm/md/lg/xl) instead of gap="$N" on Row/Column',
    },
    schema: [],
  },

  create(context) {
    // Track imports from @buttergolf/ui
    const styledComponents = new Set();

    return {
      ImportDeclaration(node) {
        if (node.source.value === "@buttergolf/ui") {
          node.specifiers.forEach((spec) => {
            if (spec.imported) {
              const name = spec.imported.name;
              // Track known styled components
              if (
                [
                  "Row",
                  "Column",
                  "Text",
                  "Heading",
                  "Label",
                  "Container",
                ].includes(name)
              ) {
                styledComponents.add(name);
              }
            }
          });
        }
      },

      JSXOpeningElement(node) {
        const componentName = node.name.name;

        // Only check if this is a styled component we're tracking
        if (!styledComponents.has(componentName)) return;

        node.attributes.forEach((attr) => {
          if (attr.type !== "JSXAttribute") return;

          const propName = attr.name.name;

          // Check for raw props on Text components
          if (componentName === "Text" || componentName === "Heading") {
            if (propName === "fontSize") {
              context.report({
                node: attr,
                messageId: "rawFontSize",
                fix(fixer) {
                  // Suggest size variant based on fontSize value
                  const value = attr.value?.expression?.value;
                  const sizeVariant = mapFontSizeToVariant(value);
                  return fixer.replaceText(attr, `size="${sizeVariant}"`);
                },
              });
            }

            if (propName === "fontWeight") {
              context.report({
                node: attr,
                messageId: "rawFontWeight",
                fix(fixer) {
                  const value =
                    attr.value?.expression?.value || attr.value?.value;
                  const weightVariant = mapFontWeightToVariant(value);
                  return fixer.replaceText(attr, `weight="${weightVariant}"`);
                },
              });
            }

            // Check for token colors instead of variants
            if (
              propName === "color" &&
              attr.value?.expression?.value?.startsWith("$")
            ) {
              const tokenColor = attr.value.expression.value;
              const colorVariant = mapTokenToColorVariant(tokenColor);
              if (colorVariant) {
                context.report({
                  node: attr,
                  messageId: "rawPropOnStyledComponent",
                  data: {
                    prop: "color",
                    variant: colorVariant,
                    component: componentName,
                  },
                  fix(fixer) {
                    return fixer.replaceText(attr.value, `"${colorVariant}"`);
                  },
                });
              }
            }
          }

          // Check for raw props on layout components
          if (componentName === "Row" || componentName === "Column") {
            if (propName === "justifyContent") {
              context.report({
                node: attr,
                messageId: "rawJustifyContent",
                fix(fixer) {
                  const value =
                    attr.value?.expression?.value || attr.value?.value;
                  const justifyVariant = mapJustifyContentToVariant(value);
                  return fixer.replaceText(attr, `justify="${justifyVariant}"`);
                },
              });
            }

            if (propName === "alignItems") {
              context.report({
                node: attr,
                messageId: "rawAlignItems",
                fix(fixer) {
                  const value =
                    attr.value?.expression?.value || attr.value?.value;
                  const alignVariant = mapAlignItemsToVariant(value);
                  return fixer.replaceText(attr, `align="${alignVariant}"`);
                },
              });
            }

            if (
              propName === "gap" &&
              attr.value?.expression?.value?.startsWith("$")
            ) {
              context.report({
                node: attr,
                messageId: "rawGap",
                fix(fixer) {
                  const tokenGap = attr.value.expression.value;
                  const gapVariant = mapTokenToGapVariant(tokenGap);
                  return fixer.replaceText(attr.value, `"${gapVariant}"`);
                },
              });
            }
          }
        });
      },
    };
  },
};

// Helper functions for mapping
function mapFontSizeToVariant(fontSize) {
  const map = {
    10: "xs",
    12: "xs",
    13: "xs",
    14: "sm",
    15: "sm",
    16: "md",
    18: "md",
    20: "lg",
    22: "lg",
    24: "xl",
    28: "xl",
  };
  return map[fontSize] || "md";
}

function mapFontWeightToVariant(weight) {
  const map = {
    400: "normal",
    500: "medium",
    600: "semibold",
    700: "bold",
    800: "bold", // bold is closest
  };
  return map[weight] || "normal";
}

function mapTokenToColorVariant(token) {
  const map = {
    $text: "default",
    $textSecondary: "secondary",
    $textTertiary: "tertiary",
    $textMuted: "muted",
    $textInverse: "inverse",
    $primary: "primary",
    $error: "error",
    $success: "success",
    $warning: "warning",
    $info: "primary", // closest match
  };
  return map[token];
}

function mapJustifyContentToVariant(value) {
  const map = {
    "flex-start": "start",
    center: "center",
    "flex-end": "end",
    "space-between": "between",
    "space-around": "around",
    "space-evenly": "evenly",
  };
  return map[value] || "start";
}

function mapAlignItemsToVariant(value) {
  const map = {
    "flex-start": "start",
    center: "center",
    "flex-end": "end",
    stretch: "stretch",
    baseline: "baseline",
  };
  return map[value] || "start";
}

function mapTokenToGapVariant(token) {
  const map = {
    $2: "xs",
    $xs: "xs",
    $3: "sm",
    $sm: "sm",
    $4: "md",
    $md: "md",
    $5: "lg",
    $lg: "lg",
    $6: "xl",
    $xl: "xl",
  };
  return map[token] || "md";
}
```

##### Rule 2: `no-type-cast-workarounds`

**Purpose**: Prevent `as any` type casts on component props

```javascript
// packages/eslint-plugin-buttergolf/src/rules/no-type-cast-workarounds.js

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow type cast workarounds on component props",
      category: "Best Practices",
      recommended: true,
    },
    messages: {
      noTypeCast:
        'Do not use "as any" type cast. Use proper variant props instead.',
      noSpreadWithTypeCast:
        "Do not use spread operator with type cast {...{ prop: value as any }}. Use direct prop assignment.",
    },
    schema: [],
  },

  create(context) {
    return {
      JSXAttribute(node) {
        // Check for {...{ prop: value as any }} pattern
        if (node.type === "JSXSpreadAttribute") {
          const sourceCode = context.getSourceCode();
          const text = sourceCode.getText(node);

          if (text.includes("as any")) {
            context.report({
              node,
              messageId: "noSpreadWithTypeCast",
            });
          }
        }

        // Check for prop={value as any} pattern
        if (node.value?.expression?.type === "TSAsExpression") {
          const asExpression = node.value.expression;
          if (asExpression.typeAnnotation?.type === "TSAnyKeyword") {
            context.report({
              node,
              messageId: "noTypeCast",
            });
          }
        }
      },
    };
  },
};
```

##### Plugin Configuration

```javascript
// packages/eslint-plugin-buttergolf/src/index.js

module.exports = {
  rules: {
    "no-raw-props-on-styled-components": require("./rules/no-raw-props-on-styled-components"),
    "no-type-cast-workarounds": require("./rules/no-type-cast-workarounds"),
  },
  configs: {
    recommended: {
      plugins: ["buttergolf"],
      rules: {
        "buttergolf/no-raw-props-on-styled-components": "error",
        "buttergolf/no-type-cast-workarounds": "error",
      },
    },
  },
};
```

##### Package Setup

```json
// packages/eslint-plugin-buttergolf/package.json
{
  "name": "eslint-plugin-buttergolf",
  "version": "0.0.1",
  "private": true,
  "main": "src/index.js",
  "peerDependencies": {
    "eslint": ">=8.0.0"
  }
}
```

##### Usage in Workspace

```javascript
// packages/eslint-config/base.js
import buttergolfPlugin from "eslint-plugin-buttergolf";

export const config = [
  // ... existing config
  {
    plugins: {
      buttergolf: buttergolfPlugin,
    },
    rules: {
      "buttergolf/no-raw-props-on-styled-components": "error",
      "buttergolf/no-type-cast-workarounds": "error",
    },
  },
];
```

---

#### Option B: TypeScript ESLint Rules (Simpler Alternative)

If creating a custom plugin is too complex, use existing TypeScript ESLint rules to catch common issues:

```javascript
// packages/eslint-config/base.js
export const config = [
  // ... existing config
  {
    rules: {
      // Disallow @ts-ignore and @ts-expect-error
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-ignore": true,
          "ts-expect-error": "allow-with-description",
        },
      ],

      // Disallow explicit any
      "@typescript-eslint/no-explicit-any": "error",

      // Enforce consistent type definitions
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],

      // Disallow unnecessary type assertions
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
    },
  },
];
```

---

## Part 2: Improved TypeScript Types

### Strategy

Improve TypeScript types to:

1. Make variant props required when styled components are used
2. Provide better intellisense/autocomplete for variant options
3. Create strict types that reject raw props
4. Add type guards to ensure proper usage

### Implementation

#### Improved Component Type Definitions

##### 1. Strict Variant-Only Types

Create wrapper types that only allow variant props:

```typescript
// packages/ui/src/types/variants.ts

import type { GetProps } from "tamagui";
import type { Row, Column, Text, Heading } from "../components";

/**
 * Extract only variant props from a styled component
 */
type VariantProps<T> = Pick<
  T,
  {
    [K in keyof T]: K extends "variants" ? never : K;
  }[keyof T]
>;

/**
 * Strict Row props - only variants allowed
 */
export type StrictRowProps = {
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  wrap?: boolean;
  fullWidth?: boolean;
} & {
  // Allow base layout props that aren't covered by variants
  flex?: number;
  width?: string | number;
  height?: string | number;
  padding?: string | number;
  margin?: string | number;
  backgroundColor?: string;
  borderRadius?: string | number;
  position?: "absolute" | "relative" | "fixed" | "sticky";
  zIndex?: number;
  opacity?: number;
  // Media queries
  $gtXs?: Partial<StrictRowProps>;
  $gtSm?: Partial<StrictRowProps>;
  $gtMd?: Partial<StrictRowProps>;
  $gtLg?: Partial<StrictRowProps>;
  // Add children
  children?: React.ReactNode;
};

/**
 * Strict Column props - only variants allowed
 */
export type StrictColumnProps = {
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  fullWidth?: boolean;
  fullHeight?: boolean;
} & {
  // Allow base layout props
  flex?: number;
  width?: string | number;
  height?: string | number;
  padding?: string | number;
  margin?: string | number;
  backgroundColor?: string;
  borderRadius?: string | number;
  position?: "absolute" | "relative" | "fixed" | "sticky";
  zIndex?: number;
  opacity?: number;
  // Media queries
  $gtXs?: Partial<StrictColumnProps>;
  $gtSm?: Partial<StrictColumnProps>;
  $gtMd?: Partial<StrictColumnProps>;
  $gtLg?: Partial<StrictColumnProps>;
  // Add children
  children?: React.ReactNode;
};

/**
 * Strict Text props - only variants allowed
 */
export type StrictTextProps = {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?:
    | "default"
    | "secondary"
    | "tertiary"
    | "muted"
    | "inverse"
    | "primary"
    | "error"
    | "success"
    | "warning";
  weight?: "normal" | "medium" | "semibold" | "bold";
  align?: "left" | "center" | "right";
  truncate?: boolean;
} & {
  // Allow specific non-variant props
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  textDecoration?: "none" | "underline" | "line-through";
  lineHeight?: string | number;
  numberOfLines?: number;
  // For edge cases where variant sizes don't suffice
  fontSize?: number; // Use sparingly, prefer size variants
  fontWeight?: string; // Use sparingly, prefer weight variants
  // Media queries
  $gtXs?: Partial<StrictTextProps>;
  $gtSm?: Partial<StrictTextProps>;
  $gtMd?: Partial<StrictTextProps>;
  $gtLg?: Partial<StrictTextProps>;
  // Add children
  children?: React.ReactNode;
};

/**
 * Strict Heading props
 */
export type StrictHeadingProps = {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  color?: "default" | "primary" | "secondary";
  align?: "left" | "center" | "right";
  children?: React.ReactNode;
};
```

##### 2. Type Guards for Runtime Validation

```typescript
// packages/ui/src/types/guards.ts

/**
 * Type guard to check if a prop is a variant prop
 */
export function isVariantProp<T extends string>(
  prop: string,
  validVariants: readonly T[],
): prop is T {
  return (validVariants as readonly string[]).includes(prop);
}

/**
 * Validate Row/Column props at runtime
 */
export function validateLayoutProps(
  props: Record<string, any>,
  componentName: "Row" | "Column",
) {
  const invalidProps: string[] = [];

  // Check for raw props that should be variants
  if ("justifyContent" in props) {
    invalidProps.push("justifyContent (use justify variant instead)");
  }
  if ("alignItems" in props) {
    invalidProps.push("alignItems (use align variant instead)");
  }
  if (
    "gap" in props &&
    typeof props.gap === "string" &&
    props.gap.startsWith("$")
  ) {
    invalidProps.push("gap with token value (use gap variant: xs/sm/md/lg/xl)");
  }

  if (invalidProps.length > 0) {
    console.warn(
      `[${componentName}] Invalid props detected:\n` +
        invalidProps.map((p) => `  - ${p}`).join("\n") +
        "\nPlease use variant props instead of raw Tamagui props.",
    );
  }

  return invalidProps.length === 0;
}

/**
 * Validate Text props at runtime
 */
export function validateTextProps(props: Record<string, any>) {
  const invalidProps: string[] = [];

  if ("fontSize" in props && typeof props.fontSize === "number") {
    // Allow fontSize for edge cases, but warn
    console.info(
      "[Text] Using fontSize directly. Consider using size variant if possible.",
    );
  }
  if ("fontWeight" in props && typeof props.fontWeight === "string") {
    invalidProps.push("fontWeight (use weight variant instead)");
  }
  if (
    "color" in props &&
    typeof props.color === "string" &&
    props.color.startsWith("$")
  ) {
    invalidProps.push(
      "color with token (use color variant: default/secondary/primary/etc)",
    );
  }

  if (invalidProps.length > 0) {
    console.warn(
      "[Text] Invalid props detected:\n" +
        invalidProps.map((p) => `  - ${p}`).join("\n"),
    );
  }

  return invalidProps.length === 0;
}
```

##### 3. Enhanced Component Exports with Validation

```typescript
// packages/ui/src/components/Layout.tsx

import { styled, XStack, YStack } from 'tamagui'
import { validateLayoutProps } from '../types/guards'
import type { StrictRowProps, StrictColumnProps } from '../types/variants'

const RowBase = styled(XStack, {
  name: 'Row',
  // ... existing config
})

const ColumnBase = styled(YStack, {
  name: 'Column',
  // ... existing config
})

/**
 * Row with prop validation in development
 */
export const Row = (props: StrictRowProps) => {
  if (process.env.NODE_ENV === 'development') {
    validateLayoutProps(props, 'Row')
  }
  return <RowBase {...props} />
}

/**
 * Column with prop validation in development
 */
export const Column = (props: StrictColumnProps) => {
  if (process.env.NODE_ENV === 'development') {
    validateLayoutProps(props, 'Column')
  }
  return <ColumnBase {...props} />
}

export type RowProps = StrictRowProps
export type ColumnProps = StrictColumnProps
```

##### 4. Utility Types for Component Composition

```typescript
// packages/ui/src/types/composition.ts

/**
 * Helper type for components that can have variants + base props
 */
export type WithVariants<
  TVariants extends Record<string, any>,
  TBase extends Record<string, any> = {},
> = TVariants &
  TBase & {
    children?: React.ReactNode;
  };

/**
 * Media query props for responsive variants
 */
export type ResponsiveVariantProps<T> = T & {
  $gtXs?: Partial<T>;
  $gtSm?: Partial<T>;
  $gtMd?: Partial<T>;
  $gtLg?: Partial<T>;
  $gtXl?: Partial<T>;
};

/**
 * Example usage in component definition
 */
type CardVariants = {
  variant?: "elevated" | "outlined" | "filled" | "ghost";
  padding?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  interactive?: boolean;
  fullWidth?: boolean;
};

type CardBaseProps = {
  backgroundColor?: string;
  borderRadius?: number | string;
  onPress?: () => void;
};

export type CardProps = WithVariants<
  ResponsiveVariantProps<CardVariants>,
  CardBaseProps
>;
```

---

## Part 3: IDE Integration

### VSCode Integration

#### 1. IntelliSense Improvements

Create JSON schemas for better autocomplete:

```json
// .vscode/settings.json
{
  "typescript.preferences.autoImportFileExcludePatterns": [
    "tamagui/dist/*" // Prevent accidental imports of raw Tamagui components
  ],
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.tsdk": "node_modules/typescript/lib",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

#### 2. Code Snippets for Variants

```json
// .vscode/buttergolf.code-snippets
{
  "Row with variants": {
    "prefix": "row",
    "body": [
      "<Row gap=\"${1|xs,sm,md,lg,xl|}\" align=\"${2|start,center,end,stretch,baseline|}\" justify=\"${3|start,center,end,between,around,evenly|}\">",
      "  $0",
      "</Row>"
    ],
    "description": "Row component with variant props"
  },
  "Column with variants": {
    "prefix": "col",
    "body": [
      "<Column gap=\"${1|xs,sm,md,lg,xl|}\" align=\"${2|start,center,end,stretch|}\" justify=\"${3|start,center,end,between,around,evenly|}\">",
      "  $0",
      "</Column>"
    ],
    "description": "Column component with variant props"
  },
  "Text with variants": {
    "prefix": "txt",
    "body": [
      "<Text size=\"${1|xs,sm,md,lg,xl|}\" color=\"${2|default,secondary,tertiary,muted,inverse,primary,error,success,warning|}\" weight=\"${3|normal,medium,semibold,bold|}\">",
      "  $0",
      "</Text>"
    ],
    "description": "Text component with variant props"
  },
  "Heading with variants": {
    "prefix": "heading",
    "body": [
      "<Heading level={${1|1,2,3,4,5,6|}} color=\"${2|default,primary,secondary|}\">",
      "  $0",
      "</Heading>"
    ],
    "description": "Heading component with variant props"
  }
}
```

---

## Part 4: Testing & Validation

### Unit Tests for Type Guards

```typescript
// packages/ui/src/types/__tests__/guards.test.ts

import { validateLayoutProps, validateTextProps } from "../guards";

describe("validateLayoutProps", () => {
  beforeEach(() => {
    jest.spyOn(console, "warn").mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should warn on justifyContent usage", () => {
    const props = { justifyContent: "center" };
    validateLayoutProps(props, "Row");

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("justifyContent"),
    );
  });

  it("should warn on alignItems usage", () => {
    const props = { alignItems: "center" };
    validateLayoutProps(props, "Column");

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("alignItems"),
    );
  });

  it("should warn on token gap usage", () => {
    const props = { gap: "$3" };
    validateLayoutProps(props, "Row");

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("gap with token"),
    );
  });

  it("should not warn on valid variant props", () => {
    const props = { gap: "md", align: "center", justify: "between" };
    validateLayoutProps(props, "Row");

    expect(console.warn).not.toHaveBeenCalled();
  });
});

describe("validateTextProps", () => {
  beforeEach(() => {
    jest.spyOn(console, "warn").mockImplementation();
    jest.spyOn(console, "info").mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should info on fontSize usage", () => {
    const props = { fontSize: 64 };
    validateTextProps(props);

    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining("fontSize directly"),
    );
  });

  it("should warn on fontWeight usage", () => {
    const props = { fontWeight: "700" };
    validateTextProps(props);

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("fontWeight"),
    );
  });

  it("should warn on token color usage", () => {
    const props = { color: "$textMuted" };
    validateTextProps(props);

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("color with token"),
    );
  });

  it("should not warn on valid variant props", () => {
    const props = { size: "md", color: "primary", weight: "bold" };
    validateTextProps(props);

    expect(console.warn).not.toHaveBeenCalled();
  });
});
```

---

## Part 5: Documentation & Migration Guide

### Developer Guide

Create a guide for developers on using variant props:

````markdown
// packages/ui/DEVELOPER_GUIDE.md

# ButterGolf UI Component Developer Guide

## Using Variant Props

All styled components in `@buttergolf/ui` use **variant props** instead of raw Tamagui props.

### ✅ Correct Usage

```tsx
import { Row, Column, Text } from "@buttergolf/ui";

function MyComponent() {
  return (
    <Row gap="md" align="center" justify="between">
      <Column gap="sm">
        <Text size="lg" weight="bold" color="primary">
          Title
        </Text>
        <Text size="sm" color="secondary">
          Description
        </Text>
      </Column>
    </Row>
  );
}
```
````

### ❌ Incorrect Usage (Will Error)

```tsx
// ❌ Don't use raw Tamagui props
<Row gap="$4" alignItems="center" justifyContent="space-between">
  <Text fontSize={20} fontWeight="700" color="$primary">
    Title
  </Text>
</Row>

// ❌ Don't use type casts to bypass types
<Text {...{ color: "$primary" as any }}>Title</Text>
```

### Variant Reference

#### Layout (Row, Column)

- `gap`: xs | sm | md | lg | xl
- `align`: start | center | end | stretch | baseline
- `justify`: start | center | end | between | around | evenly
- `wrap`: boolean
- `fullWidth`: boolean

#### Text

- `size`: xs | sm | md | lg | xl
- `color`: default | secondary | tertiary | muted | inverse | primary | error | success | warning
- `weight`: normal | medium | semibold | bold
- `align`: left | center | right
- `truncate`: boolean

### Edge Cases

For sizes beyond variant ranges:

```tsx
// Option 1: Use variant + override (preferred for one-offs)
<Text size="xl" fontSize={64}>
  Hero Text
</Text>;

// Option 2: Import raw Text for specific cases
import { Text as TamaguiText } from "tamagui";

<TamaguiText fontSize={64} fontWeight="800">
  Hero Text
</TamaguiText>;
```

### ESLint Integration

Our custom ESLint rules will catch and auto-fix most issues:

```bash
# Run ESLint with auto-fix
pnpm lint --fix

# Check for errors
pnpm lint
```

```

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1)
- [ ] Create `packages/eslint-plugin-buttergolf/` structure
- [ ] Implement `no-raw-props-on-styled-components` rule
- [ ] Implement `no-type-cast-workarounds` rule
- [ ] Add unit tests for ESLint rules

### Phase 2: TypeScript Improvements (Week 1)
- [ ] Create `packages/ui/src/types/variants.ts` with strict types
- [ ] Create `packages/ui/src/types/guards.ts` with runtime validation
- [ ] Add type tests
- [ ] Update component exports to use strict types

### Phase 3: Integration (Week 2)
- [ ] Update `packages/eslint-config/` to use custom plugin
- [ ] Add VSCode snippets and settings
- [ ] Create developer guide documentation
- [ ] Run ESLint across codebase and fix violations

### Phase 4: Testing & Rollout (Week 2)
- [ ] Add integration tests
- [ ] Test in dev environment
- [ ] Document edge cases and solutions
- [ ] Roll out to team with migration guide

---

## Benefits

### For Developers
✅ Clear error messages when using wrong props
✅ Auto-fix capabilities for common issues
✅ Better IntelliSense and autocomplete
✅ Consistent patterns across codebase

### For Code Quality
✅ Enforces design system usage
✅ Prevents type casting workarounds
✅ Catches issues at lint time, not runtime
✅ Reduces TypeScript errors in IDE

### For Maintenance
✅ Easier refactoring with strict types
✅ Clear upgrade path for new variants
✅ Self-documenting component APIs
✅ Reduces cognitive load for new developers

---

## Alternative: Gradual Adoption

If full implementation is too much upfront, adopt gradually:

1. **Week 1**: Add TypeScript strict types
2. **Week 2**: Add runtime validation in development
3. **Week 3**: Create ESLint rules (warn only)
4. **Week 4**: Upgrade ESLint rules to errors
5. **Week 5**: Add auto-fix capabilities

This allows the team to adjust while maintaining productivity.

---

## Maintenance & Evolution

### Adding New Variants

When adding new variants to components:

1. Update component definition in `packages/ui/src/components/`
2. Update strict types in `packages/ui/src/types/variants.ts`
3. Update ESLint rule mappings if needed
4. Update developer guide documentation
5. Add code snippets for new variants

### Monitoring Usage

Add telemetry to track:
- How often ESLint rules fire
- Common patterns that need variants
- Edge cases requiring raw props

This data informs which variants to add and which rules to adjust.

---

## Conclusion

By combining custom ESLint rules with improved TypeScript types, we can:

1. **Prevent** raw prop usage at lint time
2. **Validate** props at runtime in development
3. **Guide** developers with better IntelliSense
4. **Enforce** our design system patterns

This creates a robust, maintainable component library that's hard to use incorrectly and easy to use correctly.
```
