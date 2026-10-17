import React from 'react';
import { ArrowLeft, Calendar, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';

/**
 * Top Header Bar for Meeting Summaries Page
 * Manages view title, mobile stream/calendar tabs, monthly excel export, and back navigation.
 */
export function MeetingHeaderBar({
    selectedMeeting,
    onBackToStream,
    activeDashboardTab,
    onSelectTab,
    showCalendarSidebar,
    onToggleCalendarSidebar,
    onExportMonthExcel,
    isExportingMonthExcel = false,
    selectedMonthName = ''
}) {
    return (
        <div className="flex items-center justify-between gap-3 flex-wrap py-1 flex-shrink-0 select-none">
            {/* Left: View title or Back to stream action */}
            <div className="flex items-center gap-2">
                {selectedMeeting ? (
                    <button
                        type="button"
                        onClick={onBackToStream}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-theme-breakdown py-1 px-2.5 rounded-xl border border-border-light bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-2xs active:scale-95 group"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 text-slate-500 group-hover:text-theme-breakdown transition-transform duration-200 group-hover:-translate-x-1" />
                        <span>Back to All Meetings</span>
                    </button>
                ) : (
                    <div>
                        <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                            Daily Operational Meetings
                        </h1>
                        <p className="text-[11px] text-slate-500 hidden sm:block">
                            Reach International daily fleet coordination and technical breakdown archive
                        </p>
                    </div>
                )}
            </div>

            {/* Right: Mobile Tab Switcher & Calendar Toggle & Monthly Export */}
            <div className="flex items-center gap-2">
                {/* Mobile Tab Switcher (Meetings vs Calendar) */}
                <div className="flex lg:hidden items-center bg-slate-100 p-0.5 rounded-xl border border-border-light text-xs font-semibold">
                    <button
                        type="button"
                        onClick={() => onSelectTab('meetings')}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg transition-all cursor-pointer ${
                            activeDashboardTab === 'meetings'
                                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <FileText className="w-3 h-3 text-slate-500" />
                        <span>Reports</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => onSelectTab('calendar')}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg transition-all cursor-pointer ${
                            activeDashboardTab === 'calendar'
                                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>Calendar</span>
                    </button>
                </div>

                {/* Desktop Holiday Calendar Toggle Button */}
                <button
                    type="button"
                    onClick={onToggleCalendarSidebar}
                    className={`hidden lg:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer shadow-2xs active:scale-95 group ${
                        showCalendarSidebar
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-border-light'
                    }`}
                    title="Toggle 2026 Indian & Company Holiday Calendar"
                >
                    <Calendar className="w-3.5 h-3.5 text-emerald-600 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-6" />
                    <span>2026 Calendar & Holidays</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        15 Holidays
                    </span>
                </button>

                {/* Monthly Excel Export (only when in stream view and meetings available) */}
                {!selectedMeeting && onExportMonthExcel && (
                    <button
                        type="button"
                        onClick={onExportMonthExcel}
                        disabled={isExportingMonthExcel}
                        className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border border-border-light bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition-all cursor-pointer active:scale-95 disabled:opacity-50 group"
                        title={`Export all breakdowns for ${selectedMonthName} to Excel (.xlsx)`}
                    >
                        {isExportingMonthExcel ? (
                            <Loader2 className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                        ) : (
                            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 transition-transform duration-200 group-hover:scale-110 group-hover:-translate-y-0.5" />
                        )}
                        <span className="hidden sm:inline">
                            {isExportingMonthExcel ? 'Exporting...' : `Export ${selectedMonthName}`}
                        </span>
                        <span className="sm:hidden">
                            {isExportingMonthExcel ? '...' : 'Export'}
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
}

export default MeetingHeaderBar;
