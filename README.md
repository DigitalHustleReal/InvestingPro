# InvestingPro - Financial Comparison Platform

This is a Next.js application designed to replicate the functionality of NerdWallet for the Indian market. It features a premium design, financial calculators, and a structure for comparing financial products.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **CMS:** WordPress (Headless) - *Ready to connect*

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

## Connecting WordPress (Headless CMS)

To use your Hostinger WordPress site as a headless CMS:

1.  **Install WPGraphQL Plugin:**
    - Log in to your WordPress Admin.
    - Install and activate the "WPGraphQL" plugin.
    - This exposes a GraphQL API at `https://your-domain.com/graphql`.

2.  **Configure Environment Variables:**
    - Create a `.env.local` file in the root of this project.
    - Add your WordPress API URL:
      ```
      NEXT_PUBLIC_WORDPRESS_API_URL=https://investingpro.in/graphql
      ```

3.  **Fetch Data:**
    - Update `lib/cms.ts` to use `graphql-request` or `fetch` to query your WordPress data.

## Next Steps

1.  **Add More Calculators:** Implement Income Tax, Home Loan EMI, etc., in `components/calculators/`.
2.  **Build Product Pages:** Create the comparison tables for Credit Cards and Mutual Funds using the types defined in `types/index.ts`.
3.  **Integrate CMS:** Connect to your WordPress site to fetch blog posts and guides.
