import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const MAX_TOASTS = 5;

const TOAST_DURATIONS = {
    success: 3500,
    info: 3500,
    warning: 4000,
    error: 5000
};

const ICONS = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />,
    info: <Info className="w-4 h-4 text-[#00a8cc] flex-shrink-0" />
};

const BORDER_COLORS = {
    success: 'border-emerald-200/90 bg-emerald-50/95 text-emerald-950',
    error: 'border-red-200/90 bg-red-50/95 text-red-950',
    warning: 'border-amber-200/90 bg-amber-50/95 text-amber-950',
    info: 'border-blue-200/90 bg-blue-50/95 text-blue-950'
};

/**
 * Reach International Operations - Accessible Toast Item Component
 */
export function ToastItem({ id, type = 'info', title, message, onDismiss }) {
    const icon = ICONS[type] || ICONS.info;
    const borderClass = BORDER_COLORS[type] || BORDER_COLORS.info;
    const isAlert = type === 'error' || type === 'warning';

    return (
        <div 
            role={isAlert ? "alert" : "status"}
            aria-live={isAlert ? "assertive" : "polite"}
            aria-atomic="true"
            className={`w-full max-w-sm rounded-2xl border p-3.5 shadow-xl backdrop-blur-md flex items-start gap-3 transition-all duration-300 animate-slide-in select-none ${borderClass}`}
        >
            <div className="pt-0.5">{icon}</div>
            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                {title && <h5 className="text-xs font-bold leading-tight">{title}</h5>}
                <p className="text-xs leading-relaxed opacity-90">{message}</p>
            </div>
            <button
                type="button"
                onClick={() => onDismiss(id)}
                className="p-1.5 -mr-1 -mt-1 rounded-lg hover:bg-black/5 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer flex-shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center active:scale-95"
                aria-label="Dismiss notification"
            >
                <X className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}

/**
 * Reach International Operations - ToastProvider Wrapper
 * Enforces deduplication, max stack size, token-driven auto-dismiss, and accessibility live regions.
 */
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timersRef = useRef(new Map());

    const dismissToast = useCallback((id) => {
        if (timersRef.current.has(id)) {
            clearTimeout(timersRef.current.get(id));
            timersRef.current.delete(id);
        }
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const showToast = useCallback(({ type = 'info', title, message, duration }) => {
        if (!message) return null;

        const effectiveDuration = duration !== undefined ? duration : (TOAST_DURATIONS[type] || 3500);

        // Deduplication: if exact duplicate (same type & message) exists, skip re-adding
        let duplicateFound = false;
        setToasts(prev => {
            const isDuplicate = prev.some(t => t.type === type && t.message === message);
            if (isDuplicate) {
                duplicateFound = true;
                return prev;
            }

            const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
            const newToast = { id, type, title, message };

            // Clamp max stack size to MAX_TOASTS (evict oldest if needed)
            const updated = prev.length >= MAX_TOASTS ? [...prev.slice(1), newToast] : [...prev, newToast];

            if (effectiveDuration > 0) {
                const timer = setTimeout(() => {
                    dismissToast(id);
                }, effectiveDuration);
                timersRef.current.set(id, timer);
            }

            return updated;
        });

        return duplicateFound ? null : true;
    }, [dismissToast]);

    const toastApi = {
        show: showToast,
        success: (message, title = 'Success', duration = TOAST_DURATIONS.success) => 
            showToast({ type: 'success', title, message, duration }),
        error: (message, title = 'Error', duration = TOAST_DURATIONS.error) => 
            showToast({ type: 'error', title, message, duration }),
        warning: (message, title = 'Warning', duration = TOAST_DURATIONS.warning) => 
            showToast({ type: 'warning', title, message, duration }),
        info: (message, title = 'Notice', duration = TOAST_DURATIONS.info) => 
            showToast({ type: 'info', title, message, duration }),
        dismiss: dismissToast,
        clearAll: () => {
            timersRef.current.forEach(timer => clearTimeout(timer));
            timersRef.current.clear();
            setToasts([]);
        }
    };

    return (
        <ToastContext.Provider value={toastApi}>
            {children}
            {/* Live notification container: bottom-center on mobile, bottom-right on desktop */}
            <div 
                className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 flex flex-col gap-2 pointer-events-none items-center sm:items-end"
                aria-live="polite"
                aria-relevant="additions text"
            >
                {toasts.map(toast => (
                    <div key={toast.id} className="pointer-events-auto w-full sm:w-auto">
                        <ToastItem {...toast} onDismiss={dismissToast} />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        return {
            show: () => {},
            success: () => {},
            error: () => {},
            warning: () => {},
            info: () => {},
            dismiss: () => {},
            clearAll: () => {}
        };
    }
    return ctx;
}

export default ToastProvider;
