import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from '../../vitest.config'
import { resolve } from 'path'

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      name: '@buttergolf/ui',
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.ts'],
    },
    esbuild: {
      // Let esbuild handle TypeScript without resolving tsconfig extends
      tsconfigRaw: {
        compilerOptions: {
          jsx: 'react-jsx',
          skipLibCheck: true,
        },
      },
    },
  })
)
