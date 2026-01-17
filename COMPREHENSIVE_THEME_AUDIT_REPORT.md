# 🔍 Comprehensive Theme & UI Audit Report
**Generated:** 2026-01-16T07:26:15.499Z
**Total Issues Found:** 3002

## 📊 Summary by Severity

- **Critical:** 1 issues
- **High:** 1555 issues
- **Medium:** 1012 issues
- **Low:** 434 issues

## 📊 Summary by Category

- **Dark Theme:** 1951 issues
- **Hardcoded Colors:** 617 issues
- **Text Messaging:** 434 issues
- **Styling:** 0 issues

---

## 🚨 Critical Issues


### `app\stocks\[slug]\page.tsx:177`
- **Issue:** text-black without dark mode variant
- **Suggestion:** Add dark:text-white (critical for dark mode)
- **Code:** `stock.analystRating === 'Hold' ? 'bg-accent-500 text-black' :`


---

## ⚠️ High Priority Issues


### `app\admin\ads\page.tsx:85`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\ads\page.tsx:98`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\ads\page.tsx:129`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\ads\page.tsx:136`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\affiliates\page.tsx:126`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\affiliates\page.tsx:156`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\affiliates\page.tsx:172`
- **Issue:** bg-slate-50 without dark mode variant
- **Suggestion:** Add dark:bg-slate-900/50 or dark:bg-slate-800/50


### `app\admin\affiliates\page.tsx:199`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\affiliates\page.tsx:210`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\affiliates\page.tsx:212`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\ai-personas\page.tsx:103`
- **Issue:** bg-slate-50 without dark mode variant
- **Suggestion:** Add dark:bg-slate-900/50 or dark:bg-slate-800/50


### `app\admin\ai-personas\page.tsx:134`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\ai-personas\page.tsx:156`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\ai-personas\page.tsx:181`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\ai-personas\page.tsx:234`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\ai-personas\page.tsx:238`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\ai-personas\page.tsx:242`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\ai-personas\page.tsx:246`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\ai-personas\page.tsx:270`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\ai-personas\page.tsx:274`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\articles\[id]\edit\page.tsx:313`
- **Issue:** text-slate-900 without dark mode variant
- **Suggestion:** Add dark:text-white or dark:text-slate-100


### `app\admin\articles\[id]\edit-refactored\page.tsx:260`
- **Issue:** text-slate-900 without dark mode variant
- **Suggestion:** Add dark:text-white or dark:text-slate-100


### `app\admin\articles\[id]\edit-refactored\page.tsx:301`
- **Issue:** bg-slate-50 without dark mode variant
- **Suggestion:** Add dark:bg-slate-900/50 or dark:bg-slate-800/50


### `app\admin\authors\page.tsx:179`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\authors\page.tsx:188`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\authors\page.tsx:213`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\authors\page.tsx:218`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\authors\page.tsx:225`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\authors\page.tsx:238`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\authors\page.tsx:240`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\authors\page.tsx:264`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\authors\page.tsx:268`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\authors\page.tsx:277`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\authors\page.tsx:286`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\authors\page.tsx:292`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\authors\page.tsx:296`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\authors\page.tsx:302`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\automation\batch\page.tsx:149`
- **Issue:** text-slate-900 without dark mode variant
- **Suggestion:** Add dark:text-white or dark:text-slate-100


### `app\admin\automation\batch\page.tsx:156`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\automation\batch\page.tsx:251`
- **Issue:** bg-slate-50 without dark mode variant
- **Suggestion:** Add dark:bg-slate-900/50 or dark:bg-slate-800/50


### `app\admin\automation\batch\page.tsx:271`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\automation\batch\page.tsx:275`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\automation\batch\page.tsx:279`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\automation\page.tsx:90`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\automation\page.tsx:101`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\categories\page.tsx:192`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\categories\page.tsx:202`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\categories\page.tsx:221`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\categories\page.tsx:259`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800


### `app\admin\categories\page.tsx:288`
- **Issue:** bg-white without dark mode variant
- **Suggestion:** Add dark:bg-slate-900 or dark:bg-slate-800



*... and 1505 more high priority issues*


---

## 📋 All Issues by File


### app\about\page.tsx
**Total Issues:** 2

- **Line 7:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 143:** Stock market platform terminology (low) - Review if terminology matches platform style


### app\admin\ads\page.tsx
**Total Issues:** 4

- **Line 85:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 98:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 129:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 136:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\admin\affiliates\page.tsx
**Total Issues:** 7

- **Line 109:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 126:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 156:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 172:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 199:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 210:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 212:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\admin\ai-personas\page.tsx
**Total Issues:** 10

- **Line 103:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 134:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 156:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 181:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 234:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 238:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 242:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 246:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 270:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 274:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\admin\analytics\page.tsx
**Total Issues:** 2

- **Line 27:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 31:** Stock market platform terminology (low) - Review if terminology matches platform style


### app\admin\articles\[id]\edit\page.tsx
**Total Issues:** 2

- **Line 313:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 440:** Stock market platform terminology (low) - Review if terminology matches platform style


### app\admin\articles\[id]\edit-refactored\page.tsx
**Total Issues:** 3

- **Line 260:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 301:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 301:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### app\admin\authors\page.tsx
**Total Issues:** 14

- **Line 179:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 188:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 213:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 218:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 225:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 238:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 240:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 264:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 268:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 277:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 286:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 292:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 296:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 302:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\admin\automation\batch\page.tsx
**Total Issues:** 13

- **Line 149:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 156:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 156:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 251:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 251:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 253:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 263:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 271:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 271:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 275:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 275:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 279:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 279:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### app\admin\automation\page.tsx
**Total Issues:** 3

- **Line 77:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 90:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 101:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\admin\categories\page.tsx
**Total Issues:** 6

- **Line 192:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 202:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 221:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 259:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 288:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 309:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\admin\cms\budget\page.tsx
**Total Issues:** 1

- **Line 25:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\admin\cms\generation\page.tsx
**Total Issues:** 2

- **Line 78:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 97:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\admin\cms\health\page.tsx
**Total Issues:** 7

- **Line 34:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 64:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 72:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 104:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 111:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 130:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 137:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\admin\cms\page.tsx
**Total Issues:** 10

- **Line 46:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 66:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 81:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 98:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 110:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 124:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 139:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 155:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 171:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 187:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\admin\content-calendar\page.tsx
**Total Issues:** 15

- **Line 130:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 152:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 179:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 182:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 197:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 207:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 215:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 227:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 245:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 251:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 283:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 296:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 314:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 326:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 369:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\admin\content-factory\page.tsx
**Total Issues:** 2

- **Line 14:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 100:** Stock market platform terminology (low) - Review if terminology matches platform style


### app\admin\design-system\page.tsx
**Total Issues:** 13

- **Line 85:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 86:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 87:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 88:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 89:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 90:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 91:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 92:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 93:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 94:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 120:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 174:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 178:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\admin\guide\page.tsx
**Total Issues:** 10

- **Line 240:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 405:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 414:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 421:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 440:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 457:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 511:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 528:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 533:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 538:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\admin\login\page.tsx
**Total Issues:** 10

- **Line 188:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 188:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 194:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 195:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 196:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 197:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 205:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 207:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 226:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 245:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\admin\metrics\page.tsx
**Total Issues:** 1

- **Line 107:** Stock market platform terminology (low) - Review if terminology matches platform style


### app\admin\page.tsx
**Total Issues:** 45

- **Line 349:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 384:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 398:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 431:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 468:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 472:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 476:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 488:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 531:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 545:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 550:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 552:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 557:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 568:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 580:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 590:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 600:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 610:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 620:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 624:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 634:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 646:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 680:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 686:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 693:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 700:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 707:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 741:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 746:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 787:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 793:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 805:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 817:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 842:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 848:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 852:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 857:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 864:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 879:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 896:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 905:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 927:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 938:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 956:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 963:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\admin\pillar-pages\new\page.tsx
**Total Issues:** 3

- **Line 115:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 117:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 117:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### app\admin\pillar-pages\[id]\edit\page.tsx
**Total Issues:** 4

- **Line 149:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 178:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 180:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 180:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### app\admin\pipeline-monitor\page.tsx
**Total Issues:** 14

- **Line 50:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 52:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 88:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 95:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 138:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 158:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 194:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 196:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 213:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 303:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 326:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 346:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 391:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 420:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\admin\product-analytics\page.tsx
**Total Issues:** 8

- **Line 167:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 177:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 185:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 198:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 213:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 238:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 256:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 310:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\admin\products\new\page.tsx
**Total Issues:** 1

- **Line 25:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### app\admin\products\page.tsx
**Total Issues:** 7

- **Line 86:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 124:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 157:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 170:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 197:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 206:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 212:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\admin\products\[id]\page.tsx
**Total Issues:** 2

- **Line 37:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 63:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### app\admin\revenue\page.tsx
**Total Issues:** 1

- **Line 142:** Stock market platform terminology (low) - Review if terminology matches platform style


### app\admin\review-queue\page.tsx
**Total Issues:** 4

- **Line 148:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 172:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 209:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 238:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\admin\seo\experiments\page.tsx
**Total Issues:** 8

- **Line 52:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 67:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 68:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 68:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 96:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 96:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 110:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 125:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800


### app\admin\seo\page.tsx
**Total Issues:** 2

- **Line 91:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 111:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\admin\seo\rankings\page.tsx
**Total Issues:** 1

- **Line 107:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50


### app\admin\settings\page.tsx
**Total Issues:** 4

- **Line 138:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 142:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 146:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 150:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\admin\settings\vault\page.tsx
**Total Issues:** 1

- **Line 36:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### app\admin\signup\page.tsx
**Total Issues:** 12

- **Line 193:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 193:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 199:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 200:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 201:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 202:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 210:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 212:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 231:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 250:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 270:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 289:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\admin\tags\page.tsx
**Total Issues:** 6

- **Line 199:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 209:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 233:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 268:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 291:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 315:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\advanced-tools\active-trading\page.tsx
**Total Issues:** 40

- **Line 9:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 23:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 24:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 25:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 35:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 39:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 44:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 44:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 45:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 50:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 58:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 65:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 72:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 73:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 80:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 84:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 84:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 87:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 87:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 89:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 90:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 94:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 94:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 97:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 99:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 104:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 104:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 107:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 119:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 120:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 123:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 132:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 147:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 157:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 157:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 158:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 160:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 161:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 167:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 169:** Stock market platform terminology (low) - Review if terminology matches platform style


### app\advanced-tools\broker-comparison\page.tsx
**Total Issues:** 23

- **Line 32:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 42:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 42:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 43:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 54:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 61:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 68:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 69:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 75:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 76:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 84:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 92:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 92:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 94:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 100:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 100:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 102:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 113:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 131:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 137:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 137:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 138:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 147:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### app\affiliate-disclosure\page.tsx
**Total Issues:** 1

- **Line 229:** Stock market platform terminology (low) - Review if terminology matches platform style


### app\ai-content-writer\page.tsx
**Total Issues:** 15

- **Line 122:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 167:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 340:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 341:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 341:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 342:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 351:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 371:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 395:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 426:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 516:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 560:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 603:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 679:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 683:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### app\api\admin\glossary\seed\route.ts
**Total Issues:** 17

- **Line 24:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 25:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 27:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 29:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 31:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 32:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 33:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 34:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 35:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 44:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 46:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 86:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 92:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 127:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 130:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 132:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 133:** Stock market platform terminology (low) - Review if terminology matches platform style


### app\api\affiliate\track\route.ts
**Total Issues:** 1

- **Line 45:** Stock market platform terminology (low) - Review if terminology matches platform style


### app\api\articles\generate-comprehensive\route.backup.ts
**Total Issues:** 1

- **Line 17:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### app\api\auto-categorize\route.ts
**Total Issues:** 1

- **Line 116:** Stock market platform terminology (low) - Review if terminology matches platform style


### app\api\auto-tags\route.ts
**Total Issues:** 1

- **Line 72:** Stock market platform terminology (low) - Review if terminology matches platform style


### app\api\cron\generate-missing-images\route.ts
**Total Issues:** 5

- **Line 19:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 20:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 21:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 22:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 23:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### app\api\generate-articles\route.ts
**Total Issues:** 1

- **Line 15:** Stock market platform terminology (low) - Review if terminology matches platform style


### app\api\ipo\live\route.ts
**Total Issues:** 3

- **Line 8:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 9:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 26:** Stock market platform terminology (low) - Review if terminology matches platform style


### app\api\products\generate-image\route.ts
**Total Issues:** 7

- **Line 19:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 20:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 21:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 22:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 23:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 24:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 25:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### app\article\[slug]\page.tsx
**Total Issues:** 7

- **Line 99:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 157:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 174:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 186:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 257:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 257:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 302:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### app\articles\page.tsx
**Total Issues:** 4

- **Line 81:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 88:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 90:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 181:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### app\articles\[slug]\page-refactored.tsx
**Total Issues:** 5

- **Line 105:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 133:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 159:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 171:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 217:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### app\articles\[slug]\page.tsx
**Total Issues:** 4

- **Line 126:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 180:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 222:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 305:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### app\banking\page.tsx
**Total Issues:** 7

- **Line 113:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 114:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 128:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 135:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 160:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 170:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 286:** Stock market platform terminology (low) - Review if terminology matches platform style


### app\blog\page.tsx
**Total Issues:** 23

- **Line 87:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 89:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 90:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 108:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 116:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 143:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 143:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 156:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 173:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 175:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 221:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 221:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 236:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 236:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 242:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 248:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 253:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 270:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 270:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 271:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 274:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 281:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 281:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800


### app\calculators\emi\page.tsx
**Total Issues:** 7

- **Line 49:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 62:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 68:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 182:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 245:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 296:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 297:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### app\calculators\fd\page.tsx
**Total Issues:** 7

- **Line 59:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 72:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 78:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 104:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 191:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 301:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 302:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### app\calculators\financial-health-score\page.tsx
**Total Issues:** 1

- **Line 22:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### app\calculators\gst\page.tsx
**Total Issues:** 12

- **Line 110:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 126:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 145:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 181:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 195:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 200:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 212:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 245:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 246:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 257:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 269:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 273:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### app\calculators\home-loan-vs-sip\page.tsx
**Total Issues:** 5

- **Line 11:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 23:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 29:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 29:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 34:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### app\calculators\lumpsum\page.tsx
**Total Issues:** 5

- **Line 88:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 100:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 225:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 227:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 231:** Stock market platform terminology (low) - Review if terminology matches platform style


### app\calculators\nps\page.tsx
**Total Issues:** 1

- **Line 31:** Stock market platform terminology (low) - Review if terminology matches platform style


### app\calculators\page.tsx
**Total Issues:** 14

- **Line 110:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 110:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 112:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 141:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 534:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 554:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 558:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 577:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 597:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 601:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 616:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 629:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 633:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 685:** Stock market platform terminology (low) - Review if terminology matches platform style


### app\calculators\ppf\page.tsx
**Total Issues:** 1

- **Line 31:** Stock market platform terminology (low) - Review if terminology matches platform style


### app\calculators\rd\page.tsx
**Total Issues:** 1

- **Line 97:** Stock market platform terminology (low) - Review if terminology matches platform style


### app\calculators\sip\page.tsx
**Total Issues:** 21

- **Line 104:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 120:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 128:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 144:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 274:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 282:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 286:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 298:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 302:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 306:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 310:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 318:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 357:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 358:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 372:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 384:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 390:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 398:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 404:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 412:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 418:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### app\calculators\swp\page.tsx
**Total Issues:** 28

- **Line 126:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 141:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 148:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 256:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 278:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 278:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 280:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 286:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 287:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 288:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 289:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 293:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 298:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 303:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 321:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 344:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 348:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 352:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 380:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 384:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 391:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 392:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 400:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 404:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 416:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 428:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 431:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 432:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### app\category\[slug]\page.tsx
**Total Issues:** 4

- **Line 83:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 90:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 99:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 161:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### app\compare\investingpro-vs-finology\page.tsx
**Total Issues:** 1

- **Line 213:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\compare\investingpro-vs-paisabazaar\page.tsx
**Total Issues:** 1

- **Line 208:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\compare\investingpro-vs-policybazaar\page.tsx
**Total Issues:** 1

- **Line 208:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\compare\[combination]\page.tsx
**Total Issues:** 12

- **Line 101:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 112:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 112:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 123:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 123:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 130:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 156:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 156:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 160:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 162:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 187:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 187:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### app\component-showcase\page.tsx
**Total Issues:** 61

- **Line 10:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 13:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 99:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 104:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 109:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 122:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 123:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 127:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 129:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 131:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 133:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 135:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 137:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 141:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 156:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 156:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 170:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 176:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 187:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 194:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 198:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 225:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 229:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 230:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 241:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 252:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 265:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 266:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 267:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 271:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 272:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 282:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 287:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 292:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 298:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 298:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 301:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 308:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 315:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 322:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 332:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 334:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 335:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 337:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 356:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 366:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 375:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 401:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 406:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 410:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 414:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 414:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 426:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 432:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 434:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 434:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 440:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 440:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 450:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 456:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 462:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\credit-cards\page.tsx
**Total Issues:** 2

- **Line 227:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 233:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\credit-cards\[slug]\page.tsx
**Total Issues:** 4

- **Line 211:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 257:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 336:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 476:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\dashboard\page.tsx
**Total Issues:** 4

- **Line 29:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 106:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 170:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 274:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\demat-accounts\page.tsx
**Total Issues:** 27

- **Line 36:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 45:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 57:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 79:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 86:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 98:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 102:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 102:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 105:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 105:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 124:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 130:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 133:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 153:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 157:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 158:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 161:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 162:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 165:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 166:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 179:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 192:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 197:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 227:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 236:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 238:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 249:** Stock market platform terminology (low) - Review if terminology matches platform style


### app\demat-accounts\[slug]\page.tsx
**Total Issues:** 8

- **Line 91:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 126:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 148:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 172:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 177:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 290:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 293:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 337:** Stock market platform terminology (low) - Review if terminology matches platform style


### app\disclaimer\page.tsx
**Total Issues:** 22

- **Line 11:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 15:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 35:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 37:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 57:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 63:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 73:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 82:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 93:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 109:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 114:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 125:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 141:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 158:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 159:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 169:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 177:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 190:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 206:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 228:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 257:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 261:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50


### app\docs\page.tsx
**Total Issues:** 1

- **Line 48:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\downloads\page.tsx
**Total Issues:** 2

- **Line 75:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 94:** Stock market platform terminology (low) - Review if terminology matches platform style


### app\editorial\page.tsx
**Total Issues:** 8

- **Line 226:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 232:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 249:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 295:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 295:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 307:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 307:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 357:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### app\editorial-policy\page.tsx
**Total Issues:** 18

- **Line 25:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 29:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 48:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 54:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 60:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 66:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 85:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 94:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 112:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 138:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 177:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 183:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 189:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 195:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 201:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 218:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 222:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 234:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### app\fixed-deposits\page.tsx
**Total Issues:** 22

- **Line 57:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 64:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 87:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 95:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 113:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 120:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 131:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 131:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 139:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 156:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 158:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 166:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 182:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 193:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 215:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 234:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 280:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 295:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 301:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 320:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 320:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 320:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### app\fixed-deposits\[slug]\page.tsx
**Total Issues:** 3

- **Line 125:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 147:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 277:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\glossary\[slug]\page.tsx
**Total Issues:** 1

- **Line 330:** Stock market platform terminology (low) - Review if terminology matches platform style


### app\icon.tsx
**Total Issues:** 1

- **Line 24:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### app\insurance\page.tsx
**Total Issues:** 4

- **Line 493:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 500:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 504:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 507:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\insurance\[slug]\page.tsx
**Total Issues:** 3

- **Line 138:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 160:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 294:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\investing\page.tsx
**Total Issues:** 10

- **Line 232:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 248:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 249:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 260:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 267:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 268:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 269:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 292:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 434:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 473:** Stock market platform terminology (low) - Review if terminology matches platform style


### app\ipo\page.tsx
**Total Issues:** 10

- **Line 58:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 158:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 159:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 174:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 183:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 196:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 243:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 306:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 410:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 412:** Stock market platform terminology (low) - Review if terminology matches platform style


### app\loans\home-loans\page.tsx
**Total Issues:** 21

- **Line 53:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 64:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 85:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 89:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 98:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 107:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 116:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 128:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 130:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 132:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 158:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 192:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 222:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 232:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 252:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 275:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 279:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 288:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 297:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 307:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 317:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### app\loans\page.tsx
**Total Issues:** 6

- **Line 218:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 288:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 425:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 432:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 436:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 439:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\loans\personal-loans\page.tsx
**Total Issues:** 21

- **Line 49:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 67:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 89:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 93:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 103:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 113:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 122:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 132:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 144:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 146:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 148:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 178:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 216:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 254:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 274:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 301:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 305:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 314:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 324:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 334:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 344:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### app\loans\[slug]\page.tsx
**Total Issues:** 6

- **Line 155:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 201:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 205:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 252:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 407:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 484:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\login\page.tsx
**Total Issues:** 8

- **Line 130:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 131:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 136:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 203:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 204:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 205:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 206:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 300:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\methodology\page.tsx
**Total Issues:** 9

- **Line 29:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 50:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 59:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 68:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 77:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 98:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 127:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 149:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 188:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### app\mutual-funds\compare\page.tsx
**Total Issues:** 22

- **Line 22:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 23:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 33:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 35:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 35:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 38:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 41:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 50:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 50:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 52:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 63:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 72:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 72:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 86:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 86:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 86:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 96:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 96:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 96:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 105:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 123:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 126:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### app\mutual-funds\page.tsx
**Total Issues:** 18

- **Line 241:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 241:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 241:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 262:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 263:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 333:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 361:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 376:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 383:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 393:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 404:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 404:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 404:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 493:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 499:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 503:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 506:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 520:** Stock market platform terminology (low) - Review if terminology matches platform style


### app\mutual-funds\[slug]\page.tsx
**Total Issues:** 10

- **Line 237:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 269:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 281:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 366:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 371:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 402:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 417:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 417:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 534:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 583:** Stock market platform terminology (low) - Review if terminology matches platform style


### app\page.tsx
**Total Issues:** 2

- **Line 38:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 41:** Stock market platform terminology (low) - Review if terminology matches platform style


### app\portfolio\page.tsx
**Total Issues:** 18

- **Line 10:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 11:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 12:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 13:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 14:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 41:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 48:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 49:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 56:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 58:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 63:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 65:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 78:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 80:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 81:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 102:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 116:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 121:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\ppf-nps\page.tsx
**Total Issues:** 48

- **Line 29:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 32:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 52:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 63:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 77:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 77:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 92:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 98:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 119:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 122:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 129:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 138:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 139:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 147:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 147:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 152:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 172:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 179:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 183:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 189:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 189:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 204:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 210:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 211:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 231:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 234:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 240:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 248:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 251:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 264:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 265:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 273:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 273:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 275:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 278:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 280:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 299:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 306:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 310:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 316:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 316:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 329:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 336:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 345:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 353:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 356:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 360:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 361:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### app\ppf-nps\[slug]\page.tsx
**Total Issues:** 3

- **Line 129:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 151:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 291:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\preview\[id]\page.tsx
**Total Issues:** 5

- **Line 92:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 131:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 137:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 158:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 170:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### app\privacy\page.tsx
**Total Issues:** 16

- **Line 10:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 12:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 17:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 27:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 56:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 69:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 94:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 111:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 129:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 136:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 152:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 159:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 171:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 186:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 190:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 211:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### app\products\page.tsx
**Total Issues:** 1

- **Line 39:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### app\products\[category]\page.tsx
**Total Issues:** 10

- **Line 31:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 46:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 96:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 124:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 136:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 137:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 156:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 162:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 162:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 171:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### app\products\[category]\[slug]\page.tsx
**Total Issues:** 21

- **Line 35:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 37:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 51:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 59:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 61:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 80:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 163:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 173:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 175:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 177:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 179:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 181:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 183:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 185:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 188:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 190:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 209:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 214:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 224:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 239:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 251:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### app\profile\page.tsx
**Total Issues:** 7

- **Line 119:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 150:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 160:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 164:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 172:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 178:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 241:** Stock market platform terminology (low) - Review if terminology matches platform style


### app\recommendations\page.tsx
**Total Issues:** 12

- **Line 136:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 136:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 155:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 157:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 175:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 205:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 213:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 232:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 232:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 251:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 251:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 251:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### app\resources\page.tsx
**Total Issues:** 6

- **Line 61:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 82:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 93:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 100:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 100:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 113:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### app\reviews\[slug]\page.tsx
**Total Issues:** 14

- **Line 34:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 38:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 38:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 41:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 41:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 50:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 74:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 74:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 86:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 86:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 101:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 101:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 105:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 120:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\risk-profiler\page.tsx
**Total Issues:** 31

- **Line 125:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 265:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 269:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 284:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 285:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 288:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 306:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 306:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 306:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 308:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 308:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 311:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 327:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 345:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 352:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 364:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 372:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 375:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 383:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 383:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 383:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 385:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 388:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 391:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 406:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 408:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 408:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 408:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 414:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 423:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 439:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### app\signup\page.tsx
**Total Issues:** 8

- **Line 146:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 147:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 152:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 212:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 213:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 214:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 215:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 328:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\small-business\page.tsx
**Total Issues:** 7

- **Line 157:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 163:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 167:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 180:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 182:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 185:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 185:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800


### app\stocks\page.tsx
**Total Issues:** 49

- **Line 66:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 67:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 82:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 88:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 91:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 92:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 95:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 96:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 101:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 104:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 127:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 129:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 136:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 144:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 144:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 146:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 146:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 150:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 155:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 163:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 170:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 171:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 178:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 178:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 180:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 180:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 184:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 189:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 202:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 203:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 206:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 212:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 212:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 213:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 216:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 226:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 229:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 232:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 240:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 244:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 261:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 275:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 282:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 293:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 293:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 298:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 301:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 331:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 344:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### app\stocks\[slug]\page.tsx
**Total Issues:** 9

- **Line 144:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 146:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 170:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 177:** text-black without dark mode variant (critical) - Add dark:text-white (critical for dark mode)
- **Line 194:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 307:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 332:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 345:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 358:** Stock market platform terminology (low) - Review if terminology matches platform style


### app\taxes\page.tsx
**Total Issues:** 8

- **Line 130:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 146:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 161:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 182:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 182:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 341:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 361:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 368:** Stock market platform terminology (low) - Review if terminology matches platform style


### app\terminal\page.tsx
**Total Issues:** 17

- **Line 13:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 56:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 61:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 76:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 83:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 83:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 127:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 127:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 141:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 143:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 164:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 180:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 182:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 187:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 235:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 245:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 247:** Stock market platform terminology (low) - Review if terminology matches platform style


### app\terms\page.tsx
**Total Issues:** 22

- **Line 11:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 13:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 18:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 28:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 45:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 58:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 84:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 111:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 116:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 133:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 162:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 178:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 191:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 205:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 218:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 232:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 251:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 266:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 273:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 280:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 284:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 292:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### app\terms-of-service\page.tsx
**Total Issues:** 1

- **Line 53:** Stock market platform terminology (low) - Review if terminology matches platform style


### app\tools\risk-analyzer\page.tsx
**Total Issues:** 1

- **Line 36:** Stock market platform terminology (low) - Review if terminology matches platform style


### app\[category]\page.tsx
**Total Issues:** 2

- **Line 25:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 27:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### app\[category]\[intent]\page.tsx
**Total Issues:** 6

- **Line 41:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 46:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 62:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 62:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 64:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 77:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### app\[category]\[intent]\[collection]\page.tsx
**Total Issues:** 7

- **Line 75:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 85:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 109:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 109:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 110:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 113:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 123:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### components\admin\AdminBreadcrumb.tsx
**Total Issues:** 1

- **Line 87:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\admin\AdminInspector.tsx
**Total Issues:** 8

- **Line 26:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 26:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 33:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 34:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 37:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 55:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 55:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 55:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### components\admin\AdminSidebar.tsx
**Total Issues:** 6

- **Line 137:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 140:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 167:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 172:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 197:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 205:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### components\admin\AdminUIKit.tsx
**Total Issues:** 5

- **Line 107:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 163:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 164:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 232:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 287:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\admin\AIContentGenerator.tsx
**Total Issues:** 4

- **Line 295:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 295:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 322:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 322:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### components\admin\AIHealthMonitor.tsx
**Total Issues:** 1

- **Line 42:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\admin\AnalyticsDashboard.tsx
**Total Issues:** 9

- **Line 43:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 78:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 86:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 101:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 112:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 117:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 119:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 151:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 175:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\admin\ArticleEditor.tsx
**Total Issues:** 2

- **Line 222:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 230:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\admin\ArticleModeration.tsx
**Total Issues:** 8

- **Line 130:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 151:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 155:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 175:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 194:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 203:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 226:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 230:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\admin\ArticleVersionHistory.tsx
**Total Issues:** 3

- **Line 159:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 159:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 164:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\admin\AutomationControlCenter.tsx
**Total Issues:** 2

- **Line 134:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 147:** Stock market platform terminology (low) - Review if terminology matches platform style


### components\admin\AutomationControls.tsx
**Total Issues:** 23

- **Line 81:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 127:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 138:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 146:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 164:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 172:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 190:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 192:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 198:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 220:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 230:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 260:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 270:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 290:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 291:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 293:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 312:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 359:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 376:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 387:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 397:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 408:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 418:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\admin\BudgetGovernorPanel.tsx
**Total Issues:** 1

- **Line 108:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\admin\BulkGenerationPanel.tsx
**Total Issues:** 1

- **Line 61:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\admin\ContentPerformanceTracking.tsx
**Total Issues:** 23

- **Line 133:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 153:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 173:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 193:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 197:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 213:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 225:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 226:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 234:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 239:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 242:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 243:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 248:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 250:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 258:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 275:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 279:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 284:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 297:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 308:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 323:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 338:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 351:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\admin\ContextualSidebar.tsx
**Total Issues:** 3

- **Line 61:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 89:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 94:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### components\admin\CostDashboard.tsx
**Total Issues:** 4

- **Line 257:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 303:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 337:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 371:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### components\admin\DarkThemeCMS.tsx
**Total Issues:** 14

- **Line 161:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 217:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 229:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 241:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 250:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 284:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 303:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 377:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 424:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 505:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 510:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 546:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 551:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 561:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\admin\EditorialQADashboard.tsx
**Total Issues:** 1

- **Line 76:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50


### components\admin\EnhancedWordPressStyleCMS.tsx
**Total Issues:** 18

- **Line 138:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 140:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 141:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 148:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 150:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 176:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 181:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 191:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 191:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 227:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 230:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 239:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 239:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 242:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 242:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 270:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 292:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 368:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50


### components\admin\extensions\SemanticImage.ts
**Total Issues:** 1

- **Line 55:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### components\admin\FeaturedImageSelector.tsx
**Total Issues:** 5

- **Line 126:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 126:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 143:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 145:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 146:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\admin\GlobalSearch.tsx
**Total Issues:** 8

- **Line 32:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 267:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 268:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 277:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 312:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 315:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 318:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 321:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\admin\ImageEditor.tsx
**Total Issues:** 1

- **Line 309:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### components\admin\media\MediaLibrary.tsx
**Total Issues:** 2

- **Line 154:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 164:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\admin\MediaLibraryPicker.tsx
**Total Issues:** 2

- **Line 318:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 366:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\admin\OneClickArticleGenerator.tsx
**Total Issues:** 7

- **Line 204:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 570:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 629:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 632:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 668:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 668:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 733:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\admin\preview\PreviewPane.tsx
**Total Issues:** 10

- **Line 79:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 79:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 85:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 107:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 107:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 108:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 111:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 139:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 139:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 139:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### components\admin\ProductForm.tsx
**Total Issues:** 4

- **Line 198:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 217:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 332:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 345:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\admin\ProductPerformanceTracking.tsx
**Total Issues:** 33

- **Line 118:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 122:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 128:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 148:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 168:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 188:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 192:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 208:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 220:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 221:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 224:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 225:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 233:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 238:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 241:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 242:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 247:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 249:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 256:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 258:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 267:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 284:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 292:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 302:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 313:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 355:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 366:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 381:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 397:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 408:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 442:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 457:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 472:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\admin\PromptManager.tsx
**Total Issues:** 4

- **Line 163:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 163:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 206:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 206:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### components\admin\ScraperDashboard.tsx
**Total Issues:** 4

- **Line 84:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 128:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 133:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 229:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\admin\SEOHealthWidget.tsx
**Total Issues:** 5

- **Line 49:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 61:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 96:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 156:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 177:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\admin\SocialDistributionPanel.tsx
**Total Issues:** 1

- **Line 62:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\admin\SocialPostManager.tsx
**Total Issues:** 6

- **Line 100:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 106:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 118:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 134:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 134:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 137:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800


### components\admin\SocialRepurposeView.tsx
**Total Issues:** 11

- **Line 58:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 75:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 79:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 83:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 87:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 95:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 95:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 107:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 107:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 109:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 146:** Stock market platform terminology (low) - Review if terminology matches platform style


### components\admin\StockImageSearch.tsx
**Total Issues:** 3

- **Line 174:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 217:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 232:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50


### components\admin\TagInput.tsx
**Total Issues:** 4

- **Line 165:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 202:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 202:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 223:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### components\admin\WordPressStyleCMS.tsx
**Total Issues:** 26

- **Line 83:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 87:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 89:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 124:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 126:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 153:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 158:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 164:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 175:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 186:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 197:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 211:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 211:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 237:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 252:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 255:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 270:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 270:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 273:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 273:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 295:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 299:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 317:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 368:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 395:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 405:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\admin\WordPressStylePages.tsx
**Total Issues:** 25

- **Line 78:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 82:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 84:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 130:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 132:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 148:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 153:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 159:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 170:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 181:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 192:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 206:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 206:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 232:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 247:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 250:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 265:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 265:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 268:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 268:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 290:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 294:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 312:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 390:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 400:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\admin\WritesonicAIWriter.tsx
**Total Issues:** 6

- **Line 484:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 487:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 532:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 734:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 760:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 765:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\articles\ArticleRenderer.tsx
**Total Issues:** 3

- **Line 25:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 32:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 32:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### components\articles\AuthorBadge.tsx
**Total Issues:** 3

- **Line 38:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 38:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 45:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\articles\SeamlessCTA.tsx
**Total Issues:** 4

- **Line 26:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 32:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 56:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 106:** Stock market platform terminology (low) - Review if terminology matches platform style


### components\blog\ArticleComponents.tsx
**Total Issues:** 11

- **Line 65:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 68:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 136:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 161:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 168:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 226:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 226:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 241:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 242:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 248:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 250:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\blog\DraggableTableOfContents.tsx
**Total Issues:** 10

- **Line 194:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 194:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 219:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 239:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 239:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 243:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 243:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 315:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 323:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 324:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800


### components\blog\TableOfContents.tsx
**Total Issues:** 7

- **Line 88:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 95:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 166:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 175:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 270:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 275:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 280:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### components\blog\VisualGraphics.tsx
**Total Issues:** 20

- **Line 33:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 64:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 65:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 76:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 94:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 94:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 100:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 108:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 136:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 138:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 139:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 141:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 179:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 206:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 234:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 235:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 259:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 259:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 270:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 297:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\calculators\CompoundInterestCalculator.tsx
**Total Issues:** 9

- **Line 156:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 181:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 191:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 192:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 195:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 196:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 197:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 200:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 201:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### components\calculators\CreditCardRewardsCalculator.tsx
**Total Issues:** 1

- **Line 133:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\calculators\EMICalculatorEnhanced.tsx
**Total Issues:** 13

- **Line 81:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 82:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 107:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 296:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 297:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 300:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 308:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 309:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 338:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 340:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 340:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 350:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 358:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50


### components\calculators\FDCalculator.tsx
**Total Issues:** 17

- **Line 163:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 322:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 322:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 412:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 413:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 416:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 417:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 420:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 421:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 424:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 431:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 433:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 463:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 465:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 465:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 474:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 481:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50


### components\calculators\FinancialHealthCalculator.tsx
**Total Issues:** 14

- **Line 119:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 120:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 121:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 122:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 127:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 142:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 174:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 201:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 218:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 218:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 242:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 246:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 250:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 254:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50


### components\calculators\GoalPlanningCalculator.tsx
**Total Issues:** 7

- **Line 190:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 190:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 263:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 264:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 267:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 275:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 276:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### components\calculators\GSTCalculator.tsx
**Total Issues:** 8

- **Line 71:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 72:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 218:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 236:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 237:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 238:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 241:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 242:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### components\calculators\HomeLoanVsSIPCalculator.tsx
**Total Issues:** 5

- **Line 93:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 101:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 115:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 155:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 183:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\calculators\InflationAdjustedCalculator.tsx
**Total Issues:** 6

- **Line 194:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 195:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 198:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 206:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 207:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 208:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### components\calculators\InsuranceCoverageCalculator.tsx
**Total Issues:** 1

- **Line 66:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\calculators\KVPCalculator.tsx
**Total Issues:** 10

- **Line 140:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 148:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 154:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 166:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 173:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 174:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 177:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 178:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 179:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 181:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### components\calculators\LumpsumCalculatorWithInflation.tsx
**Total Issues:** 19

- **Line 43:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 44:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 108:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 197:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 197:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 310:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 311:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 314:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 315:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 318:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 319:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 322:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 329:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 331:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 361:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 363:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 363:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 372:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 379:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50


### components\calculators\MISCalculator.tsx
**Total Issues:** 10

- **Line 36:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 37:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 73:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 73:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 93:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 117:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 145:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 151:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 158:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 166:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### components\calculators\NPSCalculator.tsx
**Total Issues:** 9

- **Line 176:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 176:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 280:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 281:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 284:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 285:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 288:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 295:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 297:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### components\calculators\NSCCalculator.tsx
**Total Issues:** 8

- **Line 133:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 138:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 157:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 165:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 166:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 167:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 174:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 174:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800


### components\calculators\PPFCalculator.tsx
**Total Issues:** 9

- **Line 154:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 154:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 247:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 248:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 251:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 252:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 255:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 262:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 264:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### components\calculators\RDCalculator.tsx
**Total Issues:** 16

- **Line 57:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 58:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 110:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 118:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 174:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 178:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 214:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 224:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 225:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 228:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 229:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 232:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 233:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 234:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 236:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 237:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### components\calculators\RetirementCalculator.tsx
**Total Issues:** 9

- **Line 113:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 282:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 282:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 370:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 371:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 374:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 375:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 378:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 385:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### components\calculators\RiskResult.tsx
**Total Issues:** 6

- **Line 21:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 22:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 23:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 24:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 51:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 98:** Stock market platform terminology (low) - Review if terminology matches platform style


### components\calculators\SCSSCalculator.tsx
**Total Issues:** 9

- **Line 132:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 139:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 145:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 157:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 165:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 166:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 167:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 174:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 174:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800


### components\calculators\SEOContent.tsx
**Total Issues:** 2

- **Line 62:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 301:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### components\calculators\SimpleInterestCalculator.tsx
**Total Issues:** 5

- **Line 23:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 24:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 122:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 158:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 158:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### components\calculators\SIPCalculator.tsx
**Total Issues:** 2

- **Line 9:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 233:** Stock market platform terminology (low) - Review if terminology matches platform style


### components\calculators\SIPCalculatorWithInflation.tsx
**Total Issues:** 25

- **Line 79:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 80:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 260:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 260:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 296:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 296:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 356:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 445:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 445:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 481:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 481:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 594:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 595:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 598:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 599:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 602:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 603:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 606:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 613:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 615:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 645:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 647:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 647:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 656:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 663:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50


### components\calculators\SSYCalculator.tsx
**Total Issues:** 10

- **Line 181:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 181:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 275:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 276:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 279:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 283:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 284:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 288:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 296:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 298:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### components\calculators\SWPCalculator.tsx
**Total Issues:** 14

- **Line 193:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 355:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 355:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 452:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 453:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 456:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 457:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 460:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 467:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 496:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 498:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 498:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 507:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 514:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50


### components\calculators\TaxCalculator.tsx
**Total Issues:** 8

- **Line 82:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 83:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 108:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 268:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 269:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 272:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 279:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 280:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### components\category\CategoryHero.tsx
**Total Issues:** 15

- **Line 76:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 157:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 181:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 196:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 196:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 206:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 220:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 233:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 234:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 237:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 240:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 246:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 247:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 248:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 253:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\category\ContextualProducts.tsx
**Total Issues:** 8

- **Line 33:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 35:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 39:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 58:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 58:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 63:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 78:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 82:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\charts\PortfolioAllocationChart.tsx
**Total Issues:** 11

- **Line 18:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 19:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 23:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 24:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 25:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 26:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 27:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 28:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 29:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 30:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 39:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### components\common\AdBanner.tsx
**Total Issues:** 7

- **Line 85:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 87:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 87:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 89:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 89:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 91:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 95:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### components\common\AdvertiserDisclosure.tsx
**Total Issues:** 2

- **Line 6:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 6:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800


### components\common\AssetAllocation.tsx
**Total Issues:** 3

- **Line 65:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 80:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 83:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\common\AutoBreadcrumbs.tsx
**Total Issues:** 1

- **Line 43:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\common\AutoInternalLinks.tsx
**Total Issues:** 3

- **Line 76:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 77:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 89:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\common\CategoryHeroCarousel.tsx
**Total Issues:** 8

- **Line 49:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 60:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 60:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 63:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 71:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 76:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 77:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 104:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\common\CrossPlatformLink.tsx
**Total Issues:** 3

- **Line 60:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 144:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 145:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\common\CTAButton.tsx
**Total Issues:** 2

- **Line 15:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 37:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\common\DataProvenance.tsx
**Total Issues:** 6

- **Line 114:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 120:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 154:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 157:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 201:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 202:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50


### components\common\EditorialPageTemplate.tsx
**Total Issues:** 10

- **Line 40:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 60:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 73:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 75:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 83:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 83:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 87:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 103:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 105:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 116:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\common\EmptyState.tsx
**Total Issues:** 1

- **Line 27:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\common\ErrorBoundary.tsx
**Total Issues:** 3

- **Line 72:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 73:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 77:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\common\ExitIntentPopup.tsx
**Total Issues:** 3

- **Line 159:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 175:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 180:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\common\ExpertByline.tsx
**Total Issues:** 3

- **Line 22:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 22:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 35:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\common\GlossaryTemplate.tsx
**Total Issues:** 19

- **Line 49:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 64:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 72:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 85:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 93:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 101:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 102:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 102:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 111:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 123:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 135:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 141:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 141:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 144:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 152:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 158:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 158:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 162:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 187:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### components\common\HoldingsList.tsx
**Total Issues:** 5

- **Line 55:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 55:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 59:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 80:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 87:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\common\ImageWithFallback.tsx
**Total Issues:** 3

- **Line 12:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 13:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 14:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### components\common\LanguageSwitcher.tsx
**Total Issues:** 2

- **Line 89:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 89:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### components\common\Logo.tsx
**Total Issues:** 2

- **Line 40:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 41:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### components\common\LogoIcon.tsx
**Total Issues:** 1

- **Line 19:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### components\common\OnboardingFlow.tsx
**Total Issues:** 9

- **Line 103:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 108:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 112:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 117:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 121:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 126:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 151:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 164:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 235:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\common\Pagination.tsx
**Total Issues:** 3

- **Line 55:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 55:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 105:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### components\common\PointsWidget.tsx
**Total Issues:** 1

- **Line 63:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\common\ProgressiveDisclosure.tsx
**Total Issues:** 7

- **Line 30:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 33:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 52:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 55:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 57:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 65:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 99:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\common\ReviewSection.tsx
**Total Issues:** 2

- **Line 104:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 252:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\common\RiskAnalysis.tsx
**Total Issues:** 5

- **Line 76:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 99:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 99:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 102:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 134:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800


### components\common\SocialShareButtons.tsx
**Total Issues:** 2

- **Line 84:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 93:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### components\common\UserNotRegisteredError.tsx
**Total Issues:** 4

- **Line 6:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 6:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 13:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 17:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50


### components\compare\ComparisonTable.tsx
**Total Issues:** 23

- **Line 18:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 107:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 107:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 109:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 109:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 110:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 110:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 114:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 133:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 146:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 146:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 146:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 149:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 170:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 170:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 189:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 190:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 194:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 207:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 211:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 227:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 228:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 230:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### components\compare\ComparisonTable_broken.tsx
**Total Issues:** 23

- **Line 16:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 59:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 59:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 61:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 61:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 62:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 62:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 66:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 85:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 95:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 95:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 95:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 98:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 107:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 107:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 124:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 125:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 129:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 142:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 146:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 162:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 163:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 165:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### components\compare\ExportButton.tsx
**Total Issues:** 1

- **Line 31:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### components\compare\ProductSelector.tsx
**Total Issues:** 3

- **Line 127:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 127:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 137:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50


### components\compare\SmartRecommendation.tsx
**Total Issues:** 1

- **Line 88:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\comparison\ComparisonCard.tsx
**Total Issues:** 1

- **Line 124:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\comparison\ComparisonTable.tsx
**Total Issues:** 1

- **Line 198:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\compliance\DisclaimerBanner.tsx
**Total Issues:** 2

- **Line 26:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 75:** Stock market platform terminology (low) - Review if terminology matches platform style


### components\content\ComparisonTable.tsx
**Total Issues:** 18

- **Line 29:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 29:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 31:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 31:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 32:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 40:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 40:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 42:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 42:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 52:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 67:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 67:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 68:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 73:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 76:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 76:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 93:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 95:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\content\ContentAttribution.tsx
**Total Issues:** 1

- **Line 185:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50


### components\content\review\ReviewVerdict.tsx
**Total Issues:** 4

- **Line 31:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 31:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 92:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 92:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800


### components\content\TableOfContents.tsx
**Total Issues:** 2

- **Line 57:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 71:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\content\templates\GlossaryPageTemplate.tsx
**Total Issues:** 14

- **Line 26:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 48:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 50:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 60:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 63:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 80:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 82:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 86:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 88:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 89:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 101:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 118:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 118:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 120:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\content\templates\PillarPageTemplate.tsx
**Total Issues:** 19

- **Line 26:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 43:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 69:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 74:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 84:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 86:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 96:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 108:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 111:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 113:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 126:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 128:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 169:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 172:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 174:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 192:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 202:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 202:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 204:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\credit-cards\CreditCardTable.tsx
**Total Issues:** 2

- **Line 41:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 153:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### components\credit-cards\FilterSidebar.tsx
**Total Issues:** 2

- **Line 141:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 141:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### components\editorial\DiffView.tsx
**Total Issues:** 20

- **Line 49:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 49:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 51:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 55:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 55:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 61:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 61:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 101:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 101:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 106:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 112:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 118:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 124:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 141:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 141:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 144:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 185:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 185:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 187:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 220:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\editorial\EditorialDraftCard.tsx
**Total Issues:** 6

- **Line 136:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 153:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 215:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 215:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 243:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 252:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\engagement\ContextualLeadMagnet.tsx
**Total Issues:** 6

- **Line 77:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 258:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 277:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 282:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 282:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 310:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\engagement\NewsletterWidget.tsx
**Total Issues:** 2

- **Line 92:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 109:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\experts\ExpertTeam.tsx
**Total Issues:** 1

- **Line 208:** Stock market platform terminology (low) - Review if terminology matches platform style


### components\gamification\BadgeDisplay.tsx
**Total Issues:** 1

- **Line 35:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50


### components\gamification\PointsWidget.tsx
**Total Issues:** 2

- **Line 25:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 41:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\home\AnimatedHero.tsx
**Total Issues:** 1

- **Line 34:** Stock market platform terminology (low) - Review if terminology matches platform style


### components\home\EditorialArticles.tsx
**Total Issues:** 5

- **Line 149:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 153:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 173:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 186:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 198:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800


### components\home\GoalBasedDiscovery.tsx
**Total Issues:** 5

- **Line 26:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 87:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 95:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 120:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 142:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### components\home\HeroSection.tsx
**Total Issues:** 1

- **Line 21:** Stock market platform terminology (low) - Review if terminology matches platform style


### components\home\HeroVisuals.tsx
**Total Issues:** 7

- **Line 34:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 35:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 46:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 49:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 61:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 62:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 62:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\home\HomeContextualProducts.tsx
**Total Issues:** 2

- **Line 80:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 125:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### components\home\HomeHero.tsx
**Total Issues:** 4

- **Line 76:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 76:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 98:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 99:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\home\LatestInsights.tsx
**Total Issues:** 3

- **Line 128:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 128:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 209:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\home\NewsletterSection.tsx
**Total Issues:** 2

- **Line 37:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 48:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\home\NewsSentiment.tsx
**Total Issues:** 5

- **Line 51:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 56:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 56:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 75:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 78:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800


### components\home\TerminalOverview.tsx
**Total Issues:** 9

- **Line 20:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 32:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 59:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 59:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 72:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 76:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 81:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 81:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 97:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\home\TopPicks.tsx
**Total Issues:** 4

- **Line 88:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 130:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 141:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 165:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800


### components\home\UserSegmentation.tsx
**Total Issues:** 2

- **Line 20:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 61:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\insurance\FilterSidebar.tsx
**Total Issues:** 2

- **Line 102:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 102:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### components\insurance\InsuranceTable.tsx
**Total Issues:** 1

- **Line 43:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### components\layout\Footer.tsx
**Total Issues:** 2

- **Line 157:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 160:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\layout\Navbar.tsx
**Total Issues:** 6

- **Line 486:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 493:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 557:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 557:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 564:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 571:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### components\legal\CookieConsent.tsx
**Total Issues:** 4

- **Line 32:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 33:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 45:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 46:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### components\loans\FilterSidebar.tsx
**Total Issues:** 2

- **Line 86:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 86:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### components\loans\LoansTable.tsx
**Total Issues:** 1

- **Line 35:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### components\market\MarketOverview.tsx
**Total Issues:** 4

- **Line 61:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 73:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 74:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 81:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### components\market\WatchlistSparklines.tsx
**Total Issues:** 4

- **Line 14:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 26:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 34:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 48:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### components\media\AIImageGenerator.tsx
**Total Issues:** 4

- **Line 18:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 73:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 74:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 156:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50


### components\media\BulkUploader.tsx
**Total Issues:** 5

- **Line 92:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 93:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 186:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 186:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 199:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\media\FeaturedImageSelector.tsx
**Total Issues:** 4

- **Line 113:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 115:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 116:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 138:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50


### components\media\MediaLibrary.tsx
**Total Issues:** 7

- **Line 109:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 111:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 113:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 322:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 322:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 351:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 352:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\media\StockPhotosBrowser.tsx
**Total Issues:** 4

- **Line 80:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 81:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 178:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 199:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50


### components\monetization\DisclosureBlock.tsx
**Total Issues:** 4

- **Line 52:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 65:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 65:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 72:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\monetization\LeadMagnet.tsx
**Total Issues:** 3

- **Line 78:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 78:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 83:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\monetization\LimitedAdSlot.tsx
**Total Issues:** 7

- **Line 130:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 132:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 132:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 134:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 134:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 136:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 140:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### components\monetization\PremiumGate.tsx
**Total Issues:** 3

- **Line 37:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 38:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 128:** Stock market platform terminology (low) - Review if terminology matches platform style


### components\monetization\SmartContextualOffers.tsx
**Total Issues:** 1

- **Line 72:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\mutual-funds\FundTable.tsx
**Total Issues:** 1

- **Line 33:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### components\news\ContextualNewsWidget.tsx
**Total Issues:** 2

- **Line 36:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 39:** Stock market platform terminology (low) - Review if terminology matches platform style


### components\onboarding\OnboardingFlow.tsx
**Total Issues:** 20

- **Line 47:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 109:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 126:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 126:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 144:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 145:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 147:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 170:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 170:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 170:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 173:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 192:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 192:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 192:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 195:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 215:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 215:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 215:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 218:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 221:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\pillar\PillarPageTemplate.tsx
**Total Issues:** 20

- **Line 36:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 56:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 59:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 76:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 92:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 95:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 115:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 131:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 133:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 158:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 175:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 191:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 193:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 206:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 232:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 245:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 262:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 262:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 264:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 276:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\pillar\SubcategoryPageTemplate.tsx
**Total Issues:** 20

- **Line 34:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 48:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 48:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 57:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 89:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 92:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 109:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 125:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 128:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 148:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 164:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 166:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 191:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 208:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 223:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 225:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 234:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 234:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 234:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 245:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### components\portfolio\AddHoldingDialog.tsx
**Total Issues:** 19

- **Line 59:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 59:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 66:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 68:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 83:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 83:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 83:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 89:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 95:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 95:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 95:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 102:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 102:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 124:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 124:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 124:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 139:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 139:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 139:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800


### components\portfolio\AssetAllocation.tsx
**Total Issues:** 2

- **Line 30:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 37:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\portfolio\HoldingsList.tsx
**Total Issues:** 8

- **Line 16:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 24:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 42:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 63:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 70:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 71:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 78:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 79:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\portfolio\PortfolioSummary.tsx
**Total Issues:** 2

- **Line 30:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 58:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\portfolio\RiskAnalysis.tsx
**Total Issues:** 4

- **Line 30:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 46:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 49:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 53:** Stock market platform terminology (low) - Review if terminology matches platform style


### components\preview\ArticlePreview.tsx
**Total Issues:** 5

- **Line 53:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 81:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 94:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 107:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 185:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### components\preview\DeviceSwitcher.tsx
**Total Issues:** 2

- **Line 29:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 30:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\preview\PreviewModal.tsx
**Total Issues:** 12

- **Line 60:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 66:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 66:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 68:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 76:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 76:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 77:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 86:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 86:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 87:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 102:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 140:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50


### components\preview\SEOPreview.tsx
**Total Issues:** 9

- **Line 31:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 31:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 104:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 104:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 114:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 116:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 129:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 129:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 140:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\products\BestForBadge.tsx
**Total Issues:** 4

- **Line 82:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 83:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 194:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 195:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### components\products\ComparisonPDFButton.tsx
**Total Issues:** 1

- **Line 36:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### components\products\ContextualProducts.tsx
**Total Issues:** 2

- **Line 50:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 60:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\products\DifferentiationCard.tsx
**Total Issues:** 2

- **Line 35:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 45:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\products\ProductCard.tsx
**Total Issues:** 6

- **Line 28:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 30:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 30:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 81:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 89:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 126:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800


### components\products\ProductCategoryTabs.tsx
**Total Issues:** 1

- **Line 39:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\products\RichProductCard.tsx
**Total Issues:** 15

- **Line 59:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 79:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 79:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 85:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 96:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 123:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 136:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 148:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 158:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 158:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 160:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 166:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 166:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 167:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 188:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50


### components\products\SuggestedComparisons.tsx
**Total Issues:** 2

- **Line 17:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 18:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\products\TopPicksSidebar.tsx
**Total Issues:** 5

- **Line 41:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 52:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 54:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 70:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 94:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\profile\EditProfileDialog.tsx
**Total Issues:** 15

- **Line 59:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 61:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 74:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 74:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 74:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 88:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 88:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 88:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 101:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 101:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 101:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 115:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 115:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 115:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 126:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\rates\RatesWidget.tsx
**Total Issues:** 1

- **Line 51:** Stock market platform terminology (low) - Review if terminology matches platform style


### components\search\CommandPalette.tsx
**Total Issues:** 7

- **Line 30:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 168:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 190:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 211:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 216:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 278:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 282:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\tools\SIPCalculator.tsx
**Total Issues:** 2

- **Line 38:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 102:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800


### components\trust\TrustScoreWidget.tsx
**Total Issues:** 5

- **Line 71:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 81:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 137:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 142:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 184:** Stock market platform terminology (low) - Review if terminology matches platform style


### components\trust\VerificationBadge.tsx
**Total Issues:** 4

- **Line 48:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 48:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 95:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 95:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800


### components\ui\accordion.tsx
**Total Issues:** 1

- **Line 149:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### components\ui\GaugeMeter.tsx
**Total Issues:** 4

- **Line 32:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 33:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 34:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 86:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### components\ui\ProductCard.tsx
**Total Issues:** 4

- **Line 54:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 85:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800
- **Line 90:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 99:** border-slate-100 without dark mode variant (medium) - Add dark:border-slate-800


### components\ui\sheet.tsx
**Total Issues:** 1

- **Line 77:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### components\ui\switch.tsx
**Total Issues:** 1

- **Line 44:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800


### components\ui\tabs.tsx
**Total Issues:** 2

- **Line 70:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 70:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### components\visualization\CreditScoreGauge.tsx
**Total Issues:** 4

- **Line 69:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 79:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 89:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 99:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### components\visuals\CalculatorVisual.tsx
**Total Issues:** 35

- **Line 72:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 73:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 88:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 113:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 114:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 115:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 118:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 119:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 126:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 128:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 151:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 152:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 153:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 156:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 157:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 162:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 185:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 186:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 187:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 190:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 191:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 196:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 214:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 215:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 216:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 219:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 220:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 228:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 230:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 249:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 250:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 251:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 254:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 255:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 259:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### components\visuals\CategoryHero.tsx
**Total Issues:** 31

- **Line 88:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 89:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 92:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 93:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 94:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 97:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 100:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 114:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 115:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 116:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 117:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 120:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 121:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 124:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 127:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 141:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 147:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 156:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 159:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 177:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 186:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 194:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 199:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 200:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 215:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 223:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 228:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 231:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 245:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 246:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 247:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### components\visuals\ExplainerDiagram.tsx
**Total Issues:** 24

- **Line 78:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 78:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 79:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 82:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 108:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 108:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 109:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 122:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 134:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 147:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 148:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 154:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 175:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 175:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 176:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 208:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 208:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 209:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 242:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 242:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800
- **Line 243:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100
- **Line 246:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 247:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 248:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### lib\agents\trend-agent.ts
**Total Issues:** 9

- **Line 47:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 50:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 123:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 183:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 189:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 197:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 199:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 206:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 279:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\ai\author-ai.ts
**Total Issues:** 1

- **Line 34:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\ai\constraints.ts
**Total Issues:** 1

- **Line 81:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\ai\content-pipeline.ts
**Total Issues:** 1

- **Line 102:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\ai\dynamic-prompt-builder.ts
**Total Issues:** 5

- **Line 143:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 146:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 148:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 150:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 153:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\ai\editor-ai.ts
**Total Issues:** 5

- **Line 31:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 35:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 237:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 279:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 282:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\ai\financialExpertPrompts.ts
**Total Issues:** 3

- **Line 83:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 184:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 232:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\ai\financialTemplates.ts
**Total Issues:** 2

- **Line 68:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 102:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\ai\image-generator.ts
**Total Issues:** 11

- **Line 33:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 34:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 35:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 36:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 93:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 96:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 109:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 119:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 120:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 121:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 142:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### lib\ai\operations.ts
**Total Issues:** 1

- **Line 177:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\ai-service.ts
**Total Issues:** 1

- **Line 262:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\alerts\alert-manager.ts
**Total Issues:** 7

- **Line 330:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 331:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 416:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 417:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 424:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 427:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 430:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### lib\alpha-vantage.ts
**Total Issues:** 1

- **Line 50:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\api.ts
**Total Issues:** 1

- **Line 364:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\automation\article-generator.ts
**Total Issues:** 1

- **Line 320:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\automation\content-orchestrator.ts
**Total Issues:** 1

- **Line 225:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\automation\content-repurpose.ts
**Total Issues:** 11

- **Line 279:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 294:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 295:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 300:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 301:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 304:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 305:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 311:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 316:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 318:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 320:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### lib\automation\email-sender.ts
**Total Issues:** 9

- **Line 156:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 157:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 162:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 163:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 165:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 168:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 173:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 175:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 177:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### lib\automation\image-pipeline.ts
**Total Issues:** 2

- **Line 276:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 283:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\automation\newsletter-generator.ts
**Total Issues:** 6

- **Line 111:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 116:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 117:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 118:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 131:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 133:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### lib\automation\product-generator.ts
**Total Issues:** 1

- **Line 41:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\automation\research-strategist.ts
**Total Issues:** 1

- **Line 30:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\automation\revenue-reports.ts
**Total Issues:** 12

- **Line 282:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 291:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 293:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 295:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 306:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 307:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 319:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 320:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 321:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 327:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 328:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 336:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### lib\automation\translator.ts
**Total Issues:** 2

- **Line 45:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 50:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\cache\cache-service.ts
**Total Issues:** 1

- **Line 30:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\cache\cache-strategies.ts
**Total Issues:** 2

- **Line 9:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 60:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\cache\redis-client.ts
**Total Issues:** 1

- **Line 49:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\content\content-schema.ts
**Total Issues:** 4

- **Line 360:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 386:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 390:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 404:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\content\link-manager.ts
**Total Issues:** 2

- **Line 20:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 20:** border-slate-200 without dark mode variant (medium) - Add dark:border-slate-700 or dark:border-slate-800


### lib\content\normalize.ts
**Total Issues:** 1

- **Line 258:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### lib\content\tone-manager.ts
**Total Issues:** 1

- **Line 247:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\data\glossary-terms.ts
**Total Issues:** 5

- **Line 7:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 16:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 42:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 43:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 50:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\data\ipo-service.ts
**Total Issues:** 1

- **Line 8:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\data.ts
**Total Issues:** 1

- **Line 234:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\downloads\additional-resources.ts
**Total Issues:** 3

- **Line 52:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 57:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 58:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\downloads\dashboard-templates.ts
**Total Issues:** 4

- **Line 9:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 30:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 33:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 35:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\downloads\file-generators.ts
**Total Issues:** 10

- **Line 61:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 64:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 65:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 69:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 78:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 83:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 87:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 92:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 95:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 158:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### lib\email\resend-service.ts
**Total Issues:** 6

- **Line 71:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 80:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 83:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 100:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 103:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 108:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### lib\email\sequences.ts
**Total Issues:** 16

- **Line 256:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 257:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 261:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 268:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 274:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 290:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 291:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 297:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 301:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 305:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 316:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 317:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 320:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 333:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 334:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 337:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### lib\hooks\useLiveRates.ts
**Total Issues:** 4

- **Line 34:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 41:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 42:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 46:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\images\ai-image-generator.ts
**Total Issues:** 2

- **Line 338:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 342:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\images\featured-image-generator.ts
**Total Issues:** 1

- **Line 219:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### lib\images\stock-image-service.ts
**Total Issues:** 2

- **Line 24:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 32:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\images\theme-image-editor.ts
**Total Issues:** 12

- **Line 94:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 96:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 98:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 261:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 270:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 285:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 294:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 307:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 316:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 329:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 337:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 342:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### lib\intelligence\orchestrators\data-sync-orchestrator.ts
**Total Issues:** 3

- **Line 2:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 48:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 77:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\keyword-research\KeywordResearchService.ts
**Total Issues:** 2

- **Line 98:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 173:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\locks\distributed-lock.ts
**Total Issues:** 1

- **Line 25:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\market\service.ts
**Total Issues:** 3

- **Line 2:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 4:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 22:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\media\content-aware-recommender.ts
**Total Issues:** 2

- **Line 301:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 302:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\navigation\categories.ts
**Total Issues:** 3

- **Line 70:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 73:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 77:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\navigation\config.ts
**Total Issues:** 1

- **Line 539:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\payments\stripe-service.ts
**Total Issues:** 1

- **Line 44:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\platform-linking\config.ts
**Total Issues:** 4

- **Line 59:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 60:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 82:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 83:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\platform-stats.ts
**Total Issues:** 1

- **Line 84:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\products\comparison-service.ts
**Total Issues:** 1

- **Line 27:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\products\feature-explanations.ts
**Total Issues:** 1

- **Line 118:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\prompts\category-prompts.ts
**Total Issues:** 18

- **Line 155:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 222:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 494:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 498:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 500:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 502:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 504:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 505:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 510:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 512:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 518:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 528:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 530:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 538:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 547:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 570:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 797:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 814:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\prompts\image-prompts.ts
**Total Issues:** 10

- **Line 52:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 136:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 149:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 150:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 152:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 153:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 156:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 158:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 183:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 465:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\prompts\infographic-prompts.ts
**Total Issues:** 13

- **Line 87:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 88:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 92:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 97:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 102:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 107:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 112:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 117:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 122:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 123:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 124:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 311:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 312:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### lib\prompts\newsletter-prompts.ts
**Total Issues:** 2

- **Line 235:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 330:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\prompts\social-media-prompts.ts
**Total Issues:** 2

- **Line 163:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 436:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\prompts\video-script-prompts.ts
**Total Issues:** 1

- **Line 364:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\research\serp-analyzer.ts
**Total Issues:** 5

- **Line 234:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 235:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 289:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 344:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 385:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\risk-calculator.ts
**Total Issues:** 2

- **Line 60:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 106:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\rss-import\RSSArticleGenerator.ts
**Total Issues:** 2

- **Line 64:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 128:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\search\service.ts
**Total Issues:** 1

- **Line 268:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\seo\advanced-seo-optimizer.ts
**Total Issues:** 2

- **Line 141:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 144:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\services\auto-linker.ts
**Total Issues:** 1

- **Line 174:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### lib\services\entities\ipo.service.ts
**Total Issues:** 3

- **Line 19:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 56:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 63:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\services\glossary-enrichment.ts
**Total Issues:** 2

- **Line 59:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 70:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\templates\content-templates.ts
**Total Issues:** 3

- **Line 185:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 299:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 445:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\templates\newsletter-templates.ts
**Total Issues:** 2

- **Line 83:** Stock market platform terminology (low) - Review if terminology matches platform style
- **Line 192:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\theme\brand-theme.ts
**Total Issues:** 109

- **Line 30:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 31:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 32:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 33:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 34:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 35:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 36:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 37:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 38:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 39:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 40:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 45:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 46:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 47:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 48:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 49:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 50:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 51:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 52:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 53:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 54:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 55:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 60:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 61:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 62:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 63:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 64:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 65:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 66:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 67:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 68:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 69:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 70:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 75:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 76:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 77:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 78:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 79:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 80:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 81:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 82:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 83:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 84:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 85:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 100:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 101:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 102:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 103:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 104:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 105:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 106:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 107:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 112:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 113:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 114:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 115:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 116:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 122:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 123:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 124:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 125:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 126:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 127:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 128:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 133:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 134:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 135:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 136:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 137:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 172:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 173:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 174:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 175:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 185:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 186:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 187:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 188:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 198:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 199:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 200:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 201:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 211:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 212:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 213:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 214:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 224:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 225:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 226:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 227:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 237:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 238:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 239:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 240:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 350:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 351:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 352:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 353:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 354:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 355:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 356:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 357:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 361:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 362:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 363:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 364:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 365:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 366:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 367:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 368:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### lib\trust\trust-utils.ts
**Total Issues:** 1

- **Line 86:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\utils\chart-colors.ts
**Total Issues:** 20

- **Line 17:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 18:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 19:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 21:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 22:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 23:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 25:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 26:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 27:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 30:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 31:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 32:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 34:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 35:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 36:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 38:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 42:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 47:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 48:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 49:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### lib\utils\theme-colors.ts
**Total Issues:** 16

- **Line 85:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 86:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 87:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 88:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 89:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 90:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 106:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 107:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 108:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 109:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 110:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 111:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 112:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 113:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 114:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 115:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### lib\validation\api-schemas.ts
**Total Issues:** 1

- **Line 168:** Stock market platform terminology (low) - Review if terminology matches platform style


### lib\visuals\generator.ts
**Total Issues:** 21

- **Line 43:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 44:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 45:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 46:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 47:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 48:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 82:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 85:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 99:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 100:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 101:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 114:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 115:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 116:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 132:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 133:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 134:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 135:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 136:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 137:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 140:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### lib\visuals\types.ts
**Total Issues:** 5

- **Line 63:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 64:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 65:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 66:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 67:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)


### lib\workers\articleGenerator.ts
**Total Issues:** 4

- **Line 87:** Hardcoded hex color (should use theme colors) (medium) - Replace with theme color (e.g., primary-500, slate-900)
- **Line 300:** bg-slate-50 without dark mode variant (high) - Add dark:bg-slate-900/50 or dark:bg-slate-800/50
- **Line 311:** bg-white without dark mode variant (high) - Add dark:bg-slate-900 or dark:bg-slate-800
- **Line 313:** text-slate-900 without dark mode variant (high) - Add dark:text-white or dark:text-slate-100


### lib\yahoo-finance.ts
**Total Issues:** 1

- **Line 3:** Stock market platform terminology (low) - Review if terminology matches platform style


---

## 🎯 Recommendations

1. **Fix Critical Issues First** - These break dark mode completely
2. **Fix High Priority** - These affect user experience significantly
3. **Systematic Fix** - Fix by file to maintain consistency
4. **Test After Each Fix** - Verify dark mode works correctly

---

**Next Steps:** Review this report and fix issues systematically.
