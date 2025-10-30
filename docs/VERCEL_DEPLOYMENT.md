# Deploying ButterGolf to Vercel

This guide walks you through deploying your Turborepo monorepo to Vercel with Postgres.

## Prerequisites

- GitHub repository with your ButterGolf code
- Vercel account (free tier works!)
- Git changes committed and pushed

## Step-by-Step Deployment

### 1. Create Vercel Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Select "Import Git Repository"
3. Choose your `buttergolf` repository
4. Vercel will auto-detect:
   - ✅ Framework: Next.js
   - ✅ Build System: Turborepo
   - ✅ Root Directory: `apps/web`

### 2. Configure Build Settings

Vercel should auto-configure, but verify these settings:

**Framework Preset**: Next.js

**Root Directory**: `apps/web`

**Build Command**: 
```bash
pnpm run build --filter=web
```
(or leave empty to use the command from `vercel.json`)

**Output Directory**: `.next`

**Install Command**: 
```bash
pnpm install
```

**Node Version**: 18.x or higher (set in Project Settings if needed)

### 3. Environment Variables (Skip for now)

Click "Deploy" without adding environment variables yet. We'll add them after creating the database.

### 4. Add Vercel Postgres

After your first deployment (it might fail - that's okay!):

1. Go to your project dashboard
2. Click the **"Storage"** tab
3. Click **"Create Database"**
4. Select **"Postgres"**
5. Choose a region (pick one close to your users)
6. Click **"Create"**

Vercel will automatically create these environment variables:
- `POSTGRES_URL` - Direct connection URL
- `POSTGRES_PRISMA_URL` - **Use this one for Prisma** (connection pooled)
- `POSTGRES_URL_NON_POOLING` - Direct without pooling
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

### 5. Configure Database Environment Variable

You need to map Vercel's variable to what Prisma expects:

**Option A: Add DATABASE_URL manually (Recommended)**

1. Go to **Settings** → **Environment Variables**
2. Add new variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Copy the value from `POSTGRES_PRISMA_URL`
   - **Environments**: Check all (Production, Preview, Development)
3. Click **"Save"**

**Option B: Use Vercel's variable directly**

Update `packages/db/prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_PRISMA_URL")
  directUrl = env("POSTGRES_URL_NON_POOLING")
}
```

### 6. Run Database Migrations

After adding the database, you need to apply your schema:

**Option A: Via Vercel CLI (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link your project
vercel link

# Pull environment variables
vercel env pull

# Run migration
pnpm --filter @buttergolf/db db:push
```

**Option B: Via Build Hook**

The `postinstall` script in `@buttergolf/db` will automatically generate the Prisma Client on each build. For the first deployment, you may want to:

1. Go to **Settings** → **Git** → **Deploy Hooks**
2. Trigger a new deployment
3. The build should now succeed with the database connected

**Option C: Manual via Prisma Data Platform**

Use Prisma's tooling to apply migrations directly to Vercel Postgres.

### 7. Redeploy

1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Select **"Use existing Build Cache"** → No
5. Click **"Redeploy"**

Your app should now build successfully and connect to the database! 🎉

## Turborepo Remote Caching (Optional)

Enable Vercel's Remote Cache for faster builds:

```bash
# Link Turborepo to Vercel
npx turbo login
npx turbo link
```

Update `turbo.json`:
```json
{
  "remoteCache": {
    "enabled": true
  }
}
```

This caches build outputs across your team and CI/CD.

## Environment Variables Reference

### Required Variables

| Variable | Value | Environments |
|----------|-------|--------------|
| `DATABASE_URL` | `POSTGRES_PRISMA_URL` value | All |

### Optional Variables

| Variable | Purpose |
|----------|---------|
| `NODE_ENV` | Set to `production` (auto-set by Vercel) |
| `NEXT_PUBLIC_APP_URL` | Your app's URL for client-side use |

## Vercel Configuration Files

### `/vercel.json`
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "pnpm run build --filter=web",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "outputDirectory": "apps/web/.next"
}
```

This tells Vercel:
- Use Turborepo's filter to build only the web app
- Use pnpm for installation
- Look for Next.js output in `apps/web/.next`

### `turbo.json` (Updated)
```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build", "db:generate"]
    }
  }
}
```

This ensures Prisma Client is generated before building the app.

## Troubleshooting

### Build fails with "Cannot find module '@buttergolf/db'"

**Solution**: Ensure `postinstall` script runs in `packages/db/package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### Build fails with "Prisma Client not generated"

**Solution**: Add `db:generate` to the build dependencies in `turbo.json`:
```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build", "db:generate"]
    }
  }
}
```

### Database connection errors

**Solutions**:
1. Verify `DATABASE_URL` is set in all environments
2. Check that you're using `POSTGRES_PRISMA_URL` (with connection pooling)
3. Ensure the database schema is pushed: `pnpm db:push`

### Preview deployments fail

**Solution**: Ensure environment variables are set for "Preview" environment, not just "Production"

## Monitoring & Maintenance

### View Logs
1. Go to your project dashboard
2. Click on a deployment
3. View **"Build Logs"** and **"Function Logs"**

### Database Management
1. Go to **Storage** → Your Postgres database
2. Click **"Data"** to view tables
3. Click **"Query"** to run SQL directly
4. Click **"Insights"** for performance metrics

### Prisma Studio (Local with Vercel DB)
```bash
# Pull Vercel environment variables
vercel env pull

# Open Prisma Studio
pnpm db:studio
```

## Next Steps

1. ✅ Deploy web app to Vercel
2. ✅ Add Vercel Postgres database
3. ✅ Configure environment variables
4. ✅ Run database migrations
5. ⏭️ Set up preview deployments for branches
6. ⏭️ Configure custom domain
7. ⏭️ Enable Turborepo remote caching
8. ⏭️ Set up monitoring and alerts

## Useful Commands

```bash
# Deploy manually
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# Pull environment variables
vercel env pull

# List projects
vercel projects

# Link to existing project
vercel link
```

## Resources

- [Vercel Monorepo Guide](https://vercel.com/docs/monorepos/turborepo)
- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Turborepo Docs](https://turbo.build/repo/docs)
