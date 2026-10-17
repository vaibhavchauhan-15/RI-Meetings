import React from 'react';

/**
 * Reach International Operations - Animated Skeleton Loaders
 * Meets strict design rules: Animated skeleton loaders instead of isolated spinners.
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

export default Skeleton;
