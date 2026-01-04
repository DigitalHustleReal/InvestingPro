import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

/**
 * Social Media Content Generator
 * Creates platform-specific posts for AI personas
 */
export class SocialMediaGenerator {
    
    /**
     * Generate LinkedIn post
     */
    async generateLinkedInPost(params: {
        persona: 'arjun' | 'rajesh';
        topic: string;
        style?: 'educational' | 'thought-leadership' | 'news-commentary';
        includeLink?: boolean;
        linkUrl?: string;
    }): Promise<{
        post: string;
        hashtags: string[];
        cta: string;
    }> {
        const systemPrompt = params.persona === 'arjun' 
            ? this.getArjunSystemPrompt()
            : this.getRajeshSystemPrompt();
        
        const prompt = `Create a LinkedIn post about: "${params.topic}"

**Style:** ${params.style || 'educational'}
**Include link:** ${params.includeLink ? 'Yes' : 'No'}
${params.linkUrl ? `**Link:** ${params.linkUrl}` : ''}

**Requirements:**
1. **Hook:** Start with attention-grabbing question or statement
2. **Body:** 150-200 words, use line breaks for readability
3. **Value:** Provide actionable insights
4. **Emojis:** Use 2-3 relevant emojis (✅, 💰, 📊, etc.)
5. **Call-to-Action:** Engage readers (comment, share, click link)
6. **Hashtags:** 3-5 relevant hashtags
7. **Link:** If provided, integrate naturally at end

**Format (JSON):**
{
  "post": "Full post text with line breaks as \\n",
  "hashtags": ["PersonalFinance", "FinanceTips", ...],
  "cta": "Specific call-to-action"
}`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt }
            ],
            temperature: 0.8,
            max_tokens: 800,
            response_format: { type: 'json_object' }
        });

        const content = response.choices[0].message.content || '{}';
        return JSON.parse(content);
    }

    /**
     * Generate Twitter thread
     */
    async generateTwitterThread(params: {
        persona: 'arjun' | 'rajesh';
        topic: string;
        tweetCount?: number;
        includeLink?: boolean;
        linkUrl?: string;
    }): Promise<{
        tweets: string[];
        hashtags: string[];
    }> {
        const systemPrompt = params.persona === 'arjun' 
            ? this.getArjunSystemPrompt()
            : this.getRajeshSystemPrompt();
        
        const tweetCount = params.tweetCount || 5;
        
        const prompt = `Create a Twitter thread about: "${params.topic}"

**Thread Length:** ${tweetCount} tweets
**Include link:** ${params.includeLink ? 'Yes' : 'No'}
${params.linkUrl ? `**Link:** ${params.linkUrl}` : ''}

**Requirements:**
1. Tweet 1: Hook + "🧵 THREAD:" indicator
2. Tweets 2-${tweetCount-1}: Numbered points (1/, 2/, 3/, etc.)
3. Each tweet < 280 characters
4. Final tweet: Call-to-action + link (if provided)
5. Use emojis strategically
6. Make each tweet valuable standalone

**Format (JSON):**
{
  "tweets": ["Tweet 1", "Tweet 2", ...],
  "hashtags": ["PersonalFinance", "FinanceTips"]
}`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt }
            ],
            temperature: 0.8,
            max_tokens: 1000,
            response_format: { type: 'json_object' }
        });

        const content = response.choices[0].message.content || '{}';
        return JSON.parse(content);
    }

    /**
     * Generate Instagram carousel content
     */
    async generateInstagramCarousel(params: {
        topic: string;
        slideCount?: number;
        includeLink?: boolean;
    }): Promise<{
        slides: Array<{ title: string; content: string }>;
        caption: string;
        hashtags: string[];
    }> {
        const slideCount = params.slideCount || 7;
        
        const prompt = `Create Instagram carousel content about: "${params.topic}"

**Slides:** ${slideCount} total (including title and CTA slides)
**Include link:** ${params.includeLink ? 'Yes' : 'No'}

**Structure:**
- Slide 1: Eye-catching title (3-5 words)
- Slides 2-${slideCount-1}: One tip per slide (title + 2-3 line explanation)
- Final Slide: CTA ("Full details on InvestingPro [link in bio]")

**Each Slide:**
- Title: Bold, attention-grabbing (use emojis)
- Content: Brief, actionable (2-3 lines max)
- Visual-friendly (imagine text on clean background)

**Caption:**
- 100-150 words
- Summarize key points
- Include 3-5 emojis
- Call-to-action
- Link in bio mention

**Format (JSON):**
{
  "slides": [
    {"title": "Slide title", "content": "Slide content"}
  ],
  "caption": "Instagram caption",
  "hashtags": ["PersonalFinance", ...]
}`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: this.getArjunSystemPrompt() },
                { role: 'user', content: prompt }
            ],
            temperature: 0.8,
            max_tokens: 1500,
            response_format: { type: 'json_object' }
        });

        const content = response.choices[0].message.content || '{}';
        return JSON.parse(content);
    }

    /**
     * Generate quick tip (single tweet/post)
     */
    async generateQuickTip(params: {
        persona: 'arjun' | 'rajesh';
        category: string;
        platform: 'twitter' | 'instagram-story';
    }): Promise<string> {
        const systemPrompt = params.persona === 'arjun' 
            ? this.getArjunSystemPrompt()
            : this.getRajeshSystemPrompt();
        
        const charLimit = params.platform === 'twitter' ? 280 : 150;
        
        const prompt = `Create a quick finance tip for ${params.category}

**Platform:** ${params.platform}
**Character Limit:** ${charLimit}

**Requirements:**
- Start with emoji
- One actionable tip
- Specific number/example
- Engaging & shareable

Example: "💡 Pro Tip: Keep credit card usage below 30% of limit. If you have ₹1L limit, spend max ₹30k to maintain good CIBIL score!"`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt }
            ],
            temperature: 0.9,
            max_tokens: 200
        });

        return response.choices[0].message.content || '';
    }

    /**
     * Batch generate social media content for week
     */
    async generateWeeklyContent(persona: 'arjun' | 'rajesh'): Promise<{
        linkedin: any[];
        twitter: any[];
        instagram: any[];
    }> {
        console.log(`\n📅 Generating weekly content for ${persona.toUpperCase()}...`);
        
        const topics = [
            'Credit Card Rewards Optimization',
            'EMI vs Lump Sum Payment',
            'Tax Saving Under Section 80C',
            'Fixed Deposit vs Debt Mutual Funds',
            'Insurance Coverage Calculation'
        ];
        
        const linkedin = [];
        const twitter = [];
        const instagram = [];
        
        // Generate LinkedIn posts (3 per week)
        for (let i = 0; i < 3; i++) {
            const post = await this.generateLinkedInPost({
                persona,
                topic: topics[i],
                style: 'educational',
                includeLink: true,
                linkUrl: `investingpro.in/article/${topics[i].toLowerCase().replace(/ /g, '-')}`
            });
            linkedin.push({ day: ['Monday', 'Wednesday', 'Friday'][i], ...post });
            await new Promise(r => setTimeout(r, 2000)); // Rate limit
        }
        
        // Generate Twitter threads (2 per week)
        for (let i = 0; i < 2; i++) {
            const thread = await this.generateTwitterThread({
                persona,
                topic: topics[i + 3],
                tweetCount: 6,
                includeLink: true
            });
            twitter.push({ day: ['Tuesday', 'Saturday'][i], ...thread });
            await new Promise(r => setTimeout(r, 2000));
        }
        
        // Generate Instagram carousels (if Arjun - 4 per week)
        if (persona === 'arjun') {
            for (let i = 0; i < 4; i++) {
                const carousel = await this.generateInstagramCarousel({
                    topic: topics[i],
                    slideCount: 8,
                    includeLink: true
                });
                instagram.push({ day: ['Monday', 'Wednesday', 'Friday', 'Sunday'][i], ...carousel });
                await new Promise(r => setTimeout(r, 2000));
            }
        }
        
        console.log('✅ Weekly content generated!');
        console.log(`   LinkedIn: ${linkedin.length} posts`);
        console.log(`   Twitter: ${twitter.length} threads`);
        console.log(`   Instagram: ${instagram.length} carousels`);
        
        return { linkedin, twitter, instagram };
    }

    /**
     * Arjun's system prompt
     */
    private getArjunSystemPrompt(): string {
        return `You are Arjun Sharma, a relatable finance expert who makes complex topics simple for everyday Indians.

Writing Style:
- Conversational, friendly tone
- Use "you" and address readers directly
- Include relatable examples with Indian names
- Use ₹ for all amounts
- Reference Indian banks and products
- Use emojis strategically (2-3 per post)

Expertise:
- Credit cards, loans, investments, insurance
- Tax planning for salaried individuals
- Banking products (FD, RD, savings accounts)

Mission: Help Indians make better financial decisions through simple, actionable advice.`;
    }

    /**
     * Rajesh's system prompt
     */
    private getRajeshSystemPrompt(): string {
        return `You are Rajesh Mehta, CFA, an authoritative voice on financial compliance and industry trends.

Writing Style:
- Professional, authoritative tone
- Data-driven insights
- Reference regulations (RBI, SEBI, IRDAI)
- Industry commentary
- Fact-based analysis

Expertise:
- Regulatory frameworks
- Financial product analysis
- Industry trends
- Compliance and best practices

Mission: Provide accurate, well-researched financial information that builds trust and authority.`;
    }
}

// Singleton export
export const socialMediaGenerator = new SocialMediaGenerator();
