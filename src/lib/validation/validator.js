/**
 * Reach International Operations - Lightweight Validation Utilities
 * 
 * Production-ready runtime validation for API inputs, database models,
 * and meeting ingestion payloads without heavy external dependencies.
 */

import { ValidationError } from '../errors/AppError.js';

/**
 * Validates whether a value is a non-empty string
 */
export function isNonEmptyString(val) {
    return typeof val === 'string' && val.trim().length > 0;
}

/**
 * Validates ISO date format (YYYY-MM-DD)
 */
export function isValidISODate(val) {
    if (!isNonEmptyString(val)) return false;
    const match = val.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return false;
    const y = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    const d = parseInt(match[3], 10);
    if (m < 1 || m > 12) return false;
    const daysInMonth = new Date(y, m, 0).getDate();
    return d >= 1 && d <= daysInMonth;
}

/**
 * Checks if a string contains multiple line breaks (enforces 1-line rule)
 */
export function isSingleLine(val) {
    if (typeof val !== 'string') return true;
    return !/[\r\n]/.test(val);
}

/**
 * Asserts that a condition is truthy, otherwise throws ValidationError
 */
export function assertValid(condition, message, field = 'general') {
    if (!condition) {
        throw new ValidationError(message, { fields: { [field]: message } });
    }
}
