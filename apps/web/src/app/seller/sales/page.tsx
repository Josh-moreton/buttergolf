import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@buttergolf/db";
import { SalesOrdersList } from "./SalesOrdersList";

export const revalidate = 60; // ISR: Revalidate every 60 seconds

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

  // Fetch stats and orders in parallel for better performance
  const [stats, orders] = await Promise.all([
    // Database aggregation for stats (faster than in-memory filtering)
    Promise.all([
      prisma.order.count({ where: { sellerId: user.id } }),
      prisma.order.count({
        where: { sellerId: user.id, status: "PAYMENT_CONFIRMED" },
      }),
      prisma.order.count({ where: { sellerId: user.id, status: "SHIPPED" } }),
      prisma.order.count({ where: { sellerId: user.id, status: "DELIVERED" } }),
      prisma.order.aggregate({
        where: { sellerId: user.id },
        _sum: { stripeSellerPayout: true },
      }),
    ]).then(([total, awaitingLabel, shipped, delivered, revenueAgg]) => ({
      total,
      awaitingLabel,
      shipped,
      delivered,
      revenue: revenueAgg._sum.stripeSellerPayout || 0,
    })),

    // Fetch full orders separately
    prisma.order.findMany({
      where: { sellerId: user.id },
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
    }),
  ]);

  return <SalesOrdersList orders={orders} stats={stats} />;
}
