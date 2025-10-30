import type { NextConfig } from 'next'

const { withTamagui } = require('@tamagui/next-plugin')

const nextConfig: NextConfig = {
  transpilePackages: ['@buttergolf/ui', 'tamagui', 'react-native-web'],
}

module.exports = withTamagui(nextConfig, {
  components: ['tamagui'],
  config: '../../packages/ui/tamagui.config.ts',
  outputCSS: process.env.NODE_ENV === 'production' ? './public/tamagui.css' : null,
  disableExtraction: process.env.NODE_ENV === 'development',
})
