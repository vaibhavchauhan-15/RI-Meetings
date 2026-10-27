import React from 'react';
import { Check, ArrowRight, Home } from 'lucide-react';
import { Button } from '../ui/Button.jsx';

/**
 * Reach International Operations - SuccessView Component
 * 
 * Major flow completion screen featuring checkmark micro-interaction,
 * summary details table, and contextual navigation actions.
 */
export function SuccessView({
    title = 'Action Completed Successfully',
    description = 'The operational report has been processed and saved to the Reach database.',
    details = [],
    primaryAction,
    secondaryAction,
    className = ''
}) {
    return (
        <div 
            role="status"
            aria-live="polite"
            className={`w-full max-w-lg mx-auto bg-white border border-border-light rounded-2xl shadow-card p-6 sm:p-10 text-center flex flex-col items-center gap-5 animate-fade-in ${className}`}
        >
            {/* Animated Checkmark Badge */}
            <div className="relative w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-2xs">
                <span className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping opacity-75" />
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                    <Check className="w-7 h-7 stroke-[3] animate-scale-in" />
                </div>
            </div>

            {/* Title & Description */}
            <div className="flex flex-col gap-1.5 max-w-sm">
                <h3 className="text-base sm:text-xl font-black text-slate-900 tracking-tight">
                    {title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                    {description}
                </p>
            </div>

            {/* Details Summary Table (if provided) */}
            {details && details.length > 0 && (
                <div className="w-full bg-slate-50 border border-slate-200/90 rounded-xl p-3.5 flex flex-col gap-2 text-left">
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200/80 pb-1.5">
                        Confirmation Details
                    </h5>
                    <dl className="grid grid-cols-1 gap-1.5 text-xs">
                        {details.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-2">
                                <dt className="text-slate-500 font-medium truncate">{item.label}:</dt>
                                <dd className="text-slate-900 font-bold truncate">{item.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 w-full">
                {primaryAction ? (
                    primaryAction
                ) : (
                    <Button
                        variant="primary"
                        size="md"
                        shape="rounded"
                        onClick={() => {
                            if (typeof window !== 'undefined') window.location.search = '';
                        }}
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                        Back to Dashboard
                    </Button>
                )}

                {secondaryAction && secondaryAction}
            </div>
        </div>
    );
}

export default SuccessView;
