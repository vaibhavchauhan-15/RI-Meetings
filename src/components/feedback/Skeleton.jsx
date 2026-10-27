import React from 'react';

/**
 * Reach International Operations - Animated Skeleton Loaders
 * Meets strict design rules: Layout-matching animated skeleton loaders instead of isolated spinners.
 */

export function Skeleton({ className = '', rounded = 'rounded-md', ...props }) {
    return (
        <div
            className={`animate-pulse bg-slate-200/80 ${rounded} ${className}`}
            {...props}
        />
    );
}

/**
 * Skeleton loader matching a single Meeting Card in the stream
 */
export function MeetingCardSkeleton() {
    return (
        <div className="bg-white border border-border-light rounded-xl p-3.5 flex flex-col gap-2.5 animate-pulse">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Skeleton className="w-16 h-5" rounded="rounded-md" />
                    <Skeleton className="w-20 h-4" rounded="rounded-md" />
                </div>
                <Skeleton className="w-16 h-5" rounded="rounded-full" />
            </div>
            <Skeleton className="w-3/4 h-3.5" rounded="rounded-md" />
            <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                <Skeleton className="w-14 h-4" rounded="rounded-md" />
                <Skeleton className="w-14 h-4" rounded="rounded-md" />
                <Skeleton className="w-14 h-4" rounded="rounded-md" />
            </div>
        </div>
    );
}

/**
 * Skeleton loader matching the full Operational Document view
 */
export function MeetingDocumentSkeleton() {
    return (
        <div className="bg-white border border-border-light rounded-2xl shadow-card p-4 sm:p-6 lg:p-8 flex flex-col gap-6 animate-pulse">
            {/* Header placeholder */}
            <div className="flex flex-col gap-3 pb-6 border-b border-border-light">
                <div className="flex items-center justify-between">
                    <Skeleton className="w-48 h-7 sm:h-8" rounded="rounded-lg" />
                    <Skeleton className="w-24 h-6" rounded="rounded-full" />
                </div>
                <Skeleton className="w-full max-w-xl h-4" rounded="rounded-md" />
                <div className="flex gap-2 pt-2">
                    <Skeleton className="w-20 h-6" rounded="rounded-md" />
                    <Skeleton className="w-20 h-6" rounded="rounded-md" />
                    <Skeleton className="w-20 h-6" rounded="rounded-md" />
                </div>
            </div>

            {/* Section 1: Breakdowns placeholder */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <Skeleton className="w-6 h-6" rounded="rounded-md" />
                    <Skeleton className="w-40 h-5" rounded="rounded-md" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
                    <div className="p-4 rounded-xl border border-border-light bg-slate-50/50 flex flex-col gap-2.5">
                        <Skeleton className="w-1/2 h-4" rounded="rounded-md" />
                        <Skeleton className="w-full h-10" rounded="rounded-md" />
                        <Skeleton className="w-3/4 h-8" rounded="rounded-md" />
                    </div>
                    <div className="p-4 rounded-xl border border-border-light bg-slate-50/50 flex flex-col gap-2.5">
                        <Skeleton className="w-1/2 h-4" rounded="rounded-md" />
                        <Skeleton className="w-full h-10" rounded="rounded-md" />
                        <Skeleton className="w-3/4 h-8" rounded="rounded-md" />
                    </div>
                </div>
            </div>

            {/* Section 2: Table placeholder */}
            <div className="flex flex-col gap-3">
                <Skeleton className="w-36 h-5" rounded="rounded-md" />
                <div className="rounded-xl border border-border-light p-3 flex flex-col gap-2">
                    <Skeleton className="w-full h-8" rounded="rounded-md" />
                    <Skeleton className="w-full h-6" rounded="rounded-md" />
                    <Skeleton className="w-full h-6" rounded="rounded-md" />
                </div>
            </div>
        </div>
    );
}

/**
 * Skeleton loader matching the 7x5 Holiday Calendar Grid
 */
export function CalendarSkeleton() {
    return (
        <div className="bg-white border border-border-light rounded-2xl shadow-card p-3 sm:p-4 flex flex-col gap-3 animate-pulse">
            <div className="flex items-center justify-between pb-2 border-b border-border-light">
                <Skeleton className="w-32 h-6" rounded="rounded-md" />
                <div className="flex gap-1.5">
                    <Skeleton className="w-7 h-7" rounded="rounded-lg" />
                    <Skeleton className="w-7 h-7" rounded="rounded-lg" />
                </div>
            </div>
            {/* Days header */}
            <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                    <Skeleton key={i} className="w-full h-4" rounded="rounded-sm" />
                ))}
            </div>
            {/* Grid cells */}
            <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }).map((_, i) => (
                    <Skeleton key={i} className="w-full h-9 sm:h-10" rounded="rounded-lg" />
                ))}
            </div>
        </div>
    );
}

/**
 * Skeleton loader matching a clean responsive table
 */
export function TableSkeleton({ rows = 4, cols = 3 }) {
    return (
        <div className="w-full rounded-xl border border-border-light overflow-hidden bg-white animate-pulse">
            <div className="bg-slate-50 border-b border-border-light p-3 flex gap-3">
                {Array.from({ length: cols }).map((_, i) => (
                    <Skeleton key={i} className="flex-1 h-4" rounded="rounded-md" />
                ))}
            </div>
            <div className="divide-y divide-slate-100">
                {Array.from({ length: rows }).map((_, r) => (
                    <div key={r} className="p-3.5 flex gap-3">
                        {Array.from({ length: cols }).map((_, c) => (
                            <Skeleton key={c} className="flex-1 h-4" rounded="rounded-md" />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Skeleton;
