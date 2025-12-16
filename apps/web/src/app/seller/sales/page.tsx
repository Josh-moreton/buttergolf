import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@buttergolf/db";
import { SalesOrdersList } from "./SalesOrdersList";

export const dynamic = "force-dynamic";

export default async function SellerSalesPage() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    redirect("/sign-in");
  }

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch seller's orders (orders where they are the seller)
  const orders = await prisma.order.findMany({
    where: {
      sellerId: user.id,
    },
    include: {
      product: {
        include: {
          images: {
            orderBy: { sortOrder: "asc" },
            take: 1,
          },
        },
      },
      buyer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          imageUrl: true,
        },
      },
      toAddress: true,
      fromAddress: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Calculate stats
  const stats = {
    total: orders.length,
    awaitingLabel: orders.filter((o) => o.status === "PAYMENT_CONFIRMED").length,
    shipped: orders.filter((o) => o.status === "SHIPPED").length,
    delivered: orders.filter((o) => o.status === "DELIVERED").length,
    revenue: orders.reduce((sum, o) => sum + (o.stripeSellerPayout || 0), 0),
  };

  return <SalesOrdersList orders={orders} stats={stats} />;
}
