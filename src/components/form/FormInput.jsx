import React from 'react';

/**
 * Reach International Operations - FormInput Component
 * 
 * Accessible, design.md-compliant input element:
 * - Automatically applies aria-invalid="true" on error
 * - Links aria-describedby to error or helper text
 * - High-contrast focus state and error border styling
 * - 44px mobile touch target
 */
export const FormInput = React.forwardRef(function FormInput({
    id,
    name,
    type = 'text',
    value,
    onChange,
    onBlur,
    placeholder,
    error,
    helperText,
    disabled = false,
    icon,
    rightElement,
    as = 'input',
    rows = 3,
    className = '',
    ...props
}, ref) {
    const errorId = id ? `${id}-error` : undefined;
    const helperId = id ? `${id}-helper` : undefined;
    const describedBy = error ? errorId : helperText ? helperId : undefined;

    const baseBorderClass = error
        ? 'border-red-400 bg-red-50/40 text-red-950 focus:border-red-500 focus:ring-2 focus:ring-red-100'
        : 'border-border-light bg-slate-50 focus:bg-white focus:border-theme-breakdown focus:ring-2 focus:ring-blue-100 text-slate-900';

    const disabledClass = disabled ? 'opacity-60 cursor-not-allowed bg-slate-100 select-none' : '';

    if (as === 'textarea') {
        return (
            <textarea
                ref={ref}
                id={id}
                name={name || id}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                disabled={disabled}
                rows={rows}
                aria-invalid={Boolean(error)}
                aria-describedby={describedBy}
                className={`w-full p-3 text-xs sm:text-[13px] border rounded-xl outline-none transition-all placeholder:text-slate-400 font-medium shadow-2xs custom-scrollbar ${baseBorderClass} ${disabledClass} ${className}`}
                {...props}
            />
        );
    }

    return (
        <div className="relative flex items-center w-full">
            {icon && (
                <span className="absolute left-3 text-slate-400 pointer-events-none flex items-center justify-center w-4 h-4">
                    {icon}
                </span>
            )}
            <input
                ref={ref}
                id={id}
                name={name || id}
                type={type}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                disabled={disabled}
                aria-invalid={Boolean(error)}
                aria-describedby={describedBy}
                className={`w-full h-11 ${icon ? 'pl-9' : 'pl-3.5'} ${rightElement ? 'pr-9' : 'pr-3.5'} text-xs sm:text-[13px] border rounded-xl outline-none transition-all placeholder:text-slate-400 font-medium shadow-2xs ${baseBorderClass} ${disabledClass} ${className}`}
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

export default FormInput;
