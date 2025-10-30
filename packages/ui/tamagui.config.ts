import { defaultConfig } from '@tamagui/config/v4'
import { shorthands } from '@tamagui/shorthands'
import { createTamagui } from 'tamagui'

export const config = createTamagui({
    ...defaultConfig,
    shorthands: {
        ...(defaultConfig.shorthands ?? {}),
        ...shorthands,
    },
})

export type AppConfig = typeof config

export default config
