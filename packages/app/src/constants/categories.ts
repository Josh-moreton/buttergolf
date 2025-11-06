// Mobile-safe category constants (no Prisma / server imports)
// Duplicated from @buttergolf/db to avoid pulling Prisma into React Native bundle.

export interface CategoryDefinition {
    name: string;
    slug: string;
    description: string;
    imageUrl: string;
    sortOrder: number;
}

export const CATEGORIES: readonly CategoryDefinition[] = [
    {
        name: "Drivers",
        slug: "drivers",
        description: "Golf drivers and woods",
        imageUrl: "/_assets/images/clubs-1.jpg",
        sortOrder: 1,
    },
    {
        name: "Irons",
        slug: "irons",
        description: "Iron sets and individual irons",
        imageUrl: "/_assets/images/clubs-2.webp",
        sortOrder: 2,
    },
    {
        name: "Wedges",
        slug: "wedges",
        description: "Pitching, sand, lob, and gap wedges",
        imageUrl: "/_assets/images/clubs-4.jpg",
        sortOrder: 3,
    },
    {
        name: "Putters",
        slug: "putters",
        description: "Putters of all styles",
        imageUrl: "/_assets/images/clubs-5.webp",
        sortOrder: 4,
    },
    {
        name: "Bags",
        slug: "bags",
        description: "Golf bags and travel covers",
        imageUrl: "/_assets/images/clubs-3.webp",
        sortOrder: 5,
    },
    {
        name: "Balls",
        slug: "balls",
        description: "Golf balls",
        imageUrl: "/_assets/images/clubs-6.jpg",
        sortOrder: 6,
    },
    {
        name: "Apparel",
        slug: "apparel",
        description: "Golf clothing and shoes",
        imageUrl: "/_assets/images/clubs-1.jpg",
        sortOrder: 7,
    },
    {
        name: "Accessories",
        slug: "accessories",
        description: "Golf accessories, gloves, tees, and more",
        imageUrl: "/_assets/images/clubs-2.webp",
        sortOrder: 8,
    },
    {
        name: "Training Aids",
        slug: "training-aids",
        description: "Training aids and practice equipment",
        imageUrl: "/_assets/images/clubs-3.webp",
        sortOrder: 9,
    },
    {
        name: "GPS & Tech",
        slug: "gps-tech",
        description: "GPS devices, rangefinders, and tech",
        imageUrl: "/_assets/images/clubs-4.jpg",
        sortOrder: 10,
    },
] as const;

export function getCategoryNames(): string[] {
    return CATEGORIES.map((c) => c.name);
}
