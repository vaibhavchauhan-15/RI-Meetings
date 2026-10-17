/**
 * Reach International Operations - useHolidayCalendar Custom Hook
 * 
 * Manages calendar view state, month navigation (with smooth Jan-Dec wrapping),
 * date selection, and external synchronization.
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { getHolidaysForMonth, getEventsForMonth } from '../services/holidayService.js';

export function useHolidayCalendar({
    initialMonth, // optional '01' - '12' or number 1 - 12
    initialDate,  // optional 'YYYY-MM-DD'
    year = 2026
} = {}) {
    const defaultMonth = useMemo(() => {
        if (initialMonth) return parseInt(initialMonth, 10);
        const now = new Date();
        if (now.getFullYear() === year) {
            return now.getMonth() + 1;
        }
        return 1;
    }, [initialMonth, year]);

    const [currentYear] = useState(year);
    const [currentMonth, setCurrentMonth] = useState(defaultMonth);

    const [selectedDate, setSelectedDate] = useState(() => {
        if (initialDate && initialDate.startsWith(`${year}-`)) return initialDate;
        const monthHolidays = getHolidaysForMonth(defaultMonth, year);
        if (monthHolidays.length > 0) return monthHolidays[0].date;
        const monthEvents = getEventsForMonth(defaultMonth, year);
        if (monthEvents.length > 0) return monthEvents[0].date;
        return `${year}-${String(defaultMonth).padStart(2, '0')}-01`;
    });

    // Synchronize when initialMonth changes externally
    useEffect(() => {
        if (initialMonth) {
            const m = parseInt(initialMonth, 10);
            if (m >= 1 && m <= 12 && m !== currentMonth) {
                setCurrentMonth(m);
                const monthHolidays = getHolidaysForMonth(m, currentYear);
                if (monthHolidays.length > 0) {
                    setSelectedDate(monthHolidays[0].date);
                } else {
                    const monthEvents = getEventsForMonth(m, currentYear);
                    if (monthEvents.length > 0) {
                        setSelectedDate(monthEvents[0].date);
                    } else {
                        setSelectedDate(`${currentYear}-${String(m).padStart(2, '0')}-01`);
                    }
                }
            }
        }
    }, [initialMonth, currentYear, currentMonth]);

    // Synchronize when initialDate changes externally
    useEffect(() => {
        if (initialDate && initialDate.startsWith(`${currentYear}-`)) {
            setSelectedDate(initialDate);
            const parts = initialDate.split('-');
            const m = parseInt(parts[1], 10);
            if (m >= 1 && m <= 12 && m !== currentMonth) {
                setCurrentMonth(m);
            }
        }
    }, [initialDate, currentYear, currentMonth]);

    const handlePrevMonth = useCallback(() => {
        setCurrentMonth(prev => {
            const next = prev === 1 ? 12 : prev - 1;
            const holidays = getHolidaysForMonth(next, currentYear);
            if (holidays.length > 0) {
                setSelectedDate(holidays[0].date);
            } else {
                const events = getEventsForMonth(next, currentYear);
                setSelectedDate(events.length > 0 ? events[0].date : `${currentYear}-${String(next).padStart(2, '0')}-01`);
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
                setSelectedDate(events.length > 0 ? events[0].date : `${currentYear}-${String(next).padStart(2, '0')}-01`);
            }
            return next;
        });
    }, [currentYear]);

    const handleSelectDate = useCallback((isoDate) => {
        setSelectedDate(isoDate);
        if (isoDate) {
            const parts = isoDate.split('-');
            const m = parseInt(parts[1], 10);
            if (m >= 1 && m <= 12 && m !== currentMonth) {
                setCurrentMonth(m);
            }
        }
    }, [currentMonth]);

    const handleNavigateMonth = useCallback((monthInt) => {
        const m = parseInt(monthInt, 10);
        if (m >= 1 && m <= 12) {
            setCurrentMonth(m);
        }
    }, []);

    return {
        currentYear,
        currentMonth,
        setCurrentMonth,
        selectedDate,
        setSelectedDate,
        handlePrevMonth,
        handleNextMonth,
        handleSelectDate,
        handleNavigateMonth
    };
}
