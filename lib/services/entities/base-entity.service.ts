/**
 * Base Entity Service
 * 
 * Purpose: Abstract base class for all entity services with common CRUD operations
 */

import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';

export abstract class BaseEntityService<T> {
  protected abstract tableName: string;
  protected supabase = createClient();

  /**
   * List all entities with optional filters
   */
  async list(filters?: Record<string, any>): Promise<T[]> {
    try {
      let query = this.supabase.from(this.tableName).select('*');

      // Apply filters if provided
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }

      const { data, error } = await query;

      if (error) {
        logger.error(`Error listing ${this.tableName}`, error);
        throw error;
      }

      return (data as T[]) || [];
    } catch (error) {
      logger.error(`Failed to list ${this.tableName}`, error as Error);
      throw error;
    }
  }

  /**
   * Get entity by ID
   */
  async getById(id: string): Promise<T | null> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Not found
          return null;
        }
        logger.error(`Error getting ${this.tableName} by ID`, error);
        throw error;
      }

      return data as T;
    } catch (error) {
      logger.error(`Failed to get ${this.tableName} by ID: ${id}`, error as Error);
      throw error;
    }
  }

  /**
   * Create new entity
   */
  async create(data: Partial<T>): Promise<T> {
    try {
      const { data: created, error } = await this.supabase
        .from(this.tableName)
        .insert(data as any)
        .select()
        .single();

      if (error) {
        logger.error(`Error creating ${this.tableName}`, error);
        throw error;
      }

      logger.info(`Created ${this.tableName}:`, created.id);
      return created as T;
    } catch (error) {
      logger.error(`Failed to create ${this.tableName}`, error as Error);
      throw error;
    }
  }

  /**
   * Update entity by ID
   */
  async update(id: string, data: Partial<T>): Promise<T> {
    try {
      const { data: updated, error } = await this.supabase
        .from(this.tableName)
        .update(data as any)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error(`Error updating ${this.tableName}`, error);
        throw error;
      }

      logger.info(`Updated ${this.tableName}:`, id);
      return updated as T;
    } catch (error) {
      logger.error(`Failed to update ${this.tableName}: ${id}`, error as Error);
      throw error;
    }
  }

  /**
   * Delete entity by ID
   */
  async delete(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        logger.error(`Error deleting ${this.tableName}`, error);
        throw error;
      }

      logger.info(`Deleted ${this.tableName}:`, id);
    } catch (error) {
      logger.error(`Failed to delete ${this.tableName}: ${id}`, error as Error);
      throw error;
    }
  }

  /**
   * Search entities by text query
   */
  async search(query: string, searchFields: string[] = ['name', 'title']): Promise<T[]> {
    try {
      let dbQuery = this.supabase.from(this.tableName).select('*');

      // Build OR condition for multiple fields
      const orConditions = searchFields
        .map(field => `${field}.ilike.%${query}%`)
        .join(',');

      dbQuery = dbQuery.or(orConditions);

      const { data, error } = await dbQuery;

      if (error) {
        logger.error(`Error searching ${this.tableName}`, error);
        throw error;
      }

      return (data as T[]) || [];
    } catch (error) {
      logger.error(`Failed to search ${this.tableName}`, error as Error);
      throw error;
    }
  }

  /**
   * Count entities with optional filters
   */
  async count(filters?: Record<string, any>): Promise<number> {
    try {
      let query = this.supabase
        .from(this.tableName)
        .select('*', { count: 'exact', head: true });

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }

      const { count, error } = await query;

      if (error) {
        logger.error(`Error counting ${this.tableName}`, error);
        throw error;
      }

      return count || 0;
    } catch (error) {
      logger.error(`Failed to count ${this.tableName}`, error as Error);
      throw error;
    }
  }
}
