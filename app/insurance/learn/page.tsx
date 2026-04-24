/**
 * Literal override for /insurance/learn/ — exists because
 * app/insurance/[slug]/page.tsx would otherwise swallow this path.
 */

import { Metadata } from "next";
import CategoryLearnHub, {
  buildCategoryLearnMetadata,
} from "@/components/routing/CategoryLearnHub";

export const revalidate = 3600;

export const metadata: Metadata = buildCategoryLearnMetadata("insurance");

export default function InsuranceLearnHubPage() {
  return <CategoryLearnHub urlCategory="insurance" />;
}
