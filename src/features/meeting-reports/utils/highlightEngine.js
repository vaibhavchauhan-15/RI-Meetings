/**
 * Reach International Operations - Production Highlight & Annotation Engine
 * 
 * Centralized, reliable text-selection capture, deterministic range slicing,
 * and high-performance rendering supporting both native CSS Custom Highlights API
 * and robust text-node-bounded DOM fallback.
 * 
 * Guaranteeing:
 * 1. Zero DOM corruption & zero React reconciliation conflicts.
 * 2. Deterministic color replacement on partial & overlapping ranges.
 * 3. Selection across multiple elements, lines, breakdown cards, and table cells.
 * 4. Preserved text selectability and readability.
 */

/**
 * Supported Highlight Colors
 */
export const HIGHLIGHT_COLORS = [
    { id: 'yellow', name: 'Yellow', hex: '#facc15', bg: 'rgba(253, 224, 71, 0.55)', label: 'Yellow' },
    { id: 'cyan', name: 'Cyan', hex: '#06b6d4', bg: 'rgba(103, 232, 249, 0.55)', label: 'Cyan' },
    { id: 'green', name: 'Green', hex: '#10b981', bg: 'rgba(134, 239, 172, 0.55)', label: 'Green' },
    { id: 'pink', name: 'Pink', hex: '#f43f5e', bg: 'rgba(249, 168, 212, 0.55)', label: 'Pink' }
];

/**
 * Returns true if CSS Custom Highlight API is available in this browser environment.
 */
export function isCSSHighlightSupported() {
    return (
        typeof window !== 'undefined' &&
        typeof CSS !== 'undefined' &&
        typeof CSS.highlights !== 'undefined' &&
        typeof Highlight !== 'undefined'
    );
}

/**
 * Retrieve all text nodes inside a container in consistent document order.
 * Safely excludes buttons, inputs, scripts, and presentation UI controls.
 */
export function getTextNodes(container) {
    const textNodes = [];
    if (!container || typeof document === 'undefined') return textNodes;

    const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode(node) {
                const parent = node.parentElement;
                if (!parent) return NodeFilter.FILTER_REJECT;
                
                // Reject script, style, inputs, buttons, and presentation overlays
                if (['SCRIPT', 'STYLE'].includes(parent.tagName)) {
                    return NodeFilter.FILTER_REJECT;
                }
                if (parent.closest('button, input, textarea, select, .presentation-toolbar, .text-highlight-popup, .laser-pointer-dot, .laser-click-ring')) {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );

    let node;
    while ((node = walker.nextNode())) {
        textNodes.push(node);
    }
    return textNodes;
}

/**
 * Convert a live DOM Selection Range to exact character offsets within container text.
 * Robust across text nodes, arbitrary element nodes (div, p, span, tr, td),
 * multi-card selections, and partial bounds.
 */
export function domRangeToOffsets(container, range) {
    if (!container || !range || typeof document === 'undefined') return null;
    if (range.collapsed) return null;

    // Reject if range is completely detached or does not intersect container
    if (!container.contains(range.startContainer) && 
        !container.contains(range.endContainer) && 
        (!range.intersectsNode || !range.intersectsNode(container))) {
        return null;
    }

    const textNodes = getTextNodes(container);
    if (textNodes.length === 0) return null;

    let totalLength = 0;
    for (let i = 0; i < textNodes.length; i++) {
        totalLength += textNodes[i].textContent.length;
    }
    if (totalLength === 0) return null;

    /**
     * Compute the exact character offset of any boundary point (node, offset) in container
     */
    const getOffsetOfPoint = (node, offset) => {
        if (!node) return 0;
        if (node === container && offset === 0) return 0;
        if (!container.contains(node)) {
            const comp = container.compareDocumentPosition(node);
            if (comp & Node.DOCUMENT_POSITION_PRECEDING) return 0;
            if (comp & Node.DOCUMENT_POSITION_FOLLOWING) return totalLength;
        }

        let charCount = 0;

        for (let i = 0; i < textNodes.length; i++) {
            const tNode = textNodes[i];
            const tLen = tNode.textContent.length;

            if (node === tNode) {
                return charCount + Math.max(0, Math.min(offset, tLen));
            }

            if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.contains(tNode)) {
                    // Find direct child of node containing tNode
                    let child = tNode;
                    while (child.parentNode && child.parentNode !== node) {
                        child = child.parentNode;
                    }
                    const childIndex = Array.prototype.indexOf.call(node.childNodes, child);
                    if (childIndex < offset) {
                        charCount += tLen;
                        continue;
                    } else {
                        return charCount;
                    }
                } else {
                    const pos = node.compareDocumentPosition(tNode);
                    if (pos & Node.DOCUMENT_POSITION_FOLLOWING) {
                        return charCount;
                    } else if (pos & Node.DOCUMENT_POSITION_PRECEDING) {
                        charCount += tLen;
                        continue;
                    }
                }
            } else {
                const pos = node.compareDocumentPosition(tNode);
                if (pos & Node.DOCUMENT_POSITION_FOLLOWING) {
                    return charCount;
                } else if (pos & Node.DOCUMENT_POSITION_PRECEDING) {
                    charCount += tLen;
                    continue;
                }
            }
        }

        return charCount;
    };

    let startOffset = getOffsetOfPoint(range.startContainer, range.startOffset);
    let endOffset = getOffsetOfPoint(range.endContainer, range.endOffset);

    // Normalize and clamp
    startOffset = Math.max(0, Math.min(totalLength, startOffset));
    endOffset = Math.max(0, Math.min(totalLength, endOffset));

    if (startOffset < endOffset) {
        return { startOffset, endOffset };
    }
    return null;
}

/**
 * Identify any highlight interval present at client coordinates (clientX, clientY).
 * Enables the Eraser tool to cleanly target text highlights.
 */
export function findHighlightAtPoint(container, clientX, clientY, intervals = []) {
    if (!container || !intervals || intervals.length === 0 || typeof document === 'undefined') {
        return null;
    }

    // 1. Primary Method: Direct Geometry Matching via DOM Range ClientRects.
    // Completely immune to canvas layers, z-index overlays, CSS Custom Highlights, or replaced elements.
    const PADDING = 8; // Pixel tolerance for touch and mouse ergonomics

    for (const item of intervals) {
        const ranges = offsetsToDomRanges(container, item.start, item.end);
        for (const range of ranges) {
            const rects = range.getClientRects();
            for (let i = 0; i < rects.length; i++) {
                const rect = rects[i];
                if (
                    clientX >= rect.left - PADDING &&
                    clientX <= rect.right + PADDING &&
                    clientY >= rect.top - PADDING &&
                    clientY <= rect.bottom + PADDING
                ) {
                    return item;
                }
            }
        }
    }

    // 2. Secondary Method: Caret Range fallback
    let targetNode = null;
    let targetOffset = 0;

    if (document.caretRangeFromPoint) {
        const range = document.caretRangeFromPoint(clientX, clientY);
        if (range && container.contains(range.startContainer)) {
            targetNode = range.startContainer;
            targetOffset = range.startOffset;
        }
    } else if (document.caretPositionFromPoint) {
        const pos = document.caretPositionFromPoint(clientX, clientY);
        if (pos && container.contains(pos.offsetNode)) {
            targetNode = pos.offsetNode;
            targetOffset = pos.offset;
        }
    }

    // 3. Fallback to elementFromPoint for fallback marks
    if (!targetNode) {
        try {
            const el = document.elementFromPoint(clientX, clientY);
            if (el && container.contains(el)) {
                const mark = el.closest('mark[data-hl-fallback]');
                if (mark && mark.firstChild) {
                    targetNode = mark.firstChild;
                    targetOffset = 0;
                }
            }
        } catch {
            // Ignore
        }
    }

    if (targetNode) {
        try {
            const tempRange = document.createRange();
            tempRange.setStart(targetNode, targetOffset);
            tempRange.setEnd(targetNode, Math.min(targetOffset + 1, targetNode.textContent?.length || 1));
            const offsets = domRangeToOffsets(container, tempRange);
            if (offsets) {
                const ptOffset = offsets.startOffset;
                return intervals.find(item => ptOffset >= item.start && ptOffset <= item.end) || null;
            }
        } catch {
            // Ignore
        }
    }

    return null;
}

/**
 * Convert character offsets [startOffset, endOffset] to an array of single-text-node DOM Ranges.
 */
export function offsetsToDomRanges(container, startOffset, endOffset) {
    if (!container || startOffset >= endOffset || typeof document === 'undefined') return [];
    const textNodes = getTextNodes(container);
    let currentOffset = 0;
    const ranges = [];

    for (let i = 0; i < textNodes.length; i++) {
        const node = textNodes[i];
        const len = node.textContent.length;
        const nodeStart = currentOffset;
        const nodeEnd = currentOffset + len;

        if (nodeEnd > startOffset && nodeStart < endOffset) {
            const rangeStart = Math.max(0, startOffset - nodeStart);
            const rangeEnd = Math.min(len, endOffset - nodeStart);

            if (rangeStart < rangeEnd) {
                try {
                    const range = document.createRange();
                    range.setStart(node, rangeStart);
                    range.setEnd(node, rangeEnd);
                    ranges.push(range);
                } catch {
                    // Ignore detached node exceptions
                }
            }
        }

        currentOffset += len;
        if (currentOffset >= endOffset) break;
    }

    return ranges;
}

/**
 * Canonical Interval Slicing Algorithm
 * Deterministically applies new highlight color or 'clear' over existing intervals.
 * 
 * Rules:
 * - Overwritten portions receive new color.
 * - Non-overlapping portions preserve original color.
 * - Same-color overlaps do not duplicate.
 * - Contiguous intervals with the same color are automatically merged.
 * - 'clear' removes the targeted range.
 * 
 * @param {Array<{start: number, end: number, color: string, id?: string}>} existingIntervals 
 * @param {number} newStart 
 * @param {number} newEnd 
 * @param {string} newColor 'yellow' | 'cyan' | 'green' | 'pink' | 'clear'
 * @returns {Array<{start: number, end: number, color: string, id: string}>}
 */
export function applyHighlightToIntervals(existingIntervals = [], newStart, newEnd, newColor) {
    if (newStart >= newEnd) return [...existingIntervals];

    const result = [];

    for (const item of existingIntervals) {
        // No overlap
        if (item.end <= newStart || item.start >= newEnd) {
            result.push({ ...item });
            continue;
        }

        // Left non-overlapping slice
        if (item.start < newStart) {
            result.push({
                id: item.id || `hl-${item.start}-${newStart}`,
                start: item.start,
                end: newStart,
                color: item.color
            });
        }

        // Right non-overlapping slice
        if (item.end > newEnd) {
            result.push({
                id: `hl-${newEnd}-${item.end}`,
                start: newEnd,
                end: item.end,
                color: item.color
            });
        }
    }

    // Insert new range if not clearing
    if (newColor && newColor !== 'clear') {
        result.push({
            id: `hl-${newStart}-${newEnd}-${Date.now()}`,
            start: newStart,
            end: newEnd,
            color: newColor
        });
    }

    // Sort by start offset
    result.sort((a, b) => a.start - b.start);

    // Merge adjacent intervals of the same color
    const merged = [];
    for (const item of result) {
        if (item.start >= item.end) continue;

        if (merged.length > 0) {
            const prev = merged[merged.length - 1];
            if (prev.color === item.color && prev.end >= item.start) {
                prev.end = Math.max(prev.end, item.end);
                continue;
            }
        }
        merged.push({ ...item });
    }

    return merged;
}

/**
 * Render highlight intervals onto container using native CSS Custom Highlights API
 * or clean DOM marks fallback.
 */
export function renderHighlights(container, intervals = []) {
    if (!container || typeof document === 'undefined') return;

    if (isCSSHighlightSupported()) {
        renderCSSHighlights(container, intervals);
    } else {
        renderDOMFallbackHighlights(container, intervals);
    }
}

/**
 * Render using CSS Custom Highlights API (zero DOM manipulation, 60fps, 100% React-safe)
 */
function renderCSSHighlights(container, intervals) {
    const colorRangesMap = {
        yellow: [],
        cyan: [],
        green: [],
        pink: []
    };

    intervals.forEach(item => {
        if (!colorRangesMap[item.color]) return;
        const domRanges = offsetsToDomRanges(container, item.start, item.end);
        colorRangesMap[item.color].push(...domRanges);
    });

    ['yellow', 'cyan', 'green', 'pink'].forEach(color => {
        const highlightName = `hl-${color}`;
        const ranges = colorRangesMap[color];
        if (ranges && ranges.length > 0) {
            try {
                const highlight = new Highlight();
                for (let i = 0; i < ranges.length; i++) {
                    highlight.add(ranges[i]);
                }
                CSS.highlights.set(highlightName, highlight);
            } catch {
                CSS.highlights.delete(highlightName);
            }
        } else {
            CSS.highlights.delete(highlightName);
        }
    });
}

/**
 * Clear all CSS highlights registered for this application
 */
export function clearAllCSSHighlights() {
    if (!isCSSHighlightSupported()) return;
    ['yellow', 'cyan', 'green', 'pink'].forEach(color => {
        try {
            CSS.highlights.delete(`hl-${color}`);
        } catch {
            // Ignore
        }
    });
}

/**
 * Robust DOM Fallback for environments lacking CSS.highlights (e.g. Node/older engines)
 */
function renderDOMFallbackHighlights(container, intervals) {
    // 1. Remove existing fallback marks without destroying text
    const existingMarks = container.querySelectorAll('mark[data-hl-fallback="true"]');
    existingMarks.forEach(mark => {
        const parent = mark.parentNode;
        if (parent) {
            while (mark.firstChild) {
                parent.insertBefore(mark.firstChild, mark);
            }
            parent.removeChild(mark);
        }
    });

    // 2. Normalize text nodes to eliminate previous splits
    container.normalize();

    // 3. Apply each interval by wrapping single text nodes
    intervals.forEach(item => {
        const ranges = offsetsToDomRanges(container, item.start, item.end);
        ranges.forEach(range => {
            try {
                const mark = document.createElement('mark');
                mark.setAttribute('data-hl-fallback', 'true');
                mark.className = `text-hl-${item.color} transition-colors`;
                range.surroundContents(mark);
            } catch {
                // If single text node cannot be surrounded, skip cleanly
            }
        });
    });
}
