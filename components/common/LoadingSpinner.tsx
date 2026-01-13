import React from 'react';

type SpinnerSize = 'small' | 'default' | 'large';

interface LoadingSpinnerProps {
    size?: SpinnerSize;
    text?: string;
}

export default function LoadingSpinner({ size = "default", text = "" }: LoadingSpinnerProps) {
    const sizeClasses: Record<SpinnerSize, string> = {
        small: "h-6 w-6",
        default: "h-12 w-12",
        large: "h-16 w-16"
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <div className={`animate-spin rounded-full border-b-2 border-primary-600 ${sizeClasses[size]}`}></div>
            {text && <p className="text-slate-600 text-sm">{text}</p>}
        </div>
    );
}
