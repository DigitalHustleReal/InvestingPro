/**
 * Approval Queue System
 * 
 * Purpose: Queue autonomous actions for human review and approval.
 * Authors can review, approve, reject, or modify AI-generated content.
 */

import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';
import { publishEvent, SystemEvent } from '@/lib/infrastructure/event-bus/event-bus';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'modified';
export type ApprovalType = 'content_creation' | 'content_update' | 'content_improvement' | 'ab_test_promotion' | 'data_change';

export interface ApprovalRequest {
  id: string;
  type: ApprovalType;
  status: ApprovalStatus;
  
  // Request details
  title: string;
  description: string;
  reason: string;
  
  // Content data
  data: any; // The actual content/change to review
  metadata?: Record<string, any>;
  
  // AI confidence
  aiConfidence: number;
  qualityScore?: number;
  
  // Timestamps
  createdAt: number;
  reviewedAt?: number;
  
  // Reviewer
  reviewedBy?: string;
  reviewNotes?: string;
  
  // Priority
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

class ApprovalQueue {
  private supabase = createClient();

  /**
   * Add item to approval queue
   */
  async addToQueue(params: {
    type: ApprovalType;
    title: string;
    description: string;
    reason: string;
    data: any;
    aiConfidence: number;
    qualityScore?: number;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    metadata?: Record<string, any>;
  }): Promise<ApprovalRequest> {
    const request: ApprovalRequest = {
      id: this.generateId(),
      type: params.type,
      status: 'pending',
      title: params.title,
      description: params.description,
      reason: params.reason,
      data: params.data,
      metadata: params.metadata,
      aiConfidence: params.aiConfidence,
      qualityScore: params.qualityScore,
      priority: params.priority || 'medium',
      createdAt: Date.now()
    };

    try {
      await this.supabase
        .from('approval_queue')
        .insert({
          id: request.id,
          type: request.type,
          status: request.status,
          title: request.title,
          description: request.description,
          reason: request.reason,
          data: request.data,
          metadata: request.metadata,
          ai_confidence: request.aiConfidence,
          quality_score: request.qualityScore,
          priority: request.priority,
          created_at: new Date(request.createdAt).toISOString()
        });

      logger.info(`Added to approval queue: ${request.title}`);
      return request;
    } catch (error) {
      logger.error('Error adding to approval queue', error as Error);
      throw error;
    }
  }

  /**
   * Get pending approvals
   */
  async getPending(type?: ApprovalType, limit: number = 50): Promise<ApprovalRequest[]> {
    try {
      let query = this.supabase
        .from('approval_queue')
        .select('*')
        .eq('status', 'pending')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true })
        .limit(limit);

      if (type) {
        query = query.eq('type', type);
      }

      const { data } = await query;

      if (!data) return [];

      return data.map((d: any) => this.mapToApprovalRequest(d));
    } catch (error) {
      logger.error('Error getting pending approvals', error as Error);
      return [];
    }
  }

  /**
   * Approve request
   */
  async approve(requestId: string, reviewerId: string, notes?: string): Promise<void> {
    try {
      const { data: request } = await this.supabase
        .from('approval_queue')
        .select('*')
        .eq('id', requestId)
        .single();

      if (!request) {
        throw new Error('Approval request not found');
      }

      // Update status
      await this.supabase
        .from('approval_queue')
        .update({
          status: 'approved',
          reviewed_by: reviewerId,
          review_notes: notes,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', requestId);

      // Execute the approved action
      await this.executeApprovedAction(request);

      logger.info(`Approved request: ${requestId}`);
    } catch (error) {
      logger.error('Error approving request', error as Error);
      throw error;
    }
  }

  /**
   * Reject request
   */
  async reject(requestId: string, reviewerId: string, notes: string): Promise<void> {
    try {
      await this.supabase
        .from('approval_queue')
        .update({
          status: 'rejected',
          reviewed_by: reviewerId,
          review_notes: notes,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', requestId);

      logger.info(`Rejected request: ${requestId}`);
    } catch (error) {
      logger.error('Error rejecting request', error as Error);
      throw error;
    }
  }

  /**
   * Modify and approve request
   */
  async modifyAndApprove(
    requestId: string,
    reviewerId: string,
    modifiedData: any,
    notes?: string
  ): Promise<void> {
    try {
      const { data: request } = await this.supabase
        .from('approval_queue')
        .select('*')
        .eq('id', requestId)
        .single();

      if (!request) {
        throw new Error('Approval request not found');
      }

      // Update with modified data
      await this.supabase
        .from('approval_queue')
        .update({
          status: 'modified',
          data: modifiedData,
          reviewed_by: reviewerId,
          review_notes: notes,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', requestId);

      // Execute with modified data
      await this.executeApprovedAction({ ...request, data: modifiedData });

      logger.info(`Modified and approved request: ${requestId}`);
    } catch (error) {
      logger.error('Error modifying request', error as Error);
      throw error;
    }
  }

  /**
   * Execute approved action
   */
  private async executeApprovedAction(request: any): Promise<void> {
    try {
      switch (request.type) {
        case 'content_creation':
          await this.executeContentCreation(request.data);
          break;
        case 'content_update':
          await this.executeContentUpdate(request.data);
          break;
        case 'content_improvement':
          await this.executeContentImprovement(request.data);
          break;
        case 'ab_test_promotion':
          await this.executeABTestPromotion(request.data);
          break;
        case 'data_change':
          await this.executeDataChange(request.data);
          break;
      }
    } catch (error) {
      logger.error('Error executing approved action', error as Error);
      throw error;
    }
  }

  /**
   * Execute content creation
   */
  private async executeContentCreation(data: any): Promise<void> {
    // Publish article
    await this.supabase
      .from('articles')
      .insert({
        ...data,
        status: 'published',
        published_at: new Date().toISOString()
      });

    await publishEvent(
      SystemEvent.ARTICLE_PUBLISHED,
      { articleId: data.id, title: data.title },
      'approval-queue'
    );
  }

  /**
   * Execute content update
   */
  private async executeContentUpdate(data: any): Promise<void> {
    await this.supabase
      .from('articles')
      .update({
        content: data.content,
        updated_at: new Date().toISOString()
      })
      .eq('id', data.articleId);

    await publishEvent(
      SystemEvent.CONTENT_UPDATED,
      { articleId: data.articleId },
      'approval-queue'
    );
  }

  /**
   * Execute content improvement
   */
  private async executeContentImprovement(data: any): Promise<void> {
    await this.executeContentUpdate(data);
  }

  /**
   * Execute A/B test promotion
   */
  private async executeABTestPromotion(data: any): Promise<void> {
    await this.supabase
      .from('articles')
      .update({
        title: data.winningTitle,
        meta_description: data.winningMeta
      })
      .eq('id', data.articleId);
  }

  /**
   * Execute data change
   */
  private async executeDataChange(data: any): Promise<void> {
    // Apply data changes to database
    // Implementation depends on data type
  }

  /**
   * Get queue statistics
   */
  async getStats(): Promise<{
    pending: number;
    approved: number;
    rejected: number;
    byType: Record<ApprovalType, number>;
  }> {
    try {
      const { data } = await this.supabase
        .from('approval_queue')
        .select('type, status');

      if (!data) {
        return { pending: 0, approved: 0, rejected: 0, byType: {} as any };
      }

      const stats = {
        pending: data.filter((d: any) => d.status === 'pending').length,
        approved: data.filter((d: any) => d.status === 'approved').length,
        rejected: data.filter((d: any) => d.status === 'rejected').length,
        byType: {} as Record<ApprovalType, number>
      };

      // Count by type
      data.forEach((d: any) => {
        stats.byType[d.type as ApprovalType] = (stats.byType[d.type as ApprovalType] || 0) + 1;
      });

      return stats;
    } catch (error) {
      logger.error('Error getting queue stats', error as Error);
      return { pending: 0, approved: 0, rejected: 0, byType: {} as any };
    }
  }

  /**
   * Helper: Map database record to ApprovalRequest
   */
  private mapToApprovalRequest(data: any): ApprovalRequest {
    return {
      id: data.id,
      type: data.type,
      status: data.status,
      title: data.title,
      description: data.description,
      reason: data.reason,
      data: data.data,
      metadata: data.metadata,
      aiConfidence: data.ai_confidence,
      qualityScore: data.quality_score,
      priority: data.priority,
      createdAt: new Date(data.created_at).getTime(),
      reviewedAt: data.reviewed_at ? new Date(data.reviewed_at).getTime() : undefined,
      reviewedBy: data.reviewed_by,
      reviewNotes: data.review_notes
    };
  }

  /**
   * Helper: Generate unique ID
   */
  private generateId(): string {
    return `approval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Singleton instance
export const approvalQueue = new ApprovalQueue();
