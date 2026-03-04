
import { createClient } from "@/lib/supabase/client";
import { logger } from '@/lib/logger';

// Shared Supabase client for client-side operations
const supabase = createClient();

/**
 * Client-Side API Facade
 * Use this in Client Components ("use client") to avoid "server-only" build errors.
 * 
 * ONLY contains methods that are safe to run in the browser (Supabase Anon Client).
 */
export const apiClient = {
    auth: {
        me: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;
            
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', user.id)
                .maybeSingle();
                
            return profile ? { ...user, ...profile } : user;
        },
        signOut: async () => {
            return await supabase.auth.signOut();
        },
        updateMe: async (updates: any) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { data, error } = await supabase
                .from('user_profiles')
                .update(updates)
                .eq('id', user.id)
                .select()
                .single();
            
            if (error) throw error;
            return data;
        }
    },
    // Top-level alias for compatibility with manual refactors
    reviews: {
        list: async (productSlug: string) => {
            const { data, error } = await supabase
                .from('reviews')
                .select('*, user:user_id(email)')
                .eq('product_slug', productSlug)
                .order('created_at', { ascending: false });
            
            if (error) {
                logger.error("Error fetching reviews", error);
                return [];
            }
            return data || [];
        },
        filter: async (filters: any) => {
            let query = supabase.from('reviews').select('*, user:user_id(email)');
            Object.entries(filters).forEach(([key, value]) => { 
                if (value !== undefined && value !== null) query = query.eq(key, value);
            });
            const { data, error } = await query;
            if (error) {
                logger.error("Error filtering reviews", error);
                return [];
            }
            return data || [];
        },
        create: async (review: {
            product_slug: string;
            product_type: string;
            rating: number;
            title: string;
            content: string;
            user_id: string;
        }) => {
            const { data, error } = await supabase
                .from('reviews')
                .insert([review])
                .select()
                .single();
            
            if (error) throw error;
            return data;
        },
        getStats: async (productSlug: string) => {
                const { data, error } = await supabase
                .from('reviews')
                .select('rating')
                .eq('product_slug', productSlug);
            
            if (error || !data || data.length === 0) return { average: 0, count: 0 };
            
            const sum = data.reduce((acc: number, curr: any) => acc + curr.rating, 0);
            return {
                average: parseFloat((sum / data.length).toFixed(1)),
                count: data.length
            };
        }
    },
    entities: {
        // Alias reviews inside entities for compatibility with automated refactors
        get reviews() { return apiClient.reviews; },

        IPO: {
            list: async (status?: string) => {
                let query = supabase.from('ipos').select('*').order('close_date', { ascending: false });
                if (status) {
                    query = query.eq('status', status);
                }
                const { data, error } = await query;
                if (error) {
                    logger.error("Error fetching IPOs", error);
                    return [];
                }
                return data;
            },
            get: async (id: string) => {
                 const { data, error } = await supabase.from('ipos').select('*').eq('id', id).single();
                 if (error) throw error;
                 return data;
            }
        },

        Broker: {
            list: async () => {
                const { data, error } = await supabase.from('brokers').select('*').eq('is_active', true);
                if (error) {
                    logger.error("Error fetching brokers", error);
                    return [];
                }
                return data;
            },
            get: async (slug: string) => {
                const { data, error } = await supabase.from('brokers').select('*').eq('slug', slug).single();
                if (error) throw error;
                return data;
            }
        },

        FixedDeposit: {
             list: async () => {
                // Return mock FD data until database is seeded
                return [
                    {
                        bank: "HDFC Bank",
                        type: "Bank",
                        logo: "H",
                        color: "from-blue-600 to-blue-700",
                        rates: { "1 Year": 7.00, "2 Years": 7.10, "3 Years": 7.25, "5 Years": 7.40 },
                        seniorCitizenBonus: 0.50,
                        minDeposit: "₹5,000",
                        featured: true
                    },
                    {
                        bank: "SBI",
                        type: "Bank",
                        logo: "S",
                        color: "from-primary-600 to-primary-700",
                        rates: { "1 Year": 6.80, "2 Years": 7.00, "3 Years": 7.10, "5 Years": 7.50 },
                        seniorCitizenBonus: 0.50,
                        minDeposit: "₹1,000",
                        featured: false
                    },
                    {
                        bank: "ICICI Bank",
                        type: "Bank",
                        logo: "I",
                        color: "from-orange-600 to-orange-700",
                        rates: { "1 Year": 7.00, "2 Years": 7.10, "3 Years": 7.25, "5 Years": 7.50 },
                        seniorCitizenBonus: 0.50,
                        minDeposit: "₹10,000",
                        featured: false
                    },
                    {
                        bank: "Bajaj Finance",
                        type: "NBFC",
                        logo: "B",
                        color: "from-accent-600 to-accent-700",
                        rates: { "1 Year": 8.10, "2 Years": 8.25, "3 Years": 8.35, "5 Years": 8.50 },
                        seniorCitizenBonus: 0.25,
                        minDeposit: "₹15,000",
                        featured: true
                    },
                    {
                        bank: "Mahindra Finance",
                        type: "NBFC",
                        logo: "M",
                        color: "from-danger-600 to-danger-700",
                        rates: { "1 Year": 7.75, "2 Years": 8.00, "3 Years": 8.15, "5 Years": 8.30 },
                        seniorCitizenBonus: 0.25,
                        minDeposit: "₹10,000",
                        featured: false
                    }
                ];
            }
        },

        Insurance: {
             list: async () => {
                const { data } = await supabase.from('insurance').select('*');
                
                return (data || []).map((i: any) => ({
                    id: i.id,
                    slug: i.slug,
                    name: i.name,
                    provider: i.provider_name,
                    provider_name: i.provider_name,
                    type: i.type,
                    cover: i.cover_amount,
                    premium: i.min_premium,
                    claim_ratio: i.claim_settlement_ratio,
                    features: i.features || {}
                }));
            }
        },

        Loan: {
             list: async () => {
                const { data } = await supabase.from('loans').select('*');
                
                // Map to Generic Asset/UI format
                return (data || []).map((l: any) => ({
                    id: l.id,
                    slug: l.slug,
                    name: l.name,
                    category: 'loan',
                    provider: l.bank_name,
                    provider_name: l.bank_name,
                    description: l.description || '',
                    rating: 4.0,
                    reviewsCount: 0,
                    applyLink: l.apply_link || '#',

                    // Structured data for scorers
                    loanType: l.type,
                    interestRateMin: l.interest_rate_min,
                    interestRateMax: l.interest_rate_max,
                    maxTenureMonths: l.max_tenure_months,
                    maxAmount: l.max_amount,
                    processingFee: l.processing_fee,

                    // Highlights for ProductCard (Must be Array)
                    features: [
                        `Interest starts at ${l.interest_rate_min}%`,
                        `Tenure up to ${l.max_tenure_months/12} years`,
                        `Processing Fee: ${l.processing_fee}`
                    ],
                    url: l.apply_link || '#'
                }));
            }
        },

        CreditCard: {
             list: async () => {
                const { data, error } = await supabase.from('credit_cards').select('*');
                
                if (error) {
                    logger.error('Error fetching credit cards:', error);
                    return [];
                }

                // Map to Generic Asset format expected by UI
                return (data || []).map((card: any) => ({
                    id: card.id || card.slug || 'unknown',
                    slug: card.slug,
                    name: card.name,
                    category: 'credit_card', // ADDED: Critical for filtering & ProductCard links
                    provider: card.bank,
                    provider_name: card.bank,
                    image_url: card.image_url,
                    description: card.description || '',
                    rating: Number(card.rating) || 4.5,
                    reviewsCount: 0,
                    applyLink: card.apply_link || card.source_url || '#', // Added fallback
                    
                    // Structured data for scorers
                    joiningFee: card.joining_fee,
                    annualFee: card.annual_fee,
                    rewardRate: card.rewards?.[0] || '1%',
                    loungeAccess: card.lounge_access || 'Nil',
                    type: card.type || 'rewards',
                    
                    // Highlights for ProductCard (Must be Array)
                    features: card.pros || [], 
                    pros: card.pros || [],
                    cons: card.cons || [],
                    updated_at: card.updated_at
                }));
            },
            filter: async (filters: any) => { 
                return []; 
            }
        },

        Article: {
            list: async (order?: string, limit?: number, includeAllStatuses?: boolean) => {
                if (includeAllStatuses) {
                    const response = await fetch(`/api/admin/articles?limit=${limit || 500}${order ? `&order=${order}` : ''}&includeDeleted=true`);
                    if (!response.ok) {
                        const error = await response.json().catch(() => ({ message: 'Failed to fetch articles' }));
                        throw new Error(error.message || 'Failed to fetch articles');
                    }
                    const result = await response.json();
                    // Return only the articles array for compatibility with existing UI
                    return result.articles || [];
                }

                let query = supabase
                    .from('articles')
                    .select('*');
                
                // Only filter by published status if not explicitly requesting all statuses (for admin)
                if (!includeAllStatuses) {
                    query = query.eq('status', 'published');
                }
                
                if (order) {
                    const [field, direction] = order.startsWith('-') 
                        ? [order.slice(1), 'desc'] 
                        : [order, 'asc'];
                    query = query.order(field, { ascending: direction === 'asc' });
                } else {
                    query = query.order('created_at', { ascending: false });
                }
                
                if (limit) {
                    query = query.limit(limit);
                }
                
                const { data, error } = await query;
                if (error) throw error;
                return data || [];
            },
            filter: async (filters: any) => {
                let query = supabase.from('articles').select('*');
                Object.entries(filters).forEach(([key, value]) => { 
                    if (value !== undefined && value !== null) query = query.eq(key, value);
                });
                const { data, error } = await query;
                if (error) throw error;
                return data || [];
            },
            create: async (data: any) => {
                const response = await fetch('/api/articles', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (!response.ok) {
                    const error = await response.json().catch(() => ({ message: 'Failed to create article' }));
                    throw new Error(error.message || 'Failed to create article');
                }
                return await response.json();
            },
            update: async (id: string, updates: any) => {
                const { data, error } = await supabase
                    .from('articles')
                    .update(updates)
                    .eq('id', id)
                    .select()
                    .single();
                if (error) throw error;
                return data;
            },
            getById: async (id: string) => {
                const { data, error } = await supabase
                    .from('articles')
                    .select('*')
                    .eq('id', id)
                    .single();
                if (error) throw error;
                return data;
            },
            getBySlug: async (slug: string) => {
                const { data, error } = await supabase
                    .from('articles')
                    .select('*')
                    .eq('slug', slug)
                    .single();
                if (error) throw error;
                return data;
            },
            delete: async (id: string) => {
                const response = await fetch(`/api/admin/articles/${id}`, {
                    method: 'DELETE'
                });
                if (!response.ok) {
                    const error = await response.json().catch(() => ({ message: 'Failed to delete article' }));
                    throw new Error(error.message || 'Failed to delete article');
                }
                return await response.json();
            },
            bulkAction: async (action: 'publish' | 'archive' | 'delete' | 'unpublish' | 'restore', ids: string[]) => {
                const response = await fetch('/api/bulk-operations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action, articleIds: ids })
                });
                if (!response.ok) {
                    const error = await response.json().catch(() => ({ message: `Failed to ${action} articles` }));
                    throw new Error(error.message || `Failed to ${action} articles`);
                }
                return await response.json();
            }
        },

        Portfolio: {
            list: async () => {
                const { data, error } = await supabase.from('portfolio').select('*').order('created_at', { ascending: false });
                if (error) {
                    logger.error('Error fetching portfolio:', error);
                    return [];
                }
                return data || [];
            },
            create: async (holding: any) => {
                const { data, error } = await supabase.from('portfolio').insert([holding]).select().single();
                if (error) throw error;
                return data;
            },
            delete: async (id: string) => {
                const { error } = await supabase.from('portfolio').delete().eq('id', id);
                if (error) throw error;
                return true;
            }
        },

        MutualFund: {
             list: async (options: { 
                page?: number; 
                limit?: number; 
                categoryType?: string;
                subCategory?: string; 
                sortBy?: string;
                searchTerm?: string;
            } = {}) => {
                const { page = 1, limit = 10, categoryType, sortBy, searchTerm } = options;
                const from = (page - 1) * limit;
                const to = from + limit - 1;

                let query = supabase
                    .from('mutual_funds')
                    .select('*', { count: 'exact' });
                
                if (categoryType && categoryType !== 'All') {
                    if (categoryType === 'Equity') {
                        query = query.in('category', ['Large Cap', 'Mid Cap', 'Small Cap', 'Flexi Cap', 'Multi Cap', 'ELSS']);
                    } else if (categoryType === 'Debt') {
                        query = query.eq('category', 'Debt');
                    } else if (categoryType === 'Hybrid') {
                         query = query.eq('category', 'Hybrid');
                    } else if (categoryType === 'Index') {
                        query = query.eq('category', 'Index Fund');
                    } else {
                         query = query.eq('category', categoryType);
                    }
                }

                if (searchTerm) {
                    query = query.or(`name.ilike.%${searchTerm}%,fund_house.ilike.%${searchTerm}%`);
                }

                if (sortBy) {
                    const [column, order] = sortBy.split(':');
                    const isAscending = order === 'asc';
                    
                    if (['returns_1y', 'returns_3y', 'returns_5y', 'rating', 'expense_ratio'].includes(column)) {
                        query = query.order(column, { ascending: isAscending, nullsFirst: false });
                    } else {
                        query = query.order(column, { ascending: isAscending });
                    }
                } else {
                    query = query.order('returns_3y', { ascending: false });
                }

                const { data, count, error } = await query.range(from, to);
                
                if (error) {
                    logger.error('Error fetching mutual funds from Supabase', error);
                    return { data: [], count: 0 };
                }

                // Map to UI Structure
                const mappedData = (data || []).map((p: any) => ({
                    id: p.id || p.slug || 'unknown',
                    slug: p.slug,
                    name: p.name,
                    category: 'mutual_fund', 
                    type: p.category, 
                    aum: p.aum || 'N/A',
                    
                    returns1Y: Number(p.returns_1y || 0),
                    returns3Y: Number(p.returns_3y || 0),
                    returns5Y: Number(p.returns_5y || 0),
                    rating: Number(p.rating || 0),
                    riskLevel: (p.risk || 'Moderate').toLowerCase(), 
                    expenseRatio: Number(p.expense_ratio || 0),
                    minInvestment: p.min_investment ? `₹${p.min_investment}` : '₹500',

                    fundHouse: p.fund_house,
                    providerName: p.fund_house,
                    provider: p.fund_house,
                    description: p.description,
                    applyLink: '#',
                    
                    features: [
                        `3Y Returns: ${p.returns_3y}%`,
                        `Expense Ratio: ${p.expense_ratio}%`,
                        `Risk Level: ${p.risk}`
                    ]
                }));

                return { data: mappedData, count: count || 0 };
            },
            filter: async (filters: any) => {
               // Alias for list/search
               return [];
            }
        },

        AffiliateProduct: {
             list: async (orderBy: string = '-clicks', limit: number = 20) => {
                 // Safe implementation using 'products' table for now
                 let query = supabase.from('products').select('*');
                 
                 if (orderBy) {
                     const [field, direction] = orderBy.startsWith('-') 
                         ? [orderBy.slice(1), 'desc'] 
                         : [orderBy, 'asc'];
                     // Only order if column exists - for safety we might skip specific ordering if unsure, 
                     // but 'created_at' is safe. 'clicks' might not exist on all products.
                     if (['created_at', 'price'].includes(field)) {
                        query = query.order(field, { ascending: direction === 'asc' });
                     } else {
                        query = query.order('created_at', { ascending: false });
                     }
                 }

                 if (limit) {
                     query = query.limit(limit);
                 }

                 const { data, error } = await query;
                 
                 if (error) {
                     logger.error('Error fetching affiliate products', error);
                     return [];
                 }

                 return (data || []).map((p: any) => ({
                     id: p.id,
                     name: p.name,
                     clicks: p.clicks || 0, // Fallback if column missing
                     conversions: p.conversions || 0,
                     revenue: 0,
                     ...p
                 }));
             }
        },
        Glossary: {
            list: async () => {
                const { data } = await supabase.from('glossary_terms').select('*').order('term', { ascending: true });
                return data || [];
            },
            search: async (term: string) => {
                const { data } = await supabase.from('glossary_terms').select('*')
                    .or(`term.ilike.%${term}%,definition.ilike.%${term}%`)
                    .order('term', { ascending: true });
                return data || [];
            },
            getByCategory: async (category: string) => {
                try {
                    const { data } = await supabase.from('glossary_terms').select('*')
                        .eq('category', category)
                        .order('term', { ascending: true });
                    return data || [];
                } catch (error) {
                    logger.error('Error fetching glossary by category:', error);
                    return [];
                }
            },
            getBySlug: async (slug: string) => {
                const { data, error } = await supabase.from('glossary_terms').select('*').eq('slug', slug).single();
                if (error) throw error;
                return data;
            }
        },

        AdPlacement: {
            list: async () => {
                const { data, error } = await supabase
                    .from('ad_placements')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (error) {
                    logger.error('Error fetching ad placements', error);
                    return [];
                }
                return data || [];
            },
            filter: async (filters: any) => {
                let query = supabase.from('ad_placements').select('*');
                Object.entries(filters).forEach(([key, value]) => { 
                    if (value !== undefined && value !== null) query = query.eq(key, value);
                });
                const { data, error } = await query;
                if (error) {
                    logger.error('Error filtering ad placements', error);
                    return [];
                }
                return data || [];
            },
            update: async (id: string, updates: any) => {
                const { data, error } = await supabase
                    .from('ad_placements')
                    .update(updates)
                    .eq('id', id)
                    .select()
                    .single();
                if (error) throw error;
                return data;
            }
        },
        Rates: {
            list: async (category?: string) => {
                let query = supabase.from('rates').select('*');
                if (category) {
                    query = query.eq('category', category);
                }
                const { data, error } = await query;
                if (error) {
                    logger.error('Error fetching rates', error);
                    return [];
                }
                return data || [];
            }
        }
    }
};
