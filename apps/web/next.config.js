const { withTamagui } = require('@tamagui/next-plugin')
const { join } = require('node:path')

const disableExtraction =
  process.env.DISABLE_EXTRACTION === 'true' || process.env.NODE_ENV === 'development'

const plugins = [
  withTamagui({
    config: '../../packages/config/src/tamagui.config.ts',
    components: ['tamagui', '@buttergolf/ui'],
    appDir: true,
    outputCSS: process.env.NODE_ENV === 'production' ? './public/tamagui.css' : null,
    disableExtraction,
    shouldExtract: (path) => path.includes(join('packages', 'app')),
  }),
]

const createNextConfig = () => {
  /** @type {import('next').NextConfig} */
  let config = {
    transpilePackages: [
      '@buttergolf/app',
      '@buttergolf/config',
      '@buttergolf/ui',
      'react-native',
      'react-native-web',
      'solito',
      'tamagui',
    ],
    experimental: {
      scrollRestoration: true,
    },
  }

  for (const plugin of plugins) {
    config = {
      ...config,
      ...plugin(config),
    }
  }

  return config
}

module.exports = createNextConfig
