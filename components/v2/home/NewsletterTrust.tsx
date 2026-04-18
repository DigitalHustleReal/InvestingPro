"use client";

import { useState } from "react";

export default function NewsletterTrust() {
  const [email, setEmail] = useState("");

  return (
    <section className="bg-white dark:bg-[#0A1F14] border-t border-gray-200 dark:border-white/10 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="font-data text-[11px] uppercase tracking-[4px] text-[#D97706] mb-4">
            Weekly Research
          </div>
          <h2 className="font-display text-[28px] sm:text-[36px] font-black leading-[1.0] tracking-tight text-[#0A1F14] dark:text-white mb-4">
            One email. The week&apos;s best financial decisions.
          </h2>
          <p className="text-[#0A1F14]/60 dark:text-white/60 mb-8">
            No spam. No sales pitches. Just research-backed insights for Indian
            investors.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="flex gap-0 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 border-2 border-[#0A1F14] dark:border-white/30 bg-transparent text-[#0A1F14] dark:text-white font-data text-sm placeholder:text-[#0A1F14]/30 dark:placeholder:text-white/30 focus:outline-none focus:border-[#16A34A]"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#0A1F14] dark:bg-white text-white dark:text-[#0A1F14] font-data text-[11px] uppercase tracking-[2px] hover:bg-[#16A34A] dark:hover:bg-[#16A34A] dark:hover:text-white transition-colors cursor-pointer"
            >
              Subscribe
            </button>
          </form>

          <p className="font-data text-[10px] text-[#0A1F14]/30 dark:text-white/30 mt-4 uppercase tracking-wider">
            Join 2,400+ readers · Unsubscribe anytime
          </p>
        </div>
      </div>
    </section>
  );
}
