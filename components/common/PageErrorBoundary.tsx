"use client";

import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { logger } from '@/lib/logger';

interface PageErrorBoundaryProps {
    children: React.ReactNode;
    pageName?: string;
}

export default function PageErrorBoundary({ children, pageName = 'Page' }: PageErrorBoundaryProps) {
    const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
        logger.error(`Error in ${pageName}`, error, {
            componentStack: errorInfo.componentStack,
            pageName
        });
    };

    return (
        <ErrorBoundary onError={handleError}>
            {children}
        </ErrorBoundary>
    );
}

