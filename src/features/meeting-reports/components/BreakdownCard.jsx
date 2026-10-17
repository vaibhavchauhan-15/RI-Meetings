import React from 'react';
import { 
    MapPin, 
    AlertCircle, 
    CheckCircle2, 
    Truck, 
    Info, 
    Clock, 
    Activity 
} from 'lucide-react';

/**
 * Single Machine Fleet Breakdown Card
 * Adheres strictly to AGENTS.md & design.md rules:
 * - Strictly ONE machine per card (discrete fields: site, model, serial, issue, action, logistics, clarification, pending, status)
 * - Blue left border accent (border-left: 4px solid #0066cc)
 * - Concise, single-line informative typography
 */
export function BreakdownCard({ machine, index }) {
    if (!machine) return null;

    const site = machine.site || machine.site_location || machine.location || 'General Fleet Site';
    const model = machine.model || machine.machine_model || '';
    const serial = machine.serialNumber || machine.serial_number || machine.serial || '';
    const issue = machine.issue || machine.short_issue || machine.problem || machine.description || '';
    const action = machine.action || machine.short_action || machine.full_action || '';
    const logistics = machine.logistics || machine.short_logistics || '';
    const clarification = machine.clarification || machine.short_clarification || '';
    const pending = machine.pendingIssue || machine.pending_issue || machine.short_pending || '';
    const status = machine.status || machine.short_status || '';

    return (
        <article className="bg-white rounded-xl border border-border-light border-l-[4px] border-l-theme-breakdown p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col gap-2.5 group">
            {/* Header: Site location & Machine index badge */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-theme-breakdown uppercase tracking-wider inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-theme-breakdown flex-shrink-0" />
                        <span>{site}</span>
                    </span>
                    {(model || serial) && (
                        <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                            {model && (
                                <span className="text-xs sm:text-[13px] font-bold text-slate-900">
                                    {model}
                                </span>
                            )}
                            {serial && serial !== 'N/A' && (
                                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                    S/N: {serial}
                                </span>
                            )}
                        </div>
                    )}
                </div>
                {typeof index === 'number' && (
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                        #{index + 1}
                    </span>
                )}
            </div>

            {/* Issue Description */}
            {issue && (
                <div className="text-xs sm:text-[13px] text-slate-800 leading-relaxed font-normal flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <span className="font-semibold text-slate-900">Issue: </span>
                        {issue}
                    </div>
                </div>
            )}

            {/* Action & Technician */}
            {action && (
                <div className="text-xs sm:text-[12.5px] text-slate-700 leading-relaxed bg-blue-50/50 p-2 rounded-lg border border-blue-100/60 flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 flex-shrink-0 mt-0.5" />
                    <div>
                        <span className="font-semibold text-blue-950">Action: </span>
                        {action}
                    </div>
                </div>
            )}

            {/* Logistics & Parts (if present) */}
            {logistics && logistics !== 'undefined' && String(logistics).trim() && (
                <div className="text-[11.5px] sm:text-xs text-slate-600 flex items-start gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <span className="font-semibold text-slate-700">Logistics: </span>
                        <span>{logistics}</span>
                    </div>
                </div>
            )}

            {/* Clarification / Operating Context (if present) */}
            {clarification && clarification !== 'undefined' && String(clarification).trim() && (
                <div className="text-[11.5px] sm:text-xs text-slate-600 flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <span className="font-semibold text-slate-700">Note: </span>
                        <span>{clarification}</span>
                    </div>
                </div>
            )}

            {/* Footer: Pending blockers and lifecycle status */}
            {(pending || status) && (
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 flex-wrap text-[11px]">
                    {pending && pending !== 'undefined' && String(pending).trim() ? (
                        <div className="text-amber-700 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-600 flex-shrink-0" />
                            <span className="font-bold">Pending: </span>
                            <span>{pending}</span>
                        </div>
                    ) : <div />}
                    {status && status !== 'undefined' && String(status).trim() && (
                        <span className="px-2 py-0.5 rounded font-semibold bg-slate-100 text-slate-700 border border-slate-200 inline-flex items-center gap-1">
                            <Activity className="w-3 h-3 text-slate-500" />
                            <span>{status}</span>
                        </span>
                    )}
                </div>
            )}
        </article>
    );
}

export default BreakdownCard;
