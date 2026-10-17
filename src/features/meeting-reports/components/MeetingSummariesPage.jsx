import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useMeetingData } from '../hooks/useMeetingData.js';
import { useMeetingUrlSync } from '../hooks/useMeetingUrlSync.js';
import { useTextHighlighter } from '../hooks/useTextHighlighter.js';
import { searchMeetings, getChronologicalNavigation } from '../utils/searchEngine.js';
import { exportMonthBreakdownsToExcel } from '../services/excelExportService.js';
import MeetingHeaderBar from './MeetingHeaderBar.jsx';
import MonthFilterBar from './MonthFilterBar.jsx';
import MeetingList from './MeetingList.jsx';
import MeetingDetailDocument from './MeetingDetailDocument.jsx';
import TextHighlightPopup from './TextHighlightPopup.jsx';
import { MeetingDocumentSkeleton } from '../../../components/ui/Skeleton.jsx';
import { ErrorBoundary } from '../../../components/ui/ErrorBoundary.jsx';
import PresentationOverlay from '../../../components/shared/PresentationOverlay.jsx';
import HolidayCalendar from '../../holidays/components/HolidayCalendar.jsx';

/**
 * Reach International Operations - Meeting Summaries & Holiday Calendar Dashboard
 * 
 * Modular container orchestrating meeting stream, operational documents,
 * search scoring, presentation overlay, and 2026 holiday calendar.
 */
export default function MeetingSummariesPage({
    searchQuery = '',
    setSearchQuery,
    selectedMeeting: controlledSelectedMeeting,
    setSelectedMeeting: controlledSetSelectedMeeting,
    resetTrigger
}) {
    // -------------------------------------------------------------
    // Data & State Management via Custom Hook
    // -------------------------------------------------------------
    const {
        yearsData,
        selectedYear,
        setSelectedYear,
        selectedMonth,
        setSelectedMonth,
        monthData,
        searchIndex,
        selectedMeetingMeta: hookSelectedMeetingMeta,
        setSelectedMeetingMeta: hookSetSelectedMeetingMeta,
        fullMeetingDetail,
        setFullMeetingDetail,
        isLoadingInitial,
        isLoadingMonth,
        isLoadingMeeting,
        error,
        clearError,
        refreshData
    } = useMeetingData();

    // Controlled vs Uncontrolled meeting selection
    const selectedMeetingMeta = controlledSelectedMeeting !== undefined ? controlledSelectedMeeting : hookSelectedMeetingMeta;
    const setSelectedMeetingMeta = controlledSetSelectedMeeting || hookSetSelectedMeetingMeta;

    // Local UI state
    const [localSearchQuery, setLocalSearchQuery] = useState('');
    const currentSearchQuery = setSearchQuery ? searchQuery : localSearchQuery;
    const updateSearchQuery = setSearchQuery || setLocalSearchQuery;

    const [activeDashboardTab, setActiveDashboardTab] = useState('meetings'); // 'meetings' | 'calendar'
    const [showCalendarSidebar, setShowCalendarSidebar] = useState(false);
    const [calendarSelectedDate, setCalendarSelectedDate] = useState(null);
    const [isPresentationMode, setIsPresentationMode] = useState(false);
    const [isExportingMonthExcel, setIsExportingMonthExcel] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    // DOM Refs
    const pageContainerRef = useRef(null);
    const documentCardRef = useRef(null);
    const cardsContainerRef = useRef(null);

    // Text selection highlighter
    const {
        selectionPopup,
        setSelectionPopup,
        handleDocumentSelection,
        applyTextHighlight
    } = useTextHighlighter();

    // -------------------------------------------------------------
    // Bi-directional URL Parameter Synchronization
    // -------------------------------------------------------------
    useMeetingUrlSync({
        searchQuery: currentSearchQuery,
        setSearchQuery: updateSearchQuery,
        selectedMeetingMeta,
        setSelectedMeetingMeta,
        activeDashboardTab,
        setActiveDashboardTab,
        searchIndex
    });

    // -------------------------------------------------------------
    // Search & Filtered Meetings Calculation
    // -------------------------------------------------------------
    const isSearching = Boolean(currentSearchQuery && currentSearchQuery.trim().length > 0);

    const searchResults = useMemo(() => {
        if (!isSearching) return [];
        return searchMeetings(currentSearchQuery, searchIndex);
    }, [isSearching, currentSearchQuery, searchIndex]);

    const displayMeetings = useMemo(() => {
        if (isSearching) return searchResults;
        return monthData?.meetings || [];
    }, [isSearching, searchResults, monthData]);

    // Chronological navigation (Prev/Next non-holiday meeting)
    const { prevMeeting, nextMeeting } = useMemo(() => {
        if (!selectedMeetingMeta || !yearsData?.chronologicalSequence) {
            return { prevMeeting: null, nextMeeting: null };
        }
        return getChronologicalNavigation(selectedMeetingMeta.date, yearsData.chronologicalSequence);
    }, [selectedMeetingMeta, yearsData]);

    // Active meeting document to render (full detail or metadata)
    const activeMeetingDoc = fullMeetingDetail || selectedMeetingMeta;

    // -------------------------------------------------------------
    // Reset Trigger (from Navbar Brand Logo click)
    // -------------------------------------------------------------
    useEffect(() => {
        if (resetTrigger) {
            setSelectedMeetingMeta(null);
            setFullMeetingDetail(null);
            updateSearchQuery('');
            setIsPresentationMode(false);
            setSelectionPopup(null);
            setActiveDashboardTab('meetings');
            setShowCalendarSidebar(false);
            setCalendarSelectedDate(null);
            if (cardsContainerRef.current) {
                cardsContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
            }
            if (pageContainerRef.current) {
                pageContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    }, [resetTrigger]);

    // Reset presentation mode & selection popup when changing meetings
    useEffect(() => {
        setIsPresentationMode(false);
        setSelectionPopup(null);
    }, [selectedMeetingMeta]);

    // Track scroll for floating back-to-top button
    useEffect(() => {
        const handleScroll = () => {
            const activeContainer = selectedMeetingMeta ? pageContainerRef.current : cardsContainerRef.current;
            const scrollTop = activeContainer ? activeContainer.scrollTop : (window.scrollY || 0);
            setShowScrollTop(scrollTop > 180);
        };

        const activeContainer = selectedMeetingMeta ? pageContainerRef.current : cardsContainerRef.current;
        if (activeContainer) {
            activeContainer.addEventListener('scroll', handleScroll, { passive: true });
            return () => activeContainer.removeEventListener('scroll', handleScroll);
        }
    }, [selectedMeetingMeta]);

    const scrollToTop = useCallback(() => {
        if (selectedMeetingMeta && pageContainerRef.current) {
            pageContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (cardsContainerRef.current) {
            cardsContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [selectedMeetingMeta]);

    // -------------------------------------------------------------
    // Event Handlers
    // -------------------------------------------------------------
    const handleSelectMeeting = useCallback((meta) => {
        setSelectedMeetingMeta(meta);
        if (pageContainerRef.current) {
            pageContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [setSelectedMeetingMeta]);

    const handleBackToStream = useCallback(() => {
        setSelectedMeetingMeta(null);
        setFullMeetingDetail(null);
    }, [setSelectedMeetingMeta, setFullMeetingDetail]);

    const handleOpenCalendarForDate = useCallback((isoDate) => {
        if (isoDate) {
            setCalendarSelectedDate(isoDate);
            setActiveDashboardTab('calendar');
            setShowCalendarSidebar(true);
        }
    }, []);

    const handleExportMonth = useCallback(async () => {
        const meetingsToExport = monthData?.meetings || [];
        if (meetingsToExport.length === 0) return;

        setIsExportingMonthExcel(true);
        try {
            const monthLabel = `${monthData.monthName || 'Month'} ${monthData.year || '2026'}`;
            await exportMonthBreakdownsToExcel(meetingsToExport, monthLabel);
        } catch (err) {
            console.error('Failed to export month to Excel:', err);
        } finally {
            setIsExportingMonthExcel(false);
        }
    }, [monthData]);

    return (
        <div 
            ref={pageContainerRef}
            onMouseUp={handleDocumentSelection}
            className="flex-1 w-full h-full min-h-0 bg-stage-bg flex flex-col overflow-y-auto relative p-2.5 sm:p-4 lg:p-6"
        >
            <div className="max-w-[1440px] w-full mx-auto flex-1 flex flex-col gap-3 sm:gap-4 min-h-0">
                {/* 1. Header Bar: Titles, View switcher, Calendar toggle & Monthly export */}
                <MeetingHeaderBar
                    selectedMeeting={selectedMeetingMeta}
                    onBackToStream={handleBackToStream}
                    activeDashboardTab={activeDashboardTab}
                    onSelectTab={setActiveDashboardTab}
                    showCalendarSidebar={showCalendarSidebar}
                    onToggleCalendarSidebar={() => setShowCalendarSidebar(prev => !prev)}
                    onExportMonthExcel={!isSearching && displayMeetings.length > 0 ? handleExportMonth : null}
                    isExportingMonthExcel={isExportingMonthExcel}
                    selectedMonthName={monthData?.monthName || 'Month'}
                />

                {/* Database / Network Error Banner */}
                {error && (
                    <div 
                        className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center justify-between gap-3 text-xs sm:text-sm text-red-700 animate-fade-in select-none"
                        role="alert"
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-base">⚠️</span>
                            <span className="font-medium">{error}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                                type="button"
                                onClick={refreshData}
                                className="px-2.5 py-1 bg-white hover:bg-red-100 text-red-700 border border-red-300 rounded-lg font-bold text-xs transition-colors cursor-pointer active:scale-95 shadow-2xs"
                            >
                                Retry
                            </button>
                            <button
                                type="button"
                                onClick={clearError}
                                className="p-1 text-red-400 hover:text-red-700 transition-colors cursor-pointer rounded"
                                title="Dismiss error"
                                aria-label="Dismiss error"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}

                {/* 2. Dual-Column Main Content Container: Left = Reports/Stream, Right = Calendar */}
                <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4 xl:gap-5 overflow-hidden">
                    {/* Left Column: Meeting Stream OR Selected Meeting Document */}
                    <div 
                        className={`flex-1 min-h-0 flex flex-col gap-3 overflow-hidden ${
                            activeDashboardTab === 'calendar' ? 'hidden lg:flex' : 'flex'
                        }`}
                    >
                        {/* If in stream view: Month Pills Filter Strip */}
                        {!selectedMeetingMeta && (
                            <MonthFilterBar
                                yearsData={yearsData}
                                selectedYear={selectedYear}
                                onSelectYear={setSelectedYear}
                                selectedMonth={selectedMonth}
                                onSelectMonth={setSelectedMonth}
                                isSearching={isSearching}
                                searchQuery={currentSearchQuery}
                                onClearSearch={() => updateSearchQuery('')}
                            />
                        )}

                        {/* Document View vs Stream List View */}
                        {selectedMeetingMeta ? (
                            <div className="flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar">
                                {isLoadingMeeting ? (
                                    <MeetingDocumentSkeleton />
                                ) : (
                                    <ErrorBoundary 
                                        title="Unable to load meeting document" 
                                        message="An error occurred while loading this meeting report. You can return to the meeting list or retry."
                                        onReset={handleBackToStream}
                                    >
                                        <MeetingDetailDocument
                                            meeting={activeMeetingDoc}
                                            prevMeeting={prevMeeting}
                                            nextMeeting={nextMeeting}
                                            onSelectMeeting={handleSelectMeeting}
                                            onOpenPresentation={() => setIsPresentationMode(true)}
                                            onOpenCalendar={handleOpenCalendarForDate}
                                            contentRef={documentCardRef}
                                        />
                                    </ErrorBoundary>
                                )}
                            </div>
                        ) : (
                            <MeetingList
                                meetings={displayMeetings}
                                selectedMeetingId={selectedMeetingMeta?.id}
                                onSelectMeeting={handleSelectMeeting}
                                onOpenCalendar={handleOpenCalendarForDate}
                                isLoading={isLoadingInitial || isLoadingMonth}
                                isSearching={isSearching}
                                searchQuery={currentSearchQuery}
                                containerRef={cardsContainerRef}
                            />
                        )}
                    </div>

                    {/* Right Column: 2026 Company Holiday & Indian Calendar */}
                    <div 
                        onWheel={(e) => e.stopPropagation()}
                        className={`w-full lg:w-[380px] xl:w-[420px] flex-shrink-0 flex flex-col min-h-0 overflow-y-auto pr-0.5 custom-scrollbar overscroll-contain ${
                            activeDashboardTab === 'calendar' 
                                ? 'flex' 
                                : (showCalendarSidebar ? 'hidden lg:flex' : 'hidden')
                        }`}
                    >
                        <ErrorBoundary
                            title="Calendar view unavailable"
                            message="An unexpected error occurred while rendering the holiday calendar."
                            onReset={() => setActiveDashboardTab('meetings')}
                        >
                            <HolidayCalendar 
                                initialMonth={selectedMonth}
                                initialDate={calendarSelectedDate}
                                onClose={() => {
                                    setShowCalendarSidebar(false);
                                    setActiveDashboardTab('meetings');
                                }}
                            />
                        </ErrorBoundary>
                    </div>
                </div>
            </div>

            {/* Floating Scroll-to-Top Button */}
            {showScrollTop && (
                <button
                    type="button"
                    onClick={scrollToTop}
                    className="fixed bottom-5 right-5 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900 text-white shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center cursor-pointer active:scale-95 animate-fade-in"
                    title="Scroll to top"
                    aria-label="Scroll to top"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="18 15 12 9 6 15" />
                    </svg>
                </button>
            )}

            {/* Text Selection Quick Highlighter Popup */}
            <TextHighlightPopup
                selectionPopup={selectionPopup}
                onApplyHighlight={applyTextHighlight}
                onClose={() => setSelectionPopup(null)}
            />

            {/* PowerPoint-style Presentation Mode Overlay */}
            {isPresentationMode && activeMeetingDoc && (
                <PresentationOverlay
                    containerRef={pageContainerRef}
                    contentRef={documentCardRef}
                    meetingTitle={activeMeetingDoc.title || activeMeetingDoc.dateFormatted || 'Daily Operational Meeting'}
                    onClose={() => setIsPresentationMode(false)}
                />
            )}
        </div>
    );
}
