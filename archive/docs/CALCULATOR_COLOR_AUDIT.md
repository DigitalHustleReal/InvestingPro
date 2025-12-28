# Deep Color & Background Audit - All Calculators

## Baseline: SIP Calculator (SIPCalculatorWithInflation.tsx)

### Results Card
- Background: `bg-gradient-to-br from-teal-50 to-emerald-50`
- Stats Boxes Border: `border-emerald-100`
- Stats Boxes: `p-5`, `rounded-2xl`
- Label Text: `text-[10px]`, `tracking-widest`, `mb-2`
- Value Text: `text-lg`
- Primary Accent: `text-teal-600` (Total/Real Value)
- Secondary Accent: `text-emerald-600` (Returns)
- Info Box: `from-blue-50 to-indigo-50` with `border-blue-100` (standardized)

---

## Issues Found

### 1. ❌ NPS Calculator (NPSCalculator.tsx)
**Critical Issues:**
- Results Card: Uses `from-indigo-50 to-blue-50` instead of `from-teal-50 to-emerald-50`
- Should match investment calculator theme (teal/emerald)

### 2. ⚠️ EMI Calculator (EMICalculatorEnhanced.tsx)
**Text/Sizing Issues:**
- Stats boxes: Uses `text-[9px]` instead of `text-[10px]`
- Stats boxes: Uses `tracking-wider` instead of `tracking-widest`
- Stats boxes: Uses `mb-1.5` instead of `mb-2`
- Stats boxes: Uses `p-4` instead of `p-5`
- Stats boxes: Uses `rounded-xl` instead of `rounded-2xl`
- Stats boxes: Uses `text-base` instead of `text-lg`
- Info box: Uses `from-blue-50 to-indigo-50` (OK, but could be amber/orange themed)

### 3. ⚠️ Tax Calculator (TaxCalculator.tsx)
**Text/Sizing Issues:**
- Stats boxes: Uses `text-[9px]` instead of `text-[10px]`
- Stats boxes: Uses `tracking-wider` instead of `tracking-widest`
- Stats boxes: Uses `mb-1.5` instead of `mb-2`
- Stats boxes: Uses `p-4` instead of `p-5`
- Stats boxes: Uses `rounded-xl` instead of `rounded-2xl`
- Stats boxes: Uses `text-base` instead of `text-lg`
- Info boxes: Uses `from-blue-50 to-indigo-50` (OK for comparison feature)

### 4. ⚠️ Lumpsum Calculator (LumpsumCalculatorWithInflation.tsx)
**Info Box:**
- Info box: Uses `from-blue-50 to-indigo-50` (OK - standardized across calculators)

### 5. ⚠️ SWP Calculator (SWPCalculator.tsx)
**Info Box:**
- Info box: Uses `from-blue-50 to-indigo-50` (OK - standardized across calculators)

### 6. ✅ FD Calculator (FDCalculator.tsx)
**Status:** Fixed - Now uses consistent amber/orange theme

### 7. ✅ PPF Calculator (PPFCalculator.tsx)
**Status:** Fixed - Now uses teal/emerald theme

### 8. ✅ Goal Planning Calculator (GoalPlanningCalculator.tsx)
**Status:** Correct - Uses teal/emerald theme
- Note: Uses `border-teal-100` instead of `border-emerald-100` in some places (minor inconsistency)

### 9. ✅ Retirement Calculator (RetirementCalculator.tsx)
**Status:** Fixed - Uses teal/emerald theme
- Note: Uses `border-emerald-100` and `border-teal-100` (both acceptable for variation)

### 10. ✅ Inflation Adjusted Calculator (InflationAdjustedCalculator.tsx)
**Status:** Fixed - Uses teal/emerald theme

---

## Summary of Required Fixes

### High Priority
1. **NPS Calculator**: Change Results Card from `indigo-50/blue-50` to `teal-50/emerald-50`

### Medium Priority (Text/Sizing Consistency)
2. **EMI Calculator**: Fix stats box sizing to match SIP (text size, padding, border radius)
3. **Tax Calculator**: Fix stats box sizing to match SIP (text size, padding, border radius)

### Low Priority (Optional)
4. **Info Boxes**: Consider theme-appropriate colors (but blue/indigo is currently standardized)

---

## Color Scheme Standards

### Investment Calculators (Should use teal/emerald)
- SIP ✅
- Lumpsum ✅
- SWP ✅
- PPF ✅
- NPS ❌ (needs fix)
- Goal Planning ✅
- Retirement ✅
- Inflation Adjusted ✅

### Deposit Calculators (Should use amber/orange)
- FD ✅

### Loan Calculators (Should use amber/orange)
- EMI ✅ (colors OK, sizing needs fix)

### Tax Calculator (Uses multi-color - appropriate)
- Tax ✅ (colors OK, sizing needs fix)

---

## Standard Stats Box Styling (SIP Baseline)
```tsx
<div className="text-center p-5 bg-white rounded-2xl shadow-sm border border-emerald-100">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Label</p>
    <p className="text-lg font-extrabold text-teal-600">Value</p>
</div>
```


















