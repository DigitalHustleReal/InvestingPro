/**
 * Literal override for /loans/learn/ — exists because
 * app/loans/[slug]/page.tsx would otherwise swallow this path.
 */

import { Metadata } from "next";
import CategoryLearnHub, {
  buildCategoryLearnMetadata,
} from "@/components/routing/CategoryLearnHub";

export const revalidate = 3600;

export const metadata: Metadata = buildCategoryLearnMetadata("loans");

export default function LoansLearnHubPage() {
  return <CategoryLearnHub urlCategory="loans" />;
}
