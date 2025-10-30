import { createTamagui } from 'tamagui'
import { config as configBase } from '@tamagui/config/v3'

// You can also use a subset of the config, or create your own
export const config = createTamagui({
  ...configBase,
  // Override or extend the base config here
})

export type AppConfig = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config
