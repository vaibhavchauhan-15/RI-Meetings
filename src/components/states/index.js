/**
 * Reach International Operations - Production UI States Barrel
 * 
 * Central access point for all 10 token-driven state components:
 * 1. EmptyState (first use / 0 rows)
 * 2. Skeleton Loaders & Spinners (loading & route transitions)
 * 3. InlineError & ErrorBoundary (inline section failures & caught errors)
 * 4. OfflineBanner & OfflineState (network disconnected alert & screen)
 * 5. SlowNetworkBanner (real latency >5000ms banner)
 * 6. NoSearchResults (filtered 0 rows with query & clear CTA)
 * 7. PermissionDenied (HTTP 403 / RBAC access restriction)
 * 8. SessionExpiredModal (HTTP 401 JWT expiration flow)
 * 9. FormField, FormInput, useFormValidation (accessible field validation)
 * 10. SuccessView, ToastProvider, useToast (completed actions & notifications)
 */

// State 1: Empty State
export { EmptyState } from '../feedback/EmptyState.jsx';

// State 2: Loading State
export { 
    Skeleton, 
    MeetingCardSkeleton, 
    MeetingDocumentSkeleton, 
    CalendarSkeleton, 
    TableSkeleton 
} from '../feedback/Skeleton.jsx';
export { Spinner } from '../feedback/Spinner.jsx';

// State 3: Inline Error & Boundary
export { InlineError } from '../feedback/InlineError.jsx';
export { ErrorBoundary } from '../ui/ErrorBoundary.jsx';

// State 4: Offline State
export { OfflineBanner, OfflineState } from '../feedback/OfflineBanner.jsx';

// State 5: Slow Network State
export { SlowNetworkBanner } from '../feedback/SlowNetworkBanner.jsx';

// State 6: No Search Results
export { NoSearchResults } from '../feedback/NoSearchResults.jsx';

// State 7: Permission Denied (403)
export { PermissionDenied } from '../feedback/PermissionDenied.jsx';

// State 8: Session Expired (401)
export { SessionExpiredModal } from '../feedback/SessionExpiredModal.jsx';

// State 9: Form Validation
export { FormField } from '../form/FormField.jsx';
export { FormInput } from '../form/FormInput.jsx';
export { useFormValidation } from '../form/useFormValidation.js';

// State 10: Success Feedback & Notifications
export { SuccessView } from '../feedback/SuccessView.jsx';
export { ToastItem, ToastProvider, useToast } from '../feedback/ToastProvider.jsx';

// Central Messages & Normalization
export { STATE_MESSAGES } from '../../lib/constants/messages.js';
export { AppError, normalizeError, getUserErrorMessage } from '../../lib/errors/AppError.js';
