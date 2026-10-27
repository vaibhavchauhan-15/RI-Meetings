import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Reach International Operations - FormField Component
 * 
 * Provides an accessible layout wrapper for form controls:
 * - Proper label association (`htmlFor`)
 * - Required indicator
 * - Contextual helper text
 * - Accessible error messaging (`aria-describedby` reference)
 */
export function FormField({
    id,
    label,
    required = false,
    helperText,
    error,
    children,
    className = ''
}) {
    const errorId = id ? `${id}-error` : undefined;
    const helperId = id ? `${id}-helper` : undefined;

    return (
        <div className={`flex flex-col gap-1.5 w-full ${className}`}>
            {label && (
                <div className="flex items-center justify-between">
                    <label 
                        htmlFor={id} 
                        className="text-xs font-bold text-slate-800 flex items-center gap-1 select-none"
                    >
                        <span>{label}</span>
                        {required && <span className="text-red-500 font-black" aria-hidden="true">*</span>}
                    </label>
                </div>
            )}

            {children}

            {error ? (
                <div 
                    id={errorId} 
                    role="alert" 
                    className="flex items-center gap-1 text-[11px] font-semibold text-red-600 animate-fade-in"
                >
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            ) : helperText ? (
                <p id={helperId} className="text-[11px] text-slate-400 font-normal">
                    {helperText}
                </p>
            ) : null}
        </div>
    );
}

export default FormField;
