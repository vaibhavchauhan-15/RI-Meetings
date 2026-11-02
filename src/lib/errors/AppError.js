/**
 * Reach International Operations - Centralized Application Errors & Normalizer
 * 
 * Standardizes all error normalization into a typed AppError envelope:
 * { code, status, userMessage, retryable, cause }
 * 
 * Guarantees that raw SQL statements, internal Postgres schema info,
 * and database stack traces are NEVER leaked to the end user.
 */

import { STATE_MESSAGES } from '../constants/messages.js';

export class AppError extends Error {
    /**
     * @param {string} message - Technical error message (for logging)
     * @param {Object} [options]
     * @param {string} [options.code='UNKNOWN_ERROR'] - Machine-readable error code
     * @param {number} [options.status=500] - HTTP status code
     * @param {string} [options.userMessage] - Safe human-readable message for UI
     * @param {boolean} [options.retryable=false] - Whether the action can be retried immediately
     * @param {unknown} [options.cause=null] - Original underlying error
     */
    constructor(message, { 
        code = 'UNKNOWN_ERROR', 
        status = 500, 
        userMessage, 
        retryable = false, 
        cause = null 
    } = {}) {
        super(message);
        this.name = 'AppError';
        this.code = code;
        this.status = status;
        this.userMessage = userMessage || message;
        this.retryable = retryable;
        this.cause = cause;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AppError);
        }
    }
}

export class DatabaseError extends AppError {
    constructor(message, { cause, status = 500, userMessage = STATE_MESSAGES.error.databaseError, retryable = true } = {}) {
        super(message, { code: 'DATABASE_ERROR', status, userMessage, retryable, cause });
        this.name = 'DatabaseError';
    }
}

export class NotFoundError extends AppError {
    constructor(resource = 'Resource', identifier = '') {
        const idStr = identifier ? ` (${identifier})` : '';
        super(`${resource}${idStr} not found`, {
            code: 'NOT_FOUND',
            status: 404,
            userMessage: STATE_MESSAGES.error.notFoundMessage,
            retryable: false
        });
        this.name = 'NotFoundError';
    }
}

export class ValidationError extends AppError {
    constructor(message, { fields = {} } = {}) {
        super(message, {
            code: 'VALIDATION_ERROR',
            status: 422,
            userMessage: message,
            retryable: false
        });
        this.name = 'ValidationError';
        this.fields = fields;
    }
}

export class AuthError extends AppError {
    constructor(message = 'Session expired or invalid', { cause } = {}) {
        super(message, {
            code: 'AUTH_EXPIRED',
            status: 401,
            userMessage: STATE_MESSAGES.sessionExpired.description,
            retryable: true,
            cause
        });
        this.name = 'AuthError';
    }
}

export class PermissionError extends AppError {
    constructor(resource = 'this resource', { role = 'Supervisor', cause } = {}) {
        super(`Access forbidden: requires ${role} privileges`, {
            code: 'PERMISSION_DENIED',
            status: 403,
            userMessage: STATE_MESSAGES.forbidden.description(resource, role),
            retryable: false,
            cause
        });
        this.name = 'PermissionError';
    }
}

export class RateLimitError extends AppError {
    constructor(message = 'Too many requests', { cause } = {}) {
        super(message, {
            code: 'RATE_LIMIT_EXCEEDED',
            status: 429,
            userMessage: STATE_MESSAGES.error.rateLimitMessage,
            retryable: true,
            cause
        });
        this.name = 'RateLimitError';
    }
}

export class ExportError extends AppError {
    constructor(message, { cause } = {}) {
        super(message, {
            code: 'EXPORT_ERROR',
            status: 500,
            userMessage: 'Failed to generate Excel export file. Please try again.',
            retryable: true,
            cause
        });
        this.name = 'ExportError';
    }
}

/**
 * Normalizes any error (Postgres, Supabase, network, or JS Exception) into a typed AppError
 * @param {unknown} rawError 
 * @param {string} [context='An unexpected error occurred']
 * @returns {AppError}
 */
export function normalizeError(rawError, context = STATE_MESSAGES.error.defaultMessage) {
    if (!rawError) {
        return new AppError(context, { userMessage: context, status: 500 });
    }

    if (rawError instanceof AppError) {
        return rawError;
    }

    // Inspect error message for network/offline signatures upfront
    const rawMsg = (typeof rawError === 'object' && rawError !== null && 'message' in rawError)
        ? String(rawError.message)
        : String(rawError);

    if (/failed to fetch|network|offline|econnreset|econnrefused|etimedout|abort/i.test(rawMsg)) {
        return new AppError('Network connection lost or request aborted', {
            code: 'NETWORK_ERROR',
            status: 0,
            userMessage: STATE_MESSAGES.error.networkError || 'Network connectivity issue. Please verify your connection.',
            retryable: true,
            cause: rawError
        });
    }

    // Handle Supabase/PostgREST error objects
    if (typeof rawError === 'object' && rawError !== null) {
        const errObj = /** @type {any} */ (rawError);
        const code = errObj.code || 'API_ERROR';
        const status = Number(errObj.status) || 500;
        const rawMsg = errObj.message || errObj.error_description || String(rawError);

        // 401 Session Expiration / JWT Invalid
        if (code === 'PGRST301' || status === 401 || /jwt|token.*expired|invalid token/i.test(rawMsg)) {
            return new AuthError(rawMsg, { cause: rawError });
        }

        // 403 Forbidden / RLS Denial
        if (code === '42501' || status === 403 || /permission denied|access denied|insufficient/i.test(rawMsg)) {
            return new PermissionError('operational data', { cause: rawError });
        }

        // 404 Not Found
        if (code === 'PGRST116' || status === 404) {
            return new NotFoundError('Record', '');
        }

        // 429 Rate Limit
        if (status === 429 || /rate.*limit|too many requests/i.test(rawMsg)) {
            return new RateLimitError(rawMsg, { cause: rawError });
        }

        // 5xx Server Errors
        if (status >= 500) {
            return new DatabaseError(rawMsg, { 
                cause: rawError, 
                status, 
                userMessage: STATE_MESSAGES.error.serverErrorMessage,
                retryable: true 
            });
        }

        // Network connection issues
        if (/failed to fetch|fetch failed|network|offline|abort|econnreset/i.test(rawMsg)) {
            return new AppError('Network connection lost or request aborted', {
                code: 'NETWORK_ERROR',
                status: 0,
                userMessage: STATE_MESSAGES.error.networkError,
                retryable: true,
                cause: rawError
            });
        }

        return new AppError(rawMsg, {
            code: String(code),
            status,
            userMessage: context,
            retryable: status >= 500,
            cause: rawError
        });
    }

    if (rawError instanceof Error) {
        if (/failed to fetch|fetch failed|network|offline|econnreset/i.test(rawError.message)) {
            return new AppError(rawError.message, {
                code: 'NETWORK_ERROR',
                status: 0,
                userMessage: STATE_MESSAGES.error.networkError,
                retryable: true,
                cause: rawError
            });
        }
        return new AppError(rawError.message, {
            code: 'JAVASCRIPT_ERROR',
            status: 500,
            userMessage: context,
            retryable: true,
            cause: rawError
        });
    }

    return new AppError(String(rawError), {
        code: 'UNKNOWN_ERROR',
        status: 500,
        userMessage: context,
        retryable: true
    });
}

/**
 * Extracts a safe, user-friendly message for presentation
 * @param {unknown} error 
 * @param {string} [fallbackMessage]
 * @returns {string} Safe display string
 */
export function getUserErrorMessage(error, fallbackMessage = STATE_MESSAGES.error.defaultMessage) {
    if (!error) return fallbackMessage;
    const normalized = normalizeError(error, fallbackMessage);
    return normalized.userMessage || fallbackMessage;
}
