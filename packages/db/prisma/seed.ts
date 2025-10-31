import { PrismaClient, ProductCondition } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database...')

    // Create a sample user with Clerk ID
    const user = await prisma.user.upsert({
        where: { email: 'demo@buttergolf.com' },
        update: {},
        create: {
            email: 'demo@buttergolf.com',
            name: 'Demo User',
            clerkId: 'demo_clerk_id',
        },
    })

    console.log('✅ Created user:', user)

    // Create categories
    const categories = await Promise.all([
        prisma.category.upsert({
            where: { slug: 'drivers' },
            update: {},
            create: {
                name: 'Drivers',
                slug: 'drivers',
                description: 'Golf drivers and woods',
                sortOrder: 1,
            },
        }),
        prisma.category.upsert({
            where: { slug: 'irons' },
            update: {},
            create: {
                name: 'Irons',
                slug: 'irons',
                description: 'Iron sets and individual irons',
                sortOrder: 2,
            },
        }),
        prisma.category.upsert({
            where: { slug: 'wedges' },
            update: {},
            create: {
                name: 'Wedges',
                slug: 'wedges',
                description: 'Pitching, sand, and lob wedges',
                sortOrder: 3,
            },
        }),
        prisma.category.upsert({
            where: { slug: 'putters' },
            update: {},
            create: {
                name: 'Putters',
                slug: 'putters',
                description: 'Putters of all styles',
                sortOrder: 4,
            },
        }),
        prisma.category.upsert({
            where: { slug: 'bags' },
            update: {},
            create: {
                name: 'Bags',
                slug: 'bags',
                description: 'Golf bags and travel covers',
                sortOrder: 6,
            },
        }),
        prisma.category.upsert({
            where: { slug: 'balls' },
            update: {},
            create: {
                name: 'Balls',
                slug: 'balls',
                description: 'Golf balls',
                sortOrder: 7,
            },
        }),
    ])

    console.log(`✅ Created ${categories.length} categories`)

    // Create sample products
    const driversCategory = categories.find((c) => c.slug === 'drivers')!
    const ironsCategory = categories.find((c) => c.slug === 'irons')!
    const puttersCategory = categories.find((c) => c.slug === 'putters')!
    const ballsCategory = categories.find((c) => c.slug === 'balls')!

    const products = await Promise.all([
        prisma.product.create({
            data: {
                title: 'TaylorMade Stealth Driver',
                description: 'Gently used TaylorMade Stealth driver, 10.5 degree loft. Great condition with minimal wear.',
                price: 299.99,
                condition: ProductCondition.EXCELLENT,
                brand: 'TaylorMade',
                model: 'Stealth',
                userId: user.id,
                categoryId: driversCategory.id,
                images: {
                    create: [
                        {
                            url: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400&h=400&fit=crop',
                            sortOrder: 0,
                        },
                    ],
                },
            },
        }),
        prisma.product.create({
            data: {
                title: 'Callaway Apex Irons Set (4-PW)',
                description: 'Full set of Callaway Apex irons in excellent condition. Includes 4-PW (7 clubs). Regular flex shafts.',
                price: 799.99,
                condition: ProductCondition.LIKE_NEW,
                brand: 'Callaway',
                model: 'Apex',
                userId: user.id,
                categoryId: ironsCategory.id,
                images: {
                    create: [
                        {
                            url: 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=400&fit=crop',
                            sortOrder: 0,
                        },
                    ],
                },
            },
        }),
        prisma.product.create({
            data: {
                title: 'Scotty Cameron Newport 2 Putter',
                description: 'Classic Scotty Cameron Newport 2 putter. 34 inch length. Some minor wear but still plays great.',
                price: 249.99,
                condition: ProductCondition.GOOD,
                brand: 'Titleist',
                model: 'Scotty Cameron Newport 2',
                userId: user.id,
                categoryId: puttersCategory.id,
                images: {
                    create: [
                        {
                            url: 'https://images.unsplash.com/photo-1530028828-25e8270e98f3?w=400&h=400&fit=crop',
                            sortOrder: 0,
                        },
                    ],
                },
            },
        }),
        prisma.product.create({
            data: {
                title: 'Titleist Pro V1 Golf Balls (Dozen)',
                description: 'Brand new, sealed dozen of Titleist Pro V1 golf balls. 2024 model.',
                price: 39.99,
                condition: ProductCondition.NEW,
                brand: 'Titleist',
                model: 'Pro V1',
                userId: user.id,
                categoryId: ballsCategory.id,
                images: {
                    create: [
                        {
                            url: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=400&h=400&fit=crop',
                            sortOrder: 0,
                        },
                    ],
                },
            },
        }),
    ])

    console.log(`✅ Created ${products.length} sample products`)
    console.log('🌱 Seeding complete!')
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
