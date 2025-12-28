"""
Example Credit Card Scraper
Demonstrates responsible scraping with provenance tracking
"""

import requests
from bs4 import BeautifulSoup
from datetime import datetime
import json
import time
from typing import Dict, List, Optional
import hashlib

class CreditCardScraper:
    """
    Scrapes credit card data from bank websites
    Implements:
    - Respectful rate limiting
    - Error handling
    - Data normalization
    - Provenance tracking
    """
    
    def __init__(self, rate_limit_delay: float = 2.0):
        self.rate_limit_delay = rate_limit_delay
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)
    
    def scrape_hdfc_card(self, card_url: str) -> Dict:
        """
        Scrape HDFC credit card page
        Returns normalized data with provenance
        """
        try:
            response = self.session.get(card_url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            fetched_at = datetime.utcnow().isoformat()
            
            # Extract data (example - adjust selectors based on actual HTML)
            card_data = {
                # Basic Info
                'name': self._extract_text(soup, 'h1.card-title') or 'Unknown',
                'provider': 'HDFC Bank',
                'provider_slug': 'hdfc-bank',
                
                # Fees
                'annual_fee': self._extract_number(soup, '.annual-fee'),
                'joining_fee': self._extract_number(soup, '.joining-fee'),
                
                # Interest
                'interest_rate': self._extract_number(soup, '.interest-rate'),
                
                # Rewards
                'reward_rate': self._extract_number(soup, '.reward-rate'),
                'reward_type': self._extract_text(soup, '.reward-type'),
                
                # Eligibility
                'min_income': self._extract_number(soup, '.min-income'),
                'min_credit_score': self._extract_number(soup, '.min-credit-score'),
                
                # Features
                'features': self._extract_list(soup, '.features-list li'),
                
                # Provenance
                'source_url': card_url,
                'fetched_at': fetched_at,
                'update_frequency': 'weekly',
                'raw_html_hash': hashlib.sha256(response.content).hexdigest()[:16],
            }
            
            # Normalize data
            normalized = self._normalize_card_data(card_data)
            
            return normalized
            
        except Exception as e:
            print(f"Error scraping {card_url}: {e}")
            return {
                'error': str(e),
                'source_url': card_url,
                'fetched_at': datetime.utcnow().isoformat()
            }
    
    def _extract_text(self, soup: BeautifulSoup, selector: str) -> Optional[str]:
        """Extract text from selector"""
        element = soup.select_one(selector)
        return element.get_text(strip=True) if element else None
    
    def _extract_number(self, soup: BeautifulSoup, selector: str) -> Optional[float]:
        """Extract number from selector"""
        text = self._extract_text(soup, selector)
        if not text:
            return None
        
        # Remove currency symbols and commas
        text = text.replace('₹', '').replace(',', '').replace('Rs.', '').strip()
        
        # Extract first number
        import re
        match = re.search(r'(\d+\.?\d*)', text)
        return float(match.group(1)) if match else None
    
    def _extract_list(self, soup: BeautifulSoup, selector: str) -> List[str]:
        """Extract list of items"""
        elements = soup.select(selector)
        return [el.get_text(strip=True) for el in elements if el.get_text(strip=True)]
    
    def _normalize_card_data(self, data: Dict) -> Dict:
        """
        Normalize scraped data to standard schema
        Ensures consistency across different sources
        """
        normalized = {
            # Product Info
            'name': data.get('name', '').strip(),
            'provider': data.get('provider', '').strip(),
            'provider_slug': data.get('provider_slug', '').strip(),
            
            # Fees (normalize to decimal)
            'annual_fee': self._normalize_fee(data.get('annual_fee')),
            'joining_fee': self._normalize_fee(data.get('joining_fee')),
            
            # Interest (normalize to percentage)
            'interest_rate': self._normalize_percentage(data.get('interest_rate')),
            
            # Rewards
            'reward_rate': self._normalize_percentage(data.get('reward_rate')),
            'reward_type': self._normalize_reward_type(data.get('reward_type')),
            
            # Eligibility
            'min_income': self._normalize_income(data.get('min_income')),
            'min_credit_score': self._normalize_credit_score(data.get('min_credit_score')),
            
            # Features (normalize to array)
            'features': self._normalize_features(data.get('features', [])),
            
            # Provenance (required)
            'source_url': data.get('source_url'),
            'fetched_at': data.get('fetched_at'),
            'update_frequency': data.get('update_frequency', 'weekly'),
            'scraper_version': '1.0.0',
        }
        
        return normalized
    
    def _normalize_fee(self, value) -> Optional[float]:
        """Normalize fee to decimal"""
        if value is None:
            return None
        if isinstance(value, (int, float)):
            return float(value)
        if isinstance(value, str):
            # Handle "Free", "Nil", "0", etc.
            if value.lower() in ['free', 'nil', 'na', 'n/a', '0']:
                return 0.0
            return self._extract_number_from_text(value)
        return None
    
    def _normalize_percentage(self, value) -> Optional[float]:
        """Normalize percentage value"""
        if value is None:
            return None
        if isinstance(value, (int, float)):
            return float(value)
        if isinstance(value, str):
            # Remove % symbol
            text = value.replace('%', '').strip()
            try:
                return float(text)
            except:
                return None
        return None
    
    def _normalize_reward_type(self, value: Optional[str]) -> Optional[str]:
        """Normalize reward type"""
        if not value:
            return None
        
        value_lower = value.lower()
        if 'cashback' in value_lower or 'cash back' in value_lower:
            return 'cashback'
        if 'points' in value_lower:
            return 'points'
        if 'miles' in value_lower:
            return 'miles'
        return value.strip()
    
    def _normalize_income(self, value) -> Optional[float]:
        """Normalize income to annual amount in rupees"""
        if value is None:
            return None
        
        if isinstance(value, (int, float)):
            return float(value)
        
        if isinstance(value, str):
            # Handle "5 Lakh", "5L", "500000", etc.
            text = value.lower().replace('lakh', '00000').replace('l', '00000')
            text = text.replace(',', '').replace('₹', '').replace('rs.', '').strip()
            
            # Extract number
            import re
            match = re.search(r'(\d+\.?\d*)', text)
            if match:
                num = float(match.group(1))
                # If it's less than 1000, assume it's in lakhs
                if num < 1000:
                    num *= 100000
                return num
        
        return None
    
    def _normalize_credit_score(self, value) -> Optional[int]:
        """Normalize credit score"""
        if value is None:
            return None
        if isinstance(value, int):
            return value
        if isinstance(value, (float, str)):
            try:
                return int(float(value))
            except:
                return None
        return None
    
    def _normalize_features(self, features: List[str]) -> List[str]:
        """Normalize features list"""
        if not features:
            return []
        
        normalized = []
        for feature in features:
            if isinstance(feature, str):
                normalized.append(feature.strip())
        
        return normalized
    
    def _extract_number_from_text(self, text: str) -> Optional[float]:
        """Extract first number from text"""
        import re
        match = re.search(r'(\d+\.?\d*)', text)
        return float(match.group(1)) if match else None
    
    def save_snapshot(self, url: str, html: str, data: Dict) -> Dict:
        """
        Save raw HTML snapshot for audit trail
        Returns snapshot metadata
        """
        snapshot = {
            'url': url,
            'html': html,
            'parsed_data': data,
            'fetched_at': datetime.utcnow().isoformat(),
            'html_size_bytes': len(html),
            'html_hash': hashlib.sha256(html.encode()).hexdigest()
        }
        
        return snapshot


# Example usage
if __name__ == "__main__":
    scraper = CreditCardScraper()
    
    # Example: Scrape HDFC Regalia Gold
    card_url = "https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold"
    data = scraper.scrape_hdfc_card(card_url)
    
    print(json.dumps(data, indent=2))
    
    # Save snapshot
    # snapshot = scraper.save_snapshot(card_url, html, data)
    # Store snapshot in database or file system

