/**
 * Loan Service
 * 
 * Purpose: Domain-specific service for loan product operations
 */

import { BaseEntityService } from './base-entity.service';

export interface Loan {
  id: string;
  name: string;
  lender: string;
  type: string; // 'personal', 'home', 'car', 'education', 'business'
  interest_rate: number;
  processing_fee: number;
  max_loan_amount: number;
  min_loan_amount: number;
  tenure_min: number; // months
  tenure_max: number; // months
  features: string[];
  rating: number;
  created_at: string;
  updated_at: string;
}

export class LoanService extends BaseEntityService<Loan> {
  protected tableName = 'loans';

  /**
   * Find loans by type
   */
  async findByType(type: string): Promise<Loan[]> {
    return this.list({ type });
  }

  /**
   * Find loans by lender
   */
  async findByLender(lender: string): Promise<Loan[]> {
    return this.list({ lender });
  }

  /**
   * Find low-interest loans
   */
  async findLowInterest(maxRate: number = 10): Promise<Loan[]> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .lte('interest_rate', maxRate)
        .order('interest_rate', { ascending: true });

      if (error) throw error;
      return (data as Loan[]) || [];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find zero processing fee loans
   */
  async findZeroProcessingFee(): Promise<Loan[]> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('processing_fee', 0)
        .order('interest_rate', { ascending: true });

      if (error) throw error;
      return (data as Loan[]) || [];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find loans by amount range
   */
  async findByAmountRange(minAmount: number, maxAmount: number): Promise<Loan[]> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .gte('max_loan_amount', minAmount)
        .lte('min_loan_amount', maxAmount)
        .order('interest_rate', { ascending: true });

      if (error) throw error;
      return (data as Loan[]) || [];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find top-rated loans
   */
  async findTopRated(limit: number = 10): Promise<Loan[]> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .order('rating', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data as Loan[]) || [];
    } catch (error) {
      throw error;
    }
  }
}

// Singleton instance
export const loanService = new LoanService();
