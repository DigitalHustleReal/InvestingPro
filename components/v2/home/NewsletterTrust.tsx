"use client";

import { useState } from "react";

export default function NewsletterTrust() {
  const [email, setEmail] = useState("");

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display font-black text-[32px] sm:text-[44px] leading-[1.08] tracking-tight text-ink mb-4">
            One email. The week&apos;s best{" "}
            <em className="italic text-indian-gold">financial decisions.</em>
          </h2>
          <p className="text-gray-500 mb-8">
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
              className="flex-1 px-4 py-3 border border-gray-300 rounded-l-xl bg-white text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-green-600"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-green-600 text-white text-sm font-semibold rounded-r-xl hover:bg-green-700 transition-colors cursor-pointer"
            >
              Subscribe
            </button>
          </form>

          <p className="text-xs text-gray-400 mt-4">
            Join 2,400+ readers · Unsubscribe anytime
          </p>
        </div>
      </div>
    </section>
  );
}
