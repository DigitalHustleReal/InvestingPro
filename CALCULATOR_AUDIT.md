# 🧮 CALCULATOR AUDIT

## 1. 🏗️ INVENTORY
| Calculator | Status | Logic Check |
| :--- | :--- | :--- |
| **SIP** | ✅ Live | Correct Annuity Due formula. |
| **EMI** | ❓ Pending | Needs audit. |
| **Tax** | ⚠️ High Risk | Logic must be updated for Budget 2025 (New Regime vs Old Regime). |
| **NPS/PPF** | ❓ Pending | Check lock-in logic. |

## 2. 🧮 FORMULA VERIFICATION (SIP)
- **Formula**: `FV = P * [((1 + i)^n - 1) / i] * (1 + i)`
- **Verdict**: ✅ CORRECT. It uses "Investment at Beginning of Period" (Annuity Due), which is standard for SIPs.
- **Inflation**: ✅ CORRECT. Uses standard discounting: `Real = Nominal / (1 + inf)^years`.

## 3. ⚠️ LIMITATIONS & RISKS
1.  **Arbitrary Caps**: The SIP calculator caps input at **₹1,00,000**.
    - **Issue**: Many professionals invest ₹2L+. This artificially limits the tool's utility.
    - **Fix**: Increase max limit to ₹10L or ₹1Cr.
2.  **Tax Ignorance**: The calculator disclaimer says "Does not account for taxes".
    - **Opportunity**: Add a "Post-Tax Return" toggle (12.5% LTCG) to be more realistic.

## 4. 🛠️ ACTION PLAN
1.  **Unlock Limits**: Raise SIP slider max to ₹10,00,000.
2.  **Tax Toggle**: Add `[ ] Deduct LTCG Tax (12.5%)` checkbox to show "Take Home" money.
3.  **Audit Tax Calc**: Manually verify `app/calculators/tax` against latest Finance Bill.
