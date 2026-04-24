/**
 * Literal override for /loans/calculators/ — see sibling learn/ page.tsx.
 */

import { Metadata } from "next";
import CategoryCalculatorsHub, {
  buildCategoryCalculatorsMetadata,
} from "@/components/routing/CategoryCalculatorsHub";

export const revalidate = 86400;

export const metadata: Metadata = buildCategoryCalculatorsMetadata("loans");

export default function LoansCalculatorsHubPage() {
  return <CategoryCalculatorsHub urlCategory="loans" />;
}
