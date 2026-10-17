/**
 * Reach International Operations - Meeting Utilities (Backward Compatibility Re-export)
 */

export * from '../features/meeting-reports/utils/meetingDateUtils.js';
export * from '../features/meeting-reports/utils/meetingFormatters.js';
export * from '../features/meeting-reports/utils/searchEngine.js';

// Re-export backward compatible machine field extractor without loading heavy ExcelJS
export { extractMachineFields } from '../features/meeting-reports/services/excelExportService.js';
export { 
    exportMeetingBreakdownsToExcel, 
    exportMonthBreakdownsToExcel 
} from '../features/meeting-reports/services/excelExportService.js';
