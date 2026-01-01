# 💰 MONETIZATION & TRACKING AUDIT

## 1. 🚨 CRITICAL FINDINGS: ZERO CONVERSION DATA
**Severity: CRITICAL**
Your application has **NO Event Tracking**. 
- The `trackEvent` function exists but is **never called**.
- When a user clicks "Apply Now" on a Credit Card, **you do not know**.
- You cannot optimize what you cannot measure.

## 2. 🔗 CTA & LINK ANALYSIS

### **A. Primary CTA (`CTAButton.tsx`)**
- **Status**: ❌ **Untracked**
- **Issue**: It is a simple `next/link` wrapper.
- **Risk**: Internal navigation is fine, but for Affiliate Links, it fails to add query params, click IDs, or track the event.

### **B. Hardcoded CTAs (`CreditCardDetailPage`)**
- **Status**: ❌ **Hazardous**
- **Issue**: Uses raw `<a href="...">` tags.
- **Risk**: 
    - No `rel="sponsored"` or `rel="nofollow"` (Google SEO Penalty Risk).
    - No `onClick` handler to fire analytics.
    - No masking (User sees `affiliate-network.com` instead of `investingpro.in/go/...`).

## 3. 📉 MISSING INFRASTRUCTURE

### 1. **Click Tracking Layer**
You need a `useTrackClick` hook or a `TrackedLink` component that:
1.  Fires `gtag('event', 'click_affiliate', { ... })`.
2.  *Then* redirects the user.

### 2. **Affiliate Link Masking**
Currently, links represent raw URLs. You need a redirection system:
- User sees: `/go/hdfc-regalia`
- Server redirects to: `bank.com/apply?aff_id=123`
- Server logs: "Click from IP X on Page Y".

### 3. **Google Analytics Setup**
- `Analytics.tsx` has `GA_MEASUREMENT_ID` hardcoded as a placeholder string. 
- **Action**: Replace with `process.env.NEXT_PUBLIC_GA_ID`.

---

## 4. 🛠️ ACTION PLAN

1.  **Create `TrackedLink` Component**:
    - Wraps `<a>` tag.
    - Handles `onClick` to fire GA event.
    - Adds `rel="nofollow sponsored"` automatically.

2.  **Update `CreditCardDetailPage`**:
    - Replace raw `<a>` with `<TrackedLink>`.

3.  **Activate Analytics**:
    - Add `NEXT_PUBLIC_GA_ID` to `.env`.
    - Ensure `Analytics` component is mounted in `layout.tsx`.

**Current Readiness for Money: 0/10**
You cannot launch a monetization platform without tracking clicks.
