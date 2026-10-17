/**
 * Verification Test Script for 2026 Indian & Company Holiday Calendar
 * Verifies:
 * 1. All 15 Reach International Company Holidays (Green 🟢, isCompanyHoliday = true).
 * 2. Complete multi-faith Indian calendar dataset (Hindu, Islamic, Christian, Sikh, Jain, Buddhist, Parsi, National).
 * 3. Working day status correctly flagged for non-company holiday festivals.
 * 4. Month distribution, leap year safety, and lookup helper functions.
 */

import { 
    COMPANY_HOLIDAYS_2026, 
    ALL_INDIAN_CALENDAR_EVENTS_2026,
    HOLIDAYS_BY_DATE_2026, 
    EVENTS_BY_DATE_2026,
    isCompanyHoliday,
    getHolidayForDate,
    getEventsForDate,
    getDayCalendarInfo,
    getHolidaysForMonth,
    getEventsForMonth,
    getUpcomingEvents,
    getUpcomingHolidays,
    getDaysInMonth,
    getFirstDayOfWeek,
    WEEKDAY_LABELS,
    MONTH_NAMES
} from '../src/data/companyHolidays2026.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
    totalTests++;
    if (condition) {
        console.log(`✓ PASS: ${message}`);
        passedTests++;
    } else {
        console.error(`✗ FAIL: ${message}`);
        process.exitCode = 1;
    }
}

console.log('=== RUNNING 2026 INDIAN & COMPANY HOLIDAY CALENDAR VERIFICATION ===\n');

// 1. All 15 Company Holidays Check
console.log('--- Criterion 1: Company Holiday List & Integrity (15 Official Holidays) ---');
assert(COMPANY_HOLIDAYS_2026.length === 15, `Total 15 company holiday days defined (found ${COMPANY_HOLIDAYS_2026.length})`);

const expectedCompanyHolidays = [
    { date: '2026-01-01', day: 'Thursday', name: "New Year's Day" },
    { date: '2026-01-26', day: 'Monday', name: 'Republic Day' },
    { date: '2026-02-15', day: 'Sunday', name: 'Maha Shivaratri' },
    { date: '2026-03-04', day: 'Wednesday', name: 'Holi' },
    { date: '2026-03-05', day: 'Thursday', name: 'Holi' },
    { date: '2026-08-15', day: 'Saturday', name: 'Independence Day' },
    { date: '2026-08-28', day: 'Friday', name: 'Raksha Bandhan' },
    { date: '2026-09-04', day: 'Friday', name: 'Janmashtami' },
    { date: '2026-10-02', day: 'Friday', name: 'Mahatma Gandhi Jayanti' },
    { date: '2026-10-20', day: 'Tuesday', name: 'Dussehra' },
    { date: '2026-11-08', day: 'Sunday', name: 'Diwali (Deepavali)' },
    { date: '2026-11-09', day: 'Monday', name: 'Govardhan Puja' },
    { date: '2026-11-10', day: 'Tuesday', name: 'Holiday on Occasion of Festival' },
    { date: '2026-11-11', day: 'Wednesday', name: 'Bhai Dooj' },
    { date: '2026-12-25', day: 'Friday', name: 'Christmas' }
];

expectedCompanyHolidays.forEach(exp => {
    const holiday = getHolidayForDate(exp.date);
    assert(Boolean(holiday), `Company Holiday exists for ${exp.date} (${exp.name})`);
    if (holiday) {
        assert(holiday.name === exp.name, `${exp.date} name matches "${exp.name}" (got "${holiday.name}")`);
        assert(holiday.dayOfWeek === exp.day, `${exp.date} dayOfWeek is ${exp.day} (got ${holiday.dayOfWeek})`);
        assert(holiday.isCompanyHoliday === true, `${exp.date} is marked isCompanyHoliday === true`);
        assert(isCompanyHoliday(exp.date) === true, `isCompanyHoliday('${exp.date}') returns true`);
    }
});

// 2. Comprehensive Multi-Faith Indian Events Dataset Check
console.log('\n--- Criterion 2: Multi-Faith & Multi-Religion Representation ---');
assert(ALL_INDIAN_CALENDAR_EVENTS_2026.length >= 70, `Comprehensive calendar contains ${ALL_INDIAN_CALENDAR_EVENTS_2026.length} events (expected >= 70)`);

// Check presence of all religions & categories
const religionsPresent = new Set(ALL_INDIAN_CALENDAR_EVENTS_2026.map(e => e.religion));
['Hinduism', 'Islam', 'Christianity', 'Sikhism', 'Jainism', 'Buddhism', 'Zoroastrianism', 'National'].forEach(rel => {
    assert(religionsPresent.has(rel), `Religion "${rel}" is represented in 2026 calendar`);
});

// Check key specific festivals across traditions
const keyFestivals = [
    // Hindu
    { date: '2026-01-14', name: 'Makar Sankranti & Pongal', isCompanyHoliday: false },
    { date: '2026-01-23', name: 'Vasant Panchami (Saraswati Puja)', isCompanyHoliday: false },
    { date: '2026-03-19', name: 'Chaitra Navratri Begins / Ugadi / Gudi Padwa', isCompanyHoliday: false },
    { date: '2026-03-26', name: 'Rama Navami', isCompanyHoliday: false },
    { date: '2026-04-20', name: 'Akshaya Tritiya & Parashurama Jayanti', isCompanyHoliday: false },
    { date: '2026-07-16', name: 'Jagannath Puri Rath Yatra', isCompanyHoliday: false },
    { date: '2026-09-14', name: 'Ganesh Chaturthi & Hindi Diwas', isCompanyHoliday: false },
    { date: '2026-10-29', name: 'Karwa Chauth', isCompanyHoliday: false },
    { date: '2026-11-06', name: 'Dhanteras (Dhanatrayodashi)', isCompanyHoliday: false },
    { date: '2026-11-15', name: 'Chhath Puja (Sandhya Arghya)', isCompanyHoliday: false },
    { date: '2026-11-20', name: 'Tulsi Vivah', isCompanyHoliday: false },
    { date: '2026-12-20', name: 'Gita Jayanti / Mokshada Ekadashi', isCompanyHoliday: false },
    // Islamic
    { date: '2026-02-03', name: 'Shab-e-Barat', isCompanyHoliday: false },
    { date: '2026-02-19', name: 'Ramadan (Ramzan) Fasting Begins', isCompanyHoliday: false },
    { date: '2026-03-21', name: 'Eid-ul-Fitr (Ramzan Id) & Jamshedi Navroz', isCompanyHoliday: false },
    { date: '2026-05-27', name: 'Eid al-Adha (Bakrid)', isCompanyHoliday: false },
    { date: '2026-06-26', name: 'Muharram (Day of Ashura)', isCompanyHoliday: false },
    // Christian
    { date: '2026-04-03', name: 'Good Friday', isCompanyHoliday: false },
    { date: '2026-04-05', name: 'Easter Sunday', isCompanyHoliday: false },
    { date: '2026-12-24', name: 'Christmas Eve', isCompanyHoliday: false },
    // Sikh
    { date: '2026-01-05', name: 'Guru Gobind Singh Jayanti', isCompanyHoliday: false },
    { date: '2026-01-13', name: 'Lohri', isCompanyHoliday: false },
    { date: '2026-04-14', name: 'Vaisakhi (Baisakhi) & Regional New Years', isCompanyHoliday: false },
    { date: '2026-11-24', name: 'Guru Nanak Jayanti (Gurpurab) & Dev Deepawali', isCompanyHoliday: false },
    // Jain
    { date: '2026-03-31', name: 'Mahavir Jayanti', isCompanyHoliday: false },
    { date: '2026-09-08', name: 'Paryushan Parva Begins (Shwetambar)', isCompanyHoliday: false },
    { date: '2026-09-12', name: 'Samvatsari (Michhami Dukkadam)', isCompanyHoliday: false },
    // Buddhist
    { date: '2026-05-01', name: 'Buddha Purnima (Vesak)', isCompanyHoliday: false },
    // National
    { date: '2026-01-30', name: 'Martyrs Day (Shaheed Diwas)', isCompanyHoliday: false },
    { date: '2026-04-14', name: 'Dr. B.R. Ambedkar Jayanti', isCompanyHoliday: false },
    { date: '2026-09-05', name: 'Teachers’ Day & Dahi Handi', isCompanyHoliday: false },
    { date: '2026-10-31', name: 'Rashtriya Ekta Diwas (National Unity Day)', isCompanyHoliday: false },
    { date: '2026-11-14', name: 'Children’s Day & Chhath Puja (Nahay Khay)', isCompanyHoliday: false },
    { date: '2026-11-26', name: 'Constitution Day (Samvidhan Diwas)', isCompanyHoliday: false }
];

keyFestivals.forEach(fest => {
    const events = getEventsForDate(fest.date);
    assert(events.length > 0, `Events found for ${fest.date} (${fest.name})`);
    const match = events.find(e => e.name.includes(fest.name.split(' ')[0]));
    assert(Boolean(match), `Matched "${fest.name}" on ${fest.date}`);
    if (match) {
        assert(match.isCompanyHoliday === fest.isCompanyHoliday, `${fest.name} isCompanyHoliday is ${fest.isCompanyHoliday}`);
    }
});

// 3. Calendar Grid Calculations & Leap Year Safety Check
console.log('\n--- Criterion 3: Leap Year Safety & Weekday Accuracy ---');
assert(getDaysInMonth(2026, 2) === 28, 'February 2026 has exactly 28 days (non-leap year)');
assert(getFirstDayOfWeek(2026, 1) === 4, 'January 1, 2026 is Thursday (day index 4)');
assert(getFirstDayOfWeek(2026, 12) === 2, 'December 1, 2026 is Tuesday (day index 2)');

// 4. Verification of Day Info Helper (Distinguishes Green Holiday vs Amber Festival vs Working Day)
console.log('\n--- Criterion 4: getDayCalendarInfo Status Distinction ---');
const holidayDayInfo = getDayCalendarInfo('2026-01-26');
assert(holidayDayInfo.statusType === 'company-holiday', '2026-01-26 (Republic Day) statusType is company-holiday');
assert(holidayDayInfo.isCompanyHoliday === true, '2026-01-26 isCompanyHoliday is true');

const festivalDayInfo = getDayCalendarInfo('2026-01-14');
assert(festivalDayInfo.statusType === 'festival-event', '2026-01-14 (Makar Sankranti) statusType is festival-event');
assert(festivalDayInfo.isCompanyHoliday === false, '2026-01-14 isCompanyHoliday is false (Working Day)');

const regularDayInfo = getDayCalendarInfo('2026-02-10');
assert(regularDayInfo.statusType === 'regular', '2026-02-10 statusType is regular (Standard Working Day)');
assert(regularDayInfo.isCompanyHoliday === false, '2026-02-10 isCompanyHoliday is false');

// 5. Month Filtering and Upcoming Events
console.log('\n--- Criterion 5: Month-Based & Upcoming Events Lookup ---');
const janEvents = getEventsForMonth(1, 2026);
assert(janEvents.length >= 10, `January has at least 10 events (found ${janEvents.length})`);

const hinduEvents = getEventsForMonth(11, 2026, 'Hindu');
assert(hinduEvents.length >= 7, `November has at least 7 Hindu festivals (found ${hinduEvents.length})`);

const upcomingCompany = getUpcomingHolidays('2026-08-01', 5);
assert(upcomingCompany.length === 5, 'Upcoming company holidays returns 5 items');
assert(upcomingCompany[0].date === '2026-08-15', 'First upcoming holiday after 2026-08-01 is Independence Day (2026-08-15)');

console.log(`\n========================================`);
console.log(`TEST SUMMARY: ${passedTests} / ${totalTests} assertions passed.`);
console.log(`========================================\n`);

if (passedTests === totalTests) {
    console.log('ALL 2026 INDIAN CALENDAR & COMPANY HOLIDAY CRITERIA PASSED!');
} else {
    process.exit(1);
}
