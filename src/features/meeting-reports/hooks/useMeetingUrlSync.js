import { useEffect, useCallback } from 'react';
import { formatDateDDMMYYYY, normalizeDateToYYYYMMDD } from '../utils/meetingDateUtils.js';

/**
 * Custom hook to synchronize meeting selection, search query, and tabs with URL query params
 */
export function useMeetingUrlSync({
    searchQuery,
    setSearchQuery,
    selectedMeetingMeta,
    setSelectedMeetingMeta,
    activeDashboardTab,
    setActiveDashboardTab,
    searchIndex
}) {
    // 1. Read initial URL query on mount and on popstate (browser back/forward)
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleUrlChange = () => {
            const params = new URLSearchParams(window.location.search);
            const meetingParam = params.get('meeting') || params.get('date');
            const searchParam = params.get('search');
            const tabParam = params.get('tab');

            if (tabParam === 'calendar' || tabParam === 'meetings') {
                setActiveDashboardTab(tabParam);
            }

            if (searchParam && setSearchQuery) {
                setSearchQuery(searchParam);
            }

            if (meetingParam) {
                const isoDate = normalizeDateToYYYYMMDD(meetingParam);
                if (isoDate) {
                    // Try finding in searchIndex if loaded
                    const found = searchIndex.find(m => m.date === isoDate || m.id === `meet-${isoDate}`);
                    if (found) {
                        setSelectedMeetingMeta(found);
                    } else {
                        setSelectedMeetingMeta({
                            id: `meet-${isoDate}`,
                            date: isoDate,
                            dateDisplay: formatDateDDMMYYYY(isoDate),
                            dateFormatted: formatDateDDMMYYYY(isoDate),
                            title: formatDateDDMMYYYY(isoDate)
                        });
                    }
                }
            } else if (!meetingParam && selectedMeetingMeta) {
                // If URL cleared meeting param, clear selection
                setSelectedMeetingMeta(null);
            }
        };

        handleUrlChange();
        window.addEventListener('popstate', handleUrlChange);
        return () => window.removeEventListener('popstate', handleUrlChange);
    }, [searchIndex]);

    // 2. Synchronize URL when selectedMeetingMeta changes
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const url = new URL(window.location.href);
        const currentParam = url.searchParams.get('date') || url.searchParams.get('meeting');

        if (selectedMeetingMeta) {
            const dateStr = formatDateDDMMYYYY(selectedMeetingMeta.date || selectedMeetingMeta.dateDisplay || selectedMeetingMeta.title);
            if (currentParam !== dateStr && currentParam !== selectedMeetingMeta.date) {
                url.searchParams.set('date', selectedMeetingMeta.date || dateStr);
                url.searchParams.delete('meeting');
                window.history.pushState({}, '', url.toString());
            }
        } else if (currentParam) {
            url.searchParams.delete('date');
            url.searchParams.delete('meeting');
            window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
        }
    }, [selectedMeetingMeta]);

    // 3. Synchronize URL when search query changes (debounced by caller or when cleared)
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const url = new URL(window.location.href);
        const currentSearch = url.searchParams.get('search') || '';

        if (searchQuery && searchQuery.trim() !== currentSearch) {
            url.searchParams.set('search', searchQuery.trim());
            window.history.replaceState({}, '', url.toString());
        } else if (!searchQuery && currentSearch) {
            url.searchParams.delete('search');
            window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
        }
    }, [searchQuery]);

    // 4. Synchronize URL when active tab changes
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const url = new URL(window.location.href);
        if (activeDashboardTab === 'calendar') {
            url.searchParams.set('tab', 'calendar');
            window.history.replaceState({}, '', url.toString());
        } else if (url.searchParams.has('tab')) {
            url.searchParams.delete('tab');
            window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
        }
    }, [activeDashboardTab]);
}
