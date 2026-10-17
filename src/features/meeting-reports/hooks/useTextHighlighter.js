import { useState, useCallback, useEffect, useRef } from 'react';
import {
    domRangeToOffsets,
    applyHighlightToIntervals,
    renderHighlights,
    clearAllCSSHighlights
} from '../utils/highlightEngine.js';

// In-memory persistent highlight cache across route/component transitions
const highlightCache = new Map();

function getSavedHighlights(key) {
    if (highlightCache.has(key)) {
        return highlightCache.get(key);
    }
    if (typeof window !== 'undefined' && window.sessionStorage) {
        try {
            const raw = window.sessionStorage.getItem(`reach_hl_${key}`);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    highlightCache.set(key, parsed);
                    return parsed;
                }
            }
        } catch {
            // Ignore storage quota or access exceptions
        }
    }
    return [];
}

function persistHighlights(key, items) {
    highlightCache.set(key, items);
    if (typeof window !== 'undefined' && window.sessionStorage) {
        try {
            if (items && items.length > 0) {
                window.sessionStorage.setItem(`reach_hl_${key}`, JSON.stringify(items));
            } else {
                window.sessionStorage.removeItem(`reach_hl_${key}`);
            }
        } catch {
            // Ignore
        }
    }
}

/**
 * Production Text Highlighter Hook
 * 
 * Provides:
 * - Deterministic color replacement & partial-range slicing.
 * - Selection across multiple elements, lines, and cards without DOM corruption.
 * - Native CSS Custom Highlights API integration (zero DOM mutation).
 * - Automatic preservation of highlights across React re-renders via MutationObserver.
 * - Viewport-bounded placement and focus-theft protection.
 * - Full Undo, Clear, and targeted Eraser support.
 */
export function useTextHighlighter({ containerRef, meetingKey = 'default' } = {}) {
    const [selectionPopup, setSelectionPopup] = useState(null);
    const [highlights, setHighlights] = useState(() => getSavedHighlights(meetingKey));
    const undoStackRef = useRef([]);

    // Keep active selection in ref to avoid focus theft issues
    const activeRangeRef = useRef(null);

    // Sync state when meeting key changes
    useEffect(() => {
        const cached = getSavedHighlights(meetingKey);
        setHighlights(cached);
        undoStackRef.current = [];
        setSelectionPopup(null);
        activeRangeRef.current = null;

        // Clear active CSS highlights from previous meeting
        clearAllCSSHighlights();
    }, [meetingKey]);

    // Save highlights into persistent cache
    useEffect(() => {
        persistHighlights(meetingKey, highlights);
    }, [meetingKey, highlights]);

    // Resolve active container DOM element
    const getContainer = useCallback(() => {
        if (containerRef?.current) return containerRef.current;
        if (typeof document !== 'undefined') {
            return document.querySelector('[data-annotation-root="true"]') ||
                   document.querySelector('article[aria-label^="Operational Meeting"]') ||
                   document.querySelector('.presentation-container');
        }
        return null;
    }, [containerRef]);

    // Re-render highlights whenever highlights change or container mounts
    useEffect(() => {
        const container = getContainer();
        if (!container) return;

        renderHighlights(container, highlights);

        // Also re-render after short delay in case async data just finished rendering
        const timer = setTimeout(() => {
            renderHighlights(getContainer(), highlights);
        }, 60);

        return () => clearTimeout(timer);
    }, [highlights, getContainer]);

    // MutationObserver: Automatically re-render highlights if container DOM changes
    useEffect(() => {
        const container = getContainer();
        if (!container || typeof MutationObserver === 'undefined') return;

        let frame = null;
        const observer = new MutationObserver((mutations) => {
            const hasDocumentMutations = mutations.some(m => {
                const target = m.target;
                if (!target || target.nodeType !== 1) return true;
                // Ignore mutations caused by our own presentation canvas or popups
                if (target.closest?.('.presentation-toolbar') || 
                    target.closest?.('.text-highlight-popup') || 
                    target.tagName === 'CANVAS') {
                    return false;
                }
                return true;
            });

            if (hasDocumentMutations) {
                if (frame) cancelAnimationFrame(frame);
                frame = requestAnimationFrame(() => {
                    renderHighlights(container, highlights);
                });
            }
        });

        observer.observe(container, {
            childList: true,
            subtree: true,
            characterData: true
        });

        return () => {
            if (frame) cancelAnimationFrame(frame);
            observer.disconnect();
        };
    }, [getContainer, highlights]);

    // Clean up CSS highlights on unmount
    useEffect(() => {
        return () => {
            clearAllCSSHighlights();
        };
    }, []);

    /**
     * Capture text selection from the active container
     */
    const handleDocumentSelection = useCallback((e) => {
        if (typeof window === 'undefined') return;

        // If interaction originated from within presentation controls or existing popup, don't clear/reset
        if (e?.target?.closest?.('.presentation-toolbar') || e?.target?.closest?.('.text-highlight-popup')) {
            return;
        }

        const selection = window.getSelection();
        if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
            setSelectionPopup(null);
            activeRangeRef.current = null;
            return;
        }

        const text = selection.toString().trim();
        if (!text || text.length === 0) {
            setSelectionPopup(null);
            activeRangeRef.current = null;
            return;
        }

        const container = getContainer();
        if (!container) return;

        try {
            const range = selection.getRangeAt(0);

            // Verify range intersects container
            if (!container.contains(range.startContainer) && 
                !container.contains(range.endContainer) && 
                (!range.intersectsNode || !range.intersectsNode(container))) {
                setSelectionPopup(null);
                activeRangeRef.current = null;
                return;
            }

            const offsets = domRangeToOffsets(container, range);
            if (!offsets) {
                setSelectionPopup(null);
                activeRangeRef.current = null;
                return;
            }

            activeRangeRef.current = {
                startOffset: offsets.startOffset,
                endOffset: offsets.endOffset,
                text,
                range: range.cloneRange()
            };

            const rect = range.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                const x = Math.max(100, Math.min(window.innerWidth - 100, rect.left + rect.width / 2));
                const isNearTop = rect.top < 65;
                const y = isNearTop ? rect.bottom + 8 : rect.top - 8;

                setSelectionPopup({
                    x,
                    y,
                    placement: isNearTop ? 'bottom' : 'top',
                    startOffset: offsets.startOffset,
                    endOffset: offsets.endOffset,
                    text
                });
            }
        } catch {
            setSelectionPopup(null);
            activeRangeRef.current = null;
        }
    }, [getContainer]);

    // Attach global selection tracking
    useEffect(() => {
        if (typeof document === 'undefined') return;

        const onPointerOrKeyUp = (e) => {
            if (e.target?.closest?.('.presentation-toolbar') || e.target?.closest?.('.text-highlight-popup')) {
                return;
            }
            handleDocumentSelection(e);
        };

        document.addEventListener('pointerup', onPointerOrKeyUp);
        document.addEventListener('keyup', onPointerOrKeyUp);

        return () => {
            document.removeEventListener('pointerup', onPointerOrKeyUp);
            document.removeEventListener('keyup', onPointerOrKeyUp);
        };
    }, [handleDocumentSelection]);

    /**
     * Apply highlight color or 'clear' to current active selection or targeted interval
     * @param {string} color 'yellow' | 'cyan' | 'green' | 'pink' | 'clear'
     * @param {{ start: number, end: number }} [targetInterval] Optional specific interval to update/clear
     */
    const applyTextHighlight = useCallback((color, targetInterval = null) => {
        const start = targetInterval ? targetInterval.start : (activeRangeRef.current?.startOffset ?? selectionPopup?.startOffset);
        const end = targetInterval ? targetInterval.end : (activeRangeRef.current?.endOffset ?? selectionPopup?.endOffset);

        if (start === undefined || end === undefined || start >= end) {
            setSelectionPopup(null);
            return;
        }

        const container = getContainer();
        if (!container) return;

        setHighlights(prev => {
            undoStackRef.current.push([...prev]);
            const updated = applyHighlightToIntervals(prev, start, end, color);
            return updated;
        });

        // Clear active selection in browser so the highlight is immediately visible
        try {
            window.getSelection()?.removeAllRanges();
        } catch {
            // Ignore
        }

        setSelectionPopup(null);
        activeRangeRef.current = null;
    }, [selectionPopup, getContainer]);

    /**
     * Undo last highlight action
     */
    const undoHighlight = useCallback(() => {
        if (undoStackRef.current.length === 0) return false;
        const previousState = undoStackRef.current.pop();
        setHighlights(previousState);
        return true;
    }, []);

    /**
     * Clear all text highlights on the active document
     */
    const clearHighlights = useCallback(() => {
        if (highlights.length === 0) return;
        undoStackRef.current.push([...highlights]);
        setHighlights([]);
        clearAllCSSHighlights();
    }, [highlights]);

    return {
        highlights,
        selectionPopup,
        setSelectionPopup,
        handleDocumentSelection,
        applyTextHighlight,
        undoHighlight,
        clearHighlights,
        canUndoHighlight: undoStackRef.current.length > 0 || highlights.length > 0
    };
}

export default useTextHighlighter;
