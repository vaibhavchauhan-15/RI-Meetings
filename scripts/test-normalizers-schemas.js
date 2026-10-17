/**
 * Unit Test Script for Breakdown Normalizers, Validation Schemas & Error Handling
 * 
 * Verifies Reach International Core Rules:
 * 1. Strictly ONE MACHINE per breakdown card (automatic unbundling).
 * 2. Short, concise, single-line informative problem extraction.
 * 3. Validation catches bundled models and invalid dates.
 * 4. Error hierarchy generates clean user-safe error messages.
 */

import { unbundleBreakdownEntry, extractCleanMachineProblem, cleanShortText } from '../src/features/meeting-reports/utils/breakdownNormalizer.js';
import { validateBreakdownMachine, validateMeetingData } from '../src/features/meeting-reports/schemas/meetingSchemas.js';
import { AppError, DatabaseError, ValidationError, getUserErrorMessage } from '../src/lib/errors/AppError.js';
import { isValidISODate, isSingleLine } from '../src/lib/validation/validator.js';

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
    totalTests++;
    if (condition) {
        console.log(`✓ PASS: ${message}`);
        passedTests++;
    } else {
        console.error(`✗ FAIL: ${message}`);
        process.exitCode = 1;
    }
}

console.log('🧪 Starting Normalizer, Schema & Error Handling Tests...\n');

// ----------------------------------------------------------------------------
// 1. Single Machine Breakdown Normalizer & Unbundler Tests
// ----------------------------------------------------------------------------
console.log('--- 1. Breakdown Normalization & Unbundling ---');

// Test A: Single machine input remains single machine
const singleInput = {
    site: 'Sanand',
    model: 'JLG 800AJ',
    serialNumber: 'SN-1029',
    issue: 'Platform overload cut-off'
};
const singleResult = unbundleBreakdownEntry(singleInput, '2026-10-15');
assert(singleResult.length === 1, 'Single machine input produces exactly 1 breakdown record');
assert(singleResult[0].model === 'JLG 800AJ', 'Model correctly preserved in single machine');
assert(singleResult[0].serialNumber === 'SN-1029', 'Serial number correctly preserved');

// Test B: Composite machine input unbundles into discrete rows
const bundledInput = {
    site: 'Bhiwadi',
    model: 'Boom Lift (Z-45 and S-65)',
    serialNumber: '4550, 6228',
    issue: '(1) Machine 4550 has steering cylinder leak. (2) Machine 6228 has hydraulic pump failure.'
};
const unbundledResult = unbundleBreakdownEntry(bundledInput, '2026-10-15');
assert(unbundledResult.length >= 2, `Bundled machines unbundled into discrete rows (got ${unbundledResult.length})`);
assert(unbundledResult.every(m => !m.serialNumber.includes(',')), 'No unbundled row contains comma-separated serial numbers');

// Test C: Clean machine problem extraction
const rawIssue = 'Severe operational crisis: client issued a formal ultimatum. Platform elevation error cut-off at 2-3 feet height due to sensor / overload fault.';
const cleanProblem = extractCleanMachineProblem(rawIssue, 'Genie Z-45', '5390');
assert(isSingleLine(cleanProblem), 'Clean machine problem is strictly single-line');
assert(!cleanProblem.includes('Severe operational crisis: client issued a formal ultimatum'), 'Narrative preamble successfully stripped');

// ----------------------------------------------------------------------------
// 2. Validation Schema Tests
// ----------------------------------------------------------------------------
console.log('\n--- 2. Validation Schemas & Business Rule Enforcement ---');

// Test A: Valid ISO date checks
assert(isValidISODate('2026-10-16'), '2026-10-16 is recognized as valid ISO date');
assert(isValidISODate('2026-02-28'), '2026-02-28 is valid non-leap year date');
assert(!isValidISODate('2026-02-29'), '2026-02-29 is correctly rejected as invalid for 2026');
assert(!isValidISODate('16-10-2026'), 'Non-ISO date string rejected by isValidISODate');

// Test B: Bundling rejection by schema
let caughtBundleError = false;
try {
    validateBreakdownMachine({
        site: 'Bhiwadi',
        model: 'JLG 800AJ, Genie Z-45',
        serialNumber: '1001, 1002'
    }, 0);
} catch (err) {
    if (err instanceof ValidationError) {
        caughtBundleError = true;
    }
}
assert(caughtBundleError, 'ValidationError thrown when breakdown bundles multiple models or serials');

// Test C: Valid full meeting schema
const validMeeting = validateMeetingData({
    date: '2026-10-16',
    title: '16-10-2026',
    focus: 'Boom lift servicing and hydraulic cylinder overhauls',
    breakdowns: [
        {
            site: 'Sanand',
            model: 'JLG 800AJ',
            serialNumber: 'SN-901',
            issue: 'Platform leveling valve stuck',
            action: 'Anuj cleaned valve spool and recalibrated controller'
        }
    ],
    parts: [],
    directives: [],
    actionItems: []
});
assert(validMeeting.id === 'meet-2026-10-16', 'Meeting ID generated correctly');
assert(validMeeting.breakdowns.length === 1, 'Validated meeting retains single machine card');

// ----------------------------------------------------------------------------
// 3. Centralized Error Handling Tests
// ----------------------------------------------------------------------------
console.log('\n--- 3. Centralized Error Handling & Safe Messaging ---');

const dbErr = new DatabaseError('connection refused to db.internal.net:5432');
assert(dbErr.code === 'DATABASE_ERROR', 'DatabaseError code is DATABASE_ERROR');
const safeMsg = getUserErrorMessage(dbErr);
assert(!safeMsg.includes('5432'), 'Internal database host/port not exposed in user message');
assert(safeMsg.includes('Unable to fetch operational data'), 'User message is informative and friendly');

const plainErr = new Error('fetch failed: ECONNRESET');
assert(getUserErrorMessage(plainErr).includes('Network connectivity issue'), 'Network error mapped to user-friendly message');

console.log(`\n========================================`);
console.log(`SUMMARY: ${passedTests} / ${totalTests} assertions passed.`);
console.log(`========================================\n`);
