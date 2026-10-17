import { useState, useCallback } from 'react';

/**
 * Custom hook to handle text selection highlights within operational documents
 */
export function useTextHighlighter() {
    const [selectionPopup, setSelectionPopup] = useState(null);

    const handleDocumentSelection = useCallback(() => {
        if (typeof window === 'undefined') return;
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
            setSelectionPopup(null);
            return;
        }
        const text = selection.toString().trim();
        if (!text) {
            setSelectionPopup(null);
            return;
        }

        try {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                setSelectionPopup({
                    x: Math.max(90, Math.min(window.innerWidth - 90, rect.left + rect.width / 2)),
                    y: rect.top - 10,
                    range: range.cloneRange(),
                    text
                });
            }
        } catch {
            setSelectionPopup(null);
        }
    }, []);

    const applyTextHighlight = useCallback((color) => {
        if (!selectionPopup?.range) return;
        try {
            const range = selectionPopup.range;
            if (color === 'clear') {
                const container = range.commonAncestorContainer;
                const mark = container.nodeType === 1 ? container.closest('mark') : container.parentElement?.closest('mark');
                if (mark) {
                    const parent = mark.parentNode;
                    while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
                    parent.removeChild(mark);
                }
            } else {
                const mark = document.createElement('mark');
                mark.className = `text-hl-${color} transition-colors`;
                range.surroundContents(mark);
            }
            window.getSelection()?.removeAllRanges();
        } catch (e) {
            console.warn('Text highlight wrap:', e);
        }
        setSelectionPopup(null);
    }, [selectionPopup]);

    return {
        selectionPopup,
        setSelectionPopup,
        handleDocumentSelection,
        applyTextHighlight
    };
}
