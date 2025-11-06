// Type-only import to avoid bundling @prisma/client in React Native.
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { PrismaClient } from '@prisma/client'

// Determine if we're running in a React Native environment.
const isReactNative =
    typeof navigator !== 'undefined' && (navigator as any).product === 'ReactNative'

// Compute prisma instance in an IIFE so we can export a const.
const prisma: PrismaClient = (() => {
    if (isReactNative) {
        // Provide a minimal stub so imports from '@buttergolf/db' don't crash mobile.
        // Consumers should call backend API endpoints instead of using prisma directly.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const prismaStub: any = new Proxy(
            {},
            {
                get() {
                    throw new Error(
                        'Prisma Client is not available in React Native. Use server API routes instead.'
                    )
                }
            }
        )
        return prismaStub as unknown as PrismaClient
    }

    // PrismaClient is attached to the `global` object in development to prevent
    // exhausting your database connection limit.
    const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

    const { PrismaClient: PrismaClientRuntime } = require('@prisma/client') as {
        PrismaClient: new (...args: any[]) => PrismaClient
    }

    const instance =
        globalForPrisma.prisma ??
        new PrismaClientRuntime({
            log:
                process.env.NODE_ENV === 'development'
                    ? ['query', 'error', 'warn']
                    : ['error']
        } as any)

    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = instance

    return instance
})()

export { prisma }
export * from './constants/categories'
