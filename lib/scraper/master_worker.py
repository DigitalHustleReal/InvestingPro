"""
Master Worker Script
Orchestrates all scraping tasks: products, reviews, rates
Run this script manually or via cron to update all data
"""

import os
import sys
from datetime import datetime
from dotenv import load_dotenv

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from lib.scraper.product_scraper import ProductScraper
from lib.scraper.review_processor import ReviewProcessor
from lib.scraper.rate_scraper import RateScraper

load_dotenv()

def main():
    """
    Main worker function that runs all scrapers
    """
    print("\n" + "="*70)
    print("INVESTINGPRO MASTER WORKER - DATA UPDATE PIPELINE")
    print("="*70)
    print(f"Started at: {datetime.now().isoformat()}")
    print("="*70)
    
    results = {
        'started_at': datetime.now().isoformat(),
        'products': {'success': False, 'error': None},
        'reviews': {'success': False, 'error': None},
        'rates': {'success': False, 'error': None},
    }
    
    # Step 1: Scrape Products
    print("\n[1/3] SCRAPING PRODUCTS...")
    print("-" * 70)
    try:
        product_scraper = ProductScraper()
        product_scraper.scrape_all_products()
        results['products']['success'] = True
        print("✓ Products scraping completed successfully")
    except Exception as e:
        results['products']['error'] = str(e)
        print(f"✗ Products scraping failed: {e}")
    
    # Step 2: Process Reviews
    print("\n[2/3] PROCESSING REVIEWS...")
    print("-" * 70)
    try:
        review_processor = ReviewProcessor()
        review_processor.process_all_products()
        results['reviews']['success'] = True
        print("✓ Review processing completed successfully")
    except Exception as e:
        results['reviews']['error'] = str(e)
        print(f"✗ Review processing failed: {e}")
    
    # Step 3: Scrape Rates
    print("\n[3/3] SCRAPING FINANCIAL RATES...")
    print("-" * 70)
    try:
        rate_scraper = RateScraper()
        rate_scraper.run_all_scrapers()
        results['rates']['success'] = True
        print("✓ Rate scraping completed successfully")
    except Exception as e:
        results['rates']['error'] = str(e)
        print(f"✗ Rate scraping failed: {e}")
    
    # Summary
    results['completed_at'] = datetime.now().isoformat()
    results['duration_seconds'] = (datetime.now() - datetime.fromisoformat(results['started_at'])).total_seconds()
    
    print("\n" + "="*70)
    print("WORKER SUMMARY")
    print("="*70)
    print(f"Products: {'✓' if results['products']['success'] else '✗'}")
    print(f"Reviews:  {'✓' if results['reviews']['success'] else '✗'}")
    print(f"Rates:    {'✓' if results['rates']['success'] else '✗'}")
    print(f"Duration: {results['duration_seconds']:.1f} seconds")
    print("="*70)
    
    # Exit with error code if any task failed
    if not all([results['products']['success'], results['reviews']['success'], results['rates']['success']]):
        sys.exit(1)
    
    return results


if __name__ == "__main__":
    main()

