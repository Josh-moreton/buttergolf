import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui } from 'tamagui'

// Use v4 config with shorthands included
export const config = createTamagui(defaultConfig)

export type AppConfig = typeof config

declare module 'tamagui' {
    interface TamaguiCustomConfig extends AppConfig { }
}

export default config
