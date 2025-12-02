# 🧪 Color Space Verification Test

## Manual Testing Instructions

### Step 1: Open Browser DevTools

1. Navigate to `http://localhost:3000` in Safari or Chrome on macOS
2. Open DevTools (Cmd + Option + I)
3. Inspect the header element (orange background)

### Step 2: Check Computed Styles

In the Computed tab, look for `background-color`:

**✅ Expected (sRGB format):**

```css
background-color: color(srgb 0.8863 0.3725 0.1843);
```

**❌ Old format (would be):**

```css
background-color: #e25f2f;
```

or

```css
background-color: rgb(226, 95, 47);
```

### Step 3: Use Digital Color Meter (macOS)

1. Open "Digital Color Meter" (Applications → Utilities)
2. Set display in native values: View → Display in native values
3. Hover over the butter orange header

**✅ Expected RGB Values:**

- Red: 226
- Green: 95
- Blue: 47

**❌ Previous (Display P3 interpretation):**

- Red: ~210
- Green: ~103
- Blue: ~62

### Step 4: Browser Color Picker

1. In DevTools, click the color swatch next to `background-color`
2. Check the RGB sliders or values

**✅ Expected:**

- R: 226
- G: 95
- B: 47

### Step 5: Visual Comparison

1. Place a PNG asset with butter orange (#E25F2F) next to the header
2. Colors should match exactly - no visible difference
3. Take a screenshot and inspect both areas with Digital Color Meter

## Automated Testing (Future)

```javascript
// Playwright/Cypress test (example)
describe("Color Space Rendering", () => {
  it("should render butter orange in sRGB color space", async () => {
    const header = await page.$(".butter-header");
    const bgColor = await header.evaluate(
      (el) => getComputedStyle(el).backgroundColor,
    );

    // Should contain 'color(srgb' instead of 'rgb(' or '#'
    expect(bgColor).toContain("color(srgb");
    expect(bgColor).toMatch(/color\(srgb 0\.88\d{2} 0\.37\d{2} 0\.18\d{2}\)/);
  });
});
```

## Common Issues

### Issue: Still seeing hex values

**Cause**: Browser cache or old build artifacts
**Solution**:

```bash
pnpm clean
pnpm install
pnpm --filter web build
```

### Issue: Color looks different on iOS

**Cause**: iOS Safari handles color spaces differently
**Solution**: Test on actual device, not simulator. The sRGB format should work correctly.

### Issue: Colors look washed out

**Cause**: Incorrect RGB normalization
**Solution**: Verify helper function uses `(value / 255).toFixed(4)` for proper conversion

## Browser Compatibility

| Browser | Version | sRGB Support    |
| ------- | ------- | --------------- |
| Safari  | 15+     | ✅ Full support |
| Chrome  | 111+    | ✅ Full support |
| Firefox | 113+    | ✅ Full support |
| Edge    | 111+    | ✅ Full support |

**Note**: All modern browsers support `color(srgb ...)` syntax. For older browsers, consider adding hex fallbacks.

## Validation Checklist

- [ ] DevTools shows `color(srgb ...)` format for background colors
- [ ] Digital Color Meter reads RGB(226, 95, 47) for butter orange
- [ ] Visual comparison with PNG assets shows no color difference
- [ ] Header background matches logo orange exactly
- [ ] All semantic colors (primary, secondary, etc.) render consistently
- [ ] Hover/press/focus states maintain color accuracy
- [ ] Dark theme colors also use sRGB format
- [ ] Transparent colors (rgba) use sRGB with alpha notation

## Success Criteria

✅ **All checks passed**: Colors now render in explicit sRGB color space
✅ **Brand accuracy**: Butter orange displays as rgb(226, 95, 47) exactly
✅ **Asset matching**: CSS backgrounds match PNG/SVG colors perfectly
✅ **Cross-browser**: Consistent rendering on Safari, Chrome, Firefox, Edge

---

**Test Date**: **********\_**********  
**Tester**: **********\_**********  
**Browser**: **********\_**********  
**OS**: **********\_**********  
**Result**: ✅ Pass / ❌ Fail  
**Notes**: **********\_**********
