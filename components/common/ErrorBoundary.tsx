"use client";

import React from 'react';
import { Button } from "@/components/ui/Button";
import { AlertCircle } from "lucide-react";
import { logger } from "@/lib/logger";

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({
            error,
            errorInfo
        });

        // Log error using logger
        logger.error('Error caught by boundary', error as Error, {
            componentStack: errorInfo.componentStack,
            errorInfo
        });
        
        // Call custom error handler if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }

        // TODO: Send to error tracking service (Sentry, etc.)
        // if (typeof window !== 'undefined' && window.Sentry) {
        //     window.Sentry.captureException(error, { contexts: { react: errorInfo } });
        // }
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-rose-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">
                            Something went wrong
                        </h1>
                        <p className="text-slate-600 mb-6">
                            We encountered an unexpected error. Please try again or contact support if the problem persists.
                        </p>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mb-6 text-left">
                                <summary className="cursor-pointer text-sm text-slate-500 mb-2">
                                    Error Details (Development Only)
                                </summary>
                                <pre className="text-xs bg-slate-100 p-3 rounded overflow-auto max-h-40">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}
                        <div className="flex gap-3 justify-center">
                            <Button
                                onClick={this.handleReset}
                                className="bg-primary-600 hover:bg-primary-700"
                            >
                                Try Again
                            </Button>
                            <Button
                                onClick={() => window.location.href = '/'}
                                variant="outline"
                            >
                                Go Home
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

