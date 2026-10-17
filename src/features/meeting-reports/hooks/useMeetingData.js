import { useState, useEffect, useCallback, useRef } from 'react';
import { 
    fetchYearsIndex, 
    fetchMonthIndex, 
    fetchMeetingDetail, 
    fetchSearchIndex,
    invalidateMeetingCache 
} from '../services/meetingService.js';
import { getUserErrorMessage } from '../../../lib/errors/AppError.js';

/**
 * Custom hook managing all meeting-related data fetching, caching, and state
 */
export function useMeetingData({ initialYear = '2026', initialMonth = '09' } = {}) {
    const [yearsData, setYearsData] = useState(null);
    const [selectedYear, setSelectedYear] = useState(initialYear);
    const [selectedMonth, setSelectedMonth] = useState(initialMonth);
    const [monthData, setMonthData] = useState(null);
    const [searchIndex, setSearchIndex] = useState([]);

    const [selectedMeetingMeta, setSelectedMeetingMeta] = useState(null);
    const [fullMeetingDetail, setFullMeetingDetail] = useState(null);

    const [isLoadingInitial, setIsLoadingInitial] = useState(true);
    const [isLoadingMonth, setIsLoadingMonth] = useState(false);
    const [isLoadingMeeting, setIsLoadingMeeting] = useState(false);
    const [error, setError] = useState(null);

    // Initial Load: Years Index & Search Index
    const loadInitialData = useCallback(async () => {
        setIsLoadingInitial(true);
        setError(null);
        try {
            const [years, searchIdx] = await Promise.all([
                fetchYearsIndex(),
                fetchSearchIndex()
            ]);

            setYearsData(years);
            setSearchIndex(searchIdx);

            if (years.latestYear) {
                setSelectedYear(years.latestYear);
            }
            if (years.latestMonth) {
                setSelectedMonth(years.latestMonth);
            }
        } catch (err) {
            console.error('[useMeetingData] Failed to load initial meeting indexes:', err);
            setError(getUserErrorMessage(err, 'Failed to connect to Reach database. Please refresh.'));
        } finally {
            setIsLoadingInitial(false);
        }
    }, []);

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    // Load Month Index when Year or Month changes
    useEffect(() => {
        let isMounted = true;
        if (!selectedYear || !selectedMonth) return;

        async function loadMonth() {
            setIsLoadingMonth(true);
            setError(null);
            try {
                const data = await fetchMonthIndex(selectedYear, selectedMonth);
                if (isMounted) {
                    setMonthData(data);
                }
            } catch (err) {
                console.error(`[useMeetingData] Failed to load month index for ${selectedYear}/${selectedMonth}:`, err);
                if (isMounted) {
                    setMonthData(null);
                    setError(getUserErrorMessage(err, `Unable to load meetings for ${selectedMonth}/${selectedYear}.`));
                }
            } finally {
                if (isMounted) {
                    setIsLoadingMonth(false);
                }
            }
        }

        loadMonth();

        return () => {
            isMounted = false;
        };
    }, [selectedYear, selectedMonth]);

    // Load Full Meeting Detail on-demand when selected
    useEffect(() => {
        let isMounted = true;
        if (!selectedMeetingMeta) {
            setFullMeetingDetail(null);
            return;
        }

        // If the object already contains the full document (breakdowns array)
        if (selectedMeetingMeta.breakdowns && selectedMeetingMeta.breakdowns.length > 0) {
            setFullMeetingDetail(selectedMeetingMeta);
            return;
        }

        async function loadMeeting() {
            setIsLoadingMeeting(true);
            setError(null);
            setFullMeetingDetail(null);
            try {
                const doc = await fetchMeetingDetail(selectedMeetingMeta.path || selectedMeetingMeta.date);
                if (isMounted) {
                    setFullMeetingDetail(doc);
                }
            } catch (err) {
                console.error('[useMeetingData] Failed to fetch full meeting document:', err);
                if (isMounted) {
                    setError(getUserErrorMessage(err, 'Unable to load meeting document details.'));
                }
            } finally {
                if (isMounted) {
                    setIsLoadingMeeting(false);
                }
            }
        }

        loadMeeting();

        return () => {
            isMounted = false;
        };
    }, [selectedMeetingMeta]);

    const refreshData = useCallback(async () => {
        invalidateMeetingCache();
        await loadInitialData();
        if (selectedYear && selectedMonth) {
            const data = await fetchMonthIndex(selectedYear, selectedMonth);
            setMonthData(data);
        }
    }, [loadInitialData, selectedYear, selectedMonth]);

    const clearError = useCallback(() => setError(null), []);

    return {
        yearsData,
        selectedYear,
        setSelectedYear,
        selectedMonth,
        setSelectedMonth,
        monthData,
        searchIndex,
        selectedMeetingMeta,
        setSelectedMeetingMeta,
        fullMeetingDetail,
        setFullMeetingDetail,
        isLoadingInitial,
        isLoadingMonth,
        isLoadingMeeting,
        error,
        clearError,
        refreshData
    };
}
