import React from 'react';
import { createPortal } from 'react-dom';

/**
 * Floating Text Selection Highlighter Popup
 * Renders via React Portal with color swatches & clear action.
 */
export function TextHighlightPopup({ selectionPopup, onApplyHighlight, onClose }) {
    if (!selectionPopup || typeof document === 'undefined') return null;

    return createPortal(
        <div
            className="fixed z-[9999] -translate-x-1/2 -translate-y-full mb-2 bg-slate-900/95 backdrop-blur-sm text-white px-2.5 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 border border-slate-700/80 animate-fade-in select-none"
            style={{
                left: `${selectionPopup.x}px`,
                top: `${selectionPopup.y}px`
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
        >
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider pl-1 pr-1.5 border-r border-slate-700">
                Highlight
            </span>
            <button
                type="button"
                onClick={() => onApplyHighlight('yellow')}
                className="w-5 h-5 rounded-full bg-yellow-300 hover:scale-110 active:scale-90 transition-transform cursor-pointer border border-yellow-400"
                title="Highlight Yellow"
                aria-label="Highlight Yellow"
            />
            <button
                type="button"
                onClick={() => onApplyHighlight('cyan')}
                className="w-5 h-5 rounded-full bg-cyan-300 hover:scale-110 active:scale-90 transition-transform cursor-pointer border border-cyan-400"
                title="Highlight Cyan"
                aria-label="Highlight Cyan"
            />
            <button
                type="button"
                onClick={() => onApplyHighlight('green')}
                className="w-5 h-5 rounded-full bg-emerald-300 hover:scale-110 active:scale-90 transition-transform cursor-pointer border border-emerald-400"
                title="Highlight Green"
                aria-label="Highlight Green"
            />
            <button
                type="button"
                onClick={() => onApplyHighlight('pink')}
                className="w-5 h-5 rounded-full bg-pink-300 hover:scale-110 active:scale-90 transition-transform cursor-pointer border border-pink-400"
                title="Highlight Pink"
                aria-label="Highlight Pink"
            />
            <button
                type="button"
                onClick={() => onApplyHighlight('clear')}
                className="text-[11px] font-bold text-slate-300 hover:text-white px-1.5 py-0.5 rounded hover:bg-slate-800 transition-colors cursor-pointer ml-1"
                title="Remove Highlight"
                aria-label="Remove Highlight"
            >
                Clear
            </button>
            <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-white text-xs px-1 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                title="Close"
                aria-label="Close highlight menu"
            >
                ✕
            </button>
        </div>,
        document.body
    );
}

export default TextHighlightPopup;
