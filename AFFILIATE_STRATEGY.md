# 💸 Automation Strategy for Affiliate Products

Since manual management of 1000s of products is impossible, use these two strategies combined:

## Strategy 1: The "Comparison Engine" (High Value)
For your **Compare Section** (Credit Cards, Brokers), you need rich data (Images, Fees, Pros/Cons).

1.  **Join an Affiliate Network**: 
    *   **Impact.com**: Best for big brands (Axis, HDFC, Hostinger).
    *   **vCommission**: Good for Indian financial offers.
2.  **Download "Product Feed"**:
    *   These networks allow you to download a CSV/XML file of all their active campaigns.
3.  **Convert & Import**:
    *   Convert that CSV to JSON (using any online tool).
    *   Match the fields to our structure (`name`, `affiliate_link`, `image_url`).
    *   Run: `npx tsx scripts/bulk-import-products.ts`.
    
    *Result: Instant database of 1000s of high-quality products.*

---

## Strategy 2: The "Auto-Linker" (Volume)
For your **Blog Articles**, you don't need rich data, you just need links to monetize keywords.

1.  **Sign up for Cuelinks or Skimlinks**.
    *   These are "Aggregators". You sign up once, and they give you access to 1000+ merchants.
2.  **Install the Javascript Code**:
    *   They provide a simple `<script>` tag.
    *   Add this to your `app/layout.tsx`.
3.  **Result**:
    *   If you write: "You should open a **Zerodha** account."
    *   The script automatically turns "Zerodha" into an affiliate link.
    *   If the user clicks, you get paid.
    *   **Zero manual work**.

## 🛠 Product Data Structure (For Import)
To use the bulk importer, your `products.json` should look like this:

```json
[
  {
    "name": "HDFC Regalia",
    "slug": "hdfc-regalia-gold",
    "category": "credit_card",
    "provider_name": "HDFC Bank",
    "image_url": "https://example.com/card.png",
    "affiliate_link": "https://tracking.link/...",
    "features": {
       "annual_fee": "2500"
    }
  }
]
```
