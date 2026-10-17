import React, { useState, useMemo, useRef, useEffect } from 'react';
import { CalendarX, Building2 } from 'lucide-react';
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
 * Displays clean interactive list of holidays and festivals with scrollable category filters.
 * Distinguishes Green Company Holidays (Closed) from Amber Festivals & Events (Working Days).
 */
export default function UpcomingHolidays({ 
    selectedDate,
    onSelectDate 
}) {
    const [activeFilter, setActiveFilter] = useState('company'); // 'company' | 'all' | 'Hindu' | 'Islamic' | 'Sikh' | 'Christian' | 'Jain' | 'National'
    const [showAllDates, setShowAllDates] = useState(false);
    const categoryScrollRef = useRef(null);

    // Get current reference date
    const today = new Date();
    const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

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

    const displayedList = useMemo(() => {
        if (showAllDates) {
            return filteredMasterList;
        }
        return upcomingList.length > 0 ? upcomingList.slice(0, 5) : filteredMasterList.slice(0, 5);
    }, [showAllDates, filteredMasterList, upcomingList]);

    // Non-passive horizontal wheel scrolling for categories without passive listener console warning
    useEffect(() => {
        const el = categoryScrollRef.current;
        if (!el) return;
        const onWheel = (e) => {
            const hasHorizontalOverflow = el.scrollWidth > el.clientWidth;
            if (hasHorizontalOverflow && (e.deltaY !== 0 || e.deltaX !== 0)) {
                if (e.cancelable) e.preventDefault();
                e.stopPropagation();
                el.scrollLeft += e.deltaY !== 0 ? e.deltaY : e.deltaX;
            }
        };
        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, []);

    return (
        <div className="flex-1 min-h-0 flex flex-col gap-1.5 pt-1.5 border-t border-border-light select-none">
            {/* Header: Short Title & Segmented Toggle (Upcoming selected by default) */}
            <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-[11px] sm:text-xs font-bold text-slate-900 tracking-tight truncate">
                        {activeFilter === 'company' 
                            ? 'Company Holidays'
                            : activeFilter === 'all'
                                ? 'Indian Calendar'
                                : `${activeFilter} Events`
                        }
                    </span>
                </div>

                {/* View Mode Segmented Control: Upcoming (selected by default) vs All */}
                <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/90 text-[10px] font-bold flex-shrink-0">
                    <button
                        type="button"
                        onClick={() => setShowAllDates(false)}
                        className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                            !showAllDates 
                                ? 'bg-white text-slate-900 shadow-2xs font-extrabold' 
                                : 'text-slate-500 hover:text-slate-800'
                        }`}
                        title="Show upcoming holidays and events"
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
                        title={`View all ${filteredMasterList.length} holidays and events`}
                    >
                        All ({filteredMasterList.length})
                    </button>
                </div>
            </div>

            {/* Category / Religion Filter Strip with Horizontal Scroll (Hidden scrollbar on mobile) */}
            <div 
                ref={categoryScrollRef}
                className="flex items-center gap-1 overflow-x-auto scrollbar-none sm:custom-scrollbar scroll-smooth py-0.5"
            >
                {RELIGION_FILTER_TABS.map(tab => {
                    const isActive = activeFilter === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => {
                                setActiveFilter(tab.id);
                                setShowAllDates(false);
                            }}
                            className={`flex-shrink-0 flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold whitespace-nowrap transition-all duration-150 cursor-pointer border ${
                                isActive
                                    ? tab.id === 'company'
                                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                                        : 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                                    : 'bg-white text-slate-600 hover:text-slate-900 border-border-light hover:bg-slate-50'
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
                                                : tab.id === 'Hindu'
                                                    ? 'text-amber-500'
                                                    : tab.id === 'Sikh'
                                                        ? 'text-amber-500'
                                                        : 'text-slate-500'
                                }`} 
                            />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Events List */}
            {displayedList.length === 0 ? (
                <div className="p-3 text-center bg-slate-50 rounded-lg border border-slate-200/80 flex items-center justify-center gap-2">
                    <CalendarX className="w-3.5 h-3.5 text-slate-400 animate-pulse-subtle flex-shrink-0" />
                    <p className="text-[11px] text-slate-500 font-medium">
                        No upcoming events found for this selection.
                    </p>
                </div>
            ) : (
                <div 
                    onWheel={(e) => e.stopPropagation()}
                    className="flex-1 min-h-[120px] overflow-y-auto pr-1 custom-scrollbar overscroll-contain flex flex-col gap-1"
                >
                    {displayedList.map((item) => {
                        const isSelected = selectedDate === item.date;
                        const status = getRelativeHolidayStatus(item.date, todayISO);
                        const monthShort = MONTH_SHORT_NAMES[item.month - 1];
                        const dayPadded = String(item.day).padStart(2, '0');
                        const isCompany = item.isCompanyHoliday;

                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => onSelectDate(item.date)}
                                className={`w-full flex items-center justify-between gap-2 p-1.5 sm:p-2 rounded-lg text-left transition-all duration-150 cursor-pointer border ${
                                    isSelected
                                        ? isCompany 
                                            ? 'bg-emerald-50/90 border-emerald-400 ring-1 ring-emerald-400/50 shadow-2xs'
                                            : 'bg-amber-50/90 border-amber-400 ring-1 ring-amber-400/50 shadow-2xs'
                                        : 'bg-white hover:bg-slate-50 border-border-light hover:border-slate-300'
                                }`}
                                title={`Jump to ${item.name} on ${item.date}`}
                            >
                                {/* Left: Date Pill */}
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <div className={`w-9 sm:w-9.5 h-8 sm:h-8.5 rounded-md flex flex-col items-center justify-center flex-shrink-0 text-center ${
                                        isSelected 
                                            ? isCompany ? 'bg-emerald-600 text-white font-black' : 'bg-amber-600 text-white font-black'
                                            : isCompany ? 'bg-emerald-100 text-emerald-950 font-black border border-emerald-300/80' : 'bg-slate-100 text-slate-800 font-bold'
                                    }`}>
                                        <span className="text-[11px] leading-none font-black">{dayPadded}</span>
                                        <span className="text-[8px] uppercase leading-none font-extrabold tracking-tight mt-0.5 opacity-90">{monthShort}</span>
                                    </div>

                                    {/* Middle: Event Name & Subtitle */}
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[11px] sm:text-xs font-bold text-slate-900 truncate flex items-center gap-1.5" title={item.name}>
                                            {isCompany ? (
                                                <Building2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                            ) : (
                                                <HolidayEventIcon item={item} className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                                            )}
                                            <span className="truncate">{item.name}</span>
                                        </p>
                                        <p className="text-[9px] text-slate-500 font-medium truncate mt-0.5" title={`${item.dayOfWeek}${item.subLabel ? ` • ${item.subLabel}` : ''}`}>
                                            <span>{item.dayOfWeek}</span>
                                            {item.subLabel && <span className="text-slate-400 ml-1">• {item.subLabel}</span>}
                                        </p>
                                    </div>
                                </div>

                                {/* Right: Status / Type Pill */}
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    {isCompany ? (
                                        <span className="text-[8px] font-black px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900 border border-emerald-300/80 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                            Holiday
                                        </span>
                                    ) : (
                                        <>
                                            {item.dayOfWeek === 'Sunday' && (
                                                <span className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200">
                                                    Weekly Off
                                                </span>
                                            )}
                                            <span className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-900 border border-amber-200/80">
                                                {item.religion || item.category}
                                            </span>
                                        </>
                                    )}

                                    {status === 'Today' && (
                                        <span className="text-[8px] font-black px-1.5 py-0.2 rounded-full bg-cyan-600 text-white shadow-2xs">
                                            Today
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
