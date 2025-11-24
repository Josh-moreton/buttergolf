import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@buttergolf/db";
import { OfferDetailClient } from "./_components/OfferDetailClient";

/**
 * Server Component: Offer Detail Page
 * 
 * Fetches offer data with full conversation history and product details.
 * Performs authorization checks (user must be buyer or seller).
 * Passes data to client component for interactive UI.
 * 
 * Route: /offers/[id]
 */

// Force dynamic rendering (disable static generation)
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OfferDetailPage({ params }: PageProps) {
  // Authenticate user
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    redirect("/sign-in");
  }

  // Fetch user from database
  const user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    redirect("/sign-in");
  }

  // Resolve params (Next.js 15+ requirement)
  const { id } = await params;

  // Fetch offer with all related data
  const offer = await prisma.offer.findUnique({
    where: { id },
    include: {
      product: {
        include: {
          images: {
            orderBy: { sortOrder: "asc" },
          },
          user: true, // Seller info
        },
      },
      buyer: true,
      seller: true,
      counterOffers: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  // Handle not found
  if (!offer) {
    redirect("/offers");
  }

  // Authorization check: user must be buyer or seller
  if (offer.buyerId !== user.id && offer.sellerId !== user.id) {
    redirect("/offers");
  }

  // Note: Expiration check is handled in the API route (GET /api/offers/[id])
  // This ensures real-time expiration updates via polling

  return (
    <OfferDetailClient
      offer={offer}
      currentUserId={user.id}
    />
  );
}
