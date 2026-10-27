import React, { useState } from 'react';
import { ShieldAlert, ArrowLeft, Home, KeyRound, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button.jsx';

/**
 * Reach International Operations - Permission Denied (HTTP 403 / RBAC)
 * 
 * Rendered when a user attempts to access restricted operational features,
 * management approval sections, or database endpoints without the required role.
 */
export function PermissionDenied({
    resource = 'Operational Resource',
    requiredRole = 'Operations Manager / Supervisor',
    onGoBack,
    onReturnHome,
    onRequestAccess,
    className = ''
}) {
    const [accessRequested, setAccessRequested] = useState(false);

    const handleRequestAccess = () => {
        setAccessRequested(true);
        onRequestAccess?.();
    };

    const handleReturnHome = () => {
        if (onReturnHome) {
            onReturnHome();
        } else if (typeof window !== 'undefined') {
            window.location.search = '';
        }
    };

    const handleGoBack = () => {
        if (onGoBack) {
            onGoBack();
        } else if (typeof window !== 'undefined' && window.history.length > 1) {
            window.history.back();
        } else {
            handleReturnHome();
        }
    };

    return (
        <div 
            role="alert"
            aria-live="assertive"
            className={`flex-1 w-full min-h-[380px] flex items-center justify-center p-4 sm:p-6 bg-stage-bg select-none animate-fade-in ${className}`}
        >
            <div className="bg-white border border-border-light rounded-2xl shadow-card p-6 sm:p-10 max-w-lg w-full text-center flex flex-col items-center gap-4">
                {/* Visual Icon Badge */}
                <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shadow-2xs">
                    <ShieldAlert className="w-8 h-8 animate-pulse-subtle" />
                </div>

                {/* Status Code & Headings */}
                <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 w-fit mx-auto">
                        HTTP 403 · Access Forbidden
                    </span>
                    <h3 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight mt-1">
                        Permission Denied
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                        Your account credentials do not have permission to view or edit <strong className="text-slate-800">{resource}</strong>. This operational area requires <strong className="text-slate-800">{requiredRole}</strong> authorization.
                    </p>
                </div>

                {/* Request Access Feedback Alert */}
                {accessRequested ? (
                    <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 flex items-center justify-center gap-2 text-xs font-semibold animate-fade-in">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>Role elevation request dispatched to Plant Administrator.</span>
                    </div>
                ) : (
                    <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-600 text-xs flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                            <KeyRound className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span className="truncate">Need clearance for this machine fleet?</span>
                        </div>
                        <button
                            type="button"
                            onClick={handleRequestAccess}
                            className="font-bold text-theme-breakdown hover:underline flex-shrink-0 cursor-pointer active:scale-95"
                        >
                            Request Access
                        </button>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2 w-full">
                    <Button
                        variant="primary"
                        size="md"
                        shape="rounded"
                        onClick={handleReturnHome}
                        leftIcon={<Home className="w-3.5 h-3.5" />}
                    >
                        Return to Dashboard
                    </Button>
                    <Button
                        variant="outline"
                        size="md"
                        shape="rounded"
                        onClick={handleGoBack}
                        leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
                    >
                        Go Back
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default PermissionDenied;
