import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const session = await auth();

  return Response.json(
    {
      message: "Clerk session debug info from auth() in middleware",
      userId: session?.userId,
      sessionId: session?.sessionId,
      sessionClaims: session?.sessionClaims,
      actor: session?.actor,
    },
    { status: 200 }
  );
}
