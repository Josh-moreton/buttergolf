import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock Clerk
vi.mock('@clerk/nextjs', () => ({
  auth: vi.fn(() => ({ userId: 'test-user-id' })),
  currentUser: vi.fn(() => Promise.resolve({ id: 'test-user-id' })),
  useUser: vi.fn(() => ({ user: { id: 'test-user-id' }, isLoaded: true })),
  useAuth: vi.fn(() => ({ userId: 'test-user-id', isLoaded: true })),
  ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// Suppress console errors in tests (optional)
// global.console.error = vi.fn()
// global.console.warn = vi.fn()
