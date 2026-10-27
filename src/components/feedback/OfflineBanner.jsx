import React from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus.js';
import { Button } from '../ui/Button.jsx';

/**
 * Reach International Operations - Offline Top Banner
 * 
 * Persistent non-intrusive alert rendered at the top of the global layout
 * whenever connectivity is severed, with automated online recovery detection.
 */
export function OfflineBanner({ onRetry, isChecking = false }) {
    const { isOnline, wasOffline, reconnect } = useNetworkStatus();

    // 1. Recovered state: brief green toast banner
    if (isOnline && wasOffline) {
        return (
            <div 
                role="status" 
                aria-live="polite" 
                className="w-full bg-emerald-600 text-white text-xs font-semibold px-4 py-2 flex items-center justify-center gap-2 shadow-sm animate-fade-in z-50 select-none"
            >
                <Wifi className="w-3.5 h-3.5 animate-bounce-subtle" />
                <span>Internet connection restored. Live database sync active.</span>
            </div>
        );
    }

    // 2. Offline state: persistent amber/red warning banner
    if (!isOnline) {
        return (
            <div 
                role="alert" 
                aria-live="assertive" 
                className="w-full bg-slate-900 text-white text-xs px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3 shadow-md z-50 select-none border-b border-slate-800"
            >
                <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping flex-shrink-0" />
                    <WifiOff className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span className="font-medium text-slate-200 truncate text-[11px] sm:text-xs">
                        You are currently offline. Viewing cached operational records.
                    </span>
                </div>
                <button
                    type="button"
                    onClick={() => {
                        reconnect();
                        onRetry?.();
                    }}
                    disabled={isChecking}
                    className="flex-shrink-0 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
                >
                    <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
                    <span>{isChecking ? 'Checking...' : 'Retry Connection'}</span>
                </button>
            </div>
        );
    }

    return null;
}

/**
 * Full-view Offline State Screen
 * Rendered when initial load or major view fails due to no internet.
 */
export function OfflineState({ onRetry, isChecking = false }) {
    const { reconnect } = useNetworkStatus();

    const handleRetry = async () => {
        const ok = await reconnect();
        if (ok) {
            onRetry?.();
        }
    };

    return (
        <div 
            role="alert"
            className="flex-1 w-full min-h-[360px] flex items-center justify-center p-6 bg-stage-bg select-none animate-fade-in"
        >
            <div className="bg-white border border-border-light rounded-2xl shadow-card p-6 sm:p-10 max-w-md w-full text-center flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shadow-2xs">
                    <WifiOff className="w-7 h-7 text-slate-600 animate-pulse-subtle" />
                </div>

                <div className="flex flex-col gap-1.5">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                        No Internet Connection
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                        Your device appears to be offline. Reach International operational records require an active internet connection to load fresh breakdowns and holiday calendars.
                    </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                    <Button
                        variant="primary"
                        size="md"
                        shape="rounded"
                        loading={isChecking}
                        onClick={handleRetry}
                        leftIcon={<RefreshCw className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" />}
                    >
                        {isChecking ? 'Checking...' : 'Retry Connection'}
                    </Button>
                    <Button
                        variant="outline"
                        size="md"
                        shape="rounded"
                        onClick={() => window.location.reload()}
                    >
                        Reload Page
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default OfflineBanner;
