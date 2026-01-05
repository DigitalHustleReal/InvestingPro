/**
 * CSV Export Utility for Admin Bulk Operations
 */

export function exportToCSV<T extends Record<string, any>>(
    data: T[],
    filename: string,
    columns?: { key: keyof T; label: string }[]
) {
    if (data.length === 0) {
        throw new Error('No data to export');
    }

    // Determine columns from first item if not provided
    const cols = columns || Object.keys(data[0]).map(key => ({
        key: key as keyof T,
        label: key.toString().replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    }));

    // Create header row
    const headers = cols.map(c => `"${c.label}"`).join(',');

    // Create data rows
    const rows = data.map(item => 
        cols.map(col => {
            const value = item[col.key];
            
            // Handle different value types
            if (value === null || value === undefined) return '""';
            if (typeof value === 'boolean') return value ? '"Yes"' : '"No"';
            if (typeof value === 'object') return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
            if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
            return `"${value}"`;
        }).join(',')
    );

    // Combine into CSV content
    const csvContent = [headers, ...rows].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
}

// Pre-defined column configs for common entities
export const articleCSVColumns = [
    { key: 'title' as const, label: 'Title' },
    { key: 'slug' as const, label: 'Slug' },
    { key: 'status' as const, label: 'Status' },
    { key: 'category' as const, label: 'Category' },
    { key: 'author_name' as const, label: 'Author' },
    { key: 'views' as const, label: 'Views' },
    { key: 'published_at' as const, label: 'Published Date' },
    { key: 'created_at' as const, label: 'Created Date' },
];

export const glossaryCSVColumns = [
    { key: 'term' as const, label: 'Term' },
    { key: 'slug' as const, label: 'Slug' },
    { key: 'category' as const, label: 'Category' },
    { key: 'definition' as const, label: 'Definition' },
    { key: 'published' as const, label: 'Published' },
    { key: 'editor_name' as const, label: 'Reviewer' },
    { key: 'created_at' as const, label: 'Created Date' },
];

export const productCSVColumns = [
    { key: 'name' as const, label: 'Product Name' },
    { key: 'category' as const, label: 'Category' },
    { key: 'provider' as const, label: 'Provider' },
    { key: 'rating' as const, label: 'Rating' },
    { key: 'is_active' as const, label: 'Active' },
    { key: 'created_at' as const, label: 'Created Date' },
];
