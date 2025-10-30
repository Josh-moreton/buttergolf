import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database...')

    // Create a sample user
    const user = await prisma.user.upsert({
        where: { email: 'demo@buttergolf.com' },
        update: {},
        create: {
            email: 'demo@buttergolf.com',
            name: 'Demo User',
        },
    })

    console.log('✅ Created user:', user)

    // Create a sample round
    const round = await prisma.round.create({
        data: {
            userId: user.id,
            courseName: 'Pebble Beach',
            score: 85,
            holes: {
                create: [
                    { holeNumber: 1, par: 4, strokes: 5 },
                    { holeNumber: 2, par: 5, strokes: 6 },
                    { holeNumber: 3, par: 3, strokes: 3 },
                    { holeNumber: 4, par: 4, strokes: 4 },
                    { holeNumber: 5, par: 4, strokes: 5 },
                    { holeNumber: 6, par: 5, strokes: 6 },
                    { holeNumber: 7, par: 3, strokes: 4 },
                    { holeNumber: 8, par: 4, strokes: 5 },
                    { holeNumber: 9, par: 4, strokes: 4 },
                ],
            },
        },
    })

    console.log('✅ Created round:', round)
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
