# ESLint Rules for Layout Component Type Safety

This document outlines recommended ESLint rules to maintain type safety and prevent common issues with layout components (`Row`, `Column`, `Container`).

## Recommended Rules

Add these rules to your `.eslintrc.json` or ESLint configuration:

### 1. Restrict Direct Import of Primitives

Prevent direct usage of Tamagui primitives (`XStack`, `YStack`) in favor of our semantic components:

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
            "message": "Use Row/Column from @buttergolf/ui instead. XStack/YStack should only be used internally in the UI library."
          }
        ],
        "patterns": [
          {
            "group": ["**/Layout"],
            "importNames": ["XStack", "YStack"],
            "message": "Import XStack/YStack from 'tamagui' if needed in Layout.tsx, not from local imports"
          }
        ]
      }
    ]
  }
}
```

### 2. Enforce Type-Only Imports

Encourage better tree-shaking and explicit type imports:

```json
{
  "rules": {
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        "prefer": "type-imports",
        "disallowTypeAnnotations": false,
        "fixStyle": "inline-type-imports"
      }
    ]
  }
}
```

This will suggest:
```tsx
// ✅ Preferred
import { Row, type RowProps } from '@buttergolf/ui'

// ⚠️ Will warn (but not error)
import { Row, RowProps } from '@buttergolf/ui'
```

### 3. Require Return Types for Layout Wrapper Functions

Ensure wrapper components have explicit return types:

```json
{
  "rules": {
    "@typescript-eslint/explicit-function-return-type": [
      "warn",
      {
        "allowExpressions": true,
        "allowTypedFunctionExpressions": true,
        "allowHigherOrderFunctions": true,
        "allowConciseArrowFunctionExpressionsStartingWithVoid": false
      }
    ]
  }
}
```

### 4. Enforce Consistent Type Exports

When creating styled components, ensure GetProps is exported:

```json
{
  "rules": {
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }
    ]
  }
}
```

### 5. Warn on Empty Interfaces

Prevent empty prop interfaces that should extend from layout props:

```json
{
  "rules": {
    "@typescript-eslint/no-empty-interface": [
      "warn",
      {
        "allowSingleExtends": true
      }
    ]
  }
}
```

## Custom Rules (Optional)

For stricter enforcement, you can create custom ESLint rules:

### Custom Rule: Require GetProps Export

```javascript
// .eslintrc.js
module.exports = {
  plugins: ['local'],
  rules: {
    'local/require-getprops-export': 'error'
  }
}

// eslint-plugin-local/rules/require-getprops-export.js
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require GetProps type export for styled layout components',
      category: 'Best Practices'
    },
    schema: []
  },
  create(context) {
    return {
      CallExpression(node) {
        // Check for styled(Row|Column|Container, ...)
        if (
          node.callee.name === 'styled' &&
          node.arguments.length >= 2 &&
          ['Row', 'Column', 'Container'].includes(node.arguments[0].name)
        ) {
          // Check if there's a corresponding GetProps export
          const program = context.getAncestors()[0]
          const hasGetPropsExport = program.body.some(
            statement =>
              statement.type === 'ExportNamedDeclaration' &&
              statement.declaration?.type === 'TSTypeAliasDeclaration' &&
              statement.declaration.typeAnnotation?.typeName?.name === 'GetProps'
          )
          
          if (!hasGetPropsExport) {
            context.report({
              node,
              message: 'Styled layout components must export a GetProps type'
            })
          }
        }
      }
    }
  }
}
```

### Custom Rule: Prefer Semantic Layout Components

```javascript
// eslint-plugin-local/rules/prefer-semantic-layouts.js
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer Row/Column over XStack/YStack',
      category: 'Best Practices'
    },
    fixable: 'code',
    schema: []
  },
  create(context) {
    return {
      JSXIdentifier(node) {
        if (node.name === 'XStack' || node.name === 'YStack') {
          const suggestion = node.name === 'XStack' ? 'Row' : 'Column'
          
          context.report({
            node,
            message: `Use ${suggestion} from @buttergolf/ui instead of ${node.name}`,
            fix(fixer) {
              return fixer.replaceText(node, suggestion)
            }
          })
        }
      }
    }
  }
}
```

## Complete Configuration Example

Here's a complete ESLint configuration that includes all recommended rules:

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "plugins": ["@typescript-eslint", "react", "react-hooks"],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    // Type Safety Rules
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        "prefer": "type-imports",
        "disallowTypeAnnotations": false,
        "fixStyle": "inline-type-imports"
      }
    ],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }
    ],
    "@typescript-eslint/no-empty-interface": [
      "warn",
      {
        "allowSingleExtends": true
      }
    ],

    // Import Restrictions
    "no-restricted-imports": [
      "error",
      {
        "paths": [
          {
            "name": "tamagui",
            "importNames": ["XStack", "YStack"],
            "message": "Use Row/Column from @buttergolf/ui instead"
          }
        ]
      }
    ],

    // React Rules
    "react/prop-types": "off", // Using TypeScript for prop validation
    "react/react-in-jsx-scope": "off" // Not needed in React 17+
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

## Integration with CI/CD

Add ESLint checks to your CI/CD pipeline:

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 10.20.0
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run ESLint
        run: pnpm lint
      
      - name: Check types
        run: pnpm check-types
```

## Pre-commit Hooks

Set up pre-commit hooks using Husky:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

## VS Code Integration

Add these settings to `.vscode/settings.json`:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

## Benefits

These ESLint rules provide:

1. **Consistency** - Enforces consistent patterns across the codebase
2. **Early Detection** - Catches issues during development, not in production
3. **Better DX** - Auto-fixes common issues and provides helpful error messages
4. **Type Safety** - Ensures proper TypeScript usage with layout components
5. **Performance** - Encourages tree-shaking with type-only imports

## Migration Guide

If you're adding these rules to an existing codebase:

1. Start with warnings instead of errors:
   ```json
   {
     "rules": {
       "no-restricted-imports": "warn",
       "@typescript-eslint/consistent-type-imports": "warn"
     }
   }
   ```

2. Run ESLint with auto-fix:
   ```bash
   pnpm eslint --fix "**/*.{ts,tsx}"
   ```

3. Review and test changes thoroughly

4. Upgrade warnings to errors once all issues are resolved

5. Add to CI/CD pipeline

## Additional Resources

- [ESLint Documentation](https://eslint.org/docs/latest/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [ESLint React Plugin](https://github.com/jsx-eslint/eslint-plugin-react)
- [Creating Custom ESLint Rules](https://eslint.org/docs/latest/extend/custom-rules)
