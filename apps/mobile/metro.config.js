const { getDefaultConfig } = require('expo/metro-config');
const { FileStore } = require('metro-cache');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// #1 - Watch all files in the monorepo
config.watchFolders = [workspaceRoot];

// #2 - Try resolving with project modules first, then workspace modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// #3 - Force Metro to resolve (sub)dependencies only from the `nodeModulesPaths`
config.resolver.disableHierarchicalLookup = true;

// #3.1 - Block web-only testing packages from being bundled (they use SharedArrayBuffer which Hermes doesn't support)
// IMPORTANT: Only block jsdom and its SPECIFIC dependencies that cause issues
// Do NOT block webidl-conversions globally as older versions (3.x, 5.x) are needed by legitimate RN packages
config.resolver.blockList = [
  // jsdom itself (web-only testing library)
  /.*\/node_modules\/jsdom\/.*/,
  // Only block webidl-conversions@8.x (the version that uses SharedArrayBuffer)
  /.*\/node_modules\/\.pnpm\/webidl-conversions@8\.[^/]+\/.*/,
  // happy-dom (alternative to jsdom, also web-only)
  /.*\/node_modules\/happy-dom\/.*/,
  // Vitest and testing utilities (dev-only, not needed in app bundle)
  /.*\/node_modules\/vitest\/.*/,
  /.*\/node_modules\/@vitest\/.*/,
  /.*\/node_modules\/@testing-library\/react\/.*/,
  /.*\/node_modules\/@testing-library\/jest-dom\/.*/,
];

// #3.5 - Configure SVG support with react-native-svg-transformer
const { transformer, resolver } = config;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...resolver.sourceExts, 'svg'],
};

// #4 - Use turborepo to restore the cache when possible
config.cacheStores = [
  new FileStore({
    root: path.join(projectRoot, 'node_modules', '.cache', 'metro'),
  }),
];

module.exports = config;
