/**
 * Reach International Operations - Holidays Feature Module
 * 
 * Public API for the 2026 Indian & Company Holiday Calendar feature.
 */

export { default as HolidayCalendar } from './components/HolidayCalendar.jsx';
export { default as CalendarGrid } from './components/CalendarGrid.jsx';
export { default as CalendarHeader } from './components/CalendarHeader.jsx';
export { default as HolidayDetails } from './components/HolidayDetails.jsx';
export { default as UpcomingHolidays } from './components/UpcomingHolidays.jsx';

export { useHolidayCalendar } from './hooks/useHolidayCalendar.js';

export * from './services/holidayService.js';
export * from './utils/holidayDateUtils.js';
export * from './data/companyHolidays2026.js';
