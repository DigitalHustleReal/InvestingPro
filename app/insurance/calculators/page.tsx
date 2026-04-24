/**
 * Literal override for /insurance/calculators/ — see sibling learn/ page.tsx.
 */

import { Metadata } from "next";
import CategoryCalculatorsHub, {
  buildCategoryCalculatorsMetadata,
} from "@/components/routing/CategoryCalculatorsHub";

export const revalidate = 86400;

export const metadata: Metadata = buildCategoryCalculatorsMetadata("insurance");

export default function InsuranceCalculatorsHubPage() {
  return <CategoryCalculatorsHub urlCategory="insurance" />;
}
