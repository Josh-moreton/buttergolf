'use client'

import '@tamagui/core/reset.css'
import '@tamagui/font-inter/css/400.css'
import '@tamagui/font-inter/css/700.css'

import type { ReactNode } from 'react'
import { StyleSheet } from 'react-native'
import { useServerInsertedHTML } from 'next/navigation'
import { config } from '@buttergolf/ui'

import { Provider } from './Provider'

export function NextTamaguiProvider({ children }: Readonly<{ children: ReactNode }>) {
  useServerInsertedHTML(() => {
    const rnwSheet = (StyleSheet as unknown as { getSheet?: () => { id: string; textContent: string } }).getSheet?.()

    return (
      <>
        {rnwSheet ? (
          <style id={rnwSheet.id} dangerouslySetInnerHTML={{ __html: rnwSheet.textContent }} />
        ) : null}
        <style
          dangerouslySetInnerHTML={{
            __html: config.getNewCSS({
              exclude: process.env.NODE_ENV === 'production' ? 'design-system' : null,
            }),
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: config.getCSS({
              exclude: process.env.NODE_ENV === 'production' ? 'design-system' : null,
            }),
          }}
        />
      </>
    )
  })

  return (
    <Provider defaultTheme="light">
      {children}
    </Provider>
  )
}
