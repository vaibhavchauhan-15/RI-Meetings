import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button.jsx';

/**
 * Reach International Operations - Standardized NoSearchResults Component
 * 
 * Strictly differentiated from general EmptyState.
 * Triggered when a non-empty dataset is filtered down to 0 results.
 * 
 * @param {Object} props
 * @param {string} props.query - Active search query or filter string
 * @param {string} [props.filters] - Active filter summary (e.g. "October 2026")
 * @param {Function} props.onClear - Handler to reset search query and active filters
 * @param {Array<string>} [props.suggestions] - Helpful keywords to suggest
 * @param {string} [props.className='']
 */
export function NoSearchResults({
    query = '',
    filters = '',
    onClear,
    suggestions = ['Indan', 'Sanand', 'Z-45', 'Toyota Forklift', 'Hydraulic leak'],
    className = ''
}) {
    return (
        <div 
            role="status"
            className={`w-full bg-white border border-border-light rounded-2xl p-7 sm:p-10 text-center flex flex-col items-center justify-center gap-4 shadow-2xs ${className}`}
        >
            {/* Visual Icon Badge */}
            <div className="w-13 h-13 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-600 flex items-center justify-center flex-shrink-0 shadow-2xs">
                <SearchX className="w-6 h-6 animate-bounce-subtle" />
            </div>

            {/* Title & Message */}
            <div className="max-w-md mx-auto flex flex-col gap-1.5">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                    {query ? `No results found for "${query}"` : 'No matching records found'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                    {filters ? (
                        <>We couldn't find any matches matching your filters in <strong className="text-slate-700">{filters}</strong>. Try refining your keywords or clear your search.</>
                    ) : (
                        <>We couldn't find any operational meetings, machines, or parts matching your query. Check for typos or reset your filters.</>
                    )}
                </p>
            </div>

            {/* Suggestions Chips (if provided) */}
            {suggestions && suggestions.length > 0 && onClear && (
                <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-sm pt-1">
                    <span className="text-[11px] text-slate-400 font-semibold mr-1">Suggestions:</span>
                    {suggestions.slice(0, 4).map((sugg) => (
                        <button
                            key={sugg}
                            type="button"
                            onClick={() => {
                                if (typeof window !== 'undefined') {
                                    const input = document.querySelector('input[type="text"][placeholder*="search" i]');
                                    if (input) {
                                        input.value = sugg;
                                        input.dispatchEvent(new Event('input', { bubbles: true }));
                                    }
                                }
                            }}
                            className="text-[11px] font-medium px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg transition-colors cursor-pointer active:scale-95"
                        >
                            {sugg}
                        </button>
                    ))}
                </div>
            )}

            {/* Action CTA: Clear Filters / Reset Search */}
            {onClear && (
                <div className="pt-1">
                    <Button
                        variant="primary"
                        size="md"
                        shape="rounded"
                        onClick={onClear}
                        leftIcon={<RotateCcw className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-rotate-90" />}
                    >
                        Clear Search & Filters
                    </Button>
                </div>
            )}
        </div>
    );
}

export default NoSearchResults;
