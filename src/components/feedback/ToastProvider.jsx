import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />,
    info: <Info className="w-4 h-4 text-[#00a8cc] flex-shrink-0" />
};

const BORDER_COLORS = {
    success: 'border-emerald-200/90 bg-emerald-50/90 text-emerald-950',
    error: 'border-red-200/90 bg-red-50/90 text-red-950',
    warning: 'border-amber-200/90 bg-amber-50/90 text-amber-950',
    info: 'border-blue-200/90 bg-blue-50/90 text-blue-950'
};

/**
 * Reach International Operations - Toast Component
 */
export function ToastItem({ id, type = 'info', title, message, onDismiss }) {
    const icon = ICONS[type] || ICONS.info;
    const borderClass = BORDER_COLORS[type] || BORDER_COLORS.info;

    return (
        <div 
            role="status"
            aria-live="polite"
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
                className="p-1 rounded-lg hover:bg-black/5 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer flex-shrink-0"
                aria-label="Dismiss toast"
            >
                <X className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}

/**
 * ToastProvider Wrapper
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

    const showToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        const newToast = { id, type, title, message };

        setToasts(prev => [...prev, newToast]);

        if (duration > 0) {
            const timer = setTimeout(() => {
                dismissToast(id);
            }, duration);
            timersRef.current.set(id, timer);
        }

        return id;
    }, [dismissToast]);

    const toastApi = {
        show: showToast,
        success: (message, title = 'Success', duration = 3500) => showToast({ type: 'success', title, message, duration }),
        error: (message, title = 'Error', duration = 5000) => showToast({ type: 'error', title, message, duration }),
        warning: (message, title = 'Warning', duration = 4000) => showToast({ type: 'warning', title, message, duration }),
        info: (message, title = 'Notice', duration = 3500) => showToast({ type: 'info', title, message, duration }),
        dismiss: dismissToast
    };

    return (
        <ToastContext.Provider value={toastApi}>
            {children}
            {/* Toast Container: bottom-center on mobile, bottom-right on desktop */}
            <div 
                className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 flex flex-col gap-2 pointer-events-none items-center sm:items-end"
                aria-live="polite"
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
        // Fallback no-op if used outside provider
        return {
            show: () => {},
            success: () => {},
            error: () => {},
            warning: () => {},
            info: () => {},
            dismiss: () => {}
        };
    }
    return ctx;
}

export default ToastProvider;
