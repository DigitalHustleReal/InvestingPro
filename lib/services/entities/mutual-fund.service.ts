/**
 * Mutual Fund Service
 * 
 * Purpose: Domain-specific service for mutual fund operations
 */

import { BaseEntityService } from './base-entity.service';

export interface MutualFund {
  id: string;
  name: string;
  fund_house: string;
  category: string;
  sub_category: string;
  nav: number;
  aum: number;
  expense_ratio: number;
  returns_1y: number;
  returns_3y: number;
  returns_5y: number;
  risk_level: string;
  min_investment: number;
  rating: number;
  created_at: string;
  updated_at: string;
}

export class MutualFundService extends BaseEntityService<MutualFund> {
  protected tableName = 'mutual_funds';

  /**
   * Find funds by category
   */
  async findByCategory(category: string): Promise<MutualFund[]> {
    return this.list({ category });
  }

  /**
   * Find funds by fund house
   */
  async findByFundHouse(fundHouse: string): Promise<MutualFund[]> {
    return this.list({ fund_house: fundHouse });
  }

  /**
   * Find funds by risk level
   */
  async findByRiskLevel(riskLevel: string): Promise<MutualFund[]> {
    return this.list({ risk_level: riskLevel });
  }

  /**
   * Find top performers by returns
   */
  async findTopPerformers(period: '1y' | '3y' | '5y' = '3y', limit: number = 10): Promise<MutualFund[]> {
    try {
      const returnField = `returns_${period}`;
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .order(returnField, { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data as MutualFund[]) || [];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find low-cost funds (expense ratio < 1%)
   */
  async findLowCostFunds(): Promise<MutualFund[]> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .lt('expense_ratio', 1.0)
        .order('expense_ratio', { ascending: true });

      if (error) throw error;
      return (data as MutualFund[]) || [];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find funds with minimum SIP amount
   */
  async findBySIPAmount(maxAmount: number): Promise<MutualFund[]> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .lte('min_investment', maxAmount)
        .order('rating', { ascending: false });

      if (error) throw error;
      return (data as MutualFund[]) || [];
    } catch (error) {
      throw error;
    }
  }
}

// Singleton instance
export const mutualFundService = new MutualFundService();
