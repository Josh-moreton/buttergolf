# TestFlight Crash Fix - App Crash on Startup

## Issue Summary

**Build**: 1.0.0 (6)  
**Date**: 14 January 2026  
**Reporter**: joshuamoreton1@icloud.com  
**Device**: iPhone 15 Pro (iPhone16,1)  
**OS**: iOS 26.1  
**Symptom**: App crashes immediately on open (< 0.5 seconds after launch)

## Root Cause Analysis

### Crash Details

```
Exception Type:  EXC_CRASH (SIGABRT)
Termination Reason: SIGNAL 6 Abort trap: 6
Crashed Thread: 1

Stack Trace (Thread 1):
9   React   invocation function for block in facebook::react::ObjCTurboModule::performVoidMethodInvocation
10  React   std::__1::__function::__func<facebook::react::ObjCTurboModule::performVoidMethodInvocation...
```

**Analysis**:
- Crash occurs in React Native's TurboModule system during native module initialization
- Happens during app startup (within 0.4 seconds of launch)
- Specifically in `performVoidMethodInvocation` - indicates a native module method call failed

### Root Cause

The app was initializing Stripe and Clerk native modules with **missing or empty publishable keys**:

```tsx
// BEFORE (Broken)
const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
const stripePublishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// These were undefined in TestFlight builds
<StripeProvider publishableKey={stripePublishableKey || ""}>  // ❌ Empty string crashes
  <ClerkProvider publishableKey={clerkPublishableKey}>         // ❌ undefined crashes
```

**Why it crashed**:
1. EAS build did not include required environment variables
2. `eas.json` only specified `EXPO_PUBLIC_API_URL`
3. Native modules (Stripe, Clerk) attempted to initialize with invalid keys
4. Native initialization failure triggered abort signal (SIGABRT)

## Solution

### 1. Add Defensive Checks (Code Fix)

Added pre-initialization validation to prevent native module crashes:

```tsx
// AFTER (Fixed) - apps/mobile/App.tsx
const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
const stripePublishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// CRITICAL: Check for missing keys BEFORE native module initialization
if (!clerkPublishableKey || !stripePublishableKey) {
  const missingKeys = [];
  if (!clerkPublishableKey) missingKeys.push("EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY");
  if (!stripePublishableKey) missingKeys.push("EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY");
  
  // Show friendly error screen instead of crashing
  return (
    <SafeAreaProvider>
      <RNView style={{ /* error UI */ }}>
        <RNText>Configuration Error</RNText>
        <RNText>Missing required environment variables:</RNText>
        {missingKeys.map((key) => (
          <RNText key={key}>• {key}</RNText>
        ))}
      </RNView>
    </SafeAreaProvider>
  );
}

// Only initialize native modules with valid keys
return (
  <StripeProvider publishableKey={stripePublishableKey}>
    <ClerkProvider publishableKey={clerkPublishableKey}>
      {/* App content */}
    </ClerkProvider>
  </StripeProvider>
);
```

**Benefits**:
- ✅ Prevents native module initialization with invalid keys
- ✅ Shows user-friendly error message instead of crash
- ✅ Fails gracefully during development
- ✅ Makes debugging easier (clear error message)

### 2. Update EAS Configuration

Updated `eas.json` to explicitly declare required environment variables:

```json
{
  "build": {
    "preview": {
      "env": {
        "EXPO_PUBLIC_API_URL": "https://buttergolf-preview.vercel.app",
        "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY": "",   // ← Added
        "EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY": ""   // ← Added
      }
    },
    "production": {
      "env": {
        "EXPO_PUBLIC_API_URL": "https://buttergolf.com",
        "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY": "",   // ← Added
        "EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY": ""   // ← Added
      }
    }
  }
}
```

### 3. Configure EAS Secrets (Required for Next Build)

**CRITICAL**: Before building the next TestFlight version, configure EAS secrets:

```bash
cd apps/mobile

# Configure secrets for preview builds (TestFlight)
eas secret:create --scope project --name EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY --value "pk_test_YOUR_KEY" --type string
eas secret:create --scope project --name EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY --value "pk_test_YOUR_KEY" --type string

# Verify secrets are set
eas secret:list
```

**Get the keys from**:
- Clerk: https://dashboard.clerk.com → API Keys
- Stripe: https://dashboard.stripe.com → Developers → API keys

## Testing the Fix

### Local Testing

1. Remove `.env` file temporarily:
   ```bash
   cd apps/mobile
   mv .env .env.backup
   ```

2. Start dev server:
   ```bash
   pnpm dev:mobile
   ```

3. **Expected behavior**: App shows "Configuration Error" screen (no crash)

4. Restore `.env`:
   ```bash
   mv .env.backup .env
   ```

### TestFlight Testing

1. Configure EAS secrets (see above)
2. Build new TestFlight version:
   ```bash
   eas build --profile preview --platform ios
   ```
3. Upload to TestFlight
4. Install and launch - app should no longer crash

## Related Issues

This crash pattern can occur with **ANY** native module that requires initialization parameters:

**Other potential crash points**:
- Firebase SDK - missing `GoogleService-Info.plist`
- Maps SDK - missing API key
- Push notifications - missing certificates
- OAuth providers - missing client IDs

**General pattern to follow**:
```tsx
// Always validate before initializing native modules
const requiredConfig = {
  apiKey: process.env.SOME_API_KEY,
  clientId: process.env.CLIENT_ID,
};

if (!requiredConfig.apiKey || !requiredConfig.clientId) {
  return <ErrorScreen missingConfig={requiredConfig} />;
}

return <NativeModuleProvider config={requiredConfig} />;
```

## Prevention Checklist

For future TestFlight builds:

- [ ] All environment variables declared in `eas.json`
- [ ] EAS secrets configured via `eas secret:create`
- [ ] Secrets verified with `eas secret:list`
- [ ] Local testing with missing `.env` file
- [ ] Native module initialization guarded with validation
- [ ] Error screens shown instead of crashes
- [ ] Build logs reviewed for environment variable warnings

## Documentation Created

- **MOBILE_ENV_SETUP.md** - Comprehensive guide for EAS secrets configuration
- **TESTFLIGHT_CRASH_FIX_4.md** - This document (root cause analysis and fix)

## Files Modified

1. `apps/mobile/App.tsx` - Added environment variable validation
2. `apps/mobile/eas.json` - Added required environment variables to build profiles
3. `docs/MOBILE_ENV_SETUP.md` - Created EAS secrets setup guide
4. `docs/TESTFLIGHT_CRASH_FIX_4.md` - This crash fix documentation

## Next Steps

1. **Configure EAS secrets** (see MOBILE_ENV_SETUP.md)
2. **Build new version** with `eas build --profile preview --platform ios`
3. **Test locally** by removing `.env` to verify error handling
4. **Submit to TestFlight** and verify no crash on startup
5. **Monitor crash reports** in App Store Connect

## Summary

**Problem**: App crashed immediately on open due to missing Clerk/Stripe keys  
**Cause**: Native modules initialized with undefined/empty keys  
**Solution**: Add validation before initialization + configure EAS secrets  
**Status**: Fixed - ready for new build after EAS secrets configuration  
**Build Version**: Next build will be 1.0.0 (7)
