import React from 'react';
import { Gauge, X, Ban } from 'lucide-react';
import { useSlowNetwork } from '../../hooks/useSlowNetwork.js';
import { Spinner } from './Spinner.jsx';
import { STATE_MESSAGES } from '../../lib/constants/messages.js';

/**
 * Reach International Operations - SlowNetworkBanner Component
 * 
 * Non-intrusive notification rendered when an active request exceeds 5000ms
 * or when the browser's Network Information API detects slow 2G connectivity.
 * Automatically clears when the active request settles.
 */
export function SlowNetworkBanner({ className = '' }) {
    const { isSlow, slowReason, dismissSlowWarning, cancelActiveRequest } = useSlowNetwork();

    if (!isSlow) return null;

    const message = slowReason === 'hardware_2g'
        ? STATE_MESSAGES.slowNetwork.hardware2gMessage
        : slowReason === 'data_saver'
            ? STATE_MESSAGES.slowNetwork.dataSaverMessage
            : STATE_MESSAGES.slowNetwork.latencyMessage;

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
                        <span className="text-xs font-bold text-amber-300">
                            {STATE_MESSAGES.slowNetwork.bannerTitle}
                        </span>
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
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-[11px] font-semibold border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer active:scale-95 min-h-[32px]"
                >
                    <Ban className="w-3 h-3 text-red-400" />
                    <span>{STATE_MESSAGES.slowNetwork.cancelAction}</span>
                </button>
                <button
                    type="button"
                    onClick={dismissSlowWarning}
                    title="Dismiss warning"
                    aria-label="Dismiss warning"
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}

export default SlowNetworkBanner;
