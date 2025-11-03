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

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { clerkId },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
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
