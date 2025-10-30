const { withTamagui } = require('@tamagui/next-plugin')

module.exports = function (name, { defaultConfig }) {
  let config = {
    ...defaultConfig,
    transpilePackages: [
      '@buttergolf/ui',
      'tamagui',
      'react-native-web',
      '@tamagui/core',
      '@tamagui/button',
      '@tamagui/text',
      '@tamagui/config',
    ],
  }

  const tamaguiPlugin = withTamagui({
    config: '../../packages/ui/tamagui.config.ts',
    components: ['tamagui'],
    appDir: true,
    outputCSS: process.env.NODE_ENV === 'production' ? './public/tamagui.css' : null,
    disableExtraction: process.env.NODE_ENV === 'development',
  })

  return {
    ...config,
    ...tamaguiPlugin(config),
  }
}
