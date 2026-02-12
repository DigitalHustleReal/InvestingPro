"use client";

import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query';
import { useState } from 'react';
import { logger } from '@/lib/logger';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        queryCache: new QueryCache({
            onError: (error: any) => {
                logger.error('React Query error', error, {
                    errorType: 'query',
                    message: error?.message || 'Unknown query error'
                });
            },
        }),
        mutationCache: new MutationCache({
            onError: (error: any) => {
                logger.error('React Query mutation error', error, {
                    errorType: 'mutation',
                    message: error?.message || 'Unknown mutation error'
                });
            },
        }),
        defaultOptions: {
            queries: {
                retry: (failureCount, error: any) => {
                    if (error?.status >= 400 && error?.status < 500) {
                        return false;
                    }
                    return failureCount < 3;
                },
                retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
                staleTime: 10 * 60 * 1000,
                refetchOnWindowFocus: false,
                refetchOnReconnect: true,
                refetchOnMount: true,
                placeholderData: (previousValue: any) => previousValue,
            },
            mutations: {
                retry: (failureCount, error: any) => {
                    if (error?.status >= 400 && error?.status < 500) {
                        return false;
                    }
                    return failureCount < 1;
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
