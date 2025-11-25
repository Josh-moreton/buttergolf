import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Base Vitest configuration shared across all packages
// NOTE: Using 'node' environment - DOM-based tests should be in apps/web
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node',
    // setupFiles: ['./vitest.setup.ts'], // Disabled - was for jsdom
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        '.next/',
        '.expo/',
        '**/*.config.ts',
        '**/*.config.js',
        '**/types.ts',
        '**/*.d.ts',
        'apps/mobile/**', // Mobile uses React Native, not DOM
      ],
    },
    include: ['**/*.{test,spec}.{ts,tsx}'],
    exclude: [
      'node_modules',
      'dist',
      '.next',
      '.expo',
      'apps/mobile/**', // Exclude mobile from web-based tests
    ],
  },
  esbuild: {
    // Bypass tsconfig.json resolution issues in monorepo
    // Provide TypeScript settings directly instead of loading from extends
    tsconfigRaw: {
      compilerOptions: {
        target: 'ES2020',
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        jsx: 'react-jsx',
        jsxImportSource: 'react',
        module: 'ESNext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        esModuleInterop: true,
        skipLibCheck: true,
        strict: true,
      },
    },
  },
  resolve: {
    alias: {
      '@buttergolf/ui': resolve(__dirname, 'packages/ui/src'),
      '@buttergolf/app': resolve(__dirname, 'packages/app/src'),
      '@buttergolf/config': resolve(__dirname, 'packages/config/src'),
      '@buttergolf/db': resolve(__dirname, 'packages/db'),
      '@buttergolf/constants': resolve(__dirname, 'packages/constants/src'),
    },
  },
})
