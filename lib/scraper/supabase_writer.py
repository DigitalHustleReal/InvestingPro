"""
Supabase Writer for Scraped Data
Writes scraped financial product data directly to Supabase database
"""

import os
import json
from typing import Dict, List, Optional
from supabase import create_client, Client
from datetime import datetime

class SupabaseWriter:
    def __init__(self):
        """Initialize Supabase client"""
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_ANON_KEY")
        
        if not url or not key:
            raise ValueError(
                "SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in environment variables"
            )
        
        self.supabase: Client = create_client(url, key)
        print("✓ Connected to Supabase")
    
    def write_mutual_fund(self, fund_data: Dict) -> bool:
        """
        Write mutual fund data to Supabase assets table
        
        Args:
            fund_data: Dictionary containing fund information
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            slug = fund_data.get('slug') or self._generate_slug(fund_data.get('name', ''))
            
            # Check if asset exists
            existing = self.supabase.table('assets').select('id').eq('slug', slug).execute()
            
            asset_data = {
                'name': fund_data.get('name', ''),
                'slug': slug,
                'category': 'mutual_funds',
                'provider': fund_data.get('fund_house') or fund_data.get('provider', ''),
                'metadata': fund_data,
                'updated_at': datetime.now().isoformat()
            }
            
            if existing.data and len(existing.data) > 0:
                # Update existing
                result = self.supabase.table('assets').update(asset_data).eq('slug', slug).execute()
                print(f"  ✓ Updated: {fund_data.get('name')}")
            else:
                # Insert new
                asset_data['created_at'] = datetime.now().isoformat()
                result = self.supabase.table('assets').insert(asset_data).execute()
                print(f"  ✓ Created: {fund_data.get('name')}")
            
            return True
        except Exception as e:
            print(f"  ✗ Error writing fund {fund_data.get('name')}: {e}")
            return False
    
    def write_credit_card(self, card_data: Dict) -> bool:
        """
        Write credit card data to Supabase
        
        Args:
            card_data: Dictionary containing card information
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            slug = card_data.get('slug') or self._generate_slug(card_data.get('name', ''))
            
            # Check if exists
            existing = self.supabase.table('assets').select('id').eq('slug', slug).execute()
            
            asset_data = {
                'name': card_data.get('name', ''),
                'slug': slug,
                'category': 'credit_cards',
                'provider': card_data.get('provider') or card_data.get('bank', ''),
                'metadata': card_data,
                'updated_at': datetime.now().isoformat()
            }
            
            if existing.data and len(existing.data) > 0:
                result = self.supabase.table('assets').update(asset_data).eq('slug', slug).execute()
                print(f"  ✓ Updated: {card_data.get('name')}")
            else:
                asset_data['created_at'] = datetime.now().isoformat()
                result = self.supabase.table('assets').insert(asset_data).execute()
                print(f"  ✓ Created: {card_data.get('name')}")
            
            return True
        except Exception as e:
            print(f"  ✗ Error writing card {card_data.get('name')}: {e}")
            return False
    
    def write_reviews(self, product_id: str, reviews: List[Dict]) -> bool:
        """
        Write product reviews to Supabase reviews table
        
        Args:
            product_id: ID of the product
            reviews: List of review dictionaries
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            review_records = []
            for review in reviews[:100]:  # Limit to 100 reviews per batch
                review_records.append({
                    'product_id': product_id,
                    'user_name': review.get('author', 'Anonymous'),
                    'review_text': review.get('text', '')[:1000],  # Limit length
                    'rating': review.get('rating', 0),
                    'source': review.get('source', 'unknown'),
                    'status': 'approved',
                    'created_at': review.get('date', datetime.now().isoformat())
                })
            
            if review_records:
                # Insert in batches
                batch_size = 50
                for i in range(0, len(review_records), batch_size):
                    batch = review_records[i:i + batch_size]
                    self.supabase.table('reviews').insert(batch).execute()
                
                print(f"  ✓ Wrote {len(review_records)} reviews for {product_id}")
            
            return True
        except Exception as e:
            print(f"  ✗ Error writing reviews: {e}")
            return False
    
    def write_product_analysis(self, analysis_data: Dict) -> bool:
        """
        Write product analysis (sentiment, summary) to Supabase
        
        Args:
            analysis_data: Dictionary containing analysis results
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            product_id = analysis_data.get('product_id')
            if not product_id:
                return False
            
            # Update asset with analysis metadata
            update_data = {
                'metadata': {
                    **analysis_data.get('metadata', {}),
                    'sentiment_analysis': analysis_data.get('sentiment_analysis'),
                    'ai_summary': analysis_data.get('ai_summary'),
                    'review_stats': analysis_data.get('review_stats'),
                    'last_analyzed': datetime.now().isoformat()
                },
                'updated_at': datetime.now().isoformat()
            }
            
            # Try to find by product_id or slug
            slug = self._generate_slug(analysis_data.get('product_name', ''))
            result = self.supabase.table('assets').update(update_data).eq('slug', slug).execute()
            
            print(f"  ✓ Updated analysis for {analysis_data.get('product_name')}")
            return True
        except Exception as e:
            print(f"  ✗ Error writing analysis: {e}")
            return False
    
    def _generate_slug(self, name: str) -> str:
        """Generate URL-friendly slug from name"""
        import re
        slug = name.lower()
        slug = re.sub(r'[^a-z0-9]+', '-', slug)
        slug = re.sub(r'^-+|-+$', '', slug)
        return slug
    
    def test_connection(self) -> bool:
        """Test Supabase connection"""
        try:
            result = self.supabase.table('assets').select('id').limit(1).execute()
            print("✓ Supabase connection successful")
            return True
        except Exception as e:
            print(f"✗ Supabase connection failed: {e}")
            return False


# Example usage
if __name__ == "__main__":
    writer = SupabaseWriter()
    
    # Test connection
    if writer.test_connection():
        # Example: Write a test mutual fund
        test_fund = {
            'name': 'HDFC Top 100 Fund',
            'slug': 'hdfc-top-100-fund',
            'fund_house': 'HDFC Mutual Fund',
            'category': 'Large Cap',
            'expense_ratio': 1.2,
            'returns_1y': 15.5,
            'returns_3y': 18.2,
            'returns_5y': 16.8
        }
        
        writer.write_mutual_fund(test_fund)
        print("\n✓ Test write completed")

