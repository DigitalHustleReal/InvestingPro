"""
Comprehensive Product Scraper
Fetches real-time data for credit cards, mutual funds, and loans from bank websites
"""

import requests
from bs4 import BeautifulSoup
import json
import re
from datetime import datetime
from typing import Dict, List, Optional
import os
from dotenv import load_dotenv
from supabase import create_client, Client
import time

load_dotenv()

class ProductScraper:
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
        
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    
    def scrape_credit_card_from_bankbazaar(self, card_url: str) -> Optional[Dict]:
        """
        Scrape credit card details from BankBazaar
        """
        try:
            response = requests.get(card_url, headers=self.headers, timeout=15)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract card name
            name_elem = soup.find('h1', class_='product-title') or soup.find('h1')
            name = name_elem.get_text(strip=True) if name_elem else None
            
            # Extract annual fee
            fee_elem = soup.find('span', string=re.compile(r'Annual Fee|Joining Fee', re.I))
            annual_fee = self._extract_price(fee_elem.get_text() if fee_elem else '')
            
            # Extract reward rate
            reward_elem = soup.find('div', string=re.compile(r'Reward|Cashback', re.I))
            reward_rate = self._extract_percentage(reward_elem.get_text() if reward_elem else '')
            
            # Extract features
            features = []
            feature_elems = soup.find_all('li', class_='feature-item') or soup.find_all('div', class_='feature')
            for elem in feature_elems[:10]:
                text = elem.get_text(strip=True)
                if text:
                    features.append(text)
            
            if not name:
                return None
            
            return {
                'name': name,
                'annual_fee': annual_fee,
                'reward_rate': reward_rate,
                'features': features,
                'source_url': card_url,
                'scraped_at': datetime.now().isoformat()
            }
        except Exception as e:
            print(f"Error scraping {card_url}: {e}")
            return None
    
    def scrape_mutual_fund_from_amfi(self, isin: str) -> Optional[Dict]:
        """
        Scrape mutual fund data from AMFI or fund house website
        """
        try:
            # AMFI NAV API endpoint
            nav_url = f"https://portal.amfiindia.com/spages/NAVAll.txt"
            
            response = requests.get(nav_url, headers=self.headers, timeout=15)
            response.raise_for_status()
            
            # Parse NAV data (AMFI format)
            lines = response.text.split('\n')
            fund_data = None
            
            for i, line in enumerate(lines):
                if isin in line or any(keyword in line for keyword in ['Scheme Name', 'Net Asset Value']):
                    # Extract fund details from AMFI format
                    parts = line.split(';')
                    if len(parts) >= 4:
                        fund_data = {
                            'amfi_code': parts[0].strip() if len(parts) > 0 else '',
                            'isin': isin,
                            'nav': float(parts[4].strip()) if len(parts) > 4 and parts[4].strip().replace('.', '').isdigit() else 0,
                            'date': parts[5].strip() if len(parts) > 5 else datetime.now().strftime('%d-%b-%Y'),
                            'scraped_at': datetime.now().isoformat()
                        }
                        break
            
            return fund_data
        except Exception as e:
            print(f"Error scraping AMFI data for {isin}: {e}")
            return None
    
    def scrape_loan_rates_from_bank(self, bank_name: str, loan_type: str = 'personal') -> List[Dict]:
        """
        Scrape loan interest rates from bank website
        """
        rates = []
        
        # Bank URL mapping
        bank_urls = {
            'HDFC Bank': f'https://www.hdfcbank.com/personal/borrow/loans/{loan_type}-loan',
            'SBI': f'https://www.sbi.co.in/web/personal-loan',
            'ICICI Bank': f'https://www.icicibank.com/personal-banking/loans/{loan_type}-loan',
            'Axis Bank': f'https://www.axisbank.com/retail/loans/{loan_type}-loan'
        }
        
        url = bank_urls.get(bank_name)
        if not url:
            return rates
        
        try:
            response = requests.get(url, headers=self.headers, timeout=15)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract interest rate (varies by bank website structure)
            rate_elem = soup.find('span', class_=re.compile(r'rate|interest', re.I)) or \
                       soup.find('div', string=re.compile(r'\d+\.\d+%', re.I))
            
            if rate_elem:
                rate_text = rate_elem.get_text()
                rate_min, rate_max = self._extract_rate_range(rate_text)
                
                rates.append({
                    'provider': bank_name,
                    'rate_min': rate_min,
                    'rate_max': rate_max,
                    'loan_type': loan_type,
                    'source_url': url,
                    'scraped_at': datetime.now().isoformat()
                })
            
            time.sleep(2)  # Rate limiting
            
        except Exception as e:
            print(f"Error scraping loan rates from {bank_name}: {e}")
        
        return rates
    
    def update_product_in_db(self, product_data: Dict, product_type: str) -> bool:
        """
        Update or create product in Supabase
        """
        if not self.supabase:
            return False
        
        try:
            slug = product_data.get('slug') or self._generate_slug(product_data.get('name', ''))
            
            # First, check if product exists
            existing = self.supabase.table('products').select('id').eq('slug', slug).eq('product_type', product_type).execute()
            
            product_record = {
                'slug': slug,
                'name': product_data.get('name', ''),
                'product_type': product_type,
                'provider': product_data.get('provider', ''),
                'is_active': True,
                'last_updated_at': datetime.now().isoformat(),
                'data_completeness_score': self._calculate_completeness(product_data)
            }
            
            if existing.data and len(existing.data) > 0:
                # Update existing
                product_id = existing.data[0]['id']
                self.supabase.table('products').update(product_record).eq('id', product_id).execute()
                
                # Update type-specific table
                self._update_type_specific_table(product_id, product_data, product_type)
                
                print(f"  ✓ Updated: {product_data.get('name')}")
            else:
                # Insert new
                product_record['created_at'] = datetime.now().isoformat()
                result = self.supabase.table('products').insert(product_record).execute()
                
                if result.data and len(result.data) > 0:
                    product_id = result.data[0]['id']
                    self._update_type_specific_table(product_id, product_data, product_type)
                    print(f"  ✓ Created: {product_data.get('name')}")
            
            return True
        except Exception as e:
            print(f"  ✗ Error updating product: {e}")
            return False
    
    def _update_type_specific_table(self, product_id: str, product_data: Dict, product_type: str):
        """Update type-specific table (credit_cards, mutual_funds, etc.)"""
        if product_type == 'credit_card':
            card_data = {
                'product_id': product_id,
                'annual_fee': product_data.get('annual_fee'),
                'reward_rate': product_data.get('reward_rate'),
                'features': json.dumps(product_data.get('features', [])),
                'updated_at': datetime.now().isoformat()
            }
            self.supabase.table('credit_cards').upsert(card_data, on_conflict='product_id').execute()
        
        elif product_type == 'mutual_fund':
            mf_data = {
                'product_id': product_id,
                'amfi_code': product_data.get('amfi_code'),
                'nav': product_data.get('nav'),
                'returns_1y': product_data.get('returns_1y'),
                'returns_3y': product_data.get('returns_3y'),
                'returns_5y': product_data.get('returns_5y'),
                'expense_ratio': product_data.get('expense_ratio'),
                'updated_at': datetime.now().isoformat()
            }
            self.supabase.table('mutual_funds').upsert(mf_data, on_conflict='product_id').execute()
        
        elif product_type == 'personal_loan':
            loan_data = {
                'product_id': product_id,
                'interest_rate_min': product_data.get('rate_min'),
                'interest_rate_max': product_data.get('rate_max'),
                'updated_at': datetime.now().isoformat()
            }
            self.supabase.table('personal_loans').upsert(loan_data, on_conflict='product_id').execute()
    
    def _extract_price(self, text: str) -> Optional[float]:
        """Extract price from text like '₹2,500' or 'Free'"""
        if 'free' in text.lower() or 'nil' in text.lower():
            return 0.0
        
        # Extract number
        match = re.search(r'[\d,]+\.?\d*', text.replace(',', ''))
        return float(match.group()) if match else None
    
    def _extract_percentage(self, text: str) -> Optional[float]:
        """Extract percentage from text"""
        match = re.search(r'(\d+\.?\d*)%', text)
        return float(match.group(1)) if match else None
    
    def _extract_rate_range(self, text: str) -> tuple:
        """Extract min and max rates from text like '10.5% - 21%'"""
        matches = re.findall(r'(\d+\.?\d*)%', text)
        if len(matches) >= 2:
            return (float(matches[0]), float(matches[1]))
        elif len(matches) == 1:
            rate = float(matches[0])
            return (rate, rate)
        return (None, None)
    
    def _generate_slug(self, name: str) -> str:
        """Generate URL-friendly slug"""
        slug = name.lower()
        slug = re.sub(r'[^a-z0-9]+', '-', slug)
        slug = re.sub(r'^-+|-+$', '', slug)
        return slug
    
    def _calculate_completeness(self, data: Dict) -> float:
        """Calculate data completeness score (0-1)"""
        required_fields = ['name', 'provider']
        optional_fields = ['annual_fee', 'reward_rate', 'features', 'nav', 'returns_1y']
        
        total_fields = len(required_fields) + len(optional_fields)
        filled_fields = 0
        
        for field in required_fields:
            if data.get(field):
                filled_fields += 1
        
        for field in optional_fields:
            if data.get(field) is not None:
                filled_fields += 0.5  # Optional fields count half
        
        return round(filled_fields / total_fields, 2)
    
    def scrape_all_products(self):
        """
        Scrape all products from configured sources
        """
        print("\n" + "="*60)
        print("Starting Product Scraping Process")
        print("="*60)
        
        # Credit Cards from BankBazaar
        print("\n1. Scraping Credit Cards...")
        credit_card_urls = [
            'https://www.bankbazaar.com/credit-card/hdfc-regalia-gold-credit-card.html',
            'https://www.bankbazaar.com/credit-card/sbi-cashback-credit-card.html',
            'https://www.bankbazaar.com/credit-card/axis-ace-credit-card.html'
        ]
        
        for url in credit_card_urls:
            card_data = self.scrape_credit_card_from_bankbazaar(url)
            if card_data:
                card_data['provider'] = self._extract_provider_from_url(url)
                card_data['product_type'] = 'credit_card'
                self.update_product_in_db(card_data, 'credit_card')
            time.sleep(3)  # Rate limiting
        
        # Mutual Funds from AMFI
        print("\n2. Scraping Mutual Funds...")
        # This would iterate through ISINs from your database
        # For now, placeholder
        
        # Loan Rates
        print("\n3. Scraping Loan Rates...")
        banks = ['HDFC Bank', 'SBI', 'ICICI Bank', 'Axis Bank']
        for bank in banks:
            rates = self.scrape_loan_rates_from_bank(bank, 'personal')
            for rate in rates:
                rate['product_type'] = 'personal_loan'
                self.update_product_in_db(rate, 'personal_loan')
        
        print("\n" + "="*60)
        print("Product Scraping Complete!")
        print("="*60)
    
    def _extract_provider_from_url(self, url: str) -> str:
        """Extract provider name from URL"""
        if 'hdfc' in url.lower():
            return 'HDFC Bank'
        elif 'sbi' in url.lower():
            return 'SBI'
        elif 'axis' in url.lower():
            return 'Axis Bank'
        elif 'icici' in url.lower():
            return 'ICICI Bank'
        return 'Unknown'


if __name__ == "__main__":
    scraper = ProductScraper()
    scraper.scrape_all_products()

