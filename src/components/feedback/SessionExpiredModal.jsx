import React, { useState, useEffect } from 'react';
import { LogOut, RefreshCw, Key, ShieldCheck } from 'lucide-react';
import { authEvents } from '../../lib/events/authEvents.js';
import { Button } from '../ui/Button.jsx';
import { supabase } from '../../lib/supabase/client.js';

/**
 * Reach International Operations - Session Expired Flow (HTTP 401)
 * 
 * Non-dismissible accessible modal that renders whenever a Supabase JWT expires
 * or a 401 response is trapped by the API client.
 * Preserves the exact user returnTo URL and prevents infinite redirect loops.
 */
export function SessionExpiredModal({ forceOpen = false, onClose }) {
    const [isOpen, setIsOpen] = useState(forceOpen);
    const [returnUrl, setReturnUrl] = useState('/');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [refreshError, setRefreshError] = useState(null);

    useEffect(() => {
        if (forceOpen) {
            setIsOpen(true);
            return;
        }

        const unsubscribe = authEvents.on('session_expired', (payload) => {
            setReturnUrl(payload?.returnTo || (typeof window !== 'undefined' ? window.location.href : '/'));
            setIsOpen(true);
        });

        return () => unsubscribe();
    }, [forceOpen]);

    const handleRefreshSession = async () => {
        setIsRefreshing(true);
        setRefreshError(null);
        try {
            const { data, error } = await supabase.auth.refreshSession();
            if (error || !data?.session) {
                throw new Error(error?.message || 'Token refresh failed. Please log in with your corporate credentials.');
            }
            // Success: session restored
            setIsOpen(false);
            onClose?.();
            if (typeof window !== 'undefined') {
                window.location.reload();
            }
        } catch (err) {
            setRefreshError(err.message || 'Session renewal failed. Please proceed to corporate sign-in.');
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleRedirectLogin = () => {
        if (typeof window !== 'undefined') {
            const redirectParam = encodeURIComponent(returnUrl);
            window.location.href = `/login?expired=true&returnTo=${redirectParam}`;
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="session-expired-title"
            aria-describedby="session-expired-desc"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in select-none"
        >
            <div className="bg-white border border-border-light rounded-2xl shadow-modal p-6 sm:p-8 max-w-md w-full text-center flex flex-col items-center gap-4">
                {/* Visual Icon Badge */}
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center flex-shrink-0 shadow-2xs">
                    <LogOut className="w-7 h-7 animate-pulse-subtle" />
                </div>

                {/* Title & Explanations */}
                <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 w-fit mx-auto">
                        HTTP 401 · Authentication Required
                    </span>
                    <h3 id="session-expired-title" className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-1">
                        Session Expired
                    </h3>
                    <p id="session-expired-desc" className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                        Your secure session has timed out. To prevent unauthorized operational record changes, please re-authenticate or refresh your session.
                    </p>
                </div>

                {/* Return URL Indicator */}
                <div className="w-full bg-slate-50 border border-slate-200/90 rounded-xl p-2.5 text-slate-600 text-[11px] flex items-center justify-center gap-2">
                    <Key className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">Active work state saved. You will return to this view upon sign-in.</span>
                </div>

                {refreshError && (
                    <div className="w-full bg-red-50 border border-red-200 text-red-700 rounded-xl p-2.5 text-xs text-center font-medium animate-fade-in">
                        {refreshError}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2 w-full">
                    <Button
                        variant="primary"
                        size="md"
                        shape="rounded"
                        className="w-full sm:w-auto flex-1"
                        onClick={handleRedirectLogin}
                        leftIcon={<ShieldCheck className="w-4 h-4" />}
                    >
                        Sign In Again
                    </Button>
                    <Button
                        variant="outline"
                        size="md"
                        shape="rounded"
                        className="w-full sm:w-auto"
                        loading={isRefreshing}
                        onClick={handleRefreshSession}
                        leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                    >
                        {isRefreshing ? 'Renewing...' : 'Quick Renew'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default SessionExpiredModal;
