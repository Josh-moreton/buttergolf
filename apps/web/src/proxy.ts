import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/sell(.*)",
  "/seller(.*)", // Seller dashboard with Stripe Connect components
  "/dashboard(.*)",
  "/profile(.*)",
  "/api/upload(.*)",
]);

// Routes that should be accessible even when coming soon mode is enabled
const isComingSoonAllowedRoute = createRouteMatcher([
  "/coming-soon",
  "/api/(.*)",
  "/_next/(.*)",
  "/sign-in(.*)", // Allow sign-in for admin bypass
  "/sign-up(.*)", // Allow sign-up for admin bypass
]);

export default clerkMiddleware(async (auth, req) => {
  // Handle CORS preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    const origin = req.headers.get("origin");
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": origin || "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  // Coming soon mode - redirect all traffic to coming soon page (unless admin)
  const isComingSoonEnabled =
    process.env.NEXT_PUBLIC_COMING_SOON_ENABLED === "true";

  if (isComingSoonEnabled && !isComingSoonAllowedRoute(req)) {
    // Check if user is an authenticated admin who can bypass coming soon
    const session = await auth();
    const isAdmin =
      (session?.sessionClaims?.metadata as { role?: string })?.role === "admin";

    if (!isAdmin) {
      return NextResponse.redirect(new URL("/coming-soon", req.url));
    }
  }

  // Only protect specific routes, leave everything else public
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
