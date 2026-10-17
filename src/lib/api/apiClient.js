/**
 * Reach International Operations - Scalable API Client Wrapper
 * 
 * Standardizes all Supabase data interactions with unified error trapping,
 * response envelope consistency, and health checking.
 */

import { supabase, checkSupabaseHealth } from '../supabase/client.js';
import { DatabaseError } from '../errors/AppError.js';

/**
 * Standard API Result Envelope
 * @template T
 * @typedef {Object} ApiResponse
 * @property {T|null} data
 * @property {string|null} error
 * @property {boolean} success
 * @property {number} [count]
 */

/**
 * Executes a Supabase query with centralized error wrapping
 * @param {Promise<{ data: any, error: any, count?: number }>} queryPromise 
 * @param {string} [contextMessage='Database operation failed']
 * @returns {Promise<ApiResponse<any>>}
 */
export async function executeQuery(queryPromise, contextMessage = 'Database operation failed') {
    try {
        const { data, error, count } = await queryPromise;
        if (error) {
            console.error(`[API Client Error] ${contextMessage}:`, error);
            return {
                data: null,
                error: error.message || contextMessage,
                success: false,
                count: 0
            };
        }
        return {
            data,
            error: null,
            success: true,
            count: count ?? (Array.isArray(data) ? data.length : 1)
        };
    } catch (err) {
        console.error(`[API Client Exception] ${contextMessage}:`, err);
        return {
            data: null,
            error: err instanceof Error ? err.message : contextMessage,
            success: false,
            count: 0
        };
    }
}

export { supabase, checkSupabaseHealth };
