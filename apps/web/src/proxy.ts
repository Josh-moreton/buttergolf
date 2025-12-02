import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/sell(.*)",
  "/dashboard(.*)",
  "/profile(.*)",
  "/api/upload(.*)",
]);

// Routes that should be accessible even when coming soon mode is enabled
const isComingSoonAllowedRoute = createRouteMatcher([
  "/coming-soon",
  "/api/(.*)",
  "/_next/(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Coming soon mode - redirect all traffic to coming soon page
  const isComingSoonEnabled =
    process.env.NEXT_PUBLIC_COMING_SOON_ENABLED === "true";

  if (isComingSoonEnabled && !isComingSoonAllowedRoute(req)) {
    return NextResponse.redirect(new URL("/coming-soon", req.url));
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
