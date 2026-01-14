# Mobile Environment Setup (EAS Secrets)

## Critical Issue: App Crashes on Startup

**Root Cause**: The mobile app was crashing on startup because Clerk and Stripe native modules were being initialized with missing/empty publishable keys. This caused a native crash in React Native's TurboModule system during app initialization.

**Solution**: Configure EAS secrets for all required environment variables before building.

## Required Environment Variables

The mobile app requires the following environment variables to be configured in EAS:

### 1. Clerk Authentication (Required)
```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...  # Test key
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...  # Production key
```

Get this from: [Clerk Dashboard](https://dashboard.clerk.com) → API Keys

### 2. Stripe Payments (Required)
```bash
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Test key
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...  # Production key
```

Get this from: [Stripe Dashboard](https://dashboard.stripe.com) → Developers → API keys

### 3. API URL (Already Configured)
```bash
EXPO_PUBLIC_API_URL=https://buttergolf.com  # Production
EXPO_PUBLIC_API_URL=https://buttergolf-preview.vercel.app  # Preview
```

## Setting Up EAS Environment Variables (Correct Pattern)

### Important: EAS has TWO separate systems for environment variables

1. **EAS Environment Variables** (`eas env:create`) - For sensitive values (API keys, tokens)
2. **eas.json env field** - For non-sensitive values (URLs, feature flags)

**They work together**: Variables created with `eas env:create` are automatically available during builds WITHOUT being declared in `eas.json`.

### Step 1: Create Secrets via EAS CLI (Recommended)

```bash
# Navigate to mobile app directory
cd apps/mobile

# Create environment variables (stored securely in EAS cloud)
eas Step 2: Optionally Link to Specific Environments

By default, `eas env:create` makes variables available to all build profiles. To use different values per environment:

```bash
# Use test keys for preview builds
eas env:create --name EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY --value "pk_test_..." --scope project --environment preview
eas env:create --name EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY --value "pk_test_..." --scope project --environment preview

# Use live keys for production builds
eas env:create --name EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY --value "pk_live_..." --scope project --environment production
eas env:create --name EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY --value "pk_live_..." --scope project --environment production
```

### Alternative: Using EAS Dashboard

1. Visit [Expo Dashboard](https://expo.dev)
2. Navigate to your project: **buttergolf**
3. Go to **Project Settings** → **Environment variables**
4. Click **Add a variable**
5. Add:
   - `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`
6. Set values and optionally link to specific environments
For different environments (preview vs production), you can use build profiles:

```bash
# Preview/TestFlight builds (use test keys)
eas secret:create --scope project --name EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY --value "pk_test_..." --type string --environment preview

# Production builds (use live keys)
eas secret:create --scope project --name EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY --value "pk_live_..." --type string --environment production
```environment variables are configured:

```bash
cd apps/mobile
eas env:list
```

You should see output like:
```
┌─────────────────────────────────────────┬────────────┬─────────────┬─────────┐
│ Name                                    │ Value      │ Environments│ Scope   │
├────────────────Environment Variables

Once environment variables are configured via `eas env:create`, build as normal:

```bash
# For TestFlight (preview)
eas build --profile preview --platform ios

# For production
eas build --profile production --platform ios
```

**How it works**:
1. EAS reads variables from cloud (created via `eas env:create`)
2. EAS merges them with `eas.json` env field
3. All variables are available as `process.env.*` during build
4. Variables with `EXPO_PUBLIC_` prefix are embedded in the app bundleEXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`

## Building with Secrets

Once secrets are configured, build as normal:

```bash
# For TestFlight (preview)
eas build --profile preview --platform ios

# For production
eas build --profile production --platform ios
```

## Testing Locally

For local development, create `apps/mobile/.env`:
via `eas env:create` (see above)
- **Verification**: App now shows a friendly error screen if keys are missing instead of crashing

### Build succeeds but app shows "Configuration Error"
- **Cause**: Environment variables not created in EAS
- **Solution**: Run `eas env:list` to verify, then use `eas env:create` to add missing variable
```

Then start the dev server:

```bash
pnpm dev:mobile
```

## Troubleshooting

### App crashes immediately on open
- **Cause**: Missing environment variables
- *Understanding the Two Systems

### EAS Environment Variables (`eas env:create`)
- **Purpose**: Store sensitive values securely
- **Storage**: EAS cloud (encrypted)
- **Version control**: NOT in git
- **Access**: Only during builds and via CLI
- **Best for**: API keys, tokens, secrets

### eas.json env field
- **Purpose**: Store non-sensitive configuration
- **Storage**: Version controlled in git
- **Access**: Visible to anyone with repo access
- **Best for**: URLs, feature flags, build variants

### Precedence Rules
When a variable is defined in BOTH places:
1. `eas.json` env field value is used FIRST
2. `eas env:create` value is used as fallback

**Recommendation**: Don't define the same variable in both places to avoid confusion.

## Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Never put secrets in `eas.json`** - Use `eas env:create` instead
3. **Use test keys for development/preview** - Only use live keys for production
4. **Rotate keys if exposed** - If keys are leaked, rotate them immediately in Clerk/Stripe dashboards
5. **Use environment-specific variable` to verify, then add missing secrets

### "Invalid publishable key" error
- **Cause**: Wrong key format or test/live key mismatch
- **Solution**: 
  - Test keys start with `pk_test_`
  - Live keys start with `pk_live_`
  - Ensure you're using the correct key for the environment

## Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use test keys for development/preview** - Only use live keys for production
3. **Rotate keys if exposed** - If keys are leaked, rotate them immediately in Clerk/Stripe dashboards
4. **Use environment-specific secrets** - Different keys for preview and production builds

## References

- [EAS Secrets Documentation](https://docs.expo.dev/build-reference/variables/)
- [Clerk Environment Variables](https://clerk.com/docs/deployments/clerk-environment-variables)
- [Stripe API Keys](https://docs.stripe.com/keys)
