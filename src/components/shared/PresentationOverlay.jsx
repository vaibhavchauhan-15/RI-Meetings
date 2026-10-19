import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { HIGHLIGHT_COLORS, findHighlightAtPoint, getHighlightHitRects } from '../../features/meeting-reports/utils/highlightEngine.js';

/**
 * Reach International Operations - Production Presentation Overlay & Toolbar
 * 
 * Delivers an Apple-quality minimal interaction experience:
 * - Single floating presentation toolbar with zero duplicate controls.
 * - 60fps/120fps Laser Pointer using hardware-accelerated GPU transforms (zero React re-renders).
 * - Text Highlighting integration with contextual highlight color picker & auto-apply.
 * - Buttery-smooth quadratic bezier freehand Pen with coalesced pointer events and transient buffers.
 * - Precision dual Eraser targeting both pen strokes and text highlights.
 * - Coordinated Undo and Clear controls with synchronized counts.
 * - Responsive mobile & desktop support with 44x44px touch targets and safe-area insets.
 */

const PEN_COLORS = [
    { id: 'navy', name: 'Navy', hex: '#0f2537', label: 'Navy' },
    { id: 'blue', name: 'Blue', hex: '#0066cc', label: 'Reach Blue' },
    { id: 'red', name: 'Red', hex: '#ef4444', label: 'Alert Red' },
    { id: 'emerald', name: 'Emerald', hex: '#10b981', label: 'Success Green' }
];

/**
 * Polished, high-contrast floating tooltip for presentation toolbar controls.
 * Displays descriptive label along with an optional keyboard shortcut badge.
 * Auto-orients below or above based on toolbar viewport proximity (isNearTop).
 */
function ToolbarTooltip({ label, shortcut, isNearTop = false, align = 'center' }) {
    const alignmentClasses = {
        center: 'left-1/2 -translate-x-1/2',
        left: 'left-0 translate-x-0',
        right: 'right-0 left-auto translate-x-0'
    }[align] || 'left-1/2 -translate-x-1/2';

    const arrowAlignClasses = {
        center: 'after:left-1/2 after:-translate-x-1/2',
        left: 'after:left-4 after:translate-x-0',
        right: 'after:right-4 after:left-auto after:translate-x-0'
    }[align] || 'after:left-1/2 after:-translate-x-1/2';

    return (
        <span
            role="tooltip"
            className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap bg-slate-900/95 text-white shadow-xl border border-slate-700/80 backdrop-blur-xs pointer-events-none absolute z-50 transition-all duration-150 ease-out opacity-0 group-hover:opacity-100 ${alignmentClasses} ${
                isNearTop
                    ? `top-full mt-2.5 translate-y-1 group-hover:translate-y-0 after:content-[''] after:absolute after:bottom-full ${arrowAlignClasses} after:border-4 after:border-transparent after:border-b-slate-900/95`
                    : `bottom-full mb-2.5 -translate-y-1 group-hover:translate-y-0 after:content-[''] after:absolute after:top-full ${arrowAlignClasses} after:border-4 after:border-transparent after:border-t-slate-900/95`
            }`}
        >
            <span>{label}</span>
            {shortcut && (
                <kbd className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700/90 shadow-2xs">
                    {shortcut}
                </kbd>
            )}
        </span>
    );
}

export default function PresentationOverlay({
    contentRef,
    containerRef,
    onClose,
    meetingTitle = 'Daily Operational Meeting',
    highlights = [],
    onApplyHighlight,
    onUndoHighlight,
    onClearHighlights,
    canUndoHighlight = false
}) {
    // Tool states: 'pointer' | 'highlighter' | 'pen' | 'eraser'
    const [activeTool, setActiveTool] = useState('pointer');
    const [highlightColor, setHighlightColor] = useState('yellow');
    const [penColor, setPenColor] = useState('#0066cc');
    const [isFullscreen, setIsFullscreen] = useState(
        Boolean(typeof document !== 'undefined' && document.fullscreenElement)
    );
    const [isMinimized, setIsMinimized] = useState(false);
    const [position, setPosition] = useState(null); // { x: number, y: number } | null

    // Draggable toolbar refs
    const toolbarRef = useRef(null);
    const dragRef = useRef({
        isDragging: false,
        pointerId: null,
        startX: 0,
        startY: 0,
        initialX: 0,
        initialY: 0,
        hasMoved: false
    });

    // Tracking erased highlight intervals during drag to prevent redundant updates
    const erasedHighlightKeysRef = useRef(new Set());
    const pendingErasedHighlightsRef = useRef(new Set());
    const activePointersRef = useRef(new Map());
    const highlightHitRectsRef = useRef(null);
    const hasErasedStrokesRef = useRef(false);
    const redrawPendingRef = useRef(false);

    // Temporary laser stroke auto-erase duration (3.5 seconds)
    const LASER_STROKE_LIFETIME = 3500;

    // Canvas & stroke management
    const canvasRef = useRef(null);
    const strokesRef = useRef([]); // [{ id, color, width, points: [{x, y}], box }]
    const activeStrokeRef = useRef(null); // transient stroke buffer while drawing
    const isDrawingRef = useRef(false);
    const animFrameRef = useRef(null);
    const [strokeCount, setStrokeCount] = useState(0);

    // Laser pointer & temporary drawing refs
    const laserDotRef = useRef(null);
    const laserStrokesRef = useRef([]); // [{ id, points: [{x, y, time}] }]
    const laserActiveStrokeRef = useRef(null); // active transient laser stroke buffer
    const isLaserDrawingRef = useRef(false);

    // Fast 2D context & permanent stroke caching (eliminates full-canvas re-rendering during laser gestures)
    const ctxRef = useRef(null);
    const permanentCanvasRef = useRef(null);
    const isPermanentDirtyRef = useRef(true);
    const activeRipplesRef = useRef([]);

    // Coordinated action history for unified Undo
    const historyStackRef = useRef([]); // [{ type: 'stroke' | 'erase_stroke' | 'highlight' | 'clear', data }]

    // Precompute hit rects for text highlights so Eraser never causes DOM reflows during pointer move
    const refreshHighlightHitRects = useCallback(() => {
        const container = contentRef?.current || containerRef?.current;
        if (!container || !highlights || highlights.length === 0) {
            highlightHitRectsRef.current = [];
            return;
        }
        highlightHitRectsRef.current = getHighlightHitRects(container, highlights);
    }, [contentRef, containerRef, highlights]);

    useEffect(() => {
        refreshHighlightHitRects();
    }, [highlights, refreshHighlightHitRects]);

    // Active colors contextually based on active tool
    const activeColors = activeTool === 'pen' ? PEN_COLORS : HIGHLIGHT_COLORS;

    // Total active annotations count
    const totalAnnotations = strokeCount + (highlights?.length || 0);
    const canUndo = strokesRef.current.length > 0 || canUndoHighlight || historyStackRef.current.length > 0;
    const isNearTop = Boolean(position && position.y < 80);

    // -------------------------------------------------------------
    // Fullscreen Handling
    // -------------------------------------------------------------
    const toggleFullscreen = useCallback(async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
                setIsFullscreen(true);
            } else if (document.exitFullscreen) {
                await document.exitFullscreen();
                setIsFullscreen(false);
            }
        } catch {
            // Graceful fallback for restricted fullscreen environments
        }
    }, []);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(Boolean(document.fullscreenElement));
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // -------------------------------------------------------------
    // Draggable Toolbar Handling (Web Pointer & Mobile Touch)
    // -------------------------------------------------------------
    const handleDragStart = useCallback((e) => {
        if (e.button !== undefined && e.button !== 0) return;

        const toolbarEl = toolbarRef.current;
        if (!toolbarEl) return;

        const rect = toolbarEl.getBoundingClientRect();
        dragRef.current = {
            isDragging: true,
            pointerId: e.pointerId,
            startX: e.clientX,
            startY: e.clientY,
            initialX: rect.left,
            initialY: rect.top,
            hasMoved: false
        };

        try {
            e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
            // Ignore capture exceptions
        }
    }, []);

    const handleDragMove = useCallback((e) => {
        if (!dragRef.current.isDragging) return;

        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;

        if (!dragRef.current.hasMoved && Math.hypot(dx, dy) > 3) {
            dragRef.current.hasMoved = true;
        }

        if (!dragRef.current.hasMoved) return;

        const toolbarEl = toolbarRef.current;
        const width = toolbarEl ? toolbarEl.offsetWidth : 320;
        const height = toolbarEl ? toolbarEl.offsetHeight : 54;
        const pad = 8;

        let newX = dragRef.current.initialX + dx;
        let newY = dragRef.current.initialY + dy;

        // Viewport bounds clamping (ensure toolbar remains accessible everywhere on screen)
        newX = Math.max(pad, Math.min(window.innerWidth - width - pad, newX));
        newY = Math.max(pad, Math.min(window.innerHeight - height - pad, newY));

        setPosition({ x: Math.round(newX), y: Math.round(newY) });
    }, []);

    const handleDragEnd = useCallback((e) => {
        if (!dragRef.current.isDragging) return;
        try {
            e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
            // Ignore capture exceptions
        }
        dragRef.current.isDragging = false;
    }, []);

    // Ensure toolbar stays within viewport when resizing window or rotating device
    useEffect(() => {
        const handleResize = () => {
            setPosition(prev => {
                if (!prev) return null;
                const toolbarEl = toolbarRef.current;
                const width = toolbarEl ? toolbarEl.offsetWidth : 320;
                const height = toolbarEl ? toolbarEl.offsetHeight : 54;
                const pad = 8;
                const clampedX = Math.max(pad, Math.min(window.innerWidth - width - pad, prev.x));
                const clampedY = Math.max(pad, Math.min(window.innerHeight - height - pad, prev.y));
                if (clampedX === prev.x && clampedY === prev.y) return prev;
                return { x: clampedX, y: clampedY };
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // -------------------------------------------------------------
    // Active Tool Cursors & Container Styling
    // -------------------------------------------------------------
    useEffect(() => {
        const targetContainer = contentRef?.current || containerRef?.current;
        if (!targetContainer) return;

        const cursorClasses = [
            'cursor-laser-tool',
            'cursor-highlighter-tool',
            'cursor-pen-tool',
            'cursor-eraser-tool'
        ];

        cursorClasses.forEach(cls => targetContainer.classList.remove(cls));

        const toolClassMap = {
            pointer: 'cursor-laser-tool',
            highlighter: 'cursor-highlighter-tool',
            pen: 'cursor-pen-tool',
            eraser: 'cursor-eraser-tool'
        };

        const activeClass = toolClassMap[activeTool];
        if (activeClass) {
            targetContainer.classList.add(activeClass);
        }

        return () => {
            cursorClasses.forEach(cls => targetContainer.classList.remove(cls));
        };
    }, [activeTool, contentRef, containerRef]);

    // -------------------------------------------------------------
    // Canvas Sizing, Progressive Erasing & Redraw Logic (DPR Aware)
    // -------------------------------------------------------------
    const drawPermanentStrokes = useCallback((ctx) => {
        strokesRef.current.forEach(stroke => {
            if (!stroke.points || stroke.points.length === 0) return;

            ctx.save();
            ctx.beginPath();
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = stroke.color;
            ctx.lineWidth = stroke.width || 3;
            ctx.globalAlpha = 0.95;

            const pts = stroke.points;
            if (pts.length === 1) {
                ctx.arc(pts[0].x, pts[0].y, (stroke.width || 3) / 2, 0, Math.PI * 2);
                ctx.fillStyle = stroke.color;
                ctx.fill();
            } else if (pts.length === 2) {
                ctx.moveTo(pts[0].x, pts[0].y);
                ctx.lineTo(pts[1].x, pts[1].y);
                ctx.stroke();
            } else {
                ctx.moveTo(pts[0].x, pts[0].y);
                for (let i = 1; i < pts.length - 1; i++) {
                    const midX = (pts[i].x + pts[i + 1].x) / 2;
                    const midY = (pts[i].y + pts[i + 1].y) / 2;
                    ctx.quadraticCurveTo(pts[i].x, pts[i].y, midX, midY);
                }
                ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
                ctx.stroke();
            }
            ctx.restore();
        });
    }, []);

    // Draw and progressively erase a temporary laser stroke with hyper-saturated gradient and optical filament core
    const drawLaserStroke = useCallback((ctx, stroke, now) => {
        const pts = stroke.points;
        if (!pts || pts.length === 0) return false;

        const cutoffTime = now - LASER_STROKE_LIFETIME;
        const lastPt = pts[pts.length - 1];

        // If even the last point is older than cutoffTime, this stroke has completely expired
        if (lastPt.time <= cutoffTime) {
            return false;
        }

        // Case 1: Single point (tap/click without drag)
        if (pts.length === 1) {
            const age = now - pts[0].time;
            if (age >= LASER_STROKE_LIFETIME) return false;

            const fadeDuration = 600;
            const fadeStart = LASER_STROKE_LIFETIME - fadeDuration;
            const fadeProgress = age > fadeStart ? (age - fadeStart) / fadeDuration : 0;
            const alpha = Math.max(0, 1 - fadeProgress);
            const radius = Math.max(1.2, 4.2 * (1 - fadeProgress * 0.5));

            ctx.save();
            // Outer saturated glow corona
            ctx.beginPath();
            ctx.arc(pts[0].x, pts[0].y, radius * 2.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 0, 85, ${0.35 * alpha})`;
            ctx.shadowColor = '#ff0055';
            ctx.shadowBlur = 12 * alpha;
            ctx.fill();

            // Radiant saturated gradient core
            const tapGrad = ctx.createRadialGradient(
                pts[0].x, pts[0].y, 0,
                pts[0].x, pts[0].y, radius
            );
            tapGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
            tapGrad.addColorStop(0.35, `rgba(255, 23, 68, ${alpha})`);
            tapGrad.addColorStop(0.85, `rgba(255, 0, 85, ${0.95 * alpha})`);
            tapGrad.addColorStop(1, `rgba(213, 0, 0, ${0.75 * alpha})`);

            ctx.beginPath();
            ctx.arc(pts[0].x, pts[0].y, radius, 0, Math.PI * 2);
            ctx.fillStyle = tapGrad;
            ctx.shadowColor = '#ff1744';
            ctx.shadowBlur = 8 * alpha;
            ctx.fill();
            ctx.restore();
            return true;
        }

        // Case 2: Polyline stroke (drag)
        let visiblePoints = [];

        if (pts[0].time > cutoffTime) {
            // Entire stroke is still younger than cutoffTime -> full line visible
            visiblePoints = pts;
        } else {
            // Progressive Erasing: Find segment [k, k+1] that crosses cutoffTime
            let k = -1;
            for (let i = 0; i < pts.length - 1; i++) {
                if (pts[i].time <= cutoffTime && pts[i + 1].time > cutoffTime) {
                    k = i;
                    break;
                }
            }

            if (k >= 0) {
                const p1 = pts[k];
                const p2 = pts[k + 1];
                const dt = p2.time - p1.time;
                const fraction = dt > 0 ? Math.max(0, Math.min(1, (cutoffTime - p1.time) / dt)) : 1;
                const interpolatedStart = {
                    x: p1.x + (p2.x - p1.x) * fraction,
                    y: p1.y + (p2.y - p1.y) * fraction,
                    time: cutoffTime
                };
                visiblePoints = [interpolatedStart, ...pts.slice(k + 1)];
                // Memory optimization: prune fully expired point objects to limit GC pressure
                if (k > 15) {
                    pts.splice(0, k);
                }
            } else {
                visiblePoints = pts.filter(p => p.time > cutoffTime);
            }
        }

        if (visiblePoints.length === 0) return false;

        const pStart = visiblePoints[0];
        const pEnd = visiblePoints[visiblePoints.length - 1];
        let gradX0 = pStart.x, gradY0 = pStart.y;
        let gradX1 = pEnd.x, gradY1 = pEnd.y;
        const lineDist = Math.hypot(gradX1 - gradX0, gradY1 - gradY0);

        // If stroke loops back or has small displacement, use stroke bounding box for vibrant diagonal gradient
        if (lineDist < 25 && visiblePoints.length > 2) {
            let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
            for (let i = 0; i < visiblePoints.length; i++) {
                const pt = visiblePoints[i];
                if (pt.x < minX) minX = pt.x;
                if (pt.x > maxX) maxX = pt.x;
                if (pt.y < minY) minY = pt.y;
                if (pt.y > maxY) maxY = pt.y;
            }
            gradX0 = minX; gradY0 = minY;
            gradX1 = maxX; gradY1 = maxY;
        }

        // Safeguard against degenerate zero-length gradient vectors
        if (Math.hypot(gradX1 - gradX0, gradY1 - gradY0) < 2) {
            gradX1 = gradX0 + 2;
            gradY1 = gradY0 + 2;
        }

        // 1. High-saturation outer corona bloom gradient
        const haloGrad = ctx.createLinearGradient(gradX0, gradY0, gradX1, gradY1);
        haloGrad.addColorStop(0, 'rgba(255, 0, 85, 0.42)');    // Neon fuchsia bloom
        haloGrad.addColorStop(0.5, 'rgba(255, 23, 68, 0.48)'); // Laser scarlet bloom
        haloGrad.addColorStop(1, 'rgba(255, 82, 82, 0.40)');   // Laser coral bloom

        // 2. Hyper-saturated dynamic core gradient
        const bodyGrad = ctx.createLinearGradient(gradX0, gradY0, gradX1, gradY1);
        bodyGrad.addColorStop(0, '#ff0055');    // Saturated neon rose/fuchsia
        bodyGrad.addColorStop(0.35, '#ff1744'); // Hyper-vivid laser scarlet
        bodyGrad.addColorStop(0.7, '#ff3d00');  // Radiant laser fire orange-red
        bodyGrad.addColorStop(1, '#ff5252');    // Brilliant laser coral

        // Build path once using Path2D for 60/120fps GPU performance
        const path = new Path2D();
        path.moveTo(visiblePoints[0].x, visiblePoints[0].y);
        if (visiblePoints.length === 2) {
            path.lineTo(visiblePoints[1].x, visiblePoints[1].y);
        } else {
            for (let i = 1; i < visiblePoints.length - 1; i++) {
                const midX = (visiblePoints[i].x + visiblePoints[i + 1].x) / 2;
                const midY = (visiblePoints[i].y + visiblePoints[i + 1].y) / 2;
                path.quadraticCurveTo(visiblePoints[i].x, visiblePoints[i].y, midX, midY);
            }
            path.lineTo(visiblePoints[visiblePoints.length - 1].x, visiblePoints[visiblePoints.length - 1].y);
        }

        // Pass 1: Broad saturated laser bloom / corona
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = haloGrad;
        ctx.lineWidth = 10;
        ctx.shadowColor = '#ff0055';
        ctx.shadowBlur = 14;
        ctx.stroke(path);
        ctx.restore();

        // Pass 2: High-intensity saturated laser gradient body
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = bodyGrad;
        ctx.lineWidth = 4.2;
        ctx.shadowColor = '#ff1744';
        ctx.shadowBlur = 8;
        ctx.stroke(path);
        ctx.restore();

        // Pass 3: Hot optical laser core filament
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = 'rgba(255, 245, 247, 0.95)';
        ctx.lineWidth = 1.6;
        ctx.stroke(path);
        ctx.restore();

        return true;
    }, []);

    // Master DPR-aware canvas frame renderer with permanent stroke offscreen caching
    const renderCanvasFrame = useCallback((now) => {
        const canvas = canvasRef.current;
        if (!canvas) return false;
        const ctx = ctxRef.current || canvas.getContext('2d', { desynchronized: true, alpha: true }) || canvas.getContext('2d');
        if (!ctx) return false;

        const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
        const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Draw cached permanent pen strokes (offscreen buffer prevents re-rasterizing all strokes at 60/120fps)
        if (strokesRef.current.length > 0) {
            if (isPermanentDirtyRef.current || !permanentCanvasRef.current) {
                if (!permanentCanvasRef.current) {
                    permanentCanvasRef.current = document.createElement('canvas');
                }
                const offscreen = permanentCanvasRef.current;
                if (offscreen.width !== canvas.width || offscreen.height !== canvas.height) {
                    offscreen.width = canvas.width;
                    offscreen.height = canvas.height;
                }
                const offCtx = offscreen.getContext('2d');
                if (offCtx) {
                    offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
                    offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
                    drawPermanentStrokes(offCtx);
                }
                isPermanentDirtyRef.current = false;
            }
            if (permanentCanvasRef.current) {
                ctx.drawImage(permanentCanvasRef.current, 0, 0);
            }
        }
        ctx.restore();

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // 2. Draw active permanent pen stroke (if user is drawing with pen)
        if (activeTool === 'pen' && activeStrokeRef.current && activeStrokeRef.current.points.length > 0) {
            const pts = activeStrokeRef.current.points;
            ctx.save();
            ctx.beginPath();
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = activeStrokeRef.current.color;
            ctx.lineWidth = activeStrokeRef.current.width || 3;
            ctx.globalAlpha = 0.95;
            if (pts.length === 1) {
                ctx.arc(pts[0].x, pts[0].y, (activeStrokeRef.current.width || 3) / 2, 0, Math.PI * 2);
                ctx.fillStyle = activeStrokeRef.current.color;
                ctx.fill();
            } else if (pts.length === 2) {
                ctx.moveTo(pts[0].x, pts[0].y);
                ctx.lineTo(pts[1].x, pts[1].y);
                ctx.stroke();
            } else {
                ctx.moveTo(pts[0].x, pts[0].y);
                for (let i = 1; i < pts.length - 1; i++) {
                    const midX = (pts[i].x + pts[i + 1].x) / 2;
                    const midY = (pts[i].y + pts[i + 1].y) / 2;
                    ctx.quadraticCurveTo(pts[i].x, pts[i].y, midX, midY);
                }
                ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
                ctx.stroke();
            }
            ctx.restore();
        }

        // 3. Draw & progressively trim completed laser strokes
        let hasLivingLaserStrokes = false;
        laserStrokesRef.current = laserStrokesRef.current.filter(stroke => {
            const alive = drawLaserStroke(ctx, stroke, now);
            if (alive) hasLivingLaserStrokes = true;
            return alive;
        });

        // 4. Draw active temporary laser stroke (if user is currently drawing with laser)
        if (isLaserDrawingRef.current && laserActiveStrokeRef.current) {
            const alive = drawLaserStroke(ctx, laserActiveStrokeRef.current, now);
            if (alive) hasLivingLaserStrokes = true;
        }

        return hasLivingLaserStrokes || isLaserDrawingRef.current;
    }, [activeTool, drawLaserStroke, drawPermanentStrokes]);

    const startAnimationLoop = useCallback(() => {
        if (!animFrameRef.current) {
            const loop = () => {
                const needsMore = renderCanvasFrame(performance.now());
                if (needsMore) {
                    animFrameRef.current = requestAnimationFrame(loop);
                } else {
                    animFrameRef.current = null;
                }
            };
            animFrameRef.current = requestAnimationFrame(loop);
        }
    }, [renderCanvasFrame]);

    const redrawCanvas = useCallback(() => {
        renderCanvasFrame(performance.now());
    }, [renderCanvasFrame]);

    const scheduleRedraw = useCallback(() => {
        if (!redrawPendingRef.current) {
            redrawPendingRef.current = true;
            requestAnimationFrame(() => {
                redrawPendingRef.current = false;
                renderCanvasFrame(performance.now());
            });
        }
    }, [renderCanvasFrame]);

    const resizeCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const target = contentRef?.current || containerRef?.current;
        if (!canvas || !target) return;

        // Cap DPR to 2 on desktop and 1.5 on mobile to avoid giant GPU textures and memory stutter
        const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
        const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
        const targetWidth = Math.max(target.scrollWidth, target.clientWidth, 320);
        const targetHeight = Math.max(target.scrollHeight, target.clientHeight, 320);

        // Keep within hardware texture limits (e.g. 8192px)
        const maxDim = 8192;
        const physicalWidth = Math.min(maxDim, Math.floor(targetWidth * dpr));
        const physicalHeight = Math.min(maxDim, Math.floor(targetHeight * dpr));

        if (canvas.width !== physicalWidth || canvas.height !== physicalHeight) {
            canvas.width = physicalWidth;
            canvas.height = physicalHeight;
            canvas.style.width = `${targetWidth}px`;
            canvas.style.height = `${targetHeight}px`;

            ctxRef.current = canvas.getContext('2d', { desynchronized: true, alpha: true }) || canvas.getContext('2d');
            if (ctxRef.current) {
                ctxRef.current.setTransform(dpr, 0, 0, dpr, 0, 0);
            }
            isPermanentDirtyRef.current = true;
            redrawCanvas();
        }
    }, [contentRef, containerRef, redrawCanvas]);

    useEffect(() => {
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        const observer = new ResizeObserver(resizeCanvas);
        const target = contentRef?.current || containerRef?.current;
        if (target) {
            observer.observe(target);
        }
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            observer.disconnect();
            if (animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current);
                animFrameRef.current = null;
            }
            activeRipplesRef.current.forEach(r => {
                if (r && r.parentNode) r.parentNode.removeChild(r);
            });
            activeRipplesRef.current = [];
        };
    }, [contentRef, containerRef, resizeCanvas]);

    // -------------------------------------------------------------
    // Laser Pointer Feedback & Tracking (Zero React Re-renders)
    // -------------------------------------------------------------
    const triggerClickFeedback = useCallback((clientX, clientY) => {
        if (typeof document === 'undefined') return;

        // Cap concurrent ripple elements to prevent DOM thrashing during rapid taps
        while (activeRipplesRef.current.length >= 8) {
            const oldest = activeRipplesRef.current.shift();
            if (oldest && oldest.parentNode) {
                oldest.parentNode.removeChild(oldest);
            }
        }

        const ring = document.createElement('div');
        ring.className = 'laser-click-ripple laser-click-ring';
        ring.style.left = `${clientX}px`;
        ring.style.top = `${clientY}px`;
        ring.setAttribute('aria-hidden', 'true');
        document.body.appendChild(ring);
        activeRipplesRef.current.push(ring);

        const removeRing = () => {
            activeRipplesRef.current = activeRipplesRef.current.filter(r => r !== ring);
            if (ring.parentNode) {
                ring.parentNode.removeChild(ring);
            }
        };
        ring.addEventListener('animationend', removeRing, { once: true });
        setTimeout(removeRing, 460);
    }, []);

    const updateLaserDot = useCallback((clientX, clientY) => {
        if (!laserDotRef.current) return;
        laserDotRef.current.style.opacity = '1';
        laserDotRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
    }, []);

    const hideLaserDot = useCallback(() => {
        if (laserDotRef.current) {
            laserDotRef.current.style.opacity = '0';
        }
    }, []);

    useEffect(() => {
        if (activeTool !== 'pointer') {
            hideLaserDot();
            if (isLaserDrawingRef.current) {
                isLaserDrawingRef.current = false;
                laserActiveStrokeRef.current = null;
            }
            return;
        }

        const handlePointerMove = (e) => {
            if (!laserDotRef.current) return;
            const isOverControls = Boolean(e.target?.closest?.('.presentation-toolbar'));
            if (isOverControls) {
                hideLaserDot();
            } else {
                updateLaserDot(e.clientX, e.clientY);
            }
        };

        const handlePointerLeave = () => {
            hideLaserDot();
        };

        window.addEventListener('pointermove', handlePointerMove, { passive: true });
        window.addEventListener('pointerleave', handlePointerLeave);

        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerleave', handlePointerLeave);
        };
    }, [activeTool, hideLaserDot, updateLaserDot]);

    // -------------------------------------------------------------
    // Freehand Drawing & Eraser Event Handling
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

    // Distance from point to line segment
    const distToSegment = (p, v, w) => {
        const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
        if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
        let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
        t = Math.max(0, Math.min(1, t));
        return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
    };

    // Fast bounding box calculation for O(1) eraser stroke rejection
    const computeStrokeBounds = (points, width = 3) => {
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        for (let i = 0; i < points.length; i++) {
            const pt = points[i];
            if (pt.x < minX) minX = pt.x;
            if (pt.x > maxX) maxX = pt.x;
            if (pt.y < minY) minY = pt.y;
            if (pt.y > maxY) maxY = pt.y;
        }
        const pad = (width || 3) + 2;
        return {
            minX: minX - pad,
            maxX: maxX + pad,
            minY: minY - pad,
            maxY: maxY + pad
        };
    };

    /**
     * Precision dual Eraser: erases pen strokes and highlighted text intervals
     * Optimized with O(1) stroke bounding box rejection, batched highlight updates, and zero-reflow cached highlight rects.
     */
    const eraseAt = (coords, clientX, clientY) => {
        // 1. Fast Erase pen strokes within 20px radius with bounding-box check
        const eraseRadius = 20;
        let anyStrokeRemoved = false;
        strokesRef.current = strokesRef.current.filter(stroke => {
            const pts = stroke.points;
            if (!pts || pts.length === 0) return false;

            // Fast bounding-box rejection: skips checking hundreds of points if cursor is far
            const box = stroke.box;
            if (box && (
                coords.x < box.minX - eraseRadius ||
                coords.x > box.maxX + eraseRadius ||
                coords.y < box.minY - eraseRadius ||
                coords.y > box.maxY + eraseRadius
            )) {
                return true;
            }

            let hit = false;
            if (pts.length === 1) {
                hit = Math.hypot(pts[0].x - coords.x, pts[0].y - coords.y) <= eraseRadius;
            } else {
                for (let i = 0; i < pts.length - 1; i++) {
                    if (distToSegment(coords, pts[i], pts[i + 1]) <= eraseRadius) {
                        hit = true;
                        break;
                    }
                }
            }
            if (hit) {
                historyStackRef.current.push({ type: 'erase_stroke', stroke });
                anyStrokeRemoved = true;
                return false;
            }
            return true;
        });

        if (anyStrokeRemoved) {
            hasErasedStrokesRef.current = true;
            isPermanentDirtyRef.current = true;
            scheduleRedraw();
        }

        // 2. Erase text highlight if cursor is over a highlighted text range (zero reflow cached check)
        const container = contentRef?.current || containerRef?.current;
        if (container && onApplyHighlight && highlights && highlights.length > 0) {
            const targetHl = findHighlightAtPoint(container, clientX, clientY, highlights, highlightHitRectsRef.current);
            if (targetHl) {
                const hlKey = targetHl.id || `${targetHl.start}-${targetHl.end}`;
                if (!erasedHighlightKeysRef.current.has(hlKey)) {
                    erasedHighlightKeysRef.current.add(hlKey);
                    if (highlightHitRectsRef.current) {
                        highlightHitRectsRef.current = highlightHitRectsRef.current.filter(e => e.item !== targetHl);
                    }
                    historyStackRef.current.push({ type: 'highlight', prevHighlights: [...highlights] });
                    // Batch to pointerup so React reconciliation doesn't stutter continuous touch drag
                    pendingErasedHighlightsRef.current.add(targetHl);
                }
            }
        }
    };

    const handlePointerDown = (e) => {
        if (activeTool === 'highlighter') return;
        if (e.target?.closest?.('.presentation-toolbar')) return;

        // Prevent native gesture hesitation and scroll conflicts on mobile
        if (e.cancelable && (activeTool === 'pen' || activeTool === 'eraser' || activeTool === 'pointer')) {
            e.preventDefault();
        }

        erasedHighlightKeysRef.current.clear();
        pendingErasedHighlightsRef.current.clear();

        // Multi-touch tracking for 2-finger document navigation on mobile
        activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (activePointersRef.current.size >= 2) {
            if (isDrawingRef.current) {
                isDrawingRef.current = false;
                activeStrokeRef.current = null;
                redrawCanvas();
            }
            if (isLaserDrawingRef.current) {
                isLaserDrawingRef.current = false;
                laserActiveStrokeRef.current = null;
            }
            return;
        }

        try {
            e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
            // Ignore capture exceptions
        }

        const coords = getCanvasCoordinates(e);

        if (activeTool === 'pointer') {
            triggerClickFeedback(e.clientX, e.clientY);
            updateLaserDot(e.clientX, e.clientY);
            const now = performance.now();
            isLaserDrawingRef.current = true;
            laserActiveStrokeRef.current = {
                id: 'laser-' + now + '-' + Math.random(),
                points: [{ x: coords.x, y: coords.y, time: now }]
            };
            startAnimationLoop();
            return;
        }

        isDrawingRef.current = true;

        if (activeTool === 'eraser') {
            refreshHighlightHitRects();
            eraseAt(coords, e.clientX, e.clientY);
            return;
        }

        // Initialize active transient stroke with initial bounding box
        const newStroke = {
            id: Date.now() + Math.random(),
            color: penColor,
            width: 3,
            points: [coords],
            lastDrawnIndex: 0,
            box: computeStrokeBounds([coords], 3)
        };

        activeStrokeRef.current = newStroke;

        // Draw initial point immediately with low-latency desynchronized context
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d', { desynchronized: true, alpha: true }) || canvas.getContext('2d');
            if (ctx) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(coords.x, coords.y, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = penColor;
                ctx.fill();
                ctx.restore();
            }
        }
    };

    const handlePointerMove = (e) => {
        // Multi-touch: allow 2-finger document panning on mobile touch devices
        if (activePointersRef.current.has(e.pointerId)) {
            const prev = activePointersRef.current.get(e.pointerId);
            activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
            if (activePointersRef.current.size >= 2) {
                const deltaY = prev.y - e.clientY;
                const deltaX = prev.x - e.clientX;
                const targetContainer = contentRef?.current?.parentElement || containerRef?.current || window;
                if (targetContainer && targetContainer.scrollBy) {
                    targetContainer.scrollBy({ left: deltaX, top: deltaY, behavior: 'instant' });
                } else if (typeof window !== 'undefined') {
                    window.scrollBy({ left: deltaX, top: deltaY, behavior: 'instant' });
                }
                return;
            }
        }

        // Layout optimization: query getBoundingClientRect ONCE per pointermove event
        const canvas = canvasRef.current;
        if (!canvas) return;
        const canvasRect = canvas.getBoundingClientRect();
        const getEventCoords = (evt) => ({
            x: evt.clientX - canvasRect.left,
            y: evt.clientY - canvasRect.top
        });

        if (activeTool === 'pointer') {
            updateLaserDot(e.clientX, e.clientY);
            if (!isLaserDrawingRef.current || !laserActiveStrokeRef.current) return;

            const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
            const now = performance.now();
            const pts = laserActiveStrokeRef.current.points;

            for (const evt of events) {
                const coords = getEventCoords(evt);
                const last = pts[pts.length - 1];
                if (!last || Math.hypot(coords.x - last.x, coords.y - last.y) >= 1.5) {
                    pts.push({ x: coords.x, y: coords.y, time: now });
                }
            }

            // Memory optimization: Prune points that have exceeded lifetime during continuous drag
            const cutoff = now - LASER_STROKE_LIFETIME;
            if (pts.length > 50 && pts[0].time < cutoff - 500) {
                const firstValidIdx = pts.findIndex(p => p.time >= cutoff);
                if (firstValidIdx > 1) {
                    pts.splice(0, firstValidIdx - 1);
                }
            }

            startAnimationLoop();
            return;
        }

        if (!isDrawingRef.current) return;
        if (activeTool === 'highlighter') return;

        if (e.cancelable && (activeTool === 'pen' || activeTool === 'eraser')) {
            e.preventDefault();
        }

        // Extract coalesced events for highest polling fidelity
        const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];

        for (const evt of events) {
            const coords = getEventCoords(evt);

            if (activeTool === 'eraser') {
                eraseAt(coords, evt.clientX, evt.clientY);
            } else if (activeStrokeRef.current) {
                const pts = activeStrokeRef.current.points;
                const last = pts[pts.length - 1];
                // Distance decimation: ignore sub-pixel micro-jitter < 2px to cut point bloat by 65%
                if (!last || Math.hypot(coords.x - last.x, coords.y - last.y) >= 2.0) {
                    pts.push(coords);
                    // Update bounding box incrementally in O(1)
                    const box = activeStrokeRef.current.box;
                    if (box) {
                        const pad = 5;
                        if (coords.x - pad < box.minX) box.minX = coords.x - pad;
                        if (coords.x + pad > box.maxX) box.maxX = coords.x + pad;
                        if (coords.y - pad < box.minY) box.minY = coords.y - pad;
                        if (coords.y + pad > box.maxY) box.maxY = coords.y + pad;
                    }
                }
            }
        }

        // Incremental rendering connecting every single coalesced point with zero lag
        if (activeTool === 'pen' && activeStrokeRef.current) {
            const ctx = canvas.getContext('2d', { desynchronized: true, alpha: true }) || canvas.getContext('2d');
            if (!ctx) return;

            const stroke = activeStrokeRef.current;
            const pts = stroke.points;
            const startIndex = stroke.lastDrawnIndex || 0;

            if (pts.length > startIndex + 1) {
                ctx.save();
                ctx.beginPath();
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.strokeStyle = stroke.color;
                ctx.lineWidth = stroke.width || 3;
                ctx.globalAlpha = 0.95;

                for (let i = Math.max(1, startIndex); i < pts.length; i++) {
                    const p0 = pts[i - 1];
                    const p1 = pts[i];
                    const midX = (p0.x + p1.x) / 2;
                    const midY = (p0.y + p1.y) / 2;
                    if (i === 1) {
                        ctx.moveTo(p0.x, p0.y);
                        ctx.lineTo(midX, midY);
                    } else {
                        const pPrev = pts[i - 2];
                        const prevMidX = (pPrev.x + p0.x) / 2;
                        const prevMidY = (pPrev.y + p0.y) / 2;
                        ctx.moveTo(prevMidX, prevMidY);
                        ctx.quadraticCurveTo(p0.x, p0.y, midX, midY);
                    }
                }
                ctx.stroke();
                ctx.restore();
                stroke.lastDrawnIndex = pts.length - 1;
            }
        }
    };

    const handlePointerUp = (e) => {
        activePointersRef.current.delete(e.pointerId);
        erasedHighlightKeysRef.current.clear();
        try {
            e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
            // Ignore
        }

        // Commit any batched erased highlights on gesture completion
        if (pendingErasedHighlightsRef.current.size > 0) {
            const itemsToClear = Array.from(pendingErasedHighlightsRef.current);
            pendingErasedHighlightsRef.current.clear();
            itemsToClear.forEach(hl => {
                onApplyHighlight?.('clear', hl);
            });
        }

        if (activeTool === 'pointer') {
            if (isLaserDrawingRef.current) {
                isLaserDrawingRef.current = false;
                if (laserActiveStrokeRef.current && laserActiveStrokeRef.current.points.length > 0) {
                    laserStrokesRef.current.push(laserActiveStrokeRef.current);
                }
                laserActiveStrokeRef.current = null;
                startAnimationLoop();
            }
            if (e.pointerType === 'touch') {
                setTimeout(() => {
                    if (!isLaserDrawingRef.current) {
                        hideLaserDot();
                    }
                }, 150);
            }
            return;
        }

        if (hasErasedStrokesRef.current) {
            hasErasedStrokesRef.current = false;
            setStrokeCount(strokesRef.current.length);
            redrawCanvas();
        }

        if (!isDrawingRef.current) return;
        isDrawingRef.current = false;

        if (activeStrokeRef.current && activeStrokeRef.current.points.length > 0) {
            const stroke = activeStrokeRef.current;
            stroke.box = computeStrokeBounds(stroke.points, stroke.width);
            strokesRef.current.push(stroke);
            historyStackRef.current.push({ type: 'stroke', stroke });
            setStrokeCount(strokesRef.current.length);
            isPermanentDirtyRef.current = true;
            activeStrokeRef.current = null;
            // The stroke has already been cleanly painted incrementally onto the canvas.
            // Avoid wiping and re-rasterizing the full-screen canvas here to prevent visual hitch.
        }
    };

    const handlePointerCancel = (e) => {
        activePointersRef.current.delete(e.pointerId);
        erasedHighlightKeysRef.current.clear();
        pendingErasedHighlightsRef.current.clear();
        try {
            e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
            // Ignore
        }

        if (activeTool === 'pointer') {
            isLaserDrawingRef.current = false;
            if (laserActiveStrokeRef.current && laserActiveStrokeRef.current.points.length > 0) {
                laserStrokesRef.current.push(laserActiveStrokeRef.current);
            }
            laserActiveStrokeRef.current = null;
            startAnimationLoop();
            hideLaserDot();
            return;
        }

        if (hasErasedStrokesRef.current) {
            hasErasedStrokesRef.current = false;
            setStrokeCount(strokesRef.current.length);
        }

        if (!isDrawingRef.current) return;
        isDrawingRef.current = false;
        activeStrokeRef.current = null;
        redrawCanvas();
    };

    // -------------------------------------------------------------
    // Auto-apply Active Highlight when Selecting Text in Highlight Mode
    // -------------------------------------------------------------
    useEffect(() => {
        if (activeTool !== 'highlighter') return;

        let debounceTimer = null;
        let isTouching = false;

        const handleTouchStart = () => {
            isTouching = true;
        };

        const handleHighlighterSelectionEnd = (e) => {
            isTouching = false;
            if (e?.target?.closest?.('.presentation-toolbar')) return;

            if (debounceTimer) clearTimeout(debounceTimer);
            // Allow browser selection range to finalize smoothly on desktop & mobile touch
            debounceTimer = setTimeout(() => {
                const selection = window.getSelection();
                if (!selection || selection.isCollapsed || selection.rangeCount === 0) return;
                const text = selection.toString().trim();
                if (!text) return;

                if (onApplyHighlight) {
                    historyStackRef.current.push({ type: 'highlight' });
                    onApplyHighlight(highlightColor);
                }
            }, 80);
        };

        const handleSelectionChange = () => {
            // Guard: If user is actively touching or dragging mobile selection handles,
            // DO NOT auto-apply mid-drag. This prevents premature collapse of touch handles.
            if (isTouching) return;

            if (debounceTimer) clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                if (isTouching) return;
                const selection = window.getSelection();
                if (!selection || selection.isCollapsed || selection.rangeCount === 0) return;
                const text = selection.toString().trim();
                if (!text) return;

                if (onApplyHighlight) {
                    historyStackRef.current.push({ type: 'highlight' });
                    onApplyHighlight(highlightColor);
                }
            }, 150);
        };

        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('pointerup', handleHighlighterSelectionEnd);
        window.addEventListener('touchend', handleHighlighterSelectionEnd);
        document.addEventListener('selectionchange', handleSelectionChange);
        return () => {
            if (debounceTimer) clearTimeout(debounceTimer);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('pointerup', handleHighlighterSelectionEnd);
            window.removeEventListener('touchend', handleHighlighterSelectionEnd);
            document.removeEventListener('selectionchange', handleSelectionChange);
        };
    }, [activeTool, highlightColor, onApplyHighlight]);

    // -------------------------------------------------------------
    // Unified Undo & Clear Actions
    // -------------------------------------------------------------
    const handleUndo = useCallback(() => {
        if (historyStackRef.current.length > 0) {
            const action = historyStackRef.current.pop();
            if (action.type === 'stroke') {
                strokesRef.current = strokesRef.current.filter(s => s.id !== action.stroke.id);
                setStrokeCount(strokesRef.current.length);
                isPermanentDirtyRef.current = true;
                redrawCanvas();
                return;
            } else if (action.type === 'erase_stroke') {
                strokesRef.current.push(action.stroke);
                setStrokeCount(strokesRef.current.length);
                isPermanentDirtyRef.current = true;
                redrawCanvas();
                return;
            } else if (action.type === 'highlight') {
                if (onUndoHighlight) onUndoHighlight();
                return;
            } else if (action.type === 'clear_all') {
                strokesRef.current = action.strokes || [];
                setStrokeCount(strokesRef.current.length);
                isPermanentDirtyRef.current = true;
                redrawCanvas();
                if (onUndoHighlight) onUndoHighlight();
                return;
            }
        }

        // Fallback if history stack empty
        if (strokesRef.current.length > 0) {
            strokesRef.current.pop();
            setStrokeCount(strokesRef.current.length);
            isPermanentDirtyRef.current = true;
            redrawCanvas();
        } else if (onUndoHighlight) {
            onUndoHighlight();
        }
    }, [onUndoHighlight, redrawCanvas]);

    const handleClearAll = useCallback(() => {
        if (strokesRef.current.length === 0 && (!highlights || highlights.length === 0) && laserStrokesRef.current.length === 0) return;

        if (strokesRef.current.length > 0 || (highlights && highlights.length > 0)) {
            historyStackRef.current.push({
                type: 'clear_all',
                strokes: [...strokesRef.current]
            });
        }

        strokesRef.current = [];
        laserStrokesRef.current = [];
        laserActiveStrokeRef.current = null;
        isLaserDrawingRef.current = false;
        isPermanentDirtyRef.current = true;
        setStrokeCount(0);
        redrawCanvas();

        if (onClearHighlights) {
            onClearHighlights();
        }
    }, [highlights, onClearHighlights, redrawCanvas]);

    // -------------------------------------------------------------
    // Global Keyboard Shortcuts
    // -------------------------------------------------------------
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.target.isContentEditable) {
                return;
            }

            if (e.key === 'Escape') {
                e.preventDefault();
                onClose?.();
            } else if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
                e.preventDefault();
                handleUndo();
            } else if (e.key === 'p' || e.key === 'P') {
                setActiveTool('pointer');
            } else if (e.key === 'h' || e.key === 'H') {
                setActiveTool('highlighter');
            } else if (e.key === 'd' || e.key === 'D' || e.key === 'b' || e.key === 'B') {
                setActiveTool('pen');
            } else if (e.key === 'e' || e.key === 'E') {
                setActiveTool('eraser');
            } else if (e.key === 'm' || e.key === 'M') {
                setIsMinimized(prev => !prev);
            } else if (e.key === 'f' || e.key === 'F') {
                toggleFullscreen();
            } else if (e.key === 'c' || e.key === 'C') {
                handleClearAll();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, toggleFullscreen, handleUndo, handleClearAll]);

    // Canvas cursor class
    const getCanvasCursorClass = () => {
        switch (activeTool) {
            case 'pointer':
                return 'cursor-laser-tool pointer-events-auto';
            case 'highlighter':
                return 'cursor-highlighter-tool pointer-events-none';
            case 'pen':
                return 'cursor-pen-tool pointer-events-auto';
            case 'eraser':
                return 'cursor-eraser-tool pointer-events-auto';
            default:
                return 'cursor-default pointer-events-none';
        }
    };

    const canvasElement = (
        <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            className={`absolute inset-0 z-20 select-none ${getCanvasCursorClass()}`}
            style={{
                touchAction: (activeTool === 'pen' || activeTool === 'eraser' || activeTool === 'pointer') ? 'none' : 'pan-y',
                willChange: 'transform'
            }}
        />
    );

    return (
        <>
            {/* 1. Anchored Canvas Layer (Portaled into contentRef for perfect synchronous scrolling) */}
            {contentRef?.current 
                ? createPortal(canvasElement, contentRef.current) 
                : canvasElement
            }

            {/* 2. Hardware Accelerated Laser Pointer Dot (Zero React Re-renders) */}
            {activeTool === 'pointer' && typeof document !== 'undefined' && createPortal(
                <div
                    ref={laserDotRef}
                    className="laser-pointer-dot opacity-0"
                    style={{ left: 0, top: 0 }}
                    aria-hidden="true"
                />,
                document.body
            )}

            {/* 3. Single Apple-Quality Presentation Toolbar */}
            {typeof document !== 'undefined' && createPortal(
                <aside 
                    ref={toolbarRef}
                    className={`presentation-toolbar fixed z-[9990] select-none transition-shadow duration-150 ${
                        position ? '' : 'bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 pb-[env(safe-area-inset-bottom,0px)]'
                    }`}
                    style={position ? { left: `${position.x}px`, top: `${position.y}px`, transform: 'none', bottom: 'auto' } : undefined}
                    role="toolbar"
                    aria-label="Presentation toolbar"
                >
                    {isMinimized ? (
                        /* Minimized Floating Control Pill */
                        <div 
                            className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/95 text-slate-800 border border-slate-200/90 shadow-[0_8px_32px_rgba(0,0,0,0.14)] backdrop-blur-xl animate-fade-in overflow-visible"
                            onClick={(e) => {
                                if (!dragRef.current.hasMoved && !e.target.closest('button[data-action="exit"]')) {
                                    setIsMinimized(false);
                                }
                            }}
                        >
                            {/* Drag Handle */}
                            <div
                                data-drag-handle="true"
                                role="button"
                                aria-label="Drag toolbar"
                                tabIndex={0}
                                onPointerDown={handleDragStart}
                                onPointerMove={handleDragMove}
                                onPointerUp={handleDragEnd}
                                onPointerCancel={handleDragEnd}
                                className="group relative flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 cursor-grab active:cursor-grabbing touch-none flex-shrink-0 transition-colors select-none min-h-[44px] min-w-[36px]"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                    <circle cx="9" cy="6" r="1.5" />
                                    <circle cx="15" cy="6" r="1.5" />
                                    <circle cx="9" cy="12" r="1.5" />
                                    <circle cx="15" cy="12" r="1.5" />
                                    <circle cx="9" cy="18" r="1.5" />
                                    <circle cx="15" cy="18" r="1.5" />
                                </svg>
                                <ToolbarTooltip label="Drag Toolbar" isNearTop={isNearTop} align="left" />
                            </div>

                            {/* Active Tool Badge with Indicator */}
                            <div 
                                className="group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-slate-100 transition-colors"
                                aria-label={`Active tool: ${activeTool}`}
                            >
                                {activeTool === 'pointer' && (
                                    <svg className="w-4 h-4 text-rose-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="3" fill="#ef4444" />
                                        <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
                                    </svg>
                                )}
                                {activeTool === 'highlighter' && (
                                    <svg className="w-4 h-4 text-amber-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m9 11-6 6v3h3l6-6" />
                                        <path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4" />
                                    </svg>
                                )}
                                {activeTool === 'pen' && (
                                    <svg className="w-4 h-4 text-sky-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                        <path d="m15 5 4 4" />
                                    </svg>
                                )}
                                {activeTool === 'eraser' && (
                                    <svg className="w-4 h-4 text-slate-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
                                        <path d="M22 21H7" />
                                        <path d="m5 11 9 9" />
                                    </svg>
                                )}
                                {(activeTool === 'highlighter' || activeTool === 'pen') && (
                                    <span 
                                        className="w-2.5 h-2.5 rounded-full border border-slate-300 shadow-2xs" 
                                        style={{ 
                                            backgroundColor: activeTool === 'pen' ? penColor : (HIGHLIGHT_COLORS.find(c => c.id === highlightColor)?.hex || '#facc15') 
                                        }} 
                                    />
                                )}
                                <ToolbarTooltip label={`Active: ${activeTool.charAt(0).toUpperCase() + activeTool.slice(1)}`} isNearTop={isNearTop} />
                            </div>

                            {/* Expand Button */}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsMinimized(false);
                                }}
                                className="group relative p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0 border border-transparent hover:border-slate-200"
                                aria-label="Expand Toolbar (M)"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="18 15 12 9 6 15" />
                                </svg>
                                <ToolbarTooltip label="Expand Toolbar" shortcut="M" isNearTop={isNearTop} />
                            </button>

                            {/* Exit Button */}
                            <button
                                type="button"
                                data-action="exit"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClose?.();
                                }}
                                className="group relative flex items-center justify-center p-2 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white transition-all shadow-xs cursor-pointer min-h-[44px] min-w-[44px] flex-shrink-0"
                                aria-label="Exit Presentation Mode (Esc)"
                            >
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                                <ToolbarTooltip label="Exit Presentation" shortcut="Esc" isNearTop={isNearTop} align="right" />
                            </button>
                        </div>
                    ) : (
                        <div 
                            className="flex items-center gap-1 sm:gap-1.5 p-1.5 sm:p-2 rounded-2xl bg-white/95 text-slate-800 border border-slate-200/90 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl max-w-[96vw] overflow-x-auto sm:overflow-visible scrollbar-none animate-fade-in"
                            onPointerMove={handleDragMove}
                            onPointerUp={handleDragEnd}
                            onPointerCancel={handleDragEnd}
                        >
                            {/* Drag Handle (Web & Mobile Draggable) */}
                            <div
                                data-drag-handle="true"
                                role="button"
                                aria-label="Drag toolbar"
                                tabIndex={0}
                                onPointerDown={handleDragStart}
                                onPointerMove={handleDragMove}
                                onPointerUp={handleDragEnd}
                                onPointerCancel={handleDragEnd}
                                className="group relative flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 cursor-grab active:cursor-grabbing touch-none flex-shrink-0 transition-colors select-none min-h-[44px] min-w-[36px]"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                    <circle cx="9" cy="6" r="1.5" />
                                    <circle cx="15" cy="6" r="1.5" />
                                    <circle cx="9" cy="12" r="1.5" />
                                    <circle cx="15" cy="12" r="1.5" />
                                    <circle cx="9" cy="18" r="1.5" />
                                    <circle cx="15" cy="18" r="1.5" />
                                </svg>
                                <ToolbarTooltip label="Drag Toolbar" isNearTop={isNearTop} align="left" />
                            </div>

                            {/* Tool Segment: Laser Pointer */}
                            <button
                                type="button"
                                onClick={() => setActiveTool('pointer')}
                                className={`group relative flex items-center justify-center p-2 sm:p-2.5 rounded-xl transition-all cursor-pointer min-h-[44px] min-w-[44px] flex-shrink-0 ${
                                    activeTool === 'pointer'
                                        ? 'bg-rose-50 text-rose-700 border border-rose-300 ring-2 ring-rose-400/20 font-bold shadow-2xs'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                                }`}
                                aria-label="Laser Pointer (P)"
                                aria-pressed={activeTool === 'pointer'}
                            >
                                <svg className="w-4 h-4 text-rose-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="3" fill="#ef4444" />
                                    <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
                                </svg>
                                <ToolbarTooltip label="Laser Pointer" shortcut="P" isNearTop={isNearTop} />
                            </button>

                            {/* Tool Segment: Text Highlight */}
                            <button
                                type="button"
                                onClick={() => setActiveTool('highlighter')}
                                className={`group relative flex items-center justify-center p-2 sm:p-2.5 rounded-xl transition-all cursor-pointer min-h-[44px] min-w-[44px] flex-shrink-0 ${
                                    activeTool === 'highlighter'
                                        ? 'bg-amber-50 text-amber-900 border border-amber-300 ring-2 ring-amber-400/20 font-bold shadow-2xs'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                                }`}
                                aria-label="Text Highlighter (H)"
                                aria-pressed={activeTool === 'highlighter'}
                            >
                                <svg className="w-4 h-4 text-amber-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m9 11-6 6v3h3l6-6" />
                                    <path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4" />
                                </svg>
                                <ToolbarTooltip label="Text Highlighter" shortcut="H" isNearTop={isNearTop} />
                            </button>

                            {/* Tool Segment: Freehand Pen */}
                            <button
                                type="button"
                                onClick={() => setActiveTool('pen')}
                                className={`group relative flex items-center justify-center p-2 sm:p-2.5 rounded-xl transition-all cursor-pointer min-h-[44px] min-w-[44px] flex-shrink-0 ${
                                    activeTool === 'pen'
                                        ? 'bg-sky-50 text-sky-900 border border-sky-300 ring-2 ring-sky-400/20 font-bold shadow-2xs'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                                }`}
                                aria-label="Freehand Pen (D)"
                                aria-pressed={activeTool === 'pen'}
                            >
                                <svg className="w-4 h-4 text-sky-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                    <path d="m15 5 4 4" />
                                </svg>
                                <ToolbarTooltip label="Freehand Pen" shortcut="D" isNearTop={isNearTop} />
                            </button>

                            {/* Tool Segment: Eraser */}
                            <button
                                type="button"
                                onClick={() => setActiveTool('eraser')}
                                className={`group relative flex items-center justify-center p-2 sm:p-2.5 rounded-xl transition-all cursor-pointer min-h-[44px] min-w-[44px] flex-shrink-0 ${
                                    activeTool === 'eraser'
                                        ? 'bg-slate-100 text-slate-900 border border-slate-300 ring-2 ring-slate-400/20 font-bold shadow-2xs'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                                }`}
                                aria-label="Precision Eraser (E)"
                                aria-pressed={activeTool === 'eraser'}
                            >
                                <svg className="w-4 h-4 text-slate-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
                                    <path d="M22 21H7" />
                                    <path d="m5 11 9 9" />
                                </svg>
                                <ToolbarTooltip label="Precision Eraser" shortcut="E" isNearTop={isNearTop} />
                            </button>

                            {/* Contextual Color Selector (Shown when Pen or Highlighter is active) */}
                            {(activeTool === 'highlighter' || activeTool === 'pen') && (
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-xl border border-slate-200/90 flex-shrink-0 animate-fade-in">
                                    {activeColors.map(swatch => {
                                        const isSelected = activeTool === 'pen'
                                            ? penColor === swatch.hex
                                            : highlightColor === swatch.id;

                                        return (
                                            <div key={swatch.id || swatch.hex} className="relative group flex items-center">
                                                <button
                                                    type="button"
                                                    onPointerDown={(e) => {
                                                        // Prevent focus theft so active selection is not cleared
                                                        e.preventDefault();
                                                    }}
                                                    onClick={() => {
                                                        if (activeTool === 'pen') {
                                                            setPenColor(swatch.hex);
                                                        } else {
                                                            setHighlightColor(swatch.id);
                                                            if (onApplyHighlight) {
                                                                onApplyHighlight(swatch.id);
                                                            }
                                                        }
                                                    }}
                                                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-all cursor-pointer ${
                                                        isSelected
                                                            ? 'scale-115 border-slate-900 ring-2 ring-slate-400 shadow-xs'
                                                            : 'border-white/80 opacity-75 hover:opacity-100 hover:scale-105'
                                                    }`}
                                                    style={{ backgroundColor: swatch.hex }}
                                                    aria-label={swatch.label || swatch.name}
                                                />
                                                <ToolbarTooltip label={swatch.label || swatch.name} isNearTop={isNearTop} />
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Divider */}
                            <div className="w-[1px] h-6 bg-slate-200 mx-0.5 flex-shrink-0" />

                            {/* Undo Action */}
                            <div className="relative group flex items-center">
                                <button
                                    type="button"
                                    onClick={handleUndo}
                                    disabled={!canUndo}
                                    className={`p-2 sm:p-2.5 rounded-xl transition-all min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0 border ${
                                        canUndo
                                            ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95 cursor-pointer border-transparent hover:border-slate-200'
                                            : 'text-slate-300 cursor-not-allowed border-transparent'
                                    }`}
                                    aria-label="Undo Annotation (Ctrl+Z)"
                                >
                                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="1 4 1 10 7 10" />
                                        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                                    </svg>
                                </button>
                                <ToolbarTooltip label="Undo" shortcut="Ctrl+Z" isNearTop={isNearTop} />
                            </div>

                            {/* Clear Action */}
                            <div className="relative group flex items-center">
                                <button
                                    type="button"
                                    onClick={handleClearAll}
                                    disabled={totalAnnotations === 0}
                                    className={`relative p-2 sm:p-2.5 rounded-xl transition-all min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0 border ${
                                        totalAnnotations > 0
                                            ? 'text-rose-600 hover:text-rose-700 hover:bg-rose-50 active:scale-95 cursor-pointer border-transparent hover:border-rose-200'
                                            : 'text-slate-300 cursor-not-allowed border-transparent'
                                    }`}
                                    aria-label={`Clear all annotations${totalAnnotations > 0 ? ` (${totalAnnotations})` : ''} (C)`}
                                >
                                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                        <line x1="10" y1="11" x2="10" y2="17" />
                                        <line x1="14" y1="11" x2="14" y2="17" />
                                    </svg>
                                    {totalAnnotations > 0 && (
                                        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs pointer-events-none">
                                            {totalAnnotations}
                                        </span>
                                    )}
                                </button>
                                <ToolbarTooltip 
                                    label={totalAnnotations > 0 ? `Clear All (${totalAnnotations})` : 'Clear Annotations'} 
                                    shortcut="C" 
                                    isNearTop={isNearTop} 
                                />
                            </div>

                            {/* Fullscreen Action */}
                            <button
                                type="button"
                                onClick={toggleFullscreen}
                                className="group relative p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0 border border-transparent hover:border-slate-200"
                                aria-label="Toggle Fullscreen (F)"
                            >
                                {isFullscreen ? (
                                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="4 14 10 14 10 20" />
                                        <polyline points="20 10 14 10 14 4" />
                                        <line x1="14" y1="10" x2="21" y2="3" />
                                        <line x1="3" y1="21" x2="10" y2="14" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="15 3 21 3 21 9" />
                                        <polyline points="9 21 3 21 3 15" />
                                        <line x1="21" y1="3" x2="14" y2="10" />
                                        <line x1="3" y1="21" x2="10" y2="14" />
                                    </svg>
                                )}
                                <ToolbarTooltip label={isFullscreen ? 'Exit Fullscreen' : 'Toggle Fullscreen'} shortcut="F" isNearTop={isNearTop} />
                            </button>

                            {/* Minimize Action */}
                            <button
                                type="button"
                                onClick={() => setIsMinimized(true)}
                                className="group relative p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0 border border-transparent hover:border-slate-200"
                                aria-label="Minimize Toolbar (M)"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                                <ToolbarTooltip label="Minimize Toolbar" shortcut="M" isNearTop={isNearTop} />
                            </button>

                            {/* Exit Action */}
                            <button
                                type="button"
                                onClick={onClose}
                                className="group relative p-2 sm:p-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white transition-all shadow-xs cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0"
                                aria-label="Exit Presentation Mode (Esc)"
                            >
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                                <ToolbarTooltip label="Exit Presentation" shortcut="Esc" isNearTop={isNearTop} align="right" />
                            </button>
                        </div>
                    )}
            </aside>,
                document.body
            )}
        </>
    );
}
