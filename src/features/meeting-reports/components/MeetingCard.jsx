import React from 'react';
import { formatDateDDMMYYYY } from '../utils/meetingDateUtils.js';

/**
 * MeetingCard Component
 * Displays a single meeting summary in the stream list with count badges and status indicators.
 */
export function MeetingCard({
    meeting,
    isSelected = false,
    onSelect,
    onOpenCalendar
}) {
    if (!meeting) return null;

    const displayDate = formatDateDDMMYYYY(meeting.date || meeting.dateDisplay || meeting.dateFormatted || meeting.title);
    const isHoliday = Boolean(meeting.isHoliday);
    const noMeetingHeld = Boolean(meeting.noMeetingHeld);
    const notRecorded = Boolean(meeting.notRecorded);

    // Case 1: Official Holiday Card
    if (isHoliday) {
        return (
            <div
                onClick={() => onSelect(meeting)}
                className={`p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer select-none flex items-center justify-between gap-2 ${
                    isSelected 
                        ? 'bg-amber-50/90 border-amber-400 shadow-card' 
                        : 'bg-amber-50/40 hover:bg-amber-50/80 border-amber-200/80 shadow-2xs hover:shadow-xs'
                }`}
            >
                <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-[13px] font-bold text-amber-950">
                            {displayDate}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300/80">
                            {meeting.holidayName || 'Official Holiday'}
                        </span>
                    </div>
                    <p className="text-xs text-amber-900/80 truncate">
                        Office and site fleet operations closed.
                    </p>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                    {onOpenCalendar && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpenCalendar(meeting.date);
                            }}
                            className="text-[10px] font-bold px-2 py-1 rounded-md bg-amber-100 text-amber-900 border border-amber-300/80 hover:bg-amber-200/80 transition-colors flex items-center gap-1 cursor-pointer active:scale-95"
                            title="View in Company Holiday Calendar"
                        >
                            <span>Calendar</span>
                            <span>→</span>
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // Case 2: Meeting Not Recorded (Internet Connectivity) Card
    if (notRecorded) {
        return (
            <div
                onClick={() => onSelect(meeting)}
                className={`p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer select-none flex flex-col gap-1 ${
                    isSelected 
                        ? 'bg-slate-100/90 border-slate-400 shadow-card' 
                        : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 shadow-2xs'
                }`}
            >
                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs sm:text-[13px] font-bold text-slate-800">
                        {displayDate}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                        Recording Unavailable
                    </span>
                </div>
                <p className="text-xs text-slate-600 truncate">
                    Operations meeting held; recording unavailable due to network issue.
                </p>
            </div>
        );
    }

    // Case 3: Office Open / No Meeting Held Card
    if (noMeetingHeld || (meeting.breakdownCount === 0 && meeting.partsCount === 0 && meeting.directivesCount === 0 && meeting.actionItemsCount === 0)) {
        return (
            <div
                onClick={() => onSelect(meeting)}
                className={`p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer select-none flex flex-col gap-1 ${
                    isSelected 
                        ? 'bg-slate-100/90 border-slate-400 shadow-card' 
                        : 'bg-white hover:bg-slate-50 border-border-light shadow-2xs'
                }`}
            >
                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs sm:text-[13px] font-bold text-slate-800">
                        {displayDate}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                        No Meeting Held
                    </span>
                </div>
                <p className="text-xs text-slate-500 truncate">
                    Workshops & offices operational; no formal coordination meeting.
                </p>
            </div>
        );
    }

    // Case 4: Standard Operational Meeting Card with Badges
    return (
        <div
            onClick={() => onSelect(meeting)}
            className={`p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer select-none flex flex-col gap-2 ${
                isSelected 
                    ? 'bg-blue-50/30 border-theme-breakdown shadow-card ring-1 ring-theme-breakdown/20' 
                    : 'bg-white hover:bg-slate-50/70 border-border-light shadow-2xs hover:shadow-xs'
            }`}
        >
            {/* Header: Date & Focus */}
            <div className="flex items-start justify-between gap-2">
                <span className="text-xs sm:text-[13px] font-bold text-slate-900">
                    {displayDate}
                </span>
                {meeting.breakdownCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-theme-breakdown border border-blue-200/60 flex-shrink-0">
                        {meeting.breakdownCount} {meeting.breakdownCount === 1 ? 'Breakdown' : 'Breakdowns'}
                    </span>
                )}
            </div>

            {/* Agenda Focus Line */}
            {meeting.focus && (
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {meeting.focus}
                </p>
            )}

            {/* Bottom Meta Stats Strip */}
            <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 text-[10px] text-slate-500 flex-wrap">
                {meeting.partsCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        📦 {meeting.partsCount} {meeting.partsCount === 1 ? 'Part' : 'Parts'}
                    </span>
                )}
                {meeting.directivesCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 font-medium border border-amber-200/50">
                        📌 {meeting.directivesCount}
                    </span>
                )}
                {meeting.actionItemsCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-medium border border-emerald-200/50">
                        👤 {meeting.actionItemsCount}
                    </span>
                )}
            </div>
        </div>
    );
}

export default MeetingCard;
