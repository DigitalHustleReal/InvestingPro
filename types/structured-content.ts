/**
 * Structured Content Format
 * 
 * CMS Specification: AI output must be structured JSON
 * This format enables programmatic processing and automation
 */

export interface StructuredHeading {
    level: 1 | 2 | 3 | 4 | 5 | 6;
    text: string;
    id?: string; // Optional ID for linking
}

export interface StructuredSection {
    heading_id?: number | string; // Reference to headings array index or heading ID
    content: string; // Markdown or HTML content
    order: number;
}

export interface StructuredTable {
    title: string;
    headers: string[];
    rows: string[][]; // Array of row arrays
    caption?: string;
}

export interface StructuredFAQ {
    question: string;
    answer: string;
}

export interface StructuredLink {
    text: string;
    url: string;
    type: 'internal' | 'external';
    anchor?: string; // Optional anchor text override
}

export interface StructuredImage {
    placeholder: string; // Description of image needed
    alt: string;
    position: string; // e.g., "after_section_1", "header", "inline"
    caption?: string;
}

export interface StructuredContent {
    // Core Content
    title: string;
    excerpt: string;
    
    // Structured Components
    headings: StructuredHeading[];
    sections: StructuredSection[];
    tables?: StructuredTable[];
    faqs?: StructuredFAQ[];
    links?: StructuredLink[];
    images?: StructuredImage[];
    
    // SEO Metadata
    seo_title?: string;
    seo_description?: string;
    tags?: string[];
    keywords?: string[];
    
    // Metadata
    read_time?: number;
    word_count?: number;
    
    // Legacy support (for backward compatibility during transition)
    content?: string; // Full markdown/HTML content (deprecated, use sections instead)
}

/**
 * Convert structured content to markdown (for backward compatibility)
 */
export function structuredToMarkdown(structured: StructuredContent): string {
    let markdown = '';
    
    // Add title as H1
    if (structured.title) {
        markdown += `# ${structured.title}\n\n`;
    }
    
    // Add excerpt
    if (structured.excerpt) {
        markdown += `${structured.excerpt}\n\n`;
    }
    
    // Process sections with their headings
    structured.sections.forEach((section, index) => {
        // Find corresponding heading
        const headingIndex = typeof section.heading_id === 'number' 
            ? section.heading_id 
            : structured.headings.findIndex(h => h.id === section.heading_id);
        
        if (headingIndex >= 0 && headingIndex < structured.headings.length) {
            const heading = structured.headings[headingIndex];
            const headingPrefix = '#'.repeat(heading.level);
            markdown += `${headingPrefix} ${heading.text}\n\n`;
        }
        
        // Add section content
        markdown += `${section.content}\n\n`;
    });
    
    // Add tables
    if (structured.tables && structured.tables.length > 0) {
        structured.tables.forEach(table => {
            if (table.title) {
                markdown += `## ${table.title}\n\n`;
            }
            
            // Markdown table format
            if (table.headers && table.headers.length > 0) {
                markdown += `| ${table.headers.join(' | ')} |\n`;
                markdown += `| ${table.headers.map(() => '---').join(' | ')} |\n`;
                
                table.rows.forEach(row => {
                    markdown += `| ${row.join(' | ')} |\n`;
                });
                
                markdown += '\n';
            }
            
            if (table.caption) {
                markdown += `*${table.caption}*\n\n`;
            }
        });
    }
    
    // Add FAQs
    if (structured.faqs && structured.faqs.length > 0) {
        markdown += `## Frequently Asked Questions\n\n`;
        structured.faqs.forEach(faq => {
            markdown += `### ${faq.question}\n\n`;
            markdown += `${faq.answer}\n\n`;
        });
    }
    
    return markdown;
}

/**
 * Convert structured content to HTML (for rendering)
 */
export function structuredToHTML(structured: StructuredContent): string {
    let html = '';
    
    // Add title as H1
    if (structured.title) {
        html += `<h1>${structured.title}</h1>\n`;
    }
    
    // Add excerpt
    if (structured.excerpt) {
        html += `<p class="excerpt">${structured.excerpt}</p>\n`;
    }
    
    // Process sections with their headings
    structured.sections.forEach((section, index) => {
        // Find corresponding heading
        const headingIndex = typeof section.heading_id === 'number' 
            ? section.heading_id 
            : structured.headings.findIndex(h => h.id === section.heading_id);
        
        if (headingIndex >= 0 && headingIndex < structured.headings.length) {
            const heading = structured.headings[headingIndex];
            const headingId = heading.id || `heading-${headingIndex}`;
            html += `<h${heading.level} id="${headingId}">${heading.text}</h${heading.level}>\n`;
        }
        
        // Add section content (assumed to be markdown, would need markdown-to-HTML conversion)
        html += `<div class="section-content">${section.content}</div>\n`;
    });
    
    // Add tables
    if (structured.tables && structured.tables.length > 0) {
        structured.tables.forEach(table => {
            html += '<table>\n';
            
            if (table.title) {
                html += `<caption>${table.title}</caption>\n`;
            }
            
            if (table.headers && table.headers.length > 0) {
                html += '<thead><tr>\n';
                table.headers.forEach(header => {
                    html += `<th>${header}</th>\n`;
                });
                html += '</tr></thead>\n';
            }
            
            html += '<tbody>\n';
            table.rows.forEach(row => {
                html += '<tr>\n';
                row.forEach(cell => {
                    html += `<td>${cell}</td>\n`;
                });
                html += '</tr>\n';
            });
            html += '</tbody>\n';
            html += '</table>\n';
            
            if (table.caption) {
                html += `<p class="table-caption">${table.caption}</p>\n`;
            }
        });
    }
    
    // Add FAQs
    if (structured.faqs && structured.faqs.length > 0) {
        html += '<section class="faqs">\n<h2>Frequently Asked Questions</h2>\n';
        structured.faqs.forEach(faq => {
            html += `<div class="faq-item">\n`;
            html += `<h3>${faq.question}</h3>\n`;
            html += `<p>${faq.answer}</p>\n`;
            html += `</div>\n`;
        });
        html += '</section>\n';
    }
    
    return html;
}

