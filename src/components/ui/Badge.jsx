import React from 'react';

/**
 * Reach International Operations - Standardized Badges & Pills
 * Supports standard role classes, section count badges, and holiday indicators.
 */

const BADGE_VARIANTS = {
    breakdown: 'bg-blue-50 text-blue-700 border border-blue-200/80',
    parts: 'bg-teal-50 text-teal-700 border border-teal-200/80',
    directive: 'bg-amber-50 text-amber-800 border border-amber-200/80',
    action: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
    holiday: 'bg-amber-100/80 text-amber-900 border border-amber-200',
    companyHoliday: 'bg-emerald-100 text-emerald-900 border border-emerald-300',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
    active: 'bg-theme-breakdown text-white shadow-pill-active',
};

export function Badge({
    children,
    variant = 'neutral',
    size = 'sm',
    className = '',
    ...props
}) {
    const variantClass = BADGE_VARIANTS[variant] || BADGE_VARIANTS.neutral;
    const sizeClass = size === 'xs' 
        ? 'text-[10px] px-1.5 py-0.5 font-bold' 
        : size === 'md'
            ? 'text-xs px-2.5 py-1 font-semibold'
            : 'text-[11px] px-2 py-0.5 font-semibold';

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-md transition-colors ${variantClass} ${sizeClass} ${className}`}
            {...props}
        >
            {children}
        </span>
    );
}

export default Badge;
