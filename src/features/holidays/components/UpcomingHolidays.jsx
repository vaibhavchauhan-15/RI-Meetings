import React, { useState, useMemo, useRef } from 'react';
import { CalendarX, ChevronRight, Building2 } from 'lucide-react';
import { 
    MONTH_SHORT_NAMES, 
    RELIGION_FILTER_TABS,
    getRelativeHolidayStatus 
} from '../utils/holidayDateUtils.js';
import { 
    COMPANY_HOLIDAYS_2026, 
    ALL_INDIAN_CALENDAR_EVENTS_2026 
} from '../data/companyHolidays2026.js';
import { CategoryTabIcon, HolidayEventIcon } from './HolidayIcon.jsx';

/**
 * UpcomingHolidays Component
 * Clean, compact upcoming events and festival list:
 * - Fixes clipped category labels with non-wrapping horizontally scrollable chip row
 * - Replaces horizontal text overflow with smooth touch-friendly chip strip
 * - Compact event cards with consistent date badge, title, and category
 * - Compact segmented control (Upcoming vs View all)
 * - Eliminates nested scrolling traps to preserve smooth main-page scrolling
 */
export default function UpcomingHolidays({ 
    selectedDate,
    onSelectDate 
}) {
    const [activeFilter, setActiveFilter] = useState('company'); // 'company' | 'all' | 'Hindu' | 'Islamic' | 'Sikh' | 'Christian' | 'Jain' | 'National'
    const [showAllDates, setShowAllDates] = useState(false);
    const categoryScrollRef = useRef(null);

    // Current system ISO date
    const todayISO = useMemo(() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    }, []);

    // Filter events by selected category
    const filteredMasterList = useMemo(() => {
        if (activeFilter === 'company') {
            return COMPANY_HOLIDAYS_2026;
        }
        if (activeFilter === 'all') {
            return ALL_INDIAN_CALENDAR_EVENTS_2026;
        }
        return ALL_INDIAN_CALENDAR_EVENTS_2026.filter(
            ev => ev.category === activeFilter || ev.religion === activeFilter
        );
    }, [activeFilter]);

    // Split into upcoming vs all
    const upcomingList = useMemo(() => {
        return filteredMasterList.filter(ev => ev.date >= todayISO);
    }, [filteredMasterList, todayISO]);

    // Displayed events: upcoming mode shows top 5 items in natural flow (no scroll trapping)
    const displayedList = useMemo(() => {
        if (showAllDates) {
            return filteredMasterList;
        }
        return upcomingList.length > 0 ? upcomingList.slice(0, 5) : filteredMasterList.slice(0, 5);
    }, [showAllDates, filteredMasterList, upcomingList]);

    // Section title
    const sectionTitle = useMemo(() => {
        if (activeFilter === 'company') return 'Company Holidays';
        if (activeFilter === 'all') return 'Upcoming events';
        return `${activeFilter} Events`;
    }, [activeFilter]);

    return (
        <div className="flex flex-col gap-1.5 pt-1.5 border-t border-border-light select-none">
            {/* Header: Title and Compact Segmented Control */}
            <div className="flex items-center justify-between gap-1.5">
                <span className="text-xs font-black text-slate-900 tracking-tight truncate">
                    {sectionTitle}
                </span>

                {/* Compact Segmented Control (Upcoming vs View all) */}
                <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] font-bold flex-shrink-0">
                    <button
                        type="button"
                        onClick={() => setShowAllDates(false)}
                        className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                            !showAllDates 
                                ? 'bg-white text-slate-900 shadow-2xs font-extrabold' 
                                : 'text-slate-500 hover:text-slate-800'
                        }`}
                        title="Show upcoming events"
                    >
                        Upcoming
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowAllDates(true)}
                        className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                            showAllDates 
                                ? 'bg-white text-slate-900 shadow-2xs font-extrabold' 
                                : 'text-slate-500 hover:text-slate-800'
                        }`}
                        title={`View all ${filteredMasterList.length} events`}
                    >
                        View all
                    </button>
                </div>
            </div>

            {/* Category Filter: Horizontally scrollable chip row with zero clipping */}
            <div 
                ref={categoryScrollRef}
                className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth py-1 -mx-0.5 px-0.5 touch-pan-x min-w-0"
                role="tablist"
                aria-label="Filter events by category"
            >
                {RELIGION_FILTER_TABS.map(tab => {
                    const isActive = activeFilter === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => {
                                setActiveFilter(tab.id);
                                setShowAllDates(false);
                            }}
                            className={`flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap min-w-max transition-all duration-150 cursor-pointer border ${
                                isActive
                                    ? tab.id === 'company'
                                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                                        : 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                                    : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            <CategoryTabIcon 
                                tabId={tab.id} 
                                className={`w-3 h-3 flex-shrink-0 ${
                                    isActive 
                                        ? 'text-white' 
                                        : tab.id === 'company' 
                                            ? 'text-emerald-600' 
                                            : tab.id === 'Islamic' 
                                                ? 'text-emerald-600'
                                                : tab.id === 'Hindu' || tab.id === 'Sikh'
                                                    ? 'text-amber-500'
                                                    : 'text-slate-500'
                                }`} 
                            />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Event List (No nested scroll trapping in normal view) */}
            {displayedList.length === 0 ? (
                <div className="p-3 text-center bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-center gap-2">
                    <CalendarX className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <p className="text-[11px] text-slate-500 font-medium">
                        No upcoming events found for this category.
                    </p>
                </div>
            ) : (
                <div className={`flex flex-col gap-1.5 ${showAllDates ? 'max-h-[320px] overflow-y-auto pr-0.5 custom-scrollbar' : ''}`}>
                    {displayedList.map((item) => {
                        const isSelected = selectedDate === item.date;
                        const status = getRelativeHolidayStatus(item.date, todayISO);
                        const monthShort = MONTH_SHORT_NAMES[item.month - 1];
                        const dayPadded = String(item.day).padStart(2, '0');
                        const isCompany = item.isCompanyHoliday;

                        // Status label text
                        let statusText = 'Upcoming';
                        if (isCompany) {
                            statusText = 'Company Holiday';
                        } else if (item.dayOfWeek === 'Sunday') {
                            statusText = 'Sunday Off';
                        } else if (status === 'Today') {
                            statusText = 'Today';
                        }

                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => onSelectDate(item.date)}
                                className={`group w-full flex items-center justify-between gap-2.5 p-2 rounded-xl text-left transition-all duration-150 cursor-pointer border ${
                                    isSelected
                                        ? 'bg-blue-50/90 border-blue-400 ring-1 ring-blue-400 shadow-2xs'
                                        : 'bg-white hover:bg-slate-50 border-slate-200/90 hover:border-slate-300'
                                }`}
                                title={`Select ${item.name} (${item.date})`}
                            >
                                {/* Left: Consistent Date Badge */}
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex flex-col items-center justify-center flex-shrink-0 text-center shadow-2xs ${
                                        isCompany 
                                            ? 'bg-emerald-600 text-white font-black' 
                                            : 'bg-slate-900 text-white font-bold'
                                    }`}>
                                        <span className="text-xs sm:text-sm leading-none font-black">{dayPadded}</span>
                                        <span className="text-[8px] uppercase leading-none font-extrabold tracking-tight mt-0.5 text-slate-300">
                                            {monthShort}
                                        </span>
                                    </div>

                                    {/* Middle: Title & Category / Status */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5">
                                            {isCompany ? (
                                                <Building2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                            ) : (
                                                <HolidayEventIcon item={item} className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                                            )}
                                            <h4 className="text-xs font-black text-slate-900 truncate" title={item.name}>
                                                {item.name}
                                            </h4>
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium truncate mt-0.5">
                                            <span>{item.religion || item.category}</span>
                                            <span>·</span>
                                            <span className={
                                                isCompany 
                                                    ? 'text-emerald-700 font-bold' 
                                                    : item.dayOfWeek === 'Sunday' 
                                                        ? 'text-red-600 font-bold' 
                                                        : status === 'Today' 
                                                            ? 'text-blue-600 font-bold' 
                                                            : 'text-slate-500 font-semibold'
                                            }>
                                                {statusText}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Subtle Chevron Indicator */}
                                <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
