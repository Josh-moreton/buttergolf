# Mobile App Environment Configuration

## Overview

The mobile app communicates with the Next.js backend API. The API URL is configured via environment variables to support different environments (development, preview, production).

## Environment Variables

### `EXPO_PUBLIC_API_URL`

The base URL for the Next.js backend API. This variable is required for the app to function.

**Format**: `https://your-domain.com` or `http://localhost:3000` (no trailing slash)

## Configuration by Environment

### 1. Local Development

When developing locally, you need to point the mobile app to your local Next.js server:

#### iOS Simulator
```bash
# apps/mobile/.env.local
EXPO_PUBLIC_API_URL=http://localhost:3000
```

#### Android Emulator
```bash
# apps/mobile/.env.local
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000
```
Android emulator uses `10.0.2.2` to access the host machine's `localhost`.

#### Physical Device (same WiFi network)
```bash
# apps/mobile/.env.local
EXPO_PUBLIC_API_URL=http://192.168.1.XXX:3000
```
Replace `XXX` with your computer's local IP address. Find it with:
- macOS: `ifconfig | grep "inet " | grep -v 127.0.0.1`
- Windows: `ipconfig`
- Linux: `ip addr show`

### 2. Preview/Staging Environment

For testing with a deployed backend:

```bash
# Set in EAS Build or .env.preview
EXPO_PUBLIC_API_URL=https://buttergolf-preview.vercel.app
```

This is useful for QA testing before production release.

### 3. Production

For production builds submitted to App Store/Play Store:

```bash
# Set in EAS Build or app.config.ts
EXPO_PUBLIC_API_URL=https://buttergolf.com
```

## Deployment Workflow

### Step 1: Deploy Next.js Backend

First, deploy your Next.js app to a hosting provider:

**Vercel (Recommended)**:
```bash
cd apps/web
vercel --prod
```

You'll get a URL like: `https://buttergolf.vercel.app` or your custom domain.

**Other options**:
- Netlify
- AWS Amplify
- Railway
- Render

### Step 2: Configure Custom Domain (Production)

1. Purchase domain (e.g., `buttergolf.com`)
2. Add domain to Vercel project settings
3. Update DNS records (Vercel provides instructions)
4. Wait for SSL certificate provisioning (~1 hour)

### Step 3: Build Mobile App with Production API

#### Using EAS Build (Recommended)

```bash
cd apps/mobile

# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo account
eas login

# Configure project (first time only)
eas build:configure

# Build for production
eas build --platform ios --profile production
eas build --platform android --profile production
```

The `eas.json` file already has the production API URL configured.

#### Using Expo without EAS

```bash
cd apps/mobile

# Set production API URL
export EXPO_PUBLIC_API_URL=https://buttergolf.com

# Build standalone apps
expo build:ios
expo build:android
```

### Step 4: Submit to App Stores

```bash
# iOS App Store
eas submit --platform ios

# Google Play Store
eas submit --platform android
```

## Environment Variable Loading Order

Expo loads environment variables in this order (later overrides earlier):

1. `.env` - Default values (committed to git)
2. `.env.local` - Local overrides (gitignored)
3. `.env.production` - Production-specific (if using Expo Go)
4. EAS Build environment variables (for standalone builds)

## Testing API Connection

### Check if API URL is set correctly:

```typescript
// Add this temporarily to App.tsx
console.log('API URL:', process.env.EXPO_PUBLIC_API_URL);
```

### Test API endpoint manually:

```bash
# Should return JSON array of products
curl https://buttergolf.com/api/products/recent
```

### Common Issues:

**"Network request failed"**:
- Web server not running (start with `pnpm dev:web`)
- Wrong API URL (check .env.local)
- Firewall blocking connection
- Device not on same network (physical device)

**"EXPO_PUBLIC_API_URL is not set"**:
- Create `apps/mobile/.env.local` file
- Add `EXPO_PUBLIC_API_URL=http://localhost:3000`
- Restart Expo dev server

**"403 Forbidden" or CORS errors**:
- Next.js API routes should allow all origins by default
- Check Next.js middleware if you added custom CORS rules

## Security Considerations

### Production:

1. **Use HTTPS**: Always use `https://` in production (enforced by App Store/Play Store)
2. **Environment Variables**: API URL is public (embedded in app bundle), don't put secrets here
3. **API Authentication**: Use Clerk tokens for authenticated requests:

```typescript
const { getToken } = useAuth();
const token = await getToken();

fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/products/recent`, {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

### Development:

- `.env.local` is gitignored (safe for local IPs)
- Never commit real API keys or secrets
- Use Clerk test keys for development

## CI/CD Integration

### GitHub Actions Example:

```yaml
# .github/workflows/mobile-build.yml
name: Build Mobile App

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup EAS
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      
      - name: Build App
        run: |
          cd apps/mobile
          eas build --platform all --profile production --non-interactive
```

Set `EXPO_PUBLIC_API_URL` in EAS Secrets dashboard.

## Monitoring & Debugging

### Check API health:

```bash
# Should return 200 OK with product data
curl -i https://buttergolf.com/api/products/recent
```

### View app logs:

```bash
# Development
npx react-native log-ios
npx react-native log-android

# Production (via EAS)
eas build:view --platform ios
```

### Analytics:

Consider adding monitoring:
- Sentry for error tracking
- Mixpanel/Amplitude for user analytics
- Custom logging for API request failures

## Reference

- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Vercel Deployment](https://vercel.com/docs)
- [Custom Domains](https://vercel.com/docs/concepts/projects/domains)
