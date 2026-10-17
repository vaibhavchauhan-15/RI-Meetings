import React, { useRef, useMemo, useCallback } from 'react';
import { 
    WEEKDAY_LABELS, 
    getDaysInMonth, 
    getFirstDayOfWeek, 
    formatFullHolidayDate,
    isSundayDate 
} from '../utils/holidayDateUtils.js';
import { 
    HOLIDAYS_BY_DATE_2026,
    EVENTS_BY_DATE_2026 
} from '../data/companyHolidays2026.js';

/**
 * CalendarGrid Component
 * Highly compact, accessible, mobile & desktop optimized 7-column calendar grid.
 * 
 * Features:
 * - Compact spacing and uniform date-cell sizes
 * - Event indicators directly below date numbers
 * - Clear selected (Blue), today (Blue ring), holiday (Green subtle tint), and Sunday (Red) states
 * - Standardized semantic colors and accessible text descriptions
 * - Touch swipe gestures for mobile
 * - Full W3C APG grid keyboard navigation
 */
export default function CalendarGrid({
    currentMonth, // 1 to 12
    currentYear = 2026,
    selectedDate, // 'YYYY-MM-DD'
    onSelectDate,
    onNavigateMonth,
    onPrevMonth,
    onNextMonth
}) {
    // Touch swipe refs for mobile smooth gestures
    const touchStartX = useRef(null);
    const touchStartY = useRef(null);

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
        if (touchStartX.current === null || touchStartY.current === null) return;
        const deltaX = e.changedTouches[0].clientX - touchStartX.current;
        const deltaY = e.changedTouches[0].clientY - touchStartY.current;
        
        // Horizontal swipe threshold (> 45px and predominantly horizontal)
        if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
            if (deltaX < 0 && onNextMonth) {
                onNextMonth();
            } else if (deltaX > 0 && onPrevMonth) {
                onPrevMonth();
            }
        }
        touchStartX.current = null;
        touchStartY.current = null;
    };

    // Calculate system today date
    const todayISO = useMemo(() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    }, []);

    // Compute grid cells with memoization
    const { allCells, daysInCurrentMonth } = useMemo(() => {
        const daysInMonth = getDaysInMonth(currentYear, currentMonth);
        const startDayOfWeek = getFirstDayOfWeek(currentYear, currentMonth); // 0 = Sun ... 6 = Sat

        // Trailing cells from previous month
        const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
        const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
        const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

        const trailing = [];
        for (let i = startDayOfWeek - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            const monthStr = String(prevMonth).padStart(2, '0');
            const dayStr = String(day).padStart(2, '0');
            const isoDate = `${prevYear}-${monthStr}-${dayStr}`;
            trailing.push({
                day,
                month: prevMonth,
                year: prevYear,
                isoDate,
                isCurrentMonth: false,
                holiday: HOLIDAYS_BY_DATE_2026[isoDate] || null,
                events: EVENTS_BY_DATE_2026[isoDate] || []
            });
        }

        // Current month cells
        const current = [];
        for (let day = 1; day <= daysInMonth; day++) {
            const monthStr = String(currentMonth).padStart(2, '0');
            const dayStr = String(day).padStart(2, '0');
            const isoDate = `${currentYear}-${monthStr}-${dayStr}`;
            current.push({
                day,
                month: currentMonth,
                year: currentYear,
                isoDate,
                isCurrentMonth: true,
                holiday: HOLIDAYS_BY_DATE_2026[isoDate] || null,
                events: EVENTS_BY_DATE_2026[isoDate] || []
            });
        }

        // Leading cells for next month
        const totalSoFar = trailing.length + current.length;
        const remainder = totalSoFar % 7;
        const daysNeeded = remainder === 0 ? 0 : 7 - remainder;

        const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
        const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
        const leading = [];
        for (let day = 1; day <= daysNeeded; day++) {
            const monthStr = String(nextMonth).padStart(2, '0');
            const dayStr = String(day).padStart(2, '0');
            const isoDate = `${nextYear}-${monthStr}-${dayStr}`;
            leading.push({
                day,
                month: nextMonth,
                year: nextYear,
                isoDate,
                isCurrentMonth: false,
                holiday: HOLIDAYS_BY_DATE_2026[isoDate] || null,
                events: EVENTS_BY_DATE_2026[isoDate] || []
            });
        }

        return {
            allCells: [...trailing, ...current, ...leading],
            daysInCurrentMonth: daysInMonth
        };
    }, [currentMonth, currentYear]);

    // Keyboard navigation across calendar grid (W3C APG Grid Pattern)
    const handleKeyDown = useCallback((e) => {
        if (!selectedDate) return;
        const [y, m, d] = selectedDate.split('-').map(Number);
        if (!y || !m || !d) return;

        let targetDate = new Date(y, m - 1, d);
        let handled = false;

        switch (e.key) {
            case 'ArrowLeft':
                targetDate.setDate(targetDate.getDate() - 1);
                handled = true;
                break;
            case 'ArrowRight':
                targetDate.setDate(targetDate.getDate() + 1);
                handled = true;
                break;
            case 'ArrowUp':
                targetDate.setDate(targetDate.getDate() - 7);
                handled = true;
                break;
            case 'ArrowDown':
                targetDate.setDate(targetDate.getDate() + 7);
                handled = true;
                break;
            case 'Home':
                targetDate = new Date(currentYear, currentMonth - 1, 1);
                handled = true;
                break;
            case 'End':
                targetDate = new Date(currentYear, currentMonth - 1, daysInCurrentMonth);
                handled = true;
                break;
            case 'PageUp':
                if (onPrevMonth) onPrevMonth();
                handled = true;
                return;
            case 'PageDown':
                if (onNextMonth) onNextMonth();
                handled = true;
                return;
            default:
                break;
        }

        if (handled) {
            e.preventDefault();
            const ny = targetDate.getFullYear();
            const nm = targetDate.getMonth() + 1;
            const nd = targetDate.getDate();
            const newIso = `${ny}-${String(nm).padStart(2, '0')}-${String(nd).padStart(2, '0')}`;
            
            if (nm !== currentMonth && onNavigateMonth) {
                onNavigateMonth(nm, ny);
            }
            onSelectDate(newIso);

            setTimeout(() => {
                const el = document.querySelector(`button[data-isodate="${newIso}"]`);
                if (el) el.focus();
            }, 10);
        }
    }, [selectedDate, currentMonth, currentYear, daysInCurrentMonth, onNavigateMonth, onPrevMonth, onNextMonth, onSelectDate]);

    return (
        <div 
            className="w-full flex flex-col gap-1 select-none" 
            role="region" 
            aria-label="Month Calendar Grid"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onKeyDown={handleKeyDown}
        >
            {/* Weekday Column Headers (Sun to Sat) */}
            <div className="grid grid-cols-7 gap-1 text-center py-0.5 border-b border-slate-100" role="row">
                {WEEKDAY_LABELS.map((w, idx) => (
                    <div 
                        key={w.full}
                        className={`text-[10px] sm:text-[11px] font-bold ${
                            idx === 0 
                                ? 'text-red-500' 
                                : 'text-slate-500'
                        }`}
                        title={idx === 0 ? `${w.full} (Sunday Weekly Off)` : w.full}
                        role="columnheader"
                        aria-label={idx === 0 ? `${w.full} (Sunday Weekly Off)` : w.full}
                    >
                        <span className="sm:hidden">{w.letter}</span>
                        <span className="hidden sm:inline">{w.short}</span>
                    </div>
                ))}
            </div>

            {/* 7-Column Calendar Grid Cells */}
            <div className="grid grid-cols-7 gap-1 pt-0.5" role="grid">
                {allCells.map((cell) => {
                    const isSunday = isSundayDate(cell.isoDate);
                    const isSelected = selectedDate === cell.isoDate;
                    const isCompanyHoliday = Boolean(cell.holiday);
                    const hasFestivals = cell.events.length > 0 && !isCompanyHoliday;
                    const isToday = cell.isoDate === todayISO;

                    // Accessible descriptions
                    let ariaLabel = cell.isCurrentMonth
                        ? formatFullHolidayDate(cell.isoDate)
                        : `${cell.day} ${cell.month}/${cell.year}`;
                    
                    let titleText = undefined;
                    if (isCompanyHoliday) {
                        ariaLabel += ` - ${cell.holiday.name} (Official Company Holiday - Operations Closed)`;
                        titleText = `Company Holiday: ${cell.holiday.name} (Operations Closed)`;
                    } else if (hasFestivals) {
                        const eventNames = cell.events.map(e => e.name).join(' · ');
                        if (isSunday) {
                            ariaLabel += ` - ${eventNames} (Sunday Weekly Off)`;
                            titleText = `${eventNames} (Sunday Weekly Off)`;
                        } else {
                            ariaLabel += ` - ${eventNames} (Festival Observance - Regular Working Day)`;
                            titleText = `${eventNames} (Regular Working Day)`;
                        }
                    } else if (isSunday) {
                        ariaLabel += ` - Sunday Weekly Off (Operations Closed)`;
                        titleText = `Sunday Weekly Off (Operations Closed)`;
                    }

                    // Semantic cell classes:
                    // Compact square cells with subtle backgrounds instead of thick outlines
                    let cellClasses = "relative w-full aspect-square max-w-[36px] max-h-[36px] sm:max-w-[40px] sm:max-h-[40px] mx-auto flex flex-col items-center justify-center rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ";

                    if (!cell.isCurrentMonth) {
                        cellClasses += "text-slate-300 hover:text-slate-500 hover:bg-slate-50/60 font-normal ";
                    } else if (isSelected) {
                        // Blue: selected date or primary interaction
                        cellClasses += "bg-blue-600 text-white font-black shadow-sm ring-2 ring-blue-300 ";
                    } else if (isCompanyHoliday) {
                        // Green: company holiday / closed (subtle emerald tint, no thick border)
                        cellClasses += "bg-emerald-50 text-emerald-950 font-bold hover:bg-emerald-100/80 active:scale-95 ";
                        if (isToday) cellClasses += "ring-2 ring-inset ring-blue-500 ";
                    } else if (hasFestivals) {
                        // Amber: festival / working day (subtle warm amber tint, no thick border)
                        cellClasses += "bg-amber-50/70 font-bold hover:bg-amber-100/70 active:scale-95 ";
                        if (isSunday) {
                            cellClasses += "text-red-600 ";
                        } else {
                            cellClasses += "text-slate-900 ";
                        }
                        if (isToday) cellClasses += "ring-2 ring-inset ring-blue-500 ";
                    } else if (isSunday) {
                        // Red: Sunday weekly off
                        cellClasses += "text-red-500 font-bold hover:bg-red-50/60 active:scale-95 ";
                        if (isToday) cellClasses += "ring-2 ring-inset ring-blue-500 ";
                    } else {
                        // Regular working day
                        cellClasses += "text-slate-700 font-semibold hover:bg-slate-100 active:scale-95 ";
                        if (isToday) {
                            cellClasses += "ring-2 ring-inset ring-blue-500 text-blue-900 font-black bg-blue-50/40 ";
                        }
                    }

                    return (
                        <button
                            key={cell.isoDate}
                            data-isodate={cell.isoDate}
                            type="button"
                            onClick={() => {
                                onSelectDate(cell.isoDate);
                                if (!cell.isCurrentMonth && onNavigateMonth) {
                                    onNavigateMonth(cell.month, cell.year);
                                }
                            }}
                            className={cellClasses}
                            role="gridcell"
                            tabIndex={isSelected ? 0 : -1}
                            aria-selected={isSelected}
                            aria-current={isToday ? 'date' : undefined}
                            aria-label={ariaLabel}
                            title={titleText}
                        >
                            {/* Date number */}
                            <span className="leading-none">{cell.day}</span>

                            {/* Indicator dot directly below date */}
                            <div className="h-1.5 flex items-center justify-center gap-0.5 mt-0.5">
                                {isCompanyHoliday ? (
                                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-500'}`} />
                                ) : hasFestivals ? (
                                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-amber-500'}`} />
                                ) : isToday ? (
                                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-blue-500'}`} />
                                ) : null}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Compact Micro-Legend: Green Holiday, Amber Festival, Red Weekly off */}
            <div className="flex items-center justify-center gap-3.5 pt-1.5 border-t border-slate-100 text-[10px] text-slate-500 select-none flex-wrap">
                <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Holiday</span>
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span>Festival</span>
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    <span>Weekly off</span>
                </span>
            </div>
        </div>
    );
}
