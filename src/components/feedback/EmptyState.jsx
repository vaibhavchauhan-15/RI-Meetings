import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from '../ui/Button.jsx';

/**
 * Reach International Operations - Standardized EmptyState Component
 * 
 * Used across lists, tables, dashboards, and collections when data resolves to [] or null
 * (and is not actively loading or filtered by search).
 * 
 * @param {Object} props
 * @param {React.ReactNode} [props.icon]
 * @param {string} props.title
 * @param {string} props.description
 * @param {React.ReactNode} [props.action] - Primary CTA button or custom action element
 * @param {boolean} [props.compact=false] - For smaller embedded cards/sections
 * @param {string} [props.className='']
 */
export function EmptyState({
    icon,
    title = 'No Data Available',
    description = 'There are no items recorded in this section at this time.',
    action,
    compact = false,
    className = ''
}) {
    return (
        <div 
            role="status"
            className={`w-full bg-white border border-border-light rounded-2xl text-center flex flex-col items-center justify-center transition-all ${
                compact 
                    ? 'p-5 sm:p-6 gap-2' 
                    : 'p-8 sm:p-12 gap-3.5 shadow-2xs'
            } ${className}`}
        >
            {/* Icon Container */}
            <div className={`rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-500 flex items-center justify-center flex-shrink-0 shadow-2xs ${
                compact ? 'w-10 h-10 mb-0.5' : 'w-14 h-14 mb-1'
            }`}>
                {icon ? (
                    React.cloneElement(icon, {
                        className: `${compact ? 'w-5 h-5' : 'w-7 h-7'} ${icon.props.className || 'text-slate-500'}`
                    })
                ) : (
                    <Inbox className={`${compact ? 'w-5 h-5' : 'w-7 h-7'} text-slate-400`} />
                )}
            </div>

            {/* Typography */}
            <div className="max-w-md mx-auto flex flex-col gap-1">
                <h3 className={`font-bold text-slate-900 tracking-tight ${
                    compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'
                }`}>
                    {title}
                </h3>
                {description && (
                    <p className={`text-slate-500 leading-relaxed font-normal ${
                        compact ? 'text-[11px] sm:text-xs' : 'text-xs sm:text-sm'
                    }`}>
                        {description}
                    </p>
                )}
            </div>

            {/* Action CTA */}
            {action && (
                <div className={`flex items-center justify-center gap-2.5 ${compact ? 'mt-1' : 'mt-2'}`}>
                    {action}
                </div>
            )}
        </div>
    );
}

export default EmptyState;
