/**
 * Define your app routes here.
 * These routes are shared between Next.js and Expo.
 */
export const routes = {
    home: '/',
    rounds: '/rounds',
    roundDetail: '/rounds/[id]',
    products: '/products',
    productDetail: '/products/[id]',
} as const

export type AppRoutes = typeof routes
