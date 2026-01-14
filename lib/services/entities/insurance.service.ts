/**
 * Insurance Service
 * 
 * Purpose: Domain-specific service for insurance product operations
 */

import { BaseEntityService } from './base-entity.service';

export interface Insurance {
  id: string;
  name: string;
  provider: string;
  type: string; // 'life', 'health', 'term', 'vehicle'
  coverage_amount: number;
  premium_monthly: number;
  premium_yearly: number;
  features: string[];
  claim_settlement_ratio: number;
  rating: number;
  created_at: string;
  updated_at: string;
}

export class InsuranceService extends BaseEntityService<Insurance> {
  protected tableName = 'insurance';

  /**
   * Find insurance by type
   */
  async findByType(type: string): Promise<Insurance[]> {
    return this.list({ type });
  }

  /**
   * Find insurance by provider
   */
  async findByProvider(provider: string): Promise<Insurance[]> {
    return this.list({ provider });
  }

  /**
   * Find affordable insurance (monthly premium < threshold)
   */
  async findAffordable(maxMonthlyPremium: number): Promise<Insurance[]> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .lte('premium_monthly', maxMonthlyPremium)
        .order('premium_monthly', { ascending: true });

      if (error) throw error;
      return (data as Insurance[]) || [];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find high claim settlement ratio providers
   */
  async findHighClaimSettlement(minRatio: number = 90): Promise<Insurance[]> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .gte('claim_settlement_ratio', minRatio)
        .order('claim_settlement_ratio', { ascending: false });

      if (error) throw error;
      return (data as Insurance[]) || [];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find top-rated insurance products
   */
  async findTopRated(limit: number = 10): Promise<Insurance[]> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .order('rating', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data as Insurance[]) || [];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find insurance by coverage amount range
   */
  async findByCoverageRange(minCoverage: number, maxCoverage: number): Promise<Insurance[]> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .gte('coverage_amount', minCoverage)
        .lte('coverage_amount', maxCoverage)
        .order('coverage_amount', { ascending: true });

      if (error) throw error;
      return (data as Insurance[]) || [];
    } catch (error) {
      throw error;
    }
  }
}

// Singleton instance
export const insuranceService = new InsuranceService();
