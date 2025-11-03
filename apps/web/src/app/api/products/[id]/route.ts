import { NextResponse } from 'next/server';
import { prisma } from '@buttergolf/db';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const product = await prisma.product.findUnique({
            where: {
                id: params.id,
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
        });

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Increment view count (fire and forget)
        prisma.product
            .update({
                where: { id: params.id },
                data: { views: { increment: 1 } },
            })
            .catch((err) => console.error('Failed to increment views:', err));

        return NextResponse.json(product);
    } catch (error) {
        console.error('Failed to fetch product:', error);
        return NextResponse.json(
            { error: 'Failed to fetch product' },
            { status: 500 }
        );
    }
}
