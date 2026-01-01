
import { api } from '@/lib/api';
import { logger } from '@/lib/logger';

export interface SocialPosts {
    twitter_thread: string[];
    linkedin_post: string;
    instagram_caption: string;
    generated_at: string;
}

export async function generateSocialPosts(
    title: string, 
    content: string, 
    sourceUrl?: string
): Promise<SocialPosts> {
    try {
        const linkPlaceholder = sourceUrl ? `[Read here: ${sourceUrl}]` : `[Link in Bio]`;

        const prompt = `
You are the Social Media Lead for InvestingPro.in, India's premium financial terminal.

TASK: Generate high-engagement social media assets for a new article.

ARTICLE DATA:
Title: "${title}"
Content (Excerpt):
${content.substring(0, 4000)}

GUIDELINES:
- Audience: Smart Indian Investors (25-45 yo).
- Tone: Professional, Insightful, yet punchy. No cringe emojis.
- Hashtags: Use relevant tags like #InvestingPro #Nifty #PersonalFinance.

OUTPUTS REQUIRED:
1. Twitter Thread (3-6 tweets)
   - Tweet 1: Strong hook, problem statement.
   - Tweets 2-5: Key value points / insights.
   - Last Tweet: CTA with placeholder "${linkPlaceholder}".
   
2. LinkedIn Post
   - Professional hook.
   - Space-separated paragraphs.
   - Bullet points for key takeaways.
   - Ending with question to drive engagement.
   - Link: "${linkPlaceholder}"

3. Instagram Caption
   - Engaging opening line.
   - "Save this post" reminder.
   - 3 Key takeaways.
   - 10-15 relevant hashtags.

Return PURE JSON in this format:
{
    "twitter_thread": ["string", "string"],
    "linkedin_post": "string",
    "instagram_caption": "string"
}
`;

        const response = await api.integrations.Core.InvokeLLM({
            prompt,
            operation: 'generate_social_posts',
            contextData: { title }
        });

        // Parse JSON safely
        const jsonStr = response.replace(/```json/g, '').replace(/```/g, '').trim();
        const posts = JSON.parse(jsonStr);

        return {
            twitter_thread: posts.twitter_thread || [],
            linkedin_post: posts.linkedin_post || '',
            instagram_caption: posts.instagram_caption || '',
            generated_at: new Date().toISOString()
        };

    } catch (error) {
        logger.error('Social Post Generation Failed', error as Error);
        // Return empty fallback
        return {
            twitter_thread: [],
            linkedin_post: '',
            instagram_caption: '',
            generated_at: new Date().toISOString()
        };
    }
}
