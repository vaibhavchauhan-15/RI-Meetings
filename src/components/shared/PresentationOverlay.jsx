import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

/**
 * PresentationOverlay Component
 * PowerPoint-style presentation mode adhering strictly to Reach International Design System:
 * - 60fps Laser Pointer: Native OS cursor is hidden so the glowing red laser dot IS the cursor
 * - Realistic SVG Chisel-tip Highlighter cursor & smooth translucent brush
 * - Realistic SVG Metallic Nib Pen cursor & precision ink drawing
 * - Realistic SVG Rubber Block Eraser cursor & stroke removal
 * - Crisp white backdrop-blur floating toolbar with Reach International tokens
 * - Top presentation info banner with keyboard shortcuts helper
 * - Keyboard shortcuts (P, H, D, E, F, Ctrl+Z, Esc)
 */
export default function PresentationOverlay({
    containerRef,
    contentRef,
    onClose,
    meetingTitle = 'Daily Meeting Report'
}) {
    // Tool states
    const [activeTool, setActiveTool] = useState('pointer'); // 'pointer' | 'highlighter' | 'pen' | 'eraser'
    const [activeColor, setActiveColor] = useState('#facc15'); // Yellow for highlighter, Red/Blue for pen default
    const [isToolbarMinimized, setIsToolbarMinimized] = useState(false);
    const [showTopBanner, setShowTopBanner] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(Boolean(typeof document !== 'undefined' && document.fullscreenElement));

    // Laser pointer coordinate states
    const [laserPos, setLaserPos] = useState({ x: -100, y: -100, visible: false });
    const [laserRings, setLaserRings] = useState([]);

    // Stroke history for canvas
    const strokesRef = useRef([]); // [{ id, tool, color, width, points: [{x, y}] }]
    const [strokeCount, setStrokeCount] = useState(0);

    const canvasRef = useRef(null);
    const isDrawingRef = useRef(false);
    const currentStrokeRef = useRef(null);
    const animFrameRef = useRef(null);

    // Color swatches (aligned with Reach International Palette & high visibility)
    const HIGHLIGHT_COLORS = [
        { name: 'Yellow', hex: '#facc15', label: 'Neon Yellow' },
        { name: 'Cyan', hex: '#06b6d4', label: 'Cyan Teal' },
        { name: 'Green', hex: '#10b981', label: 'Emerald Green' },
        { name: 'Pink', hex: '#f43f5e', label: 'Rose Pink' }
    ];

    const PEN_COLORS = [
        { name: 'Navy', hex: '#0f2537', label: 'Brand Navy' },
        { name: 'Blue', hex: '#0066cc', label: 'Reach Blue' },
        { name: 'Red', hex: '#ef4444', label: 'Alert Red' },
        { name: 'Emerald', hex: '#10b981', label: 'Success Green' }
    ];

    const activeSwatches = activeTool === 'pen' ? PEN_COLORS : HIGHLIGHT_COLORS;

    // Fullscreen toggle
    const toggleFullscreen = useCallback(async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
                setIsFullscreen(true);
            } else {
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                    setIsFullscreen(false);
                }
            }
        } catch {
            // Graceful fallback for devices without fullscreen support
        }
    }, []);

    // Sync fullscreen state changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(Boolean(document.fullscreenElement));
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // -------------------------------------------------------------
    // Laser Mode: Hide Native Cursor Over Presentation Stage & Body
    // -------------------------------------------------------------
    useEffect(() => {
        const container = containerRef?.current;
        const isLaser = activeTool === 'pointer';

        if (isLaser) {
            container?.classList.add('cursor-laser-tool');
            document.body?.classList.add('cursor-laser-tool');
        } else {
            container?.classList.remove('cursor-laser-tool');
            document.body?.classList.remove('cursor-laser-tool');
        }

        return () => {
            container?.classList.remove('cursor-laser-tool');
            document.body?.classList.remove('cursor-laser-tool');
        };
    }, [activeTool, containerRef]);

    // -------------------------------------------------------------
    // Canvas Redraw Logic
    // -------------------------------------------------------------
    const redrawCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear entire canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Render each stored stroke
        strokesRef.current.forEach(stroke => {
            if (!stroke.points || stroke.points.length < 2) return;

            ctx.save();
            ctx.beginPath();
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            if (stroke.tool === 'highlighter') {
                ctx.globalAlpha = 0.45;
                ctx.lineWidth = stroke.width || 24;
                ctx.strokeStyle = stroke.color;
            } else {
                ctx.globalAlpha = 0.95;
                ctx.lineWidth = stroke.width || 3;
                ctx.strokeStyle = stroke.color;
            }

            ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
            for (let i = 1; i < stroke.points.length; i++) {
                ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
            }
            ctx.stroke();
            ctx.restore();
        });
    }, []);

    // -------------------------------------------------------------
    // Resize Canvas to Match Content Height & Width
    // -------------------------------------------------------------
    const resizeCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const content = contentRef?.current;
        if (!canvas || !content) return;

        const rect = content.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const targetWidth = Math.max(content.scrollWidth, rect.width, 300);
        const targetHeight = Math.max(content.scrollHeight, rect.height, 300);

        if (canvas.width !== targetWidth * dpr || canvas.height !== targetHeight * dpr) {
            canvas.width = targetWidth * dpr;
            canvas.height = targetHeight * dpr;
            canvas.style.width = `${targetWidth}px`;
            canvas.style.height = `${targetHeight}px`;

            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.scale(dpr, dpr);
            }
            redrawCanvas();
        }
    }, [contentRef, redrawCanvas]);

    useEffect(() => {
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        const observer = new ResizeObserver(resizeCanvas);
        if (contentRef?.current) {
            observer.observe(contentRef.current);
        }
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            observer.disconnect();
        };
    }, [contentRef, resizeCanvas]);

    // -------------------------------------------------------------
    // Laser Pointer Global Tracking
    // -------------------------------------------------------------
    useEffect(() => {
        if (activeTool !== 'pointer') {
            setLaserPos(prev => ({ ...prev, visible: false }));
            return;
        }

        const handlePointerMove = (e) => {
            // Hide laser dot when hovering over presenter toolbar or top banner so
            // the user gets standard natural pointer cursor for clicking buttons
            const isOverControls = Boolean(
                e.target.closest('.presentation-toolbar') || 
                e.target.closest('.presentation-top-banner')
            );
            setLaserPos({
                x: e.clientX,
                y: e.clientY,
                visible: !isOverControls
            });
        };

        const handlePointerLeave = () => {
            setLaserPos(prev => ({ ...prev, visible: false }));
        };

        const handleClick = (e) => {
            // Ignore clicks on floating toolbar or banner
            if (e.target.closest('.presentation-toolbar') || e.target.closest('.presentation-top-banner')) return;

            const newRing = { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY };
            setLaserRings(prev => [...prev.slice(-4), newRing]);

            setTimeout(() => {
                setLaserRings(prev => prev.filter(r => r.id !== newRing.id));
            }, 600);
        };

        window.addEventListener('pointermove', handlePointerMove, { passive: true });
        window.addEventListener('pointerleave', handlePointerLeave);
        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerleave', handlePointerLeave);
            window.removeEventListener('click', handleClick);
        };
    }, [activeTool]);

    // -------------------------------------------------------------
    // Canvas Drawing Pointer Events
    // -------------------------------------------------------------
    const getCanvasCoordinates = useCallback((e) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }, []);

    const handlePointerDown = (e) => {
        if (activeTool === 'pointer') return;
        e.currentTarget.setPointerCapture(e.pointerId);

        const coords = getCanvasCoordinates(e);
        isDrawingRef.current = true;

        if (activeTool === 'eraser') {
            eraseStrokeAt(coords);
            return;
        }

        const newStroke = {
            id: Date.now() + Math.random(),
            tool: activeTool,
            color: activeColor,
            width: activeTool === 'highlighter' ? 24 : 3,
            points: [coords]
        };

        currentStrokeRef.current = newStroke;
        strokesRef.current.push(newStroke);
        setStrokeCount(strokesRef.current.length);
    };

    const handlePointerMove = (e) => {
        if (!isDrawingRef.current || activeTool === 'pointer') return;
        const coords = getCanvasCoordinates(e);

        if (activeTool === 'eraser') {
            eraseStrokeAt(coords);
            return;
        }

        if (currentStrokeRef.current) {
            currentStrokeRef.current.points.push(coords);
            if (!animFrameRef.current) {
                animFrameRef.current = requestAnimationFrame(() => {
                    redrawCanvas();
                    animFrameRef.current = null;
                });
            }
        }
    };

    const handlePointerUp = (e) => {
        if (!isDrawingRef.current) return;
        try {
            e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
            // Ignore pointer capture release exceptions
        }
        isDrawingRef.current = false;
        currentStrokeRef.current = null;
        redrawCanvas();
    };

    // Eraser helper: remove any stroke within 24px radius
    const eraseStrokeAt = (coords) => {
        const radius = 24;
        const initialCount = strokesRef.current.length;
        strokesRef.current = strokesRef.current.filter(stroke => {
            return !stroke.points.some(pt => {
                const dx = pt.x - coords.x;
                const dy = pt.y - coords.y;
                return Math.sqrt(dx * dx + dy * dy) < radius;
            });
        });
        if (strokesRef.current.length !== initialCount) {
            setStrokeCount(strokesRef.current.length);
            redrawCanvas();
        }
    };

    // Undo last stroke
    const handleUndo = () => {
        if (strokesRef.current.length === 0) return;
        strokesRef.current.pop();
        setStrokeCount(strokesRef.current.length);
        redrawCanvas();
    };

    // Clear all strokes
    const handleClearAll = () => {
        strokesRef.current = [];
        setStrokeCount(0);
        redrawCanvas();
    };

    // Switch tool and sync color default
    const handleSelectTool = (tool) => {
        setActiveTool(tool);
        if (tool === 'highlighter' && !HIGHLIGHT_COLORS.some(c => c.hex === activeColor)) {
            setActiveColor('#facc15');
        } else if (tool === 'pen' && !PEN_COLORS.some(c => c.hex === activeColor)) {
            setActiveColor('#0066cc');
        }
    };

    // Cursor class resolution for canvas
    const getCanvasCursorClass = () => {
        switch (activeTool) {
            case 'pointer':
                return 'cursor-laser-tool pointer-events-auto';
            case 'highlighter':
                return 'cursor-highlighter-tool pointer-events-auto';
            case 'pen':
                return 'cursor-pen-tool pointer-events-auto';
            case 'eraser':
                return 'cursor-eraser-tool pointer-events-auto';
            default:
                return 'cursor-default pointer-events-none';
        }
    };

    // -------------------------------------------------------------
    // Keyboard Hotkeys (P, H, D, E, F, Ctrl+Z, Esc)
    // -------------------------------------------------------------
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

            if (e.key === 'Escape') {
                e.preventDefault();
                onClose?.();
            } else if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
                e.preventDefault();
                handleUndo();
            } else if (e.key === 'p' || e.key === 'P') {
                handleSelectTool('pointer');
            } else if (e.key === 'h' || e.key === 'H') {
                handleSelectTool('highlighter');
            } else if (e.key === 'd' || e.key === 'D' || e.key === 'b' || e.key === 'B') {
                handleSelectTool('pen');
            } else if (e.key === 'e' || e.key === 'E') {
                handleSelectTool('eraser');
            } else if (e.key === 'f' || e.key === 'F') {
                toggleFullscreen();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, toggleFullscreen]);

    // -------------------------------------------------------------
    // Render
    // -------------------------------------------------------------
    return (
        <>
            {/* 1. Scroll-Anchored Canvas Layer (Over Document Card) */}
            <canvas
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className={`absolute inset-0 z-30 select-none ${getCanvasCursorClass()}`}
                style={{
                    touchAction: activeTool === 'pointer' ? 'pan-y' : 'none'
                }}
            />

            {/* 2. Floating Laser Pointer Dot & Click Rings */}
            {activeTool === 'pointer' && laserPos.visible && typeof document !== 'undefined' && createPortal(
                <div
                    className="laser-pointer-dot"
                    style={{
                        left: `${laserPos.x}px`,
                        top: `${laserPos.y}px`
                    }}
                    aria-hidden="true"
                />,
                document.body
            )}

            {laserRings.map(ring => typeof document !== 'undefined' && createPortal(
                <div
                    key={ring.id}
                    className="laser-click-ring"
                    style={{
                        left: `${ring.x}px`,
                        top: `${ring.y}px`
                    }}
                    aria-hidden="true"
                />,
                document.body
            ))}

            {/* 3. Top Presentation Info Banner with Shortcuts Cheat-Sheet */}
            {showTopBanner && typeof document !== 'undefined' && createPortal(
                <aside
                    className="presentation-top-banner fixed top-3 left-1/2 -translate-x-1/2 z-[9980] select-none transition-all duration-200"
                    role="region"
                    aria-label="Presentation shortcuts banner"
                >
                    <div className="flex items-center gap-2 sm:gap-3 px-3.5 py-1.5 rounded-full bg-white/95 text-slate-700 border border-slate-200/90 shadow-card backdrop-blur-md text-xs font-semibold">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse flex-shrink-0" />
                        <span className="font-extrabold text-brand-navy truncate max-w-[160px] sm:max-w-xs">{meetingTitle}</span>
                        
                        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 text-[11px] text-slate-500">
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-mono font-bold">P</kbd>
                                <span>Pointer</span>
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-mono font-bold">H</kbd>
                                <span>Highlight</span>
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-mono font-bold">D</kbd>
                                <span>Pen</span>
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-mono font-bold">E</kbd>
                                <span>Eraser</span>
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-mono font-bold">Esc</kbd>
                                <span>Exit</span>
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowTopBanner(false)}
                            className="text-slate-400 hover:text-slate-700 p-0.5 rounded-full transition-colors cursor-pointer"
                            title="Dismiss top shortcut helper"
                            aria-label="Dismiss banner"
                        >
                            ✕
                        </button>
                    </div>
                </aside>,
                document.body
            )}

            {/* 4. Floating Presenter Toolbar (Portal to Body) */}
            {typeof document !== 'undefined' && createPortal(
                <aside 
                    className="presentation-toolbar fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-[9990] select-none transition-all duration-200"
                    role="toolbar"
                    aria-label="Presentation controls"
                >
                    {isToolbarMinimized ? (
                        /* Minimized Floating Pill */
                        <button
                            type="button"
                            onClick={() => setIsToolbarMinimized(false)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/95 text-slate-800 border border-slate-200 shadow-card hover:shadow-hover backdrop-blur-md transition-all active:scale-95 cursor-pointer text-xs font-bold"
                            title="Expand Presentation Toolbar"
                        >
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                            <span className="text-brand-navy">Presenting</span>
                            <span className="text-slate-400 text-[10px]">▲</span>
                        </button>
                    ) : (
                        /* Full Ergonomic Toolbar Aligned with Reach International Design System */
                        <div className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-2xl bg-white/95 text-slate-800 border border-slate-200/90 shadow-card hover:shadow-hover backdrop-blur-xl max-w-[96vw] overflow-x-auto scrollbar-none">
                            {/* Presenter Status Grip */}
                            <div className="hidden sm:flex items-center gap-2 pl-2 pr-1 text-slate-500 text-xs font-bold border-r border-slate-200 mr-0.5 flex-shrink-0">
                                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-xs shadow-rose-500/40"></span>
                                <span className="text-[11px] text-brand-navy font-extrabold uppercase tracking-wide">Presenter</span>
                            </div>

                            {/* Laser Pointer Tool */}
                            <button
                                type="button"
                                onClick={() => handleSelectTool('pointer')}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[42px] min-w-[42px] justify-center ${
                                    activeTool === 'pointer'
                                        ? 'bg-rose-50 text-rose-700 border border-rose-300 ring-2 ring-rose-400/25 shadow-xs font-extrabold'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                                }`}
                                title="Laser Pointer (P)"
                                aria-label="Laser Pointer"
                            >
                                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-xs shadow-rose-500/50 flex-shrink-0"></span>
                                <span className="hidden sm:inline">Pointer</span>
                                <kbd className="hidden md:inline text-[9px] px-1 py-0.2 rounded bg-slate-100 border border-slate-200 text-slate-500">P</kbd>
                            </button>

                            {/* Highlighter Tool */}
                            <button
                                type="button"
                                onClick={() => handleSelectTool('highlighter')}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[42px] min-w-[42px] justify-center ${
                                    activeTool === 'highlighter'
                                        ? 'bg-amber-50 text-amber-900 border border-amber-300 ring-2 ring-amber-400/25 shadow-xs font-extrabold'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                                }`}
                                title="Highlighter (H)"
                                aria-label="Highlighter"
                            >
                                <span className="text-base leading-none">🖍️</span>
                                <span className="hidden sm:inline">Highlight</span>
                                <kbd className="hidden md:inline text-[9px] px-1 py-0.2 rounded bg-slate-100 border border-slate-200 text-slate-500">H</kbd>
                            </button>

                            {/* Pen / Draw Tool */}
                            <button
                                type="button"
                                onClick={() => handleSelectTool('pen')}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[42px] min-w-[42px] justify-center ${
                                    activeTool === 'pen'
                                        ? 'bg-sky-50 text-sky-900 border border-sky-300 ring-2 ring-sky-400/25 shadow-xs font-extrabold'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                                }`}
                                title="Pen / Underline (D)"
                                aria-label="Pen"
                            >
                                <span className="text-base leading-none">✏️</span>
                                <span className="hidden sm:inline">Pen</span>
                                <kbd className="hidden md:inline text-[9px] px-1 py-0.2 rounded bg-slate-100 border border-slate-200 text-slate-500">D</kbd>
                            </button>

                            {/* Eraser Tool */}
                            <button
                                type="button"
                                onClick={() => handleSelectTool('eraser')}
                                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[42px] min-w-[42px] justify-center ${
                                    activeTool === 'eraser'
                                        ? 'bg-slate-100 text-slate-900 border border-slate-300 ring-2 ring-slate-400/25 shadow-xs font-extrabold'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                                }`}
                                title="Eraser (E)"
                                aria-label="Eraser"
                            >
                                <span className="text-base leading-none">🧹</span>
                                <span className="hidden sm:inline">Eraser</span>
                                <kbd className="hidden md:inline text-[9px] px-1 py-0.2 rounded bg-slate-100 border border-slate-200 text-slate-500">E</kbd>
                            </button>

                            {/* Color Selector (for Pen / Highlighter) */}
                            {(activeTool === 'highlighter' || activeTool === 'pen') && (
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-xl border border-slate-200/90 flex-shrink-0 animate-fade-in">
                                    {activeSwatches.map(swatch => (
                                        <button
                                            key={swatch.hex}
                                            type="button"
                                            onClick={() => setActiveColor(swatch.hex)}
                                            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-all cursor-pointer ${
                                                activeColor === swatch.hex
                                                    ? 'scale-115 border-slate-800 shadow-xs ring-1 ring-slate-400'
                                                    : 'border-white/80 opacity-75 hover:opacity-100 hover:scale-105'
                                            }`}
                                            style={{ backgroundColor: swatch.hex }}
                                            title={swatch.label}
                                            aria-label={swatch.label}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Divider */}
                            <div className="w-[1px] h-6 bg-slate-200 mx-0.5 flex-shrink-0" />

                            {/* Undo Button */}
                            <button
                                type="button"
                                onClick={handleUndo}
                                disabled={strokeCount === 0}
                                className="p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer min-h-[42px] min-w-[42px] flex items-center justify-center flex-shrink-0 border border-transparent hover:border-slate-200"
                                title="Undo Stroke (Ctrl+Z)"
                                aria-label="Undo Stroke"
                            >
                                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="1 4 1 10 7 10"></polyline>
                                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                                </svg>
                            </button>

                            {/* Clear All Inks */}
                            {strokeCount > 0 && (
                                <button
                                    type="button"
                                    onClick={handleClearAll}
                                    className="px-2.5 py-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200/80 rounded-xl transition-all cursor-pointer flex-shrink-0"
                                    title="Clear All Annotations"
                                >
                                    Clear ({strokeCount})
                                </button>
                            )}

                            {/* Fullscreen Toggle */}
                            <button
                                type="button"
                                onClick={toggleFullscreen}
                                className="p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer min-h-[42px] min-w-[42px] flex items-center justify-center flex-shrink-0 border border-transparent hover:border-slate-200"
                                title="Toggle Fullscreen (F)"
                                aria-label="Toggle Fullscreen"
                            >
                                {isFullscreen ? (
                                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="4 14 10 14 10 20"></polyline>
                                        <polyline points="20 10 14 10 14 4"></polyline>
                                        <line x1="14" y1="10" x2="21" y2="3"></line>
                                        <line x1="3" y1="21" x2="10" y2="14"></line>
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="15 3 21 3 21 9"></polyline>
                                        <polyline points="9 21 3 21 3 15"></polyline>
                                        <line x1="21" y1="3" x2="14" y2="10"></line>
                                        <line x1="3" y1="21" x2="10" y2="14"></line>
                                    </svg>
                                )}
                            </button>

                            {/* Minimize Toolbar */}
                            <button
                                type="button"
                                onClick={() => setIsToolbarMinimized(true)}
                                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer min-h-[42px] min-w-[36px] flex items-center justify-center flex-shrink-0"
                                title="Minimize Toolbar"
                                aria-label="Minimize Toolbar"
                            >
                                <span className="text-xs">▼</span>
                            </button>

                            {/* Exit Presentation Mode */}
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-extrabold text-xs transition-all shadow-xs cursor-pointer min-h-[42px] ml-1 flex-shrink-0"
                                title="Exit Presentation Mode (Esc)"
                                aria-label="Exit Presentation Mode"
                            >
                                <span>✕</span>
                                <span className="hidden sm:inline">Exit</span>
                            </button>
                        </div>
                    )}
                </aside>,
                document.body
            )}
        </>
    );
}
