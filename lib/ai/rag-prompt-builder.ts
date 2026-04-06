import type { RAGContext } from "./rag-context";

export function buildRAGPrompt(
  topic: string,
  context: RAGContext,
  template?: string,
): string {
  let prompt = `You are InvestingPro's expert financial content writer for the Indian market.

TOPIC: ${topic}

`;

  // Inject real product data
  if (context.products.length > 0) {
    prompt += `=== REAL PRODUCT DATA (use ONLY this data, do NOT hallucinate) ===\n\n`;
    context.products.forEach((p, i) => {
      prompt += `Product ${i + 1}: ${p.name}\n`;
      prompt += `  Provider: ${p.provider_name || "N/A"}\n`;
      prompt += `  Rating: ${p.rating || "N/A"}/5\n`;
      prompt += `  Best For: ${p.best_for || "N/A"}\n`;
      if (p.pros && p.pros.length > 0) {
        prompt += `  Pros: ${p.pros.join(", ")}\n`;
      }
      if (p.cons && p.cons.length > 0) {
        prompt += `  Cons: ${p.cons.join(", ")}\n`;
      }
      if (p.features && typeof p.features === "object") {
        const featureStr = Object.entries(p.features)
          .slice(0, 5)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", ");
        if (featureStr) prompt += `  Features: ${featureStr}\n`;
      }
      prompt += `\n`;
    });
  }

  // Calculator links
  if (context.calculatorLinks.length > 0) {
    prompt += `=== CALCULATORS TO EMBED ===\n`;
    prompt += `Include links to these calculators naturally in the article:\n`;
    context.calculatorLinks.forEach((c) => {
      prompt += `- [${c.name}](https://investingpro.in${c.path})\n`;
    });
    prompt += `\n`;
  }

  // Related articles for internal linking
  if (context.relatedArticles.length > 0) {
    prompt += `=== INTERNAL LINKS (include 2-3 naturally) ===\n`;
    context.relatedArticles.forEach((a) => {
      prompt += `- [${a.title}](https://investingpro.in/articles/${a.slug})\n`;
    });
    prompt += `\n`;
  }

  // Template structure if provided
  if (template) {
    prompt += `=== ARTICLE STRUCTURE ===\n${template}\n\n`;
  }

  // Writing instructions
  prompt += `=== INSTRUCTIONS ===
- Write in a clear, authoritative tone suitable for Indian consumers
- Use ₹ symbol for all currency amounts
- Include specific numbers and data from the product data above
- Do NOT make up product features, fees, or rates — use only what's provided
- Include a comparison table if 3+ products are relevant
- Add an FAQ section with 3-5 questions
- Target 1500-2500 words
- Use ## for main headings, ### for sub-headings
- Include a "How to Choose" section with practical advice
- End with a clear recommendation
- Mention InvestingPro calculators where relevant
- Write for SEO: use the topic keywords naturally in headings and first paragraph
`;

  return prompt;
}
