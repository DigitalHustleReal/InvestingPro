"""
Live Rate Scraper for Financial Products
Scrapes FD rates, loan rates, savings account rates, and inflation data
"""

import requests
from bs4 import BeautifulSoup
import json
import re
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

class RateScraper:
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
    
    def scrape_fd_rates(self) -> List[Dict]:
        """
        Scrape Fixed Deposit rates from major banks
        Returns list of FD rate data
        """
        rates = []
        
        # Bank URLs for FD rates
        bank_urls = {
            'HDFC Bank': 'https://www.hdfcbank.com/personal/save/deposits/fixed-deposit',
            'SBI': 'https://www.sbi.co.in/web/interest-rates/interest-rates/term-deposit',
            'ICICI Bank': 'https://www.icicibank.com/personal-banking/deposits/fixed-deposit',
            'Axis Bank': 'https://www.axisbank.com/retail/deposits/fixed-deposit'
        }
        
        for bank_name, url in bank_urls.items():
            try:
                response = requests.get(url, headers=self.headers, timeout=15)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Extract FD rates (structure varies by bank)
                # Look for rate elements
                rate_elements = soup.find_all(['span', 'div', 'td'], string=re.compile(r'\d+\.\d+%', re.I))
                
                for elem in rate_elements[:5]:  # Limit to first 5 matches
                    rate_text = elem.get_text()
                    rate_match = re.search(r'(\d+\.\d+)%', rate_text)
                    
                    if rate_match:
                        rate_value = float(rate_match.group(1))
                        
                        # Try to extract tenure from nearby elements
                        parent = elem.find_parent()
                        tenure_text = parent.get_text() if parent else ''
                        tenure_match = re.search(r'(\d+)\s*(month|year)', tenure_text, re.I)
                        tenure_months = int(tenure_match.group(1)) * 12 if tenure_match and 'year' in tenure_match.group(2).lower() else (int(tenure_match.group(1)) if tenure_match else 12)
                        
                        rates.append({
                            'provider': bank_name,
                            'rate': rate_value,
                            'tenure_months': tenure_months,
                            'min_amount': 1000,  # Default, can be extracted if available
                            'source_url': url,
                            'rate_type': 'fd',
                            'scraped_at': datetime.now().isoformat()
                        })
                        break  # Take first valid rate per bank
                
                time.sleep(2)  # Rate limiting
                
            except Exception as e:
                print(f"Error scraping FD rates from {bank_name}: {e}")
                continue
        
        return rates
    
    def scrape_loan_rates(self, loan_type: str = 'personal') -> List[Dict]:
        """
        Scrape loan interest rates from bank websites
        loan_type: 'personal', 'home', 'car', 'education'
        """
        rates = []
        
        bank_urls = {
            'HDFC Bank': f'https://www.hdfcbank.com/personal/borrow/loans/{loan_type}-loan',
            'SBI': f'https://www.sbi.co.in/web/personal-loan',
            'ICICI Bank': f'https://www.icicibank.com/personal-banking/loans/{loan_type}-loan',
            'Axis Bank': f'https://www.axisbank.com/retail/loans/{loan_type}-loan'
        }
        
        for bank_name, url in bank_urls.items():
            try:
                response = requests.get(url, headers=self.headers, timeout=15)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Extract interest rate
                rate_elements = soup.find_all(['span', 'div', 'p'], string=re.compile(r'\d+\.\d+%', re.I))
                
                for elem in rate_elements:
                    rate_text = elem.get_text()
                    rate_matches = re.findall(r'(\d+\.\d+)%', rate_text)
                    
                    if rate_matches:
                        rate_min = float(rate_matches[0])
                        rate_max = float(rate_matches[-1]) if len(rate_matches) > 1 else rate_min
                        
                        rates.append({
                            'provider': bank_name,
                            'rate': rate_min,  # Use min as primary
                            'rate_min': rate_min,
                            'rate_max': rate_max,
                            'loan_type': loan_type,
                            'min_amount': 50000,  # Default
                            'max_amount': 5000000,  # Default
                            'source_url': url,
                            'rate_type': f'loan_{loan_type}',
                            'scraped_at': datetime.now().isoformat()
                        })
                        break
                
                time.sleep(2)  # Rate limiting
                
            except Exception as e:
                print(f"Error scraping {loan_type} loan rates from {bank_name}: {e}")
                continue
        
        return rates
    
    def scrape_inflation_data(self) -> Dict:
        """
        Scrape inflation data from RBI or government sources
        Returns latest inflation rate
        """
        try:
            # RBI publishes inflation data
            rbi_url = 'https://www.rbi.org.in/scripts/PublicationsView.aspx?id=18929'
            
            response = requests.get(rbi_url, headers=self.headers, timeout=15)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract latest inflation rate from RBI page
            # Structure may vary, so we look for percentage patterns
            inflation_elements = soup.find_all(['td', 'span', 'div'], string=re.compile(r'\d+\.\d+', re.I))
            
            now = datetime.now()
            inflation_rate = None
            
            # Try to find the latest inflation rate
            for elem in inflation_elements:
                text = elem.get_text()
                # Look for patterns like "6.5%" or "6.50"
                match = re.search(r'(\d+\.\d+)', text)
                if match:
                    rate = float(match.group(1))
                    # Validate it's a reasonable inflation rate (typically 2-15%)
                    if 2.0 <= rate <= 15.0:
                        inflation_rate = rate
                        break
            
            # Fallback: Use a reasonable default if scraping fails
            if inflation_rate is None:
                inflation_rate = 6.0  # Conservative default
                print("⚠ Could not scrape inflation rate, using default")
            
            return {
                'year': now.year,
                'month': now.month,
                'inflation_rate': inflation_rate,
                'source': 'RBI',
                'source_url': rbi_url,
                'rate_type': 'inflation',
                'scraped_at': datetime.now().isoformat()
            }
        except Exception as e:
            print(f"Error scraping inflation data: {e}")
            # Return default on error
            now = datetime.now()
            return {
                'year': now.year,
                'month': now.month,
                'inflation_rate': 6.0,  # Default fallback
                'source': 'RBI',
                'source_url': 'https://www.rbi.org.in/scripts/PublicationsView.aspx?id=18929',
                'rate_type': 'inflation',
                'scraped_at': datetime.now().isoformat()
            }
    
    def scrape_savings_rates(self) -> List[Dict]:
        """
        Scrape savings account interest rates from bank websites
        """
        rates = []
        
        bank_urls = {
            'HDFC Bank': 'https://www.hdfcbank.com/personal/save/accounts/savings-accounts',
            'SBI': 'https://www.sbi.co.in/web/interest-rates/interest-rates/savings-bank-deposit',
            'ICICI Bank': 'https://www.icicibank.com/personal-banking/account/savings-account',
            'Axis Bank': 'https://www.axisbank.com/retail/accounts/savings-account'
        }
        
        for bank_name, url in bank_urls.items():
            try:
                response = requests.get(url, headers=self.headers, timeout=15)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Extract savings rate
                rate_elements = soup.find_all(['span', 'div', 'td'], string=re.compile(r'\d+\.\d+%', re.I))
                
                for elem in rate_elements:
                    rate_text = elem.get_text()
                    rate_match = re.search(r'(\d+\.\d+)%', rate_text)
                    
                    if rate_match:
                        rate_value = float(rate_match.group(1))
                        # Validate it's a reasonable savings rate (typically 2-7%)
                        if 2.0 <= rate_value <= 7.0:
                            rates.append({
                                'provider': bank_name,
                                'rate': rate_value,
                                'min_amount': 0,
                                'source_url': url,
                                'rate_type': 'savings',
                                'scraped_at': datetime.now().isoformat()
                            })
                            break
                
                time.sleep(2)  # Rate limiting
                
            except Exception as e:
                print(f"Error scraping savings rates from {bank_name}: {e}")
                continue
        
        return rates
    
    def save_rates_to_db(self, rates: List[Dict], rate_type: str):
        """
        Save scraped rates to Supabase
        """
        if not self.supabase:
            print("⚠ Supabase not initialized, skipping database save")
            return
        
        try:
            for rate in rates:
                # Set valid_until to 7 days from now
                valid_until = datetime.now() + timedelta(days=7)
                
                data = {
                    'rate_type': rate.get('rate_type', rate_type),
                    'provider': rate.get('provider', 'Unknown'),
                    'rate_value': rate.get('rate', rate.get('rate_value', 0)),
                    'rate_unit': 'percentage',
                    'min_amount': rate.get('min_amount'),
                    'max_amount': rate.get('max_amount'),
                    'tenure_months': rate.get('tenure_months'),
                    'tenure_years': rate.get('tenure_years'),
                    'source_url': rate.get('source_url'),
                    'scraped_at': datetime.now().isoformat(),
                    'valid_until': valid_until.isoformat()
                }
                
                # Upsert based on provider + rate_type + tenure
                self.supabase.table('live_rates').upsert(
                    data,
                    on_conflict='rate_type,provider,tenure_months'
                ).execute()
            
            print(f"✓ Saved {len(rates)} {rate_type} rates to database")
        except Exception as e:
            print(f"✗ Error saving rates to database: {e}")
    
    def save_inflation_to_db(self, inflation_data: Dict):
        """
        Save inflation data to Supabase
        """
        if not self.supabase:
            print("⚠ Supabase not initialized, skipping database save")
            return
        
        try:
            data = {
                'year': inflation_data.get('year'),
                'month': inflation_data.get('month'),
                'inflation_rate': inflation_data.get('inflation_rate'),
                'source': inflation_data.get('source', 'RBI'),
                'source_url': inflation_data.get('source_url'),
                'scraped_at': datetime.now().isoformat()
            }
            
            # Check if data for this year/month already exists
            existing = self.supabase.table('inflation_data').select('*').eq('year', data['year']).eq('month', data['month']).execute()
            
            if not existing.data:
                self.supabase.table('inflation_data').insert(data).execute()
                print(f"✓ Saved inflation data for {data['year']}-{data['month']}")
            else:
                print(f"⚠ Inflation data for {data['year']}-{data['month']} already exists")
        except Exception as e:
            print(f"✗ Error saving inflation data: {e}")
    
    def run_all_scrapers(self):
        """
        Run all rate scrapers
        """
        print("\n" + "="*60)
        print("Starting Rate Scraping Process")
        print("="*60)
        
        # Scrape FD rates
        print("\n1. Scraping FD rates...")
        fd_rates = self.scrape_fd_rates()
        if fd_rates:
            self.save_rates_to_db(fd_rates, 'fd')
        
        # Scrape loan rates
        print("\n2. Scraping loan rates...")
        for loan_type in ['personal', 'home', 'car', 'education']:
            loan_rates = self.scrape_loan_rates(loan_type)
            if loan_rates:
                self.save_rates_to_db(loan_rates, f'loan_{loan_type}')
        
        # Scrape savings rates
        print("\n3. Scraping savings account rates...")
        savings_rates = self.scrape_savings_rates()
        if savings_rates:
            self.save_rates_to_db(savings_rates, 'savings')
        
        # Scrape inflation data
        print("\n4. Scraping inflation data...")
        inflation_data = self.scrape_inflation_data()
        if inflation_data:
            self.save_inflation_to_db(inflation_data)
        
        print("\n" + "="*60)
        print("Rate Scraping Complete!")
        print("="*60)


if __name__ == "__main__":
    scraper = RateScraper()
    scraper.run_all_scrapers()

