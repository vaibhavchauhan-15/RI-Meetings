import React from 'react';

/**
 * Reach International Operations - Standalone Accessible Spinner
 * 
 * Size & Color Tokens adhering to design.md.
 * Fully ARIA-compliant with role="status" and visually hidden label.
 */

const SIZES = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
    xl: 'w-10 h-10',
};

const COLORS = {
    primary: 'text-[#00a8cc]',
    white: 'text-white',
    slate: 'text-slate-700',
    muted: 'text-slate-400',
    emerald: 'text-[#10b981]',
    amber: 'text-[#f59e0b]',
    danger: 'text-red-600',
};

export function Spinner({
    size = 'md',
    color = 'primary',
    className = '',
    label = 'Loading...'
}) {
    const sizeClass = SIZES[size] || SIZES.md;
    const colorClass = COLORS[color] || COLORS.primary;

    return (
        <span 
            role="status" 
            aria-live="polite" 
            className={`inline-flex items-center justify-center flex-shrink-0 ${className}`}
        >
            <svg 
                className={`animate-spin ${sizeClass} ${colorClass}`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="3.5"
                />
                <path 
                    className="opacity-90" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
            </svg>
            <span className="sr-only">{label}</span>
        </span>
    );
}

export default Spinner;
