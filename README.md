# InvestingPro - Financial Comparison Platform

This is a Next.js application designed to replicate the functionality of NerdWallet for the Indian market. It features a premium design, financial calculators, and a structure for comparing financial products.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase
- **CMS:** Custom Integrated CMS (Ghost Team Command Center)

## Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```

3.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/`: Contains the application routes and pages.
    - `(marketing)/`: Landing pages.
    - `calculators/`: Financial calculators (SIP, EMI, etc.).
    - `mutual-funds/`, `credit-cards/`, etc.: Product comparison pages.
- `components/`: Reusable UI components.
    - `ui/`: Basic UI elements (Buttons, Cards).
    - `layout/`: Navbar, Footer.
    - `calculators/`: Logic and UI for calculators.
- `lib/`: Utility functions and CMS integration.
    - `cms.ts`: Functions to fetch data from your WordPress backend.
- `types/`: TypeScript definitions for financial products.

## 🔑 Custom Integrated CMS & Ghost Team

This project features a proprietary, integrated CMS built directly into the Next.js application, designed for high-velocity financial content.

1.  **Access the Admin Panel:**
    - Navigate to `/admin`.
    - Log in using your designated admin email (restricted by RBAC).

2.  **AI Engine (Ghost Team):**
    - The CMS manages the "Ghost Team" pipeline (`lib/automation`).
    - Generate articles, moderate AI drafts, and manage product data directly from the dashboard.

3.  **Content Repository:**
    - All content is stored in **Supabase**.
    - The `articles` table is the source of truth for the blog and product guides.

## Next Steps

1.  **Add More Calculators:** Implement Income Tax, Home Loan EMI, etc., in `components/calculators/`.
2.  **Build Product Pages:** Create the comparison tables for Credit Cards and Mutual Funds using the types defined in `types/index.ts`.
3.  **Integrate CMS:** Connect to your WordPress site to fetch blog posts and guides.
