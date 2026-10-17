import React from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import HolidayDetails from './HolidayDetails';
import UpcomingHolidays from './UpcomingHolidays';
import { useHolidayCalendar } from '../hooks/useHolidayCalendar.js';

/**
 * HolidayCalendar Component
 * Production-ready 2026 Indian Festival & Company Holiday Calendar for Reach International.
 * Integrates CalendarHeader, CalendarGrid, HolidayDetails, and UpcomingHolidays.
 */
export default function HolidayCalendar({
    initialMonth, // optional '01' - '12' or number 1 - 12
    initialDate,  // optional 'YYYY-MM-DD'
    onClose,      // optional close callback when used in a mobile drawer or modal
    onMonthChange, // optional callback when month changes
    className = ''
}) {
    const {
        currentYear,
        currentMonth,
        selectedDate,
        handlePrevMonth,
        handleNextMonth,
        handleSelectDate,
        handleNavigateMonth,
        handleToday
    } = useHolidayCalendar({
        initialMonth,
        initialDate,
        onMonthChange,
        year: 2026
    });

    return (
        <aside 
            className={`bg-white border border-border-light rounded-xl sm:rounded-2xl shadow-card p-2.5 sm:p-3 flex flex-col gap-2 w-full transition-all duration-200 ${className}`}
            aria-label="2026 Reach International Calendar"
        >
            {/* Header: Combined Month & Navigation in single compact row */}
            <CalendarHeader 
                currentMonth={currentMonth}
                currentYear={currentYear}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                onToday={handleToday}
                onNavigateMonth={handleNavigateMonth}
                onClose={onClose}
            />

            {/* Grid: 7 columns, touch gestures, APG keyboard nav, semantic indicators, micro-legend */}
            <CalendarGrid 
                currentMonth={currentMonth}
                currentYear={currentYear}
                selectedDate={selectedDate}
                onSelectDate={handleSelectDate}
                onNavigateMonth={handleNavigateMonth}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
            />

            {/* Details: Compact Selected Holiday / Festival / Working Day summary */}
            <HolidayDetails 
                selectedDate={selectedDate}
            />

            {/* Upcoming Events: Interactive filterable list with non-clipping categories and compact cards */}
            <UpcomingHolidays 
                selectedDate={selectedDate}
                onSelectDate={handleSelectDate}
            />
        </aside>
    );
}
