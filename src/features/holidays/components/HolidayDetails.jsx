import React, { useState, useEffect } from 'react';
import { Calendar, Building2, ChevronDown, ChevronUp } from 'lucide-react';
import { formatShortHolidayDate, isSundayDate } from '../utils/holidayDateUtils.js';
import { 
    HOLIDAYS_BY_DATE_2026,
    EVENTS_BY_DATE_2026 
} from '../data/companyHolidays2026.js';
import { HolidayEventIcon } from './HolidayIcon.jsx';

/**
 * HolidayDetails Component
 * Compact selected-day event details:
 * - Shows compact event summary immediately below calendar
 * - Clearly separates weekly-off status from festival information
 * - Reduces nested borders and excessive padding
 * - Keeps event title, date, and working status easy to scan
 * - Expands longer descriptions only when requested
 */
export default function HolidayDetails({ selectedDate }) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Reset expansion state when selected date changes
    useEffect(() => {
        setIsExpanded(false);
    }, [selectedDate]);

    if (!selectedDate) {
        return (
            <div className="bg-slate-50/70 rounded-xl p-2.5 border border-slate-200/80 text-center flex items-center justify-center gap-2 select-none">
                <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <p className="text-[11px] text-slate-500 font-medium">
                    Tap or click any date on the calendar to view details.
                </p>
            </div>
        );
    }

    const companyHoliday = HOLIDAYS_BY_DATE_2026[selectedDate] || null;
    const allEventsOnDate = EVENTS_BY_DATE_2026[selectedDate] || [];
    const formattedShortDate = formatShortHolidayDate(selectedDate);
    const isHoliday = Boolean(companyHoliday);
    const isSunday = isSundayDate(selectedDate);

    // Non-holiday events if co-occurring
    const additionalEvents = allEventsOnDate.filter(ev => 
        !companyHoliday || (ev.id !== companyHoliday.id && ev.name.toLowerCase() !== companyHoliday.name.toLowerCase())
    );

    return (
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-2.5 sm:p-3 flex flex-col gap-2 select-none transition-all">
            {/* Header: "Selected day" on left, Date on right */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 pb-1.5">
                <span className="text-xs font-black text-slate-900 tracking-tight">
                    Selected day
                </span>
                <span className="text-[11px] font-bold text-slate-500">
                    {formattedShortDate}
                </span>
            </div>

            {/* Case 1: Official Company Holiday */}
            {isHoliday && (
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-start gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Building2 className="w-4 h-4 text-emerald-700" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                                {companyHoliday.name}
                            </h3>
                            <p className="text-[10px] font-semibold text-slate-500 mt-0.5">
                                Company Holiday · {companyHoliday.subLabel || 'Operations Closed'}
                            </p>
                        </div>
                    </div>

                    {/* Separated Status Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            Operations Closed
                        </span>

                        {isSunday && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                Sunday weekly off
                            </span>
                        )}
                    </div>

                    {/* Expandable note */}
                    {companyHoliday.notes && (
                        <div className="pt-1 border-t border-slate-200/50">
                            <p className={`text-[10px] text-slate-600 leading-snug font-medium ${isExpanded ? '' : 'line-clamp-1'}`}>
                                {companyHoliday.notes}
                            </p>
                            <button
                                type="button"
                                onClick={() => setIsExpanded(p => !p)}
                                className="text-[10px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer mt-0.5 inline-flex items-center gap-0.5"
                            >
                                <span>{isExpanded ? 'Less info' : 'More info'}</span>
                                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                        </div>
                    )}

                    {/* Co-occurring festivals if any */}
                    {additionalEvents.length > 0 && (
                        <div className="pt-1.5 border-t border-slate-200/50 flex flex-col gap-1">
                            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                                Also Observed Today
                            </span>
                            {additionalEvents.map(ev => (
                                <div key={ev.id} className="flex items-center justify-between gap-1 text-[11px]">
                                    <span className="font-bold text-slate-800 truncate">{ev.name}</span>
                                    <span className="text-[9px] font-semibold text-slate-500 flex-shrink-0">
                                        {ev.religion || ev.category}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Case 2: Indian Festival / Observance (Working Day or Sunday) */}
            {!isHoliday && allEventsOnDate.length > 0 && (
                <div className="flex flex-col gap-2">
                    {allEventsOnDate.map(ev => (
                        <div key={ev.id} className="flex flex-col gap-1.5">
                            <div className="flex items-start gap-2">
                                <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <HolidayEventIcon item={ev} className="w-4 h-4 text-amber-700" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                                        {ev.name}
                                    </h3>
                                    <p className="text-[10px] font-semibold text-slate-500 mt-0.5">
                                        Festival · {ev.religion || ev.category}
                                    </p>
                                </div>
                            </div>

                            {/* Separated Status Badges */}
                            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                                {isSunday ? (
                                    <>
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                            Sunday weekly off
                                        </span>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                            Working-day rules
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                            Festival (Working Day)
                                        </span>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-700 border border-slate-200">
                                            Central Workshop Open
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Expandable note */}
                            {ev.notes && (
                                <div className="pt-1 border-t border-slate-200/50">
                                    <p className={`text-[10px] text-slate-600 leading-snug font-medium ${isExpanded ? '' : 'line-clamp-1'}`}>
                                        {ev.notes}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setIsExpanded(p => !p)}
                                        className="text-[10px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer mt-0.5 inline-flex items-center gap-0.5"
                                    >
                                        <span>{isExpanded ? 'Less info' : 'More info'}</span>
                                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Case 3: Regular Sunday (Weekly Off) */}
            {!isHoliday && allEventsOnDate.length === 0 && isSunday && (
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            Sunday weekly off
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            Operations Closed
                        </span>
                    </div>
                    <p className="text-[10px] text-slate-600 font-medium leading-snug">
                        Fixed Sunday weekly off. Central workshop, site repairs, and fleet movements closed.
                    </p>
                </div>
            )}

            {/* Case 4: Standard Working Day */}
            {!isHoliday && allEventsOnDate.length === 0 && !isSunday && (
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-800 border border-slate-200">
                            Standard Working Day
                        </span>
                    </div>
                    <p className="text-[10px] text-slate-600 font-medium leading-snug">
                        Standard operational day. Central workshop, plant repairs, and fleet active.
                    </p>
                </div>
            )}
        </div>
    );
}
