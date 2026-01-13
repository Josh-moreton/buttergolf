module.exports = function (api) {
  api.cache(true)
  return {
    presets: [],
    plugins: ['@tamagui/babel-plugin', ['module-resolver', { root: ['./'] }]],
    // Prevent Next.js (apps/web) from using this root Babel config.
    // Next should use its default SWC pipeline (and @tamagui/next-plugin),
    // while mobile (Expo) uses its own Babel config in apps/mobile.
    ignore: ['apps/web/**/*'],
  }
}
