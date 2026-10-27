/**
 * Reach International Operations - Daily Meeting Sync (27 Oct 2026)
 *
 * Implements strict Reach International standards:
 * - 100% Cloud-Native ingestion (zero static JSON files in src/data/)
 * - Strictly ONE machine per breakdown card
 * - Strictly NEW breakdowns only (already broken down machines from previous days excluded)
 * - Concise, single-line informative fields across all sections
 * - Accurate English translation and distillation of raw Hindi meeting transcripts
 * - Direct Supabase ingestion with automated verification check (Step A, B, C)
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { syncDailyMeeting, supabaseAdmin } from './sync-daily-meeting.js';

const __filename = fileURLToPath(import.meta.url);

export const meeting27 = {
    id: "meet-2026-10-27",
    title: "27-10-2026",
    date: "2026-10-27",
    dateFormatted: "27-10-2026",
    focus: "Emergency motor cable defect on 120B, burned-out starters on rebuilt 800AJ, Sanand Z-45 smoking motor overhaul, M600 charging cable and cylinder leak escalation, and Surya battery warranty protocol.",
    isHoliday: false,
    holidayName: "",
    noMeetingHeld: false,
    notRecorded: false,
    breakdowns: [
        {
            site: "Field Operations Site",
            model: "Genie Z-120 Telescopic Boom Lift",
            serialNumber: "Unit-120B",
            issue: "Auxiliary emergency lowering motor inoperable due to damaged power cable alongside engine starting failure.",
            action: "Technician Sunny requested emergency motor power cable procurement; Jitendra instructed to submit vendor quotation immediately.",
            logistics: "Vendor quotation for heavy-duty emergency motor power cable being finalized for local procurement.",
            clarification: "Main machine is otherwise ready, but grounded without emergency boom descent capability and starting circuit.",
            pendingIssue: "Submit supplier quotation, clear emergency purchase payment, and fit cable to restore emergency descent.",
            status: "Auxiliary Motor Cable & Starting Failure — Emergency motor down and starting failure; quotation requested for cable."
        },
        {
            site: "Central Workshop & Fleet Yard",
            model: "JLG 800AJ Articulating Boom Lift",
            serialNumber: "800AGV-Fleet",
            issue: "Machine unable to crank or start following engine overhaul due to all available starter motors burned out beyond repair.",
            action: "Jitendra Budhauliya and Pritam Singh arranging purchase and express dispatch of 2-3 new starter motors from Delhi.",
            logistics: "Two to three new starter motors ordered from Delhi supplier to stage at central depot and maintain spare buffer.",
            clarification: "Engine rebuild is finished, but starter motor coils burned out completely, preventing commissioning and site handover.",
            pendingIssue: "Expedite delivery of new starter motors from Delhi, mount on engine, and execute full load testing.",
            status: "Grounded by Burned Starters — Overhauled engine cannot crank due to defective starters; 2-3 units ordered from Delhi."
        },
        {
            site: "Sanand Project Site",
            model: "Genie Z-45 Articulating Boom Lift",
            serialNumber: "Z45-4902",
            issue: "Electric drive motor and hydraulic pump severely overheating within 10-15 minutes of operation and emitting smoke.",
            action: "Satendra Kumar coordinating with Chunnilal and Pradeep Tomar to transfer 48V non-sensor motor from Mundra and source pump.",
            logistics: "48V non-sensor motor identified in Mundra depot stock to be dispatched immediately to Sanand site.",
            clarification: "Internal hydraulic pump failure caused severe mechanical drag, overloading 48V motor and triggering thermal runaway.",
            pendingIssue: "Dispatch 48V motor from Mundra, source matching hydraulic pump, and complete replacement at Sanand.",
            status: "Motor Overheating & Smoke Emission — Motor and pump overheating in 10-15 mins with smoke; Mundra 48V motor requested."
        }
    ],
    parts: [
        {
            part: "90-Meter 3-Core Armoured Charging Cable",
            context: "Sanand Project Site (CG Power - JLG M600JP)",
            statusNextSteps: "Vendor quotation of ₹10,800 submitted; urgent payment approval required to charge machine relocated near pond Gate 2."
        },
        {
            part: "48V Non-Sensor Electric Drive Motor",
            context: "Sanand Project Site (Genie Z-45-4902)",
            statusNextSteps: "Identified in Mundra yard inventory; Chunnilal instructed to pack and dispatch to Sanand to replace smoking motor."
        },
        {
            part: "Main Hydraulic Drive & Function Pump",
            context: "Sanand Project Site (Genie Z-45-4902)",
            statusNextSteps: "Pump internal seizure causing motor overheating and smoke; replacement pump being arranged via central stores."
        },
        {
            part: "Heavy-Duty Engine Starter Motors (2-3 Units)",
            context: "Central Workshop & Fleet Yard (JLG 800AJ)",
            statusNextSteps: "Pritam Singh ordering 2-3 new starter units from Delhi vendor to crank overhauled engine and stock emergency buffer."
        },
        {
            part: "Auxiliary Emergency Motor Power Wiring Cable",
            context: "Field Operations Site (Genie 120B)",
            statusNextSteps: "Technician Sunny instructed to provide formal vendor quotation today for immediate management purchase approval."
        },
        {
            part: "Main Electronic Control Logic Board",
            context: "Mundra Project Depot (JLG 4047)",
            statusNextSteps: "Field team instructed to enter machine serial number into Google Sheets to authorize new control card procurement."
        },
        {
            part: "Master Hydraulic Cylinder Seal Overhaul Kit",
            context: "Sanand Project Site (CG Power - JLG M600JP)",
            statusNextSteps: "Pradeep Tomar and Dheeraj Dubey ordered to dismantle cylinder assembly and replace seals rather than pipe fixes."
        },
        {
            part: "High-Amperage OEM / AGM Traction Battery Chargers",
            context: "Central Store & National Fleet",
            statusNextSteps: "Evaluating ₹25,000-₹26,000 OEM JCB/AGM units to replace sub-standard ₹4,000 local chargers failing every 3 days."
        },
        {
            part: "12V Surya Deep-Cycle Traction Battery Bank",
            context: "Assam Project Site (Genie S-135) & Fleet",
            statusNextSteps: "Warranty claims being lodged with Surya manufacturer for battery banks dropping specific gravity within 11 months."
        },
        {
            part: "Drive Wheel Tyres & Electrical Fuses",
            context: "Sanand Project Site (JLG 3240)",
            statusNextSteps: "Pravesh Yadav confirmed tyres and fuses dispatched per Google Form indent dated 23rd October."
        }
    ],
    directives: [
        {
            title: "Standardizing OEM Chargers & Battery Warranty Lifecycle Protocols",
            points: [
                "Ban the purchase of cheap ₹4,000 unbranded chargers that burn out in 3 days and generate ₹10,000-₹11,000 in repair and logistics overhead.",
                "Procure original JCB or certified AGM chargers (₹25,000-₹26,000) that provide regulated charging curves and safeguard battery longevity.",
                "Strictly emboss indelible date markings on all newly received batteries before site dispatch to enforce full manufacturer warranty claims."
            ]
        },
        {
            title: "Mandatory Google Sheets / Form Indenting Compliance Before Spares Release",
            points: [
                "Central warehouse is strictly prohibited from dispatching any spare part, motor, or cable without an approved Google Form indent.",
                "Indenting technicians must record complete equipment serial number, model, exact part dimensions, and photographic proof on every request.",
                "Site personnel are prohibited from citing network or communication delays to bypass standardized procurement documentation."
            ]
        },
        {
            title: "Concentrated Manpower Allocation on Chronic Flagship Grounded Units",
            points: [
                "Technicians must halt peripheral routine troubleshooting and concentrate all on-site manpower to restore chronic units like M600JP.",
                "Supervisors must dismantle and overhaul core assemblies (such as M600 hydraulic cylinders) rather than attempting temporary surface patch fixes.",
                "All field vendors supplying local cables, machining, or crane services must provide registered tax invoices before payment disbursement."
            ]
        }
    ],
    actionItems: [
        {
            person: "Jitendra Budhauliya",
            task: "Approve ₹10,800 payment for M600 90m charging cable, order 2-3 starter motors from Delhi for 800AJ, and enforce battery warranty claims."
        },
        {
            person: "Pardeep Tomar",
            task: "Coordinate transfer of 48V non-sensor motor from Mundra to Sanand, audit Surya battery failures, and dismantle M600 cylinder."
        },
        {
            person: "Pandit Dheeraj Dubey",
            task: "Dismantle M600 hydraulic cylinder with Pradeep, connect 90m power cable at Gate 2, and supervise S-65 overhaul by Raj Kishore."
        },
        {
            person: "Sunny",
            task: "Submit formal vendor quotation today for 120B emergency motor cable and execute electrical starting circuit diagnosis."
        },
        {
            person: "Satendra Kumar",
            task: "Receive 48V non-sensor motor from Mundra, source hydraulic pump, and overhaul smoking Genie Z-45-4902 at Sanand."
        },
        {
            person: "Pritam Singh",
            task: "Procure 2-3 new starter motors from Delhi vendor, stage spares in central inventory, and audit 4047 12V battery installations."
        },
        {
            person: "Sushil Mishra",
            task: "Process warranty replacement claims with Surya battery manufacturer for batteries dropping electrolyte gravity within 11 months."
        },
        {
            person: "Umesh Kumar",
            task: "Verify vendor registration details and equipment serial numbers on Jamnagar crane/gear oil bills, and track 4047 board order."
        },
        {
            person: "Chunnilal",
            task: "Inspect 48V non-sensor motor in Mundra warehouse stock, crate securely, and dispatch immediately to Sanand site."
        },
        {
            person: "Raj Kishore",
            task: "Focus exclusively on resolving recurring functional control issues on Sanand Genie S-65 to ensure immediate plant exit."
        },
        {
            person: "Ranjan Sharma",
            task: "Conclude comprehensive technical troubleshooting on Sabarmati 860SJ boom lift and submit clearance report to management."
        }
    ]
};

export default meeting27;

async function verifyMeeting(meeting) {
    const { data: dbMeeting, error: mErr } = await supabaseAdmin
        .from('meetings')
        .select('*')
        .eq('id', meeting.id)
        .single();

    if (mErr || !dbMeeting) {
        throw new Error(`Master meeting not found for ${meeting.id}: ${mErr?.message}`);
    }

    const [bRes, pRes, dRes, aRes] = await Promise.all([
        supabaseAdmin.from('breakdown_machines').select('id', { count: 'exact' }).eq('meeting_id', meeting.id),
        supabaseAdmin.from('meeting_parts').select('id', { count: 'exact' }).eq('meeting_id', meeting.id),
        supabaseAdmin.from('meeting_directives').select('id', { count: 'exact' }).eq('meeting_id', meeting.id),
        supabaseAdmin.from('meeting_action_items').select('id', { count: 'exact' }).eq('meeting_id', meeting.id)
    ]);

    const expBreakdowns = meeting.breakdowns.length;
    const expParts = meeting.parts.length;
    const expDirectives = meeting.directives.length;
    const expActions = meeting.actionItems.length;

    console.log(`🔍 Verification for ${meeting.id}:`);
    console.log(`   - Master Record: Found (${dbMeeting.title})`);
    console.log(`   - Breakdown Machines: DB=${bRes.count || 0} | Expected=${expBreakdowns}`);
    console.log(`   - Meeting Parts: DB=${pRes.count || 0} | Expected=${expParts}`);
    console.log(`   - Directives: DB=${dRes.count || 0} | Expected=${expDirectives}`);
    console.log(`   - Action Items: DB=${aRes.count || 0} | Expected=${expActions}`);

    if (
        (bRes.count || 0) !== expBreakdowns ||
        (pRes.count || 0) !== expParts ||
        (dRes.count || 0) !== expDirectives ||
        (aRes.count || 0) !== expActions
    ) {
        throw new Error(`Count mismatch for ${meeting.id}`);
    }
    console.log(`✅ VERIFICATION PASSED for ${meeting.id}`);
}

async function run() {
    console.log('====================================================');
    console.log('🚀 Reach International Daily Meeting Supabase Ingestion (27 Oct 2026)');
    console.log('====================================================');

    console.log('\n📥 Ingesting Meeting: 27-10-2026...');
    const res = await syncDailyMeeting(meeting27);
    console.log(`✅ Successfully synced ${res.meetingId}:`);
    console.log(`   - ${res.counts.breakdowns} breakdown machines`);
    console.log(`   - ${res.counts.parts} parts`);
    console.log(`   - ${res.counts.directives} directives`);
    console.log(`   - ${res.counts.actionItems} action items`);
    await verifyMeeting(meeting27);

    console.log('\n====================================================');
    console.log('🎉 MEETING 27-OCT-2026 SUCCESSFULLY INGESTED & VERIFIED IN SUPABASE!');
    console.log('====================================================');
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
    run().catch(err => {
        console.error('❌ Ingestion or verification failed:', err);
        process.exit(1);
    });
}
