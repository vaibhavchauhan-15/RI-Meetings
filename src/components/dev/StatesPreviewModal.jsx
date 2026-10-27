import React, { useState } from 'react';
import { 
    Layers, X, WifiOff, Gauge, SearchX, ShieldAlert, LogOut, 
    CheckCircle2, AlertTriangle, Inbox, FileText, Send 
} from 'lucide-react';
import { 
    EmptyState, 
    NoSearchResults, 
    InlineError, 
    OfflineState, 
    SlowNetworkBanner, 
    PermissionDenied, 
    SessionExpiredModal, 
    SuccessView, 
    Skeleton, 
    CalendarSkeleton, 
    TableSkeleton, 
    Spinner 
} from '../feedback/index.js';
import { useToast } from '../feedback/ToastProvider.jsx';
import { FormField, FormInput, useFormValidation } from '../form/index.js';
import { Button } from '../ui/Button.jsx';
import { networkEvents, authEvents } from '../../lib/events/authEvents.js';

/**
 * Reach International Operations - 10 States Dev Preview & Verification Panel
 * 
 * Accessible developer sandbox for testing all 10 core application states:
 * 1. Empty State
 * 2. Loading State (Skeletons & Spinners)
 * 3. Error State (Inline & Boundary)
 * 4. Offline State (No Internet)
 * 5. Slow Network State (2G / >5000ms)
 * 6. No Search Results State
 * 7. Permission Denied (HTTP 403 / RBAC)
 * 8. Session Expired (HTTP 401)
 * 9. Form Validation (Schema + Accessible Feedback)
 * 10. Success State (Toasts & Success Confirmation)
 */
export function StatesPreviewModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('empty'); // 1..10
    const [simulate401, setSimulate401] = useState(false);
    const toast = useToast();

    // Interactive Form validation test setup (State 9)
    const {
        values,
        errors,
        isSubmitting,
        formRef,
        handleChange,
        handleBlur,
        handleSubmit,
        setServerErrors,
        reset
    } = useFormValidation({
        initialValues: {
            siteName: '',
            machineModel: '',
            serialNumber: '',
            issueDescription: '',
            priority: 'urgent'
        },
        rules: {
            siteName: {
                required: true,
                requiredMessage: 'Project site name is required (e.g. Sanand, Indan).',
                minLength: 3
            },
            machineModel: {
                required: true,
                requiredMessage: 'Equipment model is required (e.g. JLG 4047, Genie S-65).'
            },
            serialNumber: {
                required: true,
                requiredMessage: 'Machine serial number is required for asset traceability.'
            },
            issueDescription: {
                required: true,
                requiredMessage: 'Please provide a 1-line description of the technical defect.',
                minLength: 10
            }
        },
        onSubmit: async (data, { setServerErrors, resetForm }) => {
            // Simulate network latency & server validation check
            await new Promise(r => setTimeout(r, 1200));

            // Test server error mapping demonstration if serial is '9999'
            if (data.serialNumber === '9999') {
                setServerErrors({
                    serialNumber: 'Server Error (422): Serial number 9999 is decommissioned in Supabase.'
                });
                toast.error('Submission rejected by server validation.', 'Server Error 422');
                return;
            }

            toast.success('Equipment issue logged successfully to database.', 'Report Submitted');
            setActiveTab('success');
            resetForm();
        }
    });

    return (
        <>
            {/* Floating Dev Trigger Button */}
            <div className="fixed bottom-4 left-4 z-40 select-none">
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="px-3 py-2 bg-slate-900/95 hover:bg-slate-900 text-amber-300 hover:text-amber-200 border border-slate-700/80 rounded-xl text-xs font-bold shadow-xl backdrop-blur-md flex items-center gap-2 cursor-pointer transition-all active:scale-95 group"
                    title="Open UI/UX 10 States Preview Tool"
                >
                    <Layers className="w-4 h-4 text-amber-400 transition-transform duration-200 group-hover:rotate-12" />
                    <span>States Preview (10)</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </button>
            </div>

            {/* Modal Dialog */}
            {isOpen && (
                <div 
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="states-preview-title"
                    className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
                >
                    <div className="bg-white border border-border-light rounded-2xl shadow-modal w-full max-w-4xl h-[90vh] max-h-[820px] flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="p-4 sm:p-5 border-b border-border-light bg-slate-50/70 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-xs">
                                    <Layers className="w-4 h-4" />
                                </div>
                                <div>
                                    <h2 id="states-preview-title" className="text-sm sm:text-base font-black text-slate-900">
                                        UI/UX 10 Application States Sandbox
                                    </h2>
                                    <p className="text-[11px] text-slate-500 font-medium">
                                        Interactive tester verifying Reach International design tokens & accessibility
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
                                aria-label="Close states sandbox"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex items-center gap-1 overflow-x-auto p-2 bg-slate-100 border-b border-border-light text-xs font-bold custom-scrollbar">
                            {[
                                { id: 'empty', label: '1. Empty State' },
                                { id: 'loading', label: '2. Loading (Skeletons)' },
                                { id: 'error', label: '3. Inline Error' },
                                { id: 'offline', label: '4. No Internet' },
                                { id: 'slow', label: '5. Slow Network' },
                                { id: 'nosearch', label: '6. No Search Results' },
                                { id: 'forbidden', label: '7. Permission 403' },
                                { id: 'session', label: '8. Session 401' },
                                { id: 'form', label: '9. Form Validation' },
                                { id: 'success', label: '10. Success & Toast' },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-3 py-1.5 rounded-lg flex-shrink-0 transition-all cursor-pointer ${
                                        activeTab === tab.id
                                            ? 'bg-white text-theme-breakdown shadow-xs border border-slate-200/80 font-black'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Sandbox Viewport Body */}
                        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 bg-stage-bg flex flex-col justify-center items-center custom-scrollbar">
                            {/* 1. Empty State */}
                            {activeTab === 'empty' && (
                                <div className="w-full max-w-md">
                                    <EmptyState
                                        icon={<Inbox className="w-7 h-7 text-slate-400" />}
                                        title="No Operational Meetings"
                                        description="There are currently no breakdown summaries or equipment reports logged for this selected operational month."
                                        action={
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => toast.info('Navigating to month selection...')}
                                            >
                                                Select Active Month
                                            </Button>
                                        }
                                    />
                                </div>
                            )}

                            {/* 2. Loading State */}
                            {activeTab === 'loading' && (
                                <div className="w-full max-w-2xl flex flex-col gap-5">
                                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-border-light">
                                        <span className="text-xs font-bold text-slate-700">Spinners</span>
                                        <div className="flex items-center gap-3">
                                            <Spinner size="xs" color="primary" />
                                            <Spinner size="sm" color="emerald" />
                                            <Spinner size="md" color="amber" />
                                            <Spinner size="lg" color="danger" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <span className="text-xs font-bold text-slate-700">Calendar Skeleton</span>
                                        <CalendarSkeleton />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <span className="text-xs font-bold text-slate-700">Table Skeleton</span>
                                        <TableSkeleton rows={3} cols={4} />
                                    </div>
                                </div>
                            )}

                            {/* 3. Inline Error */}
                            {activeTab === 'error' && (
                                <div className="w-full max-w-lg flex flex-col gap-4">
                                    <InlineError
                                        compact
                                        error="Database timeout: Supabase connection pool exhausted."
                                        onRetry={() => toast.info('Retrying database query...')}
                                        onDismiss={() => toast.warning('Dismissed error alert.')}
                                    />
                                    <InlineError
                                        error={new Error('PGRST116: The result contains 0 rows while exactly 1 row was expected.')}
                                        title="Report Query Failed"
                                        onRetry={() => toast.success('Connection restored.')}
                                    />
                                </div>
                            )}

                            {/* 4. No Internet */}
                            {activeTab === 'offline' && (
                                <div className="w-full max-w-lg">
                                    <OfflineState
                                        onRetry={() => toast.info('Pinging database endpoint...')}
                                    />
                                </div>
                            )}

                            {/* 5. Slow Network */}
                            {activeTab === 'slow' && (
                                <div className="w-full max-w-md bg-white border border-border-light rounded-2xl p-6 text-center flex flex-col items-center gap-4 shadow-card">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                        <Gauge className="w-6 h-6 animate-pulse-subtle" />
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-900">Slow Network Trigger</h3>
                                    <p className="text-xs text-slate-500 max-w-xs">
                                        Click below to trigger the global &gt;5000ms latency banner.
                                    </p>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => {
                                            networkEvents.emit('slow_network', { thresholdMs: 5000 });
                                            toast.warning('Slow network event emitted.');
                                        }}
                                    >
                                        Emit Slow Network Event
                                    </Button>
                                    <SlowNetworkBanner />
                                </div>
                            )}

                            {/* 6. No Search Results */}
                            {activeTab === 'nosearch' && (
                                <div className="w-full max-w-md">
                                    <NoSearchResults
                                        query="NonExistentModel9900"
                                        filters="October 2026 Fleet"
                                        onClear={() => toast.success('Search & filters reset to default.')}
                                    />
                                </div>
                            )}

                            {/* 7. Permission Denied 403 */}
                            {activeTab === 'forbidden' && (
                                <div className="w-full max-w-lg">
                                    <PermissionDenied
                                        resource="Fleet Cost & Imprest Ledger"
                                        requiredRole="Corporate Finance Admin"
                                        onRequestAccess={() => toast.success('Access request submitted to admin.')}
                                        onReturnHome={() => toast.info('Navigating to dashboard...')}
                                    />
                                </div>
                            )}

                            {/* 8. Session Expired 401 */}
                            {activeTab === 'session' && (
                                <div className="w-full max-w-md bg-white border border-border-light rounded-2xl p-6 text-center flex flex-col items-center gap-4 shadow-card">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                        <LogOut className="w-6 h-6 animate-pulse-subtle" />
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-900">Session Expired (401)</h3>
                                    <p className="text-xs text-slate-500 max-w-xs">
                                        Simulate token expiration or click below to launch the modal.
                                    </p>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => setSimulate401(true)}
                                    >
                                        Trigger 401 Modal
                                    </Button>
                                    <SessionExpiredModal
                                        forceOpen={simulate401}
                                        onClose={() => setSimulate401(false)}
                                    />
                                </div>
                            )}

                            {/* 9. Form Validation */}
                            {activeTab === 'form' && (
                                <div className="w-full max-w-lg bg-white border border-border-light rounded-2xl shadow-card p-5 sm:p-7">
                                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border-light">
                                        <FileText className="w-5 h-5 text-theme-breakdown" />
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900">Interactive Equipment Issue Requisition</h3>
                                            <p className="text-[11px] text-slate-500">Test client-side validation, server errors (serial 9999), and auto-focus.</p>
                                        </div>
                                    </div>

                                    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-3.5" noValidate>
                                        <FormField
                                            id="siteName"
                                            label="Project Site"
                                            required
                                            error={errors.siteName}
                                            helperText="Site location where equipment is deployed"
                                        >
                                            <FormInput
                                                id="siteName"
                                                value={values.siteName}
                                                onChange={(e) => handleChange('siteName', e.target.value)}
                                                onBlur={() => handleBlur('siteName')}
                                                placeholder="e.g. Sanand (Blue Star)"
                                                error={errors.siteName}
                                            />
                                        </FormField>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <FormField
                                                id="machineModel"
                                                label="Machine Model"
                                                required
                                                error={errors.machineModel}
                                            >
                                                <FormInput
                                                    id="machineModel"
                                                    value={values.machineModel}
                                                    onChange={(e) => handleChange('machineModel', e.target.value)}
                                                    onBlur={() => handleBlur('machineModel')}
                                                    placeholder="e.g. JLG 4047"
                                                    error={errors.machineModel}
                                                />
                                            </FormField>

                                            <FormField
                                                id="serialNumber"
                                                label="Serial Number"
                                                required
                                                error={errors.serialNumber}
                                                helperText="Type '9999' to test server 422 error"
                                            >
                                                <FormInput
                                                    id="serialNumber"
                                                    value={values.serialNumber}
                                                    onChange={(e) => handleChange('serialNumber', e.target.value)}
                                                    onBlur={() => handleBlur('serialNumber')}
                                                    placeholder="e.g. B20001388"
                                                    error={errors.serialNumber}
                                                />
                                            </FormField>
                                        </div>

                                        <FormField
                                            id="issueDescription"
                                            label="Technical Defect Summary"
                                            required
                                            error={errors.issueDescription}
                                            helperText="Single-line concise defect description (min 10 characters)"
                                        >
                                            <FormInput
                                                as="textarea"
                                                id="issueDescription"
                                                rows={2}
                                                value={values.issueDescription}
                                                onChange={(e) => handleChange('issueDescription', e.target.value)}
                                                onBlur={() => handleBlur('issueDescription')}
                                                placeholder="Describe defect, root cause, or missing component..."
                                                error={errors.issueDescription}
                                            />
                                        </FormField>

                                        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border-light">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={reset}
                                            >
                                                Reset
                                            </Button>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                type="submit"
                                                loading={isSubmitting}
                                                rightIcon={<Send className="w-3.5 h-3.5" />}
                                            >
                                                Submit Requisition
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* 10. Success & Toast */}
                            {activeTab === 'success' && (
                                <div className="w-full max-w-lg flex flex-col gap-4">
                                    <SuccessView
                                        title="Breakdown Record Dispatched"
                                        description="The machine breakdown summary has been verified and persisted to Supabase."
                                        details={[
                                            { label: 'Site', value: 'Sanand Project Site' },
                                            { label: 'Equipment', value: 'JLG 4047 Electric Scissor' },
                                            { label: 'Tracking ID', value: 'REC-2026-1026-01' }
                                        ]}
                                    />
                                    <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                                        <Button
                                            variant="success"
                                            size="sm"
                                            onClick={() => toast.success('Changes successfully saved to database.')}
                                        >
                                            Trigger Success Toast
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => toast.error('Failed to communicate with Supabase.')}
                                        >
                                            Trigger Error Toast
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => toast.info('Export started in background.')}
                                        >
                                            Trigger Info Toast
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default StatesPreviewModal;
