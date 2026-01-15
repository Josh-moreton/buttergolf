import { auth, clerkClient } from "@clerk/nextjs/server";
import { verifyToken } from "@clerk/backend";

/**
 * Get user ID from either Clerk session (web) or Bearer token (mobile).
 *
 * Web apps send cookies with Clerk session automatically.
 * Mobile apps send Authorization: Bearer <token> header.
 *
 * Authentication Strategy:
 * 1. If Bearer token present → use verifyToken() for direct JWT validation (mobile)
 * 2. If no Bearer token but Request provided → use authenticateRequest() for cookies (web API routes)
 * 3. If no Request → use auth() for ambient context (server components)
 *
 * IMPORTANT: authenticateRequest() does NOT handle Bearer tokens - it only handles cookies.
 * Mobile apps MUST use verifyToken() for Bearer token validation.
 *
 * @param request - Optional Request object. If omitted, only cookie-based session
 *                  authentication is attempted (suitable for server components).
 *                  When provided, enables Bearer token authentication for mobile clients.
 * @returns The Clerk user ID (userId), or null if user is not authenticated
 */
export async function getUserIdFromRequest(
  request?: Request,
): Promise<string | null> {
  if (request) {
    // Check for Bearer token (mobile apps)
    const authHeader = request.headers.get("Authorization");

    // Debug: Log ALL headers to understand what's arriving
    const allHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      // Redact sensitive values but show they exist
      if (key.toLowerCase() === 'authorization') {
        allHeaders[key] = value ? `Bearer [${value.length} chars]` : 'EMPTY';
      } else if (key.toLowerCase().includes('cookie')) {
        allHeaders[key] = `[${value.length} chars]`;
      } else {
        allHeaders[key] = value.substring(0, 100);
      }
    });
    
    console.log("[Auth] Request headers debug:", {
      hasAuthHeader: !!authHeader,
      authHeaderPrefix: authHeader?.substring(0, 20),
      userAgent: request.headers.get("User-Agent")?.substring(0, 50),
      url: request.url,
      method: request.method,
      allHeaderKeys: Object.keys(allHeaders),
      allHeaders,
    });

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7).trim(); // Remove "Bearer " prefix

      if (!token) {
        console.log("[Auth] Empty Bearer token");
        return null;
      }

      try {
        // Use verifyToken for direct JWT validation (mobile apps)
        // This is the correct method for Bearer tokens - authenticateRequest() only handles cookies
        const payload = await verifyToken(token, {
          secretKey: process.env.CLERK_SECRET_KEY,
        });

        console.log("[Auth] Bearer token verified successfully:", {
          userId: payload.sub,
        });

        return payload.sub; // sub is the user ID
      } catch (error) {
        console.log("[Auth] Bearer token verification failed:", {
          error: error instanceof Error ? error.message : "Unknown error",
        });
        return null;
      }
    }

    // No Bearer token - try cookie-based authentication (web requests)
    const client = await clerkClient();
    const state = await client.authenticateRequest(request, {
      authorizedParties: [],
    });

    if (!state.isAuthenticated) {
      console.log("[Auth] Cookie auth failed:", {
        reason: state.reason,
      });
      return null;
    }

    return state.toAuth().userId;
  }

  // No Request object - use ambient auth context (server components)
  const { userId } = await auth();
  return userId ?? null;
}
