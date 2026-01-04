import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

/**
 * AI Editor Persona: "Rajesh Mehta"
 * Chief Content Editor & Fact-Checker specialized in financial compliance
 */
export class EditorAI {
    private systemPrompt = `You are Rajesh Mehta, Chief Content Editor with 12+ years in financial publishing and a CFA charter. You've edited thousands of financial articles for leading publications and understand both regulatory compliance and user engagement.

**Your Mission:**
Transform good content into exceptional, accurate, user-friendly content that ranks well and builds trust.

**Editing Priorities (in order):**
1. **Accuracy**: Facts, numbers, regulations MUST be correct
2. **Clarity**: Users must understand easily
3. **Compliance**: No misleading claims, proper disclaimers
4. **Engagement**: Keep readers interested
5. **SEO**: Optimize for search without compromising quality

**What You Check:**

**1. Factual Accuracy**
- Are interest rates current and realistic?
- Are bank names spelled correctly?
- Do calculations add up?
- Are regulations cited correctly?
- Are examples realistic for Indian market?

**2. Regulatory Compliance**
- Any unsubstantiated claims? ("guaranteed returns", "best in India", "zero risk")
- Missing disclaimers? (mutual funds, insurance, market risks)
- Misleading language? ("risk-free", "100% safe", "assured returns")
- RBI/SEBI/IRDAI guideline violations?

**3. Clarity & Readability**
- Reading level: Grade 8-10 (Flesch-Kincaid)
- Sentence length: < 25 words
- Paragraph length: < 5 sentences
- Jargon explained or removed
- Examples clear and relevant

**4. SEO Optimization**
- Primary keyword in H1, first paragraph, conclusion
- Secondary keywords naturally integrated
- Meta description: 150-160 characters
- Internal linking opportunities
- Schema markup suggestions

**Your Feedback Format:**
Categorize all feedback as:
1. **CRITICAL** (must fix): Factual errors, compliance issues, misleading claims
2. **MAJOR** (should fix): Clarity problems, structural issues, major SEO gaps
3. **MINOR** (nice to have): Tone improvements, polish, engagement tweaks
4. **APPROVED** (keep as-is): Sections that are excellent

**Tone:**
- Constructive, never harsh
- Specific, not vague
- Educational (explain WHY changes matter)
- Encouraging (highlight what works well)

You edit to elevate content while respecting the author's voice and expertise.`;

    /**
     * Review and edit glossary term
     */
    async reviewGlossaryTerm(draft: {
        term: string;
        definition: string;
        detailedExplanation: string;
        example: string;
        relatedTerms: string[];
        searchKeywords: string[];
    }): Promise<{
        status: 'approved' | 'needs_revision' | 'rejected';
        criticalIssues: string[];
        majorImprovements: string[];
        minorSuggestions: string[];
        editedVersion: typeof draft;
        complianceNotes: string[];
    }> {
        const prompt = `Review this glossary term draft and provide editorial feedback.

**Draft Content:**
Term: ${draft.term}
Definition: ${draft.definition}
Detailed Explanation: ${draft.detailedExplanation}
Example: ${draft.example}
Related Terms: ${draft.relatedTerms.join(', ')}
Keywords: ${draft.searchKeywords.join(', ')}

**Your Task:**
1. Check for factual accuracy
2. Verify regulatory compliance
3. Assess clarity and readability
4. Identify SEO improvements
5. Provide edited version

**Check for:**
- Incorrect facts or outdated information
- Misleading claims ("guaranteed", "risk-free", "best")
- Missing disclaimers
- Complex jargon unexplained
- Unrealistic examples
- Poor keyword integration

**Response Format (JSON):**
{
  "status": "approved|needs_revision|rejected",
  "criticalIssues": ["Issue 1: description", ...],
  "majorImprovements": ["Improvement 1: description", ...],
  "minorSuggestions": ["Suggestion 1: description", ...],
  "editedVersion": {
    "term": "...",
    "definition": "improved version",
    "detailedExplanation": "improved version",
    "example": "improved version",
    "relatedTerms": [...],
    "searchKeywords": [...]
  },
  "complianceNotes": ["Add disclaimer about...", ...]
}`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: this.systemPrompt },
                { role: 'user', content: prompt }
            ],
            temperature: 0.3, // Lower temperature for more consistent editing
            max_tokens: 2500,
            response_format: { type: 'json_object' }
        });

        const content = response.choices[0].message.content || '{}';
        return JSON.parse(content);
    }

    /**
     * Review and edit blog post
     */
    async reviewBlogPost(draft: {
        title: string;
        excerpt: string;
        content: string;
        metaDescription: string;
        metaKeywords: string[];
    }, targetKeywords: string[]): Promise<{
        status: 'approved' | 'needs_major_revision' | 'needs_minor_revision';
        overallScore: number; // 0-100
        criticalIssues: Array<{ issue: string; location: string; fix: string }>;
        majorImprovements: Array<{ area: string; current: string; suggested: string }>;
        minorSuggestions: string[];
        seoScore: {
            keywordOptimization: number;
            readability: number;
            structure: number;
            metaQuality: number;
        };
        complianceCheck: {
            passed: boolean;
            warnings: string[];
            requiredDisclaimers: string[];
        };
        editedVersion: typeof draft;
    }> {
        const prompt = `Comprehensively review this blog post draft.

**Draft:**
Title: ${draft.title}
Excerpt: ${draft.excerpt}
Meta Description: ${draft.metaDescription}
Target Keywords: ${targetKeywords.join(', ')}

**Content:**
${draft.content.substring(0, 3000)}... [truncated for brevity]

**Review Checklist:**
1. **Factual Accuracy**
   - Verify all claims, numbers, rates
   - Check realistic examples
   - Confirm regulatory references

2. **Compliance**
   - No "guaranteed returns" or similar claims
   - Proper disclaimers for investments/insurance
   - No misleading language

3. **Clarity**
   - Reading level appropriate (Grade 8-10)
   - Jargon explained
   - Logical flow

4. **SEO**
   - Keywords integrated naturally
   - Meta description optimized
   - Heading structure (H2, H3)
   - Title tag optimized

5. **Engagement**
   - Strong hook
   - Actionable tips
   - Relatable examples

**Provide comprehensive feedback in JSON format with scores, issues, and edited version.**`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: this.systemPrompt },
                { role: 'user', content: prompt }
            ],
            temperature: 0.3,
            max_tokens: 4000,
            response_format: { type: 'json_object' }
        });

        const content = response.choices[0].message.content || '{}';
        return JSON.parse(content);
    }

    /**
     * Fact-check specific claim
     */
    async factCheck(claim: string, context: string): Promise<{
        isAccurate: boolean;
        confidence: number; // 0-100
        explanation: string;
        sources: string[];
        suggestedCorrection?: string;
        disclaimer?: string;
    }> {
        const prompt = `Fact-check this financial claim for the Indian market.

**Claim:** "${claim}"
**Context:** ${context}

**Your Task:**
1. Assess accuracy based on current Indian financial regulations
2. Consider RBI/SEBI/IRDAI guidelines
3. Check against common Indian banking/insurance practices
4. Provide confidence level (0-100%)
5. Suggest correction if inaccurate
6. Recommend disclaimer if needed

**Response Format (JSON):**
{
  "isAccurate": true/false,
  "confidence": 0-100,
  "explanation": "Detailed reasoning",
  "sources": ["RBI guideline XYZ", "Common practice in Indian banks"],
  "suggestedCorrection": "If inaccurate, the correct statement",
  "disclaimer": "If needed, suggested disclaimer text"
}`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: this.systemPrompt },
                { role: 'user', content: prompt }
            ],
            temperature: 0.2, // Very low for fact-checking
            max_tokens: 1000
        });

        const content = response.choices[0].message.content || '{}';
        return JSON.parse(content);
    }

    /**
     * Generate compliance disclaimer
     */
    async generateDisclaimer(contentType: 'mutual-funds' | 'insurance' | 'loans' | 'investments' | 'general'): Promise<string> {
        const disclaimers = {
            'mutual-funds': 'Mutual fund investments are subject to market risks. Please read all scheme-related documents carefully before investing. Past performance is not indicative of future returns.',
            'insurance': 'Insurance is a subject matter of solicitation. For more details on risk factors, terms and conditions, please read the sales brochure carefully before concluding a sale.',
            'loans': 'Loan approval is subject to the applicant meeting eligibility criteria. Interest rates and charges are subject to change. Please verify current rates with the lender.',
            'investments': 'Investments in securities market are subject to market risks. Please read all the related documents carefully before investing.',
            'general': 'The information provided is for educational purposes only and should not be considered as financial advice. Please consult a certified financial advisor before making investment decisions.'
        };

        return disclaimers[contentType] || disclaimers.general;
    }

    /**
     * Quick quality score
     */
    async quickScore(content: string): Promise<{
        overallScore: number;
        readabilityScore: number;
        accuracyRisk: 'low' | 'medium' | 'high';
        complianceRisk: 'low' | 'medium' | 'high';
        recommendations: string[];
    }> {
        const prompt = `Quickly score this financial content (first 500 words shown):

${content.substring(0, 2000)}

**Provide scores and risk assessment in JSON:**
{
  "overallScore": 0-100,
  "readabilityScore": 0-100 (Flesch-Kincaid equivalent),
  "accuracyRisk": "low|medium|high",
  "complianceRisk": "low|medium|high",
  "recommendations": ["Quick suggestion 1", "Quick suggestion 2", ...]
}`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: this.systemPrompt },
                {role: 'user', content: prompt }
            ],
            temperature: 0.3,
            max_tokens: 500,
            response_format: { type: 'json_object' }
        });

        const content_response = response.choices[0].message.content || '{}';
        return JSON.parse(content_response);
    }
}

// Singleton export
export const editorAI = new EditorAI();
