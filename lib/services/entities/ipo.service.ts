/**
 * IPO Service
 * 
 * Purpose: Domain-specific service for IPO operations
 */

import { BaseEntityService } from './base-entity.service';

export interface IPO {
  id: string;
  company_name: string;
  issue_size: number;
  price_band_min: number;
  price_band_max: number;
  lot_size: number;
  open_date: string;
  close_date: string;
  listing_date: string;
  status: string; // 'upcoming', 'live', 'closed', 'listed'
  subscription_times: number;
  grey_market_premium: number;
  rating: number;
  created_at: string;
  updated_at: string;
}

export class IPOService extends BaseEntityService<IPO> {
  protected tableName = 'ipos';

  /**
   * Find IPOs by status
   */
  async findByStatus(status: string): Promise<IPO[]> {
    return this.list({ status });
  }

  /**
   * Find upcoming IPOs
   */
  async findUpcoming(): Promise<IPO[]> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('status', 'upcoming')
        .order('open_date', { ascending: true });

      if (error) throw error;
      return (data as IPO[]) || [];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find live IPOs (currently open for subscription)
   */
  async findLive(): Promise<IPO[]> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('status', 'live')
        .order('close_date', { ascending: true });

      if (error) throw error;
      return (data as IPO[]) || [];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find recently closed IPOs
   */
  async findRecentlyClosed(limit: number = 10): Promise<IPO[]> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('status', 'closed')
        .order('close_date', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data as IPO[]) || [];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find oversubscribed IPOs
   */
  async findOversubscribed(minTimes: number = 1): Promise<IPO[]> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .gt('subscription_times', minTimes)
        .order('subscription_times', { ascending: false });

      if (error) throw error;
      return (data as IPO[]) || [];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find IPOs with positive GMP
   */
  async findPositiveGMP(): Promise<IPO[]> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .gt('grey_market_premium', 0)
        .order('grey_market_premium', { ascending: false });

      if (error) throw error;
      return (data as IPO[]) || [];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find top-rated IPOs
   */
  async findTopRated(limit: number = 10): Promise<IPO[]> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .order('rating', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data as IPO[]) || [];
    } catch (error) {
      throw error;
    }
  }
}

// Singleton instance
export const ipoService = new IPOService();
