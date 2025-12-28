import { createClient } from "@/lib/supabase/client";

// Define Types
export type Author = {
    name: string;
    avatar_url?: string;
    bio?: string;
};

export type Category = {
    name: string;
    slug: string;
};

export type Post = {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    date: string;
    featured_image?: string;
    author: Author;
    category?: Category;
};

// Fetch list of posts
export async function getPosts() {
    const supabase = createClient();

    const { data: posts, error } = await supabase
        .from('articles')
        .select(`
            id,
            title,
            slug,
            excerpt,
            published_at,
            featured_image,
            authors (name, avatar_url),
            categories (name, slug)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

    if (error) {
        // Silently return empty array - page will render with empty state
        return [];
    }

    // Map Supabase result to strict Post type
    return posts.map((p: any) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        content: "", // List view doesn't need content
        date: p.published_at,
        featured_image: p.featured_image,
        author: {
            name: (Array.isArray(p.authors) ? p.authors[0]?.name : p.authors?.name) || "InvestingPro Editor",
            avatar_url: Array.isArray(p.authors) ? p.authors[0]?.avatar_url : p.authors?.avatar_url
        },
        category: p.categories ? {
            name: Array.isArray(p.categories) ? p.categories[0]?.name : p.categories.name,
            slug: Array.isArray(p.categories) ? p.categories[0]?.slug : p.categories.slug
        } : undefined
    }));
}

// Fetch single post by slug
export async function getPostBySlug(slug: string) {
    const supabase = createClient();

    const { data: post, error } = await supabase
        .from('articles')
        .select(`
            id,
            title,
            slug,
            excerpt,
            content,
            published_at,
            featured_image,
            meta_title,
            meta_description,
            authors (name, avatar_url, bio),
            categories (name, slug)
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

    if (error || !post) {
        return null;
    }

    const p = post as any;

    return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        content: p.content,
        date: p.published_at,
        featured_image: p.featured_image,
        meta_title: p.meta_title,
        meta_description: p.meta_description,
        author: {
            name: (Array.isArray(p.authors) ? p.authors[0]?.name : p.authors?.name) || "InvestingPro Editor",
            avatar_url: Array.isArray(p.authors) ? p.authors[0]?.avatar_url : p.authors?.avatar_url,
            bio: Array.isArray(p.authors) ? p.authors[0]?.bio : p.authors?.bio
        },
        category: p.categories ? {
            name: Array.isArray(p.categories) ? p.categories[0]?.name : p.categories.name,
            slug: Array.isArray(p.categories) ? p.categories[0]?.slug : p.categories.slug
        } : undefined
    };
}
