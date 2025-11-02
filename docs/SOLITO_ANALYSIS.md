# Solito Analysis: What It Is, What We Use It For, and Are We Using It Properly?

## 🤔 What is Solito?

**Solito** is a cross-platform navigation library that unifies routing between React Native (Expo) and Next.js web applications. Created by Fernando Rojo, it allows you to:

1. **Share navigation code** between mobile and web
2. **Use type-safe routing** with centralized route definitions
3. **Write once, navigate everywhere** - same navigation hooks work on both platforms
4. **Leverage native navigation** - uses React Navigation on mobile, Next.js router on web

### Core Concepts

```typescript
// Define routes once
export const routes = {
  home: '/',
  rounds: '/rounds',
  product: '/products/[id]',
}

// Use anywhere (mobile or web)
import { useLink } from 'solito/navigation'

const linkProps = useLink({ href: routes.home })
<Button {...linkProps}>Go Home</Button>
```

### What Solito Does Behind the Scenes

**On Web (Next.js)**:
- `useLink()` returns Next.js Link props
- `useRouter()` returns Next.js router
- URLs work normally: `/products/123`

**On Mobile (React Native)**:
- `useLink()` returns React Navigation linking props
- `useRouter()` returns React Navigation router
- Translates routes to React Navigation: `products/123`

## 🎯 What We Use Solito For

In ButterGolf, Solito serves several purposes:

### 1. **Shared Screen Components**

We have a `packages/app` package that contains screens used by both web and mobile:

```
packages/app/
├── src/
│   ├── features/
│   │   ├── home/screen.tsx       (HomeScreen - used on web & mobile)
│   │   ├── rounds/screen.tsx     (RoundsScreen - used on web & mobile)
│   │   └── onboarding/screen.tsx (OnboardingScreen - mobile only)
│   └── navigation/
│       ├── routes.ts              (Centralized route definitions)
│       └── params.ts              (Type-safe URL parameters)
```

### 2. **Cross-Platform Navigation**

```typescript
// packages/app/src/navigation/routes.ts
export const routes = {
    home: '/',
    rounds: '/rounds',
    roundDetail: '/rounds/[id]',
}

// packages/app/src/features/rounds/screen.tsx
import { useLink } from 'solito/navigation'
import { routes } from '../../navigation'

export function RoundsScreen() {
  const homeLink = useLink({ href: routes.home })
  
  return (
    <Button {...homeLink}>Back to Home</Button>
  )
}
```

This same `RoundsScreen` works on:
- **Web**: Next.js at `/rounds`
- **Mobile**: React Navigation screen

### 3. **Type-Safe Parameters**

```typescript
// packages/app/src/navigation/params.ts
import { createParam } from 'solito'

export const { useParam } = createParam<{ id: string }>()

// Use in a screen
function ProductScreen() {
  const [id] = useParam('id')  // TypeScript knows this is a string
  // Fetch product with id
}
```

## 🔍 Are We Using Solito Properly?

### ✅ What We're Doing Right

1. **Proper Package Structure**
   - ✅ Have `packages/app` for shared screens
   - ✅ Centralized routes in `packages/app/src/navigation/routes.ts`
   - ✅ Type-safe parameters with `createParam`

2. **Correct Imports**
   - ✅ Using `useLink` from `solito/navigation` (not `Link` from `solito/link`)
   - ✅ Spreading link props correctly: `<Button {...linkProps}>`

3. **Version Alignment**
   - ✅ All packages use Solito v5.0.0 (latest)
   - ✅ `apps/web`, `apps/mobile`, `packages/app` all have it

4. **Next.js Configuration**
   - ✅ `solito` is in `transpilePackages` in `next.config.js`
   - ✅ Expo packages also transpiled (`expo-linking`, `expo-constants`, etc.)

### ⚠️ What We're NOT Using Properly (CRITICAL)

**Problem**: We're **NOT actually using Solito for navigation on mobile!**

#### Current Mobile Setup (NOT using Solito)

```tsx
// apps/mobile/App.tsx
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Rounds" component={RoundsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
```

**This is React Navigation without Solito integration!**

The `useLink({ href: '/rounds' })` in `RoundsScreen` won't work on mobile because:
1. React Navigation doesn't know about the `/rounds` route
2. No linking configuration to map Solito routes to React Navigation screens
3. The navigation is manually configured with `Stack.Navigator`

#### What We SHOULD Be Doing

**Option 1: Expo Router (Recommended with Solito v5)**

Solito v5 is designed to work with Expo Router (file-based routing):

```
apps/mobile/
├── app/
│   ├── _layout.tsx          (Root layout with Provider)
│   ├── index.tsx            (Home screen)
│   ├── rounds/
│   │   ├── index.tsx        (Rounds list)
│   │   └── [id].tsx         (Round detail)
```

```tsx
// apps/mobile/app/_layout.tsx
import { Provider } from '@buttergolf/app'
import { Stack } from 'expo-router'

export default function RootLayout() {
  return (
    <Provider>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="rounds/index" options={{ title: 'Rounds' }} />
      </Stack>
    </Provider>
  )
}

// apps/mobile/app/index.tsx
import { HomeScreen } from '@buttergolf/app'
export default HomeScreen

// apps/mobile/app/rounds/index.tsx
import { RoundsScreen } from '@buttergolf/app'
export default RoundsScreen
```

**Option 2: Manual React Navigation with Linking Config**

If we want to keep React Navigation (not Expo Router), we need linking configuration:

```tsx
import { NavigationContainer } from '@react-navigation/native'
import { useLinking } from 'solito/navigation'

const linking = {
  prefixes: ['buttergolf://'],
  config: {
    screens: {
      Home: '',                    // Maps to '/'
      Rounds: 'rounds',           // Maps to '/rounds'
      RoundDetail: 'rounds/:id',  // Maps to '/rounds/[id]'
    },
  },
}

export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Rounds" component={RoundsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
```

### 🚨 Current Status: Partially Broken

**On Web**: ✅ **Works perfectly**
- Next.js handles all routing
- Solito's `useLink` returns Next.js Link props
- Navigation works as expected

**On Mobile**: ⚠️ **NOT using Solito**
- React Navigation is manually configured
- Solito's navigation hooks won't work properly
- The `useLink({ href: '/rounds' })` in `RoundsScreen` won't navigate correctly
- No integration between Solito routes and React Navigation

## 📊 Impact Assessment

### What Currently Works

1. **Web navigation** - Perfect
2. **Shared UI components** - Work on both platforms
3. **Tamagui theming** - Applied universally
4. **Clerk authentication** - Working on both platforms

### What's Broken/Limited

1. **Mobile navigation with Solito** - Not integrated
2. **Cross-platform navigation** - Only works on web
3. **Dynamic routes on mobile** - Would need manual setup for each route

### Example of the Problem

```tsx
// This screen is in packages/app/src/features/rounds/screen.tsx
import { useLink } from 'solito/navigation'

export function RoundsScreen() {
  const homeLink = useLink({ href: '/' })  // ← This won't work on mobile!
  
  return <Button {...homeLink}>Back to Home</Button>
}
```

**On Web**: Button navigates to `/` (works)  
**On Mobile**: Button does nothing (Solito not connected to React Navigation)

## ✅ Recommendations

### Option A: Switch to Expo Router (Best Practice with Solito v5)

**Effort**: Medium (3-4 hours)  
**Benefit**: Full Solito integration, file-based routing, better alignment with modern Expo

**Steps**:
1. Install Expo Router: `pnpm add expo-router --filter mobile`
2. Restructure `apps/mobile` to use file-based routing
3. Move React Navigation config to Expo Router
4. Test all navigation flows

**Pros**:
- ✅ Proper Solito integration
- ✅ File-based routing (like Next.js)
- ✅ Automatic deep linking
- ✅ Better developer experience

**Cons**:
- ⚠️ Requires restructuring mobile app
- ⚠️ Need to migrate existing navigation setup

### Option B: Add Linking Configuration to React Navigation

**Effort**: Low (1 hour)  
**Benefit**: Minimal changes, keeps current structure

**Steps**:
1. Add linking config to `NavigationContainer`
2. Map Solito routes to React Navigation screens
3. Test navigation

**Pros**:
- ✅ Quick fix
- ✅ Keeps current structure
- ✅ Minimal code changes

**Cons**:
- ⚠️ Manual route mapping required
- ⚠️ Not leveraging Solito v5 features
- ⚠️ More maintenance overhead

### Option C: Keep Web-Only Navigation (Current State)

**Effort**: None  
**Benefit**: Nothing changes

**Steps**: None

**Pros**:
- ✅ No work required
- ✅ Web works perfectly

**Cons**:
- ❌ Mobile navigation not using Solito
- ❌ Can't share navigation code
- ❌ Not getting value from Solito
- ❌ Future navigation features won't work on mobile

## 🎯 My Recommendation

**Go with Option B (Add Linking Config)** for now because:

1. **Quick to implement** - 1 hour vs 3-4 hours
2. **Minimal disruption** - No need to restructure mobile app
3. **Gets Solito working** - Achieves cross-platform navigation
4. **MVP-appropriate** - Solves the immediate problem
5. **Can migrate later** - Can still switch to Expo Router post-MVP

### Implementation Example

```tsx
// apps/mobile/App.tsx
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { HomeScreen, RoundsScreen } from '@buttergolf/app'
import { routes } from '@buttergolf/app/src/navigation'

const Stack = createNativeStackNavigator()

const linking = {
  prefixes: ['buttergolf://', 'https://buttergolf.com'],
  config: {
    screens: {
      Home: routes.home,           // '/'
      Rounds: routes.rounds,       // '/rounds'
      RoundDetail: routes.roundDetail.replace('[id]', ':id'), // '/rounds/:id'
    },
  },
}

export default function App() {
  return (
    <Provider>
      <NavigationContainer linking={linking}>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Rounds" component={RoundsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}
```

## 📝 Summary

### What is Solito?
Cross-platform navigation library that unifies routing between React Native and Next.js.

### What do we use it for?
Sharing screen components and navigation code between web and mobile apps.

### Are we using it properly?
- ✅ **Web**: Yes, perfectly
- ❌ **Mobile**: No, not integrated with navigation
- ⚠️ **Overall**: Partially - getting some benefits but not full value

### Next Steps
1. Add React Navigation linking configuration (1 hour)
2. Test navigation on mobile
3. Consider Expo Router migration post-MVP

---

**Status**: Needs fixing for mobile ⚠️  
**Priority**: Medium (works on web, needs mobile integration)  
**Effort**: 1 hour to fix with linking config
