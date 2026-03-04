/**
 * Reject Content Assignment API
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { reason } = await request.json();

    if (!reason) {
      return NextResponse.json(
        { error: 'Rejection reason is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Update assignment status with rejection notes
    const { data: assignment, error: assignmentError } = await supabase
      .from('content_assignments')
      .update({
        status: 'rejected',
        review_notes: reason,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('article_id')
      .single();

    if (assignmentError) throw assignmentError;

    // Update article status back to draft
    if (assignment?.article_id) {
      await supabase
        .from('articles')
        .update({
          status: 'draft',
          updated_at: new Date().toISOString(),
        })
        .eq('id', assignment.article_id);
    }

    return NextResponse.json({ success: true, message: 'Content rejected with feedback' });
  } catch (error) {
    logger.error('[API] Reject error:', error);
    return NextResponse.json(
      { error: 'Failed to reject content' },
      { status: 500 }
    );
  }
}
