import React from 'react';
import { AlertTriangle, AlertCircle, RotateCcw, X, Clock } from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { normalizeError, getUserErrorMessage } from '../../lib/errors/AppError.js';
import { STATE_MESSAGES } from '../../lib/constants/messages.js';

/**
 * Reach International Operations - Standardized InlineError Component
 * 
 * Safely normalizes backend errors so raw database stack traces or SQL objects
 * are never leaked to the user. Includes retryable error codes and safe copy.
 * 
 * @param {Object} props
 * @param {Error|string|unknown} props.error - Raw or normalized error
 * @param {string} [props.title] - Optional title for error card
 * @param {Function} [props.onRetry] - Retry callback to re-trigger query
 * @param {Function} [props.onDismiss] - Dismiss callback
 * @param {boolean} [props.compact=false] - Inline banner vs full card mode
 * @param {string} [props.variant='card'] - 'card' | 'banner' | 'rate-limit'
 * @param {string} [props.className='']
 */
export function InlineError({
    error,
    title,
    onRetry,
    onDismiss,
    compact = false,
    variant = 'card',
    className = ''
}) {
    const normalized = normalizeError(error, STATE_MESSAGES.error.defaultMessage);
    const safeMessage = normalized.userMessage || getUserErrorMessage(error);
    const isRateLimit = normalized.status === 429 || normalized.code === 'RATE_LIMIT_EXCEEDED';
    const isRetryable = normalized.retryable !== false;
    const resolvedTitle = title || (isRateLimit ? STATE_MESSAGES.error.rateLimitTitle : STATE_MESSAGES.error.defaultTitle);

    if (compact || variant === 'banner') {
        return (
            <div 
                role="alert" 
                aria-live="assertive"
                className={`bg-red-50 border border-red-200/90 rounded-xl p-3 flex items-center justify-between gap-3 text-xs text-red-700 animate-fade-in select-none shadow-2xs ${className}`}
            >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                    {isRateLimit ? (
                        <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    ) : (
                        <AlertTriangle className="w-4 h-4 text-red-600 animate-pulse-subtle flex-shrink-0" />
                    )}
                    <span className="font-medium truncate">{safeMessage}</span>
                    {normalized.code && normalized.code !== 'UNKNOWN_ERROR' && (
                        <span className="text-[10px] font-mono uppercase bg-red-100 text-red-800 px-1.5 py-0.2 rounded border border-red-200 flex-shrink-0">
                            {normalized.code}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    {onRetry && isRetryable && (
                        <button
                            type="button"
                            onClick={onRetry}
                            className="group px-2.5 py-1 bg-white hover:bg-red-100 text-red-700 border border-red-300 rounded-lg font-bold text-xs transition-colors cursor-pointer active:scale-95 shadow-2xs flex items-center gap-1.5 min-h-[32px]"
                        >
                            <RotateCcw className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-rotate-90" />
                            <span>{STATE_MESSAGES.error.retryAction}</span>
                        </button>
                    )}
                    {onDismiss && (
                        <button
                            type="button"
                            onClick={onDismiss}
                            className="p-1 text-red-400 hover:text-red-700 transition-colors cursor-pointer rounded flex items-center justify-center hover:scale-105 active:scale-95 min-w-[32px] min-h-[32px]"
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
            aria-live="assertive"
            className={`w-full bg-white border border-red-200 rounded-2xl p-6 sm:p-8 text-center flex flex-col items-center justify-center gap-3.5 shadow-2xs animate-fade-in ${className}`}
        >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xs ${
                isRateLimit 
                    ? 'bg-amber-50 text-amber-600 border border-amber-200' 
                    : 'bg-red-50 text-red-600 border border-red-200'
            }`}>
                {isRateLimit ? (
                    <Clock className="w-6 h-6 animate-pulse-subtle" />
                ) : (
                    <AlertCircle className="w-6 h-6 animate-pulse-subtle" />
                )}
            </div>

            <div className="max-w-md mx-auto flex flex-col gap-1">
                <div className="flex items-center justify-center gap-2">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                        {resolvedTitle}
                    </h4>
                    {normalized.code && normalized.code !== 'UNKNOWN_ERROR' && (
                        <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                            {normalized.code}
                        </span>
                    )}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {safeMessage}
                </p>
            </div>

            {(onRetry || onDismiss) && (
                <div className="flex items-center justify-center gap-2.5 pt-1">
                    {onRetry && isRetryable && (
                        <Button
                            variant="primary"
                            size="sm"
                            shape="rounded"
                            onClick={onRetry}
                            leftIcon={<RotateCcw className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-rotate-90" />}
                        >
                            {STATE_MESSAGES.error.retryAction}
                        </Button>
                    )}
                    {onDismiss && (
                        <Button
                            variant="outline"
                            size="sm"
                            shape="rounded"
                            onClick={onDismiss}
                        >
                            {STATE_MESSAGES.error.dismissAction}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}

export default InlineError;
