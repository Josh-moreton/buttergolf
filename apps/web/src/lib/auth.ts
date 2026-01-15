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
 * IMPORTANT: authorizedParties must be configured for cross-origin requests (mobile apps).
 * Mobile apps don't have a web Origin header, so we use an empty array to skip azp validation,
 * allowing tokens from both web and mobile clients.
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

    // Determine if this is a Bearer token request (mobile) vs cookie request (web).
    // Mobile apps send Authorization: Bearer <token>, web apps send cookies.
    const authHeader = request.headers.get("Authorization");
    const isBearerTokenRequest = authHeader?.startsWith("Bearer ");

    // Build authorized parties list for cross-origin token validation.
    // The azp (authorized party) claim in JWTs must match one of these values.
    //
    // For Bearer token requests (mobile apps):
    //   - Use empty array to skip azp validation
    //   - Mobile tokens may have null/different azp that won't match web URLs
    //   - CSRF isn't a concern for Bearer tokens (must be explicitly sent)
    //
    // For cookie-based requests (web apps):
    //   - Validate azp against known web app URLs
    //   - This prevents CSRF attacks where cookies are auto-sent
    let authorizedParties: string[] = [];

    if (!isBearerTokenRequest) {
      // Web request - validate azp against known URLs
      if (process.env.NEXT_PUBLIC_APP_URL) {
        authorizedParties.push(process.env.NEXT_PUBLIC_APP_URL);
      }
      if (process.env.NODE_ENV === "development") {
        authorizedParties.push("http://localhost:3000");
      }
    }
    // For Bearer token requests, authorizedParties stays empty (skips azp validation)

    const state = await client.authenticateRequest(request, {
      authorizedParties,
    });

    if (!state.isAuthenticated) {
      // Log for debugging authentication failures
      console.log("[Auth] Authentication failed:", {
        reason: state.reason,
        isBearerTokenRequest,
        authorizedPartiesCount: authorizedParties.length,
      });
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
