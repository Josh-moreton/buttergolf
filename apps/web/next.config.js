const { withTamagui } = require('@tamagui/next-plugin')

module.exports = function (_name, { defaultConfig }) {
  const tamaguiPlugin = withTamagui({
    config: '../../packages/ui/tamagui.config.ts',
    components: ['tamagui'],
    appDir: true,
    outputCSS:
      process.env.NODE_ENV === 'production' ? './public/tamagui.css' : null,
    disableExtraction: process.env.NODE_ENV === 'development',
  })

  const nextConfig = tamaguiPlugin({
    ...defaultConfig,
    transpilePackages: [
      '@buttergolf/ui',
      '@buttergolf/app',
      'solito',
      'tamagui',
      'react-native',
      'react-native-web',
      '@tamagui/core',
      '@tamagui/button',
      '@tamagui/text',
      '@tamagui/config',
    ],
  })

  const existingWebpack = nextConfig.webpack

  nextConfig.webpack = (webpackConfig, context) => {
    if (typeof existingWebpack === 'function') {
      webpackConfig = existingWebpack(webpackConfig, context)
    }

    webpackConfig.resolve = webpackConfig.resolve || {}
    webpackConfig.resolve.alias = webpackConfig.resolve.alias || {}
    webpackConfig.resolve.alias['react-native$'] = 'react-native-web'

    return webpackConfig
  }

  return nextConfig
}
