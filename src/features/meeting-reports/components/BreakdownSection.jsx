import React from 'react';
import { Wrench } from 'lucide-react';
import BreakdownCard from './BreakdownCard.jsx';

/**
 * Section 1: Machine Breakdowns & Site Updates Container
 * Renders desktop 2-column grid (minmax(420px, 1fr)) and mobile 1-column stack.
 */
export function BreakdownSection({ breakdowns = [] }) {
    if (!breakdowns || breakdowns.length === 0) return null;

    return (
        <section className="flex flex-col gap-3" aria-labelledby="section-breakdowns-title">
            <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-theme-breakdown flex-shrink-0 transition-transform duration-300 hover:rotate-12" />
                    <h3 id="section-breakdowns-title" className="text-xs sm:text-sm font-bold text-slate-900 tracking-wide uppercase">
                        1. Machine Breakdowns & Site Updates
                    </h3>
                </div>
                <span className="text-[11px] font-bold text-theme-breakdown bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-md">
                    {breakdowns.length} {breakdowns.length === 1 ? 'Machine' : 'Machines'} Logged
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-3.5">
                {breakdowns.map((machine, idx) => (
                    <BreakdownCard 
                        key={machine.id || `${machine.site}-${machine.serialNumber || idx}-${idx}`}
                        machine={machine}
                        index={idx}
                    />
                ))}
            </div>
        </section>
    );
}

export default BreakdownSection;
