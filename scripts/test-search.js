/**
 * Unit Test Script for Search Query Variations & Scoring Algorithm
 */

import { searchMeetings } from '../src/features/meeting-reports/utils/searchEngine.js';
import { 
    formatDateDDMMYYYY, 
    generateAllDateVariations 
} from '../src/features/meeting-reports/utils/meetingDateUtils.js';

// Realistic mock search index representing meetings in database
const mockDates = [
    { date: '2026-08-25', sites: ['Sanand'], people: ['Pradeep'], focus: 'Sanand Fleet Operations' },
    { date: '2026-09-02', sites: ['Sanand', 'Bhiwadi'], people: ['Rahul Singh', 'Pradeep'], focus: 'Sanand and Bhiwadi equipment overhaul' },
    { date: '2026-09-16', sites: ['Bijnor'], people: ['Amit Kumar'], focus: 'Bijnor plant breakdown' },
    { date: '2026-09-17', sites: ['Workshop'], people: ['Vishwakarma Team'], focus: 'Vishwakarma Puja celebration' },
    { date: '2026-09-19', sites: ['Bellary', 'Assam'], people: ['Naveen'], focus: 'Bellary mining equipment' },
    { date: '2026-10-15', sites: ['Ahmedabad'], people: ['Pradeep'], focus: 'Boom lift servicing' },
    { date: '2026-10-16', sites: ['Sanand'], people: ['Anuj'], focus: 'Hydraulic pump replacement' }
];

const searchIndex = mockDates.map(item => {
    const displayDate = formatDateDDMMYYYY(item.date);
    return {
        id: `meet-${item.date}`,
        date: item.date,
        dateDisplay: displayDate,
        dateFormatted: displayDate,
        title: displayDate,
        focus: item.focus,
        isHoliday: false,
        keywords: `${item.focus} ${item.sites.join(' ')} ${item.people.join(' ')}`,
        sites: item.sites,
        people: item.people,
        parts: [],
        dateVariations: generateAllDateVariations(item.date)
    };
});

const testQueries = [
    { query: '02-09-2026', expectedDate: '2026-09-02' },
    { query: '2-9-2026', expectedDate: '2026-09-02' },
    { query: '2 September', expectedDate: '2026-09-02' },
    { query: '2 sept', expectedDate: '2026-09-02' },
    { query: '2 sep', expectedDate: '2026-09-02' },
    { query: '2/09/2026', expectedDate: '2026-09-02' },
    { query: '2/9/2026', expectedDate: '2026-09-02' },
    { query: '02/09/2026', expectedDate: '2026-09-02' },
    { query: '02.09.2026', expectedDate: '2026-09-02' },
    { query: 'September 2', expectedDate: '2026-09-02' },
    { query: 'Sept 2', expectedDate: '2026-09-02' },
    { query: '2nd September', expectedDate: '2026-09-02' },
    { query: '2nd Sept', expectedDate: '2026-09-02' },
    { query: '02-09', expectedDate: '2026-09-02' },
    { query: '2/09', expectedDate: '2026-09-02' },
    { query: '25-08-2026', expectedDate: '2026-08-25' },
    { query: '25 August', expectedDate: '2026-08-25' },
    { query: '25 aug', expectedDate: '2026-08-25' },
    { query: '25/08/2026', expectedDate: '2026-08-25' },
    { query: 'Sanand', expectedCount: (c) => c > 0 },
    { query: 'Pradeep', expectedCount: (c) => c > 0 },
    { query: '02-09-2026 Sanand', expectedDate: '2026-09-02' },
    { query: '16-09-2026', expectedDate: '2026-09-16' },
    { query: '16 September', expectedDate: '2026-09-16' },
    { query: 'Bijnor', expectedCount: (c) => c > 0 },
    { query: 'Vishwakarma', expectedDate: '2026-09-17' },
    { query: '17-09-2026', expectedDate: '2026-09-17' },
    { query: '19-09-2026', expectedDate: '2026-09-19' },
    { query: '19 September', expectedDate: '2026-09-19' },
    { query: '19 sept', expectedDate: '2026-09-19' }
];

let allPassed = true;

console.log('🧪 Testing Search Query Variations...\n');

for (const t of testQueries) {
    const results = searchMeetings(t.query, searchIndex);
    if (t.expectedDate) {
        const topResult = results[0];
        const passed = topResult && (topResult.date === t.expectedDate || topResult.dateDisplay === formatDateDDMMYYYY(t.expectedDate));
        if (passed) {
            console.log(`✅ Query: "${t.query}" -> Top Result: ${topResult.dateDisplay} (${topResult.date})`);
        } else {
            console.error(`❌ Query: "${t.query}" FAILED! Got: ${topResult ? topResult.date : 'No results'}, Expected: ${t.expectedDate}`);
            allPassed = false;
        }
    } else if (t.expectedCount) {
        const passed = t.expectedCount(results.length);
        if (passed) {
            console.log(`✅ Query: "${t.query}" -> Found ${results.length} results`);
        } else {
            console.error(`❌ Query: "${t.query}" FAILED! Expected results > 0, got ${results.length}`);
            allPassed = false;
        }
    }
}

if (allPassed) {
    console.log('\n🎉 ALL SEARCH VARIATIONS PASSED PERFECTLY!');
} else {
    process.exit(1);
}
