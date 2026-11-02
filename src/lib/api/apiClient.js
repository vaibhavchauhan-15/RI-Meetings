/**
 * Reach International Operations - Scalable API Client Wrapper
 * 
 * Standardizes all Supabase data interactions with unified error normalization,
 * typed response envelope consistency, health checking, and automatic interceptors for:
 * - 401 Session Expiration (emits authEvents 'session_expired')
 * - 403 Permission Denied (emits authEvents 'permission_denied')
 * - >5000ms Slow Request Threshold (emits networkEvents 'slow_network')
 */

import { supabase, checkSupabaseHealth } from '../supabase/client.js';
import { AppError, normalizeError } from '../errors/AppError.js';
import { authEvents, networkEvents } from '../events/authEvents.js';

export const SLOW_REQUEST_THRESHOLD_MS = 5000;

/**
 * Standard API Result Envelope
 * @template T
 * @typedef {Object} ApiResponse
 * @property {T|null} data
 * @property {AppError|null} error
 * @property {boolean} ok
 * @property {boolean} success
 * @property {number} [count]
 * @property {number} [durationMs]
 */

/**
 * Executes a Supabase query with centralized error wrapping, latency tracking, and auth interception.
 * @param {Promise<{ data: any, error: any, count?: number }>} queryPromise 
 * @param {string} [contextMessage='Database operation failed']
 * @param {Object} [options]
 * @param {number} [options.timeout=5000]
 * @param {AbortSignal} [options.signal]
 * @returns {Promise<ApiResponse<any>>}
 */
export async function executeQuery(queryPromise, contextMessage = 'Database operation failed', options = {}) {
    const startTime = Date.now();
    let isSlow = false;
    const threshold = options.timeout || SLOW_REQUEST_THRESHOLD_MS;

    // Start a timer for slow network notification
    const slowTimer = setTimeout(() => {
        isSlow = true;
        networkEvents.emit('slow_network', {
            context: contextMessage,
            thresholdMs: threshold,
            timestamp: Date.now()
        });
    }, threshold);

    try {
        const { data, error, count } = await queryPromise;
        clearTimeout(slowTimer);
        const durationMs = Date.now() - startTime;

        if (isSlow) {
            networkEvents.emit('slow_network_recovered', {
                context: contextMessage,
                durationMs
            });
        }

        if (error) {
            console.error(`[API Client Error] ${contextMessage}:`, error);
            const normalized = normalizeError(error, contextMessage);

            // Intercept HTTP 401 Unauthorized / Token Expiration
            if (normalized.status === 401 || normalized.code === 'AUTH_EXPIRED') {
                authEvents.emit('session_expired', {
                    error: normalized,
                    context: contextMessage,
                    returnTo: typeof window !== 'undefined' ? window.location.href : '/'
                });
            }

            // Intercept HTTP 403 Forbidden / Permission Denied
            if (normalized.status === 403 || normalized.code === 'PERMISSION_DENIED') {
                authEvents.emit('permission_denied', {
                    error: normalized,
                    context: contextMessage,
                    returnTo: typeof window !== 'undefined' ? window.location.href : '/'
                });
            }

            return {
                ok: false,
                success: false,
                data: null,
                error: normalized,
                count: 0,
                durationMs
            };
        }

        return {
            ok: true,
            success: true,
            data,
            error: null,
            count: count ?? (Array.isArray(data) ? data.length : 1),
            durationMs
        };
    } catch (err) {
        clearTimeout(slowTimer);
        const durationMs = Date.now() - startTime;
        console.error(`[API Client Exception] ${contextMessage}:`, err);

        const normalized = normalizeError(err, contextMessage);

        if (isSlow) {
            networkEvents.emit('slow_network_recovered', {
                context: contextMessage,
                durationMs
            });
        }

        return {
            ok: false,
            success: false,
            data: null,
            error: normalized,
            count: 0,
            durationMs
        };
    }
}

export { supabase, checkSupabaseHealth, authEvents, networkEvents };
export default executeQuery;
