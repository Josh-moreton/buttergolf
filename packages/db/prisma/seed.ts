import { PrismaClient, ProductCondition } from "../generated/client";
import { CATEGORIES } from "../src/constants/categories";
import { BRANDS } from "../src/constants/brands";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create three users with different rating profiles
  const user1 = await prisma.user.upsert({
    where: { email: "sarah.johnson@example.com" },
    update: {},
    create: {
      email: "sarah.johnson@example.com",
      firstName: "Sarah",
      lastName: "Johnson",
      clerkId: "user_sarah_clerk_id",
      averageRating: 4.8,
      ratingCount: 47,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "mike.chen@example.com" },
    update: {},
    create: {
      email: "mike.chen@example.com",
      firstName: "Mike",
      lastName: "Chen",
      clerkId: "user_mike_clerk_id",
      averageRating: 4.2,
      ratingCount: 23,
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: "emma.williams@example.com" },
    update: {},
    create: {
      email: "emma.williams@example.com",
      firstName: "Emma",
      lastName: "Williams",
      clerkId: "user_emma_clerk_id",
      averageRating: 0,
      ratingCount: 0,
    },
  });

  console.log("✅ Created users:", [`${user1.firstName} ${user1.lastName}`, `${user2.firstName} ${user2.lastName}`, `${user3.firstName} ${user3.lastName}`]);

  // Create categories from centralized constants
  const categories = await Promise.all(
    CATEGORIES.map((categoryDef) =>
      prisma.category.upsert({
        where: { slug: categoryDef.slug },
        update: {
          name: categoryDef.name,
          description: categoryDef.description,
          imageUrl: categoryDef.imageUrl,
          sortOrder: categoryDef.sortOrder,
        },
        create: categoryDef,
      }),
    ),
  );

  console.log(`✅ Created ${categories.length} categories`);

  // Create brands from centralized constants
  const brands = await Promise.all(
    BRANDS.map((brandDef) =>
      prisma.brand.upsert({
        where: { slug: brandDef.slug },
        update: {
          name: brandDef.name,
          logoUrl: brandDef.logoUrl,
          sortOrder: brandDef.sortOrder,
        },
        create: brandDef,
      }),
    ),
  );

  console.log(`✅ Created ${brands.length} brands`);

  // Get category references
  const woodsCategory = categories.find((c) => c.slug === "woods")!;
  const ironsCategory = categories.find((c) => c.slug === "irons")!;
  const wedgesCategory = categories.find((c) => c.slug === "wedges")!;
  const puttersCategory = categories.find((c) => c.slug === "putters")!;
  const bagsCategory = categories.find((c) => c.slug === "bags")!;
  const ballsCategory = categories.find((c) => c.slug === "balls")!;
  const accessoriesCategory = categories.find((c) => c.slug === "accessories")!;
  const apparelCategory = categories.find((c) => c.slug === "apparel")!;

  // Get brand references
  const taylorMade = brands.find((b) => b.slug === "taylormade")!;
  const callaway = brands.find((b) => b.slug === "callaway")!;
  const titleist = brands.find((b) => b.slug === "titleist")!;
  const ping = brands.find((b) => b.slug === "ping")!;
  const cobra = brands.find((b) => b.slug === "cobra")!;
  const mizuno = brands.find((b) => b.slug === "mizuno")!;
  const srixon = brands.find((b) => b.slug === "srixon")!;
  const wilson = brands.find((b) => b.slug === "wilson")!;
  const cleveland = brands.find((b) => b.slug === "cleveland")!;
  const odyssey = brands.find((b) => b.slug === "odyssey")!;
  const footjoy = brands.find((b) => b.slug === "footjoy")!;
  const sunMountain = brands.find((b) => b.slug === "sun-mountain")!;
  const nike = brands.find((b) => b.slug === "nike")!;
  const adidas = brands.find((b) => b.slug === "adidas")!;

  // Create 40+ products distributed across users and categories
  const products = await Promise.all([
    // DRIVERS (8 products) - Mix of users
    prisma.product.create({
      data: {
        title: "TaylorMade Stealth 2 Driver",
        description:
          "Barely used TaylorMade Stealth 2 driver with 10.5° loft. Includes headcover and adjustment tool.",
        price: 349.99,
        condition: ProductCondition.EXCELLENT,
        brandId: taylorMade.id,
        model: "Stealth 2",
        userId: user1.id,
        categoryId: woodsCategory.id,
        images: {
          create: [
            {
              url: "https://sf84lb7mzwzvdsgj.public.blob.vercel-storage.com/products/cmhnfzibd000lr70gl6vchczu-main.jpg",
              sortOrder: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=70",
              sortOrder: 2,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=60",
              sortOrder: 3,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "Callaway Rogue ST Max Driver",
        description:
          "Callaway Rogue ST Max driver, 9° loft with stiff flex shaft. Very forgiving driver.",
        price: 279.99,
        condition: ProductCondition.LIKE_NEW,
        brandId: callaway.id,
        model: "Rogue ST Max",
        userId: user2.id,
        categoryId: woodsCategory.id,
        images: {
          create: [
            {
              url: "https://sf84lb7mzwzvdsgj.public.blob.vercel-storage.com/products/cmhnfzibd000vr70ggi0mn91p-main.jpg",
              sortOrder: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=70",
              sortOrder: 2,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=60",
              sortOrder: 3,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "Ping G430 Max Driver",
        description:
          "Latest Ping G430 Max driver with 10.5° loft. Adjustable hosel, comes with wrench and headcover.",
        price: 429.99,
        condition: ProductCondition.LIKE_NEW,
        brandId: ping.id,
        model: "G430 Max",
        userId: user1.id,
        categoryId: woodsCategory.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
              sortOrder: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=70",
              sortOrder: 2,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=60",
              sortOrder: 3,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "Titleist TSi3 Driver",
        description:
          "Tour-level Titleist TSi3 driver, 9° loft. SureFit CG technology for shot shaping.",
        price: 389.99,
        condition: ProductCondition.EXCELLENT,
        brandId: titleist.id,
        model: "TSi3",
        userId: user3.id,
        categoryId: woodsCategory.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
              sortOrder: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=70",
              sortOrder: 2,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=60",
              sortOrder: 3,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "Cobra LTDx LS Driver",
        description:
          "Low-spin Cobra LTDx LS driver for faster swing speeds. 8.5° loft with Tour weights.",
        price: 299.99,
        condition: ProductCondition.EXCELLENT,
        brandId: cobra.id,
        model: "LTDx LS",
        userId: user2.id,
        categoryId: woodsCategory.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
              sortOrder: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "Mizuno ST-Z Driver",
        description:
          "Mizuno ST-Z driver with carbon composite crown. Low and deep CG for high launch.",
        price: 259.99,
        condition: ProductCondition.GOOD,
        brandId: mizuno.id,
        model: "ST-Z",
        userId: user1.id,
        categoryId: woodsCategory.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
              sortOrder: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "Srixon ZX5 Driver",
        description:
          "Srixon ZX5 driver, 10.5° with regular flex. Rebound Frame for more ball speed.",
        price: 269.99,
        condition: ProductCondition.LIKE_NEW,
        brandId: srixon.id,
        model: "ZX5",
        userId: user3.id,
        categoryId: woodsCategory.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
              sortOrder: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "Wilson Launch Pad 2 Driver",
        description:
          "Draw-biased Wilson Launch Pad 2 driver. Great for slicers, lightweight and forgiving.",
        price: 189.99,
        condition: ProductCondition.GOOD,
        brandId: wilson.id,
        model: "Launch Pad 2",
        userId: user2.id,
        categoryId: woodsCategory.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
              sortOrder: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),

    // FAIRWAY WOODS & HYBRIDS (7 products) - grouped under drivers
    prisma.product.create({
      data: {
        title: "TaylorMade Stealth 2 3-Wood",
        description:
          "15° TaylorMade Stealth 2 fairway wood. Carbon face technology, stiff shaft.",
        price: 229.99,
        condition: ProductCondition.EXCELLENT,
        brandId: taylorMade.id,
        model: "Stealth 2",
        userId: user1.id,
        categoryId: woodsCategory.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
              sortOrder: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "Callaway Rogue ST Max 5-Wood",
        description:
          "Callaway Rogue ST Max 18° 5-wood. Jailbreak Speed Frame, regular flex graphite.",
        price: 189.99,
        condition: ProductCondition.LIKE_NEW,
        brandId: callaway.id,
        model: "Rogue ST Max",
        userId: user2.id,
        categoryId: woodsCategory.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
              sortOrder: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "Ping G425 3-Wood",
        description:
          "Ping G425 fairway wood, 15° with adjustable hosel. Maraging steel face for distance.",
        price: 209.99,
        condition: ProductCondition.EXCELLENT,
        brandId: ping.id,
        model: "G425",
        userId: user3.id,
        categoryId: woodsCategory.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
              sortOrder: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "Titleist TSi2 7-Wood",
        description:
          "High-lofted Titleist TSi2 7-wood, 21°. Perfect gap filler, easy to launch.",
        price: 199.99,
        condition: ProductCondition.GOOD,
        brandId: titleist.id,
        model: "TSi2",
        userId: user1.id,
        categoryId: woodsCategory.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
              sortOrder: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "Callaway Apex 4 Hybrid",
        description:
          "Callaway Apex 22° hybrid. Forged face cup, graphite shaft. Great long iron replacement.",
        price: 149.99,
        condition: ProductCondition.EXCELLENT,
        brandId: callaway.id,
        model: "Apex",
        userId: user2.id,
        categoryId: woodsCategory.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
              sortOrder: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "TaylorMade Stealth Rescue",
        description:
          "TaylorMade Stealth 3 Hybrid, 19°. V Steel sole for turf interaction, regular flex.",
        price: 139.99,
        condition: ProductCondition.LIKE_NEW,
        brandId: taylorMade.id,
        model: "Stealth Rescue",
        userId: user1.id,
        categoryId: woodsCategory.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
              sortOrder: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "Ping G430 5 Hybrid",
        description:
          "Ping G430 hybrid, 26°. Carbonfly wrap, maraging steel face. Easy to hit.",
        price: 159.99,
        condition: ProductCondition.EXCELLENT,
        brandId: ping.id,
        model: "G430",
        userId: user3.id,
        categoryId: woodsCategory.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
              sortOrder: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),

    // IRONS (6 products)
    prisma.product.create({
      data: {
        title: "Titleist T200 Iron Set 5-PW",
        description:
          "Complete set of Titleist T200 irons (5-PW, 6 clubs). Player-distance irons, regular flex graphite.",
        price: 699.99,
        condition: ProductCondition.EXCELLENT,
        brandId: titleist.id,
        model: "T200",
        userId: user1.id,
        categoryId: ironsCategory.id,
        images: {
          create: [
            {
              url: "https://sf84lb7mzwzvdsgj.public.blob.vercel-storage.com/products/cmhnfzibd000hr70gmihwatcq-main.jpg",
              sortOrder: 0,
            },
            {
              url: "https://sf84lb7mzwzvdsgj.public.blob.vercel-storage.com/products/cmhnfzibd000hr70gmihwatcq-main.jpg?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://sf84lb7mzwzvdsgj.public.blob.vercel-storage.com/products/cmhnfzibd000hr70gmihwatcq-main.jpg?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "Callaway Apex Iron Set 4-PW",
        description:
          "Full Callaway Apex iron set (4-PW, 7 clubs). Forged irons with tour-level performance.",
        price: 799.99,
        condition: ProductCondition.LIKE_NEW,
        brandId: callaway.id,
        model: "Apex",
        userId: user2.id,
        categoryId: ironsCategory.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
              sortOrder: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "Ping G425 Irons 5-GW",
        description:
          "Ping G425 iron set (5-GW, 7 clubs). Game-improvement irons, graphite shafts.",
        price: 649.99,
        condition: ProductCondition.GOOD,
        brandId: ping.id,
        model: "G425",
        userId: user3.id,
        categoryId: ironsCategory.id,
        images: {
          create: [
            {
              url: "https://sf84lb7mzwzvdsgj.public.blob.vercel-storage.com/products/cmhnfzibd000xr70gyn7w97cz-main.jpg",
              sortOrder: 0,
            },
            {
              url: "https://sf84lb7mzwzvdsgj.public.blob.vercel-storage.com/products/cmhnfzibd000xr70gyn7w97cz-main.jpg?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://sf84lb7mzwzvdsgj.public.blob.vercel-storage.com/products/cmhnfzibd000xr70gyn7w97cz-main.jpg?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "TaylorMade P790 Irons 4-PW",
        description:
          "TaylorMade P790 hollow-body irons (4-PW, 7 clubs). SpeedFoam AI, tour looks with forgiveness.",
        price: 849.99,
        condition: ProductCondition.EXCELLENT,
        brandId: taylorMade.id,
        model: "P790",
        userId: user1.id,
        categoryId: ironsCategory.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
              sortOrder: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "Mizuno JPX923 Hot Metal Irons 5-GW",
        description:
          "Mizuno JPX923 Hot Metal irons (5-GW, 7 clubs). Incredible distance and feel.",
        price: 729.99,
        condition: ProductCondition.LIKE_NEW,
        brandId: mizuno.id,
        model: "JPX923 Hot Metal",
        userId: user2.id,
        categoryId: ironsCategory.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
              sortOrder: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "Cobra King Forged Tec X Irons 4-PW",
        description:
          "Cobra King Forged Tec X iron set (4-PW, 7 clubs). PWRShell face, steel shafts.",
        price: 599.99,
        condition: ProductCondition.GOOD,
        brandId: cobra.id,
        model: "King Forged Tec X",
        userId: user1.id,
        categoryId: ironsCategory.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
              sortOrder: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),

    // WEDGES (5 products)
    prisma.product.create({
      data: {
        title: "Titleist Vokey SM9 Wedge Set",
        description:
          "Titleist Vokey SM9 wedge set - 52°, 56°, and 60° lofts. F grind, sharp grooves.",
        price: 249.99,
        condition: ProductCondition.EXCELLENT,
        brandId: titleist.id,
        model: "Vokey SM9",
        userId: user2.id,
        categoryId: wedgesCategory.id,
        images: {
          create: [
            {
              url: "https://sf84lb7mzwzvdsgj.public.blob.vercel-storage.com/products/cmhnfzibd000wr70gtkvh3pul-main.jpg",
              sortOrder: 0,
            },
            {
              url: "https://sf84lb7mzwzvdsgj.public.blob.vercel-storage.com/products/cmhnfzibd000wr70gtkvh3pul-main.jpg?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://sf84lb7mzwzvdsgj.public.blob.vercel-storage.com/products/cmhnfzibd000wr70gtkvh3pul-main.jpg?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "Cleveland RTX ZipCore 58° Wedge",
        description:
          "Cleveland RTX ZipCore 58° lob wedge with 10° bounce. UltiZip grooves for max spin.",
        price: 89.99,
        condition: ProductCondition.LIKE_NEW,
        brandId: cleveland.id,
        model: "RTX ZipCore",
        userId: user1.id,
        categoryId: wedgesCategory.id,
        images: {
          create: [
            {
              url: "https://sf84lb7mzwzvdsgj.public.blob.vercel-storage.com/products/cmhnfzibd000jr70gg2kytzhw-main.jpg",
              sortOrder: 0,
            },
            {
              url: "https://sf84lb7mzwzvdsgj.public.blob.vercel-storage.com/products/cmhnfzibd000jr70gg2kytzhw-main.jpg?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://sf84lb7mzwzvdsgj.public.blob.vercel-storage.com/products/cmhnfzibd000jr70gg2kytzhw-main.jpg?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "Callaway Jaws Raw 54° Wedge",
        description:
          "Callaway Jaws Raw wedge, 54° with 10° bounce. Raw face for aggressive spin.",
        price: 99.99,
        condition: ProductCondition.EXCELLENT,
        brandId: callaway.id,
        model: "Jaws Raw",
        userId: user3.id,
        categoryId: wedgesCategory.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
              sortOrder: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "TaylorMade Hi-Toe 3 Wedge 60°",
        description:
          "TaylorMade Hi-Toe 3 wedge with full face grooves. 60° loft, 10° bounce.",
        price: 109.99,
        condition: ProductCondition.LIKE_NEW,
        brandId: taylorMade.id,
        model: "Hi-Toe 3",
        userId: user2.id,
        categoryId: wedgesCategory.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
              sortOrder: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "Ping Glide 4.0 56° Wedge",
        description:
          "Ping Glide 4.0 sand wedge, 56° with 12° bounce. Hydropearl 2.0 chrome finish.",
        price: 94.99,
        condition: ProductCondition.EXCELLENT,
        brandId: ping.id,
        model: "Glide 4.0",
        userId: user1.id,
        categoryId: wedgesCategory.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
              sortOrder: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),

    // PUTTERS (5 products)
    prisma.product.create({
      data: {
        title: "Scotty Cameron Newport 2 Putter",
        description:
          'Classic Scotty Cameron Newport 2 putter, 34" length. Soft carbon steel, pristine face.',
        price: 279.99,
        condition: ProductCondition.GOOD,
        brandId: titleist.id,
        model: "Scotty Cameron Newport 2",
        userId: user2.id,
        categoryId: puttersCategory.id,
        images: {
          create: [
            {
              url: "https://sf84lb7mzwzvdsgj.public.blob.vercel-storage.com/products/cmhnfzibd000fr70goajqwv1c-main.jpg",
              sortOrder: 0,
            },
            {
              url: "https://sf84lb7mzwzvdsgj.public.blob.vercel-storage.com/products/cmhnfzibd000fr70goajqwv1c-main.jpg?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://sf84lb7mzwzvdsgj.public.blob.vercel-storage.com/products/cmhnfzibd000fr70goajqwv1c-main.jpg?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "Odyssey White Hot OG Putter",
        description:
          'Odyssey White Hot OG #7 putter, 35" length. Iconic white hot insert for great feel.',
        price: 129.99,
        condition: ProductCondition.EXCELLENT,
        brandId: odyssey.id,
        model: "White Hot OG",
        userId: user1.id,
        categoryId: puttersCategory.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
              sortOrder: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "TaylorMade Spider X Putter",
        description:
          'TaylorMade Spider X putter with True Path alignment. 34" length, navy blue.',
        price: 179.99,
        condition: ProductCondition.LIKE_NEW,
        brandId: taylorMade.id,
        model: "Spider X",
        userId: user3.id,
        categoryId: puttersCategory.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
              sortOrder: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "Ping Anser 2D Putter",
        description:
          'Classic Ping Anser 2D blade putter, 35". Timeless design, perfect balance.',
        price: 149.99,
        condition: ProductCondition.EXCELLENT,
        brandId: ping.id,
        model: "Anser 2D",
        userId: user2.id,
        categoryId: puttersCategory.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
              sortOrder: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "Callaway Odyssey Tri-Hot 5K",
        description:
          'Odyssey Tri-Hot 5K Double Wide putter. High MOI mallet, 34" with SuperStroke grip.',
        price: 139.99,
        condition: ProductCondition.GOOD,
        brandId: odyssey.id,
        model: "Tri-Hot 5K",
        userId: user1.id,
        categoryId: puttersCategory.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
              sortOrder: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),

    // BAGS (4 products)
    prisma.product.create({
      data: {
        title: "Ping Hoofer Stand Bag",
        description:
          "Ping Hoofer 14-way stand bag in black. Only 5.5 lbs, 7 pockets, dual auto-deploy legs.",
        price: 149.99,
        condition: ProductCondition.EXCELLENT,
        brandId: ping.id,
        model: "Hoofer",
        userId: user1.id,
        categoryId: bagsCategory.id,
        images: {
          create: [
            {
              url: "https://sf84lb7mzwzvdsgj.public.blob.vercel-storage.com/products/cmhnfzibd0011r70gu83v00ug-main.jpg",
              sortOrder: 0,
            },
            {
              url: "https://sf84lb7mzwzvdsgj.public.blob.vercel-storage.com/products/cmhnfzibd0011r70gu83v00ug-main.jpg?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://sf84lb7mzwzvdsgj.public.blob.vercel-storage.com/products/cmhnfzibd0011r70gu83v00ug-main.jpg?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "TaylorMade Pro 8.0 Cart Bag",
        description:
          "TaylorMade Pro 8.0 cart bag with 14-way top. 9 pockets, rain hood, insulated cooler.",
        price: 189.99,
        condition: ProductCondition.LIKE_NEW,
        brandId: taylorMade.id,
        model: "Pro 8.0",
        userId: user2.id,
        categoryId: bagsCategory.id,
        images: {
          create: [
            {
              url: "https://sf84lb7mzwzvdsgj.public.blob.vercel-storage.com/products/cmhnfzigx001cr70glxkmwvdh-main.jpg",
              sortOrder: 0,
            },
            {
              url: "https://sf84lb7mzwzvdsgj.public.blob.vercel-storage.com/products/cmhnfzigx001cr70glxkmwvdh-main.jpg?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://sf84lb7mzwzvdsgj.public.blob.vercel-storage.com/products/cmhnfzigx001cr70glxkmwvdh-main.jpg?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "Titleist Players 4 Stand Bag",
        description:
          "Titleist Players 4 stand bag with 4-way top. Lightweight carry bag, charcoal/black.",
        price: 169.99,
        condition: ProductCondition.EXCELLENT,
        brandId: titleist.id,
        model: "Players 4",
        userId: user3.id,
        categoryId: bagsCategory.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
              sortOrder: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "Sun Mountain H2NO Lite Stand Bag",
        description:
          "Sun Mountain H2NO Lite waterproof stand bag. 14-way top, 7 pockets, rain hood.",
        price: 199.99,
        condition: ProductCondition.LIKE_NEW,
        brandId: sunMountain.id,
        model: "H2NO Lite",
        userId: user1.id,
        categoryId: bagsCategory.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
              sortOrder: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),

    // GOLF BALLS (3 products)
    prisma.product.create({
      data: {
        title: "Titleist Pro V1 Golf Balls (Dozen)",
        description:
          "Brand new, sealed dozen of Titleist Pro V1 golf balls. 2024 model, improved core.",
        price: 54.99,
        condition: ProductCondition.NEW,
        brandId: titleist.id,
        model: "Pro V1",
        userId: user2.id,
        categoryId: ballsCategory.id,
        images: {
          create: [
            {
              url: "https://sf84lb7mzwzvdsgj.public.blob.vercel-storage.com/products/cmhnfzigl0016r70gs581g7th-main.jpg",
              sortOrder: 0,
            },
            {
              url: "https://sf84lb7mzwzvdsgj.public.blob.vercel-storage.com/products/cmhnfzigl0016r70gs581g7th-main.jpg?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://sf84lb7mzwzvdsgj.public.blob.vercel-storage.com/products/cmhnfzigl0016r70gs581g7th-main.jpg?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "Callaway Chrome Soft Balls (2 Dozen)",
        description:
          "Two dozen Callaway Chrome Soft golf balls, new in box. Soft feel, greenside control.",
        price: 84.99,
        condition: ProductCondition.NEW,
        brandId: callaway.id,
        model: "Chrome Soft",
        userId: user1.id,
        categoryId: ballsCategory.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
              sortOrder: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "TaylorMade TP5x Golf Balls (Dozen)",
        description:
          "TaylorMade TP5x golf balls, new dozen. 5-layer construction, high spin around greens.",
        price: 49.99,
        condition: ProductCondition.NEW,
        brandId: taylorMade.id,
        model: "TP5x",
        userId: user3.id,
        categoryId: ballsCategory.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
              sortOrder: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),

    // GLOVES (2 products) - under accessories
    prisma.product.create({
      data: {
        title: "FootJoy StaSof Golf Glove",
        description:
          "FootJoy StaSof cabretta leather glove, size ML. Softest leather, great feel.",
        price: 18.99,
        condition: ProductCondition.NEW,
        brandId: footjoy.id,
        model: "StaSof",
        userId: user1.id,
        categoryId: accessoriesCategory.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
              sortOrder: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "Titleist Players Golf Glove",
        description:
          "Titleist Players cabretta leather glove, size L. Premium tour-level glove.",
        price: 19.99,
        condition: ProductCondition.NEW,
        brandId: titleist.id,
        model: "Players",
        userId: user2.id,
        categoryId: accessoriesCategory.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
              sortOrder: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),

    // SHOES (3 products) - under apparel
    prisma.product.create({
      data: {
        title: "FootJoy Pro/SL Golf Shoes",
        description:
          "FootJoy Pro/SL spikeless golf shoes, size 10. White/navy, excellent condition.",
        price: 129.99,
        condition: ProductCondition.EXCELLENT,
        brandId: footjoy.id,
        model: "Pro/SL",
        userId: user1.id,
        categoryId: apparelCategory.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
              sortOrder: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "Adidas Tour360 22 Golf Shoes",
        description:
          "Adidas Tour360 22 golf shoes with Boost cushioning. Size 10.5, black/red.",
        price: 149.99,
        condition: ProductCondition.LIKE_NEW,
        brandId: adidas.id,
        model: "Tour360 22",
        userId: user2.id,
        categoryId: apparelCategory.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
              sortOrder: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "Nike Air Zoom Victory Tour 3",
        description:
          "Nike Air Zoom Victory Tour 3 golf shoes. Size 11, white/black, barely worn.",
        price: 139.99,
        condition: ProductCondition.LIKE_NEW,
        brandId: nike.id,
        model: "Air Zoom Victory Tour 3",
        userId: user3.id,
        categoryId: apparelCategory.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
              sortOrder: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
              sortOrder: 1,
            },
            {
              url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=70",
              sortOrder: 2,
            },
          ],
        },
      },
    }),
  ]);

  console.log(`✅ Created ${products.length} sample products`);
  console.log("🌱 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
