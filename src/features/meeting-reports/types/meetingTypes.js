/**
 * Reach International Operations - Meeting Feature Type Definitions
 * 
 * Provides type contracts for daily operational meetings, single-machine
 * fleet breakdown reports, parts inventory, policy directives, and actions.
 */

/**
 * @typedef {Object} BreakdownMachine
 * @property {string} site - Site or plant location
 * @property {string} model - Specific equipment model (e.g. "JLG 800AJ", "Genie Z-45")
 * @property {string} serialNumber - Equipment unit or serial number
 * @property {string} issue - Concise 1-line defect description
 * @property {string} action - Assigned technician and maintenance action
 * @property {string} [logistics] - Spare parts dispatch or courier status
 * @property {string} [clarification] - Commercial or operational context
 * @property {string} [pendingIssue] - Immediate roadblock or next milestone
 * @property {string} [status] - Current machine operational status
 */

/**
 * @typedef {Object} MeetingPart
 * @property {string} part - Name and part number of component
 * @property {string} context - Equipment and site context
 * @property {string} statusNextSteps - Procurement, dispatch, or fitting status
 */

/**
 * @typedef {Object} MeetingDirective
 * @property {string} title - Directive policy topic
 * @property {string[]} points - Specific concise operational rules
 */

/**
 * @typedef {Object} MeetingActionItem
 * @property {string} person - Assignee name
 * @property {string} task - Concrete task and deadline
 */

/**
 * @typedef {Object} MeetingSummaryMeta
 * @property {string} id - Meeting identifier (e.g. "meet-2026-10-16")
 * @property {string} date - ISO date string ("YYYY-MM-DD")
 * @property {string} dateDisplay - Formatted date ("DD-MM-YYYY")
 * @property {string} dateFormatted - Formatted date ("DD-MM-YYYY")
 * @property {string} title - Meeting title or date
 * @property {string} focus - High-level meeting focus summary
 * @property {boolean} isHoliday - True if company holiday
 * @property {string} holidayName - Name of company holiday if applicable
 * @property {boolean} noMeetingHeld - True if office open but no formal meeting
 * @property {boolean} notRecorded - True if meeting held but not recorded
 * @property {number} breakdownCount - Count of machine breakdown cards
 * @property {number} partsCount - Count of parts items
 * @property {number} directivesCount - Count of directive items
 * @property {number} actionItemsCount - Count of action items
 */

/**
 * @typedef {MeetingSummaryMeta & {
 *   breakdowns: BreakdownMachine[],
 *   parts: MeetingPart[],
 *   directives: MeetingDirective[],
 *   actionItems: MeetingActionItem[]
 * }} MeetingDetail
 */
