# 📦 ATTRIBUTE & DATA MODEL AUDIT

## 1. 🏗️ DATA MODEL STRATEGY
**Status: HYBRID (Risk of Duplication)**

| Data Type | Strategy | Table Name | Observations |
| :--- | :--- | :--- | :--- |
| **Specifications** | **Separate Tables** | `mutual_funds`, `credit_cards` | Good for strong typing (`expense_ratio` vs `annual_fee`). |
| **Monetization** | **Unified Table** | `affiliate_products` | Good for calculating global revenue. |
| **Content** | **Unified Table** | `articles` | Linking is currently brittle. |

## 2. ⚠️ DATA DUPLICATION RISK
- **Issue**: `credit_cards.apply_link` vs `affiliate_products.affiliate_link`.
- **Scenario**: You update your HDFC affiliate ID in the Affiliate Dashboard (`affiliate_products`). The Credit Card Comparison Page (`credit_cards`) continues to use the old, dead link.
- **Fix**: **Single Source of Truth**. The Comparison Page should fetch the link from `affiliate_products` via a JOIN or Foreign Key.

## 3. 🧩 ATTRIBUTE NORMALIZATION
- **Units**: `aum` is TEXT ("₹5,000 Cr").
    - **Issue**: You cannot sort by AUM logically (String sort: "100" < "50").
    - **Fix**: Store as `BIGINT` (Raw count). Format on Frontend.
- **Fees**: `annual_fee` is TEXT. same sorting issue.

## 4. 🛠️ ACTION PLAN
1.  **Refactor Links**: Remove `apply_link` from `credit_cards`. Add `affiliate_product_id` UUID FK.
2.  **Fix Types**: Change `aum`, `min_investment` to Numeric types for proper sorting.
3.  **Cross-Reference**: Ensure every Product in a Comparison Table maps to a row in `affiliate_products`.
