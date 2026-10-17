import React, { useState, useEffect, useMemo, useCallback } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import HolidayDetails from './HolidayDetails';
import UpcomingHolidays from './UpcomingHolidays';
import { 
    getHolidaysForMonth, 
    getEventsForMonth,
    COMPANY_HOLIDAYS_2026, 
    HOLIDAYS_BY_DATE_2026,
    EVENTS_BY_DATE_2026 
} from '../data/companyHolidays2026';

/**
 * HolidayCalendar Component
 * Production-ready 2026 Indian Festival & Company Holiday Calendar for Reach International.
 * Integrates CalendarHeader, CalendarGrid, HolidayDetails, and UpcomingHolidays.
 */
export default function HolidayCalendar({
    initialMonth, // optional '01' - '12' or number 1 - 12
    initialDate,  // optional 'YYYY-MM-DD'
    onClose,      // optional close callback when used in a mobile drawer or modal
    className = ''
}) {
    // Determine sensible default month
    const defaultMonth = useMemo(() => {
        if (initialMonth) return parseInt(initialMonth, 10);
        const now = new Date();
        if (now.getFullYear() === 2026) {
            return now.getMonth() + 1;
        }
        return 1;
    }, [initialMonth]);

    const [currentYear] = useState(2026);
    const [currentMonth, setCurrentMonth] = useState(defaultMonth);
    const [selectedDate, setSelectedDate] = useState(() => {
        if (initialDate && initialDate.startsWith('2026-')) return initialDate;
        // Default to first holiday or event of default month if exists
        const monthHolidays = getHolidaysForMonth(defaultMonth, 2026);
        if (monthHolidays.length > 0) return monthHolidays[0].date;
        const monthEvents = getEventsForMonth(defaultMonth, 2026);
        if (monthEvents.length > 0) return monthEvents[0].date;
        return `2026-${String(defaultMonth).padStart(2, '0')}-01`;
    });

    // Sync if initialMonth changes externally
    useEffect(() => {
        if (initialMonth) {
            const m = parseInt(initialMonth, 10);
            if (m >= 1 && m <= 12 && m !== currentMonth) {
                setCurrentMonth(m);
                const monthHolidays = getHolidaysForMonth(m, 2026);
                if (monthHolidays.length > 0) {
                    setSelectedDate(monthHolidays[0].date);
                } else {
                    const monthEvents = getEventsForMonth(m, 2026);
                    if (monthEvents.length > 0) {
                        setSelectedDate(monthEvents[0].date);
                    } else {
                        setSelectedDate(`2026-${String(m).padStart(2, '0')}-01`);
                    }
                }
            }
        }
    }, [initialMonth]);

    // Month Navigation: smoothly traverses Jan - Dec with wrapping
    const handlePrevMonth = useCallback(() => {
        setCurrentMonth(prev => {
            const next = prev === 1 ? 12 : prev - 1;
            const holidays = getHolidaysForMonth(next, currentYear);
            if (holidays.length > 0) {
                setSelectedDate(holidays[0].date);
            } else {
                const events = getEventsForMonth(next, currentYear);
                setSelectedDate(events.length > 0 ? events[0].date : `2026-${String(next).padStart(2, '0')}-01`);
            }
            return next;
        });
    }, [currentYear]);

    const handleNextMonth = useCallback(() => {
        setCurrentMonth(prev => {
            const next = prev === 12 ? 1 : prev + 1;
            const holidays = getHolidaysForMonth(next, currentYear);
            if (holidays.length > 0) {
                setSelectedDate(holidays[0].date);
            } else {
                const events = getEventsForMonth(next, currentYear);
                setSelectedDate(events.length > 0 ? events[0].date : `2026-${String(next).padStart(2, '0')}-01`);
            }
            return next;
        });
    }, [currentYear]);

    // Date selection handler
    const handleSelectDate = useCallback((isoDate) => {
        setSelectedDate(isoDate);
        if (isoDate) {
            const parts = isoDate.split('-');
            const m = parseInt(parts[1], 10);
            if (m !== currentMonth && m >= 1 && m <= 12) {
                setCurrentMonth(m);
            }
        }
    }, [currentMonth]);

    const handleNavigateMonth = useCallback((monthInt, yearInt) => {
        if (yearInt === 2026 && monthInt >= 1 && monthInt <= 12) {
            setCurrentMonth(monthInt);
        }
    }, []);

    return (
        <aside 
            onWheel={(e) => e.stopPropagation()}
            className={`bg-white border border-border-light rounded-2xl shadow-card p-3.5 sm:p-4.5 flex flex-col gap-3.5 w-full transition-all duration-200 overscroll-contain ${className}`}
            aria-label="2026 Reach International Calendar"
        >
            {/* Header: Short Title, Month Nav & Close action */}
            <CalendarHeader 
                currentMonth={currentMonth}
                currentYear={currentYear}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                onClose={onClose}
            />

            {/* Grid: 7 columns, Green company holidays, Amber festivals, selection states */}
            <CalendarGrid 
                currentMonth={currentMonth}
                currentYear={currentYear}
                selectedDate={selectedDate}
                onSelectDate={handleSelectDate}
                onNavigateMonth={handleNavigateMonth}
            />

            {/* Details: Selected Holiday, Festival Observance, or Working Day card */}
            <HolidayDetails 
                selectedDate={selectedDate}
            />

            {/* Upcoming Holidays & Festivals: Interactive filterable list */}
            <UpcomingHolidays 
                selectedDate={selectedDate}
                onSelectDate={handleSelectDate}
            />
        </aside>
    );
}
