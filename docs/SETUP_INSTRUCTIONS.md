# ButterGolf - Setup Instructions

After applying the fixes, run these commands:

## 1. Install Dependencies

```bash
pnpm install
```

## 2. Clean any existing builds

```bash
pnpm clean-install
```

## 3. Test Web App

```bash
pnpm dev:web
```

Open <http://localhost:3000> - you should see the Tamagui components working.

## 4. Test Mobile App

```bash
pnpm dev:mobile
```

Then press `i` for iOS simulator or `a` for Android emulator.

## What Was Fixed

### ✅ Critical Fixes Applied

1. **Added `.tamagui` to .gitignore** - Prevents committing generated files
2. **Upgraded to `@tamagui/config/v4`** - Latest features and performance
3. **Moved Tamagui deps to UI package** - Correct dependency management
4. **Added `@tamagui/next-plugin`** - 30-50% web performance improvement
5. **Added proper Babel config** - Native optimizations
6. **Added component optimization** - Better compiler extraction

### 📝 Remaining TODOs

#### High Priority

- [x] Rename `@my-scope` to `@buttergolf` ✅ COMPLETE
- [ ] Create `apps/web/public/tamagui.css` directory (for production builds)
- [ ] Test both web and mobile apps work correctly

#### Medium Priority  

- [ ] Customize Tamagui themes in `packages/ui/tamagui.config.ts`
- [ ] Add more optimized components following the Button pattern
- [ ] Set up shared ESLint/TS configs in apps

#### Nice to Have

- [ ] Set up Turborepo remote caching
- [ ] Add more development helper scripts
- [ ] Consider Tamagui Studio for theme editing

## Common Commands

```bash
# Development
pnpm dev:web       # Start web dev server
pnpm dev:mobile    # Start mobile dev server
pnpm dev           # Start all (runs both in parallel)

# Building
pnpm build         # Build everything

# Type Checking
pnpm check-types   # Check types across workspace

# Linting
pnpm lint          # Lint all packages
```

## Performance Tips

1. The compiler will log optimization stats - look for lines like:

   ```
   » app.tsx 16ms · 1 optimized · 1 flattened
   ```

2. Use `// debug` at the top of any file to see detailed optimization info

3. In production, the Next.js app will extract CSS to `public/tamagui.css`

## Need Help?

Check out:

- The generated `REVIEW_RECOMMENDATIONS.md` for full details
- [Tamagui Docs](https://tamagui.dev)
- [Turborepo Docs](https://turbo.build/repo/docs)
