import { auth, clerkClient } from "@clerk/nextjs/server";

/**
 * Get user ID from either Clerk session (web) or Bearer token (mobile).
 *
 * Web apps send cookies with Clerk session automatically.
 * Mobile apps send Authorization: Bearer <token> header.
 *
 * This function tries both methods to support cross-platform authentication.
 * Uses Clerk's modern authenticateRequest() API (not legacy JWT verification).
 *
 * @param request - The NextRequest object containing headers
 * @returns The Clerk user ID (userId), or null if authentication fails
 */
export async function getUserIdFromRequest(
  request?: Request,
): Promise<string | null> {
  // First try Clerk's built-in auth (works for web with cookies)
  const { userId } = await auth();
  if (userId) {
    return userId;
  }

  // If no session and no request provided, authentication failed
  if (!request) {
    return null;
  }

  // If no session, try to authenticate the request (for mobile Bearer tokens)
  // This uses Clerk's modern authenticateRequest() API
  try {
    const client = await clerkClient();
    const requestState = await client.authenticateRequest(request);

    if (requestState.isAuthenticated) {
      const authObject = requestState.toAuth();
      return authObject.userId;
    }
  } catch (error) {
    console.error("Request authentication failed:", error);
  }

  return null;
}
