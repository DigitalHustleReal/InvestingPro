"use client";

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formatDistanceToNow } from 'date-fns';

interface ArticlePreviewProps {
    article: {
        title: string;
        content: string; // Markdown or HTML
        excerpt?: string;
        featured_image?: string;
        author?: {
            name: string;
            avatar_url?: string;
        };
        category?: string;
        tags?: string[];
        created_at?: string;
        read_time?: number;
    };
    mode?: 'mobile' | 'tablet' | 'desktop';
}

export function ArticlePreview({ article, mode = 'desktop' }: ArticlePreviewProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary-600"></div>
            </div>
        );
    }

    // Responsive container classes
    const containerClasses = {
        mobile: 'max-w-[375px]',
        tablet: 'max-w-[768px]',
        desktop: 'max-w-4xl'
    };

    const readTime = article.read_time || Math.ceil((article.content?.length || 0) / 1000);

    return (
        <div className={`mx-auto ${containerClasses[mode]} transition-all duration-300`}>
            {/* Article Container */}
            <article className="bg-white shadow-sm rounded-lg overflow-hidden">
                {/* Featured Image */}
                {article.featured_image && (
                    <div className="aspect-[16/9] relative overflow-hidden bg-gray-100">
                        <img
                            src={article.featured_image}
                            alt={article.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Article Header */}
                <div className="p-6 md:p-8">
                    {/* Category & Read Time */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        {article.category && (
                            <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full font-medium">
                                {article.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                        )}
                        <span>{readTime} min read</span>
                        {article.created_at && (
                            <span>• {formatDistanceToNow(new Date(article.created_at), { addSuffix: true })}</span>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                        {article.title || 'Untitled Article'}
                    </h1>

                    {/* Excerpt */}
                    {article.excerpt && (
                        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                            {article.excerpt}
                        </p>
                    )}

                    {/* Author */}
                    {article.author && (
                        <div className="flex items-center gap-3 pb-6 mb-6 border-b border-gray-200">
                            {article.author.avatar_url ? (
                                <img
                                    src={article.author.avatar_url}
                                    alt={article.author.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-secondary-600 flex items-center justify-center text-white font-semibold">
                                    {article.author.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <div className="font-medium text-gray-900">{article.author.name}</div>
                                <div className="text-sm text-gray-600">Author</div>
                            </div>
                        </div>
                    )}

                    {/* Article Content */}
                    <div className="prose prose-lg max-w-none">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                // Customize heading styles
                                h1: ({ children }) => (
                                    <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>
                                ),
                                h2: ({ children }) => (
                                    <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>
                                ),
                                h3: ({ children }) => (
                                    <h3 className="text-xl font-semibold mt-5 mb-2">{children}</h3>
                                ),
                                // Customize paragraph spacing
                                p: ({ children }) => (
                                    <p className="mb-4 leading-relaxed text-gray-700">{children}</p>
                                ),
                                // Format lists
                                ul: ({ children }) => (
                                    <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>
                                ),
                                ol: ({ children }) => (
                                    <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>
                                ),
                                // Style links
                                a: ({ href, children }) => (
                                    <a
                                        href={href}
                                        className="text-secondary-600 hover:text-secondary-700 underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {children}
                                    </a>
                                ),
                                // Style blockquotes
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-4 border-secondary-500 pl-4 italic text-gray-700 my-4">
                                        {children}
                                    </blockquote>
                                ),
                                // Style code blocks
                                code: ({ className, children }) => {
                                    const isInline = !className;
                                    return isInline ? (
                                        <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-red-600">
                                            {children}
                                        </code>
                                    ) : (
                                        <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                                            {children}
                                        </code>
                                    );
                                },
                                // Format images
                                img: ({ src, alt }) => (
                                    <img
                                        src={src}
                                        alt={alt}
                                        className="rounded-lg my-6 w-full"
                                    />
                                ),
                            }}
                        >
                            {article.content || '*No content yet*'}
                        </ReactMarkdown>
                    </div>

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex flex-wrap gap-2">
                                {article.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </article>
        </div>
    );
}
