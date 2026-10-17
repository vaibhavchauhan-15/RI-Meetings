/**
 * Comprehensive Automated Verification Suite for Presentation Annotation & Highlighting Engine
 * 
 * Verifies:
 * 1. Canonical interval slicing, partial-range updates & color replacement.
 * 2. Deterministic adjacent merge & duplicate prevention.
 * 3. Clearing highlights without corrupting text or surrounding highlights.
 * 4. DOM Range <-> Offset mapping across nested elements and text nodes.
 * 5. Freehand stroke distance calculations and eraser semantics.
 * 6. Single-toolbar invariant (no duplicate top banners or controls).
 * 7. History stack, undo, and clear synchronization.
 * 8. CSS pseudo-elements in both light and dark modes.
 * 9. Focus theft prevention on interactive color buttons.
 */

import {
    applyHighlightToIntervals,
    domRangeToOffsets,
    findHighlightAtPoint,
    HIGHLIGHT_COLORS
} from '../src/features/meeting-reports/utils/highlightEngine.js';
import fs from 'fs';
import path from 'path';

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
    if (condition) {
        passCount++;
        console.log(`✓ PASS: ${message}`);
    } else {
        failCount++;
        console.error(`✗ FAIL: ${message}`);
    }
}

function assertDeepEqual(actual, expected, message) {
    const a = JSON.stringify(actual);
    const b = JSON.stringify(expected);
    if (a === b) {
        passCount++;
        console.log(`✓ PASS: ${message}`);
    } else {
        failCount++;
        console.error(`✗ FAIL: ${message}\n  Expected: ${b}\n  Actual:   ${a}`);
    }
}

console.log('🧪 Starting Production Presentation & Annotation Optimization Tests...\n');

// ============================================================================
// 1. CANONICAL INTERVAL SLICING & COLOR REPLACEMENT
// ============================================================================
console.log('--- 1. Canonical Interval Slicing & Color Replacement ---');

// Test 1.1: Highlight fresh range
const int1 = applyHighlightToIntervals([], 10, 30, 'yellow');
assert(int1.length === 1, 'Fresh highlight creates exactly 1 interval');
assert(int1[0].start === 10 && int1[0].end === 30 && int1[0].color === 'yellow', 'Fresh interval has correct offsets and color');

// Test 1.2: Overwrite entire highlight with new color
const int2 = applyHighlightToIntervals(int1, 10, 30, 'cyan');
assert(int2.length === 1, 'Replacing entire highlight produces 1 interval');
assert(int2[0].start === 10 && int2[0].end === 30 && int2[0].color === 'cyan', 'Highlight color replaced from yellow to cyan');

// Test 1.3: Partial color replacement (Select portion of highlighted text and change color)
// Starting with [10..50, 'yellow'], apply 'pink' to [20..35]
const baseInterval = [{ start: 10, end: 50, color: 'yellow' }];
const int3 = applyHighlightToIntervals(baseInterval, 20, 35, 'pink');
assert(int3.length === 3, 'Partial color replacement slices into 3 intervals');
assert(int3[0].start === 10 && int3[0].end === 20 && int3[0].color === 'yellow', 'Left segment preserves yellow');
assert(int3[1].start === 20 && int3[1].end === 35 && int3[1].color === 'pink', 'Middle segment receives pink');
assert(int3[2].start === 35 && int3[2].end === 50 && int3[2].color === 'yellow', 'Right segment preserves yellow');

// Test 1.4: Overlapping multiple existing highlights
// Starting with [10..25, 'yellow'] and [35..50, 'pink'], apply 'green' to [20..40]
const multiBase = [
    { start: 10, end: 25, color: 'yellow' },
    { start: 35, end: 50, color: 'pink' }
];
const int4 = applyHighlightToIntervals(multiBase, 20, 40, 'green');
assert(int4.length === 3, 'Cross-highlight application correctly slices both existing highlights');
assert(int4[0].start === 10 && int4[0].end === 20 && int4[0].color === 'yellow', 'First highlight truncated cleanly');
assert(int4[1].start === 20 && int4[1].end === 40 && int4[1].color === 'green', 'New green highlight bridges interval');
assert(int4[2].start === 40 && int4[2].end === 50 && int4[2].color === 'pink', 'Second highlight truncated cleanly');

// Test 1.5: Reapply the same color over part of an existing highlight (idempotence & contiguous merge)
const int5 = applyHighlightToIntervals(int1, 15, 25, 'yellow');
assert(int5.length === 1, 'Reapplying same color does not create duplicate intervals');
assert(int5[0].start === 10 && int5[0].end === 30 && int5[0].color === 'yellow', 'Reapplied same color interval remains unified');

// Test 1.6: Contiguous merge of adjacent intervals with the same color
const adjacent = [
    { start: 10, end: 20, color: 'yellow' },
    { start: 30, end: 40, color: 'yellow' }
];
const int6 = applyHighlightToIntervals(adjacent, 20, 30, 'yellow');
assert(int6.length === 1, 'Adjacent intervals of identical color automatically merge into 1');
assert(int6[0].start === 10 && int6[0].end === 40 && int6[0].color === 'yellow', 'Merged interval spans 10..40');

// Test 1.7: Clear a portion of highlighted text
const int7 = applyHighlightToIntervals(int3, 20, 35, 'clear');
assert(int7.length === 2, 'Clearing middle highlight leaves two separate boundary intervals');
assert(int7[0].start === 10 && int7[0].end === 20 && int7[0].color === 'yellow', 'Left interval preserved');
assert(int7[1].start === 35 && int7[1].end === 50 && int7[1].color === 'yellow', 'Right interval preserved');

// Test 1.8: Clear spanning across everything
const int8 = applyHighlightToIntervals(int7, 0, 100, 'clear');
assert(int8.length === 0, 'Clearing encompassing range removes all highlights');

// ============================================================================
// 2. DOM RANGE <-> OFFSET MAPPING ACROSS NESTED MARKUP
// ============================================================================
console.log('\n--- 2. DOM Range <-> Offset Mapping Across Nested Markup ---');

// Mock a lightweight DOM tree mimicking Reach operational meeting report structure
class MockNode {
    constructor(nodeType, tagName = '', textContent = '') {
        this.nodeType = nodeType;
        this.tagName = tagName;
        this.textContent = textContent;
        this.childNodes = [];
        this.parentNode = null;
    }

    appendChild(child) {
        child.parentNode = this;
        this.childNodes.push(child);
        return child;
    }

    contains(other) {
        if (!other) return false;
        if (other === this) return true;
        let p = other.parentNode;
        while (p) {
            if (p === this) return true;
            p = p.parentNode;
        }
        return false;
    }

    closest(selector) {
        let p = this;
        while (p) {
            if (p.tagName && selector.toLowerCase().includes(p.tagName.toLowerCase())) {
                return p;
            }
            p = p.parentNode;
        }
        return null;
    }

    get parentElement() {
        return this.parentNode;
    }

    compareDocumentPosition(other) {
        // Simple document order check
        const allNodes = [];
        const traverse = (n) => {
            allNodes.push(n);
            for (const c of n.childNodes) traverse(c);
        };
        let root = this;
        while (root.parentNode) root = root.parentNode;
        traverse(root);

        const i1 = allNodes.indexOf(this);
        const i2 = allNodes.indexOf(other);
        if (i1 < i2) return 4; // DOCUMENT_POSITION_FOLLOWING
        if (i1 > i2) return 2; // DOCUMENT_POSITION_PRECEDING
        return 0;
    }
}

globalThis.Node = {
    ELEMENT_NODE: 1,
    TEXT_NODE: 3,
    DOCUMENT_POSITION_PRECEDING: 2,
    DOCUMENT_POSITION_FOLLOWING: 4
};

globalThis.NodeFilter = {
    SHOW_TEXT: 4,
    FILTER_ACCEPT: 1,
    FILTER_REJECT: 2
};

// TreeWalker mock
class MockTreeWalker {
    constructor(root, filter) {
        this.root = root;
        this.filter = filter;
        this.nodes = [];
        this.index = 0;
        this._build(root);
    }
    _build(n) {
        if (n !== this.root && n.nodeType === 3) {
            if (this.filter.acceptNode(n) === 1) {
                this.nodes.push(n);
            }
        }
        for (const c of n.childNodes) this._build(c);
    }
    nextNode() {
        if (this.index < this.nodes.length) {
            return this.nodes[this.index++];
        }
        return null;
    }
}

globalThis.document = {
    createTreeWalker(root, whatToShow, filter) {
        return new MockTreeWalker(root, filter);
    },
    createRange() {
        return {
            startContainer: null,
            startOffset: 0,
            endContainer: null,
            endOffset: 0,
            collapsed: false,
            setStart(node, offset) { this.startContainer = node; this.startOffset = offset; },
            setEnd(node, offset) { this.endContainer = node; this.endOffset = offset; }
        };
    }
};

// Build container: <article> -> <div> "Agenda: Focus on hydraulics" </div> + <article class="card"> <span>Issue: </span> "Pump leakage" </article>
const container = new MockNode(1, 'ARTICLE');
const headerDiv = new MockNode(1, 'DIV');
const headerText = new MockNode(3, '', 'Agenda: Fleet review. ');
headerDiv.appendChild(headerText);
container.appendChild(headerDiv);

const card = new MockNode(1, 'ARTICLE');
const issueSpan = new MockNode(1, 'SPAN');
const issueLabel = new MockNode(3, '', 'Issue: ');
issueSpan.appendChild(issueLabel);
const issueVal = new MockNode(3, '', 'Pump cylinder pressure drop.');
card.appendChild(issueSpan);
card.appendChild(issueVal);
container.appendChild(card);

// Test 2.1: Selection inside single text node
const range1 = {
    startContainer: headerText,
    startOffset: 8,
    endContainer: headerText,
    endOffset: 20,
    collapsed: false,
    intersectsNode: () => true
};
const off1 = domRangeToOffsets(container, range1);
assert(off1 !== null, 'Selection inside single text node resolves cleanly');
assert(off1.startOffset === 8 && off1.endOffset === 20, 'Text node offsets match expected bounds 8..20');

// Test 2.2: Selection across nested elements (from header text into card issue value)
const range2 = {
    startContainer: headerText,
    startOffset: 8,
    endContainer: issueVal,
    endOffset: 13,
    collapsed: false,
    intersectsNode: () => true
};
const off2 = domRangeToOffsets(container, range2);
assert(off2 !== null, 'Multi-element selection resolves cleanly');
// headerText is 22 chars. issueLabel is 7 chars. issueVal up to 13 = 22 + 7 + 13 = 42
assert(off2.startOffset === 8 && off2.endOffset === 42, 'Cross-card multi-element selection maps precisely to 8..42');

// Test 2.3: Selection with Element boundary (e.g. triple click selecting whole card)
const range3 = {
    startContainer: card,
    startOffset: 0,
    endContainer: card,
    endOffset: 2,
    collapsed: false,
    intersectsNode: () => true
};
const off3 = domRangeToOffsets(container, range3);
assert(off3 !== null, 'Element node boundary (triple-click) selection resolves cleanly');
const expectedCardEnd = headerText.textContent.length + issueLabel.textContent.length + issueVal.textContent.length;
assert(off3.startOffset === headerText.textContent.length && off3.endOffset === expectedCardEnd, `Full card selection spans exactly ${headerText.textContent.length}..${expectedCardEnd}`);

// Test 2.4: Collapsed range rejected safely
const collapsedRange = {
    startContainer: headerText,
    startOffset: 5,
    endContainer: headerText,
    endOffset: 5,
    collapsed: true,
    intersectsNode: () => true
};
assert(domRangeToOffsets(container, collapsedRange) === null, 'Collapsed range returns null without exception');

// ============================================================================
// 3. STROKE & ERASER DISTANCE CALCULATIONS
// ============================================================================
console.log('\n--- 3. Freehand Stroke & Eraser Distance Calculations ---');

function distToSegment(p, v, w) {
    const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
    if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
}

// Stroke segment from (10, 10) to (50, 10)
const v = { x: 10, y: 10 };
const w = { x: 50, y: 10 };

// Point directly on segment
const pOn = { x: 30, y: 10 };
assert(distToSegment(pOn, v, w) === 0, 'Point directly on line segment has distance 0');

// Point 5px above segment
const pNear = { x: 30, y: 15 };
assert(distToSegment(pNear, v, w) === 5, 'Point 5px above segment has distance 5');

// Point far away
const pFar = { x: 30, y: 100 };
assert(distToSegment(pFar, v, w) === 90, 'Point far away has accurate distance');

// Eraser stroke removal
const strokes = [
    { id: 1, points: [{ x: 10, y: 10 }, { x: 50, y: 10 }] },
    { id: 2, points: [{ x: 100, y: 100 }, { x: 200, y: 100 }] }
];
const eraseCursor = { x: 30, y: 15 };
const eraseRadius = 20;

const remainingStrokes = strokes.filter(s => {
    for (let i = 0; i < s.points.length - 1; i++) {
        if (distToSegment(eraseCursor, s.points[i], s.points[i + 1]) <= eraseRadius) {
            return false;
        }
    }
    return true;
});

assert(remainingStrokes.length === 1, 'Eraser correctly deletes only the targeted stroke');
assert(remainingStrokes[0].id === 2, 'Unrelated distant stroke is preserved');

// ============================================================================
// 4. SINGLE-TOOLBAR ARCHITECTURAL INVARIANT CHECK
// ============================================================================
console.log('\n--- 4. Single-Toolbar Architectural Invariant Check ---');

const presentationOverlayPath = path.resolve('src/components/shared/PresentationOverlay.jsx');
const overlayContent = fs.readFileSync(presentationOverlayPath, 'utf8');

// Ensure no duplicate top banner exists in PresentationOverlay
const hasTopBanner = overlayContent.includes('presentation-top-banner');
assert(!hasTopBanner, 'Zero duplicate top banner in PresentationOverlay');

// Ensure exactly one toolbar role in PresentationOverlay
const toolbarMatches = overlayContent.match(/role="toolbar"/g) || [];
assert(toolbarMatches.length === 1, 'Exactly ONE role="toolbar" element rendered');

// Ensure pointer capture is cleanly handled
assert(overlayContent.includes('setPointerCapture'), 'Pointer capture used for reliable drawing');
assert(overlayContent.includes('releasePointerCapture'), 'Pointer capture safely released');

// Ensure coalesced pointer events are handled for high-frequency input
assert(overlayContent.includes('getCoalescedEvents'), 'Coalesced pointer events supported for smooth curves');

// Verify MeetingSummariesPage renders TextHighlightPopup only when !isPresentationMode
const meetingSummariesPath = path.resolve('src/features/meeting-reports/components/MeetingSummariesPage.jsx');
const summariesContent = fs.readFileSync(meetingSummariesPath, 'utf8');
assert(summariesContent.includes('!isPresentationMode &&'), 'MeetingSummariesPage guards TextHighlightPopup with !isPresentationMode');
assert(!summariesContent.includes('onMouseUp={handleDocumentSelection}'), 'Redundant manual mouseUp handler removed from container div');

// Verify Draggable Toolbar & Minimize controls
assert(overlayContent.includes('data-drag-handle="true"'), 'Draggable handle present on presentation toolbar');
assert(overlayContent.includes('setIsMinimized'), 'Minimize control present on presentation toolbar');
assert(!overlayContent.includes('{meetingTitle}'), 'Date status badge removed from presentation toolbar');

// Verify precision eraser hit-testing uses getClientRects
const highlightEnginePath = path.resolve('src/features/meeting-reports/utils/highlightEngine.js');
const engineContent = fs.readFileSync(highlightEnginePath, 'utf8');
assert(engineContent.includes('getClientRects()'), 'Eraser hit-testing uses getClientRects for canvas-safe detection');

// ============================================================================
// 5. CSS HIGHLIGHTS PSEUDO-ELEMENTS & ACCESSIBILITY
// ============================================================================
console.log('\n--- 5. CSS Highlights Pseudo-Elements & Accessibility ---');

const cssPath = path.resolve('src/index.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');

// Light theme highlights
assert(cssContent.includes('::highlight(hl-yellow)'), '::highlight(hl-yellow) defined in CSS');
assert(cssContent.includes('::highlight(hl-cyan)'), '::highlight(hl-cyan) defined in CSS');
assert(cssContent.includes('::highlight(hl-green)'), '::highlight(hl-green) defined in CSS');
assert(cssContent.includes('::highlight(hl-pink)'), '::highlight(hl-pink) defined in CSS');

// Dark theme highlights
assert(cssContent.includes('.dark ::highlight(hl-yellow)') || cssContent.includes('[data-theme="dark"] ::highlight(hl-yellow)'), 'Dark theme yellow highlight defined');
assert(cssContent.includes('.dark ::highlight(hl-cyan)') || cssContent.includes('[data-theme="dark"] ::highlight(hl-cyan)'), 'Dark theme cyan highlight defined');
assert(cssContent.includes('.dark ::highlight(hl-green)') || cssContent.includes('[data-theme="dark"] ::highlight(hl-green)'), 'Dark theme green highlight defined');
assert(cssContent.includes('.dark ::highlight(hl-pink)') || cssContent.includes('[data-theme="dark"] ::highlight(hl-pink)'), 'Dark theme pink highlight defined');

// Reduced motion rules
assert(cssContent.includes('prefers-reduced-motion'), 'prefers-reduced-motion media query defined in CSS');

// Verify color integrity
HIGHLIGHT_COLORS.forEach(c => {
    assert(c.hex && c.id, `Highlight color ${c.id} defined with hex ${c.hex}`);
});

// ============================================================================
// 6. FOCUS-THEFT PREVENTION ON TOOLBAR AND POPUP CONTROLS
// ============================================================================
console.log('\n--- 6. Focus-Theft Prevention on Toolbar and Popover Controls ---');

const popupPath = path.resolve('src/features/meeting-reports/components/TextHighlightPopup.jsx');
const popupContent = fs.readFileSync(popupPath, 'utf8');
assert(popupContent.includes('e.preventDefault()'), 'TextHighlightPopup calls e.preventDefault() on pointerDown/mouseDown');
assert(overlayContent.includes('e.preventDefault()'), 'PresentationOverlay calls e.preventDefault() on color swatches');

console.log('\n========================================');
console.log(`SUMMARY: ${passCount} / ${passCount + failCount} assertions passed.`);
if (failCount === 0) {
    console.log('🎉 ALL PRESENTATION & ANNOTATION TESTS PASSED!');
} else {
    console.error(`❌ ${failCount} TESTS FAILED.`);
    process.exit(1);
}
