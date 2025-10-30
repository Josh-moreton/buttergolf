import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@my-scope/ui'],
  webpack: (config) => {
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
    }
    return config
  },
}

export default nextConfig
