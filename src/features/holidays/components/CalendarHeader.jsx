import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { MONTH_NAMES, MONTH_SHORT_NAMES } from '../utils/holidayDateUtils.js';
import { getHolidaysForMonth } from '../services/holidayService.js';

/**
 * CalendarHeader Component
 * Simplified, single-row compact calendar header:
 * - Combines month selector and navigation into one compact row
 * - Keeps Today as a small secondary button
 * - Reduces oversized padding and card height
 * - Makes the close icon smaller and less visually prominent
 */
export default function CalendarHeader({
    currentMonth, // 1 to 12
    currentYear = 2026,
    onPrevMonth,
    onNextMonth,
    onToday,
    onNavigateMonth,
    onClose
}) {
    const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
    const monthPickerRef = useRef(null);
    const monthName = MONTH_NAMES[currentMonth - 1] || '';

    // Close month picker on outside click / tap
    useEffect(() => {
        function handleClickOutside(event) {
            if (monthPickerRef.current && !monthPickerRef.current.contains(event.target)) {
                setIsMonthPickerOpen(false);
            }
        }
        if (isMonthPickerOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isMonthPickerOpen]);

    // Close on Escape key
    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === 'Escape' && isMonthPickerOpen) {
                setIsMonthPickerOpen(false);
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isMonthPickerOpen]);

    return (
        <div className="relative flex items-center justify-between gap-1.5 pb-2 border-b border-border-light select-none">
            {/* Left: Combined Calendar Title & Interactive Month/Year Selector */}
            <div className="relative flex flex-col justify-center min-w-0" ref={monthPickerRef}>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                    Calendar
                </span>
                <button
                    type="button"
                    onClick={() => setIsMonthPickerOpen(prev => !prev)}
                    className="flex items-center gap-1 text-sm sm:text-base font-black text-slate-900 hover:text-blue-600 transition-colors cursor-pointer group text-left min-w-0 mt-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                    title="Click to jump directly to any month (Jan - Dec 2026)"
                    aria-expanded={isMonthPickerOpen}
                    aria-label={`Current month: ${monthName} ${currentYear}. Click to pick a month.`}
                >
                    <span className="truncate">{monthName} {currentYear}</span>
                    <ChevronDown 
                        className={`w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-transform duration-200 flex-shrink-0 ${
                            isMonthPickerOpen ? 'rotate-180 text-blue-600' : ''
                        }`} 
                    />
                </button>

                {/* Quick Month Selector Popover (Jan-Dec 2026) */}
                {isMonthPickerOpen && (
                    <div 
                        className="absolute top-full left-0 mt-2 z-50 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 animate-in fade-in zoom-in-95 duration-150 select-none"
                        role="dialog"
                        aria-label="Select month"
                    >
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1 pb-1 mb-1 border-b border-slate-100 flex items-center justify-between">
                            <span>Jump to Month ({currentYear})</span>
                            <span className="text-slate-400">12 Months</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                            {MONTH_SHORT_NAMES.map((mShort, idx) => {
                                const mNum = idx + 1;
                                const isCurrent = mNum === currentMonth;
                                const holidayCount = getHolidaysForMonth(mNum, currentYear).length;

                                return (
                                    <button
                                        key={mShort}
                                        type="button"
                                        onClick={() => {
                                            if (onNavigateMonth) onNavigateMonth(mNum);
                                            setIsMonthPickerOpen(false);
                                        }}
                                        className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 active:scale-95 ${
                                            isCurrent
                                                ? 'bg-blue-600 text-white shadow-2xs font-extrabold'
                                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60 hover:border-slate-300'
                                        }`}
                                    >
                                        <span>{mShort}</span>
                                        {holidayCount > 0 && (
                                            <span className={`text-[8px] font-semibold flex items-center gap-0.5 ${
                                                isCurrent ? 'text-blue-100' : 'text-emerald-700'
                                            }`}>
                                                <span className={`w-1 h-1 rounded-full ${isCurrent ? 'bg-white' : 'bg-emerald-500'}`}></span>
                                                {holidayCount} hol
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Right: Navigation Controls (<, >), Small Secondary Today Button, and Subtle Close Icon */}
            <div className="flex items-center gap-1 flex-shrink-0">
                <button
                    type="button"
                    onClick={onPrevMonth}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    title="Previous month (Page Up)"
                    aria-label="Previous month"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={onNextMonth}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    title="Next month (Page Down)"
                    aria-label="Next month"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>

                {onToday && (
                    <button
                        type="button"
                        onClick={onToday}
                        className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-white text-slate-700 hover:text-slate-950 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer shadow-2xs ml-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        title="Jump to today's date"
                        aria-label="Jump to today's date"
                    >
                        Today
                    </button>
                )}

                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer ml-0.5 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        title="Close calendar"
                        aria-label="Close calendar"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>
        </div>
    );
}
