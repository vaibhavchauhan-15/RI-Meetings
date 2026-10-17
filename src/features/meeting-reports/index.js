/**
 * Reach International Operations - Meeting Reports Feature Module
 * 
 * Public API for daily operational meetings, single-machine fleet breakdowns,
 * search indexing, and Excel exports.
 */

// Components
export { default as MeetingSummariesPage } from './components/MeetingSummariesPage.jsx';
export { default as MeetingHeaderBar } from './components/MeetingHeaderBar.jsx';
export { default as MonthFilterBar } from './components/MonthFilterBar.jsx';
export { default as MeetingList } from './components/MeetingList.jsx';
export { default as MeetingCard } from './components/MeetingCard.jsx';
export { default as MeetingDetailDocument } from './components/MeetingDetailDocument.jsx';
export { default as BreakdownCard } from './components/BreakdownCard.jsx';
export { default as BreakdownSection } from './components/BreakdownSection.jsx';
export { default as PartsSection } from './components/PartsSection.jsx';
export { default as DirectivesSection } from './components/DirectivesSection.jsx';
export { default as ActionItemsSection } from './components/ActionItemsSection.jsx';
export { default as ChronologicalNav } from './components/ChronologicalNav.jsx';
export { default as TextHighlightPopup } from './components/TextHighlightPopup.jsx';

// Hooks
export { useMeetingData } from './hooks/useMeetingData.js';
export { useMeetingUrlSync } from './hooks/useMeetingUrlSync.js';
export { useTextHighlighter } from './hooks/useTextHighlighter.js';

// Services
export * from './services/meetingService.js';
export * from './services/excelExportService.js';

// Schemas & Validation
export * from './schemas/meetingSchemas.js';

// Utilities
export * from './utils/breakdownNormalizer.js';
export * from './utils/meetingDateUtils.js';
export * from './utils/meetingFormatters.js';
export * from './utils/searchEngine.js';
