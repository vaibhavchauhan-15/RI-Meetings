import React from 'react';

/**
 * Reach International Operations - Standardized Card Component
 * Strictly adheres to design.md tokens:
 * - Crisp plain white background (#ffffff)
 * - Standard border (#e2e8f0) & standard card shadow
 * - Standard 16px/24px rounded corners
 * - Dual-viewport padding scale (Desktop: 24px, Mobile: 14px)
 */

export const Card = React.forwardRef(function Card({
    children,
    as: Component = 'div',
    variant = 'default', // 'default' | 'subtle' | 'interactive' | 'accent'
    padding = 'md',      // 'none' | 'sm' | 'md' | 'lg'
    className = '',
    ...props
}, ref) {
    const PADDING_MAP = {
        none: 'p-0',
        sm: 'p-2.5 sm:p-3.5',
        md: 'p-3.5 sm:p-5 lg:p-6',
        lg: 'p-4 sm:p-6 lg:p-8',
    };

    const VARIANT_MAP = {
        default: 'bg-white border border-border-light shadow-card',
        subtle: 'bg-slate-50/70 border border-border-light shadow-2xs',
        interactive: 'bg-white border border-border-light shadow-card hover:shadow-hover hover:border-slate-300 transition-all duration-200 cursor-pointer',
        accent: 'bg-white border border-border-light border-l-4 border-l-theme-breakdown shadow-card'
    };

    const padClass = PADDING_MAP[padding] || PADDING_MAP.md;
    const varClass = VARIANT_MAP[variant] || VARIANT_MAP.default;

    return (
        <Component
            ref={ref}
            className={`rounded-2xl transition-all duration-200 ${varClass} ${padClass} ${className}`}
            {...props}
        >
            {children}
        </Component>
    );
});

export default Card;
