/**
 * Reach International Operations - Meeting & Breakdown Validation Schemas
 * 
 * Strict enforcement of business rules defined in AGENTS.md:
 * 1. Strictly ONE MACHINE per breakdown record (no bundling).
 * 2. Concise single-line informative fields for issue, action, logistics, clarification, pending, status.
 * 3. Valid date formats and mandatory operational fields.
 */

import { isValidISODate, isNonEmptyString, assertValid } from '../../../lib/validation/validator.js';
import { ValidationError } from '../../../lib/errors/AppError.js';

/**
 * Validates a single breakdown machine object
 * @param {Object} item 
 * @param {number} index
 * @returns {Object} Validated & sanitized item
 */
export function validateBreakdownMachine(item, index = 0) {
    assertValid(item && typeof item === 'object', `Breakdown item at index ${index} must be an object`, 'breakdown');
    
    // Strict One Machine rule: check for bundling red flags
    const model = String(item.model || item.machine_model || '').trim();
    const serial = String(item.serialNumber || item.serial_number || '').trim();

    assertValid(model.length > 0, `Breakdown at index ${index} is missing machine model`, `breakdowns[${index}].model`);

    // Flag composite bundling (e.g., "S-65, Z-45" or "1045, 1046")
    if (model.includes(',') && !model.toLowerCase().includes('ltd')) {
        throw new ValidationError(
            `Breakdown item at index ${index} violates the ONE MACHINE rule by bundling multiple models: "${model}". Please unbundle into separate cards.`,
            { fields: { [`breakdowns[${index}].model`]: model } }
        );
    }

    if (serial.includes(',') || serial.includes(' & ')) {
        throw new ValidationError(
            `Breakdown item at index ${index} bundles multiple serial numbers: "${serial}". Strictly ONE MACHINE per card is required.`,
            { fields: { [`breakdowns[${index}].serialNumber`]: serial } }
        );
    }

    return {
        site: String(item.site || item.site_location || item.location || 'Site').trim(),
        model: model,
        serialNumber: serial,
        issue: String(item.issue || item.description || item.short_issue || '').replace(/[\r\n]+/g, ' ').trim(),
        action: String(item.action || item.short_action || '').replace(/[\r\n]+/g, ' ').trim(),
        logistics: String(item.logistics || item.short_logistics || '').replace(/[\r\n]+/g, ' ').trim(),
        clarification: String(item.clarification || item.short_clarification || '').replace(/[\r\n]+/g, ' ').trim(),
        pendingIssue: String(item.pendingIssue || item.pending_issue || item.short_pending || '').replace(/[\r\n]+/g, ' ').trim(),
        status: String(item.status || item.short_status || 'Active Breakdown').replace(/[\r\n]+/g, ' ').trim()
    };
}

/**
 * Validates an entire meeting report data structure
 * @param {Object} meeting 
 * @returns {Object} Validated meeting data
 */
export function validateMeetingData(meeting) {
    assertValid(meeting && typeof meeting === 'object', 'Meeting payload must be an object', 'meeting');
    
    const date = String(meeting.date || meeting.id?.replace(/^meet-/, '') || '').trim();
    assertValid(isValidISODate(date), `Invalid meeting ISO date: "${date}". Expected format: YYYY-MM-DD`, 'date');

    const breakdowns = Array.isArray(meeting.breakdowns) 
        ? meeting.breakdowns.map((b, i) => validateBreakdownMachine(b, i))
        : [];

    return {
        id: meeting.id || `meet-${date}`,
        date,
        title: meeting.title || date,
        focus: String(meeting.focus || '').replace(/[\r\n]+/g, ' ').trim(),
        isHoliday: Boolean(meeting.isHoliday || meeting.is_holiday),
        holidayName: meeting.holidayName || meeting.holiday_name || '',
        noMeetingHeld: Boolean(meeting.noMeetingHeld || meeting.no_meeting_held),
        notRecorded: Boolean(meeting.notRecorded || meeting.not_recorded),
        breakdowns,
        parts: Array.isArray(meeting.parts) ? meeting.parts : [],
        directives: Array.isArray(meeting.directives) ? meeting.directives : [],
        actionItems: Array.isArray(meeting.actionItems) ? meeting.actionItems : []
    };
}
