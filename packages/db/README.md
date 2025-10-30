# @buttergolf/db

Prisma database package for ButterGolf monorepo.

## Setup

### 1. Configure Database URL

Copy the example env file and configure your database:

```bash
cp .env.example .env
```

Edit `.env` and set your `DATABASE_URL`.

If you are using the shared Neon instance, populate the additional variables shown in `.env.example` (`DATABASE_URL_UNPOOLED`, `POSTGRES_PRISMA_URL`, etc.) so Prisma and downstream clients can choose between pooled and direct connections.

### 2. Install Dependencies

From the root of the monorepo:

```bash
pnpm install
```

### 3. Generate Prisma Client

```bash
pnpm --filter @buttergolf/db db:generate
```

### 4. Push Schema to Database

For development (no migrations):

```bash
pnpm --filter @buttergolf/db db:push
```

Or create a migration:

```bash
pnpm --filter @buttergolf/db db:migrate:dev --name init
```

### 5. Seed Database (Optional)

```bash
pnpm --filter @buttergolf/db db:seed
```

## Usage in Apps

Add the package to your app's dependencies:

```json
{
  "dependencies": {
    "@buttergolf/db": "workspace:*"
  }
}
```

Then import and use:

```typescript
import { prisma } from '@buttergolf/db'

// Query users
const users = await prisma.user.findMany()

// Create a round
const round = await prisma.round.create({
  data: {
    userId: 'user-id',
    courseName: 'Augusta National',
    score: 72,
  },
})
```

## Available Scripts

- `pnpm db:generate` - Generate Prisma Client
- `pnpm db:push` - Push schema changes to database (dev)
- `pnpm db:migrate:dev` - Create and apply migrations (dev)
- `pnpm db:migrate:deploy` - Apply migrations (production)
- `pnpm db:studio` - Open Prisma Studio GUI
- `pnpm db:seed` - Seed database with sample data

## Database Options

### Option 1: Local PostgreSQL with Docker

```bash
docker run --name buttergolf-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=buttergolf \
  -p 5432:5432 \
  -d postgres:16
```

### Option 2: Prisma Postgres (Cloud)

Use the Prisma tooling to create a cloud database:

```bash
pnpm --filter @buttergolf/db prisma-platform-login
pnpm --filter @buttergolf/db prisma-postgres-create-database --name buttergolf
```

### Option 3: Supabase, Neon, or other PostgreSQL providers

Just update your `DATABASE_URL` in `.env`.

## Schema Changes

1. Edit `prisma/schema.prisma`
2. Generate client: `pnpm db:generate`
3. Push to database: `pnpm db:push` (dev) or create migration: `pnpm db:migrate:dev --name your-change`

## TypeScript

The generated Prisma Client is fully typed. Import types as needed:

```typescript
import { type User, type Round, type Hole } from '@buttergolf/db'
```
