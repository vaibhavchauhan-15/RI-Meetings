import React from 'react';
import { Gauge, X, Ban } from 'lucide-react';
import { useSlowNetwork } from '../../hooks/useSlowNetwork.js';
import { Spinner } from './Spinner.jsx';

/**
 * Reach International Operations - SlowNetworkBanner Component
 * 
 * Non-intrusive notification rendered when an active request exceeds 5000ms
 * or when the browser's Network Information API detects slow 2G connectivity.
 */
export function SlowNetworkBanner({ className = '' }) {
    const { isSlow, slowReason, dismissSlowWarning, cancelActiveRequest } = useSlowNetwork();

    if (!isSlow) return null;

    const message = slowReason === 'hardware_2g'
        ? 'Slow 2G network detected. Operational data may take longer to load.'
        : slowReason === 'data_saver'
            ? 'Data Saver mode detected. Optimizing request bandwidth.'
            : 'Your connection seems slow. Still working on fetching your request...';

    return (
        <div 
            role="status"
            aria-live="polite"
            className={`fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 max-w-md w-full bg-slate-900/95 text-white border border-slate-700/80 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 animate-fade-in ${className}`}
        >
            <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 border border-amber-500/30">
                    <Gauge className="w-4 h-4 animate-pulse-subtle" />
                </div>
                <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-amber-300">Slow Connection</span>
                        <Spinner size="xs" color="amber" />
                    </div>
                    <p className="text-[11px] text-slate-300 leading-tight font-medium truncate">
                        {message}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                    type="button"
                    onClick={cancelActiveRequest}
                    title="Cancel request"
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-[11px] font-semibold border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer active:scale-95"
                >
                    <Ban className="w-3 h-3 text-red-400" />
                    <span>Cancel</span>
                </button>
                <button
                    type="button"
                    onClick={dismissSlowWarning}
                    title="Dismiss warning"
                    aria-label="Dismiss warning"
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}

export default SlowNetworkBanner;
