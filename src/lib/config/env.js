/**
 * Reach International Operations - Validated Application Environment Configuration
 * 
 * Provides safe, validated access to client-side environment variables.
 * In Vite browser runtime: uses import.meta.env
 * In Node.js CLI runtime: automatically reads .env if process.env is unpopulated
 */

let nodeEnvCache = null;

function loadNodeEnvFile() {
    if (nodeEnvCache !== null) return nodeEnvCache;
    nodeEnvCache = {};
    if (typeof process !== 'undefined' && typeof process.versions?.node !== 'undefined') {
        try {
            // Synchronously read .env for Node.js scripts if available
            const fs = await_or_require_fs();
            if (fs && fs.existsSync) {
                const path = require_path();
                const envPath = path.resolve(process.cwd(), '.env');
                if (fs.existsSync(envPath)) {
                    const content = fs.readFileSync(envPath, 'utf8');
                    for (const line of content.split('\n')) {
                        const trimmed = line.trim();
                        if (!trimmed || trimmed.startsWith('#')) continue;
                        const [k, ...v] = trimmed.split('=');
                        if (k && v.length) nodeEnvCache[k.trim()] = v.join('=').trim();
                    }
                }
            }
        } catch {
            // Ignore in non-node or restricted environments
        }
    }
    return nodeEnvCache;
}

function await_or_require_fs() {
    try {
        if (typeof process !== 'undefined' && process.versions?.node) {
            // Avoid bundling fs in Vite by referencing dynamic global
            return globalThis?.process?.getBuiltinModule?.('fs');
        }
    } catch {}
    return null;
}

function require_path() {
    try {
        if (typeof process !== 'undefined' && process.versions?.node) {
            return globalThis?.process?.getBuiltinModule?.('path');
        }
    } catch {}
    return { resolve: (...args) => args.join('/') };
}

export const DEFAULT_SUPABASE_URL = 'https://mwtfftedrtxiegawgssf.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dGZmdGVkcnR4aWVnYXdnc3NmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyNTY4NDMsImV4cCI6MjEwNjgzMjg0M30.yF6ql4PUqURv-ahh7MHGwsdG6rvxah_lfLmSKy7fOFo';

function getEnvVariable(key, fallback = undefined) {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key] !== undefined) {
        return import.meta.env[key];
    }
    if (typeof process !== 'undefined' && process.env && process.env[key] !== undefined) {
        return process.env[key];
    }
    const nodeFileEnv = loadNodeEnvFile();
    if (nodeFileEnv && nodeFileEnv[key] !== undefined) {
        return nodeFileEnv[key];
    }
    return fallback;
}

// Statically read Vite environment variables with public production fallback
const resolvedSupabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
    getEnvVariable('VITE_SUPABASE_URL') ||
    getEnvVariable('SUPABASE_URL') ||
    DEFAULT_SUPABASE_URL;

const resolvedSupabaseAnonKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY) ||
    getEnvVariable('VITE_SUPABASE_ANON_KEY') ||
    getEnvVariable('VITE_SUPABASE_PUBLISHABLE_KEY') ||
    getEnvVariable('SUPABASE_ANON_KEY') ||
    DEFAULT_SUPABASE_ANON_KEY;

export const env = Object.freeze({
    // Supabase Client Settings (Public Anon Key only)
    VITE_SUPABASE_URL: resolvedSupabaseUrl,
    VITE_SUPABASE_ANON_KEY: resolvedSupabaseAnonKey,
    VITE_SUPABASE_PUBLISHABLE_KEY: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY) || getEnvVariable('VITE_SUPABASE_PUBLISHABLE_KEY', ''),

    // Environment info
    NODE_ENV: (typeof import.meta !== 'undefined' && import.meta.env?.MODE) || getEnvVariable('MODE', getEnvVariable('NODE_ENV', 'production')),
    IS_DEV: (typeof import.meta !== 'undefined' && Boolean(import.meta.env?.DEV)) || getEnvVariable('DEV', false) || getEnvVariable('NODE_ENV') === 'development',
    IS_PROD: (typeof import.meta !== 'undefined' && Boolean(import.meta.env?.PROD)) || getEnvVariable('PROD', true) || getEnvVariable('NODE_ENV') === 'production',
});

/**
 * Validate that mandatory client environment variables are present.
 */
export function validateClientEnv() {
    const isNode = typeof process !== 'undefined' && process.versions?.node;
    const missing = [];
    if (!env.VITE_SUPABASE_URL) missing.push('VITE_SUPABASE_URL');
    if (!env.VITE_SUPABASE_ANON_KEY && !env.VITE_SUPABASE_PUBLISHABLE_KEY) {
        missing.push('VITE_SUPABASE_ANON_KEY');
    }

    if (missing.length > 0 && !isNode) {
        const errorMsg = `[Config Error] Missing mandatory client environment variable(s): ${missing.join(', ')}. ` +
            `Please configure them in your .env or deployment environment.`;
        console.error(errorMsg);
        if (env.IS_DEV) {
            console.warn('Falling back to local development environment defaults where available.');
        }
    }
}
