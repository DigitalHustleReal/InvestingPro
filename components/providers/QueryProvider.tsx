"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { logger } from '@/lib/logger';

/**
 * QueryProvider with robust error handling and retry logic
 * 
 * Configuration ensures:
 * - Automatic retries for failed network requests
 * - Graceful error handling without crashing components
 * - Reasonable cache times to reduce API calls
 * - Global error logging for debugging
 */
export default function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                // Retry failed requests 2 times with exponential backoff
                retry: (failureCount, error: any) => {
                    // Don't retry on 4xx errors (client errors)
                    if (error?.status >= 400 && error?.status < 500) {
                        return false;
                    }
                    // Retry up to 2 times for network/server errors
                    return failureCount < 2;
                },
                retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
                
                // Cache data for 5 minutes
                staleTime: 5 * 60 * 1000,
                
                // Don't refetch on window focus (reduces unnecessary API calls)
                refetchOnWindowFocus: false,
                
                // Refetch on reconnect after 5 seconds
                refetchOnReconnect: true,
                refetchOnMount: true,
                
                // Global error handler for queries
                onError: (error: any) => {
                    logger.error('React Query error', error, {
                        errorType: 'query',
                        message: error?.message || 'Unknown query error'
                    });
                },
                
                // Return empty array/object as default to prevent crashes
                placeholderData: (previousValue) => previousValue ?? (Array.isArray(previousValue) ? [] : {}),
            },
            mutations: {
                // Retry mutations once (for network errors only)
                retry: (failureCount, error: any) => {
                    if (error?.status >= 400 && error?.status < 500) {
                        return false;
                    }
                    return failureCount < 1;
                },
                
                // Global error handler for mutations
                onError: (error: any) => {
                    logger.error('React Query mutation error', error, {
                        errorType: 'mutation',
                        message: error?.message || 'Unknown mutation error'
                    });
                },
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
