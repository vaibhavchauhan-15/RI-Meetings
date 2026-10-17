import React from 'react';
import { 
    WEEKDAY_LABELS, 
    getDaysInMonth, 
    getFirstDayOfWeek, 
    HOLIDAYS_BY_DATE_2026,
    EVENTS_BY_DATE_2026,
    formatFullHolidayDate
} from '../data/companyHolidays2026';

/**
 * CalendarGrid Component
 * Renders conventional 7-column Sunday-Saturday grid with correct weekday alignment,
 * leap-year safe month lengths.
 * 
 * Visual Distinction Rules:
 * - Official Company Holidays: Highlighted in Emerald Green 🟢 (Operations Closed).
 * - Indian Festivals & Observances: Highlighted in Warm Amber / Saffron 🌟 (Regular Working Days).
 * - Standard Working Days: Clean Slate tone.
 */
export default function CalendarGrid({
    currentMonth, // 1 to 12
    currentYear = 2026,
    selectedDate, // 'YYYY-MM-DD'
    onSelectDate,
    onNavigateMonth
}) {
    const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);
    const startDayOfWeek = getFirstDayOfWeek(currentYear, currentMonth); // 0 = Sun ... 6 = Sat

    // Calculate previous month trailing days
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

    // Compute trailing cells from previous month
    const trailingDays = [];
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const monthStr = String(prevMonth).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        const isoDate = `${prevYear}-${monthStr}-${dayStr}`;
        trailingDays.push({
            day,
            month: prevMonth,
            year: prevYear,
            isoDate,
            isCurrentMonth: false,
            holiday: HOLIDAYS_BY_DATE_2026[isoDate] || null,
            events: EVENTS_BY_DATE_2026[isoDate] || []
        });
    }

    // Compute days of current month
    const currentMonthDays = [];
    for (let day = 1; day <= daysInCurrentMonth; day++) {
        const monthStr = String(currentMonth).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        const isoDate = `${currentYear}-${monthStr}-${dayStr}`;
        currentMonthDays.push({
            day,
            month: currentMonth,
            year: currentYear,
            isoDate,
            isCurrentMonth: true,
            holiday: HOLIDAYS_BY_DATE_2026[isoDate] || null,
            events: EVENTS_BY_DATE_2026[isoDate] || []
        });
    }

    // Compute leading cells for next month to complete the grid rows
    const totalCellsSoFar = trailingDays.length + currentMonthDays.length;
    const remainder = totalCellsSoFar % 7;
    const daysNeeded = remainder === 0 ? 0 : 7 - remainder;

    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
    const leadingDays = [];
    for (let day = 1; day <= daysNeeded; day++) {
        const monthStr = String(nextMonth).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        const isoDate = `${nextYear}-${monthStr}-${dayStr}`;
        leadingDays.push({
            day,
            month: nextMonth,
            year: nextYear,
            isoDate,
            isCurrentMonth: false,
            holiday: HOLIDAYS_BY_DATE_2026[isoDate] || null,
            events: EVENTS_BY_DATE_2026[isoDate] || []
        });
    }

    const allCells = [...trailingDays, ...currentMonthDays, ...leadingDays];

    // Check system today date
    const today = new Date();
    const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    return (
        <div className="w-full flex flex-col gap-1 select-none" role="region" aria-label="Month Calendar Grid">
            {/* Weekday Column Headers (Sun to Sat) */}
            <div className="grid grid-cols-7 gap-1 text-center py-1 border-b border-slate-100" role="row">
                {WEEKDAY_LABELS.map((w, idx) => (
                    <div 
                        key={w.full}
                        className={`text-[11px] sm:text-xs font-bold ${idx === 0 || idx === 6 ? 'text-slate-400' : 'text-slate-500'}`}
                        title={w.full}
                        role="columnheader"
                        aria-label={w.full}
                    >
                        {w.short}
                    </div>
                ))}
            </div>

            {/* Calendar Cells Grid */}
            <div className="grid grid-cols-7 gap-1 pt-1" role="grid">
                {allCells.map((cell) => {
                    const isSelected = selectedDate === cell.isoDate;
                    const isCompanyHoliday = Boolean(cell.holiday);
                    const hasFestivals = cell.events.length > 0 && !isCompanyHoliday;
                    const isToday = cell.isoDate === todayISO;

                    // Accessible label & Tooltip
                    let ariaLabel = cell.isCurrentMonth
                        ? formatFullHolidayDate(cell.isoDate)
                        : `${cell.day} ${cell.month}/${cell.year}`;
                    
                    let titleText = undefined;
                    if (isCompanyHoliday) {
                        ariaLabel += ` - ${cell.holiday.name} (Official Company Holiday - Operations Closed)`;
                        titleText = `🟢 Company Holiday: ${cell.holiday.name} (Operations Closed)`;
                    } else if (hasFestivals) {
                        const eventNames = cell.events.map(e => e.name).join(' · ');
                        ariaLabel += ` - ${eventNames} (Festival Observance - Working Day)`;
                        titleText = `🌟 ${eventNames} (Regular Working Day)`;
                    }

                    // Base classes for each date cell button
                    let cellClasses = "relative flex flex-col items-center justify-center rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 min-h-[42px] sm:min-h-[40px] p-1 cursor-pointer focus:outline-none ";

                    if (!cell.isCurrentMonth) {
                        // Outside current month
                        cellClasses += "text-slate-300 hover:text-slate-500 hover:bg-slate-50 opacity-55 ";
                    } else if (isSelected) {
                        // Selected Date State: visually distinct per status
                        if (isCompanyHoliday) {
                            cellClasses += "bg-emerald-600 text-white font-black shadow-sm ring-2 ring-emerald-600 ring-offset-2 z-10 scale-[1.02] ";
                        } else if (hasFestivals) {
                            cellClasses += "bg-amber-600 text-white font-black shadow-sm ring-2 ring-amber-600 ring-offset-2 z-10 scale-[1.02] ";
                        } else {
                            cellClasses += "bg-slate-900 text-white font-black shadow-sm ring-2 ring-slate-900 ring-offset-2 z-10 scale-[1.02] ";
                        }
                    } else if (isCompanyHoliday) {
                        // Company Holiday Highlight: Emerald Green Theme (Marks as Green)
                        cellClasses += "bg-emerald-50 text-emerald-950 font-black border border-emerald-300/90 hover:bg-emerald-100 hover:border-emerald-400 active:scale-95 shadow-2xs ";
                    } else if (hasFestivals) {
                        // Festival / Religious / Cultural Event Day (Working Day): Respected Warm Amber/Saffron Theme
                        cellClasses += "bg-amber-50/75 text-amber-950 font-bold border border-amber-300/80 hover:bg-amber-100 hover:border-amber-400 active:scale-95 shadow-2xs ";
                    } else {
                        // Normal Date in Current Month (Standard Working Day)
                        cellClasses += "text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 active:scale-95 ";
                    }

                    return (
                        <button
                            key={cell.isoDate}
                            type="button"
                            onClick={() => {
                                onSelectDate(cell.isoDate);
                                if (!cell.isCurrentMonth && onNavigateMonth) {
                                    onNavigateMonth(cell.month, cell.year);
                                }
                            }}
                            className={cellClasses}
                            role="gridcell"
                            aria-selected={isSelected}
                            aria-label={ariaLabel}
                            title={titleText}
                        >
                            {/* Day Number */}
                            <span className="leading-none">{cell.day}</span>

                            {/* Indicator Dot Row */}
                            <div className="flex items-center gap-0.5 mt-1 h-1.5">
                                {/* Company Holiday Dot (Green) */}
                                {isCompanyHoliday && (
                                    <span 
                                        className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                            isSelected 
                                                ? 'bg-white' 
                                                : 'bg-emerald-600 ring-1 ring-emerald-300'
                                        }`}
                                    />
                                )}

                                {/* Festival / Observance Dot (Amber) */}
                                {hasFestivals && (
                                    <span 
                                        className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                            isSelected 
                                                ? 'bg-white' 
                                                : 'bg-amber-500 ring-1 ring-amber-300'
                                        }`}
                                    />
                                )}

                                {/* Today Indicator Dot (Blue) */}
                                {isToday && !isCompanyHoliday && !hasFestivals && (
                                    <span 
                                        className={`w-1 h-1 rounded-full ${
                                            isSelected ? 'bg-white' : 'bg-theme-breakdown'
                                        }`}
                                    />
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
