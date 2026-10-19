import React from 'react';

/**
 * Universal Tooltip Component
 * Displays sleek, high-contrast, accessible tooltips with optional keyboard shortcut badges.
 * Built for Reach International Design System standards.
 */
export function Tooltip({
    content,
    shortcut,
    position = 'top',
    hideOnFocus = false,
    disabled = false,
    className = '',
    tooltipClassName = '',
    children
}) {
    if (disabled || !content) {
        return children;
    }

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
        'top-start': 'bottom-full left-0 mb-2',
        'top-end': 'bottom-full right-0 mb-2',
        'bottom-start': 'top-full left-0 mt-2',
        'bottom-end': 'top-full right-0 mt-2'
    }[position] || 'bottom-full left-1/2 -translate-x-1/2 mb-2';

    return (
        <div className={`group/tooltip relative inline-flex items-center justify-center flex-shrink-0 ${className}`}>
            {children}
            <span
                role="tooltip"
                aria-hidden="true"
                className={`pointer-events-none absolute z-[9999] whitespace-nowrap opacity-0 scale-95 group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 transition-all duration-150 ease-out shadow-xl rounded-lg px-2.5 py-1 text-xs font-medium bg-slate-900 text-white border border-slate-700/80 hidden sm:inline-flex items-center gap-1.5 ${
                    hideOnFocus ? 'group-focus-within/tooltip:opacity-0 group-focus-within/tooltip:pointer-events-none' : ''
                } ${positionClasses} ${tooltipClassName}`}
            >
                <span className="truncate">{content}</span>
                {shortcut && (
                    <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-bold leading-none select-none">
                        {shortcut}
                    </kbd>
                )}
            </span>
        </div>
    );
}

export default Tooltip;
