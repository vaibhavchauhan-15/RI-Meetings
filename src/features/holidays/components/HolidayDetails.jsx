import React from 'react';
import { CalendarOff, Briefcase, Calendar, Building2 } from 'lucide-react';
import { formatFullHolidayDate, isSundayDate } from '../utils/holidayDateUtils.js';
import { 
    HOLIDAYS_BY_DATE_2026,
    EVENTS_BY_DATE_2026 
} from '../data/companyHolidays2026.js';
import { HolidayEventIcon } from './HolidayIcon.jsx';

/**
 * Category color badge mapping for festivals and religious events
 */
const CATEGORY_BADGES = {
    Hindu: 'bg-orange-100 text-orange-900 border-orange-200',
    Islamic: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    Christian: 'bg-indigo-100 text-indigo-900 border-indigo-200',
    Sikh: 'bg-amber-100 text-amber-900 border-amber-200',
    Jain: 'bg-yellow-100 text-yellow-900 border-yellow-200',
    Buddhist: 'bg-teal-100 text-teal-900 border-teal-200',
    Parsi: 'bg-rose-100 text-rose-900 border-rose-200',
    National: 'bg-slate-100 text-slate-800 border-slate-200',
    Cultural: 'bg-purple-100 text-purple-900 border-purple-200',
    Company: 'bg-emerald-100 text-emerald-900 border-emerald-300'
};

/**
 * HolidayDetails Component
 * Displays selected date details with clean, short, non-repetitive UI:
 * 1. Official Company Holiday: Emerald Green, Company Holiday chip.
 * 2. Sunday Fixed Weekly Off: Warm Rose, Sunday Weekly Off chip (Operations Closed).
 * 3. Festival / Event on Weekday: Warm Amber, Working Day chip.
 * 4. Standard Weekday: Clean Slate tone.
 */
export default function HolidayDetails({ selectedDate }) {
    if (!selectedDate) {
        return (
            <div className="bg-slate-50/70 rounded-lg p-2.5 border border-border-light text-center flex items-center justify-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400 animate-pulse-subtle flex-shrink-0" />
                <p className="text-[11px] text-slate-500 font-medium">
                    Tap or click any date on the calendar to view festival details.
                </p>
            </div>
        );
    }

    const companyHoliday = HOLIDAYS_BY_DATE_2026[selectedDate] || null;
    const allEventsOnDate = EVENTS_BY_DATE_2026[selectedDate] || [];
    const formattedDate = formatFullHolidayDate(selectedDate);
    const isHoliday = Boolean(companyHoliday);
    const isSunday = isSundayDate(selectedDate);

    // Other distinct events on this date that are not the company holiday entry
    const additionalEvents = allEventsOnDate.filter(ev => 
        !companyHoliday || (ev.id !== companyHoliday.id && ev.name.toLowerCase() !== companyHoliday.name.toLowerCase())
    );

    // 1. CASE: Official Company Holiday (Emerald Green)
    if (isHoliday) {
        return (
            <div className="bg-emerald-50/80 border border-emerald-200/90 border-l-4 border-l-emerald-600 rounded-lg sm:rounded-xl p-2 sm:p-2.5 shadow-2xs select-none transition-all">
                {/* Header Row: Short Chip & Formatted Date */}
                <div className="flex items-center justify-between gap-1.5 mb-1 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        Company Holiday {isSunday ? '· Sunday' : ''}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                        {formattedDate}
                    </span>
                </div>

                {/* Main Title & Subtitle */}
                <div className="mt-0.5">
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{companyHoliday.name}</span>
                    </h3>
                    {companyHoliday.subLabel && (
                        <p className="text-[10px] font-semibold text-emerald-800/90 mt-0.5 ml-5">
                            {companyHoliday.subLabel}
                        </p>
                    )}
                </div>

                {/* Short Description */}
                {companyHoliday.notes && (
                    <p className="text-[10px] sm:text-[11px] text-slate-700 mt-1 pt-1 border-t border-emerald-200/70 leading-snug font-medium line-clamp-2">
                        {companyHoliday.notes}
                    </p>
                )}

                {/* Distinct Co-occurring Festivals / Observances (if any) */}
                {additionalEvents.length > 0 && (
                    <div className="mt-1.5 pt-1.5 border-t border-emerald-200/70 flex flex-col gap-1">
                        <span className="text-[9px] font-extrabold text-emerald-900 uppercase tracking-wider">
                            Also Observed Today:
                        </span>
                        {additionalEvents.map(ev => {
                            const badgeStyle = CATEGORY_BADGES[ev.category] || 'bg-slate-100 text-slate-800 border-slate-200';
                            return (
                                <div key={ev.id} className="bg-white/90 rounded-md p-1.5 border border-emerald-200/60 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <HolidayEventIcon item={ev} className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                        <span className="text-[11px] font-bold text-slate-900 truncate">{ev.name}</span>
                                    </div>
                                    <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded border flex-shrink-0 ${badgeStyle}`}>
                                        {ev.religion || ev.category}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    // 2. CASE: Indian Festival / Religious / Cultural Event Day
    if (allEventsOnDate.length > 0) {
        return (
            <div className="bg-amber-50/75 border border-amber-200/90 border-l-4 border-l-amber-500 rounded-lg sm:rounded-xl p-2 sm:p-2.5 shadow-2xs select-none transition-all flex flex-col gap-1.5">
                {/* Header Row: Short Chip & Formatted Date */}
                <div className="flex items-center justify-between gap-1.5 flex-wrap">
                    {isSunday ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            Sunday Weekly Off
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold bg-white text-slate-700 border border-slate-200">
                            Working Day
                        </span>
                    )}
                    <span className="text-[10px] font-semibold text-slate-500">
                        {formattedDate}
                    </span>
                </div>

                {/* List of Events on this Date */}
                <div className="flex flex-col gap-1">
                    {allEventsOnDate.map(ev => {
                        const badgeStyle = CATEGORY_BADGES[ev.category] || 'bg-slate-100 text-slate-800 border-slate-200';
                        return (
                            <div key={ev.id} className="bg-white/90 rounded-md p-1.5 sm:p-2 border border-amber-200/80 flex flex-col gap-0.5 shadow-2xs">
                                <div className="flex items-center justify-between gap-1.5 flex-wrap">
                                    <div className="flex items-center gap-1.5">
                                        <HolidayEventIcon item={ev} className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                                        <span className="text-[11px] sm:text-xs font-extrabold text-slate-900">{ev.name}</span>
                                    </div>
                                    <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded border ${badgeStyle}`}>
                                        {ev.religion || ev.category}
                                    </span>
                                </div>

                                {ev.subLabel && (
                                    <p className="text-[9px] font-semibold text-slate-500">
                                        {ev.subLabel}
                                    </p>
                                )}

                                {ev.notes && (
                                    <p className="text-[10px] text-slate-600 leading-snug font-medium line-clamp-2">
                                        {ev.notes}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // 3. CASE: Standard Day (No Holiday or Festival)
    if (isSunday) {
        return (
            <div className="bg-rose-50/40 border border-rose-200/80 border-l-4 border-l-rose-500 rounded-lg sm:rounded-xl p-1.5 sm:p-2 select-none transition-all">
                <div className="flex items-center justify-between gap-1.5 mb-0.5 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        <CalendarOff className="w-3 h-3 text-rose-600 flex-shrink-0" />
                        Sunday Weekly Off
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                        {formattedDate}
                    </span>
                </div>
                <p className="text-[10px] text-slate-600 font-medium leading-snug">
                    Fixed Sunday weekly off. Central workshop, site repairs, and fleet operations closed.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-slate-50/70 border border-border-light rounded-lg sm:rounded-xl p-1.5 sm:p-2 select-none transition-all">
            <div className="flex items-center justify-between gap-1.5 mb-0.5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-white text-slate-700 border border-slate-200">
                    <Briefcase className="w-3 h-3 text-slate-500 flex-shrink-0" />
                    Regular Working Day
                </span>
                <span className="text-[10px] font-semibold text-slate-500">
                    {formattedDate}
                </span>
            </div>
            <p className="text-[10px] text-slate-600 font-medium leading-snug">
                Standard operating day. Central workshop, site breakdowns, and fleet movements active.
            </p>
        </div>
    );
}
