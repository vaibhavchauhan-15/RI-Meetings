import React from 'react';
import { Search, X } from 'lucide-react';

/**
 * MonthFilterBar Component
 * Renders horizontal scrollable month pills and year switcher conforming to design.md.
 */
export function MonthFilterBar({
    yearsData,
    selectedYear,
    onSelectYear,
    selectedMonth,
    onSelectMonth,
    isSearching = false,
    searchQuery = '',
    onClearSearch
}) {
    if (isSearching) {
        return (
            <div className="flex items-center justify-between py-1 px-1.5 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs flex-shrink-0">
                <span className="text-slate-700 font-medium pl-1 inline-flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-theme-breakdown flex-shrink-0" />
                    <span>Searching for: <strong className="text-theme-breakdown font-bold">"{searchQuery}"</strong></span>
                </span>
                <button
                    type="button"
                    onClick={onClearSearch}
                    className="text-[11px] font-bold text-slate-500 hover:text-slate-800 px-2 py-0.5 rounded hover:bg-blue-100/60 transition-colors cursor-pointer inline-flex items-center gap-1 group"
                >
                    <span>Clear Filter</span>
                    <X className="w-3 h-3 transition-transform duration-200 group-hover:rotate-90" />
                </button>
            </div>
        );
    }

    if (!yearsData || !yearsData.years || yearsData.years.length === 0) {
        return null;
    }

    const currentYearObj = yearsData.years.find(y => y.year === selectedYear) || yearsData.years[0];
    const availableMonths = currentYearObj?.months || [];

    return (
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5 flex-shrink-0 select-none">
            {/* Year Switcher (if more than 1 year) */}
            {yearsData.years.length > 1 && (
                <div className="flex items-center gap-1 bg-white p-0.5 rounded-xl border border-border-light shadow-2xs mr-1">
                    {yearsData.years.map(y => (
                        <button
                            key={y.year}
                            type="button"
                            onClick={() => onSelectYear(y.year)}
                            className={`text-xs font-bold px-2 py-1 rounded-lg transition-all cursor-pointer ${
                                selectedYear === y.year
                                    ? 'bg-slate-900 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            {y.year}
                        </button>
                    ))}
                </div>
            )}

            {/* Month Filter Pills Strip */}
            {availableMonths.map(m => {
                const isSelected = selectedMonth === m.month;
                return (
                    <button
                        key={m.month}
                        type="button"
                        onClick={() => onSelectMonth(m.month)}
                        className={`month-pill-btn text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-150 cursor-pointer flex items-center gap-1.5 flex-shrink-0 min-h-[36px] ${
                            isSelected
                                ? 'bg-theme-breakdown text-white shadow-pill-active scale-[1.02]'
                                : 'bg-white hover:bg-slate-50 text-slate-700 border border-border-light shadow-2xs active:scale-95'
                        }`}
                    >
                        <span>{m.name}</span>
                        {m.meetingCount > 0 && (
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                                isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                            }`}>
                                {m.meetingCount}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

export default MonthFilterBar;
