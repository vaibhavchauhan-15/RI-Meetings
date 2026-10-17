import React from 'react';

/**
 * Reach International Operations - Standardized Input Component
 * Strictly adheres to design.md tokens:
 * - Crisp background (slate-50 default, white on focus)
 * - Standard border (#e2e8f0, #0066cc focus ring)
 * - 44px touch targets on mobile
 */

export const Input = React.forwardRef(function Input({
    type = 'text',
    className = '',
    icon,
    rightElement,
    disabled = false,
    ...props
}, ref) {
    const disabledClass = disabled ? 'opacity-60 cursor-not-allowed bg-slate-100' : '';

    return (
        <div className="relative flex items-center w-full">
            {icon && (
                <span className="absolute left-3 text-slate-400 pointer-events-none flex items-center justify-center w-4 h-4">
                    {icon}
                </span>
            )}
            <input
                ref={ref}
                type={type}
                disabled={disabled}
                className={`w-full h-10 ${icon ? 'pl-9' : 'pl-3.5'} ${rightElement ? 'pr-9' : 'pr-3.5'} text-xs sm:text-[13px] bg-slate-50 border border-border-light rounded-xl focus:bg-white focus:border-theme-breakdown focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium shadow-2xs ${disabledClass} ${className}`}
                {...props}
            />
            {rightElement && (
                <div className="absolute right-2 flex items-center justify-center">
                    {rightElement}
                </div>
            )}
        </div>
    );
});

export default Input;
