import React from 'react';
import { CalendarX2 } from 'lucide-react';
import MeetingCard from './MeetingCard.jsx';
import { MeetingCardSkeleton } from '../../../components/ui/Skeleton.jsx';
import { EmptyState, NoSearchResults } from '../../../components/feedback/index.js';

/**
 * MeetingList Component
 * Renders the vertical scrollable stream of meeting cards, search results, or loading skeletons.
 */
export function MeetingList({
    meetings = [],
    selectedMeetingId,
    onSelectMeeting,
    onOpenCalendar,
    isLoading = false,
    isSearching = false,
    searchQuery = '',
    onClearSearch,
    containerRef
}) {
    if (isLoading) {
        return (
            <div className="flex flex-col gap-2.5 overflow-y-auto pr-1">
                <MeetingCardSkeleton />
                <MeetingCardSkeleton />
                <MeetingCardSkeleton />
                <MeetingCardSkeleton />
            </div>
        );
    }

    if (isSearching && meetings.length === 0) {
        return (
            <div className="p-4 sm:p-6 bg-slate-50/60 rounded-2xl border border-border-light">
                <NoSearchResults 
                    query={searchQuery} 
                    onClearSearch={onClearSearch}
                    suggestions={[
                        'Check for typos in machine models or site names',
                        'Search by date format: "26-10-2026" or "2026-10-26"',
                        'Search by stakeholder (e.g. "Raj Kishore", "Pradeep", "Dheeraj")',
                        'Search by component (e.g. "cylinder", "battery", "pipe", "cable")'
                    ]}
                />
            </div>
        );
    }

    if (!isSearching && meetings.length === 0) {
        return (
            <div className="p-4 sm:p-6 bg-slate-50/60 rounded-2xl border border-border-light">
                <EmptyState
                    icon={CalendarX2}
                    title="No Meetings Recorded"
                    description="There are no operational meetings logged for this selected month in the Reach database."
                />
            </div>
        );
    }

    return (
        <div 
            ref={containerRef}
            className="flex flex-col gap-2.5 overflow-y-auto pr-1 custom-scrollbar min-h-0 flex-1"
        >
            {meetings.map((meeting) => {
                const meetingId = meeting.id || `meet-${meeting.date}`;
                const isSelected = selectedMeetingId === meetingId || selectedMeetingId === meeting.date;

                return (
                    <MeetingCard
                        key={meetingId}
                        meeting={meeting}
                        isSelected={isSelected}
                        onSelect={onSelectMeeting}
                        onOpenCalendar={onOpenCalendar}
                    />
                );
            })}
        </div>
    );
}

export default MeetingList;
