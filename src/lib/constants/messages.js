/**
 * Reach International Operations - Centralized UI State Messages
 * 
 * Single source of truth for all user-facing state copy across web and mobile.
 * Ensures zero scattered inline strings and 100% design system tone consistency.
 */

export const STATE_MESSAGES = {
    // 1. Empty State (First Use)
    empty: {
        defaultTitle: 'No Records Found',
        defaultDescription: 'There are currently no operational records logged in this section.',
        meetingsTitle: 'No Operational Meetings',
        meetingsDescription: 'There are currently no operational breakdown summaries or fleet reports logged for this selected month.',
        breakdownsTitle: 'Zero Fleet Breakdowns',
        breakdownsDescription: 'No equipment breakdowns were reported across project sites for this operational shift.',
        partsTitle: 'No Spare Parts Requisitioned',
        partsDescription: 'No replacement parts or components were requested during this review.',
        directivesTitle: 'No Management Directives',
        directivesDescription: 'No executive directives or plant instructions were recorded.',
        actionItemsTitle: 'No Action Items Assigned',
        actionItemsDescription: 'All immediate operational actions have been resolved or none were assigned.',
        createAction: 'Create Record',
        selectMonthAction: 'Select Active Month',
    },

    // 2. Loading State (Skeletons)
    loading: {
        fetchingMeetings: 'Loading operational meeting records...',
        fetchingDocument: 'Retrieving daily fleet breakdown report...',
        fetchingCalendar: 'Syncing 2026 holiday calendar...',
        exportingExcel: 'Generating monthly breakdown Excel report...',
        syncingSupabase: 'Verifying data with Supabase...',
    },

    // 3. Inline & Boundary Error State
    error: {
        defaultTitle: 'Operation Failed',
        defaultMessage: 'An unexpected error occurred while communicating with the Reach database.',
        databaseError: 'Unable to fetch operational data. Please check your network connection.',
        networkError: 'Network connectivity issue. Please verify your connection.',
        notFoundTitle: 'Record Not Found',
        notFoundMessage: 'The requested operational meeting or equipment report does not exist or has been archived.',
        rateLimitTitle: 'Rate Limit Reached (HTTP 429)',
        rateLimitMessage: 'Too many requests were sent in a short period. Please wait a moment before trying again.',
        serverErrorTitle: 'Service Unavailable (HTTP 500)',
        serverErrorMessage: 'The Reach operations backend encountered a temporary error. The incident has been logged.',
        retryAction: 'Try Again',
        dismissAction: 'Dismiss',
        reloadAction: 'Reload View',
    },

    // 4. Offline State
    offline: {
        bannerText: 'You are currently offline. Viewing cached operational records.',
        reconnectedText: 'Internet connection restored. Live database sync active.',
        fullViewTitle: 'No Internet Connection',
        fullViewDescription: 'Your device appears to be offline. Reach International operational records require an active network connection to load fresh breakdowns.',
        retryConnectionAction: 'Retry Connection',
        checkingStatus: 'Checking connection...',
    },

    // 5. Slow Network State
    slowNetwork: {
        bannerTitle: 'Slow Connection Detected',
        latencyMessage: 'Your request is taking longer than expected (>5s). Still fetching data...',
        hardware2gMessage: 'Slow 2G network detected. Operational data may take longer to load.',
        dataSaverMessage: 'Data Saver mode detected. Optimizing bandwidth consumption.',
        cancelAction: 'Cancel Request',
        dismissAction: 'Dismiss',
    },

    // 6. No Search Results State
    noSearchResults: {
        title: (query) => query ? `No results found for "${query}"` : 'No matching records found',
        description: (filters) => filters 
            ? `We couldn't find any operational records matching your filters in ${filters}. Try refining keywords or resetting filters.`
            : `We couldn't find any operational meetings, machines, or parts matching your query. Check for typos or clear your search.`,
        clearAction: 'Clear Search & Filters',
        suggestionsLabel: 'Suggested Searches:',
        defaultSuggestions: [
            'Indan site',
            'Sanand project',
            'Genie Z-45 boom',
            'Toyota Forklift',
            'Hydraulic cylinder leak'
        ]
    },

    // 7. Forbidden / Permission Denied (HTTP 403)
    forbidden: {
        badge: 'HTTP 403 · Access Forbidden',
        title: 'Permission Denied',
        description: (resource, role) => `Your account credentials lack permission to access ${resource || 'this operational section'}. This action requires ${role || 'Supervisor / Manager'} authorization.`,
        requestAccess: 'Request Role Elevation',
        requestDispatched: 'Role elevation request dispatched to Plant Administrator.',
        returnHomeAction: 'Return to Dashboard',
        needClearance: 'Need clearance for this equipment fleet?',
    },

    // 8. Session Expired (HTTP 401)
    sessionExpired: {
        badge: 'HTTP 401 · Authentication Required',
        title: 'Session Expired',
        description: 'Your secure session has timed out. To prevent unauthorized operational record changes, please re-authenticate or refresh your session.',
        draftSaved: 'Active form draft preserved. You will return directly to this view upon sign-in.',
        refreshAction: 'Refresh Session',
        reloginAction: 'Sign In Again',
        refreshing: 'Renewing session...',
    },

    // 9. Form Validation
    validation: {
        requiredField: (name) => `${name || 'This field'} is required.`,
        minLength: (name, min) => `${name || 'Field'} must be at least ${min} characters.`,
        invalidFormat: (name) => `Please enter a valid format for ${name || 'this field'}.`,
        summaryError: 'Please correct the highlighted errors before submitting.',
    },

    // 10. Success Feedback
    success: {
        copiedToClipboard: 'Meeting summary copied to clipboard.',
        excelExportSuccess: 'Monthly breakdown report exported successfully.',
        recordSaved: 'Equipment breakdown successfully recorded in database.',
        backToDashboardAction: 'Back to Dashboard',
    }
};

export default STATE_MESSAGES;
