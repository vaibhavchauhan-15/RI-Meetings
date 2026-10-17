import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { HIGHLIGHT_COLORS, findHighlightAtPoint } from '../../features/meeting-reports/utils/highlightEngine.js';

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

// Temporary laser stroke auto-erase duration (3.5 seconds)
const LASER_STROKE_LIFETIME = 3500;

    // Canvas & stroke management
    const canvasRef = useRef(null);
    const strokesRef = useRef([]); // [{ id, color, width, points: [{x, y}] }]
    const activeStrokeRef = useRef(null); // transient stroke buffer while drawing
    const isDrawingRef = useRef(false);
    const animFrameRef = useRef(null);
    const [strokeCount, setStrokeCount] = useState(0);

    // Laser pointer & temporary drawing refs
    const laserDotRef = useRef(null);
    const laserStrokesRef = useRef([]); // [{ id, points: [{x, y, time}] }]
    const laserActiveStrokeRef = useRef(null); // active transient laser stroke buffer
    const isLaserDrawingRef = useRef(false);

    // Coordinated action history for unified Undo
    const historyStackRef = useRef([]); // [{ type: 'stroke' | 'erase_stroke' | 'highlight' | 'clear', data }]

    // Active colors contextually based on active tool
    const activeColors = activeTool === 'pen' ? PEN_COLORS : HIGHLIGHT_COLORS;

    // Total active annotations count
    const totalAnnotations = strokeCount + (highlights?.length || 0);
    const canUndo = strokesRef.current.length > 0 || canUndoHighlight || historyStackRef.current.length > 0;

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

    // Draw and progressively erase a temporary laser stroke following original direction and speed
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
            const radius = Math.max(0.8, 3.5 * (1 - fadeProgress * 0.5));

            ctx.save();
            ctx.beginPath();
            ctx.arc(pts[0].x, pts[0].y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(239, 68, 68, ${alpha})`;
            ctx.shadowColor = '#ef4444';
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
            } else {
                visiblePoints = pts.filter(p => p.time > cutoffTime);
            }
        }

        if (visiblePoints.length === 0) return false;

        const buildPath = () => {
            ctx.beginPath();
            ctx.moveTo(visiblePoints[0].x, visiblePoints[0].y);
            if (visiblePoints.length === 2) {
                ctx.lineTo(visiblePoints[1].x, visiblePoints[1].y);
            } else {
                for (let i = 1; i < visiblePoints.length - 1; i++) {
                    const midX = (visiblePoints[i].x + visiblePoints[i + 1].x) / 2;
                    const midY = (visiblePoints[i].y + visiblePoints[i + 1].y) / 2;
                    ctx.quadraticCurveTo(visiblePoints[i].x, visiblePoints[i].y, midX, midY);
                }
                ctx.lineTo(visiblePoints[visiblePoints.length - 1].x, visiblePoints[visiblePoints.length - 1].y);
            }
        };

        // Pass 1: Soft glowing laser halo
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
        ctx.lineWidth = 7;
        buildPath();
        ctx.stroke();
        ctx.restore();

        // Pass 2: High-intensity laser red core
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3.5;
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 8;
        buildPath();
        ctx.stroke();
        ctx.restore();

        return true;
    }, []);

    // Master DPR-aware canvas frame renderer
    const renderCanvasFrame = useCallback((now) => {
        const canvas = canvasRef.current;
        if (!canvas) return false;
        const ctx = canvas.getContext('2d');
        if (!ctx) return false;

        const dpr = window.devicePixelRatio || 1;
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // 1. Draw permanent pen strokes
        drawPermanentStrokes(ctx);

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

    const resizeCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const target = contentRef?.current || containerRef?.current;
        if (!canvas || !target) return;

        const dpr = window.devicePixelRatio || 1;
        const targetWidth = Math.max(target.scrollWidth, target.clientWidth, 320);
        const targetHeight = Math.max(target.scrollHeight, target.clientHeight, 320);

        const physicalWidth = Math.floor(targetWidth * dpr);
        const physicalHeight = Math.floor(targetHeight * dpr);

        if (canvas.width !== physicalWidth || canvas.height !== physicalHeight) {
            canvas.width = physicalWidth;
            canvas.height = physicalHeight;
            canvas.style.width = `${targetWidth}px`;
            canvas.style.height = `${targetHeight}px`;

            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            }
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
        };
    }, [contentRef, containerRef, resizeCanvas]);

    // -------------------------------------------------------------
    // Laser Pointer Feedback & Tracking (Zero React Re-renders)
    // -------------------------------------------------------------
    const triggerClickFeedback = useCallback((clientX, clientY) => {
        if (typeof document === 'undefined') return;
        const ring = document.createElement('div');
        ring.className = 'laser-click-ripple laser-click-ring';
        ring.style.left = `${clientX}px`;
        ring.style.top = `${clientY}px`;
        ring.setAttribute('aria-hidden', 'true');
        document.body.appendChild(ring);

        const removeRing = () => {
            if (ring.parentNode) {
                ring.parentNode.removeChild(ring);
            }
        };
        ring.addEventListener('animationend', removeRing, { once: true });
        setTimeout(removeRing, 550);
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

    /**
     * Precision dual Eraser: erases pen strokes and highlighted text intervals
     */
    const eraseAt = (coords, clientX, clientY) => {
        // 1. Erase pen strokes within 20px radius
        const eraseRadius = 20;
        const removed = [];
        strokesRef.current = strokesRef.current.filter(stroke => {
            const pts = stroke.points;
            if (!pts || pts.length === 0) return false;
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
                removed.push(stroke);
                return false;
            }
            return true;
        });

        if (removed.length > 0) {
            removed.forEach(s => {
                historyStackRef.current.push({ type: 'erase_stroke', stroke: s });
            });
            setStrokeCount(strokesRef.current.length);
            redrawCanvas();
        }

        // 2. Erase text highlight if cursor is over a highlighted text range
        const container = contentRef?.current || containerRef?.current;
        if (container && onApplyHighlight && highlights && highlights.length > 0) {
            const targetHl = findHighlightAtPoint(container, clientX, clientY, highlights);
            if (targetHl) {
                const hlKey = targetHl.id || `${targetHl.start}-${targetHl.end}`;
                if (!erasedHighlightKeysRef.current.has(hlKey)) {
                    erasedHighlightKeysRef.current.add(hlKey);
                    historyStackRef.current.push({ type: 'highlight', prevHighlights: [...highlights] });
                    onApplyHighlight('clear', targetHl);
                }
            }
        }
    };

    const handlePointerDown = (e) => {
        if (activeTool === 'highlighter') return;
        if (e.target?.closest?.('.presentation-toolbar')) return;

        erasedHighlightKeysRef.current.clear();

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
            eraseAt(coords, e.clientX, e.clientY);
            return;
        }

        // Initialize active transient stroke
        const newStroke = {
            id: Date.now() + Math.random(),
            color: penColor,
            width: 3,
            points: [coords]
        };

        activeStrokeRef.current = newStroke;

        // Draw initial point immediately
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
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
        if (activeTool === 'pointer') {
            updateLaserDot(e.clientX, e.clientY);
            if (!isLaserDrawingRef.current || !laserActiveStrokeRef.current) return;

            const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
            const now = performance.now();
            const pts = laserActiveStrokeRef.current.points;

            for (const evt of events) {
                const coords = getCanvasCoordinates(evt);
                const last = pts[pts.length - 1];
                if (!last || Math.hypot(coords.x - last.x, coords.y - last.y) >= 1.5) {
                    pts.push({ x: coords.x, y: coords.y, time: now });
                }
            }
            startAnimationLoop();
            return;
        }

        if (!isDrawingRef.current) return;
        if (activeTool === 'highlighter') return;

        // Extract coalesced events for highest polling fidelity
        const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];

        for (const evt of events) {
            const coords = getCanvasCoordinates(evt);

            if (activeTool === 'eraser') {
                eraseAt(coords, evt.clientX, evt.clientY);
            } else if (activeStrokeRef.current) {
                activeStrokeRef.current.points.push(coords);
            }
        }

        // Incremental rendering for 0ms perceived latency
        if (activeTool === 'pen' && activeStrokeRef.current) {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const pts = activeStrokeRef.current.points;
            const len = pts.length;
            if (len >= 2) {
                ctx.save();
                ctx.beginPath();
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.strokeStyle = penColor;
                ctx.lineWidth = 3;
                ctx.globalAlpha = 0.95;

                if (len === 2) {
                    ctx.moveTo(pts[0].x, pts[0].y);
                    ctx.lineTo(pts[1].x, pts[1].y);
                } else {
                    const midXPrev = (pts[len - 3].x + pts[len - 2].x) / 2;
                    const midYPrev = (pts[len - 3].y + pts[len - 2].y) / 2;
                    const midX = (pts[len - 2].x + pts[len - 1].x) / 2;
                    const midY = (pts[len - 2].y + pts[len - 1].y) / 2;
                    ctx.moveTo(midXPrev, midYPrev);
                    ctx.quadraticCurveTo(pts[len - 2].x, pts[len - 2].y, midX, midY);
                }
                ctx.stroke();
                ctx.restore();
            }
        }
    };

    const handlePointerUp = (e) => {
        erasedHighlightKeysRef.current.clear();
        try {
            e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
            // Ignore
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

        if (!isDrawingRef.current) return;
        isDrawingRef.current = false;

        if (activeStrokeRef.current && activeStrokeRef.current.points.length > 0) {
            strokesRef.current.push(activeStrokeRef.current);
            historyStackRef.current.push({ type: 'stroke', stroke: activeStrokeRef.current });
            setStrokeCount(strokesRef.current.length);
            activeStrokeRef.current = null;
            // Full redraw once to ensure complete quadratic smoothing across all joints
            redrawCanvas();
        }
    };

    const handlePointerCancel = (e) => {
        erasedHighlightKeysRef.current.clear();
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

        const handleHighlighterSelectionEnd = (e) => {
            if (e.target?.closest?.('.presentation-toolbar')) return;

            // Slight delay to allow browser selection range to finalize
            setTimeout(() => {
                const selection = window.getSelection();
                if (!selection || selection.isCollapsed || selection.rangeCount === 0) return;
                const text = selection.toString().trim();
                if (!text) return;

                if (onApplyHighlight) {
                    historyStackRef.current.push({ type: 'highlight' });
                    onApplyHighlight(highlightColor);
                }
            }, 30);
        };

        window.addEventListener('pointerup', handleHighlighterSelectionEnd);
        return () => window.removeEventListener('pointerup', handleHighlighterSelectionEnd);
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
                redrawCanvas();
                return;
            } else if (action.type === 'erase_stroke') {
                strokesRef.current.push(action.stroke);
                setStrokeCount(strokesRef.current.length);
                redrawCanvas();
                return;
            } else if (action.type === 'highlight') {
                if (onUndoHighlight) onUndoHighlight();
                return;
            } else if (action.type === 'clear_all') {
                strokesRef.current = action.strokes || [];
                setStrokeCount(strokesRef.current.length);
                redrawCanvas();
                if (onUndoHighlight) onUndoHighlight();
                return;
            }
        }

        // Fallback if history stack empty
        if (strokesRef.current.length > 0) {
            strokesRef.current.pop();
            setStrokeCount(strokesRef.current.length);
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
                touchAction: (activeTool === 'pen' || activeTool === 'eraser' || activeTool === 'pointer') ? 'none' : 'pan-y'
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
                            className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/95 text-slate-800 border border-slate-200/90 shadow-[0_8px_32px_rgba(0,0,0,0.14)] backdrop-blur-xl animate-fade-in"
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
                                title="Drag toolbar anywhere"
                                onPointerDown={handleDragStart}
                                onPointerMove={handleDragMove}
                                onPointerUp={handleDragEnd}
                                onPointerCancel={handleDragEnd}
                                className="flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 cursor-grab active:cursor-grabbing touch-none flex-shrink-0 transition-colors select-none min-h-[44px] min-w-[36px]"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                    <circle cx="9" cy="6" r="1.5" />
                                    <circle cx="15" cy="6" r="1.5" />
                                    <circle cx="9" cy="12" r="1.5" />
                                    <circle cx="15" cy="12" r="1.5" />
                                    <circle cx="9" cy="18" r="1.5" />
                                    <circle cx="15" cy="18" r="1.5" />
                                </svg>
                            </div>

                            {/* Active Tool Badge with Indicator */}
                            <div 
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-slate-100 transition-colors"
                                title={`Active tool: ${activeTool} (Click to expand)`}
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
                            </div>

                            {/* Expand Button */}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsMinimized(false);
                                }}
                                className="p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0 border border-transparent hover:border-slate-200"
                                title="Expand Toolbar (M)"
                                aria-label="Expand Toolbar"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="18 15 12 9 6 15" />
                                </svg>
                            </button>

                            {/* Exit Button */}
                            <button
                                type="button"
                                data-action="exit"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClose?.();
                                }}
                                className="flex items-center justify-center p-2 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white transition-all shadow-xs cursor-pointer min-h-[44px] min-w-[44px] flex-shrink-0"
                                title="Exit Presentation Mode (Esc)"
                                aria-label="Exit Presentation Mode"
                            >
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <div 
                            className="flex items-center gap-1 sm:gap-1.5 p-1.5 sm:p-2 rounded-2xl bg-white/95 text-slate-800 border border-slate-200/90 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl max-w-[96vw] overflow-x-auto scrollbar-none animate-fade-in"
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
                                title="Drag toolbar anywhere on screen"
                                onPointerDown={handleDragStart}
                                onPointerMove={handleDragMove}
                                onPointerUp={handleDragEnd}
                                onPointerCancel={handleDragEnd}
                                className="flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 cursor-grab active:cursor-grabbing touch-none flex-shrink-0 transition-colors select-none min-h-[44px] min-w-[36px]"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                    <circle cx="9" cy="6" r="1.5" />
                                    <circle cx="15" cy="6" r="1.5" />
                                    <circle cx="9" cy="12" r="1.5" />
                                    <circle cx="15" cy="12" r="1.5" />
                                    <circle cx="9" cy="18" r="1.5" />
                                    <circle cx="15" cy="18" r="1.5" />
                                </svg>
                            </div>

                        {/* Tool Segment: Laser Pointer */}
                        <button
                            type="button"
                            onClick={() => setActiveTool('pointer')}
                            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer min-h-[44px] min-w-[44px] justify-center ${
                                activeTool === 'pointer'
                                    ? 'bg-rose-50 text-rose-700 border border-rose-300 ring-2 ring-rose-400/20 font-bold shadow-2xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                            }`}
                            title="Laser Pointer (P)"
                            aria-label="Laser Pointer"
                            aria-pressed={activeTool === 'pointer'}
                        >
                            <svg className="w-4 h-4 text-rose-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="3" fill="#ef4444" />
                                <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
                            </svg>
                            <span className="hidden sm:inline">Pointer</span>
                            <kbd className="hidden lg:inline text-[9px] px-1 py-0.2 rounded bg-slate-100 border border-slate-200 text-slate-500 font-mono">P</kbd>
                        </button>

                        {/* Tool Segment: Text Highlight */}
                        <button
                            type="button"
                            onClick={() => setActiveTool('highlighter')}
                            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer min-h-[44px] min-w-[44px] justify-center ${
                                activeTool === 'highlighter'
                                    ? 'bg-amber-50 text-amber-900 border border-amber-300 ring-2 ring-amber-400/20 font-bold shadow-2xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                            }`}
                            title="Text Highlighter (H)"
                            aria-label="Text Highlighter"
                            aria-pressed={activeTool === 'highlighter'}
                        >
                            <svg className="w-4 h-4 text-amber-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m9 11-6 6v3h3l6-6" />
                                <path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4" />
                            </svg>
                            <span className="hidden sm:inline">Highlight</span>
                            <kbd className="hidden lg:inline text-[9px] px-1 py-0.2 rounded bg-slate-100 border border-slate-200 text-slate-500 font-mono">H</kbd>
                        </button>

                        {/* Tool Segment: Freehand Pen */}
                        <button
                            type="button"
                            onClick={() => setActiveTool('pen')}
                            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer min-h-[44px] min-w-[44px] justify-center ${
                                activeTool === 'pen'
                                    ? 'bg-sky-50 text-sky-900 border border-sky-300 ring-2 ring-sky-400/20 font-bold shadow-2xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                            }`}
                            title="Freehand Pen (D)"
                            aria-label="Freehand Pen"
                            aria-pressed={activeTool === 'pen'}
                        >
                            <svg className="w-4 h-4 text-sky-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                <path d="m15 5 4 4" />
                            </svg>
                            <span className="hidden sm:inline">Pen</span>
                            <kbd className="hidden lg:inline text-[9px] px-1 py-0.2 rounded bg-slate-100 border border-slate-200 text-slate-500 font-mono">D</kbd>
                        </button>

                        {/* Tool Segment: Eraser */}
                        <button
                            type="button"
                            onClick={() => setActiveTool('eraser')}
                            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer min-h-[44px] min-w-[44px] justify-center ${
                                activeTool === 'eraser'
                                    ? 'bg-slate-100 text-slate-900 border border-slate-300 ring-2 ring-slate-400/20 font-bold shadow-2xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                            }`}
                            title="Precision Eraser (E)"
                            aria-label="Precision Eraser"
                            aria-pressed={activeTool === 'eraser'}
                        >
                            <svg className="w-4 h-4 text-slate-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
                                <path d="M22 21H7" />
                                <path d="m5 11 9 9" />
                            </svg>
                            <span className="hidden sm:inline">Eraser</span>
                            <kbd className="hidden lg:inline text-[9px] px-1 py-0.2 rounded bg-slate-100 border border-slate-200 text-slate-500 font-mono">E</kbd>
                        </button>

                        {/* Contextual Color Selector (Shown when Pen or Highlighter is active) */}
                        {(activeTool === 'highlighter' || activeTool === 'pen') && (
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-xl border border-slate-200/90 flex-shrink-0 animate-fade-in">
                                {activeColors.map(swatch => {
                                    const isSelected = activeTool === 'pen'
                                        ? penColor === swatch.hex
                                        : highlightColor === swatch.id;

                                    return (
                                        <button
                                            key={swatch.id || swatch.hex}
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
                                            title={swatch.label || swatch.name}
                                            aria-label={swatch.label || swatch.name}
                                        />
                                    );
                                })}
                            </div>
                        )}

                        {/* Divider */}
                        <div className="w-[1px] h-6 bg-slate-200 mx-0.5 flex-shrink-0" />

                        {/* Undo Action */}
                        <button
                            type="button"
                            onClick={handleUndo}
                            disabled={!canUndo}
                            className={`p-2 sm:p-2.5 rounded-xl transition-all min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0 border ${
                                canUndo
                                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95 cursor-pointer border-transparent hover:border-slate-200'
                                    : 'text-slate-300 cursor-not-allowed border-transparent'
                            }`}
                            title="Undo (Ctrl+Z)"
                            aria-label="Undo Annotation"
                        >
                            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="1 4 1 10 7 10" />
                                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                            </svg>
                        </button>

                        {/* Clear Action */}
                        <button
                            type="button"
                            onClick={handleClearAll}
                            disabled={totalAnnotations === 0}
                            className={`px-2.5 py-1.5 text-xs font-semibold rounded-xl transition-all flex-shrink-0 min-h-[44px] flex items-center justify-center ${
                                totalAnnotations > 0
                                    ? 'text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200/80 active:scale-95 cursor-pointer'
                                    : 'text-slate-300 border border-slate-100 cursor-not-allowed'
                            }`}
                            title="Clear all annotations (C)"
                            aria-label="Clear annotations"
                        >
                            Clear {totalAnnotations > 0 ? `(${totalAnnotations})` : ''}
                        </button>

                        {/* Fullscreen Action */}
                        <button
                            type="button"
                            onClick={toggleFullscreen}
                            className="p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0 border border-transparent hover:border-slate-200"
                            title="Toggle Fullscreen (F)"
                            aria-label="Toggle Fullscreen"
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
                        </button>

                        {/* Minimize Action */}
                        <button
                            type="button"
                            onClick={() => setIsMinimized(true)}
                            className="p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0 border border-transparent hover:border-slate-200"
                            title="Minimize Toolbar (M)"
                            aria-label="Minimize Toolbar"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>

                        {/* Exit Action */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-xs transition-all shadow-xs cursor-pointer min-h-[44px] ml-0.5 flex-shrink-0"
                            title="Exit Presentation Mode (Esc)"
                            aria-label="Exit Presentation Mode"
                        >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
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
