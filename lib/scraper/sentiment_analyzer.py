"""
Sentiment Analysis for Product Reviews
Uses OpenAI API to analyze review sentiment and extract insights
"""

import os
import json
from typing import List, Dict
from datetime import datetime
from openai import OpenAI

class ReviewAnalyzer:
    def __init__(self, api_key: str = None):
        self.client = OpenAI(api_key=api_key or os.getenv('OPENAI_API_KEY'))
    
    def analyze_sentiment(self, review_text: str, source_url: str = None) -> Dict:
        """
        Analyze sentiment of a single review
        Returns: sentiment (positive/negative/neutral) and confidence score
        
        AI Constraints:
        - Only analyzes sentiment (allowed operation)
        - Does NOT recommend or rank products
        - Uses factual analysis only
        """
        prompt = f"""Analyze the sentiment of this financial product review.
        
IMPORTANT: You are ONLY analyzing sentiment. Do NOT recommend products or provide financial advice.

Review: "{review_text}"

Respond in JSON format:
{{
    "sentiment": "positive" | "negative" | "neutral",
    "confidence": 0.0-1.0,
    "key_points": ["point1", "point2"],
    "concerns": ["concern1"] (if any),
    "data_source": "{source_url or 'scraped_review'}",
    "analysis_timestamp": "{datetime.now().isoformat()}"
}}"""

        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a financial product review analyzer. You ONLY analyze sentiment. You do NOT recommend products, rank products, or provide financial advice. Be concise and accurate."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.3
            )
            
            result = json.loads(response.choices[0].message.content)
            # Add metadata with data sources and confidence
            result['ai_operation'] = 'sentiment_analysis'
            result['data_sources'] = [{
                "source_type": "scraped",
                "source_name": "Product Review",
                "source_url": source_url,
                "last_verified": datetime.now().isoformat(),
                "confidence": result.get('confidence', 0.7)
            }]
            result['generated_at'] = datetime.now().isoformat()
            result['requires_review'] = False  # Sentiment analysis is low-risk
            result['change_log'] = [{
                "timestamp": datetime.now().isoformat(),
                "change_type": "created",
                "changed_by": "ai",
                "changes": ["Sentiment analysis performed"]
            }]
            return result
            
        except Exception as e:
            print(f"Error analyzing sentiment: {e}")
            return {
                "sentiment": "neutral",
                "confidence": 0.0,
                "key_points": [],
                "concerns": []
            }
    
    def analyze_bulk_reviews(self, reviews: List[Dict]) -> Dict:
        """
        Analyze multiple reviews and generate aggregate insights
        """
        sentiments = []
        all_key_points = []
        all_concerns = []
        
        for review in reviews[:20]:  # Limit to avoid API costs
            analysis = self.analyze_sentiment(review['text'])
            sentiments.append(analysis['sentiment'])
            all_key_points.extend(analysis.get('key_points', []))
            all_concerns.extend(analysis.get('concerns', []))
        
        # Calculate sentiment distribution
        sentiment_counts = {
            'positive': sentiments.count('positive'),
            'negative': sentiments.count('negative'),
            'neutral': sentiments.count('neutral')
        }
        
        total = len(sentiments)
        sentiment_percentages = {
            k: round((v / total) * 100, 1) if total > 0 else 0
            for k, v in sentiment_counts.items()
        }
        
        return {
            'total_analyzed': len(sentiments),
            'sentiment_distribution': sentiment_percentages,
            'overall_sentiment': max(sentiment_counts, key=sentiment_counts.get),
            'common_praises': self._get_top_mentions(all_key_points, 5),
            'common_complaints': self._get_top_mentions(all_concerns, 5)
        }
    
    def _get_top_mentions(self, items: List[str], top_n: int = 5) -> List[Dict]:
        """Get most frequently mentioned items"""
        from collections import Counter
        
        # Simple frequency count (in production, use semantic similarity)
        counter = Counter(items)
        return [
            {"text": item, "count": count}
            for item, count in counter.most_common(top_n)
        ]
    
    def generate_product_summary(self, product_name: str, reviews: List[Dict], source_url: str = None) -> Dict:
        """
        Generate AI summary of product based on reviews
        
        AI Constraints:
        - Only summarizes factual data from reviews (allowed operation: summarize_factual_data)
        - Does NOT recommend or rank products
        - Uses neutral, informative language only
        - Includes data sources and confidence metadata
        """
        # Combine review texts
        review_sample = "\n".join([r['text'][:200] for r in reviews[:10]])
        
        # Build data sources metadata
        data_sources = [{
            "source_type": "scraped",
            "source_name": "User Reviews",
            "source_url": source_url,
            "last_verified": datetime.now().isoformat(),
            "confidence": 0.7  # User reviews are less reliable than official data
        }]
        
        prompt = f"""Summarize factual information from user reviews for {product_name}.

IMPORTANT CONSTRAINTS:
- You are ONLY summarizing factual data from reviews
- Do NOT recommend products, rank products, or provide financial advice
- Use neutral, informative language only
- Base summary ONLY on the provided review data

Reviews:
{review_sample}

Write a 2-3 sentence summary highlighting:
1. Overall user sentiment (factual observation)
2. Main strengths mentioned by users (factual)
3. Key concerns mentioned by users (factual)

Respond in JSON format:
{{
    "summary": "...",
    "data_sources": {json.dumps(data_sources)},
    "confidence": 0.0-1.0,
    "generated_at": "{datetime.now().isoformat()}"
}}"""

        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system", 
                        "content": "You are a financial product review summarizer. You ONLY summarize factual data from reviews. You do NOT recommend products, rank products, or provide financial advice. Use neutral, informative language only."
                    },
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.3,  # Lower temperature for more factual output
                max_tokens=200
            )
            
            result = json.loads(response.choices[0].message.content)
            # Add metadata
            result['ai_operation'] = 'summarize_factual_data'
            result['data_sources'] = data_sources
            result['requires_review'] = True
            result['forbidden_phrases_found'] = []  # Would be populated by validation
            
            return result
            
        except Exception as e:
            print(f"Error generating summary: {e}")
            return {
                "summary": f"User reviews for {product_name} are available. More analysis needed.",
                "data_sources": data_sources,
                "confidence": 0.0,
                "generated_at": datetime.now().isoformat(),
                "ai_operation": "summarize_factual_data",
                "requires_review": True,
                "error": str(e)
            }


# Example usage
if __name__ == "__main__":
    # Load reviews from scraper output
    with open('reviews_hdfc_regalia.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Combine all reviews
    all_reviews = []
    for source, reviews in data['sources'].items():
        all_reviews.extend(reviews)
    
    # Analyze
    analyzer = ReviewAnalyzer()
    
    # Bulk analysis
    insights = analyzer.analyze_bulk_reviews(all_reviews)
    print("Sentiment Analysis:")
    print(json.dumps(insights, indent=2))
    
    # Generate summary
    summary = analyzer.generate_product_summary("HDFC Regalia Gold", all_reviews)
    print(f"\nAI Summary:\n{summary}")
