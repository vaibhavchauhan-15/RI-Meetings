import React, { useRef, useCallback } from 'react';
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
 * Production-ready, highly accessible, mobile & desktop optimized 7-column calendar grid.
 * 
 * Usability & Accessibility Enhancements:
 * - Touch swipe gestures on mobile (swipe left for next month, swipe right for previous month).
 * - Full W3C APG grid keyboard navigation (Arrow keys, Home, End, PageUp, PageDown).
 * - Clean, clutter-free aesthetics:
 *   * Company Holidays: soft emerald background tint + emerald dot. Solid rich emerald when selected.
 *   * Festivals / Events: high-contrast number + warm amber indicator dot. Solid warm amber when selected.
 *   * Sunday Weekly Off: rose text + Sunday off status. Solid rose when selected.
 *   * Today: crisp cyan ring indicator.
 * - Clear micro-legend below the grid for instant visual clarity.
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
    const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);
    const startDayOfWeek = getFirstDayOfWeek(currentYear, currentMonth); // 0 = Sun ... 6 = Sat

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

            // Move focus to newly selected element after render
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
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-center py-1 border-b border-slate-100" role="row">
                {WEEKDAY_LABELS.map((w, idx) => (
                    <div 
                        key={w.full}
                        className={`text-[10px] sm:text-[11px] font-bold ${
                            idx === 0 
                                ? 'text-rose-500' 
                                : idx === 6 
                                    ? 'text-slate-400 font-semibold' 
                                    : 'text-slate-500 font-semibold'
                        }`}
                        title={idx === 0 ? `${w.full} (Fixed Weekly Off)` : w.full}
                        role="columnheader"
                        aria-label={idx === 0 ? `${w.full} (Fixed Weekly Off)` : w.full}
                    >
                        {w.short}
                    </div>
                ))}
            </div>

            {/* Calendar Cells Grid */}
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1 pt-1" role="grid">
                {allCells.map((cell) => {
                    const isSunday = isSundayDate(cell.isoDate);
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
                        titleText = `Company Holiday: ${cell.holiday.name} (Operations Closed)`;
                    } else if (hasFestivals) {
                        const eventNames = cell.events.map(e => e.name).join(' · ');
                        if (isSunday) {
                            ariaLabel += ` - ${eventNames} (Sunday Weekly Off)`;
                            titleText = `${eventNames} (Sunday Weekly Off)`;
                        } else {
                            ariaLabel += ` - ${eventNames} (Festival Observance - Working Day)`;
                            titleText = `${eventNames} (Regular Working Day)`;
                        }
                    } else if (isSunday) {
                        ariaLabel += ` - Sunday Weekly Off (Operations Closed)`;
                        titleText = `Sunday Weekly Off (Operations Closed)`;
                    }

                    // Base classes for each date cell button:
                    // Clean aspect-square, standard rounded-lg edges, perfectly centered date number
                    let cellClasses = "relative w-full aspect-square max-w-[46px] max-h-[46px] mx-auto flex flex-col items-center justify-center rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 select-none min-h-[30px] sm:min-h-[34px] ";

                    if (!cell.isCurrentMonth) {
                        // Outside current month (trailing/leading days)
                        cellClasses += "text-slate-300 hover:text-slate-500 hover:bg-slate-50/80 opacity-40 font-normal ";
                    } else if (isSelected) {
                        // Selected Date State: crisp solid fill, zero bleed, perfectly constrained within cell bounds
                        if (isCompanyHoliday) {
                            cellClasses += "bg-emerald-600 text-white font-extrabold shadow-sm ring-2 ring-emerald-700/50 ";
                        } else if (hasFestivals) {
                            cellClasses += "bg-amber-600 text-white font-extrabold shadow-sm ring-2 ring-amber-700/50 ";
                        } else if (isSunday) {
                            cellClasses += "bg-rose-600 text-white font-extrabold shadow-sm ring-2 ring-rose-700/50 ";
                        } else {
                            cellClasses += "bg-slate-900 text-white font-extrabold shadow-sm ring-2 ring-slate-950/50 ";
                        }
                    } else if (isCompanyHoliday) {
                        // Company Holiday Highlight: Emerald Green Theme (Operations Closed)
                        cellClasses += "bg-emerald-50/90 text-emerald-950 font-bold border border-emerald-300/80 hover:bg-emerald-100/90 hover:border-emerald-400 active:scale-95 ";
                        if (isToday) {
                            cellClasses += "ring-2 ring-inset ring-emerald-600 ";
                        }
                    } else if (hasFestivals) {
                        // Festival / Religious / Cultural Event Day (Regular Working Day)
                        // Clean, elegant treatment: clean number + amber dot, NO noisy thick square yellow borders!
                        if (isSunday) {
                            cellClasses += "text-rose-600 font-bold hover:bg-rose-50 active:scale-95 ";
                            if (isToday) cellClasses += "ring-2 ring-inset ring-rose-500 ";
                        } else {
                            cellClasses += "text-slate-800 font-bold hover:bg-amber-50/80 hover:text-amber-950 active:scale-95 ";
                            if (isToday) cellClasses += "ring-2 ring-inset ring-cyan-600 text-cyan-950 ";
                        }
                    } else if (isSunday) {
                        // Sunday Fixed Weekly Off: Clear distinct rose weekoff tone
                        cellClasses += "text-rose-600 font-semibold hover:bg-rose-50/80 hover:text-rose-800 active:scale-95 ";
                        if (isToday) {
                            cellClasses += "ring-2 ring-inset ring-rose-500 font-bold ";
                        }
                    } else {
                        // Normal Working Day in Current Month
                        cellClasses += "text-slate-700 hover:text-slate-950 hover:bg-slate-100 font-semibold active:scale-95 ";
                        if (isToday) {
                            cellClasses += "ring-2 ring-inset ring-cyan-600 text-cyan-900 font-bold ";
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
                            {/* Day Number */}
                            <span className="leading-none">{cell.day}</span>

                            {/* Micro-indicators at bottom of cell (dot is removed when selected) */}
                            <div className="h-1 sm:h-1.5 flex items-center justify-center gap-0.5 mt-0.5">
                                {!isSelected && (
                                    isCompanyHoliday ? (
                                        <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-emerald-600" />
                                    ) : hasFestivals ? (
                                        <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-amber-500" />
                                    ) : isToday ? (
                                        <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-cyan-600" />
                                    ) : null
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Micro-Legend for Instant Visual Clarity */}
            <div className="flex items-center justify-between gap-1 pt-1.5 px-0.5 border-t border-slate-100 text-[9px] sm:text-[10px] text-slate-500 flex-wrap select-none">
                <span className="flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Company Holiday (Closed)</span>
                </span>
                <span className="flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span>Festival (Working Day)</span>
                </span>
                <span className="flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    <span>Sunday Off</span>
                </span>
            </div>
        </div>
    );
}
