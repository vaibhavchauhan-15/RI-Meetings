import React from 'react';
import { createPortal } from 'react-dom';
import { X, Eraser } from 'lucide-react';
import { HIGHLIGHT_COLORS } from '../utils/highlightEngine.js';

/**
 * TextHighlightPopup
 * Apple-inspired floating popover for quick text highlighting & color replacement.
 * Features focus-theft protection and smart viewport-aware positioning.
 */
export function TextHighlightPopup({ selectionPopup, onApplyHighlight, onClose }) {
    if (!selectionPopup || typeof document === 'undefined') return null;

    const isBottom = selectionPopup.placement === 'bottom';

    return createPortal(
        <aside
            className={`text-highlight-popup fixed z-[9999] -translate-x-1/2 ${
                isBottom ? 'mt-2' : '-translate-y-full mb-2'
            } bg-slate-900/95 backdrop-blur-md text-white px-2.5 py-1.5 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700/80 animate-fade-in select-none text-xs transition-all duration-150`}
            style={{
                left: `${selectionPopup.x}px`,
                top: `${selectionPopup.y}px`
            }}
            role="dialog"
            aria-label="Text Highlight Colors"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => {
                // Prevent browser focus change so text selection is not collapsed
                e.preventDefault();
                e.stopPropagation();
            }}
            onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider pr-1.5 border-r border-slate-700">
                Highlight
            </span>

            {/* Contextual Color Palette */}
            <div className="flex items-center gap-1.5">
                {HIGHLIGHT_COLORS.map(c => (
                    <button
                        key={c.id}
                        type="button"
                        onClick={() => onApplyHighlight(c.id)}
                        onPointerDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        className="w-5 h-5 rounded-full border border-white/50 hover:scale-120 active:scale-90 transition-transform cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/60"
                        style={{ backgroundColor: c.hex }}
                        title={`Highlight ${c.name || c.label}`}
                        aria-label={`Highlight ${c.name || c.label}`}
                    />
                ))}
            </div>

            <div className="w-[1px] h-3.5 bg-slate-700 mx-0.5" />

            {/* Clear Selection Highlight */}
            <button
                type="button"
                onClick={() => onApplyHighlight('clear')}
                onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                className="text-[11px] font-semibold text-slate-300 hover:text-white px-1.5 py-0.5 rounded hover:bg-slate-800 transition-colors cursor-pointer inline-flex items-center gap-1"
                title="Remove highlight from selection"
                aria-label="Remove highlight"
            >
                <Eraser className="w-3 h-3 text-slate-400" />
                <span>Clear</span>
            </button>

            {/* Close Popover */}
            <button
                type="button"
                onClick={onClose}
                onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                className="text-slate-400 hover:text-white p-0.5 rounded hover:bg-slate-800 transition-colors cursor-pointer ml-0.5 group"
                title="Close highlight menu"
                aria-label="Close highlight menu"
            >
                <X className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-90" />
            </button>
        </aside>,
        document.body
    );
}

export default TextHighlightPopup;
