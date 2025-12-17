/**
 * Define your app routes here.
 * These routes are shared between Next.js and Expo.
 */
export const routes = {
  home: "/",
  rounds: "/rounds",
  roundDetail: "/rounds/[id]",
  products: "/products",
  productDetail: "/products/[id]",
  category: "/category/[slug]",
  sell: "/sell",
  orders: "/orders",
  orderDetail: "/orders/[id]",
  messages: "/messages",
  signIn: "/sign-in",
  signUp: "/sign-up",
  verifyEmail: "/verify-email",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
} as const;

export type AppRoutes = typeof routes;
