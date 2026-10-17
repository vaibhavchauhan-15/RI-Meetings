import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ChevronUp, AlertTriangle, RotateCcw, X } from 'lucide-react';
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
    const documentContainerRef = useRef(null);

    // Text selection highlighter
    const meetingKey = selectedMeetingMeta?.id || selectedMeetingMeta?.date || 'default';
    const {
        highlights,
        selectionPopup,
        setSelectionPopup,
        handleDocumentSelection,
        applyTextHighlight,
        undoHighlight,
        clearHighlights,
        canUndoHighlight
    } = useTextHighlighter({
        containerRef: documentCardRef,
        meetingKey
    });

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
            if (documentContainerRef.current) {
                documentContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    }, [resetTrigger]);

    // Reset presentation mode & selection popup when changing meetings
    useEffect(() => {
        setIsPresentationMode(false);
        setSelectionPopup(null);
    }, [selectedMeetingMeta]);

    // Track scroll for floating back-to-top button across all possible scrolling viewports
    useEffect(() => {
        const handleScroll = () => {
            const docScroll = documentContainerRef.current?.scrollTop || 0;
            const pageScroll = pageContainerRef.current?.scrollTop || 0;
            const cardsScroll = cardsContainerRef.current?.scrollTop || 0;
            const winScroll = typeof window !== 'undefined' ? (window.scrollY || document.documentElement?.scrollTop || 0) : 0;
            const maxScroll = Math.max(docScroll, pageScroll, cardsScroll, winScroll);
            setShowScrollTop(maxScroll > 160);
        };

        const docEl = documentContainerRef.current;
        const pageEl = pageContainerRef.current;
        const cardsEl = cardsContainerRef.current;

        docEl?.addEventListener('scroll', handleScroll, { passive: true });
        pageEl?.addEventListener('scroll', handleScroll, { passive: true });
        cardsEl?.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Initial check
        handleScroll();

        return () => {
            docEl?.removeEventListener('scroll', handleScroll);
            pageEl?.removeEventListener('scroll', handleScroll);
            cardsEl?.removeEventListener('scroll', handleScroll);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [selectedMeetingMeta, isLoadingMeeting]);

    const scrollToTop = useCallback(() => {
        if (documentContainerRef.current) {
            documentContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
        if (pageContainerRef.current) {
            pageContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
        if (cardsContainerRef.current) {
            cardsContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, []);

    // -------------------------------------------------------------
    // Event Handlers
    // -------------------------------------------------------------
    const handleSelectMeeting = useCallback((meta) => {
        setSelectedMeetingMeta(meta);
        if (documentContainerRef.current) {
            documentContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
        if (pageContainerRef.current) {
            pageContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [setSelectedMeetingMeta]);

    // When activeDashboardTab switches to 'calendar' (e.g. from URL), ensure calendar sidebar is open on desktop
    useEffect(() => {
        if (activeDashboardTab === 'calendar') {
            setShowCalendarSidebar(true);
        }
    }, [activeDashboardTab]);

    const handleBackToStream = useCallback(() => {
        setSelectedMeetingMeta(null);
        setFullMeetingDetail(null);
    }, [setSelectedMeetingMeta, setFullMeetingDetail]);

    const handleOpenCalendarForDate = useCallback((isoDate) => {
        if (isoDate) {
            setCalendarSelectedDate(isoDate);
            setShowCalendarSidebar(true);
            // On mobile viewports (< 1024px), switch active dashboard tab to calendar
            if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                setActiveDashboardTab('calendar');
            }
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
                    onToggleCalendarSidebar={() => {
                        setShowCalendarSidebar(prev => {
                            const next = !prev;
                            if (!next && activeDashboardTab === 'calendar') {
                                setActiveDashboardTab('meetings');
                            }
                            return next;
                        });
                    }}
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
                            <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse-subtle flex-shrink-0" />
                            <span className="font-medium">{error}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                                type="button"
                                onClick={refreshData}
                                className="group px-2.5 py-1 bg-white hover:bg-red-100 text-red-700 border border-red-300 rounded-lg font-bold text-xs transition-colors cursor-pointer active:scale-95 shadow-2xs flex items-center gap-1.5"
                            >
                                <RotateCcw className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-rotate-90" />
                                <span>Retry</span>
                            </button>
                            <button
                                type="button"
                                onClick={clearError}
                                className="p-1 text-red-400 hover:text-red-700 transition-colors cursor-pointer rounded flex items-center justify-center hover:scale-105 active:scale-95"
                                title="Dismiss error"
                                aria-label="Dismiss error"
                            >
                                <X className="w-4 h-4 transition-transform duration-200 hover:rotate-90" />
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
                            <div 
                                ref={documentContainerRef}
                                className="flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar"
                            >
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
                        className={`w-full lg:w-[380px] xl:w-[420px] lg:flex-shrink-0 lg:flex-initial flex-col min-h-0 overflow-y-auto pr-0.5 custom-scrollbar overscroll-contain pb-2 sm:pb-4 ${
                            activeDashboardTab === 'calendar' 
                                ? 'flex flex-1 h-full lg:flex-initial lg:h-auto' 
                                : 'hidden'
                        } ${
                            showCalendarSidebar ? 'lg:flex' : 'lg:hidden'
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
                                onMonthChange={(m) => {
                                    const mStr = String(m).padStart(2, '0');
                                    if (mStr !== selectedMonth) {
                                        setSelectedMonth(mStr);
                                    }
                                }}
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
                    className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-900/95 hover:bg-slate-900 text-white shadow-xl hover:shadow-2xl border border-slate-700/50 backdrop-blur-sm transition-all duration-200 flex items-center justify-center cursor-pointer active:scale-90 animate-fade-in group"
                    title="Scroll to top"
                    aria-label="Scroll to top"
                >
                    <ChevronUp className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-1" />
                </button>
            )}

            {/* Text Selection Quick Highlighter Popup (Only when not in presentation mode) */}
            {!isPresentationMode && (
                <TextHighlightPopup
                    selectionPopup={selectionPopup}
                    onApplyHighlight={applyTextHighlight}
                    onClose={() => setSelectionPopup(null)}
                />
            )}

            {/* PowerPoint-style Presentation Mode Overlay */}
            {isPresentationMode && activeMeetingDoc && (
                <PresentationOverlay
                    containerRef={pageContainerRef}
                    contentRef={documentCardRef}
                    meetingTitle={activeMeetingDoc.title || activeMeetingDoc.dateFormatted || 'Daily Operational Meeting'}
                    onClose={() => setIsPresentationMode(false)}
                    highlights={highlights}
                    onApplyHighlight={applyTextHighlight}
                    onUndoHighlight={undoHighlight}
                    onClearHighlights={clearHighlights}
                    canUndoHighlight={canUndoHighlight}
                />
            )}
        </div>
    );
}
