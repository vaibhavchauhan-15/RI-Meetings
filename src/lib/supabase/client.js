/**
 * Reach International Operations - Supabase Client Factory
 * 
 * Secure, clean Supabase client initialization using validated environment variables.
 * Contains ZERO hardcoded secret fallbacks.
 */

import { createClient } from '@supabase/supabase-js';
import { env, validateClientEnv } from '../config/env.js';

// Validate configuration on initialization
validateClientEnv();

const supabaseUrl = env.VITE_SUPABASE_URL || (typeof process !== 'undefined' ? process.env.SUPABASE_URL : '') || 'https://placeholder.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 
    env.VITE_SUPABASE_PUBLISHABLE_KEY || 
    (typeof process !== 'undefined' ? (process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY) : '') ||
    'anon-key-placeholder';

if (!env.VITE_SUPABASE_ANON_KEY && !env.VITE_SUPABASE_PUBLISHABLE_KEY) {
    if (env.IS_DEV) {
        console.warn('[Supabase Client] Missing Supabase Anon Key in environment.');
    }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true
    }
});

/**
 * Health check helper to verify Supabase connectivity
 * @returns {Promise<boolean>}
 */
export async function checkSupabaseHealth() {
    try {
        const { error } = await supabase
            .from('meetings')
            .select('*', { count: 'exact', head: true });
        return !error;
    } catch {
        return false;
    }
}
