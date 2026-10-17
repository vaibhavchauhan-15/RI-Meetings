/**
 * Reach International Operations - Supabase Database Client & Repository (Backward Compatibility Re-export)
 * 
 * Secure re-export pointing to modularized client and service implementations.
 * Zero hardcoded fallback credentials.
 */

export { supabase, checkSupabaseHealth } from './supabase/client.js';
export { 
    fetchBreakdownMachinesFromDb,
    fetchMeetingDetail as fetchMeetingDetailFromDb 
} from '../features/meeting-reports/services/meetingService.js';
