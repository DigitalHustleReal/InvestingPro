import Link from "next/link";
import { Zap, Calendar, Percent, TrendingUp, Newspaper } from "lucide-react";
import { WEEKLY_CHANGES, type WeeklyItem } from "@/lib/content/weekly-changes";

// "This Week in Indian Money" editorial ticker.
// Shows 3-5 timestamped items per category on listing pages.
// Closes NerdWallet's one remaining UX edge — editorial velocity.
//
// Renders as a dense editorial block: mono timestamps + type badge
// + Playfair headline + editorial summary. Visual pattern matches
// brainstorm Signature Element #1 (editorial verdict cards).

const TYPE_LABELS: Record<WeeklyItem["type"], { label: string; Icon: typeof Zap }> = {
  rate: { label: "Rate Change", Icon: TrendingUp },
  offer: { label: "Offer", Icon: Zap },
  policy: { label: "Policy", Icon: Newspaper },
  deadline: { label: "Deadline", Icon: Calendar },
  news: { label: "News", Icon: Percent },
};

interface Props {
  category:
    | "credit-cards"
    | "loans"
    | "mutual-funds"
    | "insurance"
    | "fixed-deposits"
    | "demat-accounts";
  className?: string;
  /** Max items to show (default 4) */
  limit?: number;
}

export default function WeeklyChanges({ category, className, limit = 4 }: Props) {
  const items = (WEEKLY_CHANGES[category] || []).slice(0, limit);
  if (items.length === 0) return null;

  return (
    <section
      aria-label="This week in Indian money"
      className={`bg-white border-2 border-ink/10 rounded-sm ${className || ""}`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b-2 border-ink/10">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-indian-gold mb-1 font-semibold">
            This Week in Indian Money
          </div>
          <h3 className="font-display font-bold text-lg text-ink">
            What changed.{" "}
            <em className="italic text-indian-gold">What it means.</em>
          </h3>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-60 border border-ink/15 px-2 py-1">
          Updated weekly
        </span>
      </div>

      {/* Items */}
      <ul className="divide-y divide-ink/5">
        {items.map((item, i) => {
          const { label: typeLabel, Icon } = TYPE_LABELS[item.type];
          const isExpiring = item.expiresOn;
          return (
            <li key={i} className="group">
              {item.link ? (
                <Link
                  href={item.link}
                  className="block px-5 py-4 hover:bg-ink/[0.02] transition-colors"
                >
                  <ItemContent
                    item={item}
                    typeLabel={typeLabel}
                    Icon={Icon}
                    isExpiring={Boolean(isExpiring)}
                  />
                </Link>
              ) : (
                <div className="px-5 py-4">
                  <ItemContent
                    item={item}
                    typeLabel={typeLabel}
                    Icon={Icon}
                    isExpiring={Boolean(isExpiring)}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {/* Footer — weekly email capture tease */}
      <div className="px-5 py-3 border-t-2 border-ink/10 bg-canvas flex items-center justify-between gap-3">
        <p className="font-mono text-[11px] text-ink-60 leading-relaxed">
          Every Friday, delivered as one email.
        </p>
        <Link
          href="#newsletter"
          className="font-mono text-[11px] uppercase tracking-wider text-indian-gold hover:underline whitespace-nowrap font-semibold"
        >
          Get the weekly &rarr;
        </Link>
      </div>
    </section>
  );
}

function ItemContent({
  item,
  typeLabel,
  Icon,
  isExpiring,
}: {
  item: WeeklyItem;
  typeLabel: string;
  Icon: typeof Zap;
  isExpiring: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 bg-indian-gold/10 flex items-center justify-center rounded-sm">
        <Icon className="w-4 h-4 text-indian-gold" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-indian-gold font-semibold">
            {typeLabel}
          </span>
          <span className="text-ink/20">·</span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-60 tabular-nums">
            {item.date}
          </span>
          {isExpiring && (
            <>
              <span className="text-ink/20">·</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-warning-red font-semibold">
                Ends {item.expiresOn}
              </span>
            </>
          )}
        </div>
        <p className="font-display font-bold text-[15px] text-ink leading-snug mb-1 group-hover:text-authority-green transition-colors">
          {item.headline}
        </p>
        <p className="text-[13px] text-ink-60 leading-relaxed">
          {item.summary}
        </p>
        {item.source && (
          <p className="font-mono text-[10px] text-ink-60/70 mt-1.5 italic">
            Source: {item.source}
          </p>
        )}
      </div>
    </div>
  );
}
