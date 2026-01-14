import { auth, clerkClient } from "@clerk/nextjs/server";

/**
 * Get user ID from either Clerk session (web) or Bearer token (mobile).
 *
 * Web apps send cookies with Clerk session automatically.
 * Mobile apps send Authorization: Bearer <token> header.
 *
 * Uses Clerk's authenticateRequest() API which validates the complete HTTP request,
 * including session cookies, Bearer tokens, and request state.
 *
 * Authentication Strategy:
 * 1. If a Request is provided, authenticate it directly (handles both cookies and Bearer tokens)
 * 2. Otherwise, fall back to Next.js ambient auth context (cookie-based web flows)
 *
 * Error Handling:
 * - Returns null for expected authentication failures (invalid/expired tokens, no auth)
 * - Throws exceptions for unexpected failures (network errors, config issues)
 * - Calling code should handle exceptions and return appropriate HTTP error responses
 *
 * @param request - Optional Request object. If omitted, only cookie-based session
 *                  authentication is attempted (suitable for server components).
 *                  When provided, enables Bearer token authentication for mobile clients.
 * @returns The Clerk user ID (userId), or null if user is not authenticated
 * @throws Error if authentication system fails (network, config, etc.)
 */
export async function getUserIdFromRequest(
  request?: Request,
): Promise<string | null> {
  // If we have a concrete Request, authenticate *that* directly.
  // authenticateRequest() handles both cookies and Authorization: Bearer tokens.
  if (request) {
    const client = await clerkClient();
    const state = await client.authenticateRequest(request);

    if (!state.isAuthenticated) {
      // Expected case: user not authenticated or invalid token
      return null;
    }

    const authObject = state.toAuth();
    return authObject.userId;
  }

  // Otherwise fall back to Next.js ambient request auth (cookie-based web flows).
  // This is used when no Request object is available (server components, edge cases).
  const { userId } = await auth();
  return userId ?? null;
}
