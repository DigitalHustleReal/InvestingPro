/**
 * Credit Card Service
 * 
 * Purpose: Domain-specific service for credit card operations
 */

import { BaseEntityService } from './base-entity.service';

export interface CreditCard {
  id: string;
  name: string;
  issuer: string;
  card_type: string;
  annual_fee: number;
  joining_fee: number;
  rewards_rate: number;
  cashback_rate: number;
  features: string[];
  best_for: string[];
  rating: number;
  created_at: string;
  updated_at: string;
}

export class CreditCardService extends BaseEntityService<CreditCard> {
  protected tableName = 'credit_cards';

  /**
   * Find credit cards by issuer
   */
  async findByIssuer(issuer: string): Promise<CreditCard[]> {
    return this.list({ issuer });
  }

  /**
   * Find credit cards by type
   */
  async findByType(cardType: string): Promise<CreditCard[]> {
    return this.list({ card_type: cardType });
  }

  /**
   * Find premium cards (annual fee > 0)
   */
  async findPremiumCards(): Promise<CreditCard[]> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .gt('annual_fee', 0)
        .order('annual_fee', { ascending: false });

      if (error) throw error;
      return (data as CreditCard[]) || [];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find zero-fee cards
   */
  async findZeroFeeCards(): Promise<CreditCard[]> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('annual_fee', 0)
        .eq('joining_fee', 0)
        .order('rating', { ascending: false });

      if (error) throw error;
      return (data as CreditCard[]) || [];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find top-rated cards
   */
  async findTopRated(limit: number = 10): Promise<CreditCard[]> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .order('rating', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data as CreditCard[]) || [];
    } catch (error) {
      throw error;
    }
  }
}

// Singleton instance
export const creditCardService = new CreditCardService();
