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

export const env = Object.freeze({
    // Supabase Client Settings (Public Anon Key only)
    VITE_SUPABASE_URL: getEnvVariable('VITE_SUPABASE_URL', getEnvVariable('SUPABASE_URL', '')),
    VITE_SUPABASE_ANON_KEY: getEnvVariable('VITE_SUPABASE_ANON_KEY', ''),
    VITE_SUPABASE_PUBLISHABLE_KEY: getEnvVariable('VITE_SUPABASE_PUBLISHABLE_KEY', ''),

    // Environment info
    NODE_ENV: getEnvVariable('MODE', getEnvVariable('NODE_ENV', 'production')),
    IS_DEV: getEnvVariable('DEV', false) || getEnvVariable('NODE_ENV') === 'development',
    IS_PROD: getEnvVariable('PROD', true) || getEnvVariable('NODE_ENV') === 'production',
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
