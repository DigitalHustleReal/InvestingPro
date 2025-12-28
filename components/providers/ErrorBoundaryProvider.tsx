"use client";

import { ErrorBoundary } from "@/components/common/ErrorBoundary";

export default function ErrorBoundaryProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ErrorBoundary>
            {children}
        </ErrorBoundary>
    );
}

