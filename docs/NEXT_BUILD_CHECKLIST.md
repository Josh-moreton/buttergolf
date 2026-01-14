# Next TestFlight Build - Action Items

## ⚠️ CRITICAL: Configure Before Building

**DO NOT BUILD** until EAS secrets are configured. The app will show an error screen instead of crashing, but users won't be able to use it.

## Step 1: Configure EAS Environment Variables

```bash
cd apps/mobile

# Create environment variables in EAS cloud (get keys from dashboards)
# Get Clerk key from: https://dashboard.clerk.com → API Keys
# Get Stripe key from: https://dashboard.stripe.com → Developers → API keys

eas env:create --name EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY --value "pk_test_YOUR_CLERK_KEY" --scope project
eas env:create --name EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY --value "pk_test_YOUR_STRIPE_KEY" --scope project

# Verify environment variables are configured
eas env:list
```

Expected output:
```
┌─────────────────────────────────────────┬────────────┬─────────────┬─────────┐
│ Name                                    │ Value      │ Environments│ Scope   │
├─────────────────────────────────────────┼────────────┼─────────────┼─────────┤
│ EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY      │ pk_test_...│ All         │ project │
│ EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY     │ pk_test_...│ All         │ project │
└─────────────────────────────────────────┴────────────┴─────────────┴─────────┘
```

**Note**: These variables are stored securely in EAS cloud and automatically injected during builds. They do NOT need to be declared in `eas.json`.

## Step 2: Build for TestFlight

```bash
# Build for iOS TestFlight
eas build --profile preview --platform ios
```

## Step 3: Local Testing (Optional but Recommended)

Test the error handling works:

```bash
cd apps/mobile

# Temporarily remove .env to simulate missing keys
mv .env .env.backup

# Start dev server
pnpm dev:mobile

# Open app - should show "Configuration Error" screen (not crash)

# Restore .env
mv .env.backup .env
```

## Step 4: Monitor Build
 from EAS
- ✅ No warnings about missing EXPO_PUBLIC_* variables
- ✅ Native modules (Clerk, Stripe) initialize successfully
- ✅ Environment variables loaded
- ✅ No warnings about missing EXPO_PUBLIC_* variables
- ✅ Build completes successfully

## Step 5: TestFlight Upload

Once build completes:
1. Download from EAS Dashboard
2. Upload to App Store Connect via Transporter
3. Submit for TestFlight review
4. Send to testers

## Step 6: Verify Fix

After testers receive build:
1. Install fresh (delete old version first)
2. Launch app
3. Verify app opens successfully (no crash)
4. Verify sign-in flow works
5. Verify Stripe payment sheet works

## What Was Fixed
The Problem
```tsx
// Environment variables were undefined at build time
const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY; // undefined
const stripePublishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY; // undefined

// Native modules crashed when initialized with undefined/empty values
<StripeProvider publishableKey={stripePublishableKey || ""}> // ❌ CRASH
  <ClerkProvider publishableKey={clerkPublishableKey}>       // ❌ CRASH
```

### The Solution
1. **Created environment variables in EAS** - Use `eas env:create` to store secrets securely
2. **Added validation in App.tsx** - Check keys exist before initializing native modules
3. **Removed empty strings from eas.json** - Don't declare secrets there, they're auto-injected

```tsx
// AFTER: Validate before initialization
if (!clerkPublishableKey || !stripePublishableKey) {
  return <ErrorScreen />; // ✅ Friendly error instead of crash
}

// Only initialize with valid keys
<StripeProvider publishableKey={stripePublishableKey}> // ✅ Safe
  <ClerkProvider publishableKey={clerkPublishableKey}>  // ✅ Safe
  <ClerkProvider publishableKey={clerkPublishableKey}>
```
Delete environment variables: `eas env:delete --name EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
2. Revert App.tsx changes (remove validation)
3. Build with old code
4. Investigate issue separately.0.0 (6) - **CRASHES**
- Next TestFlight: 1.0.0 (7) - **FIXED**

## Rollback Plan

If new build has issues:
1. Remove problematic EAS secrets
2. Revert App.tsx changes
3. Build with old code
4. Upload to TestFlight

## Related Documentation

- **MOBILE_ENV_SETUP.md** - Full EAS secrets guide
- **TESTFLIGHT_CRASH_FIX_4.md** - Detailed root cause analysis
- **docs/AUTH_SETUP_CLERK.md** - Clerk setup guide

## Success Criteria

✅ App launches without crash  
✅ Sign-in flow works  
✅ Stripe payment sheet can be presented  
✅ No TestFlight crash reports  
✅ Testers can browse listings  

## Questions?

See **MOBILE_ENV_SETUP.md** or **TESTFLIGHT_CRASH_FIX_4.md** for detailed information.
