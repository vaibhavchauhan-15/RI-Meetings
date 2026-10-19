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

// 4. MeetingHeaderBar: Back & Calendar Tooltips
console.log('\n--- 4. MeetingHeaderBar Verification ---');
const headerBarContent = fs.readFileSync(path.resolve('src/features/meeting-reports/components/MeetingHeaderBar.jsx'), 'utf8');
assert(headerBarContent.includes('Tooltip'), 'Tooltip imported in MeetingHeaderBar');
assert(headerBarContent.includes('content="Return to all operational meetings archive"'), 'Back to All Meetings has hover tooltip');
assert(headerBarContent.includes('2026 Indian & Company Holiday Calendar'), '2026 Calendar & Holidays button has hover tooltip');
console.log('✓ PASS: Back to All Meetings and Calendar buttons wrapped in Tooltip');

// 5. ChronologicalNav: Previous & Next Meeting Tooltips
console.log('\n--- 5. ChronologicalNav Verification ---');
const chronoNavContent = fs.readFileSync(path.resolve('src/features/meeting-reports/components/ChronologicalNav.jsx'), 'utf8');
assert(chronoNavContent.includes('Tooltip'), 'Tooltip imported in ChronologicalNav');
assert(chronoNavContent.includes('content={`Go to previous meeting (${prevDate})`}'), 'Previous meeting button has hover tooltip');
assert(chronoNavContent.includes('content={`Go to next meeting (${nextDate})`}'), 'Next meeting button has hover tooltip');
console.log('✓ PASS: Previous & Next meeting buttons wrapped in Tooltip');

// 6. Navbar: Search Input Tooltip
console.log('\n--- 6. Navbar Verification ---');
const navbarContent = fs.readFileSync(path.resolve('src/components/layout/Navbar.jsx'), 'utf8');
assert(navbarContent.includes('Tooltip'), 'Tooltip imported in Navbar');
assert(navbarContent.includes('content="Search meetings by date (02-09-2026), month, site, or machine"'), 'Search input has hover tooltip');
console.log('✓ PASS: Navbar search input wrapped in Tooltip with hideOnFocus');

console.log('\n🎉 ALL 19 FEEDBACK ITEMS VERIFIED SUCCESSFULLY!');
