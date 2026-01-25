# InvestingPro Vision 2026 Audit: The "Trust Gap"

## 🧐 The Verdict
I have audited the current platform execution against the `platform_pages_audit.md` "Gold Standard".
**Status:** We are functionally Strong (Logic, Tools), but Visually "Bootstrap".

### 1. The Homepage Hero Gap
*   **Standard:** Wants a "NerdWallet" style concise value prop + split actionable cards ("I want to...").
*   **Reality:** We have a generic `HeroSection` (likely) or a scattered "Smart Advisor".
*   **Action:** Build **Hero 2.0** -> A split-screen "Decision Engine" (Left: Value Prop, Right: interactive "I want to" selector).

### 2. The "Ghost Town" Problem (Trust Signals)
*   **Standard:** Specific testimonials ("Rajesh saved ₹12k"), Media Logos, "50,000+ Users".
*   **Reality:** Managing this statically is hard.
*   **Action:** Create a `TrustBar` component using the new `GaugeMeter` style for visual stats (e.g. "₹50Cr+ Value Tracked").

### 3. Category Page "Wall of Text"
*   **Standard:** "Editor's Top Picks" distinct from the full list.
*   **Reality:** We just dump the `CreditCardTable`.
*   **Action:** Inject a **"Winners Podium"** section above the table on `/credit-cards`.
    *   #1 Cashback Card
    *   #1 Travel Card
    *   #1 Lifetime Free

---

## 🛠️ Revised Execution Plan (The "Polish" Phase)

Before I build the "backend pipes" (IPOs/Brokers), I should **fix the front door**.

### Priority 1: Homepage Trust Injection
1.  **Refactor Hero:** Move from generic text to "Action Cards".
2.  **Add TrustBar:** Logos + Stats below Hero.

### Priority 2: Category "guidance"
1.  **Winners Podium:** Add `TopPicksRow` component above `CreditCardTable`.
2.  **Quick Filters:** "Find Best For..." visible chips.

### Priority 3: The Backend (as planned)
1.  **IPOs/Brokers Migration:** Move to Supabase (Backend work can happen in parallel or after visual fix).
