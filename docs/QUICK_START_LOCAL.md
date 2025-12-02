# Quick Start - Running Both Apps Locally

## Prerequisites

- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- PostgreSQL database running
- Expo Go app on your phone (optional)

## Step 1: Set Up Environment Variables

### Web App

```bash
# Create apps/web/.env.local
cp .env.example apps/web/.env.local

# Edit apps/web/.env.local and add:
DATABASE_URL=postgresql://user:password@localhost:5432/buttergolf
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret
```

### Mobile App

```bash
# Create apps/mobile/.env.local (if it doesn't exist)
# Add:
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
EXPO_PUBLIC_API_URL=http://localhost:3000
```

## Step 2: Install Dependencies & Setup Database

```bash
# Install all dependencies
pnpm install

# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# (Optional) Add sample products
pnpm db:studio
# Then manually add products via the UI
```

## Step 3: Start Web Server (Terminal 1)

```bash
pnpm dev:web
```

Wait until you see:

```
✓ Ready in 3.2s
○ Local:        http://localhost:3000
```

**IMPORTANT**: Keep this running! The mobile app needs it.

## Step 4: Start Mobile App (Terminal 2)

```bash
pnpm dev:mobile
```

Wait until you see:

```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go
```

## Step 5: Open Mobile App

### iOS Simulator:

Press `i` in the terminal

### Android Emulator:

Press `a` in the terminal

### Physical Device:

1. Open Expo Go app
2. Scan the QR code
3. **For physical device**: Update `.env.local`:
   ```bash
   # Find your computer's IP
   ifconfig | grep "inet " | grep -v 127.0.0.1
   # Update mobile/.env.local:
   EXPO_PUBLIC_API_URL=http://192.168.1.XXX:3000
   ```
   Then reload the app (shake device → "Reload")

## Troubleshooting

### "Network request failed" on mobile

- ✅ Web server is running on port 3000
- ✅ `EXPO_PUBLIC_API_URL` is set in `apps/mobile/.env.local`
- ✅ Physical device: using computer's IP, not localhost
- ✅ Android emulator: using `10.0.2.2`, not localhost

### "No products" showing

- Add products via:
  - Prisma Studio: `pnpm db:studio`
  - Or use the "Sell" page on web app

### Port 3000 already in use

```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

## Testing the API

### From command line:

```bash
curl http://localhost:3000/api/products/recent
```

Should return JSON array of products.

### From mobile logs:

Look for:

```
Fetching products from: http://localhost:3000
```

If you see "Failed to fetch", the URL is wrong or web server isn't running.

## Success Checklist

- [ ] Web server running on http://localhost:3000
- [ ] Web homepage shows products at /
- [ ] Mobile app loads (see Expo splash screen)
- [ ] Mobile console shows "Fetching products from: ..."
- [ ] Mobile app displays products (or "No products available")
- [ ] Both apps use same Clerk publishable key
- [ ] Can sign in on both platforms

## Next Steps

Once both apps work locally:

1. Deploy web app to Vercel
2. Update `EXPO_PUBLIC_API_URL` to production URL
3. Build mobile app with EAS Build
4. Submit to App Store/Play Store

See `docs/MOBILE_API_CONFIG.md` for production deployment guide.
