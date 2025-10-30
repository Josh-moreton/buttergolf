import { createTamagui } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v4'

// You can also use a subset of the config, or create your own
export const config = createTamagui({
    ...defaultConfig,
    // Override or extend the base config here
})

export type AppConfig = typeof config

declare module 'tamagui' {
    interface TamaguiCustomConfig extends AppConfig { }
}

export default config
