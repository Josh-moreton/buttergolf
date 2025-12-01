import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@buttergolf/db";

/**
 * DELETE /api/favourites/[productId]
 * Remove a product from the authenticated user's favourites
 */
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ productId: string }> }
) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await context.params;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Delete favourite using unique constraint
    try {
      await prisma.favorite.delete({
        where: {
          userId_productId: {
            userId: user.id,
            productId,
          },
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: "Product removed from favourites",
        },
        { status: 200 }
      );
    } catch (error: unknown) {
      // Handle case where favourite doesn't exist
      if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
        return NextResponse.json(
          { error: "Favourite not found" },
          { status: 404 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Error removing favourite:", error);
    return NextResponse.json(
      { error: "Failed to remove favourite" },
      { status: 500 }
    );
  }
}
