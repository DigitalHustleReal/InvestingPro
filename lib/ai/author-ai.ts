import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

/**
 * AI Author Persona: "Arjun Sharma"
 * Senior Financial Content Writer specialized in Indian markets
 */
export class AuthorAI {
    private systemPrompt = `You are Arjun Sharma, a Senior Financial Content Writer with 8+ years of experience covering Indian financial markets. You hold an MBA in Finance from IIM and are a qualified Chartered Accountant (CA).

**Your Expertise:**
- Deep knowledge of Indian banking, insurance, investments, and taxation
- Expert in RBI, SEBI, IRDAI regulations
- Proficient in explaining complex financial topics simply
- Strong understanding of Indian consumer behavior and needs

**Your Writing Style:**
1. **Clarity First**: Use simple language, avoid jargon (or explain it)
2. **Indian Context**: Always use ₹ (Rupees), Indian banks, Indian examples
3. **Actionable**: Provide specific steps, not just theory
4. **Engaging**: Use storytelling, examples, and relatable scenarios
5. **SEO-Smart**: Naturally integrate keywords without stuffing

**Your Standards:**
- Reading Level: Grade 8-10
- Sentence Length: 15-20 words average
- Paragraph Length: 3-4 sentences maximum
- Use bullet points and numbered lists liberally
- Include tables for comparisons when helpful

**Indian Market Focus:**
- Reference actual Indian banks (HDFC, SBI, ICICI, Axis, Kotak)
- Use current Indian tax slabs and regulations (FY 2026-27)
- Cite RBI/SEBI/IRDAI guidelines when relevant
- Use Indian cultural context (festivals, life stages, family situations)

**Tone:**
- Professional but approachable
- Empathetic to user concerns
- Confident but not condescending
- Educational, not sales-y

You write to educate and empower Indian consumers to make better financial decisions.`;

    /**
     * Generate a glossary term definition
     */
    async writeGlossaryTerm(term: string, category: string): Promise<{
        term: string;
        definition: string;
        detailedExplanation: string;
        example: string;
        relatedTerms: string[];
        searchKeywords: string[];
        tips?: string[];
    }> {
        const prompt = `Write a comprehensive glossary entry for the financial term: "${term}"

**Category:** ${category}

**Requirements:**
1. **Definition** (50-75 words): Clear, concise explanation that a beginner can understand
2. **Detailed Explanation** (250-350 words): 
   - How it works in the Indian context
   - Why it matters to Indian consumers
   - Common scenarios where it applies
   - Key regulations (RBI/SEBI/IRDAI) if relevant
3. **Practical Example** (100-150 words):
   - Use a relatable Indian name (Raj, Priya, Amit, etc.)
   - Include specific numbers in ₹
   - Show real-world application
   - Make it memorable
4. **Related Terms** (3-5 terms): Connected concepts readers should know
5. **Search Keywords** (5-8 keywords): SEO phrases Indian users would search
6. **Pro Tips** (optional, 3-5 tips): Actionable advice

**Format your response as JSON:**
{
  "term": "${term}",
  "definition": "...",
  "detailedExplanation": "...",
  "example": "...",
  "relatedTerms": ["term1", "term2", ...],
  "searchKeywords": ["keyword1", "keyword2", ...],
  "tips": ["tip1", "tip2", ...] //optional
}`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: this.systemPrompt },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 2000,
            response_format: { type: 'json_object' }
        });

        const content = response.choices[0].message.content || '{}';
        return JSON.parse(content);
    }

    /**
     * Write a blog post
     */
    async writeBlogPost(
        title: string,
        category: string,
        keywords: string[],
        targetAudience: string = 'Indian consumers aged 25-45'
    ): Promise<{
        title: string;
        excerpt: string;
        content: string; // Markdown format
        metaDescription: string;
        metaKeywords: string[];
        readingTimeMinutes: number;
        faq?: Array<{ question: string; answer: string }>;
    }> {
        const prompt = `Write a comprehensive blog post on: "${title}"

**Category:** ${category}
**Target Keywords:** ${keywords.join(', ')}
**Target Audience:** ${targetAudience}

**Article Structure:**
1. **Introduction** (150-200 words):
   - Hook with a relatable problem or question
   - State what readers will learn
   - Build credibility without bragging

2. **Main Content** (1200-1500 words):
   - Use clear H2 and H3 headings
   - Include bullet points and numbered lists
   - Add comparison tables where relevant
   - Use specific Indian examples with ₹ amounts
   - Reference actual banks/products
   - Cite regulations when needed

3. **Key Takeaways** (100-150 words):
   - Summarize main points in bullets
   - Actionable next steps
   - Link to related resources

4. **FAQ Section** (5-7 Q&A):
   - Common questions Indian users ask
   - Brief, clear answers
   - Include long-tail keywords

**Style Requirements:**
- Grade 8-10 reading level
- Short paragraphs (3-4 sentences max)
- Active voice, second person ("you")
- Use Indian names in examples
- Include cultural context (festivals, traditions)

**SEO Requirements:**
- Primary keyword in H1, first paragraph, conclusion
- Secondary keywords naturally distributed
- Meta description: 150-160 characters
- Internal linking suggestions marked as [link: /slug]

**Response Format (JSON):**
{
  "title": "${title}",
  "excerpt": "150-char summary for cards",
  "content": "Full article in Markdown format...",
  "metaDescription": "...",
  "metaKeywords": ["..."],
  "readingTimeMinutes": estimated_time,
  "faq": [{"question": "...", "answer": "..."}, ...]
}`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: this.systemPrompt },
                { role: 'user', content: prompt }
            ],
            temperature: 0.8,
            max_tokens: 4000,
            response_format: { type: 'json_object' }
        });

        const content = response.choices[0].message.content || '{}';
        return JSON.parse(content);
    }

    /**
     * Write a comparison article
     */
    async writeComparison(
        option1: string,
        option2: string,
        category: string
    ): Promise<{
        title: string;
        content: string;
        comparisonTable: Array<{ criteria: string; option1: string; option2: string }>;
        verdict: string;
    }> {
        const prompt = `Write a detailed comparison article: "${option1} vs ${option2}"

**Category:** ${category}

**Structure:**
1. Introduction: Why this comparison matters
2. Overview of ${option1}
3. Overview of ${option2}
4. Head-to-Head Comparison (table format)
5. Best Use Cases for each
6. Verdict: Which to choose when

**Include:**
- Specific examples with ₹ amounts
- Pros and cons of each
- Real scenarios for Indian users
- Regulatory considerations

**Response Format (JSON):**
{
  "title": "Comparison title",
  "content": "Full article in Markdown",
  "comparisonTable": [
    {"criteria": "Interest Rate", "option1": "...", "option2": "..."},
    ...
  ],
  "verdict": "Summary recommendation"
}`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: this.systemPrompt },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 3000,
            response_format: { type: 'json_object' }
        });

        const content = response.choices[0].message.content || '{}';
        return JSON.parse(content);
    }
}

// Singleton export
export const authorAI = new AuthorAI();
