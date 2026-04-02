import { Check, Lock, CalendarDays, Cpu } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const SIGNALS: { icon: LucideIcon; text: string }[] = [
  { icon: Check, text: 'Rankings never influenced by commission' },
  { icon: Lock, text: 'No credit check to compare' },
  { icon: CalendarDays, text: 'Rates updated daily' },
  { icon: Cpu, text: 'AI-powered research' },
];

export default function TrustBar() {
  return (
    <div className="bg-gradient-to-r from-green-700 to-green-900 py-2.5 px-4 flex gap-6 overflow-x-auto scrollbar-hide justify-center" role="list" aria-label="Trust signals">
      {SIGNALS.map((item) => {
        const Icon = item.icon;
        return (
          <span key={item.text} className="text-xs text-white/90 font-medium whitespace-nowrap shrink-0 flex items-center gap-1.5" role="listitem">
            <Icon size={13} className="text-white/70" strokeWidth={2.5} />
            {item.text}
          </span>
        );
      })}
    </div>
  );
}
