# ⚖️ COMPARISON SYSTEM AUDIT

## 1. 🏗️ ARCHITECTURE
**Type: URL-Driven (Stateless)**
- Pattern: `/compare?type=mutual-funds&ids=1,2,3`
- **Pros**: SEO-friendly, easy to share.
- **Cons**: Requires URL manipulation logic in the frontend.

## 2. 🚨 CRITICAL DISCONNECT
**The Feature is "Orphaned"**
- `app/compare/page.tsx` exists and renders correctly.
- `app/mutual-funds/page.tsx` **has no buttons** to Add to Compare.
- **Impact**: No user can actually use this feature.

## 3. 📉 MISSING COMPONENTS
1.  **Comparison Context/Store**: A global state (Zustand/Context) to hold "Selected Items" while the user browses.
2.  **Floating Dock**: A UI component fixed to the bottom showing: "2 Items Selected [Compare Now]".
3.  **"Add to Compare" Checkbox**: Missing from product cards.

## 4. 🧩 CATEGORY SUPPORT
| Category | Status | Logic |
| :--- | :--- | :--- |
| **Mutual Funds** | ✅ Partial | Logic exists in `compare/page.tsx` but is hardcoded. |
| **Credit Cards** | ❌ Missing | No rendering logic for card features (Annual Fee, Rewards). |
| **Loans** | ❌ Missing | No logic for interest rates/tenure. |

## 5. 🛠️ ACTION PLAN
1.  **Create Store**: `lib/store/comparisonStore.ts`.
2.  **Create UI**: `components/compare/ComparisonFloatingDock.tsx`.
3.  **Integrate**: Add "Add to Compare" button to `FundCard` and `CreditCard`.
4.  **Refactor**: Make `compare/page.tsx` dynamic to handle `type=credit-cards` using a registry map.
