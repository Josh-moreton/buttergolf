# Turborepo + Tamagui Setup Review Recommendations

## 🔴 Critical Issues

### 1. Missing `.tamagui` Directory in .gitignore
**Issue**: Tamagui compiler generates files into `.tamagui/` that should not be committed.
**Fix**: Add `.tamagui` to your root `.gitignore`

### 2. Wrong Tamagui Config Version
**Issue**: Using `@tamagui/config/v3` instead of `v4` (the latest)
**Impact**: Missing latest features, optimizations, and bug fixes
**Fix**: Update to v4 for better performance and aligned best practices

### 3. Missing Tamagui Dependencies in Root package.json
**Issue**: Root package.json has Tamagui deps but UI package doesn't list them
**Impact**: Confusion about where dependencies live, potential hoisting issues
**Recommendation**: Move Tamagui deps to `packages/ui/package.json` where they're actually used

### 4. Missing `@tamagui/next-plugin` Setup
**Issue**: Next.js app not using Tamagui's compiler plugin
**Impact**: No CSS extraction, no optimizations, larger bundles, slower runtime
**Benefit**: 30-50% performance improvement on web with compiler

### 5. No Babel Plugin for Mobile
**Issue**: Mobile app lacks `@tamagui/babel-plugin` in babel.config.js
**Impact**: Missing runtime optimizations on native
**Note**: This is optional but recommended for production

### 6. Package Naming Convention ✅ FIXED
**Issue**: Using `@my-scope` placeholder
**Fix Applied**: Renamed to `@buttergolf` throughout the codebase
**Files Updated**: All package.json files, imports, configs, and documentation

## 🟡 Moderate Issues

### 7. UI Package Missing Tamagui Dependencies
**Issue**: `packages/ui/package.json` doesn't list tamagui or @tamagui/* packages
**Impact**: Unclear dependencies, potential resolution issues
**Fix**: Add `tamagui` and related packages to UI package dependencies

### 8. Missing `exports` Field Details
**Issue**: UI package exports are basic, not following Turborepo best practices
**Impact**: Can't tree-shake or target specific exports efficiently
**Recommendation**: Use more specific exports paths

### 9. No Component Optimization
**Issue**: Components don't use `name` prop for compiler optimization
**Impact**: Compiler can't optimize as effectively
**Example**: `styled(View, { name: 'MyComponent' })`

### 10. Missing Theme Configuration
**Issue**: Using default Tamagui config without customization
**Impact**: Generic looking app, not leveraging design system power
**Recommendation**: Consider customizing themes for your brand

## 🟢 Nice-to-Have Improvements

### 11. No TypeScript Path Aliases in tsconfig
**Issue**: `@my-scope/*` paths defined but not optimally configured
**Impact**: Minor - works but could be cleaner

### 12. Missing Build Output Directories in turbo.json
**Issue**: `outputs` in turbo.json doesn't include `dist/**` from potential packages
**Impact**: Cache might not work optimally if you build packages

### 13. No Shared ESLint/TS Config Usage in Apps
**Issue**: Apps don't extend shared configs from packages
**Impact**: Inconsistent linting across workspace

### 14. Missing Development Scripts
**Issue**: No easy script to run both web and mobile together
**Impact**: Developer experience - have to run two terminals

### 15. No Turborepo Remote Caching Setup
**Issue**: Not leveraging Vercel/Turborepo remote cache
**Impact**: Slower CI/CD, no team-wide cache sharing

---

## 📝 Priority Action Items

### Immediate (Do Today)
1. Add `.tamagui` to .gitignore
2. Upgrade to `@tamagui/config/v4`
3. Move Tamagui dependencies to correct packages
4. Rename `@my-scope` to your actual namespace

### Short Term (This Week)
5. Add `@tamagui/next-plugin` to Next.js setup
6. Add proper exports to UI package
7. Add `name` props to styled components
8. Set up babel plugin for mobile (optional but good)

### Medium Term (This Sprint)
9. Customize Tamagui themes for your brand
10. Add shared build scripts for better DX
11. Consider adding Tamagui compiler extraction

### Long Term (Nice to Have)
12. Set up Turborepo remote caching
13. Add more sophisticated component library
14. Consider adding Tamagui Studio for theme editing

---

## 🎯 Quick Wins

These are easy fixes that give immediate benefits:

1. **Update .gitignore** (30 seconds)
2. **Change to v4** (2 minutes)
3. **Rename packages** (5 minutes)
4. **Add .tamagui to .gitignore** (30 seconds)

Total time for quick wins: ~8 minutes
Impact: Cleaner repo, better performance, latest features

---

## 📚 References

- [Turborepo Docs](https://turbo.build/repo/docs)
- [Tamagui Config v4](https://tamagui.dev/docs/core/config-v4)
- [Tamagui Compiler Install](https://tamagui.dev/docs/intro/compiler-install)
- [Next.js with Tamagui](https://tamagui.dev/docs/guides/next-js)
- [Expo with Tamagui](https://tamagui.dev/docs/guides/expo)
