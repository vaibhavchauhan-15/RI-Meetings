import React from 'react';
import { formatDateDDMMYYYY } from '../utils/meetingDateUtils.js';

/**
 * Chronological Navigation Bar at bottom of operational document
 * Allows seamless traversing to previous and next daily meetings.
 */
export function ChronologicalNav({ 
    prevMeeting, 
    nextMeeting, 
    onSelectMeeting 
}) {
    if (!prevMeeting && !nextMeeting) return null;

    return (
        <nav 
            className="flex items-center justify-between gap-3 pt-4 sm:pt-6 border-t border-border-light mt-4" 
            aria-label="Chronological Meeting Navigation"
        >
            {prevMeeting ? (
                <button
                    type="button"
                    onClick={() => onSelectMeeting(prevMeeting)}
                    className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-theme-breakdown p-2 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group active:scale-95"
                >
                    <span className="text-base group-hover:-translate-x-0.5 transition-transform">←</span>
                    <div className="flex flex-col text-left">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Previous Meeting</span>
                        <span>{formatDateDDMMYYYY(prevMeeting.date || prevMeeting.dateDisplay || prevMeeting.title)}</span>
                    </div>
                </button>
            ) : <div />}

            {nextMeeting ? (
                <button
                    type="button"
                    onClick={() => onSelectMeeting(nextMeeting)}
                    className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-theme-breakdown p-2 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group active:scale-95 ml-auto"
                >
                    <div className="flex flex-col text-right">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Next Meeting</span>
                        <span>{formatDateDDMMYYYY(nextMeeting.date || nextMeeting.dateDisplay || nextMeeting.title)}</span>
                    </div>
                    <span className="text-base group-hover:translate-x-0.5 transition-transform">→</span>
                </button>
            ) : <div />}
        </nav>
    );
}

export default ChronologicalNav;
