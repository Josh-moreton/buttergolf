'use client'

import { NextTamaguiProvider as BaseProvider } from '@buttergolf/app'
import type { ReactNode } from 'react'

export function NextTamaguiProvider({ children }: { children: ReactNode }) {
	return <BaseProvider>{children}</BaseProvider>
}
