import { createClient } from '@/lib/supabase/client';

export interface Author {
    id: string;
    name: string;
    slug: string;
    role: 'author' | 'editor';
    title: string;
    bio: string;
    credentials: string[];
    expertiseAreas: string[];
    
    // Social
    linkedinUrl?: string;
    twitterHandle?: string;
    instagramHandle?: string;
    mediumUrl?: string;
    
    // Profile
    photoUrl?: string;
    email?: string;
    location?: string;
    yearsExperience?: number;
    
    // AI Config
    isAiPersona: boolean;
    aiSystemPrompt?: string;
    aiModel?: string;
    
    // Categories
    assignedCategories: string[];
    primaryCategory: string;
    
    // Stats
    totalArticles: number;
    totalGlossaryTerms: number;
    totalReviews: number;
    
    // Status
    active: boolean;
    featured: boolean;
    
    createdAt: string;
    updatedAt: string;
}

export interface ContentAssignment {
    id: string;
    contentType: 'glossary_term' | 'blog_post' | 'comparison';
    contentId: string;
    authorId: string;
    editorId: string;
    category: string;
    status: 'assigned' | 'drafted' | 'reviewed' | 'approved' | 'published';
    qualityScore?: number;
    revisionCount: number;
    notes?: string;
}

/**
 * CMS Authors Management Service
 */
export class AuthorsService {
    private supabase = createClient();
    
    /**
     * Get all authors
     */
    async getAllAuthors(filters?: {
        role?: 'author' | 'editor';
        active?: boolean;
        category?: string;
    }): Promise<Author[]> {
        let query = this.supabase
            .from('authors')
            .select('*');
        
        if (filters?.role) {
            query = query.eq('role', filters.role);
        }
        
        if (filters?.active !== undefined) {
            query = query.eq('active', filters.active);
        }
        
        if (filters?.category) {
            query = query.contains('assigned_categories', [filters.category]);
        }
        
        const { data, error } = await query.order('featured', { ascending: false });
        
        if (error) throw error;
        
        return this.mapToAuthors(data || []);
    }
    
    /**
     * Get author by ID
     */
    async getAuthorById(id: string): Promise<Author | null> {
        const { data, error } = await this.supabase
            .from('authors')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) return null;
        
        return this.mapToAuthor(data);
    }
    
    /**
     * Get author by slug
     */
    async getAuthorBySlug(slug: string): Promise<Author | null> {
        const { data, error } = await this.supabase
            .from('authors')
            .select('*')
            .eq('slug', slug)
            .single();
        
        if (error) return null;
        
        return this.mapToAuthor(data);
    }
    
    /**
     * Get authors for category (auto-assignment)
     */
    async getAuthorsForCategory(category: string): Promise<{
        author: Author | null;
        editor: Author | null;
    }> {
        // Get author specialized in this category
        const { data: authorData } = await this.supabase
            .from('authors')
            .select('*')
            .eq('role', 'author')
            .eq('active', true)
            .contains('assigned_categories', [category])
            .order('total_articles', { ascending: true })
            .limit(1)
            .single();
        
        // Get editor (usually Rajesh)
        const { data: editorData } = await this.supabase
            .from('authors')
            .select('*')
            .eq('role', 'editor')
            .eq('active', true)
            .order('total_reviews', { ascending: true })
            .limit(1)
            .single();
        
        return {
            author: authorData ? this.mapToAuthor(authorData) : null,
            editor: editorData ? this.mapToAuthor(editorData) : null
        };
    }
    
    /**
     * Create content assignment
     */
    async assignContent(params: {
        contentType: 'glossary_term' | 'blog_post';
        contentId: string;
        category: string;
        authorId?: string;
        editorId?: string;
    }): Promise<ContentAssignment> {
        // Auto-assign if not provided
        let authorId = params.authorId;
        let editorId = params.editorId;
        
        if (!authorId || !editorId) {
            const assigned = await this.getAuthorsForCategory(params.category);
            authorId = authorId || assigned.author?.id;
            editorId = editorId || assigned.editor?.id;
        }
        
        if (!authorId || !editorId) {
            throw new Error('Could not auto-assign authors');
        }
        
        const { data, error } = await this.supabase
            .from('content_assignments')
            .insert({
                content_type: params.contentType,
                content_id: params.contentId,
                author_id: authorId,
                editor_id: editorId,
                category: params.category,
                status: 'assigned'
            })
            .select()
            .single();
        
        if (error) throw error;
        
        return this.mapToAssignment(data);
    }
    
    /**
     * Update content assignment status
     */
    async updateAssignmentStatus(
        assignmentId: string,
        status: ContentAssignment['status'],
        qualityScore?: number
    ): Promise<void> {
        const updates: any = { status };
        
        if (status === 'drafted') updates.drafted_at = new Date().toISOString();
        if (status === 'reviewed') updates.reviewed_at = new Date().toISOString();
        if (status === 'approved') updates.approved_at = new Date().toISOString();
        if (status === 'published') updates.published_at = new Date().toISOString();
        
        if (qualityScore !== undefined) {
            updates.quality_score = qualityScore;
        }
        
        const { error } = await this.supabase
            .from('content_assignments')
            .update(updates)
            .eq('id', assignmentId);
        
        if (error) throw error;
    }
    
    /**
     * Get author statistics
     */
    async getAuthorStats(authorId: string): Promise<{
        glossaryCount: number;
        blogCount: number;
        avgGlossaryViews: number;
        avgBlogViews: number;
        totalViews: number;
    }> {
        const { data, error } = await this.supabase
            .from('author_stats')
            .select('*')
            .eq('id', authorId)
            .single();
        
        if (error) {
            return {
                glossaryCount: 0,
                blogCount: 0,
                avgGlossaryViews: 0,
                avgBlogViews: 0,
                totalViews: 0
            };
        }
        
        return {
            glossaryCount: data.glossary_count || 0,
            blogCount: data.blog_count || 0,
            avgGlossaryViews: Math.round(data.avg_glossary_views || 0),
            avgBlogViews: Math.round(data.avg_blog_views || 0),
            totalViews: Math.round(
                (data.glossary_count * data.avg_glossary_views) +
                (data.blog_count * data.avg_blog_views)
            )
        };
    }
    
    /**
     * Get content by author
     */
    async getContentByAuthor(authorId: string, type?: 'glossary' | 'blog'): Promise<{
        glossaryTerms: any[];
        blogPosts: any[];
    }> {
        const result: any = {
            glossaryTerms: [],
            blogPosts: []
        };
        
        if (!type || type === 'glossary') {
            const { data: glossary } = await this.supabase
                .from('glossary_terms')
                .select('*')
                .eq('author_id', authorId)
                .eq('published', true)
                .order('created_at', { ascending: false });
            
            result.glossaryTerms = glossary || [];
        }
        
        if (!type || type === 'blog') {
            const { data: blog } = await this.supabase
                .from('blog_posts')
                .select('*')
                .eq('author_id', authorId)
                .eq('published', true)
                .order('published_at', { ascending: false });
            
            result.blogPosts = blog || [];
        }
        
        return result;
    }
    
    /**
     * Map database row to Author interface
     */
    private mapToAuthor(data: any): Author {
        return {
            id: data.id,
            name: data.name,
            slug: data.slug,
            role: data.role,
            title: data.title,
            bio: data.bio,
            credentials: data.credentials || [],
            expertiseAreas: data.expertise_areas || [],
            linkedinUrl: data.linkedin_url,
            twitterHandle: data.twitter_handle,
            instagramHandle: data.instagram_handle,
            mediumUrl: data.medium_url,
            photoUrl: data.photo_url,
            email: data.email,
            location: data.location,
            yearsExperience: data.years_experience,
            isAiPersona: data.is_ai_persona,
            aiSystemPrompt: data.ai_system_prompt,
            aiModel: data.ai_model,
            assignedCategories: data.assigned_categories || [],
            primaryCategory: data.primary_category,
            totalArticles: data.total_articles || 0,
            totalGlossaryTerms: data.total_glossary_terms || 0,
            totalReviews: data.total_reviews || 0,
            active: data.active,
            featured: data.featured,
            createdAt: data.created_at,
            updatedAt: data.updated_at
        };
    }
    
    private mapToAuthors(data: any[]): Author[] {
        return data.map(d => this.mapToAuthor(d));
    }
    
    private mapToAssignment(data: any): ContentAssignment {
        return {
            id: data.id,
            contentType: data.content_type,
            contentId: data.content_id,
            authorId: data.author_id,
            editorId: data.editor_id,
            category: data.category,
            status: data.status,
            qualityScore: data.quality_score,
            revisionCount: data.revision_count || 0,
            notes: data.notes
        };
    }
}

// Singleton export
export const authorsService = new AuthorsService();
