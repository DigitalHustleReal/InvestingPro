// Literal override — defeats app/credit-cards/[slug] conflict at this depth.
import type { Metadata } from "next";
import CategoryLearnHub, {
  buildCategoryLearnMetadata,
} from "@/components/routing/CategoryLearnHub";

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  return buildCategoryLearnMetadata("credit-cards");
}

export default function CreditCardsLearnHubPage() {
  return <CategoryLearnHub urlCategory="credit-cards" />;
}
