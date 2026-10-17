import React, { useState, useRef } from 'react';
import { formatDateDDMMYYYY } from '../utils/meetingDateUtils.js';
import { formatMeetingSummary, copyTextToClipboard } from '../utils/meetingFormatters.js';
import BreakdownSection from './BreakdownSection.jsx';
import PartsSection from './PartsSection.jsx';
import DirectivesSection from './DirectivesSection.jsx';
import ActionItemsSection from './ActionItemsSection.jsx';
import ChronologicalNav from './ChronologicalNav.jsx';
import MeetingShareMenu from '../../../components/MeetingShareMenu.jsx';
import { exportMeetingBreakdownsToExcel } from '../services/excelExportService.js';

/**
 * Full Operational Meeting Document Component
 * Orchestrates document header, action buttons, discrete breakdown sections, and chronological navigation.
 */
export function MeetingDetailDocument({
    meeting,
    prevMeeting,
    nextMeeting,
    onSelectMeeting,
    onOpenPresentation,
    onOpenCalendar,
    contentRef
}) {
    if (!meeting) return null;

    const [copySuccess, setCopySuccess] = useState(false);
    const [isExportingExcel, setIsExportingExcel] = useState(false);
    const copyTimeoutRef = useRef(null);

    const displayDate = formatDateDDMMYYYY(meeting.date || meeting.dateDisplay || meeting.dateFormatted || meeting.title);
    const isHoliday = Boolean(meeting.isHoliday);
    const notRecorded = Boolean(meeting.notRecorded);
    const noMeetingHeld = Boolean(meeting.noMeetingHeld);

    const handleCopy = async () => {
        const text = formatMeetingSummary(meeting);
        const success = await copyTextToClipboard(text);
        if (success) {
            setCopySuccess(true);
            if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
            copyTimeoutRef.current = setTimeout(() => setCopySuccess(false), 2500);
        }
    };

    const handleExportExcel = async () => {
        setIsExportingExcel(true);
        try {
            await exportMeetingBreakdownsToExcel(meeting);
        } catch (err) {
            console.error('Failed to export to Excel:', err);
        } finally {
            setIsExportingExcel(false);
        }
    };

    return (
        <article 
            ref={contentRef}
            className="bg-white border border-border-light rounded-2xl shadow-card p-4 sm:p-6 lg:p-8 flex flex-col gap-6 select-text transition-all"
            aria-label={`Operational Meeting Document for ${displayDate}`}
        >
            {/* Document Header */}
            <header className="flex flex-col gap-3 pb-5 border-b border-border-light">
                <div className="flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                                Operational Meeting Report
                            </span>
                            {isHoliday && (
                                <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                                    {meeting.holidayName || 'Official Holiday'}
                                </span>
                            )}
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                            {displayDate}
                        </h2>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap select-none">
                        {/* Copy Summary Button */}
                        <button
                            type="button"
                            onClick={handleCopy}
                            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer active:scale-95 min-h-[36px] ${
                                copySuccess
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                    : 'bg-white hover:bg-slate-50 text-slate-700 border-border-light shadow-2xs'
                            }`}
                            title="Copy formatted summary to clipboard"
                        >
                            <span>{copySuccess ? '✓' : '📋'}</span>
                            <span>{copySuccess ? 'Copied!' : 'Copy Summary'}</span>
                        </button>

                        {/* Excel Export Button */}
                        <button
                            type="button"
                            onClick={handleExportExcel}
                            disabled={isExportingExcel}
                            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border border-border-light bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition-all cursor-pointer active:scale-95 disabled:opacity-50 min-h-[36px]"
                            title="Export breakdowns to formatted Excel (.xlsx)"
                        >
                            <span>📊</span>
                            <span>{isExportingExcel ? 'Generating...' : 'Export Excel'}</span>
                        </button>

                        {/* Presentation Mode Button */}
                        {onOpenPresentation && (
                            <button
                                type="button"
                                onClick={onOpenPresentation}
                                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#00a8cc] to-[#0b84a5] hover:from-[#0096b8] hover:to-[#097390] text-white shadow-primary-btn transition-all cursor-pointer active:scale-95 min-h-[36px]"
                                title="Open Presentation Mode (Laser pointer, drawing tools)"
                            >
                                <span>🎯</span>
                                <span className="hidden sm:inline">Presentation</span>
                            </button>
                        )}

                        {/* Share Menu */}
                        <MeetingShareMenu meeting={meeting} />
                    </div>
                </div>

                {/* Focus Line */}
                {meeting.focus && (
                    <div className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <strong className="text-slate-900 font-bold">Agenda & Focus: </strong>
                        {meeting.focus}
                    </div>
                )}
            </header>

            {/* Special State Banners */}
            {isHoliday && (
                <div className="p-4 sm:p-5 rounded-xl bg-amber-50 border border-amber-200/80 border-l-[4px] border-l-amber-500 flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-amber-950 flex items-center gap-1.5">
                            <span>🎉</span>
                            <span>Official Company Holiday: {meeting.holidayName || 'Holiday'}</span>
                        </h4>
                        {onOpenCalendar && (
                            <button
                                type="button"
                                onClick={() => onOpenCalendar(meeting.date)}
                                className="text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-lg border border-amber-300 transition-colors cursor-pointer"
                            >
                                View in Holiday Calendar →
                            </button>
                        )}
                    </div>
                    <p className="text-xs sm:text-[13px] text-amber-900/90 leading-relaxed">
                        Offices, central workshop maintenance, and site operations were closed in observance of {meeting.holidayName || 'the holiday'}. No daily operations breakdown or coordination meeting was conducted.
                    </p>
                </div>
            )}

            {notRecorded && (
                <div className="p-4 rounded-xl bg-slate-100 border border-slate-300/80 border-l-[4px] border-l-slate-500 flex flex-col gap-1.5">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        ⚠️ Operations Status: Meeting Not Recorded (Network Connectivity Issue)
                    </h4>
                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                        The daily operational review was conducted, but meeting recording and transcripts are unavailable due to site internet connectivity issues.
                    </p>
                </div>
            )}

            {!isHoliday && !notRecorded && (!meeting.breakdowns || meeting.breakdowns.length === 0) && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 border-l-[4px] border-l-slate-400 flex flex-col gap-1.5">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        ℹ️ Operations Status: Office Open • No Meeting Held
                    </h4>
                    <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                        Corporate offices and site fleet operations were fully active; no daily breakdown coordination meeting was conducted on this day.
                    </p>
                </div>
            )}

            {/* Section 1: Breakdowns Grid */}
            <BreakdownSection breakdowns={meeting.breakdowns} />

            {/* Section 2: Spare Parts Table */}
            <PartsSection parts={meeting.parts} />

            {/* Section 3: Policy & Process Directives */}
            <DirectivesSection directives={meeting.directives} />

            {/* Section 4: Action Items & Ownership */}
            <ActionItemsSection actionItems={meeting.actionItems} />

            {/* Chronological Navigation Footer */}
            <ChronologicalNav 
                prevMeeting={prevMeeting}
                nextMeeting={nextMeeting}
                onSelectMeeting={onSelectMeeting}
            />
        </article>
    );
}

export default MeetingDetailDocument;
