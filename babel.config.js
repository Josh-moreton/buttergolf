module.exports = function (api) {
  api.cache(true)
  return {
    presets: [],
    plugins: ['tamagui/babel', ['module-resolver', { root: ['./'] }]],
  }
}
