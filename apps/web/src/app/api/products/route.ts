import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@buttergolf/db';
import { ProductCondition } from '@prisma/client';

export async function POST(request: Request) {
    try {
        // Authenticate user
        const { userId: clerkId } = await auth();

        if (!clerkId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get or create user from database
        // This ensures user exists even if webhook hasn't fired yet
        let user = await prisma.user.findUnique({
            where: { clerkId },
        });

        if (!user) {
            // Create user if not found (fallback for webhook delays)
            // In production, the webhook should handle this
            user = await prisma.user.create({
                data: {
                    clerkId,
                    email: `user-${clerkId}@temp.local`, // Temporary email, will be updated by webhook
                    name: null,
                    imageUrl: null,
                },
            });
        }

        // Parse request body
        const body = await request.json();
        const {
            title,
            description,
            price,
            condition,
            brand,
            model,
            categoryId,
            images,
            // Shipping dimensions
            length,
            width,
            height,
            weight,
        } = body;

        // Validate required fields
        if (!title || !description || !price || !categoryId || !condition) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (!images || images.length === 0) {
            return NextResponse.json(
                { error: 'At least one image is required' },
                { status: 400 }
            );
        }

        // Validate condition enum
        if (!Object.values(ProductCondition).includes(condition)) {
            return NextResponse.json(
                { error: 'Invalid condition value' },
                { status: 400 }
            );
        }

        // Create product with images
        const product = await prisma.product.create({
            data: {
                title,
                description,
                price: Number(price),
                condition,
                brand: brand || null,
                model: model || null,
                userId: user.id,
                categoryId,
                // Shipping dimensions
                length: length ? Number(length) : null,
                width: width ? Number(width) : null,
                height: height ? Number(height) : null,
                weight: weight ? Number(weight) : null,
                images: {
                    create: images.map((url: string, index: number) => ({
                        url,
                        sortOrder: index,
                    })),
                },
            },
            include: {
                images: true,
                category: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        imageUrl: true,
                    },
                },
            },
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error('Failed to create product:', error);
        return NextResponse.json(
            { error: 'Failed to create product' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');
        const userId = searchParams.get('userId');
        const isSold = searchParams.get('isSold');

        const products = await prisma.product.findMany({
            where: {
                ...(categoryId && { categoryId }),
                ...(userId && { userId }),
                ...(isSold !== null && { isSold: isSold === 'true' }),
            },
            include: {
                images: {
                    orderBy: {
                        sortOrder: 'asc',
                    },
                },
                category: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        imageUrl: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error('Failed to fetch products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}
