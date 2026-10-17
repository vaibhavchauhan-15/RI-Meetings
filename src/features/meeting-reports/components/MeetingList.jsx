import React from 'react';
import { SearchX, CalendarX2 } from 'lucide-react';
import MeetingCard from './MeetingCard.jsx';
import { MeetingCardSkeleton } from '../../../components/ui/Skeleton.jsx';

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
            <div className="p-8 bg-slate-50 border border-border-light rounded-2xl text-center flex flex-col items-center justify-center gap-2">
                <SearchX className="w-9 h-9 text-slate-400 animate-bounce-subtle" />
                <h4 className="text-sm font-bold text-slate-800">No Meetings Found</h4>
                <p className="text-xs text-slate-500 max-w-xs">
                    No operational meeting matches your search query "{searchQuery}". Try searching by site name, date (02-09-2026), or machine model.
                </p>
            </div>
        );
    }

    if (!isSearching && meetings.length === 0) {
        return (
            <div className="p-8 bg-slate-50 border border-border-light rounded-2xl text-center flex flex-col items-center justify-center gap-2">
                <CalendarX2 className="w-9 h-9 text-slate-400 animate-pulse-subtle" />
                <h4 className="text-sm font-bold text-slate-800">No Meetings Recorded</h4>
                <p className="text-xs text-slate-500 max-w-xs">
                    There are no operational meetings logged for this selected month in the Reach database.
                </p>
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
