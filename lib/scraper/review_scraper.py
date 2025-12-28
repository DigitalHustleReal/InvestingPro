"""
Web Scraper for Financial Product Reviews
Scrapes reviews from Google, Trustpilot, and Reddit
"""

import requests
from bs4 import BeautifulSoup
import json
import time
from datetime import datetime
from typing import List, Dict
import re

class ReviewScraper:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        self.rate_limit_delay = 2  # seconds between requests
    
    def scrape_trustpilot_reviews(self, company_name: str, max_reviews: int = 50) -> List[Dict]:
        """
        Scrape reviews from Trustpilot
        Example: https://www.trustpilot.com/review/hdfcbank.com
        """
        reviews = []
        company_slug = company_name.lower().replace(' ', '').replace('bank', '')
        
        # Trustpilot URL format
        base_url = f"https://www.trustpilot.com/review/{company_slug}.com"
        
        try:
            response = requests.get(base_url, headers=self.headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find review cards
            review_cards = soup.find_all('div', class_='styles_reviewCardInner__EwDq2')
            
            for card in review_cards[:max_reviews]:
                try:
                    # Extract rating (1-5 stars)
                    rating_elem = card.find('div', class_='star-rating_starRating__4rrcf')
                    rating_img = rating_elem.find('img') if rating_elem else None
                    rating = self._extract_rating_from_alt(rating_img['alt']) if rating_img else None
                    
                    # Extract review text
                    text_elem = card.find('p', class_='typography_body-l__KUYFJ')
                    review_text = text_elem.get_text(strip=True) if text_elem else ""
                    
                    # Extract date
                    date_elem = card.find('time')
                    review_date = date_elem['datetime'] if date_elem else None
                    
                    # Extract reviewer name
                    name_elem = card.find('span', class_='typography_heading-xxs__QKBS8')
                    reviewer_name = name_elem.get_text(strip=True) if name_elem else "Anonymous"
                    
                    if review_text:
                        reviews.append({
                            'source': 'trustpilot',
                            'product': company_name,
                            'rating': rating,
                            'text': review_text,
                            'author': reviewer_name,
                            'date': review_date,
                            'scraped_at': datetime.now().isoformat()
                        })
                except Exception as e:
                    print(f"Error parsing review card: {e}")
                    continue
            
            time.sleep(self.rate_limit_delay)
            
        except requests.RequestException as e:
            print(f"Error fetching Trustpilot reviews for {company_name}: {e}")
        
        return reviews
    
    def scrape_reddit_reviews(self, product_name: str, subreddit: str = 'CreditCardsIndia') -> List[Dict]:
        """
        Scrape Reddit discussions about a product
        Uses Reddit's JSON API (no authentication needed for public posts)
        """
        reviews = []
        
        # Reddit JSON API endpoint
        url = f"https://www.reddit.com/r/{subreddit}/search.json"
        params = {
            'q': product_name,
            'restrict_sr': 'on',
            'sort': 'relevance',
            'limit': 25
        }
        
        try:
            response = requests.get(url, headers=self.headers, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            for post in data['data']['children']:
                post_data = post['data']
                
                # Extract post content
                reviews.append({
                    'source': 'reddit',
                    'product': product_name,
                    'rating': None,  # Reddit doesn't have ratings
                    'text': f"{post_data.get('title', '')} {post_data.get('selftext', '')}",
                    'author': post_data.get('author', 'Anonymous'),
                    'date': datetime.fromtimestamp(post_data.get('created_utc', 0)).isoformat(),
                    'upvotes': post_data.get('ups', 0),
                    'url': f"https://reddit.com{post_data.get('permalink', '')}",
                    'scraped_at': datetime.now().isoformat()
                })
            
            time.sleep(self.rate_limit_delay)
            
        except requests.RequestException as e:
            print(f"Error fetching Reddit reviews for {product_name}: {e}")
        
        return reviews
    
    def scrape_mouthshut_reviews(self, product_name: str) -> List[Dict]:
        """
        Scrape reviews from MouthShut (Indian review site)
        Example: https://www.mouthshut.com/product-reviews/HDFC-Bank-Credit-Card-reviews-925000101
        """
        reviews = []
        
        # Note: MouthShut URLs need to be manually mapped
        # This is a simplified example
        product_slug = product_name.lower().replace(' ', '-')
        base_url = f"https://www.mouthshut.com/product-reviews/{product_slug}-reviews"
        
        try:
            response = requests.get(base_url, headers=self.headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find review containers (structure may vary)
            review_divs = soup.find_all('div', class_='review')
            
            for div in review_divs[:50]:
                try:
                    # Extract rating
                    rating_elem = div.find('div', class_='rating')
                    rating = self._extract_number(rating_elem.get_text()) if rating_elem else None
                    
                    # Extract review text
                    text_elem = div.find('div', class_='reviewdata')
                    review_text = text_elem.get_text(strip=True) if text_elem else ""
                    
                    if review_text:
                        reviews.append({
                            'source': 'mouthshut',
                            'product': product_name,
                            'rating': rating,
                            'text': review_text,
                            'scraped_at': datetime.now().isoformat()
                        })
                except Exception as e:
                    print(f"Error parsing MouthShut review: {e}")
                    continue
            
            time.sleep(self.rate_limit_delay)
            
        except requests.RequestException as e:
            print(f"Error fetching MouthShut reviews for {product_name}: {e}")
        
        return reviews
    
    def _extract_rating_from_alt(self, alt_text: str) -> float:
        """Extract numeric rating from alt text like 'Rated 4.5 out of 5 stars'"""
        match = re.search(r'(\d+\.?\d*)', alt_text)
        return float(match.group(1)) if match else None
    
    def _extract_number(self, text: str) -> float:
        """Extract first number from text"""
        match = re.search(r'(\d+\.?\d*)', text)
        return float(match.group(1)) if match else None
    
    def scrape_all_sources(self, product_name: str, company_name: str = None) -> Dict:
        """
        Scrape reviews from all sources for a product
        """
        all_reviews = {
            'product': product_name,
            'total_reviews': 0,
            'sources': {}
        }
        
        # Trustpilot
        if company_name:
            trustpilot_reviews = self.scrape_trustpilot_reviews(company_name)
            all_reviews['sources']['trustpilot'] = trustpilot_reviews
            all_reviews['total_reviews'] += len(trustpilot_reviews)
        
        # Reddit
        reddit_reviews = self.scrape_reddit_reviews(product_name)
        all_reviews['sources']['reddit'] = reddit_reviews
        all_reviews['total_reviews'] += len(reddit_reviews)
        
        # MouthShut
        mouthshut_reviews = self.scrape_mouthshut_reviews(product_name)
        all_reviews['sources']['mouthshut'] = mouthshut_reviews
        all_reviews['total_reviews'] += len(mouthshut_reviews)
        
        return all_reviews


# Example usage
if __name__ == "__main__":
    scraper = ReviewScraper()
    
    # Scrape reviews for HDFC Regalia Gold
    reviews = scraper.scrape_all_sources(
        product_name="HDFC Regalia Gold",
        company_name="HDFC Bank"
    )
    
    # Save to JSON
    with open('reviews_hdfc_regalia.json', 'w', encoding='utf-8') as f:
        json.dump(reviews, f, indent=2, ensure_ascii=False)
    
    print(f"Scraped {reviews['total_reviews']} reviews")
    print(f"Trustpilot: {len(reviews['sources'].get('trustpilot', []))}")
    print(f"Reddit: {len(reviews['sources'].get('reddit', []))}")
    print(f"MouthShut: {len(reviews['sources'].get('mouthshut', []))}")
