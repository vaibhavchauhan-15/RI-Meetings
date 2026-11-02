# Reach International — Production UI States Reference

**Design System Version:** 2.1.0  
**Compliance:** 100% Token-Driven, WCAG 2.2 AA Accessible, Zero Simulated Mocks  
**Barrel Exports:** `src/components/states/index.js` (and `src/components/feedback/index.js`)

---

## Architecture Overview

All user interface feedback states in Reach International are powered by a centralized, token-driven state system. Every state fires strictly from real operational triggers (database query results, active network events, Supabase auth/RLS responses, and mutation lifecycle completions)—never from manual or mock triggers.

All user-facing copy is managed centrally in `src/lib/constants/messages.js`, and all backend errors are safely normalized into a typed `AppError { code, status, userMessage, retryable }` structure via `src/lib/errors/AppError.js`.

---

## Core Production UI States Matrix

| # | State | Real Production Trigger | Canonical Component | Key Behavior & Constraints |
|---|-------|-------------------------|---------------------|----------------------------|
| 1 | **Empty (First Use)** | Database query resolves with 0 rows and no search/filter active. | `<EmptyState />` | High-contrast icon, bold title, 1-line explanation. Primary CTA rendered only when permission (`canCreate`) is satisfied. |
| 2 | **Loading (Skeletons)** | Initial route fetch, month transition, or document load. | `<MeetingCardSkeleton />`, `<MeetingDocumentSkeleton />`, `<CalendarSkeleton />`, `<Skeleton />` | Layout-matching animated skeleton frames. Strictly no layout shift; no full-page blocking spinners. |
| 3 | **Inline & Section Error** | Failed fetch, timeout, or query rejection. | `<InlineError />` / `<ErrorBoundary />` | Contained card/banner with retry button, machine-readable error code tag, and sanitized user message. Raw SQL/schema never leaked. |
| 4 | **Offline** | `navigator.onLine === false` and `offline` browser event. | `<OfflineBanner />` / `<OfflineState />` | Persistent top bar with active connectivity re-check; cached records remain readable. Brief green banner upon reconnect. |
| 5 | **Slow Network** | Active HTTP/Supabase query exceeding `SLOW_REQUEST_THRESHOLD_MS` (5000ms). | `<SlowNetworkBanner />` | Non-blocking bottom banner showing real latency status. Auto-dismisses when request settles; includes cancel action. |
| 6 | **No Search Results** | Search query or filter returns 0 records on non-empty dataset. | `<NoSearchResults />` | Displays active query, "Clear Search & Filters" CTA, and suggestion keywords. Distinct from State 1. |
| 7 | **Permission Denied (403)** | Supabase RLS denial (`42501`) or RBAC route check. | `<PermissionDenied />` | Explains required authorization role, dispatches role elevation request, and provides "Return to Dashboard" action. |
| 8 | **Session Expired (401)** | Expired Supabase JWT (`PGRST301`) or 401 HTTP response. | `<SessionExpiredModal />` | Modal offering in-place token renewal (`refreshSession`) or login redirect preserving `returnTo` URL parameter and active drafts. |
| 9 | **Form Validation** | Zod or field validation schema rejection. | `<FormField />`, `<FormInput />`, `useFormValidation()` | Accessible `aria-invalid`, `aria-describedby` error linking, automatic focus on first invalid field, and server error mapping. |
| 10 | **Success Feedback** | Completed database mutation or Excel export. | `<ToastProvider />` (`useToast()`), `<SuccessView />` | Toast notification for standard operations (deduplicated, max 5 stack). Dedicated `SuccessView` for major verified operations. |

---

## Usage Guide & Code Snippets

### 1. Empty State
```jsx
import { EmptyState } from '@/components/states';
import { CalendarX2 } from 'lucide-react';

<EmptyState
    icon={CalendarX2}
    title="No Meetings Recorded"
    description="There are no operational meetings logged for this selected month."
    action={<Button variant="primary">Create Meeting</Button>}
    canCreate={hasSupervisorRole}
/>
```

### 2. Loading State (Layout Skeletons)
```jsx
import { MeetingCardSkeleton } from '@/components/states';

if (isLoading) {
    return (
        <div className="flex flex-col gap-2.5">
            <MeetingCardSkeleton />
            <MeetingCardSkeleton />
        </div>
    );
}
```

### 3. Inline Section Error
```jsx
import { InlineError } from '@/components/states';

{error && (
    <InlineError
        error={error}
        variant="card"
        onRetry={refetchData}
        onDismiss={clearError}
    />
)}
```

### 4. Offline Banner
```jsx
import { OfflineBanner } from '@/components/states';

// Placed at root layout
<OfflineBanner onRetry={recheckConnection} />
```

### 5. Slow Network Banner
```jsx
import { SlowNetworkBanner } from '@/components/states';

// Placed in layout; triggers automatically on queries taking >5000ms
<SlowNetworkBanner />
```

### 6. No Search Results
```jsx
import { NoSearchResults } from '@/components/states';

<NoSearchResults
    query={searchQuery}
    onClear={() => setSearchQuery('')}
    suggestions={['Sanand', 'Indan', 'JLG 800AJ', 'Hydraulic leak']}
/>
```

### 7. Permission Denied (403)
```jsx
import { PermissionDenied } from '@/components/states';

if (isAccessForbidden) {
    return (
        <PermissionDenied
            resource="Plant Fleet Breakdowns"
            requiredRole="Operations Supervisor / Manager"
            onReturnHome={() => navigate('/dashboard')}
        />
    );
}
```

### 8. Session Expired (401)
```jsx
import { SessionExpiredModal } from '@/components/states';

// Listens to global authEvents 'session_expired' from apiClient
<SessionExpiredModal />
```

### 9. Form Validation
```jsx
import { FormField, FormInput, useFormValidation } from '@/components/states';

const { values, errors, handleChange, handleBlur, handleSubmit, formRef } = useFormValidation({
    initialValues: { siteName: '' },
    rules: { siteName: { required: true, requiredMessage: 'Project site is required.' } },
    onSubmit: async (data) => { await saveReport(data); }
});

<form ref={formRef} onSubmit={handleSubmit}>
    <FormField id="siteName" label="Site Name" required error={errors.siteName}>
        <FormInput
            id="siteName"
            value={values.siteName}
            onChange={(e) => handleChange('siteName', e.target.value)}
            onBlur={() => handleBlur('siteName')}
            error={errors.siteName}
        />
    </FormField>
</form>
```

### 10. Success Notifications
```jsx
import { useToast } from '@/components/states';

const toast = useToast();

const handleExport = async () => {
    try {
        await exportToExcel(records);
        toast.success('Breakdown report exported successfully to Excel.', 'Export Complete');
    } catch (err) {
        toast.error('Failed to generate Excel export file.', 'Export Error');
    }
};
```
