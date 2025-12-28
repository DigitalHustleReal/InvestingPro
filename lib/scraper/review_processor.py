"""
Review Processor with Sentiment Analysis and Scoring
Processes scraped reviews, analyzes sentiment, categorizes, and scores products
"""

import os
import json
from typing import Dict, List, Optional
from datetime import datetime
from dotenv import load_dotenv
from supabase import create_client, Client
from sentiment_analyzer import ReviewAnalyzer
from review_scraper import ReviewScraper

load_dotenv()

class ReviewProcessor:
    def __init__(self):
        self.supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
        self.supabase: Optional[Client] = None
        
        if self.supabase_url and self.supabase_key:
            try:
                self.supabase = create_client(self.supabase_url, self.supabase_key)
                print("✓ Supabase client initialized")
            except Exception as e:
                print(f"⚠ Warning: Could not initialize Supabase: {e}")
        
        self.scraper = ReviewScraper()
        self.analyzer = ReviewAnalyzer()
    
    def process_product_reviews(self, product_id: str, product_name: str, company_name: str = None):
        """
        Complete review processing pipeline:
        1. Scrape reviews from all sources
        2. Analyze sentiment for each review
        3. Categorize reviews
        4. Calculate aggregate scores
        5. Save to database
        """
        print(f"\n{'='*60}")
        print(f"Processing Reviews: {product_name}")
        print(f"{'='*60}")
        
        # Step 1: Scrape reviews
        print("Step 1: Scraping reviews...")
        reviews_data = self.scraper.scrape_all_sources(product_name, company_name)
        
        all_reviews = []
        for source, reviews in reviews_data['sources'].items():
            all_reviews.extend(reviews)
        
        if not all_reviews:
            print("  ⚠ No reviews found")
            return
        
        print(f"  ✓ Found {len(all_reviews)} reviews")
        
        # Step 2: Analyze sentiment and categorize
        print("Step 2: Analyzing sentiment and categorizing...")
        processed_reviews = []
        
        for review in all_reviews[:100]:  # Limit to 100 for cost control
            try:
                # Analyze sentiment
                sentiment = self.analyzer.analyze_sentiment(review.get('text', ''))
                
                # Categorize review
                category = self._categorize_review(review.get('text', ''))
                
                # Extract pros/cons
                pros, cons = self._extract_pros_cons(review.get('text', ''))
                
                processed_review = {
                    'product_id': product_id,
                    'product_type': self._get_product_type(product_id),
                    'user_name': review.get('author', 'Anonymous'),
                    'rating': review.get('rating') or self._rating_from_sentiment(sentiment),
                    'title': self._generate_title(review.get('text', '')),
                    'review_text': review.get('text', '')[:1000],  # Limit length
                    'pros': pros,
                    'cons': cons,
                    'sentiment': sentiment.get('sentiment', 'neutral'),
                    'sentiment_confidence': sentiment.get('confidence', 0.5),
                    'category': category,
                    'source': review.get('source', 'unknown'),
                    'status': 'approved',  # Auto-approve for now
                    'helpful_count': review.get('upvotes', 0),
                    'created_at': review.get('date', datetime.now().isoformat())
                }
                
                processed_reviews.append(processed_review)
                
            except Exception as e:
                print(f"  ⚠ Error processing review: {e}")
                continue
        
        print(f"  ✓ Processed {len(processed_reviews)} reviews")
        
        # Step 3: Calculate aggregate scores
        print("Step 3: Calculating aggregate scores...")
        aggregate_scores = self._calculate_aggregate_scores(processed_reviews)
        
        # Step 4: Save to database
        print("Step 4: Saving to database...")
        self._save_reviews_to_db(processed_reviews)
        self._update_product_scores(product_id, aggregate_scores)
        
        print(f"\n✓ Review processing complete!")
        print(f"  Total Reviews: {len(processed_reviews)}")
        print(f"  Average Rating: {aggregate_scores.get('average_rating', 0):.1f}/5.0")
        print(f"  Overall Sentiment: {aggregate_scores.get('overall_sentiment', 'neutral')}")
    
    def _categorize_review(self, text: str) -> str:
        """
        Categorize review into: fees, rewards, service, approval, other
        """
        text_lower = text.lower()
        
        if any(word in text_lower for word in ['fee', 'charge', 'cost', 'price']):
            return 'fees'
        elif any(word in text_lower for word in ['reward', 'cashback', 'point', 'mile']):
            return 'rewards'
        elif any(word in text_lower for word in ['service', 'support', 'customer', 'help']):
            return 'service'
        elif any(word in text_lower for word in ['approval', 'approve', 'reject', 'application']):
            return 'approval'
        else:
            return 'other'
    
    def _extract_pros_cons(self, text: str) -> tuple:
        """
        Extract pros and cons from review text using AI
        """
        try:
            # Use AI to extract pros/cons
            prompt = f"""Extract pros and cons from this review. Return JSON:
{{
    "pros": ["pro1", "pro2"],
    "cons": ["con1", "con2"]
}}

Review: {text[:500]}"""
            
            response = self.analyzer.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "Extract pros and cons from reviews. Return JSON only."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.3
            )
            
            result = json.loads(response.choices[0].message.content)
            return (result.get('pros', []), result.get('cons', []))
        except:
            return ([], [])
    
    def _rating_from_sentiment(self, sentiment: Dict) -> int:
        """Convert sentiment to rating (1-5)"""
        sentiment_type = sentiment.get('sentiment', 'neutral')
        confidence = sentiment.get('confidence', 0.5)
        
        if sentiment_type == 'positive':
            return min(5, max(4, int(3 + confidence * 2)))
        elif sentiment_type == 'negative':
            return max(1, int(3 - confidence * 2))
        else:
            return 3
    
    def _generate_title(self, text: str) -> str:
        """Generate a title from review text"""
        # Take first sentence or first 50 chars
        sentences = text.split('.')
        if sentences and len(sentences[0]) > 10:
            title = sentences[0].strip()
            return title[:100] if len(title) > 100 else title
        return text[:100] if len(text) > 100 else text
    
    def _calculate_aggregate_scores(self, reviews: List[Dict]) -> Dict:
        """Calculate aggregate scores from reviews"""
        if not reviews:
            return {}
        
        ratings = [r['rating'] for r in reviews if r.get('rating')]
        sentiments = [r['sentiment'] for r in reviews]
        
        # Rating distribution
        rating_dist = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        for rating in ratings:
            if 1 <= rating <= 5:
                rating_dist[int(rating)] += 1
        
        # Sentiment distribution
        sentiment_counts = {
            'positive': sentiments.count('positive'),
            'negative': sentiments.count('negative'),
            'neutral': sentiments.count('neutral')
        }
        
        total = len(sentiments)
        overall_sentiment = max(sentiment_counts, key=sentiment_counts.get) if total > 0 else 'neutral'
        
        # Category scores
        category_scores = {}
        for category in ['fees', 'rewards', 'service', 'approval']:
            category_reviews = [r for r in reviews if r.get('category') == category]
            if category_reviews:
                avg_rating = sum(r['rating'] for r in category_reviews) / len(category_reviews)
                category_scores[category] = round(avg_rating, 2)
        
        return {
            'total_reviews': len(reviews),
            'average_rating': round(sum(ratings) / len(ratings), 2) if ratings else 0,
            'rating_distribution': rating_dist,
            'overall_sentiment': overall_sentiment,
            'sentiment_distribution': {
                k: round((v / total) * 100, 1) if total > 0 else 0
                for k, v in sentiment_counts.items()
            },
            'category_scores': category_scores
        }
    
    def _save_reviews_to_db(self, reviews: List[Dict]):
        """Save processed reviews to Supabase"""
        if not self.supabase or not reviews:
            return
        
        try:
            # Insert in batches
            batch_size = 50
            for i in range(0, len(reviews), batch_size):
                batch = reviews[i:i + batch_size]
                
                # Remove None values
                clean_batch = []
                for review in batch:
                    clean_review = {k: v for k, v in review.items() if v is not None}
                    clean_batch.append(clean_review)
                
                self.supabase.table('reviews').upsert(
                    clean_batch,
                    on_conflict='product_id,user_name,created_at'
                ).execute()
            
            print(f"  ✓ Saved {len(reviews)} reviews to database")
        except Exception as e:
            print(f"  ✗ Error saving reviews: {e}")
    
    def _update_product_scores(self, product_id: str, scores: Dict):
        """Update product with aggregate review scores"""
        if not self.supabase:
            return
        
        try:
            # Update products table with review metadata
            update_data = {
                'metadata': {
                    'review_stats': scores,
                    'last_review_update': datetime.now().isoformat()
                },
                'last_updated_at': datetime.now().isoformat()
            }
            
            # Try to update via products table
            self.supabase.table('products').update(update_data).eq('id', product_id).execute()
            
            # Also update rating if available
            if scores.get('average_rating'):
                # Update in type-specific table if needed
                pass
            
            print(f"  ✓ Updated product scores")
        except Exception as e:
            print(f"  ✗ Error updating product scores: {e}")
    
    def _get_product_type(self, product_id: str) -> str:
        """Determine product type from product_id"""
        if 'cc_' in product_id or 'credit' in product_id.lower():
            return 'credit_card'
        elif 'mf_' in product_id or 'mutual' in product_id.lower():
            return 'mutual_fund'
        elif 'loan_' in product_id:
            return 'personal_loan'
        return 'unknown'
    
    def process_all_products(self):
        """Process reviews for all products in database"""
        if not self.supabase:
            print("⚠ Supabase not initialized")
            return
        
        try:
            # Get all active products
            products = self.supabase.table('products').select('id,name,provider,product_type').eq('is_active', True).limit(100).execute()
            
            if not products.data:
                print("No products found in database")
                return
            
            print(f"\nFound {len(products.data)} products to process")
            
            for product in products.data:
                try:
                    self.process_product_reviews(
                        product_id=product['id'],
                        product_name=product['name'],
                        company_name=product.get('provider')
                    )
                    time.sleep(5)  # Rate limiting between products
                except Exception as e:
                    print(f"Error processing {product['name']}: {e}")
                    continue
        
        except Exception as e:
            print(f"Error fetching products: {e}")


if __name__ == "__main__":
    import time
    processor = ReviewProcessor()
    processor.process_all_products()

