export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  contentType: string;
  wordCountRange: [number, number];
  icon: string;
  structure: string;
}

export const CONTENT_TEMPLATES: ContentTemplate[] = [
  {
    id: "product-review",
    name: "Product Review",
    description:
      "In-depth review of a credit card, mutual fund, or loan product",
    contentType: "review",
    wordCountRange: [1500, 2500],
    icon: "Star",
    structure: `## Overview

Brief introduction to the product and who it's best for.

## Key Features

- Feature 1
- Feature 2
- Feature 3

## Pros and Cons

### Pros
- Pro 1
- Pro 2

### Cons
- Con 1
- Con 2

## Fees and Charges

Break down all fees, annual charges, and hidden costs.

## Who Should Get This?

Describe the ideal user profile.

## How It Compares

Brief comparison with 2-3 alternatives.

## Our Verdict

Final recommendation with rating.

## FAQs

### Q1?
Answer.

### Q2?
Answer.`,
  },
  {
    id: "comparison",
    name: "Comparison (X vs Y)",
    description: "Head-to-head comparison of two financial products",
    contentType: "comparison",
    wordCountRange: [1200, 2000],
    icon: "ArrowLeftRight",
    structure: `## Quick Comparison

| Feature | Product A | Product B |
|---------|-----------|-----------|
| Annual Fee | | |
| Rewards | | |
| Best For | | |

## Product A Overview

Key details about Product A.

## Product B Overview

Key details about Product B.

## Feature-by-Feature Comparison

### Rewards and Benefits
Compare rewards structure.

### Fees and Charges
Compare fee structures.

### Eligibility
Compare eligibility criteria.

## Which One Should You Choose?

Decision framework based on user profile.

## FAQs

### Q1?
Answer.`,
  },
  {
    id: "how-to-guide",
    name: "How-To Guide",
    description: "Step-by-step financial tutorial",
    contentType: "guide",
    wordCountRange: [1000, 1800],
    icon: "BookOpen",
    structure: `## What You'll Learn

Brief overview of what this guide covers.

## Prerequisites

What you need before starting.

## Step 1: [First Step]

Detailed instructions.

## Step 2: [Second Step]

Detailed instructions.

## Step 3: [Third Step]

Detailed instructions.

## Common Mistakes to Avoid

- Mistake 1
- Mistake 2

## Next Steps

What to do after completing this guide.

## FAQs

### Q1?
Answer.`,
  },
  {
    id: "listicle",
    name: "Best/Top List",
    description: 'Ranked list like "Top 10 Credit Cards 2026"',
    contentType: "listicle",
    wordCountRange: [2000, 3500],
    icon: "ListOrdered",
    structure: `## How We Ranked These

Methodology and criteria used.

## Quick Picks

| Rank | Product | Best For | Key Feature |
|------|---------|----------|-------------|
| 1 | | | |
| 2 | | | |
| 3 | | | |

## 1. [Product Name] — Best Overall

Overview, key features, pros/cons, who it's for.

## 2. [Product Name] — Best for [Category]

Overview, key features, pros/cons, who it's for.

## 3. [Product Name] — Best for [Category]

Overview, key features, pros/cons, who it's for.

## How to Choose the Right One

Decision guide based on needs.

## FAQs

### Q1?
Answer.`,
  },
  {
    id: "calculator-explainer",
    name: "Calculator Explainer",
    description: "Explains how a financial calculator works with examples",
    contentType: "guide",
    wordCountRange: [800, 1500],
    icon: "Calculator",
    structure: `## What Is [Calculator Name]?

Simple explanation of what this calculator does.

## How the Formula Works

The mathematical formula with explanation.

## Example Calculation

Walk through a real example with numbers.

## When to Use This Calculator

Common scenarios.

## Tips for Accurate Results

- Tip 1
- Tip 2

## Related Calculators

Links to related tools.`,
  },
  {
    id: "glossary-deep-dive",
    name: "Glossary Deep Dive",
    description: "Expanded explanation of a financial term",
    contentType: "glossary",
    wordCountRange: [600, 1200],
    icon: "GraduationCap",
    structure: `## Definition

Clear, simple definition of the term.

## How It Works

Detailed explanation with context.

## Example

Real-world example to illustrate the concept.

## Why It Matters

Why this concept is important for personal finance.

## Related Terms

- Term 1 — brief definition
- Term 2 — brief definition

## Key Takeaways

- Takeaway 1
- Takeaway 2`,
  },
  {
    id: "news-analysis",
    name: "News Analysis",
    description: "Analysis of a financial event like RBI rate change",
    contentType: "analysis",
    wordCountRange: [800, 1500],
    icon: "Newspaper",
    structure: `## What Happened

Summary of the news event.

## Why It Matters

Impact on consumers and markets.

## Who Is Affected

Which groups are impacted and how.

## What You Should Do

Actionable advice for readers.

## Historical Context

How this compares to past events.

## Expert Opinions

Quotes or perspectives from industry experts.

## The Bottom Line

Key takeaway in 2-3 sentences.`,
  },
  {
    id: "beginner-guide",
    name: "Beginner Guide",
    description: "Introduction to a financial topic for first-timers",
    contentType: "guide",
    wordCountRange: [1200, 2000],
    icon: "Lightbulb",
    structure: `## What Is [Topic]?

Simple explanation assuming zero prior knowledge.

## Why Should You Care?

Why this matters for your financial health.

## Key Concepts

### Concept 1
Explanation in plain language.

### Concept 2
Explanation in plain language.

### Concept 3
Explanation in plain language.

## How to Get Started

Step-by-step for absolute beginners.

## Common Mistakes Beginners Make

- Mistake 1 and how to avoid it
- Mistake 2 and how to avoid it

## Recommended Next Steps

What to learn or do next.

## Glossary

Key terms defined simply.`,
  },
  {
    id: "data-study",
    name: "Data Study",
    description: "Data-driven analysis like credit card rewards comparison",
    contentType: "analysis",
    wordCountRange: [1500, 2500],
    icon: "BarChart3",
    structure: `## Key Findings

Top 3-5 findings upfront.

## Methodology

How data was collected and analyzed.

## The Data

### Finding 1
Data visualization or table + analysis.

### Finding 2
Data visualization or table + analysis.

### Finding 3
Data visualization or table + analysis.

## What This Means for You

Practical takeaways from the data.

## Limitations

What this study doesn't cover.

## Sources

Data sources and methodology notes.`,
  },
  {
    id: "faq-page",
    name: "FAQ Page",
    description: "Comprehensive FAQ about a financial topic",
    contentType: "faq",
    wordCountRange: [1000, 2000],
    icon: "HelpCircle",
    structure: `## About [Topic]

Brief introduction to the topic.

## Basic Questions

### What is [topic]?
Answer.

### How does [topic] work?
Answer.

### Who should consider [topic]?
Answer.

## Process & Eligibility

### What documents do I need?
Answer.

### What is the eligibility criteria?
Answer.

### How long does it take?
Answer.

## Costs & Fees

### What are the charges?
Answer.

### Are there any hidden fees?
Answer.

## Common Concerns

### Is it safe?
Answer.

### What if something goes wrong?
Answer.`,
  },
];
