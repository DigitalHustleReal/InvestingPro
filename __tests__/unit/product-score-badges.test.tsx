import React from "react";
import { render, screen } from "@testing-library/react";
import ProductScoreBadges, {
  calculateProductTags,
} from "@/components/products/ProductScoreBadges";

// ─── calculateProductTags ────────────────────────────────────────────────────

describe("calculateProductTags", () => {
  // --- Credit Card Tags ---

  it('returns "Best for Travel" when loungeAccess is present and not nil', () => {
    const product = { loungeAccess: "Domestic + International" };
    const tags = calculateProductTags(product, "credit_card");
    expect(tags).toContain("Best for Travel");
  });

  it('does NOT return "Best for Travel" when loungeAccess is "nil"', () => {
    const product = { loungeAccess: "Nil" };
    const tags = calculateProductTags(product, "credit_card");
    expect(tags).not.toContain("Best for Travel");
  });

  it('returns "Top for Shopping" when type includes shopping', () => {
    const product = { type: "Shopping Rewards" };
    const tags = calculateProductTags(product, "credit_card");
    expect(tags).toContain("Top for Shopping");
  });

  it('returns "Top for Shopping" when rewards array includes shopping keyword', () => {
    const product = { rewards: ["2x on Shopping", "1x on Travel"] };
    const tags = calculateProductTags(product, "credit_card");
    expect(tags).toContain("Top for Shopping");
  });

  it('returns "Lifetime Free" when annualFee is 0', () => {
    const product = { annualFee: 0 };
    const tags = calculateProductTags(product, "credit_card");
    expect(tags).toContain("Lifetime Free");
  });

  it('returns "Lifetime Free" when annual_fee string contains "free"', () => {
    const product = { annual_fee: "Free forever" };
    const tags = calculateProductTags(product, "credit_card");
    expect(tags).toContain("Lifetime Free");
  });

  it('returns "Low Cost Gem" when annualFee < 500', () => {
    const product = { annualFee: 299 };
    const tags = calculateProductTags(product, "credit_card");
    expect(tags).toContain("Low Cost Gem");
  });

  it('does NOT return "Low Cost Gem" when annualFee >= 500', () => {
    const product = { annualFee: 500 };
    const tags = calculateProductTags(product, "credit_card");
    expect(tags).not.toContain("Low Cost Gem");
  });

  // --- Loan Tags ---

  it('returns "Low Interest Rate" when interestRateMin < 10', () => {
    const product = { interestRateMin: 7.5 };
    const tags = calculateProductTags(product, "loan");
    expect(tags).toContain("Low Interest Rate");
  });

  it('returns "Minimal Fees" when processingFee includes "0"', () => {
    const product = { processingFee: "0%" };
    const tags = calculateProductTags(product, "loan");
    expect(tags).toContain("Minimal Fees");
  });

  it('returns "Minimal Fees" when processing_fee is "nil"', () => {
    const product = { processing_fee: "Nil processing fee" };
    const tags = calculateProductTags(product, "loan");
    expect(tags).toContain("Minimal Fees");
  });

  it('returns "Flexible Tenure" when maxTenureMonths >= 84', () => {
    const product = { maxTenureMonths: 120 };
    const tags = calculateProductTags(product, "loan");
    expect(tags).toContain("Flexible Tenure");
  });

  it('does NOT return "Flexible Tenure" when maxTenureMonths < 84', () => {
    const product = { maxTenureMonths: 60 };
    const tags = calculateProductTags(product, "loan");
    expect(tags).not.toContain("Flexible Tenure");
  });

  it('returns "Home Buyer Choice" when loanType is "home"', () => {
    const product = { loanType: "home" };
    const tags = calculateProductTags(product, "loan");
    expect(tags).toContain("Home Buyer Choice");
  });

  it('returns "Home Buyer Choice" when type includes "home"', () => {
    const product = { type: "Home Loan" };
    const tags = calculateProductTags(product, "loan");
    expect(tags).toContain("Home Buyer Choice");
  });

  // --- Mutual Fund Tags ---

  it('returns "High Returns" when returns_3y >= 15', () => {
    const product = { returns_3y: 18.5 };
    const tags = calculateProductTags(product, "mutual_fund");
    expect(tags).toContain("High Returns");
  });

  it('does NOT return "High Returns" when returns_3y < 15', () => {
    const product = { returns_3y: 12 };
    const tags = calculateProductTags(product, "mutual_fund");
    expect(tags).not.toContain("High Returns");
  });

  it('returns "Low Expense" when expense_ratio < 1', () => {
    const product = { expense_ratio: 0.35 };
    const tags = calculateProductTags(product, "mutual_fund");
    expect(tags).toContain("Low Expense");
  });

  it('returns "Top Rated" when rating >= 4.5', () => {
    const product = { rating: 5 };
    const tags = calculateProductTags(product, "mutual_fund");
    expect(tags).toContain("Top Rated");
  });

  it('does NOT return "Top Rated" when rating < 4.5', () => {
    const product = { rating: 4 };
    const tags = calculateProductTags(product, "mutual_fund");
    expect(tags).not.toContain("Top Rated");
  });

  it('returns "Safe Bet" when risk includes "low"', () => {
    const product = { risk: "Low Risk" };
    const tags = calculateProductTags(product, "mutual_fund");
    expect(tags).toContain("Safe Bet");
  });

  it("uses riskLevel as fallback for risk field", () => {
    const product = { riskLevel: "Low" };
    const tags = calculateProductTags(product, "mutual_fund");
    expect(tags).toContain("Safe Bet");
  });

  // --- Edge Cases ---

  it("returns empty array for empty product object", () => {
    const tags = calculateProductTags({}, "credit_card");
    expect(tags).toEqual([]);
  });

  it("returns empty array for unknown category", () => {
    const product = { annualFee: 0, returns_3y: 20, interestRateMin: 5 };
    const tags = calculateProductTags(product, "unknown_category");
    expect(tags).toEqual([]);
  });

  it("limits tags to max 3 even when product qualifies for more", () => {
    const product = {
      loungeAccess: "Domestic",
      type: "Shopping Rewards",
      annualFee: 0,
      annual_fee: "Free",
    };
    const tags = calculateProductTags(product, "credit_card");
    expect(tags.length).toBeLessThanOrEqual(3);
  });

  it("handles missing optional fields without errors", () => {
    // No rewards array, no type, no loungeAccess
    const product = { annualFee: 1000 };
    expect(() => calculateProductTags(product, "credit_card")).not.toThrow();
  });

  it("uses returns3Y as fallback for returns_3y", () => {
    const product = { returns3Y: 20 };
    const tags = calculateProductTags(product, "mutual_fund");
    expect(tags).toContain("High Returns");
  });

  it("uses expenseRatio as fallback for expense_ratio", () => {
    const product = { expenseRatio: 0.5 };
    const tags = calculateProductTags(product, "mutual_fund");
    expect(tags).toContain("Low Expense");
  });

  it("parses interest_rate string when interestRateMin is missing", () => {
    const product = { interest_rate: "8.5" };
    const tags = calculateProductTags(product, "loan");
    expect(tags).toContain("Low Interest Rate");
  });

  it("defaults interest rate to 15 when both fields missing (no Low Interest Rate tag)", () => {
    const product = {};
    const tags = calculateProductTags(product, "loan");
    expect(tags).not.toContain("Low Interest Rate");
  });
});

// ─── ProductScoreBadges Component ────────────────────────────────────────────

describe("ProductScoreBadges", () => {
  it("renders correct number of badges respecting maxBadges", () => {
    const { container } = render(
      <ProductScoreBadges
        category="credit_card"
        tags={[
          "Best for Travel",
          "Top for Shopping",
          "Lifetime Free",
          "Low Cost Gem",
        ]}
        maxBadges={2}
      />,
    );
    // 2 tag badges, no score badge
    const badges = container.querySelectorAll('[class*="font-semibold"]');
    expect(badges).toHaveLength(2);
  });

  it("defaults maxBadges to 3", () => {
    const { container } = render(
      <ProductScoreBadges
        category="credit_card"
        tags={[
          "Best for Travel",
          "Top for Shopping",
          "Lifetime Free",
          "Low Cost Gem",
        ]}
      />,
    );
    const badges = container.querySelectorAll('[class*="font-semibold"]');
    expect(badges).toHaveLength(3);
  });

  it("shows score badge when showScore=true and score is provided", () => {
    render(
      <ProductScoreBadges
        category="credit_card"
        tags={[]}
        score={8.5}
        showScore={true}
      />,
    );
    expect(screen.getByText("8.5/10")).toBeInTheDocument();
  });

  it("does NOT show score badge when showScore is false", () => {
    render(
      <ProductScoreBadges
        category="credit_card"
        tags={["Best for Travel"]}
        score={8.5}
        showScore={false}
      />,
    );
    expect(screen.queryByText("8.5/10")).not.toBeInTheDocument();
  });

  it("applies green classes for score >= 8", () => {
    const { container } = render(
      <ProductScoreBadges
        category="credit_card"
        tags={[]}
        score={9.0}
        showScore={true}
      />,
    );
    const scoreBadge = container.querySelector('[class*="font-bold"]');
    expect(scoreBadge?.className).toContain("bg-green-50");
    expect(scoreBadge?.className).toContain("text-green-700");
  });

  it("applies amber classes for score >= 6 and < 8", () => {
    const { container } = render(
      <ProductScoreBadges
        category="credit_card"
        tags={[]}
        score={6.5}
        showScore={true}
      />,
    );
    const scoreBadge = container.querySelector('[class*="font-bold"]');
    expect(scoreBadge?.className).toContain("bg-amber-50");
    expect(scoreBadge?.className).toContain("text-amber-700");
  });

  it("applies gray classes for score < 6", () => {
    const { container } = render(
      <ProductScoreBadges
        category="credit_card"
        tags={[]}
        score={4.2}
        showScore={true}
      />,
    );
    const scoreBadge = container.querySelector('[class*="font-bold"]');
    expect(scoreBadge?.className).toContain("bg-gray-50");
    expect(scoreBadge?.className).toContain("text-gray-700");
  });

  it("returns null when no tags and showScore is false", () => {
    const { container } = render(
      <ProductScoreBadges category="credit_card" tags={[]} showScore={false} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders tag text content correctly", () => {
    render(
      <ProductScoreBadges
        category="mutual_fund"
        tags={["High Returns", "Low Expense"]}
      />,
    );
    expect(screen.getByText("High Returns")).toBeInTheDocument();
    expect(screen.getByText("Low Expense")).toBeInTheDocument();
  });

  it("uses fallback styling for unknown tags", () => {
    const { container } = render(
      <ProductScoreBadges
        category="credit_card"
        tags={["Custom Unknown Tag"]}
      />,
    );
    const badge = container.querySelector('[class*="font-semibold"]');
    expect(badge?.className).toContain("bg-gray-50");
    expect(badge?.className).toContain("text-gray-700");
  });

  it("applies custom className to wrapper", () => {
    const { container } = render(
      <ProductScoreBadges
        category="credit_card"
        tags={["Best for Travel"]}
        className="my-custom-class"
      />,
    );
    expect(container.firstChild).toHaveClass("my-custom-class");
  });

  it("does not show score badge when score is undefined even if showScore is true", () => {
    const { container } = render(
      <ProductScoreBadges
        category="credit_card"
        tags={["Best for Travel"]}
        showScore={true}
      />,
    );
    const scoreBadge = container.querySelector('[class*="font-bold"]');
    // Only the tag badge (font-semibold) should exist, not a score badge (font-bold)
    expect(scoreBadge).toBeNull();
  });
});
