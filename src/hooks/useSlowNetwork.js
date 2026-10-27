import { useState, useEffect, useCallback, useRef } from 'react';
import { networkEvents } from '../lib/events/authEvents.js';

/**
 * Reach International Operations - useSlowNetwork Hook
 * 
 * Monitors connection speed using:
 * 1. Network Information API (navigator.connection.effectiveType === '2g' | 'slow-2g')
 * 2. Active API request latency (>5000ms threshold from apiClient)
 */
export function useSlowNetwork({ thresholdMs = 5000 } = {}) {
    const [isSlow, setIsSlow] = useState(false);
    const [slowReason, setSlowReason] = useState(null); // 'api_latency' | 'hardware_2g' | 'data_saver'
    const abortControllerRef = useRef(null);

    // 1. Inspect Network Information API if available in browser
    useEffect(() => {
        if (typeof navigator === 'undefined') return;

        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (!connection) return;

        const checkConnection = () => {
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                setIsSlow(true);
                setSlowReason('hardware_2g');
            } else if (connection.saveData) {
                setIsSlow(true);
                setSlowReason('data_saver');
            } else if (slowReason === 'hardware_2g' || slowReason === 'data_saver') {
                setIsSlow(false);
                setSlowReason(null);
            }
        };

        checkConnection();
        connection.addEventListener?.('change', checkConnection);
        return () => {
            connection.removeEventListener?.('change', checkConnection);
        };
    }, [slowReason]);

    // 2. Listen to active query latency from apiClient
    useEffect(() => {
        const unsubscribeSlow = networkEvents.on('slow_network', (payload) => {
            setIsSlow(true);
            setSlowReason('api_latency');
        });

        const unsubscribeRecovered = networkEvents.on('slow_network_recovered', () => {
            if (slowReason === 'api_latency') {
                setIsSlow(false);
                setSlowReason(null);
            }
        });

        return () => {
            unsubscribeSlow();
            unsubscribeRecovered();
        };
    }, [slowReason]);

    const dismissSlowWarning = useCallback(() => {
        setIsSlow(false);
        setSlowReason(null);
    }, []);

    const createAbortSignal = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        return abortControllerRef.current.signal;
    }, []);

    const cancelActiveRequest = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        dismissSlowWarning();
    }, [dismissSlowWarning]);

    return {
        isSlow,
        slowReason,
        dismissSlowWarning,
        createAbortSignal,
        cancelActiveRequest
    };
}

export default useSlowNetwork;
