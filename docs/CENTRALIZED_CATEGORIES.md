# Centralized Category Management

## Problem

The category dropdown on the Sell page was blank because there was no centralized management of product categories. Categories were only defined in the database seed file, leading to:

- No single source of truth for categories
- Difficult to add/modify categories
- Potential inconsistencies between frontend dropdowns, database, and routing
- Categories had to be fetched from the database even for static lists

## Solution

Created a centralized category constants file that serves as the single source of truth for all categories across the platform.

### File Structure

```
packages/db/src/constants/
└── categories.ts          # Central category definitions
```

### Key Components

#### 1. Category Constants (`packages/db/src/constants/categories.ts`)

This file defines:

- **`CategoryDefinition` interface**: TypeScript interface for category objects
- **`CATEGORIES` array**: Complete list of all platform categories (currently 10)
- **Helper functions**:
  - `getCategoryBySlug(slug)` - Find category by slug
  - `getCategoryByName(name)` - Find category by name (case-insensitive)
  - `getCategorySlugs()` - Get array of all slugs
  - `getCategoryNames()` - Get array of all names
  - `isValidCategorySlug(slug)` - Validate if slug exists

#### 2. Current Categories

1. **Drivers** - Golf drivers and woods
2. **Irons** - Iron sets and individual irons
3. **Wedges** - Pitching, sand, lob, and gap wedges
4. **Putters** - Putters of all styles
5. **Bags** - Golf bags and travel covers
6. **Balls** - Golf balls
7. **Apparel** - Golf clothing and shoes _(NEW)_
8. **Accessories** - Golf accessories, gloves, tees, and more _(NEW)_
9. **Training Aids** - Training aids and practice equipment _(NEW)_
10. **GPS & Tech** - GPS devices, rangefinders, and tech _(NEW)_

### Integration Points

#### Database Seeding (`packages/db/prisma/seed.ts`)

The seed file now imports and uses `CATEGORIES`:

```typescript
import { CATEGORIES } from "../src/constants/categories";

// Automatically creates/updates all categories from constants
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
```

#### Frontend Usage

Import categories from `@buttergolf/db`:

```typescript
import { CATEGORIES, getCategoryNames } from "@buttergolf/db";

// Use in components
const categoryOptions = CATEGORIES.map((cat) => ({
  value: cat.slug,
  label: cat.name,
}));
```

#### API Endpoint (`apps/web/src/app/api/categories/route.ts`)

The existing API endpoint fetches categories from the database (which are kept in sync via seeding).

## How to Add a New Category

1. **Edit the constants file**: `packages/db/src/constants/categories.ts`

```typescript
export const CATEGORIES: readonly CategoryDefinition[] = [
  // ... existing categories
  {
    name: "New Category",
    slug: "new-category",
    description: "Description of the new category",
    imageUrl: "/_assets/images/category-image.jpg",
    sortOrder: 11, // Next available order
  },
];
```

2. **Run database seed** to sync with database:

```bash
pnpm db:seed
```

3. **Category automatically appears everywhere**:
   - Sell page dropdown
   - Category filters
   - Navigation menus
   - Product listings

## Benefits

✅ **Single Source of Truth**: One file defines all categories
✅ **Type Safety**: Full TypeScript support
✅ **Consistency**: Same categories everywhere (frontend, backend, database)
✅ **Easy Maintenance**: Add/modify categories in one place
✅ **Better DX**: Helper functions for common operations
✅ **Database Sync**: Seed file automatically creates/updates categories
✅ **Validation**: Built-in slug validation

## Testing

After implementing this solution:

1. **Verify database has categories**:

```bash
pnpm db:studio
# Check that categories table has 10 entries
```

2. **Test the Sell page**:
   - Navigate to `/sell`
   - Category dropdown should show all 10 categories
   - Select a category and verify form submission works

3. **Test API endpoint**:

```bash
curl http://localhost:3000/api/categories | jq
```

## Future Enhancements

- [ ] Add category icons/emojis
- [ ] Support for subcategories
- [ ] Category-specific form fields (e.g., size for apparel)
- [ ] Category analytics and trending
- [ ] Admin UI for category management
- [ ] Category-based SEO optimization
- [ ] Update placeholder images for new categories (Apparel, Accessories, Training Aids, GPS & Tech)

## Notes

- The database seed now creates 10 categories (up from 6)
- The 4 new categories use placeholder images that should be updated
- Category images are stored in `apps/web/public/_assets/images/`
- Categories are exported from `@buttergolf/db` package
- The `sortOrder` field controls display order in dropdowns and navigation
