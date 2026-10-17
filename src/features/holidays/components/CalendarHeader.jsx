import React, { useState, useEffect, useRef } from 'react';
import { CalendarDays, X, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { MONTH_NAMES, MONTH_SHORT_NAMES } from '../utils/holidayDateUtils.js';
import { getHolidaysForMonth } from '../services/holidayService.js';

/**
 * CalendarHeader Component
 * Clean, compact calendar header with interactive month picker,
 * Today quick-jump action, and accessible month navigation controls.
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
        <div className="relative flex flex-col gap-1.5 pb-1.5 border-b border-border-light select-none">
            {/* Top row: Title, Year badge, Today Action & Close button */}
            <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                    <h2 className="group text-sm sm:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                        <CalendarDays className="w-4 h-4 text-cyan-600 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
                        <span>Calendar</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                            {currentYear}
                        </span>
                    </h2>

                    {onToday && (
                        <button
                            type="button"
                            onClick={onToday}
                            className="group px-2 py-0.5 text-[10px] font-bold rounded-md border border-slate-200 bg-white text-slate-700 hover:text-slate-950 hover:bg-slate-50 hover:border-slate-300 shadow-2xs active:scale-95 transition-all cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                            title="Jump to today's date"
                            aria-label="Jump to today's date"
                        >
                            <span>Today</span>
                        </button>
                    )}
                </div>

                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="group w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer flex-shrink-0 active:scale-95"
                        title="Close calendar"
                        aria-label="Close calendar"
                    >
                        <X className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-90" />
                    </button>
                )}
            </div>

            {/* Month & Year with Navigation Controls */}
            <div className="flex items-center justify-between gap-1.5 bg-slate-50/80 rounded-lg px-1.5 py-1 border border-slate-200/70">
                {/* Previous Month Action */}
                <button
                    type="button"
                    onClick={onPrevMonth}
                    className="group w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-md flex items-center justify-center text-slate-600 hover:text-slate-950 hover:bg-white active:scale-90 border border-transparent hover:border-border-light transition-all cursor-pointer shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    title="Previous month (Page Up)"
                    aria-label="Previous month"
                >
                    <ChevronLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
                </button>

                {/* Visible Month & Year Label (Interactive Button to toggle month picker) */}
                <div className="relative" ref={monthPickerRef}>
                    <button
                        type="button"
                        onClick={() => setIsMonthPickerOpen(prev => !prev)}
                        className={`group px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-xs sm:text-sm font-extrabold tracking-tight flex items-center gap-1.5 transition-all cursor-pointer border ${
                            isMonthPickerOpen 
                                ? 'bg-white text-slate-900 border-slate-300 shadow-2xs ring-2 ring-cyan-500/20' 
                                : 'text-slate-900 bg-white/70 hover:bg-white border-slate-200/80 shadow-2xs hover:border-slate-300'
                        }`}
                        title="Click to jump directly to any month (Jan - Dec 2026)"
                        aria-expanded={isMonthPickerOpen}
                        aria-label={`Current month: ${monthName} ${currentYear}. Click to pick a month.`}
                    >
                        <span>{monthName} {currentYear}</span>
                        <ChevronDown 
                            className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isMonthPickerOpen ? 'rotate-180 text-slate-900' : 'group-hover:translate-y-0.5'}`} 
                        />
                    </button>

                    {/* Quick Month Selector Popover (Jan-Dec) */}
                    {isMonthPickerOpen && (
                        <div 
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-40 w-60 bg-white rounded-xl shadow-xl border border-slate-200 p-2 animate-in fade-in zoom-in-95 duration-150 select-none"
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
                                                    ? 'bg-slate-900 text-white shadow-2xs font-extrabold'
                                                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60 hover:border-slate-300'
                                            }`}
                                        >
                                            <span>{mShort}</span>
                                            {holidayCount > 0 && (
                                                <span className={`text-[8px] font-semibold flex items-center gap-0.5 ${
                                                    isCurrent ? 'text-emerald-300' : 'text-emerald-700'
                                                }`}>
                                                    <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
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

                {/* Next Month Action */}
                <button
                    type="button"
                    onClick={onNextMonth}
                    className="group w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-md flex items-center justify-center text-slate-600 hover:text-slate-950 hover:bg-white active:scale-90 border border-transparent hover:border-border-light transition-all cursor-pointer shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    title="Next month (Page Down)"
                    aria-label="Next month"
                >
                    <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
            </div>
        </div>
    );
}
