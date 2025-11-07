import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@buttergolf/db";

type Params = {
    params: {
        id: string;
    };
};

// PUT /api/addresses/[id] - Update address
export async function PUT(request: NextRequest, { params }: Params) {
    try {
        const { userId: clerkUserId } = await auth();
        if (!clerkUserId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const {
            name,
            street1,
            street2,
            city,
            state,
            zip,
            country = "US",
            phone,
            isDefault,
        } = body;

        // Validate required fields
        if (!name || !street1 || !city || !state || !zip) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { clerkId: clerkUserId },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if address exists and belongs to user
        const existingAddress = await prisma.address.findFirst({
            where: {
                id: params.id,
                userId: user.id,
            },
        });

        if (!existingAddress) {
            return NextResponse.json({ error: "Address not found" }, { status: 404 });
        }

        // If this is being set as default, unset all other defaults
        if (isDefault) {
            await prisma.address.updateMany({
                where: {
                    userId: user.id,
                    id: { not: params.id }, // Exclude current address
                },
                data: { isDefault: false },
            });
        }

        // Update address
        const address = await prisma.address.update({
            where: { id: params.id },
            data: {
                name,
                street1,
                street2: street2 || null,
                city,
                state,
                zip,
                country,
                phone: phone || null,
                isDefault: isDefault || false,
            },
        });

        return NextResponse.json(address);
    } catch (error) {
        console.error("Error updating address:", error);
        return NextResponse.json(
            { error: "Failed to update address" },
            { status: 500 }
        );
    }
}

// DELETE /api/addresses/[id] - Delete address
export async function DELETE(request: NextRequest, { params }: Params) {
    try {
        const { userId: clerkUserId } = await auth();
        if (!clerkUserId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { clerkId: clerkUserId },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if address exists and belongs to user
        const existingAddress = await prisma.address.findFirst({
            where: {
                id: params.id,
                userId: user.id,
            },
        });

        if (!existingAddress) {
            return NextResponse.json({ error: "Address not found" }, { status: 404 });
        }

        // Check if address is used in any orders
        const ordersCount = await prisma.order.count({
            where: {
                OR: [
                    { fromAddressId: params.id },
                    { toAddressId: params.id },
                ],
            },
        });

        if (ordersCount > 0) {
            return NextResponse.json(
                { error: "Cannot delete address that is used in orders" },
                { status: 400 }
            );
        }

        // Delete address
        await prisma.address.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting address:", error);
        return NextResponse.json(
            { error: "Failed to delete address" },
            { status: 500 }
        );
    }
}