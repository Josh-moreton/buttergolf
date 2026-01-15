import { auth } from "@clerk/nextjs/server";

/**
 * Get user ID using Clerk's Next.js SDK auth() helper.
 *
 * This uses Clerk's official recommended pattern for Next.js applications:
 * - auth({ acceptsToken: 'session_token' }) handles both cookies (web) and
 *   Bearer tokens (mobile) automatically through Clerk's middleware integration.
 *
 * The acceptsToken parameter tells Clerk to accept session tokens from:
 * 1. Cookies (__session) - for same-origin web requests
 * 2. Authorization header (Bearer token) - for cross-origin mobile requests
 *
 * This is the official Clerk Next.js SDK pattern and works correctly with
 * Vercel's edge network and Next.js middleware.
 *
 * @param _request - Optional Request object (kept for API compatibility, not used)
 * @returns The Clerk user ID (userId), or null if user is not authenticated
 */
export async function getUserIdFromRequest(
  _request?: Request,
): Promise<string | null> {
  // Use Clerk's official auth() helper with acceptsToken parameter
  // This is the recommended pattern for Next.js applications per Clerk docs:
  // https://clerk.com/docs/nextjs/guides/development/verifying-oauth-access-tokens
  const { isAuthenticated, userId } = await auth({
    acceptsToken: "session_token",
  });

  if (!isAuthenticated || !userId) {
    console.log("[Auth] Not authenticated via auth({ acceptsToken: 'session_token' })");
    return null;
  }

  console.log("[Auth] Authenticated successfully:", { userId });
  return userId;
}
