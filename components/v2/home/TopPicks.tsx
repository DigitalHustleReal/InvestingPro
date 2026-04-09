import Link from "next/link";
import { Star, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/static";
import { logger } from "@/lib/logger";

interface TopPickCard {
  pick?: boolean;
  logo: string;
  logoGradient: string;
  name: string;
  bank: string;
  score: number;
  scoreColor: string;
  highlight: string;
  highlightSub: string;
  tags: { label: string; color: string; check?: boolean }[];
  fee: string;
  href: string;
}

const LOGO_GRADIENTS: Record<string, string> = {
  SBI: "from-[#1B2A4A] to-[#2C3E5A]",
  ICICI: "from-[#92400E] to-[#B45309]",
  HDFC: "from-[#B45309] to-[#78350F]",
  Axis: "from-[#6B21A8] to-[#7C3AED]",
  Kotak: "from-[#DC2626] to-[#B91C1C]",
  HSBC: "from-[#DC2626] to-[#991B1B]",
  RBL: "from-[#1D4ED8] to-[#1E40AF]",
  IndusInd: "from-[#0369A1] to-[#075985]",
  DEFAULT: "from-[#374151] to-[#1F2937]",
};

function bankAbbr(bank: string): string {
  const known: Record<string, string> = {
    "State Bank of India": "SBI",
    "HDFC Bank": "HDFC",
    "ICICI Bank": "ICICI",
    "Axis Bank": "Axis",
    "Kotak Mahindra Bank": "Kotak",
  };
  return known[bank] || bank?.split(" ")[0] || "BANK";
}

async function fetchTopPicks(): Promise<TopPickCard[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("credit_cards")
      .select("slug, name, bank, rating, type, annual_fee, reward_rate, pros")
      .order("rating", { ascending: false, nullsFirst: false })
      .limit(3);

    if (error || !data || data.length === 0) return [];

    return data.map((card, i) => {
      const abbr = bankAbbr(card.bank);
      const score = Math.round((Number(card.rating) || 4) * 20);
      const feeNum = Number(card.annual_fee) || 0;
      const rewardRate = card.reward_rate || "Rewards";
      const typeLabel = card.type || "Rewards";

      return {
        pick: i === 0,
        logo: abbr,
        logoGradient: LOGO_GRADIENTS[abbr] || LOGO_GRADIENTS.DEFAULT,
        name: card.name,
        bank: card.bank,
        score,
        scoreColor:
          score >= 80
            ? "border-green-500 text-green-700"
            : "border-[--v2-saffron] text-[--v2-saffron-dark]",
        highlight: rewardRate || "Top Rated",
        highlightSub:
          card.pros?.[0] || `${typeLabel} credit card from ${card.bank}`,
        tags: [
          ...(i === 0
            ? [
                {
                  label: "Top Rated",
                  color: "bg-green-50 text-green-700",
                  check: true,
                },
              ]
            : []),
          { label: typeLabel, color: "bg-blue-50 text-blue-700" },
        ],
        fee: feeNum === 0 ? "₹0" : `₹${feeNum.toLocaleString("en-IN")}`,
        href: `/credit-cards/${card.slug}`,
      };
    });
  } catch (err) {
    logger.error(
      "[TopPicks] Failed to fetch",
      err instanceof Error ? err : undefined,
    );
    return [];
  }
}

// Hardcoded fallback in case DB is empty
const FALLBACK_PICKS: TopPickCard[] = [
  {
    pick: true,
    logo: "SBI",
    logoGradient: "from-[#1B2A4A] to-[#2C3E5A]",
    name: "SBI Cashback Card",
    bank: "State Bank of India",
    score: 88,
    scoreColor: "border-green-500 text-green-700",
    highlight: "5%",
    highlightSub: "Cashback on ALL online — no restrictions",
    tags: [
      {
        label: "Most Applied",
        color: "bg-green-50 text-green-700",
        check: true,
      },
      { label: "Online", color: "bg-blue-50 text-blue-700" },
    ],
    fee: "₹999",
    href: "/credit-cards/sbi-cashback-credit-card",
  },
  {
    logo: "ICICI",
    logoGradient: "from-[#92400E] to-[#B45309]",
    name: "Amazon Pay ICICI",
    bank: "ICICI Bank",
    score: 91,
    scoreColor: "border-green-500 text-green-700",
    highlight: "5%",
    highlightSub: "On Amazon · 2% everywhere · Free forever",
    tags: [
      { label: "Lifetime Free", color: "bg-gray-100 text-gray-500" },
      { label: "Amazon", color: "bg-blue-50 text-blue-700" },
    ],
    fee: "₹0",
    href: "/credit-cards/amazon-pay-icici-credit-card",
  },
  {
    logo: "HDFC",
    logoGradient: "from-[#B45309] to-[#78350F]",
    name: "HDFC Millennia",
    bank: "HDFC Bank",
    score: 72,
    scoreColor: "border-[--v2-saffron] text-[--v2-saffron-dark]",
    highlight: "5%",
    highlightSub: "Amazon, Flipkart, Swiggy, Zomato",
    tags: [
      { label: "Millennials", color: "bg-blue-50 text-blue-700" },
      { label: "Dining", color: "bg-green-50 text-green-700" },
    ],
    fee: "₹1,000",
    href: "/credit-cards/hdfc-millennia",
  },
];

export default async function TopPicks() {
  const picks = await fetchTopPicks();
  const cards = picks.length > 0 ? picks : FALLBACK_PICKS;

  return (
    <section className="py-12 md:py-16 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-2 mb-7">
          <div>
            <div className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">
              InvestingPro&apos;s Picks
            </div>
            <h2 className="text-2xl md:text-[28px] font-bold text-[--v2-ink] tracking-tight">
              Top-rated products this{" "}
              <span className="text-green-600">week</span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Ranked by real outcomes — not what pays us most.
            </p>
          </div>
          <Link
            href="/credit-cards"
            className="text-[13px] text-green-600 font-medium hover:text-green-700 transition-colors"
          >
            All credit cards →
          </Link>
        </div>

        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.name}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 hover:border-green-500 hover:shadow-lg hover:shadow-green-900/[.06] hover:-translate-y-0.5"
            >
              {card.pick && (
                <div className="bg-[--v2-saffron-glow] px-4 py-1.5 text-[11px] font-semibold text-[--v2-saffron-dark] border-b border-orange-100">
                  <Star
                    size={12}
                    className="inline text-amber-600 fill-amber-500"
                  />{" "}
                  Editor&apos;s Pick
                </div>
              )}
              <div className="p-4 flex items-start gap-3">
                <div
                  className={`w-12 h-[30px] rounded-md bg-gradient-to-br ${card.logoGradient} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}
                >
                  {card.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[--v2-ink]">
                    {card.name}
                  </div>
                  <div className="text-[11px] text-gray-500">{card.bank}</div>
                </div>
                <div
                  className={`w-9 h-9 rounded-full border-[2.5px] flex items-center justify-center text-xs font-bold shrink-0 ${card.scoreColor}`}
                >
                  {card.score}
                </div>
              </div>
              <div className="px-4 pb-4">
                <div className="font-serif italic text-2xl text-[--v2-ink]">
                  {card.highlight}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {card.highlightSub}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {card.tags.map((tag) => (
                    <span
                      key={tag.label}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${tag.color}`}
                    >
                      {tag.check && <Check size={10} strokeWidth={3} />}
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Annual:{" "}
                  <strong className="text-[--v2-ink]">{card.fee}</strong>
                </span>
                <div className="flex flex-col items-end gap-0.5">
                  <Link
                    href={card.href}
                    className="px-3.5 py-2.5 bg-green-600 text-white rounded-md text-xs font-semibold hover:bg-green-700 transition-colors"
                  >
                    Apply Now →
                  </Link>
                  <span className="text-[9px] text-gray-400">
                    3-5 min · No CIBIL impact
                  </span>
                </div>
              </div>
              <div className="px-4 py-2 border-t border-gray-100 text-[11px] text-gray-400">
                InvestingPro Research · 23 data points
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
