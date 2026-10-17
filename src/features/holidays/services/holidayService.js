/**
 * Reach International Operations - Holiday & Festival Query Service
 * 
 * Centralized business logic for querying official company holidays,
 * multi-faith festival observances, and calendar summary information.
 */

import { 
    ALL_INDIAN_CALENDAR_EVENTS_2026, 
    COMPANY_HOLIDAYS_2026, 
    HOLIDAYS_BY_DATE_2026, 
    EVENTS_BY_DATE_2026 
} from '../data/companyHolidays2026.js';

/**
 * Checks if a given date string is an official company holiday.
 * Safe from UTC timezone shift.
 * @param {string} dateStr - 'YYYY-MM-DD'
 * @returns {boolean}
 */
export function isCompanyHoliday(dateStr) {
    if (!dateStr) return false;
    const cleanDate = String(dateStr).trim().slice(0, 10);
    return Boolean(HOLIDAYS_BY_DATE_2026[cleanDate]);
}

/**
 * Checks if a date has any festival or event (working day or holiday).
 * @param {string} dateStr - 'YYYY-MM-DD'
 * @returns {boolean}
 */
export function hasEvent(dateStr) {
    if (!dateStr) return false;
    const cleanDate = String(dateStr).trim().slice(0, 10);
    return Boolean(EVENTS_BY_DATE_2026[cleanDate] && EVENTS_BY_DATE_2026[cleanDate].length > 0);
}

/**
 * Returns the company holiday object for a given date, or null.
 * @param {string} dateStr - 'YYYY-MM-DD'
 * @returns {Object|null}
 */
export function getHolidayForDate(dateStr) {
    if (!dateStr) return null;
    const cleanDate = String(dateStr).trim().slice(0, 10);
    return HOLIDAYS_BY_DATE_2026[cleanDate] || null;
}

/**
 * Returns all festivals and events for a given date (array).
 * @param {string} dateStr - 'YYYY-MM-DD'
 * @returns {Array}
 */
export function getEventsForDate(dateStr) {
    if (!dateStr) return [];
    const cleanDate = String(dateStr).trim().slice(0, 10);
    return EVENTS_BY_DATE_2026[cleanDate] || [];
}

/**
 * Unified day summary info helper for calendar rendering.
 * @param {string} dateStr - 'YYYY-MM-DD'
 * @returns {Object|null}
 */
export function getDayCalendarInfo(dateStr) {
    if (!dateStr) return null;
    const cleanDate = String(dateStr).trim().slice(0, 10);
    const companyHoliday = HOLIDAYS_BY_DATE_2026[cleanDate] || null;
    const events = EVENTS_BY_DATE_2026[cleanDate] || [];
    const isHoliday = Boolean(companyHoliday);
    const hasEvents = events.length > 0;

    let statusType = 'regular';
    if (isHoliday) {
        statusType = 'company-holiday';
    } else if (hasEvents) {
        statusType = 'festival-event';
    }

    return {
        date: cleanDate,
        isCompanyHoliday: isHoliday,
        companyHoliday,
        events,
        hasEvents,
        statusType,
        primaryName: companyHoliday ? companyHoliday.name : (events[0]?.name || null)
    };
}

/**
 * Returns all company holidays occurring in a given month (1-12) of 2026.
 * @param {number|string} monthInt - 1-12
 * @param {number} [yearInt=2026]
 * @returns {Array}
 */
export function getHolidaysForMonth(monthInt, yearInt = 2026) {
    if (yearInt !== 2026) return [];
    return COMPANY_HOLIDAYS_2026.filter(h => h.month === Number(monthInt));
}

/**
 * Returns all festivals and events occurring in a given month (1-12) of 2026,
 * with optional religion/category filter.
 * @param {number|string} monthInt - 1-12
 * @param {number} [yearInt=2026]
 * @param {string} [categoryFilter='all']
 * @returns {Array}
 */
export function getEventsForMonth(monthInt, yearInt = 2026, categoryFilter = 'all') {
    if (yearInt !== 2026) return [];
    const m = Number(monthInt);
    let list = ALL_INDIAN_CALENDAR_EVENTS_2026.filter(ev => ev.month === m);
    
    if (categoryFilter === 'company') {
        return list.filter(ev => ev.isCompanyHoliday);
    }
    if (categoryFilter && categoryFilter !== 'all') {
        return list.filter(ev => ev.category === categoryFilter || ev.religion === categoryFilter);
    }
    return list;
}

/**
 * Returns upcoming events and holidays relative to a given reference date.
 * @param {string} [referenceDateStr] - 'YYYY-MM-DD'
 * @param {number} [limit=6]
 * @param {string} [categoryFilter='all']
 * @returns {Array}
 */
export function getUpcomingEvents(referenceDateStr, limit = 6, categoryFilter = 'all') {
    let todayStr;
    if (referenceDateStr) {
        todayStr = String(referenceDateStr).slice(0, 10);
    } else {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        todayStr = `${y}-${m}-${d}`;
    }

    let source = ALL_INDIAN_CALENDAR_EVENTS_2026;
    if (categoryFilter === 'company') {
        source = COMPANY_HOLIDAYS_2026;
    } else if (categoryFilter && categoryFilter !== 'all') {
        source = source.filter(ev => ev.category === categoryFilter || ev.religion === categoryFilter);
    }

    const upcoming = source.filter(ev => ev.date >= todayStr);
    return limit ? upcoming.slice(0, limit) : upcoming;
}

/**
 * Backwards compatible helper: Returns upcoming company holidays.
 * @param {string} [referenceDateStr]
 * @param {number} [limit=5]
 * @returns {Array}
 */
export function getUpcomingHolidays(referenceDateStr, limit = 5) {
    return getUpcomingEvents(referenceDateStr, limit, 'company');
}
