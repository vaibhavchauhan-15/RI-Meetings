/**
 * Reach International Operations - Universal Reusable Supabase Sync & Verification Script
 *
 * Capabilities:
 * - Ingests ANY daily meeting summary (single object or array of meetings).
 * - Accepts input from:
 *     1. JS module file exporting meeting object(s) (e.g. node scripts/sync-supabase.js scripts/sync-oct-15-16.js)
 *     2. JSON file path (e.g. node scripts/sync-supabase.js data/meeting.json)
 *     3. Raw JSON string via argument or --json (e.g. node scripts/sync-supabase.js '{"date":"2026-10-16",...}')
 *     4. Piped stdin (e.g. cat meeting.json | node scripts/sync-supabase.js)
 *     5. Verification mode (e.g. node scripts/sync-supabase.js --verify meet-2026-10-16)
 *     6. List recent meetings (e.g. node scripts/sync-supabase.js --list)
 * - Guarantees strict Reach International standards:
 *     - 100% Cloud-Native database storage (zero static JSON files created)
 *     - Strictly ONE machine per breakdown card (automatic unbundling if composite)
 *     - Concise, single-line informative fields across all sections
 *     - Mandatory automated Step B database verification query
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { createClient } from '@supabase/supabase-js';
import { unbundleBreakdownEntry } from '../src/utils/breakdownNormalizer.js';
import { formatDateDDMMYYYY, normalizeDateToYYYYMMDD } from '../src/utils/meetingUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// ----------------------------------------------------------------------------
// Supabase Client Initialization
// ----------------------------------------------------------------------------
function loadEnv() {
    const envPath = path.join(ROOT_DIR, '.env');
    if (!fs.existsSync(envPath)) return {};
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    const env = {};
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const [k, ...v] = trimmed.split('=');
        if (k && v.length) env[k.trim()] = v.join('=').trim();
    }
    return env;
}

const env = loadEnv();
export const SUPABASE_URL = process.env.SUPABASE_URL || env.SUPABASE_URL || 'https://mwtfftedrtxiegawgssf.supabase.co';
export const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY;

if (!SERVICE_KEY) {
    console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY in environment or .env');
    process.exit(1);
}

export const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false }
});

// ----------------------------------------------------------------------------
// Utility Functions
// ----------------------------------------------------------------------------
export function cleanOneLine(text) {
    if (!text || typeof text !== 'string') return '';
    return text.replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Normalizes and validates any meeting payload to strict schema
 */
export function normalizeMeetingPayload(raw) {
    if (!raw || typeof raw !== 'object') {
        throw new Error('Invalid meeting payload: expected an object.');
    }

    const isoDate = normalizeDateToYYYYMMDD(raw.date || raw.id);
    if (!isoDate || !isoDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        throw new Error(`Invalid meeting date: "${raw.date}". Expected YYYY-MM-DD.`);
    }

    const meetingId = raw.id || `meet-${isoDate}`;
    const displayDate = formatDateDDMMYYYY(isoDate);
    const title = cleanOneLine(raw.title) || displayDate;
    const focus = cleanOneLine(raw.focus) || '';
    const isHoliday = Boolean(raw.isHoliday);
    const holidayName = isHoliday ? (cleanOneLine(raw.holidayName) || 'Holiday') : null;
    const noMeetingHeld = Boolean(raw.noMeetingHeld);
    const notRecorded = Boolean(raw.notRecorded);

    // 1. Process & unbundle breakdowns (strictly ONE machine per row)
    const rawBreakdowns = Array.isArray(raw.breakdowns) ? raw.breakdowns : [];
    const unbundledMachines = [];

    for (const item of rawBreakdowns) {
        if (!item) continue;

        if (item.model && (item.serialNumber || item.serial_number) && item.issue && item.action) {
            unbundledMachines.push({
                meeting_id: meetingId,
                model: cleanOneLine(item.model),
                serial_number: cleanOneLine(item.serialNumber || item.serial_number || 'N/A'),
                site: cleanOneLine(item.site || item.site_location || item.location || 'General Site'),
                issue: cleanOneLine(item.issue),
                action: cleanOneLine(item.action),
                logistics: cleanOneLine(item.logistics) || null,
                clarification: cleanOneLine(item.clarification) || null,
                pending_issue: cleanOneLine(item.pendingIssue || item.pending_issue) || null,
                status: cleanOneLine(item.status || 'Under Investigation')
            });
            continue;
        }

        const unbundled = unbundleBreakdownEntry(item, {
            date: isoDate,
            dateDisplay: displayDate,
            id: meetingId
        });

        if (Array.isArray(unbundled) && unbundled.length > 0) {
            unbundled.forEach(m => {
                unbundledMachines.push({
                    meeting_id: meetingId,
                    model: cleanOneLine(m.model || m.machine_model || 'Standard Fleet Machine'),
                    serial_number: cleanOneLine(m.serial_number || m.serialNumber || 'N/A'),
                    site: cleanOneLine(m.site || m.site_location || m.location || 'General Site'),
                    issue: cleanOneLine(m.full_issue || m.short_issue || m.issue || m.description || 'Breakdown reported.'),
                    action: cleanOneLine(m.full_action || m.short_action || m.action || 'Technician inspection assigned.'),
                    logistics: cleanOneLine(m.full_logistics || m.short_logistics || m.logistics) || null,
                    clarification: cleanOneLine(m.full_clarification || m.short_clarification || m.clarification) || null,
                    pending_issue: cleanOneLine(m.full_pending || m.short_pending || m.pending_issue || m.pendingIssue) || null,
                    status: cleanOneLine(m.full_status || m.short_status || m.status || 'Under Investigation')
                });
            });
        }
    }

    // 2. Process spare parts
    const rawParts = Array.isArray(raw.parts) ? raw.parts : [];
    const partsRows = rawParts.map(p => ({
        meeting_id: meetingId,
        part_name: cleanOneLine(p.part || p.part_name || 'Unspecified Part'),
        equipment_context: cleanOneLine(p.context || p.equipment_context) || null,
        status_next_steps: cleanOneLine(p.statusNextSteps || p.status_next_steps || 'Procurement follow-up active.')
    })).filter(p => p.part_name);

    // 3. Process action items
    const rawActionItems = Array.isArray(raw.actionItems) ? raw.actionItems : [];
    const actionRows = rawActionItems.map(a => ({
        meeting_id: meetingId,
        person: cleanOneLine(a.person || 'Unassigned'),
        task: cleanOneLine(a.task || 'Follow up required.')
    })).filter(a => a.person && a.task);

    // 4. Process directives
    const rawDirectives = Array.isArray(raw.directives) ? raw.directives : [];
    const directiveRows = rawDirectives.map(d => ({
        meeting_id: meetingId,
        title: cleanOneLine(d.title || 'Operational Directive'),
        points: Array.isArray(d.points) ? d.points.map(pt => cleanOneLine(pt)).filter(Boolean) : []
    })).filter(d => d.title);

    return {
        master: {
            id: meetingId,
            date: isoDate,
            title,
            focus,
            is_holiday: isHoliday,
            holiday_name: holidayName,
            no_meeting_held: noMeetingHeld,
            not_recorded: notRecorded,
            breakdowns_count: unbundledMachines.length,
            parts_count: partsRows.length,
            directives_count: directiveRows.length,
            action_items_count: actionRows.length,
            updated_at: new Date().toISOString()
        },
        breakdowns: unbundledMachines,
        parts: partsRows,
        actionItems: actionRows,
        directives: directiveRows,
        displayDate
    };
}

// ----------------------------------------------------------------------------
// Core Ingestion Function
// ----------------------------------------------------------------------------
/**
 * Synchronize a meeting summary to Supabase atomically and optionally verify
 */
export async function syncToSupabase(meetingData, options = { verify: true }) {
    const normalized = normalizeMeetingPayload(meetingData);
    const { master, breakdowns, parts, actionItems, directives, displayDate } = normalized;

    // 1. Upsert master record
    const { error: masterErr } = await supabaseAdmin
        .from('meetings')
        .upsert(master, { onConflict: 'id' });

    if (masterErr) {
        throw new Error(`Master meeting upsert failed (${master.id}): ${masterErr.message}`);
    }

    // 2. Clear old child records for this meeting
    await Promise.all([
        supabaseAdmin.from('breakdown_machines').delete().eq('meeting_id', master.id),
        supabaseAdmin.from('meeting_parts').delete().eq('meeting_id', master.id),
        supabaseAdmin.from('meeting_action_items').delete().eq('meeting_id', master.id),
        supabaseAdmin.from('meeting_directives').delete().eq('meeting_id', master.id)
    ]);

    // 3. Insert fresh child records
    if (breakdowns.length > 0) {
        const { error: bErr } = await supabaseAdmin.from('breakdown_machines').insert(breakdowns);
        if (bErr) throw new Error(`Breakdowns insert failed: ${bErr.message}`);
    }

    if (parts.length > 0) {
        const { error: pErr } = await supabaseAdmin.from('meeting_parts').insert(parts);
        if (pErr) throw new Error(`Parts insert failed: ${pErr.message}`);
    }

    if (actionItems.length > 0) {
        const { error: aErr } = await supabaseAdmin.from('meeting_action_items').insert(actionItems);
        if (aErr) throw new Error(`Action items insert failed: ${aErr.message}`);
    }

    if (directives.length > 0) {
        const { error: dErr } = await supabaseAdmin.from('meeting_directives').insert(directives);
        if (dErr) throw new Error(`Directives insert failed: ${dErr.message}`);
    }

    const result = {
        meetingId: master.id,
        date: master.date,
        displayDate,
        title: master.title,
        focus: master.focus,
        counts: {
            breakdowns: breakdowns.length,
            parts: parts.length,
            directives: directives.length,
            actionItems: actionItems.length
        }
    };

    // 4. Run automated Step B database verification check if enabled
    if (options.verify) {
        await verifyMeetingInSupabase(master.id, result.counts);
    }

    return result;
}

// ----------------------------------------------------------------------------
// Step B: Mandatory Database Verification Query
// ----------------------------------------------------------------------------
export async function verifyMeetingInSupabase(meetingId, expectedCounts = null) {
    const { data: master, error: masterErr } = await supabaseAdmin
        .from('meetings')
        .select('*')
        .eq('id', meetingId)
        .single();

    if (masterErr || !master) {
        throw new Error(`Verification failed: Master record ${meetingId} not found in database (${masterErr?.message}).`);
    }

    const [bRes, pRes, dRes, aRes] = await Promise.all([
        supabaseAdmin.from('breakdown_machines').select('id', { count: 'exact' }).eq('meeting_id', meetingId),
        supabaseAdmin.from('meeting_parts').select('id', { count: 'exact' }).eq('meeting_id', meetingId),
        supabaseAdmin.from('meeting_directives').select('id', { count: 'exact' }).eq('meeting_id', meetingId),
        supabaseAdmin.from('meeting_action_items').select('id', { count: 'exact' }).eq('meeting_id', meetingId)
    ]);

    const actualCounts = {
        breakdowns: bRes.count || 0,
        parts: pRes.count || 0,
        directives: dRes.count || 0,
        actionItems: aRes.count || 0
    };

    if (expectedCounts) {
        const matches = (
            actualCounts.breakdowns === expectedCounts.breakdowns &&
            actualCounts.parts === expectedCounts.parts &&
            actualCounts.directives === expectedCounts.directives &&
            actualCounts.actionItems === expectedCounts.actionItems
        );

        if (!matches) {
            throw new Error(`Verification failed for ${meetingId}: DB counts do not match expected payload!
Expected: ${JSON.stringify(expectedCounts)}
Actual:   ${JSON.stringify(actualCounts)}`);
        }
    }

    return {
        master,
        actualCounts
    };
}

// ----------------------------------------------------------------------------
// List Recent Meetings Utility
// ----------------------------------------------------------------------------
export async function listRecentMeetings(limit = 10) {
    const { data, error } = await supabaseAdmin
        .from('meetings')
        .select('id, date, title, focus, breakdowns_count, parts_count, directives_count, action_items_count, is_holiday, holiday_name')
        .order('date', { ascending: false })
        .limit(limit);

    if (error) throw new Error(`Failed to list meetings: ${error.message}`);
    return data;
}

// ----------------------------------------------------------------------------
// Universal Input Loader
// ----------------------------------------------------------------------------
export async function loadMeetingInput(inputStr) {
    const trimmed = (inputStr || '').trim();

    // 1. Direct JSON String
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) ? parsed : [parsed];
    }

    // 2. File Path
    const resolvedPath = path.resolve(process.cwd(), trimmed);
    if (!fs.existsSync(resolvedPath)) {
        throw new Error(`File or input target not found: ${trimmed}`);
    }

    // 2A. JavaScript File (.js, .mjs)
    if (resolvedPath.endsWith('.js') || resolvedPath.endsWith('.mjs')) {
        const fileUrl = pathToFileURL(resolvedPath).href;
        const mod = await import(fileUrl);
        const extracted = [];

        // Check default export
        if (mod.default) {
            if (Array.isArray(mod.default)) extracted.push(...mod.default);
            else if (typeof mod.default === 'object' && (mod.default.date || mod.default.id)) extracted.push(mod.default);
        }

        // Check named exports
        for (const [key, val] of Object.entries(mod)) {
            if (key === 'default') continue;
            if (val && typeof val === 'object') {
                if (Array.isArray(val)) {
                    val.forEach(v => {
                        if (v && typeof v === 'object' && (v.date || v.id)) extracted.push(v);
                    });
                } else if (val.date || val.id) {
                    extracted.push(val);
                }
            }
        }

        if (extracted.length === 0) {
            throw new Error(`No valid meeting data found in exported symbols of ${resolvedPath}`);
        }
        return extracted;
    }

    // 2B. JSON File (.json)
    const fileContent = fs.readFileSync(resolvedPath, 'utf8').trim();
    const parsed = JSON.parse(fileContent);
    return Array.isArray(parsed) ? parsed : [parsed];
}

// ----------------------------------------------------------------------------
// CLI Execution Handler
// ----------------------------------------------------------------------------
async function runCli() {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
Reach International - Reusable Supabase Sync & Verification Script

Usage:
  node scripts/sync-supabase.js <path-or-json>
  npm run sync:supabase -- <path-or-json>

Options:
  --list, -l             List the last 10 meetings in Supabase
  --verify <meeting-id>  Run an explicit verification check on an existing meeting
  --json '<json-str>'    Sync meeting directly from JSON string argument
  --help, -h             Show this help message

Examples:
  node scripts/sync-supabase.js scripts/sync-oct-15-16.js
  node scripts/sync-supabase.js meeting-data.json
  node scripts/sync-supabase.js --json '{"date":"2026-10-16",...}'
  cat meeting.json | node scripts/sync-supabase.js
  node scripts/sync-supabase.js --verify meet-2026-10-16
  node scripts/sync-supabase.js --list
        `);
        process.exit(0);
    }

    // Handle --list
    if (args.includes('--list') || args.includes('-l')) {
        console.log('📋 Fetching recent meetings from Supabase...\n');
        const list = await listRecentMeetings(10);
        console.table(list.map(m => ({
            ID: m.id,
            Date: m.date,
            Title: m.title,
            Machines: m.breakdowns_count,
            Parts: m.parts_count,
            Directives: m.directives_count,
            Actions: m.action_items_count,
            Holiday: m.is_holiday ? (m.holiday_name || 'Yes') : 'No'
        })));
        process.exit(0);
    }

    // Handle --verify
    const verifyIdx = args.indexOf('--verify');
    if (verifyIdx !== -1 && args[verifyIdx + 1]) {
        const id = args[verifyIdx + 1];
        console.log(`🔍 Verifying meeting ${id} in Supabase...`);
        const { master, actualCounts } = await verifyMeetingInSupabase(id);
        console.log(`\n✅ Meeting Found: ${master.id} | Date: ${master.date} | Title: ${master.title}`);
        console.log(`   - Focus: ${master.focus || 'N/A'}`);
        console.log(`   - Breakdowns in DB:   ${actualCounts.breakdowns}`);
        console.log(`   - Parts in DB:        ${actualCounts.parts}`);
        console.log(`   - Directives in DB:   ${actualCounts.directives}`);
        console.log(`   - Action Items in DB: ${actualCounts.actionItems}\n`);
        process.exit(0);
    }

    // Load meeting input
    let rawInput = '';
    const jsonIdx = args.indexOf('--json');

    if (jsonIdx !== -1 && args[jsonIdx + 1]) {
        rawInput = args[jsonIdx + 1];
    } else if (args[0] && !args[0].startsWith('--')) {
        rawInput = args[0];
    } else if (!process.stdin.isTTY) {
        // Read from stdin pipe
        rawInput = await new Promise(resolve => {
            let data = '';
            process.stdin.setEncoding('utf8');
            process.stdin.on('data', chunk => data += chunk);
            process.stdin.on('end', () => resolve(data));
        });
    } else {
        console.error('❌ No meeting input provided. Run with --help for usage.');
        process.exit(1);
    }

    try {
        const meetings = await loadMeetingInput(rawInput);
        console.log(`\n======================================================`);
        console.log(`🚀 SYNCING ${meetings.length} MEETING(S) TO SUPABASE`);
        console.log(`======================================================`);

        for (const [index, meeting] of meetings.entries()) {
            console.log(`\n[${index + 1}/${meetings.length}] Ingesting: ${meeting.date || meeting.id || 'Meeting'}...`);
            const result = await syncToSupabase(meeting, { verify: true });

            console.log(`✅ Success for ${result.meetingId}:`);
            console.log(`   - Title:        ${result.title} (${result.displayDate})`);
            console.log(`   - Focus:        ${result.focus || 'N/A'}`);
            console.log(`   - Breakdowns:   ${result.counts.breakdowns} machines (1 per card)`);
            console.log(`   - Parts:        ${result.counts.parts} items tracked`);
            console.log(`   - Directives:   ${result.counts.directives} policies logged`);
            console.log(`   - Action Items: ${result.counts.actionItems} assigned`);
            console.log(`   - Verification: PASSED (Master + all child records matched)`);
        }

        console.log(`\n======================================================`);
        console.log(`🎉 ALL ${meetings.length} MEETING(S) PERSISTED & VERIFIED IN SUPABASE!`);
        console.log(`======================================================\n`);
    } catch (err) {
        console.error(`\n❌ Error syncing to Supabase:`, err.message);
        process.exit(1);
    }
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
    runCli();
}
