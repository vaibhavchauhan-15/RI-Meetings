import { useState, useEffect, useCallback } from 'react';
import { checkSupabaseHealth } from '../lib/supabase/client.js';

/**
 * Reach International Operations - useNetworkStatus Hook
 * 
 * Accurately tracks online/offline state across web & mobile viewports.
 * Listens to native browser events and provides active connectivity re-check.
 */
export function useNetworkStatus() {
    const [isOnline, setIsOnline] = useState(() => {
        return typeof navigator !== 'undefined' ? navigator.onLine : true;
    });
    const [wasOffline, setWasOffline] = useState(false);
    const [isChecking, setIsChecking] = useState(false);

    const checkConnectivity = useCallback(async () => {
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
            setIsOnline(false);
            return false;
        }

        setIsChecking(true);
        try {
            // Verify real internet connectivity by reaching the database
            const healthy = await checkSupabaseHealth();
            setIsOnline(healthy);
            if (healthy && wasOffline) {
                // If we recovered from offline state
                setWasOffline(true);
            }
            return healthy;
        } catch {
            setIsOnline(false);
            return false;
        } finally {
            setIsChecking(false);
        }
    }, [wasOffline]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleOnline = () => {
            // Re-verify with actual ping to guard against captive portals
            checkConnectivity().then(online => {
                if (online) {
                    setWasOffline(true);
                    // Clear the "reconnected" badge after 4 seconds
                    setTimeout(() => setWasOffline(false), 4000);
                }
            });
        };

        const handleOffline = () => {
            setIsOnline(false);
            setWasOffline(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [checkConnectivity]);

    return {
        isOnline,
        wasOffline,
        isChecking,
        reconnect: checkConnectivity
    };
}

export default useNetworkStatus;
