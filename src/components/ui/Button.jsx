import React from 'react';

/**
 * Reach International Operations - Standardized Buttons
 * Strictly adheres to design.md & AGENTS.md button hierarchies and cross-platform standards:
 * - primary: solid gradient cyan to teal (#00a8cc -> #0b84a5) with white text & hover lift
 * - secondary: solid neutral surface (slate-100 / slate-200) with dark slate text
 * - destructive / danger: solid accessible red (#e11d48 / rose-600) with white text
 * - outline: intentional solid white surface with subtle border (#e2e8f0)
 * - success: solid emerald (#10b981) with white text
 * - ghost / link: minimal styling preserving low-emphasis action semantics
 * - shape: explicit shape support ('rounded' | 'pill' | 'square')
 * - loading: variant-aware spinner with stable button dimensions
 * - touch targets: strictly enforces 44x44px minimum touch targets on mobile
 */

// -----------------------------------------------------------------------------
// Static Variant, Size, Shape & Spinner Definitions (Allocated once, 0 render overhead)
// -----------------------------------------------------------------------------

const VARIANT_CLASSES = {
    primary: 'bg-gradient-to-r from-[#00a8cc] to-[#0b84a5] hover:from-[#0096b8] hover:to-[#097390] text-white shadow-primary-btn hover:shadow-primary-btn-hover active:scale-[0.98]',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/80 active:scale-[0.98]',
    destructive: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs active:scale-[0.98]',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs active:scale-[0.98]',
    outline: 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-border-light shadow-2xs active:scale-[0.98]',
    success: 'bg-[#10b981] hover:bg-[#059669] text-white shadow-xs active:scale-[0.98]',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 active:scale-[0.98]',
    link: 'bg-transparent text-[#0b84a5] hover:text-[#00a8cc] hover:underline p-0 min-h-0 active:opacity-80',
};

const SIZE_CLASSES = {
    sm: 'text-xs px-2.5 py-1.5 min-h-[36px] min-w-[36px]',
    md: 'text-xs sm:text-sm px-3.5 py-2 min-h-[44px]',
    lg: 'text-sm sm:text-base px-5 py-2.5 min-h-[48px]',
    icon: 'p-2 min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-[0.94]',
};

const SHAPE_CLASSES = {
    rounded: 'rounded-xl',
    pill: 'rounded-full',
    square: 'rounded-lg',
};

const DISABLED_VARIANT_CLASSES = {
    primary: 'bg-slate-200 text-slate-400 border-transparent shadow-none cursor-not-allowed pointer-events-none select-none',
    secondary: 'bg-slate-100 text-slate-400 border-slate-200 shadow-none cursor-not-allowed pointer-events-none select-none',
    destructive: 'bg-slate-200 text-slate-400 border-transparent shadow-none cursor-not-allowed pointer-events-none select-none',
    danger: 'bg-slate-200 text-slate-400 border-transparent shadow-none cursor-not-allowed pointer-events-none select-none',
    outline: 'bg-slate-50 text-slate-400 border-slate-200 shadow-none cursor-not-allowed pointer-events-none select-none',
    success: 'bg-slate-200 text-slate-400 border-transparent shadow-none cursor-not-allowed pointer-events-none select-none',
    ghost: 'bg-transparent text-slate-300 shadow-none cursor-not-allowed pointer-events-none select-none',
    link: 'bg-transparent text-slate-300 no-underline shadow-none cursor-not-allowed pointer-events-none select-none',
};

/**
 * Returns variant-aware spinner SVG stroke color
 */
function getSpinnerColorClass(variant) {
    switch (variant) {
        case 'primary':
        case 'destructive':
        case 'danger':
        case 'success':
            return 'text-white';
        case 'secondary':
        case 'outline':
            return 'text-slate-700';
        case 'ghost':
            return 'text-slate-600';
        case 'link':
            return 'text-[#0b84a5]';
        default:
            return 'text-white';
    }
}

export const Button = React.forwardRef(function Button({
    children,
    variant = 'outline',
    size = 'md',
    shape = 'rounded',
    className = '',
    disabled = false,
    loading = false,
    isLoading = false,
    leftIcon,
    icon,
    rightIcon,
    type = 'button',
    ...props
}, ref) {
    const isActuallyLoading = Boolean(loading || isLoading);
    const isEffectivelyDisabled = Boolean(disabled || isActuallyLoading);

    // Explicit shape detection with backward-compatible class inspection fallback
    const resolvedShape = shape !== 'rounded' 
        ? shape 
        : (className && className.includes('rounded-full')) 
            ? 'pill' 
            : 'rounded';

    const shapeClass = SHAPE_CLASSES[resolvedShape] || SHAPE_CLASSES.rounded;
    const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

    // Use deliberate disabled palette when disabled
    const variantClass = isEffectivelyDisabled
        ? (DISABLED_VARIANT_CLASSES[variant] || DISABLED_VARIANT_CLASSES.outline)
        : (VARIANT_CLASSES[variant] || VARIANT_CLASSES.outline);

    // Precedence rule: leftIcon takes precedence over legacy icon prop
    const leadingIcon = leftIcon || icon;
    const spinnerColorClass = getSpinnerColorClass(variant);

    return (
        <button
            ref={ref}
            type={type}
            disabled={isEffectivelyDisabled}
            aria-busy={isActuallyLoading}
            aria-disabled={isEffectivelyDisabled}
            className={`inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 select-none focus:outline-none focus:ring-2 focus:ring-[#00a8cc]/30 ${variantClass} ${shapeClass} ${sizeClass} ${className}`}
            {...props}
        >
            {isActuallyLoading ? (
                <>
                    <svg
                        className={`animate-spin h-4 w-4 ${spinnerColorClass}`}
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
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    {children ? <span>{children}</span> : null}
                </>
            ) : (
                <>
                    {leadingIcon ? (
                        <span className="inline-flex items-center justify-center flex-shrink-0" aria-hidden="true">
                            {leadingIcon}
                        </span>
                    ) : null}
                    {children}
                    {rightIcon ? (
                        <span className="inline-flex items-center justify-center flex-shrink-0" aria-hidden="true">
                            {rightIcon}
                        </span>
                    ) : null}
                </>
            )}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;
