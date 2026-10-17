import React from 'react';

/**
 * Reach International Operations - Standardized Buttons
 * Strictly adheres to design.md & AGENTS.md button hierarchies:
 * - primary: gradient cyan to teal (#00a8cc -> #0b84a5) with white text & hover lift
 * - outline: white bg, #e2e8f0 border, hover slate-50
 * - success: #10b981 with white text
 * - ghost: transparent bg, subtle hover
 * - pill: month-pill-btn style
 * - icon: 44x44px minimum touch target on mobile
 */

const VARIANT_CLASSES = {
    primary: 'bg-gradient-to-r from-[#00a8cc] to-[#0b84a5] hover:from-[#0096b8] hover:to-[#097390] text-white shadow-primary-btn hover:shadow-primary-btn-hover active:scale-[0.98]',
    outline: 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-border-light shadow-2xs active:scale-[0.98]',
    success: 'bg-[#10b981] hover:bg-[#059669] text-white shadow-xs active:scale-[0.98]',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 active:scale-[0.98]',
    danger: 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 active:scale-[0.98]',
};

const SIZE_CLASSES = {
    sm: 'text-xs px-2.5 py-1.5 rounded-lg min-h-[32px]',
    md: 'text-xs sm:text-sm px-3.5 py-2 rounded-xl min-h-[40px]',
    lg: 'text-sm sm:text-base px-4 py-2.5 rounded-xl min-h-[44px]',
    icon: 'p-2 rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-[0.94]',
};

export const Button = React.forwardRef(function Button({
    children,
    variant = 'outline',
    size = 'md',
    className = '',
    disabled = false,
    type = 'button',
    ...props
}, ref) {
    const variantClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.outline;
    const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
    const disabledClass = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer';

    return (
        <button
            ref={ref}
            type={type}
            disabled={disabled}
            className={`inline-flex items-center justify-center gap-1.5 font-medium transition-all duration-150 select-none focus:outline-none focus:ring-2 focus:ring-[#00a8cc]/30 ${variantClass} ${sizeClass} ${disabledClass} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
});

export default Button;
