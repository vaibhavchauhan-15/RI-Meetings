/**
 * Reach International Operations - Search Engine & Navigation Algorithm
 * 
 * Features:
 * - Direct Date formats: '02-09-2026', '2-9-2026', '02/09/2026', '2.09.2026'
 * - Word Date formats: '2 September', '2 sept', '2 sep', 'September 2', '2nd September 2026'
 * - Partial Date formats: '02-09', '2/09', 'September 2026', 'August'
 * - Keywords: Site names, technician/engineer names, parts, issues, actions, focus topics
 * - Chronological sequence calculation for previous/next non-holiday meetings
 */

import { parseAnyDateToParts, generateAllDateVariations, normalizeDateToYYYYMMDD } from './meetingDateUtils.js';

/**
 * High-performance smart search across meetings
 * @param {string} query Search term
 * @param {Array} searchIndex Array of search index items
 * @returns {Array} Scored & sorted list of matching meeting summaries
 */
export function searchMeetings(query, searchIndex) {
    if (!query || !query.trim() || !Array.isArray(searchIndex)) {
        return [];
    }

    const rawQuery = query.trim();
    const cleanQuery = rawQuery.toLowerCase();

    // 1. Try parsing query as structured date
    const parsedQueryDate = parseAnyDateToParts(rawQuery);

    // 2. Tokenize search query (words / numbers)
    const normalizedQueryString = cleanQuery
        .replace(/[/.]/g, ' ')
        .replace(/(\d+)(?:st|nd|rd|th)/g, '$1')
        .trim();

    const queryTokens = normalizedQueryString.split(/\s+/).filter(Boolean);

    const scoredResults = [];

    for (const item of searchIndex) {
        let score = 0;

        // Retrieve or generate date variations
        const itemVariations = Array.isArray(item.dateVariations) && item.dateVariations.length > 0
            ? item.dateVariations
            : generateAllDateVariations(item.date);

        const itemVariationsLower = itemVariations.map(v => v.toLowerCase());

        // A. Direct exact/substring date variation match
        if (itemVariationsLower.some(v => v === cleanQuery)) {
            score += 300;
        } else if (itemVariationsLower.some(v => v.includes(cleanQuery) || cleanQuery.includes(v))) {
            score += 100;
        }

        // B. If query parsed as a structured date, compare day/month/year
        if (parsedQueryDate) {
            const itemDateParts = parseAnyDateToParts(item.date);
            if (itemDateParts) {
                const dayMatch = itemDateParts.dayInt === parsedQueryDate.dayInt;
                const monthMatch = itemDateParts.monthInt === parsedQueryDate.monthInt;
                const yearMatch = itemDateParts.year === parsedQueryDate.year;

                if (dayMatch && monthMatch && yearMatch) {
                    score += 200; // Perfect full date match
                } else if (dayMatch && monthMatch) {
                    score += 120; // Day + Month match
                } else if (monthMatch && yearMatch && !rawQuery.match(/\d{1,2}[-/.]/)) {
                    score += 50;  // Month + Year match (e.g. "September 2026")
                }
            }
        }

        // C. Full text search target
        const searchTarget = [
            item.dateDisplay,
            item.date,
            item.dateFormatted,
            item.title,
            item.focus,
            item.holidayName,
            item.keywords,
            ...(Array.isArray(item.sites) ? item.sites : []),
            ...(Array.isArray(item.people) ? item.people : []),
            ...(Array.isArray(item.parts) ? item.parts : []),
            ...itemVariationsLower
        ].filter(Boolean).join(' ').toLowerCase();

        // Check if all query tokens match in the target text
        const allTokensMatch = queryTokens.every(token => {
            if (token === 'sept' || token === 'sep') {
                return searchTarget.includes('sep') || searchTarget.includes('september') || searchTarget.includes('09');
            }
            if (token === 'aug') {
                return searchTarget.includes('aug') || searchTarget.includes('august') || searchTarget.includes('08');
            }
            return searchTarget.includes(token);
        });

        if (allTokensMatch) {
            score += 40;
            if (item.title && item.title.toLowerCase().includes(cleanQuery)) score += 30;
            if (item.focus && item.focus.toLowerCase().includes(cleanQuery)) score += 20;
            if (Array.isArray(item.people) && item.people.some(p => p.toLowerCase().includes(cleanQuery))) score += 25;
            if (Array.isArray(item.sites) && item.sites.some(s => s.toLowerCase().includes(cleanQuery))) score += 25;
            if (Array.isArray(item.parts) && item.parts.some(pt => pt.toLowerCase().includes(cleanQuery))) score += 20;
        }

        if (score > 0) {
            scoredResults.push({ item, score });
        }
    }

    // Sort by relevance score descending, then by date descending
    scoredResults.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        return new Date(b.item.date).getTime() - new Date(a.item.date).getTime();
    });

    return scoredResults.map(r => r.item);
}

/**
 * Calculate previous and next non-holiday meetings in chronological sequence.
 * @param {string} currentDate e.g. "2026-09-02" or "02-09-2026"
 * @param {Array} chronologicalSequence Array of normalized meeting items
 */
export function getChronologicalNavigation(currentDate, chronologicalSequence = []) {
    if (!currentDate || !Array.isArray(chronologicalSequence) || chronologicalSequence.length === 0) {
        return { prevMeeting: null, nextMeeting: null };
    }

    const isoDate = normalizeDateToYYYYMMDD(currentDate);
    const navigableList = chronologicalSequence.filter(m => !m.isHoliday && !m.noMeetingHeld && !m.notRecorded);

    const currentIndex = navigableList.findIndex(m => 
        m.date === isoDate || 
        m.id === `meet-${isoDate}` || 
        m.date === currentDate ||
        m.dateDisplay === currentDate
    );

    const prevMeeting = currentIndex > 0 ? navigableList[currentIndex - 1] : null;
    const nextMeeting = currentIndex >= 0 && currentIndex < navigableList.length - 1 ? navigableList[currentIndex + 1] : null;

    return { prevMeeting, nextMeeting };
}
