/**
 * Reach International Operations - Holiday & Calendar Event Type Definitions
 * 
 * Provides type contracts for 2026 Indian festivals, company holidays, and calendar models.
 */

/**
 * @typedef {'National'|'Hindu'|'Islamic'|'Sikh'|'Christian'|'Jain'|'Buddhist'|'Parsi'|'Cultural'} EventCategory
 */

/**
 * @typedef {Object} CalendarEvent
 * @property {string} id - Unique identifier (e.g. 'event-2026-01-01')
 * @property {string} date - ISO date string ('YYYY-MM-DD')
 * @property {string} name - Event or festival title
 * @property {string} [subLabel] - Secondary descriptive title
 * @property {string} dayOfWeek - Name of day (e.g. 'Thursday')
 * @property {number} month - Month number (1-12)
 * @property {number} day - Day of month (1-31)
 * @property {EventCategory} category - Religious / civic classification
 * @property {string} religion - Specific faith classification
 * @property {string} icon - Emoji or icon representation
 * @property {boolean} isCompanyHoliday - True if Reach International office/operations closed
 * @property {string} [holidayKey] - Slug identifier if company holiday
 * @property {string} type - Descriptive type badge label
 * @property {string} notes - Cultural / operational context note
 * @property {boolean} [isGazetted] - True if gazetted national holiday
 */

/**
 * @typedef {Object} CompanyHoliday
 * @property {string} id
 * @property {string} date
 * @property {string} name
 * @property {string} dayOfWeek
 * @property {number} month
 * @property {number} day
 * @property {boolean} isCompanyHoliday
 * @property {string} type
 * @property {string} notes
 */

/**
 * @typedef {Object} DayCalendarInfo
 * @property {string} date
 * @property {boolean} isCompanyHoliday
 * @property {CompanyHoliday|null} companyHoliday
 * @property {CalendarEvent[]} events
 * @property {boolean} hasEvents
 * @property {'regular'|'company-holiday'|'festival-event'} statusType
 * @property {string|null} primaryName
 */
