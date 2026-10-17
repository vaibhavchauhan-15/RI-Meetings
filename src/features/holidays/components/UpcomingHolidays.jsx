import React, { useState, useMemo, useRef } from 'react';
import { 
    MONTH_SHORT_NAMES, 
    RELIGION_FILTER_TABS,
    getRelativeHolidayStatus 
} from '../utils/holidayDateUtils.js';
import { 
    COMPANY_HOLIDAYS_2026, 
    ALL_INDIAN_CALENDAR_EVENTS_2026 
} from '../data/companyHolidays2026.js';

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

    // Horizontal wheel scrolling for categories
    const handleCategoryWheel = (e) => {
        if (categoryScrollRef.current) {
            const hasHorizontalOverflow = categoryScrollRef.current.scrollWidth > categoryScrollRef.current.clientWidth;
            if (hasHorizontalOverflow && (e.deltaY !== 0 || e.deltaX !== 0)) {
                e.preventDefault();
                e.stopPropagation();
                categoryScrollRef.current.scrollLeft += e.deltaY !== 0 ? e.deltaY : e.deltaX;
            }
        }
    };

    return (
        <div className="flex flex-col gap-2 pt-2 border-t border-border-light select-none">
            {/* Header: Short Title, Count & Proper Button */}
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-slate-900 tracking-tight">
                        {activeFilter === 'company' 
                            ? (showAllDates ? 'All Holidays' : 'Upcoming Holidays')
                            : (showAllDates ? `All ${activeFilter}` : `Upcoming ${activeFilter}`)
                        }
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {filteredMasterList.length}
                    </span>
                </div>

                {/* View All / Upcoming Toggle Button */}
                <button
                    type="button"
                    onClick={() => setShowAllDates(prev => !prev)}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 shadow-2xs active:scale-95 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                    {showAllDates ? 'Show Upcoming' : `View All (${filteredMasterList.length})`}
                </button>
            </div>

            {/* Category / Religion Filter Strip with Horizontal Scroll */}
            <div 
                ref={categoryScrollRef}
                onWheel={handleCategoryWheel}
                className="flex items-center gap-1 overflow-x-auto custom-scrollbar scroll-smooth py-1"
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
                            className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all duration-150 cursor-pointer border ${
                                isActive
                                    ? tab.id === 'company'
                                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                                        : 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                                    : 'bg-white text-slate-600 hover:text-slate-900 border-border-light hover:bg-slate-50'
                            }`}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Events List */}
            {displayedList.length === 0 ? (
                <div className="p-3 text-center bg-slate-50 rounded-xl border border-slate-200/80">
                    <p className="text-xs text-slate-500 font-medium">
                        No upcoming events found for this selection.
                    </p>
                </div>
            ) : (
                <div 
                    onWheel={(e) => e.stopPropagation()}
                    className="flex flex-col gap-1.5 max-h-[195px] overflow-y-auto pr-1 custom-scrollbar overscroll-contain"
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
                                className={`w-full flex items-center justify-between gap-2 p-2 rounded-xl text-left transition-all duration-150 cursor-pointer border ${
                                    isSelected
                                        ? isCompany 
                                            ? 'bg-emerald-50 border-emerald-400 ring-1 ring-emerald-400/50 shadow-2xs'
                                            : 'bg-amber-50 border-amber-400 ring-1 ring-amber-400/50 shadow-2xs'
                                        : 'bg-white hover:bg-slate-50 border-border-light hover:border-slate-300'
                                }`}
                                title={`Jump to ${item.name} on ${item.date}`}
                            >
                                {/* Left: Date Pill */}
                                <div className="flex items-center gap-2 min-w-0">
                                    <div className={`w-11 h-9 rounded-lg flex flex-col items-center justify-center flex-shrink-0 text-center ${
                                        isSelected 
                                            ? isCompany ? 'bg-emerald-600 text-white font-black' : 'bg-amber-600 text-white font-black'
                                            : isCompany ? 'bg-emerald-100 text-emerald-950 font-black border border-emerald-300/80' : 'bg-slate-100 text-slate-800 font-bold'
                                    }`}>
                                        <span className="text-[11px] leading-none font-black">{dayPadded}</span>
                                        <span className="text-[9px] uppercase leading-none font-extrabold tracking-tight mt-0.5 opacity-90">{monthShort}</span>
                                    </div>

                                    {/* Middle: Event Name & Subtitle */}
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-bold text-slate-900 truncate flex items-center gap-1">
                                            <span>{item.icon}</span>
                                            <span>{item.name}</span>
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-medium truncate">
                                            {item.dayOfWeek} {item.subLabel ? `• ${item.subLabel}` : ''}
                                        </p>
                                    </div>
                                </div>

                                {/* Right: Status / Type Pill */}
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    {isCompany ? (
                                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300/80 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                            Holiday
                                        </span>
                                    ) : (
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200/80">
                                            {item.religion || item.category}
                                        </span>
                                    )}

                                    {status === 'Today' && (
                                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-emerald-500 text-white shadow-2xs animate-pulse">
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
