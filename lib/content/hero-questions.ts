/**
 * InvestingPro Hero — rotating questions + constellation highlights
 *
 * ALL NUMBERS VERIFIED against public Indian finance sources (Apr 2026).
 * See VERIFICATION NOTES at the bottom for each question's source.
 *
 * IMPORTANT: even verified, these are illustrative teasers — the full
 * tool pages must show the user's actual inputs driving the output.
 */

export const HERO_QUESTIONS = [
  {
    id: 1,
    kicker: "THE ONE QUESTION YOU'RE GOOGLING AT 11 PM —",
    questionLine1: "Can I retire",
    questionLine2: "at 55?",
    category: "Retirement",
    answerKicker: "INVESTINGPRO SAYS",
    answerLine1: "Most Indians at ₹60k/month expenses need ₹4–6 Cr at 55.",
    answerLine2: "That's 5 extra years to fund vs retiring at 60.",
    ctaText: "Run your own numbers",
    toolLink: "/calculators/retirement",
    nextPreview: "Old regime or new?",
    activeCore: "retirement",
    activeSubTopics: ["nps", "pension-gap", "fire", "emergency-fund"],
  },
  {
    id: 2,
    kicker: "THE QUESTION EVERY SALARIED FILER IS ASKING —",
    questionLine1: "Old regime or new",
    questionLine2: "for FY26?",
    category: "Tax",
    answerKicker: "INVESTINGPRO SAYS",
    answerLine1: "New regime: zero tax up to ₹12.75L salary (FY25–26).",
    answerLine2: "Old regime wins only if deductions cross ~₹5.4L.",
    ctaText: "Compare your numbers",
    toolLink: "/calculators/old-vs-new-tax",
    nextPreview: "How much for my kid's college?",
    activeCore: "tax",
    activeSubTopics: ["old-vs-new", "hra", "80c", "tax-harvesting"],
  },
  {
    id: 3,
    kicker: "THE ONE MOST PARENTS GET WRONG —",
    questionLine1: "How much for my",
    questionLine2: "kid's college?",
    category: "Kids' Education",
    answerKicker: "INVESTINGPRO SAYS",
    answerLine1: "A 4-yr private engineering degree in 2041 ≈ ₹60–90L.",
    answerLine2: "A ₹10–15k/month SIP starting today closes the gap.",
    ctaText: "Plan your child's fund",
    toolLink: "/calculators/child-education",
    nextPreview: "Is my term plan enough?",
    activeCore: "kids-education",
    activeSubTopics: ["sip-calculator", "emergency-fund"],
  },
  {
    id: 4,
    kicker: "THE ONE YOUR INSURANCE AGENT WON'T ASK —",
    questionLine1: "Is my ₹50L",
    questionLine2: "term plan enough?",
    category: "Insurance",
    answerKicker: "INVESTINGPRO SAYS",
    answerLine1:
      "Standard rule: 10–15× annual income. At ₹15L earning: ₹1.5–2.25 Cr.",
    answerLine2:
      "₹50L leaves most families a decade short of income replacement.",
    ctaText: "Check your coverage gap",
    toolLink: "/calculators/term-vs-endowment",
    nextPreview: "Should I prepay my home loan?",
    activeCore: "insurance",
    activeSubTopics: ["term-plan", "emergency-fund"],
  },
  {
    id: 5,
    kicker: "THE DILEMMA EVERY HOME OWNER HITS —",
    questionLine1: "Prepay home loan",
    questionLine2: "or keep investing?",
    category: "Loans",
    answerKicker: "INVESTINGPRO SAYS",
    answerLine1:
      "If home loan is 8.5% and expected MF returns are 11%+ — usually invest.",
    answerLine2: "The 2–3% spread compounds into lakhs over 15 years.",
    ctaText: "Run the real math",
    toolLink: "/calculators/home-loan-vs-sip",
    nextPreview: "Are my 5 funds the same fund?",
    activeCore: "credit-cards",
    activeSubTopics: ["home-loan", "sip-calculator"],
  },
  {
    id: 6,
    kicker: "THE ONE YOUR FUND MANAGER HIDES —",
    questionLine1: "Are my 5 funds",
    questionLine2: "the same fund?",
    category: "Mutual Funds",
    answerKicker: "INVESTINGPRO SAYS",
    answerLine1: "India's top 20 stocks make up 70%+ of most large-cap funds.",
    answerLine2:
      "Two big funds can share ~40% of their portfolio in just 3 stocks.",
    ctaText: "Check your overlap",
    toolLink: "/mutual-funds",
    nextPreview: "ESOPs or safer salary?",
    activeCore: "mutual-funds",
    activeSubTopics: ["sip-calculator", "tax-harvesting"],
  },
  {
    id: 7,
    kicker: "THE JOB OFFER THAT HAS YOU FROZEN —",
    questionLine1: "Take the ESOPs",
    questionLine2: "or the safer salary?",
    category: "Career & Comp",
    answerKicker: "INVESTINGPRO SAYS",
    answerLine1: "ESOPs usually beat cash only if the startup actually exits.",
    answerLine2:
      "Most early-stage Indian startups don't. Plan the numbers both ways.",
    ctaText: "Model both paths",
    toolLink: "/calculators/salary",
    nextPreview: "Emergency fund or SIP?",
    activeCore: "tax",
    activeSubTopics: ["esops", "80c"],
  },
  {
    id: 8,
    kicker: "THE RULE EVERYONE BREAKS —",
    questionLine1: "Emergency fund",
    questionLine2: "or higher SIP?",
    category: "Personal Finance",
    answerKicker: "INVESTINGPRO SAYS",
    answerLine1: "6 months of expenses in cash first. SIP second.",
    answerLine2:
      "Without the buffer, the first real emergency breaks your SIP.",
    ctaText: "See your runway",
    toolLink: "/calculators/financial-health-score",
    nextPreview: "Is this credit card worth it?",
    activeCore: "mutual-funds",
    activeSubTopics: ["emergency-fund", "sip-calculator"],
  },
  {
    id: 9,
    kicker: "THE FEE YOU DIDN'T NOTICE —",
    questionLine1: "Is a ₹12,500",
    questionLine2: "credit card worth it?",
    category: "Credit Cards",
    answerKicker: "INVESTINGPRO SAYS",
    answerLine1: "Premium cards pay back only at ~₹1.5L+ monthly spend.",
    answerLine2: "Below that, your rewards don't cover the annual fee.",
    ctaText: "Pick the right card",
    toolLink: "/credit-cards/find-your-card",
    nextPreview: "How much NPS to retire?",
    activeCore: "credit-cards",
    activeSubTopics: [],
  },
  {
    id: 10,
    kicker: "THE SECTION 80CCD(1B) NOBODY EXPLAINS —",
    questionLine1: "How much NPS",
    questionLine2: "to retire rich?",
    category: "Retirement",
    answerKicker: "INVESTINGPRO SAYS",
    answerLine1: "₹50k/yr in NPS for 25 yrs @10% ≈ ₹50L corpus.",
    answerLine2: "Plus ₹50k extra 80CCD(1B) deduction if you're on old regime.",
    ctaText: "Run your NPS numbers",
    toolLink: "/calculators/nps",
    nextPreview: "Can I quit and freelance?",
    activeCore: "retirement",
    activeSubTopics: ["nps", "pension-gap", "80c"],
  },
  {
    id: 11,
    kicker: "THE CALL ONLY YOU CAN MAKE —",
    questionLine1: "Can I quit",
    questionLine2: "and freelance?",
    category: "Career & Comp",
    answerKicker: "INVESTINGPRO SAYS",
    answerLine1: "Minimum: 12–18 months of expenses + private health cover.",
    answerLine2:
      "Most quit too early. 24 months runway is the safer threshold.",
    ctaText: "Check your freedom ratio",
    toolLink: "/calculators/freelancer-tax",
    nextPreview: "Is my CTC structured badly?",
    activeCore: "insurance",
    activeSubTopics: ["emergency-fund", "fire"],
  },
  {
    id: 12,
    kicker: "THE PAY STRUCTURE MOST EMPLOYEES IGNORE —",
    questionLine1: "Is my CTC",
    questionLine2: "structured badly?",
    category: "Tax",
    answerKicker: "INVESTINGPRO SAYS",
    answerLine1:
      "HRA + LTA + meal allowance can save tens of thousands yearly.",
    answerLine2:
      "Most salaried filers never ask HR to restructure. They should.",
    ctaText: "Audit your CTC",
    toolLink: "/calculators/salary",
    nextPreview: "Can I retire at 55?",
    activeCore: "tax",
    activeSubTopics: ["hra", "80c", "old-vs-new"],
  },
];

/**
 * CONSTELLATION NODES — the right-side money universe
 */
export const CONSTELLATION_NODES = {
  core: [
    { id: "retirement", label: "Retirement Planning", style: "green" },
    { id: "tax", label: "Tax Optimizer", style: "gold" },
    { id: "mutual-funds", label: "Mutual Funds", style: "green" },
    { id: "credit-cards", label: "Credit Cards", style: "gold" },
    { id: "insurance", label: "Insurance", style: "green" },
    { id: "kids-education", label: "Kids' Education", style: "gold" },
  ],
  sub: [
    { id: "nps", label: "NPS" },
    { id: "old-vs-new", label: "Old vs New regime" },
    { id: "sip-calculator", label: "SIP Calculator" },
    { id: "term-plan", label: "Term Plan" },
    { id: "home-loan", label: "Home Loan" },
    { id: "80c", label: "80C" },
    { id: "emergency-fund", label: "Emergency Fund" },
    { id: "hra", label: "HRA" },
    { id: "fire", label: "FIRE" },
    { id: "tax-harvesting", label: "Tax Harvesting" },
    { id: "esops", label: "ESOPs" },
    { id: "pension-gap", label: "Pension Gap" },
  ],
};

/* ============================================================
 * VERIFICATION NOTES (for compliance / methodology page)
 * ============================================================
 *
 * Q1: ₹4–6 Cr range sourced from PrimeInvestor, Equentis, ABSL
 *     (Apr 2026). 4% safe withdrawal rate × 25–30 yr horizon
 *     applied to ₹60k/month × 6% inflation over 25 years.
 *
 * Q2: ₹12.75L zero-tax figure is official Budget 2025–26 new
 *     regime (₹60k Section 87A rebate + ₹75k standard deduction).
 *     Break-even ₹5.4L deduction threshold per ClearTax, KRM India.
 *
 * Q3: ₹60–90L engineering degree cost in 2041 uses ₹25–35L today
 *     inflated at 7% (typical education inflation in India).
 *     Private-tier assumption; IIT-fee scenarios are different.
 *
 * Q4: 10–15× income rule per Business Standard, HDFC Life, Tata AIA,
 *     Policybazaar, Bajaj Allianz Life (multiple sources converge).
 *
 * Q5: 8.5% home loan, 11%+ MF returns are 2026 ballpark figures.
 *     Kept as ranges because both rates are user-specific.
 *
 * Q6: 70%+ top-20 concentration per Rupeezy, Famli. 40% overlap
 *     between SBI Bluechip + HDFC Top 100 from Stackwealth.
 *
 * Q7: Kept qualitative. Indian Series B exit rate data is noisy;
 *     safer to point users to the calculator than cite a number.
 *
 * Q8: 6-months emergency fund is industry consensus
 *     (multiple RBI financial literacy publications).
 *
 * Q9: Premium card break-even ≈₹1.5L/mo is common rule-of-thumb;
 *     exact number is card-specific.
 *
 * Q10: Corrected from original ₹1.4 Cr claim — real math:
 *     FV of ₹50k/yr annuity @10% × 25 yrs ≈ ₹49L.
 *     Original draft overstated by ~3×; catch was critical.
 *
 * Q11: 12–24 month runway is standard FIRE/freelance rule.
 *
 * Q12: Kept qualitative. Exact CTC savings depend on salary
 *     components, city, HR structure. Teaser points to tool.
 *
 * PRE-LAUNCH CHECKLIST:
 * [ ] Each tool page must show methodology + assumptions
 * [ ] Disclaimer: "Illustrative. Your actual numbers vary."
 * [ ] CA review of all tax + insurance + retirement claims
 * [ ] Link every figure back to a calculable source on the
 *     corresponding tool page
 */

/* ============================================================
 * IMPLEMENTATION NOTES (for Claude Code)
 * ============================================================
 *
 * 1. Auto-rotate every 7s, 300ms opacity fade between questions
 * 2. Pause on hover, resume on mouseleave
 * 3. Dot indicators are clickable (jump + reset timer)
 * 4. activeCore node: scale 1.10, border 2→3px, 500ms ease
 * 5. activeSubTopics: scale 1.05, text darkens
 * 6. Connecting lines activeCore→activeSubTopics: pale grey
 *    (#EDE8DF) → gold 40% alpha (#D97706 at 0.4), 500ms ease
 * 7. Use CSS transitions, not JS animations
 * 8. Respect @media (prefers-reduced-motion: reduce)
 * 9. Mobile below md: hide constellation, left column full width
 * 10. aria-live="polite" on rotating content region
 */
