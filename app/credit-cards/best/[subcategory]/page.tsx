/**
 * Credit Cards "Best of" — re-exports from shared [category]/best/[subcategory] template.
 * Next.js static routes (app/credit-cards/) take precedence over dynamic [category],
 * so we need this file for /credit-cards/best/{subcategory} URLs to work.
 */
export {
  default,
  generateMetadata,
  generateStaticParams,
} from "@/app/[category]/best/[subcategory]/page";
export const revalidate = 86400; // Daily ISR — must be declared directly, not re-exported
