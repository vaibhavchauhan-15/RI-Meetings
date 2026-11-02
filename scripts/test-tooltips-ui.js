import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

console.log('🧪 Starting Tooltips & UI Verification Test...');

// 1. Presentation Toolbar: Icon-Only and Tooltips with Shortcuts
console.log('\n--- 1. Presentation Toolbar Verification ---');
const overlayContent = fs.readFileSync(path.resolve('src/components/shared/PresentationOverlay.jsx'), 'utf8');

// Ensure no visible text words remain on toolbar buttons
assert(!overlayContent.includes('>Pointer</span>'), 'Pointer text label removed from Laser Pointer button');
assert(!overlayContent.includes('>Highlight</span>'), 'Highlight text label removed from Highlighter button');
assert(!overlayContent.includes('>Pen</span>'), 'Pen text label removed from Pen button');
assert(!overlayContent.includes('>Eraser</span>'), 'Eraser text label removed from Eraser button');
assert(!overlayContent.includes('>Exit</span>'), 'Exit text label removed from Exit button');

// Ensure ToolbarTooltip is present with keyboard shortcuts
assert(overlayContent.includes('label="Laser Pointer" shortcut="P"'), 'Laser Pointer tooltip with shortcut P present');
assert(overlayContent.includes('label="Text Highlighter" shortcut="H"'), 'Text Highlighter tooltip with shortcut H present');
assert(overlayContent.includes('label="Freehand Pen" shortcut="D"'), 'Freehand Pen tooltip with shortcut D present');
assert(overlayContent.includes('label="Precision Eraser" shortcut="E"'), 'Precision Eraser tooltip with shortcut E present');
assert(overlayContent.includes('label="Undo" shortcut="Ctrl+Z"'), 'Undo tooltip with shortcut Ctrl+Z present');
assert(overlayContent.includes('label="Minimize Toolbar" shortcut="M"'), 'Minimize Toolbar tooltip with shortcut M present');
assert(overlayContent.includes('label="Exit Presentation" shortcut="Esc"'), 'Exit Presentation tooltip with shortcut Esc present');
assert(overlayContent.includes('shortcut="C"'), 'Clear Annotations tooltip with shortcut C present');
assert(overlayContent.includes('shortcut="F"'), 'Fullscreen tooltip with shortcut F present');
console.log('✓ PASS: All presentation toolbar buttons are icon-only with shortcut tooltips');

// 2. MeetingDetailDocument: Removal of "Operational Meeting Report"
console.log('\n--- 2. MeetingDetailDocument Verification ---');
const detailDocContent = fs.readFileSync(path.resolve('src/features/meeting-reports/components/MeetingDetailDocument.jsx'), 'utf8');
assert(!detailDocContent.includes('Operational Meeting Report'), 'Operational Meeting Report badge is removed');
assert(detailDocContent.includes('Tooltip'), 'Tooltip imported and used in MeetingDetailDocument');
assert(detailDocContent.includes('content={copySuccess ? \'Copied summary!\' : \'Copy summary\'}'), 'Copy Summary button has hover tooltip');
assert(detailDocContent.includes('content={isExportingExcel ? \'Generating Excel report...\' : \'Export breakdowns to Excel (.xlsx)\'}'), 'Excel export button has hover tooltip');
assert(detailDocContent.includes('content="Presentation Mode (Laser & annotations)"'), 'Presentation mode button has hover tooltip with shortcut P');
console.log('✓ PASS: Operational Meeting Report badge removed and action buttons wrapped in Tooltip');

// 3. MeetingShareMenu: Hover Tooltip
console.log('\n--- 3. MeetingShareMenu Verification ---');
const shareMenuContent = fs.readFileSync(path.resolve('src/components/shared/MeetingShareMenu.jsx'), 'utf8');
assert(shareMenuContent.includes('Tooltip'), 'Tooltip imported in MeetingShareMenu');
assert(shareMenuContent.includes('content="Share meeting summary"'), 'Share button has hover tooltip');
console.log('✓ PASS: Share menu button wrapped in Tooltip');

// 4. MeetingHeaderBar: Verified Removal of Redundant Tooltips on Labeled Buttons
console.log('\n--- 4. MeetingHeaderBar Tooltip Verification ---');
const headerBarContent = fs.readFileSync(path.resolve('src/features/meeting-reports/components/MeetingHeaderBar.jsx'), 'utf8');
assert(!headerBarContent.includes('Tooltip'), 'Unwanted Tooltip wrapper removed from MeetingHeaderBar');
assert(!headerBarContent.includes('content="Return to all operational meetings archive"'), 'Back to All Meetings redundant tooltip removed');
assert(!headerBarContent.includes('Hide Holiday Calendar sidebar'), '2026 Calendar & Holidays redundant tooltip removed');
assert(!headerBarContent.includes('Exporting monthly breakdown workbook'), 'Monthly Excel redundant tooltip removed');
console.log('✓ PASS: Redundant tooltips removed from buttons with visible labels in MeetingHeaderBar');

// 5. ChronologicalNav: Verified Removal of Redundant Tooltips on Labeled Cards
console.log('\n--- 5. ChronologicalNav Tooltip Verification ---');
const chronoNavContent = fs.readFileSync(path.resolve('src/features/meeting-reports/components/ChronologicalNav.jsx'), 'utf8');
assert(!chronoNavContent.includes('Tooltip'), 'Unwanted Tooltip wrapper removed from ChronologicalNav');
assert(!chronoNavContent.includes('content={`Go to previous meeting'), 'Previous meeting redundant tooltip removed');
assert(!chronoNavContent.includes('content={`Go to next meeting'), 'Next meeting redundant tooltip removed');
console.log('✓ PASS: Redundant tooltips removed from Previous & Next meeting buttons in ChronologicalNav');

// 6. Navbar: Verified Removal of Redundant Search Input Tooltip
console.log('\n--- 6. Navbar Tooltip Verification ---');
const navbarContent = fs.readFileSync(path.resolve('src/components/layout/Navbar.jsx'), 'utf8');
assert(!navbarContent.includes('Tooltip'), 'Unwanted Tooltip wrapper removed from Navbar search input');
assert(!navbarContent.includes('content="Search meetings by date'), 'Search input redundant tooltip removed');
assert(!navbarContent.includes('title="Reach International — Return to Daily Meeting Report"'), 'Brand logo browser tooltip removed');
console.log('✓ PASS: Search input and brand logo unwanted tooltips removed from Navbar');

// 7. Desktop Screen Horizontal Overflow Verification
console.log('\n--- 7. Desktop Screen Horizontal Overflow Verification ---');
const pageContent = fs.readFileSync(path.resolve('src/features/meeting-reports/components/MeetingSummariesPage.jsx'), 'utf8');
assert(pageContent.includes('overflow-x-hidden'), 'MeetingSummariesPage scroll containers have overflow-x-hidden');
assert(pageContent.includes('min-w-0'), 'MeetingSummariesPage flex column has min-w-0');

const partsContent = fs.readFileSync(path.resolve('src/features/meeting-reports/components/PartsSection.jsx'), 'utf8');
assert(partsContent.includes('lg:min-w-full') && partsContent.includes('lg:table-fixed'), 'PartsSection table adapts to 100% width on desktop screens');
assert(partsContent.includes('lg:overflow-x-visible'), 'PartsSection table removes horizontal scrolling on desktop');

assert(detailDocContent.includes('w-full max-w-full min-w-0 overflow-hidden'), 'MeetingDetailDocument article prevents horizontal blowout on desktop');
console.log('✓ PASS: Desktop screen horizontal overflow guards verified across all document containers');

console.log('\n🎉 ALL TOOLTIPS & DESKTOP RESPONSIVE CRITERIA VERIFIED SUCCESSFULLY!');
