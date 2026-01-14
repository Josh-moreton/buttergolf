import { auth } from "@clerk/nextjs/server";
import { verifyToken } from "@clerk/backend";

/**
 * Get user ID from either Clerk session (web) or Bearer token (mobile).
 *
 * Web apps send cookies with Clerk session automatically.
 * Mobile apps send Authorization: Bearer <token> header.
 *
 * This function tries both methods to support cross-platform authentication.
 * Uses CLERK_JWT_KEY for networkless verification (faster, no API call to Clerk).
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

  // If no session, try to verify Bearer token (for mobile apps)
  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    try {
      // Use JWT key for networkless verification (faster than secretKey)
      // Falls back to secretKey if jwtKey not available
      const jwtKey = process.env.CLERK_JWT_KEY;
      const secretKey = process.env.CLERK_SECRET_KEY;

      if (!jwtKey && !secretKey) {
        console.error(
          "Neither CLERK_JWT_KEY nor CLERK_SECRET_KEY is configured",
        );
        return null;
      }

      const payload = await verifyToken(token, {
        // Prefer jwtKey for networkless verification, fall back to secretKey
        ...(jwtKey ? { jwtKey } : { secretKey }),
      });
      return payload.sub; // sub is the user ID
    } catch (error) {
      console.error("Token verification failed:", error);
      return null;
    }
  }

  return null;
}
