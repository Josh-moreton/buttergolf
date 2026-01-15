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
 * IMPORTANT: We pass an empty authorizedParties array to skip azp (authorized party) validation.
 * This is required for mobile apps where tokens don't have a web Origin, and maintains
 * compatibility with the original behavior before the authenticateRequest() migration.
 *
 * @param request - Optional Request object. If omitted, only cookie-based session
 *                  authentication is attempted (suitable for server components).
 *                  When provided, enables Bearer token authentication for mobile clients.
 * @returns The Clerk user ID (userId), or null if user is not authenticated
 */
export async function getUserIdFromRequest(
  request?: Request,
): Promise<string | null> {
  // If we have a concrete Request, authenticate *that* directly.
  // authenticateRequest() handles both cookies and Authorization: Bearer tokens.
  if (request) {
    const client = await clerkClient();

    // Pass empty authorizedParties to skip azp validation.
    // This is required for mobile apps (Bearer tokens) where the azp claim
    // may be null or different from web URLs. Web requests (cookies) also
    // work fine with this since Clerk still validates the session itself.
    const state = await client.authenticateRequest(request, {
      authorizedParties: [],
    });

    if (!state.isAuthenticated) {
      // Log for debugging authentication failures
      const isBearerToken = request.headers
        .get("Authorization")
        ?.startsWith("Bearer ");
      console.log("[Auth] Authentication failed:", {
        reason: state.reason,
        isBearerToken,
      });
      return null;
    }

    return state.toAuth().userId;
  }

  // Otherwise fall back to Next.js ambient request auth (cookie-based web flows).
  // This is used when no Request object is available (server components, edge cases).
  const { userId } = await auth();
  return userId ?? null;
}
