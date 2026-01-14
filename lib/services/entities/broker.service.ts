/**
 * Broker Service
 * 
 * Purpose: Domain-specific service for broker/demat account operations
 */

import { BaseEntityService } from './base-entity.service';

export interface Broker {
  id: string;
  name: string;
  type: string;
  account_opening_fee: number;
  annual_maintenance_charge: number;
  equity_delivery_brokerage: number;
  equity_intraday_brokerage: number;
  features: string[];
  platforms: string[];
  rating: number;
  created_at: string;
  updated_at: string;
}

export class BrokerService extends BaseEntityService<Broker> {
  protected tableName = 'brokers';

  /**
   * Find brokers by type
   */
  async findByType(type: string): Promise<Broker[]> {
    return this.list({ type });
  }

  /**
   * Find zero-brokerage brokers
   */
  async findZeroBrokerage(): Promise<Broker[]> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('equity_delivery_brokerage', 0)
        .order('rating', { ascending: false });

      if (error) throw error;
      return (data as Broker[]) || [];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find low-cost brokers
   */
  async findLowCost(): Promise<Broker[]> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .lte('account_opening_fee', 500)
        .lte('annual_maintenance_charge', 500)
        .order('annual_maintenance_charge', { ascending: true });

      if (error) throw error;
      return (data as Broker[]) || [];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find top-rated brokers
   */
  async findTopRated(limit: number = 10): Promise<Broker[]> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .order('rating', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data as Broker[]) || [];
    } catch (error) {
      throw error;
    }
  }
}

// Singleton instance
export const brokerService = new BrokerService();
