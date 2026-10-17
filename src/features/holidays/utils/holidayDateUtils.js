/**
 * Reach International Operations - 2026 Holiday Calendar Date Utilities
 * 
 * Safe leap-year and non-leap year calendar math, day calculations,
 * weekday alignment, and timezone-free date formatters.
 */

export const MONTH_NAMES = Object.freeze([
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
]);

export const MONTH_SHORT_NAMES = Object.freeze([
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]);

export const WEEKDAY_LABELS = Object.freeze([
    { full: 'Sunday', short: 'Sun', letter: 'S' },
    { full: 'Monday', short: 'Mon', letter: 'M' },
    { full: 'Tuesday', short: 'Tue', letter: 'T' },
    { full: 'Wednesday', short: 'Wed', letter: 'W' },
    { full: 'Thursday', short: 'Thu', letter: 'T' },
    { full: 'Friday', short: 'Fri', letter: 'F' },
    { full: 'Saturday', short: 'Sat', letter: 'S' }
]);

export const RELIGION_FILTER_TABS = Object.freeze([
    { id: 'all', label: 'All', iconKey: 'all' },
    { id: 'company', label: 'Company (15)', iconKey: 'company' },
    { id: 'Hindu', label: 'Hindu', iconKey: 'Hindu' },
    { id: 'Islamic', label: 'Muslim', iconKey: 'Islamic' },
    { id: 'Sikh', label: 'Sikh', iconKey: 'Sikh' },
    { id: 'Christian', label: 'Christian', iconKey: 'Christian' },
    { id: 'Jain', label: 'Jain', iconKey: 'Jain' },
    { id: 'Buddhist', label: 'Buddhist', iconKey: 'Buddhist' },
    { id: 'National', label: 'National', iconKey: 'National' }
]);

/**
 * Returns the total days in a given month for a given year (2026 non-leap year safe).
 * @param {number} year - Full 4-digit year (e.g. 2026)
 * @param {number} month - 1-indexed month (1 = Jan, 12 = Dec)
 * @returns {number} Days in month (28 for Feb 2026)
 */
export function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

/**
 * Returns the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday) for the 1st of a month.
 * @param {number} year - Full 4-digit year (e.g. 2026)
 * @param {number} month - 1-indexed month (1 = Jan, 12 = Dec)
 * @returns {number} Day index (0-6)
 */
export function getFirstDayOfWeek(year, month) {
    return new Date(year, month - 1, 1).getDay();
}

/**
 * Formats an ISO date into full readable format: e.g. "Thursday, January 1, 2026"
 * Pure local string formatting to avoid UTC timezone offsets.
 * @param {string} dateStr - 'YYYY-MM-DD'
 * @returns {string} Formatted full date
 */
export function formatFullHolidayDate(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const year = parts[0];
    const monthInt = parseInt(parts[1], 10);
    const dayInt = parseInt(parts[2], 10);
    const monthName = MONTH_NAMES[monthInt - 1] || '';
    const dayOfWeek = WEEKDAY_LABELS[new Date(parseInt(year, 10), monthInt - 1, dayInt).getDay()]?.full || '';
    return `${dayOfWeek}, ${monthName} ${dayInt}, ${year}`;
}

/**
 * Returns relative status string ('Today', 'Upcoming', or null).
 * @param {string} targetDateStr - 'YYYY-MM-DD'
 * @param {string} [referenceDateStr] - Optional ISO reference date
 * @returns {'Today'|'Upcoming'|null}
 */
export function getRelativeHolidayStatus(targetDateStr, referenceDateStr) {
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

    if (targetDateStr === todayStr) return 'Today';
    if (targetDateStr > todayStr) return 'Upcoming';
    return null;
}

/**
 * Checks whether an ISO date string ('YYYY-MM-DD') falls on a Sunday.
 * Timezone-safe local calendar arithmetic.
 * @param {string} dateStr - 'YYYY-MM-DD'
 * @returns {boolean}
 */
export function isSundayDate(dateStr) {
    if (!dateStr) return false;
    const parts = String(dateStr).trim().split('-');
    if (parts.length !== 3) return false;
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    if (isNaN(y) || isNaN(m) || isNaN(d)) return false;
    return new Date(y, m, d).getDay() === 0;
}

