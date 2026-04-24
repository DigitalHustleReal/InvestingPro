// Literal override — defeats app/credit-cards/[slug] conflict at this depth.
import type { Metadata } from "next";
import CategoryCalculatorsHub, {
  buildCategoryCalculatorsMetadata,
} from "@/components/routing/CategoryCalculatorsHub";

export const revalidate = 86400;

export function generateMetadata(): Metadata {
  return buildCategoryCalculatorsMetadata("credit-cards");
}

export default function CreditCardsCalculatorsHubPage() {
  return <CategoryCalculatorsHub urlCategory="credit-cards" />;
}
