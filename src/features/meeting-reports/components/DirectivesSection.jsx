import React from 'react';
import { ShieldAlert, Pin } from 'lucide-react';

/**
 * Section 3: Policy & Process Directives Container
 * Adheres strictly to design.md: Amber background (#fffbeb) with border-left: 4px solid #f59e0b.
 */
export function DirectivesSection({ directives = [] }) {
    if (!directives || directives.length === 0) return null;

    return (
        <section className="flex flex-col gap-3" aria-labelledby="section-directives-title">
            <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-theme-directive flex-shrink-0 transition-transform duration-300 hover:scale-110" />
                    <h3 id="section-directives-title" className="text-xs sm:text-sm font-bold text-slate-900 tracking-wide uppercase">
                        3. Policy & Process Directives
                    </h3>
                </div>
                <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md">
                    {directives.length} {directives.length === 1 ? 'Directive' : 'Directives'}
                </span>
            </div>

            <div className="flex flex-col gap-2.5">
                {directives.map((dir, idx) => (
                    <div 
                        key={idx}
                        className="p-3.5 sm:p-4 rounded-xl bg-amber-50/60 border border-amber-200/70 border-l-[4px] border-l-theme-directive shadow-2xs flex flex-col gap-2 group"
                    >
                        <h4 className="text-xs sm:text-[13px] font-bold text-amber-950 flex items-center gap-1.5">
                            <Pin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 transition-transform duration-200 group-hover:rotate-12" />
                            <span>{dir.title}</span>
                        </h4>
                        {dir.points && dir.points.length > 0 && (
                            <ul className="flex flex-col gap-1.5 pl-4 sm:pl-5 list-disc text-xs sm:text-[12.5px] text-slate-800 leading-relaxed">
                                {dir.points.map((pt, pIdx) => (
                                    <li key={pIdx}>{pt}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}

export default DirectivesSection;
