"""
Data Normalization Module
Ensures consistent data format across different sources
"""

from typing import Dict, Any, Optional, List
import re
from datetime import datetime

class DataNormalizer:
    """
    Normalizes financial product data to standard schema
    Handles variations in formatting, units, and representations
    """
    
    @staticmethod
    def normalize_credit_card(raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Normalize credit card data to standard schema
        
        Expected output schema:
        {
            "name": str,
            "provider": str,
            "annual_fee": float | null,
            "interest_rate": float | null,
            "reward_rate": float | null,
            "reward_type": "cashback" | "points" | "miles" | null,
            "min_income": float | null,  # Annual income in rupees
            "min_credit_score": int | null,
            "features": List[str],
            "source_url": str,
            "fetched_at": str (ISO format),
            "update_frequency": "daily" | "weekly" | "monthly"
        }
        """
        normalized = {
            'name': DataNormalizer._normalize_string(raw_data.get('name')),
            'provider': DataNormalizer._normalize_string(raw_data.get('provider')),
            'annual_fee': DataNormalizer._normalize_currency(raw_data.get('annual_fee')),
            'interest_rate': DataNormalizer._normalize_percentage(raw_data.get('interest_rate')),
            'reward_rate': DataNormalizer._normalize_percentage(raw_data.get('reward_rate')),
            'reward_type': DataNormalizer._normalize_reward_type(raw_data.get('reward_type')),
            'min_income': DataNormalizer._normalize_income(raw_data.get('min_income')),
            'min_credit_score': DataNormalizer._normalize_credit_score(raw_data.get('min_credit_score')),
            'features': DataNormalizer._normalize_list(raw_data.get('features', [])),
            'source_url': raw_data.get('source_url', ''),
            'fetched_at': raw_data.get('fetched_at', datetime.utcnow().isoformat()),
            'update_frequency': raw_data.get('update_frequency', 'weekly'),
        }
        
        return normalized
    
    @staticmethod
    def normalize_mutual_fund(raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """Normalize mutual fund data"""
        normalized = {
            'name': DataNormalizer._normalize_string(raw_data.get('name')),
            'provider': DataNormalizer._normalize_string(raw_data.get('provider')),
            'amfi_code': DataNormalizer._normalize_string(raw_data.get('amfi_code')),
            'fund_category': DataNormalizer._normalize_string(raw_data.get('fund_category')),
            'returns_1y': DataNormalizer._normalize_percentage(raw_data.get('returns_1y')),
            'returns_3y': DataNormalizer._normalize_percentage(raw_data.get('returns_3y')),
            'returns_5y': DataNormalizer._normalize_percentage(raw_data.get('returns_5y')),
            'expense_ratio': DataNormalizer._normalize_percentage(raw_data.get('expense_ratio')),
            'min_investment': DataNormalizer._normalize_currency(raw_data.get('min_investment')),
            'aum': DataNormalizer._normalize_currency(raw_data.get('aum')),
            'source_url': raw_data.get('source_url', ''),
            'fetched_at': raw_data.get('fetched_at', datetime.utcnow().isoformat()),
            'update_frequency': raw_data.get('update_frequency', 'daily'),
        }
        
        return normalized
    
    @staticmethod
    def normalize_personal_loan(raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """Normalize personal loan data"""
        normalized = {
            'name': DataNormalizer._normalize_string(raw_data.get('name')),
            'provider': DataNormalizer._normalize_string(raw_data.get('provider')),
            'interest_rate_min': DataNormalizer._normalize_percentage(raw_data.get('interest_rate_min')),
            'interest_rate_max': DataNormalizer._normalize_percentage(raw_data.get('interest_rate_max')),
            'min_loan_amount': DataNormalizer._normalize_currency(raw_data.get('min_loan_amount')),
            'max_loan_amount': DataNormalizer._normalize_currency(raw_data.get('max_loan_amount')),
            'processing_fee': DataNormalizer._normalize_currency(raw_data.get('processing_fee')),
            'min_income': DataNormalizer._normalize_income(raw_data.get('min_income')),
            'source_url': raw_data.get('source_url', ''),
            'fetched_at': raw_data.get('fetched_at', datetime.utcnow().isoformat()),
            'update_frequency': raw_data.get('update_frequency', 'weekly'),
        }
        
        return normalized
    
    # Helper methods
    
    @staticmethod
    def _normalize_string(value: Any) -> Optional[str]:
        """Normalize string value"""
        if value is None:
            return None
        if isinstance(value, str):
            return value.strip()
        return str(value).strip()
    
    @staticmethod
    def _normalize_currency(value: Any) -> Optional[float]:
        """Normalize currency to float (rupees)"""
        if value is None:
            return None
        
        if isinstance(value, (int, float)):
            return float(value)
        
        if isinstance(value, str):
            # Remove currency symbols, commas, spaces
            text = re.sub(r'[₹,Rs\.\s]', '', value, flags=re.IGNORECASE)
            text = text.strip()
            
            # Handle "Free", "Nil", etc.
            if text.lower() in ['free', 'nil', 'na', 'n/a', '0', '']:
                return 0.0
            
            # Extract number
            match = re.search(r'(\d+\.?\d*)', text)
            if match:
                return float(match.group(1))
        
        return None
    
    @staticmethod
    def _normalize_percentage(value: Any) -> Optional[float]:
        """Normalize percentage to float"""
        if value is None:
            return None
        
        if isinstance(value, (int, float)):
            return float(value)
        
        if isinstance(value, str):
            # Remove % symbol
            text = value.replace('%', '').strip()
            match = re.search(r'(\d+\.?\d*)', text)
            if match:
                return float(match.group(1))
        
        return None
    
    @staticmethod
    def _normalize_reward_type(value: Any) -> Optional[str]:
        """Normalize reward type to standard values"""
        if not value:
            return None
        
        if isinstance(value, str):
            value_lower = value.lower()
            if 'cashback' in value_lower or 'cash back' in value_lower:
                return 'cashback'
            if 'points' in value_lower:
                return 'points'
            if 'miles' in value_lower:
                return 'miles'
            return value.strip()
        
        return None
    
    @staticmethod
    def _normalize_income(value: Any) -> Optional[float]:
        """Normalize income to annual amount in rupees"""
        if value is None:
            return None
        
        if isinstance(value, (int, float)):
            return float(value)
        
        if isinstance(value, str):
            # Handle "5 Lakh", "5L", "500000", etc.
            text = value.lower()
            text = text.replace('lakh', '00000').replace('l', '00000')
            text = re.sub(r'[₹,Rs\.\s]', '', text)
            
            match = re.search(r'(\d+\.?\d*)', text)
            if match:
                num = float(match.group(1))
                # If less than 1000, assume lakhs
                if num < 1000:
                    num *= 100000
                return num
        
        return None
    
    @staticmethod
    def _normalize_credit_score(value: Any) -> Optional[int]:
        """Normalize credit score to integer"""
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
    
    @staticmethod
    def _normalize_list(value: Any) -> List[str]:
        """Normalize list of strings"""
        if not value:
            return []
        
        if isinstance(value, list):
            return [str(item).strip() for item in value if item]
        
        if isinstance(value, str):
            # Split by common delimiters
            return [item.strip() for item in re.split(r'[,;|]', value) if item.strip()]
        
        return []


# Example normalized output
EXAMPLE_NORMALIZED_CREDIT_CARD = {
    "name": "HDFC Regalia Gold Credit Card",
    "provider": "HDFC Bank",
    "annual_fee": 2500.0,
    "interest_rate": 24.0,
    "reward_rate": 4.0,
    "reward_type": "points",
    "min_income": 600000.0,  # 6 lakhs
    "min_credit_score": 750,
    "features": [
        "Lounge access",
        "Travel benefits",
        "Reward points"
    ],
    "source_url": "https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold",
    "fetched_at": "2025-01-20T10:30:00Z",
    "update_frequency": "weekly"
}

