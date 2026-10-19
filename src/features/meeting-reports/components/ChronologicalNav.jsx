import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDateDDMMYYYY } from '../utils/meetingDateUtils.js';
import Tooltip from '../../../components/shared/Tooltip.jsx';

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

    const prevDate = prevMeeting ? formatDateDDMMYYYY(prevMeeting.date || prevMeeting.dateDisplay || prevMeeting.title) : '';
    const nextDate = nextMeeting ? formatDateDDMMYYYY(nextMeeting.date || nextMeeting.dateDisplay || nextMeeting.title) : '';

    return (
        <nav 
            className="grid grid-cols-2 gap-2 sm:gap-4 pt-5 sm:pt-6 border-t border-border-light mt-6" 
            aria-label="Chronological Meeting Navigation"
        >
            {/* Previous Meeting Card */}
            {prevMeeting ? (
                <Tooltip
                    content={`Go to previous meeting (${prevDate})`}
                    position="top"
                    className="w-full"
                >
                    <button
                        type="button"
                        onClick={() => onSelectMeeting(prevMeeting)}
                        className="w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3.5 rounded-xl border border-border-light bg-white hover:bg-slate-50/80 hover:border-[#00a8cc] shadow-2xs transition-all cursor-pointer group active:scale-[0.98] min-h-[48px] text-left"
                        aria-label={`Previous meeting: ${prevDate}`}
                    >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 group-hover:bg-[#00a8cc]/10 text-slate-500 group-hover:text-[#00a8cc] flex items-center justify-center flex-shrink-0 transition-colors">
                            <ChevronLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[10px] text-slate-400 group-hover:text-[#00a8cc] font-bold uppercase tracking-wider truncate transition-colors">
                                Previous Meeting
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-slate-900 truncate">
                                {prevDate}
                            </span>
                        </div>
                    </button>
                </Tooltip>
            ) : (
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3.5 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 min-h-[48px] opacity-60 select-none">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-200/60 text-slate-400 flex items-center justify-center flex-shrink-0">
                        <ChevronLeft className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">Oldest Archive</span>
                        <span className="text-xs sm:text-sm font-medium text-slate-400 truncate">First Meeting</span>
                    </div>
                </div>
            )}

            {/* Next Meeting Card */}
            {nextMeeting ? (
                <Tooltip
                    content={`Go to next meeting (${nextDate})`}
                    position="top"
                    className="w-full"
                >
                    <button
                        type="button"
                        onClick={() => onSelectMeeting(nextMeeting)}
                        className="w-full flex items-center justify-between gap-2 sm:gap-3 p-2 sm:p-3.5 rounded-xl border border-border-light bg-white hover:bg-slate-50/80 hover:border-[#00a8cc] shadow-2xs transition-all cursor-pointer group active:scale-[0.98] min-h-[48px] text-right"
                        aria-label={`Next meeting: ${nextDate}`}
                    >
                        <div className="flex flex-col min-w-0 text-right flex-1">
                            <span className="text-[10px] text-slate-400 group-hover:text-[#00a8cc] font-bold uppercase tracking-wider truncate transition-colors">
                                Next Meeting
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-slate-900 truncate">
                                {nextDate}
                            </span>
                        </div>
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 group-hover:bg-[#00a8cc]/10 text-slate-500 group-hover:text-[#00a8cc] flex items-center justify-center flex-shrink-0 transition-colors">
                            <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </div>
                    </button>
                </Tooltip>
            ) : (
                <div className="flex items-center justify-between gap-2 sm:gap-3 p-2 sm:p-3.5 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 min-h-[48px] opacity-60 select-none text-right">
                    <div className="flex flex-col min-w-0 text-right flex-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">Latest Archive</span>
                        <span className="text-xs sm:text-sm font-medium text-slate-400 truncate">Latest Meeting</span>
                    </div>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-200/60 text-slate-400 flex items-center justify-center flex-shrink-0">
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                </div>
            )}
        </nav>
    );
}

export default ChronologicalNav;
