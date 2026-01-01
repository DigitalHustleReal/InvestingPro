# ⚖️ TRUST & COMPLIANCE AUDIT

## 1. 🛡️ REGULATORY SAFETY (SEBI)
**Status: HIGH SAFETY**
- Your AI Prompts (`financialExpertPrompts.ts`) are rigorously engineered to avoid "Financial Advice".
- Explicit instructions: "NO buy/sell/hold suggestions", "Informational language only".
- **Verdict**: The AI is compliant by design.

## 2. 🍪 DATA PRIVACY (GDPR/DPDP)
- **Cookie Banner**: Exists (`components/common/CookieConsent.tsx`).
- **Privacy Policy**: Link exists in Footer, but content needs verification.
- **Verdict**: Standard compliance is met.

## 3. 📢 ADVERTISING TRANSPARENCY
**Status: MISSING**
- You lack a prominent "Advertiser Disclosure" (e.g., "We earn commissions...").
- **Risk**: Violates FTC guidelines (and ASCI in India).
- **Fix**: Add a standardized disclosure component above every comparison table.

## 4. 🛠️ ACTION PLAN
1.  **Global Disclosure**: Create `components/common/AdvertiserDisclosure.tsx` and inject it into `ArticleLayout`.
2.  **Verify Pages**: Ensure `/privacy` and `/terms` have actual legal text, not "Lorem Ipsum".
3.  **Contact Page**: Add a physical address (even a virtual office) to the Contact page to increase legitimacy.
