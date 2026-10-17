import React from 'react';
import { MONTH_NAMES } from '../utils/holidayDateUtils.js';

/**
 * CalendarHeader Component
 * Clean, compact calendar header with short title and month navigation controls.
 */
export default function CalendarHeader({
    currentMonth, // 1 to 12
    currentYear = 2026,
    onPrevMonth,
    onNextMonth,
    onClose
}) {
    const monthName = MONTH_NAMES[currentMonth - 1] || '';

    return (
        <div className="flex flex-col gap-2 pb-2 border-b border-border-light select-none">
            {/* Top row: Short Title & Close action */}
            <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                    Calendar
                </h2>

                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer flex-shrink-0"
                        title="Close calendar sidebar"
                        aria-label="Close calendar sidebar"
                    >
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                )}
            </div>

            {/* Month & Year with Navigation Controls */}
            <div className="flex items-center justify-between gap-2 bg-slate-50/80 rounded-xl px-2.5 py-1.5 border border-slate-200/70">
                {/* Previous Month Action */}
                <button
                    type="button"
                    onClick={onPrevMonth}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-950 hover:bg-white active:scale-90 border border-transparent hover:border-border-light transition-all cursor-pointer shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    title="Previous month"
                    aria-label="Previous month"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>

                {/* Visible Month & Year Label */}
                <div className="text-center min-w-[140px]">
                    <span className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                        {monthName} {currentYear}
                    </span>
                </div>

                {/* Next Month Action */}
                <button
                    type="button"
                    onClick={onNextMonth}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-950 hover:bg-white active:scale-90 border border-transparent hover:border-border-light transition-all cursor-pointer shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    title="Next month"
                    aria-label="Next month"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </div>
        </div>
    );
}
