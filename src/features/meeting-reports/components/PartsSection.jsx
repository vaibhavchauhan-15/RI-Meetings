import React from 'react';
import { Package } from 'lucide-react';

/**
 * Section 2: Parts, Procurement & Inventory Table
 * Adheres strictly to design.md clean-table-responsive guidelines with horizontal touch scroll.
 */
export function PartsSection({ parts = [] }) {
    if (!parts || parts.length === 0) return null;

    return (
        <section className="flex flex-col gap-3" aria-labelledby="section-parts-title">
            <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-theme-parts flex-shrink-0 transition-transform duration-300 hover:scale-110" />
                    <h3 id="section-parts-title" className="text-xs sm:text-sm font-bold text-slate-900 tracking-wide uppercase">
                        2. Parts, Procurement & Inventory
                    </h3>
                </div>
                <span className="text-[11px] font-bold text-theme-parts bg-teal-50 border border-teal-200/80 px-2 py-0.5 rounded-md">
                    {parts.length} {parts.length === 1 ? 'Part' : 'Parts'} Listed
                </span>
            </div>

            <div className="clean-table-responsive w-full overflow-x-auto rounded-xl border border-border-light bg-white shadow-2xs">
                <table className="w-full text-left border-collapse min-w-[560px]">
                    <thead>
                        <tr className="bg-slate-50/80 border-b border-border-light text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                            <th className="py-2.5 px-3 sm:px-4 w-12 text-center">#</th>
                            <th className="py-2.5 px-3 sm:px-4 w-1/3">Part / Component</th>
                            <th className="py-2.5 px-3 sm:px-4 w-1/4">Equipment / Site Context</th>
                            <th className="py-2.5 px-3 sm:px-4">Status & Next Steps</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs sm:text-[13px] text-slate-800">
                        {parts.map((p, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                                <td className="py-3 px-3 sm:px-4 text-center font-bold text-slate-400 text-[11px]">
                                    {idx + 1}
                                </td>
                                <td className="py-3 px-3 sm:px-4 font-semibold text-slate-900">
                                    {p.part || p.part_name || 'Component'}
                                </td>
                                <td className="py-3 px-3 sm:px-4 text-slate-600 font-medium">
                                    {p.context || p.equipment_context || '—'}
                                </td>
                                <td className="py-3 px-3 sm:px-4 text-slate-700">
                                    {p.statusNextSteps || p.status_next_steps || '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default PartsSection;
