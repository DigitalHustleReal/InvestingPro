/**
 * Content Assignments API
 * 
 * Manages content review workflow for editorial QA
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - List content assignments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending_review';
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const supabase = await createClient();

    let query = supabase
      .from('content_assignments')
      .select(`
        id,
        status,
        priority,
        review_notes,
        created_at,
        updated_at,
        article:articles(id, title, slug, category, word_count, status),
        author:authors!content_assignments_author_id_fkey(id, name),
        editor:authors!content_assignments_editor_id_fkey(id, name)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Transform data for frontend
    const assignments = data?.map((item: any) => ({
      id: item.id,
      article_id: item.article?.id,
      article_title: item.article?.title || 'Untitled',
      article_slug: item.article?.slug,
      category: item.article?.category || 'uncategorized',
      word_count: item.article?.word_count || 0,
      status: item.status,
      priority: item.priority || 'medium',
      author_name: item.author?.name || 'AI Author',
      editor_name: item.editor?.name || null,
      review_notes: item.review_notes,
      created_at: item.created_at,
      updated_at: item.updated_at,
    })) || [];

    return NextResponse.json(assignments);
  } catch (error) {
    console.error('[API] Content assignments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assignments' },
      { status: 500 }
    );
  }
}
