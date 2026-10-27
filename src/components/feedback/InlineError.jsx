import React from 'react';
import { AlertTriangle, AlertCircle, RotateCcw, X } from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { getUserErrorMessage } from '../../lib/errors/AppError.js';

/**
 * Reach International Operations - Standardized InlineError Component
 * 
 * Safely parses backend errors to ensure raw stack traces or internal JSON
 * objects are never leaked to the user. Matches high-contrast design tokens.
 * 
 * @param {Object} props
 * @param {Error|string|unknown} props.error - Raw or formatted error
 * @param {string} [props.title] - Optional title for error card
 * @param {Function} [props.onRetry] - Retry callback to re-trigger query
 * @param {Function} [props.onDismiss] - Dismiss callback
 * @param {boolean} [props.compact=false] - Inline banner vs full card mode
 * @param {string} [props.className='']
 */
export function InlineError({
    error,
    title,
    onRetry,
    onDismiss,
    compact = false,
    className = ''
}) {
    const safeMessage = getUserErrorMessage(error, 'An unexpected error occurred while communicating with the Reach database.');

    if (compact) {
        return (
            <div 
                role="alert" 
                className={`bg-red-50 border border-red-200/90 rounded-xl p-3 flex items-center justify-between gap-3 text-xs text-red-700 animate-fade-in select-none shadow-2xs ${className}`}
            >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                    <AlertTriangle className="w-4 h-4 text-red-600 animate-pulse-subtle flex-shrink-0" />
                    <span className="font-medium truncate">{safeMessage}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    {onRetry && (
                        <button
                            type="button"
                            onClick={onRetry}
                            className="group px-2.5 py-1 bg-white hover:bg-red-100 text-red-700 border border-red-300 rounded-lg font-bold text-xs transition-colors cursor-pointer active:scale-95 shadow-2xs flex items-center gap-1.5"
                        >
                            <RotateCcw className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-rotate-90" />
                            <span>Retry</span>
                        </button>
                    )}
                    {onDismiss && (
                        <button
                            type="button"
                            onClick={onDismiss}
                            className="p-1 text-red-400 hover:text-red-700 transition-colors cursor-pointer rounded flex items-center justify-center hover:scale-105 active:scale-95"
                            title="Dismiss error"
                            aria-label="Dismiss error"
                        >
                            <X className="w-4 h-4 transition-transform duration-200 hover:rotate-90" />
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div 
            role="alert" 
            className={`w-full bg-white border border-red-200 rounded-2xl p-6 sm:p-8 text-center flex flex-col items-center justify-center gap-3.5 shadow-2xs animate-fade-in ${className}`}
        >
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center flex-shrink-0 shadow-2xs">
                <AlertCircle className="w-6 h-6 animate-pulse-subtle" />
            </div>

            <div className="max-w-md mx-auto flex flex-col gap-1">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                    {title || 'Operation Failed'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {safeMessage}
                </p>
            </div>

            {(onRetry || onDismiss) && (
                <div className="flex items-center justify-center gap-2.5 pt-1">
                    {onRetry && (
                        <Button
                            variant="primary"
                            size="sm"
                            shape="rounded"
                            onClick={onRetry}
                            leftIcon={<RotateCcw className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-rotate-90" />}
                        >
                            Try Again
                        </Button>
                    )}
                    {onDismiss && (
                        <Button
                            variant="outline"
                            size="sm"
                            shape="rounded"
                            onClick={onDismiss}
                        >
                            Dismiss
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}

export default InlineError;
