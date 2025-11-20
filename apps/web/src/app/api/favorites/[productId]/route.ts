import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@buttergolf/db";

/**
 * DELETE /api/favorites/[productId]
 * Remove a product from the authenticated user's favorites
 */
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ productId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await context.params;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Delete favorite using unique constraint
    try {
      await prisma.favorite.delete({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: "Product removed from favorites",
        },
        { status: 200 }
      );
    } catch (error: unknown) {
      // Handle case where favorite doesn't exist
      if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
        return NextResponse.json(
          { error: "Favorite not found" },
          { status: 404 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Error removing favorite:", error);
    return NextResponse.json(
      { error: "Failed to remove favorite" },
      { status: 500 }
    );
  }
}
