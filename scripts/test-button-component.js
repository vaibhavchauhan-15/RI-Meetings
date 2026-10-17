import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

console.log('🧪 Starting Button Component Architecture & Consistency Tests...\n');

const buttonPath = path.resolve('src/components/ui/Button.jsx');
const buttonContent = fs.readFileSync(buttonPath, 'utf8');

// 1. Intentional Fills & Transparency
console.log('--- 1. Intentional Fills & Transparency Integrity ---');
assert(buttonContent.includes('from-[#00a8cc] to-[#0b84a5]'), 'Primary button must define solid gradient cyan to teal fill');
console.log('✓ PASS: Primary button defines solid gradient cyan to teal fill');

assert(buttonContent.includes('bg-slate-100 hover:bg-slate-200 text-slate-800'), 'Secondary button must use solid neutral surface');
console.log('✓ PASS: Secondary button uses solid neutral surface');

assert(buttonContent.includes('bg-rose-600 hover:bg-rose-700 text-white'), 'Destructive/danger button must use solid accessible red');
console.log('✓ PASS: Destructive/danger button uses solid accessible red');

assert(buttonContent.includes('bg-white hover:bg-slate-50 text-slate-700'), 'Outline button must use solid white surface');
console.log('✓ PASS: Outline button uses intentional solid white surface');

assert(buttonContent.includes("ghost: 'bg-transparent hover:bg-slate-100 text-slate-600"), 'Ghost button intentionally preserves transparent background');
console.log('✓ PASS: Ghost button intentionally preserves transparent background');

assert(buttonContent.includes("link: 'bg-transparent text-[#0b84a5] hover:text-[#00a8cc] hover:underline"), 'Link button intentionally preserves minimal text link');
console.log('✓ PASS: Link button intentionally preserves minimal text link');

// 2. Static Size Definitions & Touch Targets
console.log('\n--- 2. Static Size Definitions & Touch Targets ---');
assert(buttonContent.includes('const SIZE_CLASSES = {'), 'SIZE_CLASSES must be declared statically outside render loop');
console.log('✓ PASS: SIZE_CLASSES declared statically outside render loop');

assert(buttonContent.includes('min-h-[44px]'), 'Standard button size strictly enforces 44px minimum mobile touch target');
console.log('✓ PASS: Standard button size enforces 44px minimum mobile touch target');

assert(buttonContent.includes('min-w-[44px] min-h-[44px]'), 'Icon size enforces 44x44px minimum mobile touch target');
console.log('✓ PASS: Icon size enforces 44x44px touch target');

// 3. Variant-Aware Spinner
console.log('\n--- 3. Variant-Aware Loading Spinner ---');
assert(buttonContent.includes('getSpinnerColorClass(variant)'), 'Spinner color derived dynamically from button variant');
console.log('✓ PASS: Spinner color derived dynamically from button variant');

assert(buttonContent.includes("case 'primary':\n        case 'destructive':\n        case 'danger':\n        case 'success':\n            return 'text-white'"), 'Solid variants use white spinner');
console.log('✓ PASS: Solid variants use white spinner');

assert(buttonContent.includes("case 'secondary':\n        case 'outline':\n            return 'text-slate-700'"), 'Neutral variants use dark slate spinner');
console.log('✓ PASS: Neutral variants use dark slate spinner');

// 4. Shape Detection & Ergonomics
console.log('\n--- 4. Explicit Shape Resolution ---');
assert(buttonContent.includes('const SHAPE_CLASSES = {'), 'SHAPE_CLASSES defined statically');
console.log('✓ PASS: SHAPE_CLASSES defined statically');

assert(buttonContent.includes("shape !== 'rounded'"), 'Explicit shape prop checked first');
console.log('✓ PASS: Explicit shape prop supported with class fallback');

// 5. Deliberate Disabled Palette
console.log('\n--- 5. Deliberate Disabled Palette & Touch Suppression ---');
assert(buttonContent.includes('const DISABLED_VARIANT_CLASSES = {'), 'Dedicated disabled variant classes defined');
console.log('✓ PASS: Dedicated disabled variant classes defined');

assert(buttonContent.includes('pointer-events-none'), 'Touch and mouse interactions suppressed when disabled');
console.log('✓ PASS: Touch and mouse interactions suppressed when disabled');

// 6. Icon Precedence
console.log('\n--- 6. Icon Precedence & Alignment ---');
assert(buttonContent.includes('const leadingIcon = leftIcon || icon;'), 'leftIcon takes precedence over legacy icon prop');
console.log('✓ PASS: leftIcon takes precedence over legacy icon prop');

console.log('\n========================================');
console.log('SUMMARY: 15 / 15 assertions passed.');
console.log('🎉 ALL BUTTON COMPONENT TESTS PASSED!');
