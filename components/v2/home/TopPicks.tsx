import Link from "next/link";
import { createClient } from "@/lib/supabase/static";
import { logger } from "@/lib/logger";

interface TopPickCard {
  pick: boolean;
  name: string;
  bank: string;
  score: number;
  highlight: string;
  highlightSub: string;
  fee: string;
  href: string;
}

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
      const score = Math.round((Number(card.rating) || 4) * 20);
      const feeNum = Number(card.annual_fee) || 0;
      return {
        pick: i === 0,
        name: card.name,
        bank: card.bank,
        score,
        highlight: card.reward_rate || "Top Rated",
        highlightSub:
          card.pros?.[0] || `${card.type || "Rewards"} card from ${card.bank}`,
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

const FALLBACK: TopPickCard[] = [
  {
    pick: true,
    name: "SBI Cashback Card",
    bank: "State Bank of India",
    score: 88,
    highlight: "5%",
    highlightSub: "Cashback on ALL online spending",
    fee: "₹999",
    href: "/credit-cards/sbi-cashback-credit-card",
  },
  {
    pick: false,
    name: "Amazon Pay ICICI",
    bank: "ICICI Bank",
    score: 91,
    highlight: "5%",
    highlightSub: "On Amazon · 2% everywhere · Free forever",
    fee: "₹0",
    href: "/credit-cards/amazon-pay-icici-credit-card",
  },
  {
    pick: false,
    name: "HDFC Millennia",
    bank: "HDFC Bank",
    score: 72,
    highlight: "5%",
    highlightSub: "Amazon, Flipkart, Swiggy, Zomato",
    fee: "₹1,000",
    href: "/credit-cards/hdfc-millennia",
  },
];

export default async function TopPicks() {
  const picks = await fetchTopPicks();
  const cards = picks.length > 0 ? picks : FALLBACK;

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="font-data text-[11px] uppercase tracking-[4px] text-[#D97706] mb-3">
              Our Verdict
            </div>
            <h2 className="font-display text-[28px] sm:text-[36px] font-black leading-[1.0] tracking-tight text-[#0A1F14] dark:text-white">
              Top-rated products{" "}
              <span className="text-[#D97706]">this week.</span>
            </h2>
            <p className="text-sm text-[#0A1F14]/50 dark:text-white/50 mt-2">
              Ranked by real outcomes — not what pays us most.
            </p>
          </div>
          <Link
            href="/credit-cards"
            className="hidden sm:inline-flex font-data text-[11px] uppercase tracking-[2px] text-[#D97706] hover:text-[#B45309] transition-colors"
          >
            All credit cards &rarr;
          </Link>
        </div>

        <div className="grid gap-0 grid-cols-1 sm:grid-cols-3 border-2 border-[#0A1F14]/10 dark:border-white/10">
          {cards.map((card, i) => (
            <div
              key={card.name}
              className={`p-6 ${
                i < cards.length - 1
                  ? "border-b sm:border-b-0 sm:border-r border-[#0A1F14]/10 dark:border-white/10"
                  : ""
              }`}
            >
              {card.pick && (
                <div className="font-data text-[10px] uppercase tracking-[2px] text-[#D97706] mb-3 pb-3 border-b border-[#D97706]/20">
                  Editor&apos;s Pick
                </div>
              )}

              {/* Score */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-data text-[10px] uppercase tracking-wider text-[#0A1F14]/40 dark:text-white/40">
                    {bankAbbr(card.bank)}
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#0A1F14] dark:text-white mt-1">
                    {card.name}
                  </h3>
                </div>
                <div className="w-14 h-14 border-2 border-[#16A34A] flex items-center justify-center flex-shrink-0">
                  <span className="font-data text-xl font-bold text-[#16A34A]">
                    {card.score}
                  </span>
                </div>
              </div>

              {/* Highlight */}
              <div className="font-data text-3xl font-bold text-[#0A1F14] dark:text-white mb-1">
                {card.highlight}
              </div>
              <p className="text-sm text-[#0A1F14]/50 dark:text-white/50 mb-4">
                {card.highlightSub}
              </p>

              {/* Fee + CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-[#0A1F14]/10 dark:border-white/10">
                <span className="font-data text-[11px] text-[#0A1F14]/40 dark:text-white/40 uppercase tracking-wider">
                  Annual:{" "}
                  <strong className="text-[#0A1F14] dark:text-white">
                    {card.fee}
                  </strong>
                </span>
                <Link
                  href={card.href}
                  className="px-4 py-2 bg-[#16A34A] text-white font-data text-[11px] uppercase tracking-[2px] hover:bg-[#166534] transition-colors"
                >
                  Apply Now
                </Link>
              </div>

              <div className="mt-3 font-data text-[10px] text-[#D97706] uppercase tracking-wider">
                Methodology disclosed &rarr;
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
