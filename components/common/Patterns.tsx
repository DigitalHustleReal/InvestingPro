import React from 'react';

export function DotPattern({ className = "", width = 16, height = 16, cx = 1, cy = 1, cr = 1 }: { className?: string, width?: number, height?: number, cx?: number, cy?: number, cr?: number }) {
    const id = React.useId();
    return (
        <svg
            className={`absolute inset-0 h-full w-full pointer-events-none ${className}`}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <pattern
                    id={id}
                    width={width}
                    height={height}
                    patternUnits="userSpaceOnUse"
                    patternContentUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                >
                    <circle id="pattern-circle" cx={cx} cy={cy} r={cr} className="fill-current" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" strokeWidth="0" fill={`url(#${id})`} />
        </svg>
    );
}

export function GridPattern({ className = "", width = 40, height = 40 }: { className?: string, width?: number, height?: number }) {
    const id = React.useId();
    return (
        <svg
            className={`absolute inset-0 h-full w-full pointer-events-none ${className}`}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <pattern
                    id={id}
                    width={width}
                    height={height}
                    patternUnits="userSpaceOnUse"
                    x="-1"
                    y="-1"
                >
                    <path
                        d={`M.5 ${height}V.5H${width}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                    />
                </pattern>
            </defs>
            <rect width="100%" height="100%" strokeWidth="0" fill={`url(#${id})`} />
        </svg>
    );
}
