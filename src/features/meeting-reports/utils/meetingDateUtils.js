/**
 * Reach International Operations - Date Parsing & Formatting Utilities
 * 
 * Production-tested date helpers supporting multiple Indian & international date formats:
 * - DD-MM-YYYY, YYYY-MM-DD, DD/MM/YYYY, DD.MM.YYYY
 * - "2 September", "2nd Sept 2026", "Sep 02"
 * - Zero UTC shift; uses strictly local date parts.
 */

export const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export const MONTH_ABBR = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

function getOrdinalSuffix(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
}

function buildParts(year, monthInt, dayInt) {
    const dayPadded = String(dayInt).padStart(2, '0');
    const monthPadded = String(monthInt).padStart(2, '0');
    const dayStr = String(dayInt);
    const monthStr = String(monthInt);
    const yearStr = String(year);

    const monthFull = MONTH_NAMES[monthInt - 1] || 'Unknown';
    const monthShort = MONTH_ABBR[monthInt - 1] || 'Unknown';
    const monthSept = monthInt === 9 ? 'Sept' : monthShort;

    const ord = getOrdinalSuffix(dayInt);
    const dayOrd = `${dayInt}${ord}`;
    const dayPaddedOrd = `${dayPadded}${ord}`;

    return {
        year: yearStr,
        monthInt,
        monthPadded,
        monthStr,
        dayInt,
        dayPadded,
        dayStr,
        monthFull,
        monthShort,
        monthSept,
        dayOrd,
        dayPaddedOrd,
        isoDate: `${yearStr}-${monthPadded}-${dayPadded}`,
        displayDate: `${dayPadded}-${monthPadded}-${yearStr}`
    };
}

/**
 * Parses any incoming date string (DD-MM-YYYY, YYYY-MM-DD, DD/MM/YYYY, 2 September, etc.)
 * into a structured parts object.
 */
export function parseAnyDateToParts(dateStr) {
    if (!dateStr) return null;
    const clean = String(dateStr).trim();

    // 1. YYYY-MM-DD or YYYY/MM/DD or YYYY.MM.DD
    let m = clean.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
    if (m) {
        const year = m[1];
        const monthInt = parseInt(m[2], 10);
        const dayInt = parseInt(m[3], 10);
        if (monthInt >= 1 && monthInt <= 12 && dayInt >= 1 && dayInt <= 31) {
            return buildParts(year, monthInt, dayInt);
        }
    }

    // 2. DD-MM-YYYY or DD/MM/YYYY or DD.MM.YYYY
    m = clean.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
    if (m) {
        const dayInt = parseInt(m[1], 10);
        const monthInt = parseInt(m[2], 10);
        const year = m[3];
        if (monthInt >= 1 && monthInt <= 12 && dayInt >= 1 && dayInt <= 31) {
            return buildParts(year, monthInt, dayInt);
        }
    }

    // 3. DD-MM or DD/MM or DD.MM (e.g. "02-09", "2/09", "2-9")
    m = clean.match(/^(\d{1,2})[-/.](\d{1,2})$/);
    if (m) {
        const dayInt = parseInt(m[1], 10);
        const monthInt = parseInt(m[2], 10);
        const year = '2026';
        if (monthInt >= 1 && monthInt <= 12 && dayInt >= 1 && dayInt <= 31) {
            return buildParts(year, monthInt, dayInt);
        }
    }

    // 4. DD Month (YYYY) (e.g. "02 Sep 2026", "2 September 2026", "2nd Sept", "2 sept")
    m = clean.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)(?:\s+(\d{4}))?$/i);
    if (m) {
        const dayInt = parseInt(m[1], 10);
        const monthWord = m[2].toLowerCase();
        const year = m[3] || '2026';
        let monthInt = MONTH_NAMES.findIndex(mn => mn.toLowerCase().startsWith(monthWord.slice(0, 3))) + 1;
        if (monthWord === 'sept') monthInt = 9;
        if (monthInt >= 1 && monthInt <= 12 && dayInt >= 1 && dayInt <= 31) {
            return buildParts(year, monthInt, dayInt);
        }
    }

    // 5. Month DD (YYYY) (e.g. "September 2 2026", "Sep 02", "Sept 2nd")
    m = clean.match(/^([A-Za-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?(?:\s+(\d{4}))?$/i);
    if (m) {
        const monthWord = m[1].toLowerCase();
        const dayInt = parseInt(m[2], 10);
        const year = m[3] || '2026';
        let monthInt = MONTH_NAMES.findIndex(mn => mn.toLowerCase().startsWith(monthWord.slice(0, 3))) + 1;
        if (monthWord === 'sept') monthInt = 9;
        if (monthInt >= 1 && monthInt <= 12 && dayInt >= 1 && dayInt <= 31) {
            return buildParts(year, monthInt, dayInt);
        }
    }

    // 6. Native Date parser fallback
    const d = new Date(clean);
    if (!isNaN(d.getTime())) {
        return buildParts(String(d.getFullYear()), d.getMonth() + 1, d.getDate());
    }

    return null;
}

/**
 * Converts any date string to standard 'DD-MM-YYYY' (e.g. '02-09-2026')
 */
export function formatDateDDMMYYYY(dateStr) {
    const p = parseAnyDateToParts(dateStr);
    return p ? p.displayDate : (dateStr || '');
}

/**
 * Converts any date string to 'YYYY-MM-DD' (e.g. '2026-09-02') for database storage and keys
 */
export function normalizeDateToYYYYMMDD(dateStr) {
    const p = parseAnyDateToParts(dateStr);
    return p ? p.isoDate : (dateStr || '');
}

export function formatMeetingDate(dateStr) {
    return formatDateDDMMYYYY(dateStr);
}

export function formatShortMeetingDate(dateStr) {
    return formatDateDDMMYYYY(dateStr);
}

export function formatLongMeetingDate(dateStr) {
    return formatDateDDMMYYYY(dateStr);
}

/**
 * Generates all search variation tokens for a given meeting date.
 * (e.g. '02-09-2026', '2/09/2026', '2 September', '2 sept', 'sept 2', etc.)
 */
export function generateAllDateVariations(dateStr) {
    const p = parseAnyDateToParts(dateStr);
    if (!p) return [];

    const variations = new Set();

    // 1. Numeric with hyphens
    variations.add(`${p.dayPadded}-${p.monthPadded}-${p.year}`);
    variations.add(`${p.dayStr}-${p.monthPadded}-${p.year}`);
    variations.add(`${p.dayPadded}-${p.monthStr}-${p.year}`);
    variations.add(`${p.dayStr}-${p.monthStr}-${p.year}`);
    variations.add(`${p.dayPadded}-${p.monthPadded}`);
    variations.add(`${p.dayStr}-${p.monthPadded}`);
    variations.add(`${p.dayStr}-${p.monthStr}`);
    variations.add(`${p.dayPadded}-${p.monthStr}`);

    // 2. Numeric with slashes
    variations.add(`${p.dayPadded}/${p.monthPadded}/${p.year}`);
    variations.add(`${p.dayStr}/${p.monthPadded}/${p.year}`);
    variations.add(`${p.dayPadded}/${p.monthStr}/${p.year}`);
    variations.add(`${p.dayStr}/${p.monthStr}/${p.year}`);
    variations.add(`${p.dayPadded}/${p.monthPadded}`);
    variations.add(`${p.dayStr}/${p.monthPadded}`);
    variations.add(`${p.dayStr}/${p.monthStr}`);
    variations.add(`${p.dayPadded}/${p.monthStr}`);

    // 3. Numeric with dots
    variations.add(`${p.dayPadded}.${p.monthPadded}.${p.year}`);
    variations.add(`${p.dayStr}.${p.monthPadded}.${p.year}`);
    variations.add(`${p.dayStr}.${p.monthStr}.${p.year}`);
    variations.add(`${p.dayPadded}.${p.monthPadded}`);
    variations.add(`${p.dayStr}.${p.monthStr}`);

    // 4. ISO variations
    variations.add(`${p.year}-${p.monthPadded}-${p.dayPadded}`);
    variations.add(`${p.year}/${p.monthPadded}/${p.dayPadded}`);
    variations.add(`${p.year}-${p.monthStr}-${p.dayStr}`);

    // 5. Month word variations
    const monthWords = [p.monthFull, p.monthShort];
    if (p.monthSept !== p.monthShort) monthWords.push(p.monthSept);

    const dayForms = [p.dayStr, p.dayPadded, p.dayOrd, p.dayPaddedOrd];

    monthWords.forEach(mw => {
        dayForms.forEach(df => {
            variations.add(`${df} ${mw}`);
            variations.add(`${df} ${mw} ${p.year}`);
            variations.add(`${mw} ${df}`);
            variations.add(`${mw} ${df} ${p.year}`);
            variations.add(`${mw} ${df}, ${p.year}`);
        });
        variations.add(`${mw} ${p.year}`);
        variations.add(mw);
    });

    // 6. Compact numeric
    variations.add(`${p.dayPadded}${p.monthPadded}${p.year}`);
    variations.add(`${p.year}${p.monthPadded}${p.dayPadded}`);

    return Array.from(variations);
}
