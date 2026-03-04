import { aiService } from '../ai-service';
import { logger } from '@/lib/logger';

export interface RawReview {
  userName: string;
  rating: number;
  title: string;
  content: string;
  date?: string;
}

export interface ModeratedReview extends RawReview {
  isSpam: boolean;
  moderatedContent: string;
  sentimentScore: number; // 0 to 1
  category: string;
  pros: string[];
  cons: string[];
}

export class ReviewModerator {
  /**
   * Moderates and structures a raw review using AI.
   */
  static async moderate(review: RawReview): Promise<ModeratedReview> {
    const prompt = `
      You are an expert financial product review moderator for InvestingPro.in.
      Your task is to analyze, clean, and categorize the following user review.

      **Review Data:**
      - User: ${review.userName}
      - Rating Provided: ${review.rating}/5
      - Title: ${review.title}
      - Content: ${review.content}

      **Instructions:**
      1. **Moderation**: Identify if this is spam, gibberish, or contains heavy profanity. If so, set isSpam to true.
      2. **Professionalism**: Clean up minor grammatical errors and formatting, but keep the original voice.
      3. **Sentiment**: Assign a sentiment score from 0 (very negative) to 1 (very positive).
      4. **Categorization**: Pick the most relevant category: 'Rewards', 'Travel', 'Service', 'Fees', 'Lifestyle', or 'General'.
      5. **Extraction**: Extract up to 3 specific Pros and 3 specific Cons mentioned in the text.

      **Return JSON format only:**
      {
        "isSpam": boolean,
        "moderatedContent": "string",
        "sentimentScore": number,
        "category": "string",
        "pros": ["string"],
        "cons": ["string"]
      }
    `;

    try {
      const responseText = await aiService.generate(prompt);
      const cleaned = responseText.replace(/```json|```/g, '').trim();
      const result = JSON.parse(cleaned);

      return {
        ...review,
        ...result,
        moderatedContent: result.moderatedContent || review.content
      };
    } catch (error) {
      logger.error('Moderation failed, returning raw review:', error);
      return {
        ...review,
        isSpam: false,
        moderatedContent: review.content,
        sentimentScore: review.rating / 5,
        category: 'General',
        pros: [],
        cons: []
      };
    }
  }

  /**
   * Bulk moderate reviews.
   */
  static async moderateBatch(reviews: RawReview[]): Promise<ModeratedReview[]> {
     const results = [];
     for (const review of reviews) {
       results.push(await this.moderate(review));
     }
     return results.filter(r => !r.isSpam);
  }
}
