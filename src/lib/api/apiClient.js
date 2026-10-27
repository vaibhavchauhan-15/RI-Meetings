/**
 * Reach International Operations - Scalable API Client Wrapper
 * 
 * Standardizes all Supabase data interactions with unified error trapping,
 * response envelope consistency, health checking, and automatic interceptors for:
 * - 401 Session Expiration (emits authEvents 'session_expired')
 * - 403 Permission Denied (emits authEvents 'permission_denied')
 * - >5000ms Slow Request Threshold (emits networkEvents 'slow_network')
 */

import { supabase, checkSupabaseHealth } from '../supabase/client.js';
import { DatabaseError } from '../errors/AppError.js';
import { authEvents, networkEvents } from '../events/authEvents.js';

/**
 * Standard API Result Envelope
 * @template T
 * @typedef {Object} ApiResponse
 * @property {T|null} data
 * @property {string|null} error
 * @property {boolean} success
 * @property {number} [count]
 * @property {number} [durationMs]
 */

const SLOW_REQUEST_THRESHOLD_MS = 5000;
let activeSlowTimeout = null;

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

    // Start a timer for slow network notification
    const slowTimer = setTimeout(() => {
        isSlow = true;
        networkEvents.emit('slow_network', {
            context: contextMessage,
            thresholdMs: SLOW_REQUEST_THRESHOLD_MS,
            timestamp: Date.now()
        });
    }, options.timeout || SLOW_REQUEST_THRESHOLD_MS);

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

            // Intercept HTTP 401 Unauthorized / Token Expiration
            const is401 = error.code === 'PGRST301' || 
                          error.status === 401 || 
                          (error.message && (
                              error.message.toLowerCase().includes('jwt expired') ||
                              error.message.toLowerCase().includes('token is expired') ||
                              error.message.toLowerCase().includes('invalid token')
                          ));

            if (is401) {
                authEvents.emit('session_expired', {
                    error,
                    context: contextMessage,
                    returnTo: typeof window !== 'undefined' ? window.location.href : '/'
                });
            }

            // Intercept HTTP 403 Forbidden / Permission Denied
            const is403 = error.code === '42501' || 
                          error.status === 403 || 
                          (error.message && (
                              error.message.toLowerCase().includes('permission denied') ||
                              error.message.toLowerCase().includes('access denied') ||
                              error.message.toLowerCase().includes('insufficient privileges')
                          ));

            if (is403) {
                authEvents.emit('permission_denied', {
                    error,
                    context: contextMessage,
                    returnTo: typeof window !== 'undefined' ? window.location.href : '/'
                });
            }

            return {
                data: null,
                error: error.message || contextMessage,
                success: false,
                count: 0,
                durationMs
            };
        }

        return {
            data,
            error: null,
            success: true,
            count: count ?? (Array.isArray(data) ? data.length : 1),
            durationMs
        };
    } catch (err) {
        clearTimeout(slowTimer);
        const durationMs = Date.now() - startTime;
        console.error(`[API Client Exception] ${contextMessage}:`, err);

        // Check if aborted by caller
        if (err?.name === 'AbortError') {
            return {
                data: null,
                error: 'Request was cancelled by user.',
                success: false,
                count: 0,
                durationMs
            };
        }

        return {
            data: null,
            error: err instanceof Error ? err.message : contextMessage,
            success: false,
            count: 0,
            durationMs
        };
    }
}

export { supabase, checkSupabaseHealth, authEvents, networkEvents };
