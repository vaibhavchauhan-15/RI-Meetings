/**
 * Reach International Operations - Centralized Application Errors
 * 
 * Standardized error classes and utilities to ensure consistent,
 * user-friendly error handling across services and UI components.
 */

export class AppError extends Error {
    constructor(message, { code = 'UNKNOWN_ERROR', userMessage, cause = null } = {}) {
        super(message);
        this.name = 'AppError';
        this.code = code;
        this.userMessage = userMessage || message;
        this.cause = cause;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AppError);
        }
    }
}

export class DatabaseError extends AppError {
    constructor(message, { cause, userMessage = 'Unable to fetch operational data. Please check your network connection.' } = {}) {
        super(message, { code: 'DATABASE_ERROR', userMessage, cause });
        this.name = 'DatabaseError';
    }
}

export class NotFoundError extends AppError {
    constructor(resource = 'Resource', identifier = '') {
        const idStr = identifier ? ` (${identifier})` : '';
        super(`${resource}${idStr} not found`, {
            code: 'NOT_FOUND',
            userMessage: `${resource} not found. It may have been moved or archived.`
        });
        this.name = 'NotFoundError';
    }
}

export class ValidationError extends AppError {
    constructor(message, { fields = {} } = {}) {
        super(message, {
            code: 'VALIDATION_ERROR',
            userMessage: message
        });
        this.name = 'ValidationError';
        this.fields = fields;
    }
}

export class ExportError extends AppError {
    constructor(message, { cause } = {}) {
        super(message, {
            code: 'EXPORT_ERROR',
            userMessage: 'Failed to generate Excel export file. Please try again.',
            cause
        });
        this.name = 'ExportError';
    }
}

/**
 * Extracts a safe, user-friendly message from an unknown error
 * @param {unknown} error 
 * @param {string} fallbackMessage 
 * @returns {string} Safe display string
 */
export function getUserErrorMessage(error, fallbackMessage = 'An unexpected error occurred. Please try again.') {
    if (!error) return fallbackMessage;
    if (error instanceof AppError && error.userMessage) {
        return error.userMessage;
    }
    if (typeof error === 'string') {
        return error;
    }
    if (error instanceof Error && error.message) {
        // Suppress technical internal errors from leaking
        if (error.message.includes('fetch') || error.message.includes('network')) {
            return 'Network connectivity issue. Please verify your connection.';
        }
        return error.message;
    }
    return fallbackMessage;
}
