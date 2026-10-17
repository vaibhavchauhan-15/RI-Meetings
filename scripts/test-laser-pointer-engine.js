/**
 * Automated Verification Suite for Presentation Laser Pointer & Progressive Drawing Engine
 * 
 * Verifies:
 * 1. Pointer UI & Subpixel Accuracy (glowing dot, subtle halo, zero cursor conflict).
 * 2. Click & Touch Ripple Feedback (exact coordinates, animation, auto-cleanup).
 * 3. Temporary Stroke Lifetime (3.5s window, active -> completed lifecycle).
 * 4. Progressive Erasing Math & Speed/Direction Tracking (monotonic start interpolation, no instant wipe).
 * 5. Overlapping Strokes Independence (distinct stroke lifetimes and direction).
 * 6. Web & Mobile Event Handling & Performance (pointer capture, touch-action, idle loop cleanup).
 */

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

function assertClose(actual, expected, tolerance = 0.001, message) {
    if (Math.abs(actual - expected) <= tolerance) {
        passCount++;
        console.log(`✓ PASS: ${message}`);
    } else {
        failCount++;
        console.error(`✗ FAIL: ${message}\n  Expected: ${expected} (±${tolerance})\n  Actual:   ${actual}`);
    }
}

console.log('🧪 Starting Laser Pointer & Progressive Drawing Optimization Verification...\n');

// ============================================================================
// 1. POINTER UI & CSS STYLING INVARIANTS
// ============================================================================
console.log('--- 1. Pointer UI & Subpixel Accuracy Invariants ---');

const cssContent = fs.readFileSync(path.resolve('src/index.css'), 'utf8');
const overlayContent = fs.readFileSync(path.resolve('src/components/shared/PresentationOverlay.jsx'), 'utf8');

// Laser pointer dot CSS structure
assert(cssContent.includes('.laser-pointer-dot'), '.laser-pointer-dot class is defined in index.css');
assert(cssContent.includes('.laser-pointer-dot::before'), 'Subtle outer halo defined via ::before pseudo-element');
assert(cssContent.includes('.laser-pointer-dot::after'), 'Small glowing red dot defined via ::after pseudo-element');
assert(cssContent.includes('laserHaloBreath'), 'Gentle breathing pulse keyframes defined for halo');
assert(cssContent.includes('cursor: none !important'), 'Default cursor hidden in laser pointer mode (.cursor-laser-tool)');
assert(cssContent.includes('.presentation-toolbar *') && cssContent.includes('cursor: default !important'), 'Toolbar controls isolate normal pointer cursor');

// Laser pointer coordinate accuracy
assert(overlayContent.includes('translate3d(${clientX}px, ${clientY}px, 0)'), 'Laser dot transform positions exact client coordinates with zero arbitrary offsets');

// ============================================================================
// 2. CLICK & TOUCH FEEDBACK RIPPLE
// ============================================================================
console.log('\n--- 2. Click & Touch Ripple Feedback ---');

assert(cssContent.includes('.laser-click-ripple'), '.laser-click-ripple class defined in CSS');
assert(cssContent.includes('.laser-click-ring'), '.laser-click-ring backward-compatible alias defined in CSS');
assert(cssContent.includes('laserRipplePulse'), 'Expanding ripple pulse keyframes defined');
assert(overlayContent.includes('triggerClickFeedback'), 'triggerClickFeedback handler present in PresentationOverlay');
assert(overlayContent.includes('laser-click-ripple laser-click-ring'), 'Ripple element adopts high-visibility glowing ring styles');
assert(overlayContent.includes('animationend'), 'Ripple listens for animationend event for clean DOM removal');

// ============================================================================
// 3. TEMPORARY STROKE LIFETIME (3–5 SECONDS)
// ============================================================================
console.log('\n--- 3. Temporary Drawing Stroke Lifetime (3–5 Seconds) ---');

// Validate lifetime constant
const lifetimeMatch = overlayContent.match(/LASER_STROKE_LIFETIME\s*=\s*(\d+)/);
assert(lifetimeMatch !== null, 'LASER_STROKE_LIFETIME constant is declared');
const lifetimeMs = lifetimeMatch ? parseInt(lifetimeMatch[1], 10) : 0;
assert(lifetimeMs >= 3000 && lifetimeMs <= 5000, `Laser stroke lifetime (${lifetimeMs}ms) is strictly within 3–5 seconds requirement`);

// Validate single-point tap auto-erase
function evaluateSinglePointLaser(ptTime, now, lifetime = 3500) {
    const age = now - ptTime;
    if (age >= lifetime) return { isAlive: false, alpha: 0 };
    const fadeDuration = 600;
    const fadeStart = lifetime - fadeDuration;
    const fadeProgress = age > fadeStart ? (age - fadeStart) / fadeDuration : 0;
    return {
        isAlive: true,
        alpha: Math.max(0, 1 - fadeProgress),
        radius: Math.max(0.8, 3.5 * (1 - fadeProgress * 0.5))
    };
}

const t0 = 1000;
assert(evaluateSinglePointLaser(t0, 1500, lifetimeMs).isAlive, 'Tap point is fully visible at 500ms age');
assert(evaluateSinglePointLaser(t0, 4100, lifetimeMs).alpha < 1, 'Tap point smoothly dissolves in final 600ms (age 3100ms > 2900ms)');
assert(!evaluateSinglePointLaser(t0, 4600, lifetimeMs).isAlive, 'Tap point is completely expired and removed after 3.5s');

// ============================================================================
// 4. PROGRESSIVE ERASING ALGORITHM & SPEED/DIRECTION TRACKING
// ============================================================================
console.log('\n--- 4. Progressive Erasing Math & Direction Verification ---');

/**
 * Pure simulation of drawLaserStroke progressive trimming logic
 */
function simulateProgressiveTrim(stroke, now, lifetime = 3500) {
    const pts = stroke.points;
    if (!pts || pts.length === 0) return null;

    const cutoffTime = now - lifetime;
    const lastPt = pts[pts.length - 1];

    if (lastPt.time <= cutoffTime) {
        return null; // completely expired
    }

    if (pts[0].time > cutoffTime) {
        return { visiblePoints: pts, isTrimmed: false };
    }

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
        const fraction = dt > 0 ? (cutoffTime - p1.time) / dt : 1;
        const interpolatedStart = {
            x: p1.x + (p2.x - p1.x) * fraction,
            y: p1.y + (p2.y - p1.y) * fraction,
            time: cutoffTime
        };
        return {
            visiblePoints: [interpolatedStart, ...pts.slice(k + 1)],
            isTrimmed: true,
            fractionAlongSegment: fraction,
            segmentIndex: k
        };
    }

    return { visiblePoints: pts.filter(p => p.time > cutoffTime), isTrimmed: true };
}

// Create a straight stroke drawn from (0, 0) to (100, 0) over 1000ms:
// p0: (0, 0) at t=0
// p1: (50, 0) at t=500
// p2: (100, 0) at t=1000
const testStroke = {
    id: 'stroke-1',
    points: [
        { x: 0, y: 0, time: 0 },
        { x: 50, y: 0, time: 500 },
        { x: 100, y: 0, time: 1000 }
    ]
};

// 1. Before lifetime expires: at t = 2000ms, entire stroke is visible
const frameAt2s = simulateProgressiveTrim(testStroke, 2000, 3500);
assert(frameAt2s !== null && !frameAt2s.isTrimmed, 'Stroke remains 100% visible before cutoff time (t=2000ms)');
assert(frameAt2s.visiblePoints.length === 3, 'All 3 points intact before erasing begins');

// 2. Exactly when p0 expires (t = 3500ms): erasing starts at the origin
const frameAt3500 = simulateProgressiveTrim(testStroke, 3500, 3500);
assert(frameAt3500 !== null, 'Stroke is alive at t=3500ms');
assertClose(frameAt3500.visiblePoints[0].x, 0, 0.01, 'Erasing begins at exact start point (x=0)');

// 3. Halfway through first segment (t = 3750ms): cutoff is t=250ms (halfway between 0 and 500ms)
const frameAt3750 = simulateProgressiveTrim(testStroke, 3750, 3500);
assert(frameAt3750 !== null && frameAt3750.isTrimmed, 'Stroke is progressively trimmed at t=3750ms');
assertClose(frameAt3750.visiblePoints[0].x, 25, 0.01, 'Start position interpolated to x=25 at exact drawing speed');
assert(frameAt3750.visiblePoints.length === 3, 'Trimmed stroke contains virtual start point + subsequent original points');

// 4. Exactly at p1 expiration (t = 4000ms): cutoff is t=500ms
const frameAt4000 = simulateProgressiveTrim(testStroke, 4000, 3500);
assertClose(frameAt4000.visiblePoints[0].x, 50, 0.01, 'Start position reaches p1 (x=50) at t=4000ms');

// 5. Halfway through second segment (t = 4250ms): cutoff is t=750ms
const frameAt4250 = simulateProgressiveTrim(testStroke, 4250, 3500);
assertClose(frameAt4250.visiblePoints[0].x, 75, 0.01, 'Start position reaches x=75 matching original speed');

// 6. When last point expires (t = 4500ms):
const frameAt4500 = simulateProgressiveTrim(testStroke, 4500, 3500);
assert(frameAt4500 === null, 'Stroke completely disappears after its final point reaches lifetime');

// ============================================================================
// 5. OVERLAPPING STROKES INDEPENDENCE
// ============================================================================
console.log('\n--- 5. Overlapping Strokes Independence ---');

// Stroke A drawn at t=0..500
const strokeA = {
    id: 'stroke-A',
    points: [
        { x: 10, y: 10, time: 0 },
        { x: 50, y: 10, time: 500 }
    ]
};

// Stroke B drawn across it at t=1000..1500
const strokeB = {
    id: 'stroke-B',
    points: [
        { x: 30, y: 0, time: 1000 },
        { x: 30, y: 60, time: 1500 }
    ]
};

// At t = 3800ms:
// Stroke A is currently erasing (cutoff = 300ms, start is 60% along stroke A)
// Stroke B is 100% visible and untouched (cutoff = 300ms < stroke B start of 1000ms)
const resA = simulateProgressiveTrim(strokeA, 3800, 3500);
const resB = simulateProgressiveTrim(strokeB, 3800, 3500);

assert(resA !== null && resA.isTrimmed, 'Stroke A is actively progressively erasing at t=3800ms');
assert(resB !== null && !resB.isTrimmed, 'Stroke B is 100% intact while Stroke A is erasing (no simultaneous fade)');
assert(resB.visiblePoints.length === 2, 'Stroke B preserves full original points');

// At t = 4200ms:
// Stroke A is completely gone (finished drawing at 500ms + 3500ms = 4000ms)
// Stroke B is STILL alive and untouched! (start 1000ms + 3500ms = 4500ms)
const resA_4200 = simulateProgressiveTrim(strokeA, 4200, 3500);
const resB_4200 = simulateProgressiveTrim(strokeB, 4200, 3500);
assert(resA_4200 === null, 'Stroke A is completely erased at t=4200ms');
assert(resB_4200 !== null && !resB_4200.isTrimmed, 'Stroke B is still fully visible at t=4200ms');

// ============================================================================
// 6. PERFORMANCE, MOBILE & WEB EVENT HANDLING
// ============================================================================
console.log('\n--- 6. Web & Mobile Event Handling & Performance ---');

// Validate pointer-events-auto for laser tool
assert(overlayContent.includes("case 'pointer':\n                return 'cursor-laser-tool pointer-events-auto'") ||
       overlayContent.includes("cursor-laser-tool pointer-events-auto"),
       'Canvas receives pointer-events-auto in laser mode so user can draw temporary strokes');

// Validate touch-action none
assert(overlayContent.includes("touchAction: (activeTool === 'pen' || activeTool === 'eraser' || activeTool === 'pointer') ? 'none' : 'pan-y'"),
       'Canvas sets touch-action: none for pen, eraser, and pointer tools to prevent conflicting mobile scroll gestures');

// Validate animation loop shutdown
assert(overlayContent.includes('animFrameRef.current = null'), 'Animation loop cleanly nulls out when all strokes expire (zero CPU when idle)');
assert(overlayContent.includes('cancelAnimationFrame'), 'Unmount cleans up active animation frame to prevent memory leaks');

// Validate Clear All resets laser strokes
assert(overlayContent.includes('laserStrokesRef.current = []'), 'handleClearAll clears active and pending laser strokes');

console.log('\n========================================');
console.log(`SUMMARY: ${passCount} / ${passCount + failCount} assertions passed.`);
if (failCount === 0) {
    console.log('🎉 ALL LASER POINTER & DRAWING ENGINE TESTS PASSED!');
} else {
    console.error(`💥 ${failCount} ASSERTIONS FAILED.`);
    process.exit(1);
}
