# Quick Start: Using the New Category System

## For Developers

### Importing Categories

```typescript
// Import from @buttergolf/db package
import { CATEGORIES, getCategoryBySlug, isValidCategorySlug } from '@buttergolf/db'

// Get all categories
const allCategories = CATEGORIES // readonly array of 10 categories

// Find specific category
const drivers = getCategoryBySlug('drivers')
console.log(drivers?.name) // "Drivers"

// Validate a slug
if (isValidCategorySlug('invalid-slug')) {
  // This won't run
}
```

### Using in React Components

```typescript
import { CATEGORIES } from '@buttergolf/db'

function CategoryDropdown({ value, onChange }) {
  return (
    <select value={value} onChange={onChange}>
      <option value="">Select a category</option>
      {CATEGORIES.map(cat => (
        <option key={cat.slug} value={cat.slug}>
          {cat.name}
        </option>
      ))}
    </select>
  )
}
```

### Using in API Routes

```typescript
import { isValidCategorySlug, getCategoryBySlug } from '@buttergolf/db'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const categorySlug = searchParams.get('category')
  
  // Validate category slug
  if (categorySlug && !isValidCategorySlug(categorySlug)) {
    return NextResponse.json(
      { error: 'Invalid category slug' },
      { status: 400 }
    )
  }
  
  // Get category details
  const category = getCategoryBySlug(categorySlug)
  
  // Fetch products for this category
  const products = await prisma.product.findMany({
    where: { categoryId: category.id }
  })
  
  return NextResponse.json(products)
}
```

### Database Setup

The categories are automatically seeded when you run:

```bash
pnpm db:seed
```

This creates/updates all 10 categories in the database.

## Available Categories

| Name | Slug | Description |
|------|------|-------------|
| Drivers | `drivers` | Golf drivers and woods |
| Irons | `irons` | Iron sets and individual irons |
| Wedges | `wedges` | Pitching, sand, lob, and gap wedges |
| Putters | `putters` | Putters of all styles |
| Bags | `bags` | Golf bags and travel covers |
| Balls | `balls` | Golf balls |
| Apparel | `apparel` | Golf clothing and shoes |
| Accessories | `accessories` | Golf accessories, gloves, tees, and more |
| Training Aids | `training-aids` | Training aids and practice equipment |
| GPS & Tech | `gps-tech` | GPS devices, rangefinders, and tech |

## Helper Functions

```typescript
import {
  CATEGORIES,           // Array of all categories
  getCategoryBySlug,    // Find by slug
  getCategoryByName,    // Find by name (case-insensitive)
  getCategorySlugs,     // Get array of all slugs
  getCategoryNames,     // Get array of all names
  isValidCategorySlug,  // Validate a slug
} from '@buttergolf/db'

// Examples
const slugs = getCategorySlugs()
// ["drivers", "irons", "wedges", ...]

const names = getCategoryNames()
// ["Drivers", "Irons", "Wedges", ...]

const category = getCategoryByName("DRIVERS") // Case-insensitive
console.log(category?.slug) // "drivers"
```

## TypeScript Types

```typescript
import type { CategoryDefinition } from '@buttergolf/db'

interface MyComponent {
  category: CategoryDefinition
}

function MyComponent({ category }: MyComponent) {
  return (
    <div>
      <h2>{category.name}</h2>
      <p>{category.description}</p>
      <img src={category.imageUrl} alt={category.name} />
    </div>
  )
}
```

## Migration from Old Code

### Before (fetching from API):
```typescript
const [categories, setCategories] = useState([])

useEffect(() => {
  fetch('/api/categories')
    .then(res => res.json())
    .then(data => setCategories(data))
}, [])
```

### After (using constants - optional):
```typescript
import { CATEGORIES } from '@buttergolf/db'

// Use directly
const categories = CATEGORIES

// Or if you need state
const [categories] = useState(CATEGORIES)
```

**Note**: The API approach still works and is useful if you need to fetch categories with product counts or other dynamic data.

## Common Use Cases

### 1. Category Filter Buttons
```typescript
import { CATEGORIES } from '@buttergolf/db'

function CategoryFilters({ activeCategory, onCategoryChange }) {
  return (
    <div className="flex gap-2">
      <button onClick={() => onCategoryChange(null)}>
        All
      </button>
      {CATEGORIES.map(cat => (
        <button
          key={cat.slug}
          onClick={() => onCategoryChange(cat.slug)}
          className={activeCategory === cat.slug ? 'active' : ''}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
```

### 2. Category Navigation
```typescript
import { CATEGORIES } from '@buttergolf/db'
import Link from 'next/link'

function CategoryNav() {
  return (
    <nav>
      {CATEGORIES.map(cat => (
        <Link key={cat.slug} href={`/category/${cat.slug}`}>
          {cat.name}
        </Link>
      ))}
    </nav>
  )
}
```

### 3. Form Validation
```typescript
import { isValidCategorySlug } from '@buttergolf/db'

function validateProductForm(data) {
  if (!isValidCategorySlug(data.categorySlug)) {
    throw new Error('Invalid category selected')
  }
  // Continue validation
}
```

## Questions?

See full documentation in:
- `docs/CENTRALIZED_CATEGORIES.md` - Complete guide
- `packages/db/src/constants/README.md` - Package-specific docs
- `docs/CATEGORY_FIX_SUMMARY.md` - Implementation summary
