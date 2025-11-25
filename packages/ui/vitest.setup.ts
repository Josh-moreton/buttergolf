/// <reference types="@testing-library/jest-dom/vitest" />
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Mock matchMedia for jsdom environment (must be sync and before any Tamagui imports)
Object.defineProperty(globalThis.window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Cleanup after each test
afterEach(() => {
  cleanup()
})
