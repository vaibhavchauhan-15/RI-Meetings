import React from 'react';

/**
 * Section 4: Key Action Items & Ownership Container
 * Adheres strictly to design.md: Emerald background (#f0fdf4) with border-left: 4px solid #10b981.
 */
export function ActionItemsSection({ actionItems = [] }) {
    if (!actionItems || actionItems.length === 0) return null;

    return (
        <section className="flex flex-col gap-3" aria-labelledby="section-actions-title">
            <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-theme-action flex-shrink-0" />
                    <h3 id="section-actions-title" className="text-xs sm:text-sm font-bold text-slate-900 tracking-wide uppercase">
                        4. Key Action Items & Ownership
                    </h3>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md">
                    {actionItems.length} {actionItems.length === 1 ? 'Action Item' : 'Action Items'}
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {actionItems.map((act, idx) => (
                    <div 
                        key={idx}
                        className="p-3 sm:p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/70 border-l-[4px] border-l-theme-action shadow-2xs flex flex-col gap-1.5"
                    >
                        <div className="flex items-center gap-1.5 font-bold text-xs sm:text-[13px] text-emerald-950">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] flex-shrink-0">
                                👤
                            </span>
                            <span>{act.person}</span>
                        </div>
                        <p className="text-xs sm:text-[12.5px] text-slate-800 leading-relaxed pl-6.5">
                            {act.task}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default ActionItemsSection;
