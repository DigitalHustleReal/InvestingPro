"""
Automated Data Pipeline Orchestrator
Coordinates scraping, analysis, and database updates
"""

import json
import os
from datetime import datetime
from dotenv import load_dotenv
from review_scraper import ReviewScraper
from sentiment_analyzer import ReviewAnalyzer

# Load environment variables
load_dotenv()

class DataPipeline:
    def __init__(self, output_dir: str = "./data", use_supabase: bool = True):
        self.scraper = ReviewScraper()
        self.analyzer = ReviewAnalyzer()
        self.output_dir = output_dir
        self.use_supabase = use_supabase
        
        # Create output directory
        os.makedirs(output_dir, exist_ok=True)
        
        # Initialize Supabase writer if enabled
        if use_supabase:
            try:
                from supabase_writer import SupabaseWriter
                self.supabase_writer = SupabaseWriter()
                print("✓ Supabase writer initialized")
            except Exception as e:
                print(f"⚠ Warning: Could not initialize Supabase writer: {e}")
                print("  Continuing with file-based output only")
                self.use_supabase = False
                self.supabase_writer = None
        else:
            self.supabase_writer = None
    
    def process_product(self, product_name: str, company_name: str, product_id: str):
        """
        Complete pipeline for a single product:
        1. Scrape reviews
        2. Analyze sentiment
        3. Calculate scores
        4. Save to JSON (later: push to Supabase)
        """
        print(f"\n{'='*60}")
        print(f"Processing: {product_name}")
        print(f"{'='*60}")
        
        # Step 1: Scrape reviews
        print("Step 1: Scraping reviews...")
        reviews_data = self.scraper.scrape_all_sources(product_name, company_name)
        
        # Step 2: Analyze sentiment
        print("Step 2: Analyzing sentiment...")
        all_reviews = []
        for source, reviews in reviews_data['sources'].items():
            all_reviews.extend(reviews)
        
        if all_reviews:
            sentiment_analysis = self.analyzer.analyze_bulk_reviews(all_reviews)
            ai_summary = self.analyzer.generate_product_summary(product_name, all_reviews)
        else:
            sentiment_analysis = {"overall_sentiment": "neutral"}
            ai_summary = "No reviews available yet."
        
        # Step 3: Calculate aggregate rating
        ratings = [r['rating'] for r in all_reviews if r.get('rating')]
        avg_rating = round(sum(ratings) / len(ratings), 1) if ratings else 0.0
        
        # Step 4: Compile final data
        final_data = {
            "product_id": product_id,
            "product_name": product_name,
            "company_name": company_name,
            "updated_at": datetime.now().isoformat(),
            "review_stats": {
                "total_reviews": len(all_reviews),
                "average_rating": avg_rating,
                "rating_distribution": self._calculate_rating_distribution(all_reviews)
            },
            "sentiment_analysis": sentiment_analysis,
            "ai_summary": ai_summary,
            "raw_reviews": all_reviews[:50]  # Store top 50 reviews
        }
        
        # Step 5: Write to Supabase (if enabled)
        if self.use_supabase and self.supabase_writer:
            print("Step 5: Writing to Supabase...")
            try:
                # Write product data
                product_data = {
                    'name': product_name,
                    'slug': product_id,
                    'provider': company_name,
                    **final_data
                }
                
                # Determine category based on product type
                if 'credit' in product_id.lower() or 'card' in product_id.lower():
                    self.supabase_writer.write_credit_card(product_data)
                else:
                    self.supabase_writer.write_mutual_fund(product_data)
                
                # Write reviews
                if all_reviews:
                    self.supabase_writer.write_reviews(product_id, all_reviews)
                
                # Write analysis
                self.supabase_writer.write_product_analysis(final_data)
                
                print("  ✓ Data written to Supabase")
            except Exception as e:
                print(f"  ✗ Error writing to Supabase: {e}")
        
        # Step 6: Save to file (backup)
        filename = f"{self.output_dir}/{product_id}_analysis.json"
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(final_data, f, indent=2, ensure_ascii=False)
        
        print(f"✓ Saved analysis to {filename}")
        print(f"  Total Reviews: {len(all_reviews)}")
        print(f"  Avg Rating: {avg_rating}/5.0")
        print(f"  Sentiment: {sentiment_analysis.get('overall_sentiment', 'N/A')}")
        
        return final_data
    
    def _calculate_rating_distribution(self, reviews: list) -> dict:
        """Calculate how many 1-star, 2-star, etc. reviews"""
        distribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        
        for review in reviews:
            rating = review.get('rating')
            if rating and 1 <= rating <= 5:
                distribution[int(rating)] += 1
        
        return distribution
    
    def process_all_credit_cards(self):
        """
        Process all credit cards from your data.ts file
        """
        # List of products to process
        products = [
            {
                "id": "cc_hdfc_regalia_gold",
                "name": "HDFC Regalia Gold",
                "company": "HDFC Bank"
            },
            {
                "id": "cc_sbi_cashback",
                "name": "SBI Cashback Card",
                "company": "SBI Card"
            },
            {
                "id": "cc_axis_ace",
                "name": "Axis Ace Credit Card",
                "company": "Axis Bank"
            }
        ]
        
        results = []
        for product in products:
            try:
                result = self.process_product(
                    product_name=product['name'],
                    company_name=product['company'],
                    product_id=product['id']
                )
                results.append(result)
            except Exception as e:
                print(f"Error processing {product['name']}: {e}")
        
        # Save summary
        summary = {
            "pipeline_run_at": datetime.now().isoformat(),
            "products_processed": len(results),
            "results": results
        }
        
        with open(f"{self.output_dir}/pipeline_summary.json", 'w', encoding='utf-8') as f:
            json.dump(summary, f, indent=2, ensure_ascii=False)
        
        print(f"\n{'='*60}")
        print(f"Pipeline Complete! Processed {len(results)} products")
        print(f"{'='*60}")


# Run the pipeline
if __name__ == "__main__":
    pipeline = DataPipeline(output_dir="./scraped_data")
    
    # Process all credit cards
    pipeline.process_all_credit_cards()
    
    print("\nNext steps:")
    print("1. Review the generated JSON files in ./scraped_data/")
    print("2. Import this data into Supabase using the import script")
    print("3. Set up a cron job to run this weekly")
