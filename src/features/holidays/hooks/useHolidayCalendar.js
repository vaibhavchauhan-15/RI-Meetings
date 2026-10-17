/**
 * Reach International Operations - useHolidayCalendar Custom Hook
 * 
 * Manages calendar view state, month navigation (with smooth Jan-Dec wrapping),
 * date selection, and external synchronization.
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { getHolidaysForMonth, getEventsForMonth } from '../services/holidayService.js';

export function useHolidayCalendar({
    initialMonth, // optional '01' - '12' or number 1 - 12
    initialDate,  // optional 'YYYY-MM-DD'
    onMonthChange,
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

    const prevInitialMonthRef = useRef(initialMonth);
    const prevInitialDateRef = useRef(initialDate);

    // Synchronize ONLY when initialMonth changes externally
    useEffect(() => {
        if (initialMonth && initialMonth !== prevInitialMonthRef.current) {
            prevInitialMonthRef.current = initialMonth;
            const m = parseInt(initialMonth, 10);
            if (m >= 1 && m <= 12) {
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
    }, [initialMonth, currentYear]);

    // Synchronize ONLY when initialDate changes externally
    useEffect(() => {
        if (initialDate && initialDate !== prevInitialDateRef.current && initialDate.startsWith(`${currentYear}-`)) {
            prevInitialDateRef.current = initialDate;
            setSelectedDate(initialDate);
            const parts = initialDate.split('-');
            const m = parseInt(parts[1], 10);
            if (m >= 1 && m <= 12) {
                setCurrentMonth(m);
            }
        }
    }, [initialDate, currentYear]);

    const handlePrevMonth = useCallback(() => {
        setCurrentMonth(prev => {
            const next = prev === 1 ? 12 : prev - 1;
            prevInitialMonthRef.current = String(next).padStart(2, '0');
            const holidays = getHolidaysForMonth(next, currentYear);
            if (holidays.length > 0) {
                setSelectedDate(holidays[0].date);
            } else {
                const events = getEventsForMonth(next, currentYear);
                setSelectedDate(events.length > 0 ? events[0].date : `${currentYear}-${String(next).padStart(2, '0')}-01`);
            }
            if (onMonthChange) {
                onMonthChange(next);
            }
            return next;
        });
    }, [currentYear, onMonthChange]);

    const handleNextMonth = useCallback(() => {
        setCurrentMonth(prev => {
            const next = prev === 12 ? 1 : prev + 1;
            prevInitialMonthRef.current = String(next).padStart(2, '0');
            const holidays = getHolidaysForMonth(next, currentYear);
            if (holidays.length > 0) {
                setSelectedDate(holidays[0].date);
            } else {
                const events = getEventsForMonth(next, currentYear);
                setSelectedDate(events.length > 0 ? events[0].date : `${currentYear}-${String(next).padStart(2, '0')}-01`);
            }
            if (onMonthChange) {
                onMonthChange(next);
            }
            return next;
        });
    }, [currentYear, onMonthChange]);

    const handleSelectDate = useCallback((isoDate) => {
        setSelectedDate(isoDate);
        if (isoDate) {
            const parts = isoDate.split('-');
            const m = parseInt(parts[1], 10);
            if (m >= 1 && m <= 12) {
                setCurrentMonth(m);
                prevInitialMonthRef.current = String(m).padStart(2, '0');
                if (onMonthChange) {
                    onMonthChange(m);
                }
            }
        }
    }, [onMonthChange]);

    const handleNavigateMonth = useCallback((monthInt, targetDate = null) => {
        const m = parseInt(monthInt, 10);
        if (m >= 1 && m <= 12) {
            setCurrentMonth(m);
            prevInitialMonthRef.current = String(m).padStart(2, '0');
            if (targetDate && targetDate.startsWith(`${currentYear}-${String(m).padStart(2, '0')}`)) {
                setSelectedDate(targetDate);
            } else {
                setSelectedDate(prevDate => {
                    if (prevDate && prevDate.startsWith(`${currentYear}-${String(m).padStart(2, '0')}`)) {
                        return prevDate;
                    }
                    const holidays = getHolidaysForMonth(m, currentYear);
                    if (holidays.length > 0) return holidays[0].date;
                    const events = getEventsForMonth(m, currentYear);
                    if (events.length > 0) return events[0].date;
                    return `${currentYear}-${String(m).padStart(2, '0')}-01`;
                });
            }
            if (onMonthChange) {
                onMonthChange(m);
            }
        }
    }, [currentYear, onMonthChange]);

    const handleToday = useCallback(() => {
        const now = new Date();
        const m = now.getMonth() + 1;
        const d = String(now.getDate()).padStart(2, '0');
        const monthPadded = String(m).padStart(2, '0');
        const targetDate = `${currentYear}-${monthPadded}-${d}`;
        setCurrentMonth(m);
        prevInitialMonthRef.current = monthPadded;
        setSelectedDate(targetDate);
        if (onMonthChange) {
            onMonthChange(m);
        }
    }, [currentYear, onMonthChange]);

    return {
        currentYear,
        currentMonth,
        setCurrentMonth,
        selectedDate,
        setSelectedDate,
        handlePrevMonth,
        handleNextMonth,
        handleSelectDate,
        handleNavigateMonth,
        handleToday
    };
}
