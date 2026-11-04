/**
 * Reach International Operations - Daily Meeting Sync (03 & 04 Nov 2026)
 *
 * Implements strict Reach International standards:
 * - 100% Cloud-Native ingestion (zero static JSON files in src/data/)
 * - Strictly ONE machine per breakdown card
 * - Concise, single-line informative fields across all sections
 * - Accurate English translation and distillation of raw Hindi meeting transcripts
 * - Direct Supabase ingestion with automated verification check (Step A, B, C)
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { syncDailyMeeting, supabaseAdmin } from './sync-daily-meeting.js';

const __filename = fileURLToPath(import.meta.url);

// ============================================================================
// 1. MEETING: 03-11-2026 (Tuesday)
// ============================================================================
export const meeting03Nov = {
    id: "meet-2026-11-03",
    title: "03-11-2026",
    date: "2026-11-03",
    dateFormatted: "03-11-2026",
    focus: "Operations fleet hydraulic hose fabrication for 8-Ton units and 5-Ton steering seizure diagnosis, Sanand Unit 43 upper controls failure, Panipat JLG 450 premature cylinder head gasket failure and injection pump overhaul, Mundra Z-34 control card replacement dispatch, Mumbai and Jammu AGM traction battery bank retrofits with software calibration pen drives, and mandatory railway reverse logistics for core returns.",
    isHoliday: false,
    holidayName: "",
    noMeetingHeld: false,
    notRecorded: false,
    breakdowns: [
        {
            site: "Operations Fleet Site (Shivam Pandey)",
            model: "8-Ton Telehandler / Crane",
            serialNumber: "Unit 800-2",
            issue: "Clamper open-close hydraulic pressure hose ruptured at 6:00 AM, grounding unit operations.",
            action: "Shivam Pandey fabricating two replacement high-pressure hydraulic hoses locally for immediate fitment.",
            logistics: "Two hydraulic hoses being crimped locally from vendor workshop today.",
            clarification: "Clamper hydraulic lines experiencing cyclic flexing fatigue; two hoses scheduled for replacement.",
            pendingIssue: "Install crimped hydraulic hoses on clamper circuit and conduct operational pressure testing.",
            status: "Breakdown — Two clamper hydraulic hoses under local fabrication; fitment pending."
        },
        {
            site: "Operations Fleet Site (Shivam Pandey)",
            model: "8-Ton Telehandler / Crane",
            serialNumber: "Unit 800-1",
            issue: "Clamper hydraulic line showing weeping and wear, risking imminent burst under lifting operations.",
            action: "Shivam Pandey fabricating one replacement hose and one standby spare hose for site inventory.",
            logistics: "One replacement hose and one emergency spare hose being crimped and staged on site.",
            clarification: "Precautionary replacement scheduled to avoid sudden field breakdown during active work shifts.",
            pendingIssue: "Fit replacement clamper hose and stage secondary fabricated hose in site emergency spares.",
            status: "Precautionary Maintenance — Replacement hose fabricated; fitment and spare staging underway."
        },
        {
            site: "Operations Fleet Site (Shivam Pandey)",
            model: "5-Ton Telehandler",
            serialNumber: "5-Ton Unit",
            issue: "Hydraulic steering system locks and jams intermittently while traveling during operations.",
            action: "Shivam Pandey and site technician diagnosing steering orbital valve, priority valve, and hydraulic cylinders.",
            logistics: "Steering cylinder overhaul seals and priority valve placed on emergency standby at central stores.",
            clarification: "Steering seizure during transit poses severe site safety hazard; unit grounded immediately.",
            pendingIssue: "Inspect steering orbitrol valve and priority flow divider to clear mechanical jamming.",
            status: "Breakdown — Steering jamming during transit; hydraulic valve and cylinder inspection in progress."
        },
        {
            site: "Sanand Project Site",
            model: "Boom Lift",
            serialNumber: "Unit 43",
            issue: "Machine traveling/marching normally, but all upper boom elevation and basket functions are completely dead.",
            action: "Pardeep Tomar booked on travel ticket today to inspect on-site electrical controls and hydraulic valving.",
            logistics: "Pardeep Tomar traveling to Sanand site with travel ticket and gate pass clearance arranged.",
            clarification: "Operator instructed to connect via video call for preliminary electrical valve solenoid troubleshooting.",
            pendingIssue: "Conduct operator video diagnostic and complete on-site inspection upon Pardeep's arrival.",
            status: "Breakdown — Marching functional but boom/basket dead; Pardeep traveling with site gate pass."
        },
        {
            site: "Panipat Project Site",
            model: "JLG 450AJ Articulating Boom Lift",
            serialNumber: "Unit 450",
            issue: "Engine cylinder head gasket ruptured again within 20 days of replacement due to poor-quality local gasket.",
            action: "Sushil Mishra ordering genuine OEM cylinder head gasket while Praveen overhauls fuel injection pump and nozzles.",
            logistics: "Interim gasket dispatched via road transport (Rs 500 transport fee); genuine OEM gasket quoted at Rs 9,500.",
            clarification: "Local gasket failed prematurely after Oct 10 dispatch; OEM gasket mandatory to withstand engine pressure.",
            pendingIssue: "Source genuine OEM cylinder head gasket and reinstall overhauled fuel pump and calibrated nozzles.",
            status: "Breakdown — Local gasket failed after 20 days; OEM gasket requisitioned and fuel pump overhaul underway."
        },
        {
            site: "Mundra Project Site",
            model: "Genie Z-34/22 Articulating Boom Lift",
            serialNumber: "Unit Z-34",
            issue: "Platform electronic controller card short-circuited, disabling all basket control console functions.",
            action: "Pardeep Tomar dispatched replacement tested controller card from Delhi; Pritam Chand assigned to install upon arrival.",
            logistics: "Replacement controller circuit board dispatched via express transit from Delhi central stock.",
            clarification: "Pritam Singh currently en route from Delhi on train; card delivery expected within 1 to 2 days.",
            pendingIssue: "Receive replacement controller card on site and complete installation and functional testing.",
            status: "Spares in Transit — Replacement controller board dispatched from Delhi; technician in transit."
        },
        {
            site: "Mumbai Project Site",
            model: "JCB S1932E Electric Scissor Lift",
            serialNumber: "Unit JCB-MUM",
            issue: "Four-battery traction bank failed due to repeated deep discharge, with two batteries entirely dead.",
            action: "Pardeep Tomar dispatching complete bank of four new AGM batteries along with calibration pen drive.",
            logistics: "Four AGM batteries dispatched from central warehouse; software update USB drive placed in battery box.",
            clarification: "All four batteries replaced together to prevent mismatch; remaining two working batteries reused on secondary unit.",
            pendingIssue: "Deliver AGM batteries to Mumbai, upload software calibration via pen drive, and return dead batteries.",
            status: "Batteries Dispatched — Four new AGM batteries and software USB drive en route to Mumbai site."
        },
        {
            site: "Jammu Project Site",
            model: "Genie GS-4047 Electric Scissor Lift",
            serialNumber: "Unit 1209",
            issue: "Traction battery bank depleted and failing to sustain charge under elevation cycles.",
            action: "Pardeep Tomar dispatching four 12V AGM batteries along with controller configuration software pen drive.",
            logistics: "Four 12V AGM batteries dispatched from warehouse; update pen drive included for site technician.",
            clarification: "Serial number confirmed as Unit 1209 after cross-checking field messaging discrepancies.",
            pendingIssue: "Receive AGM batteries on site, execute controller firmware update via USB pen drive, and install.",
            status: "Batteries in Transit — Four 12V AGM batteries and configuration USB pen drive dispatched to Jammu."
        },
        {
            site: "Jammu Project Site",
            model: "JCB Equipment",
            serialNumber: "JCB-JMU-Sales",
            issue: "Engine oil level critically low on machine sold 2-3 months ago; operations halted pending oil replenishment.",
            action: "Sushil Mishra coordinating with site mechanic to procure 5 liters of specified engine oil locally.",
            logistics: "Local vendors only stocking 20-liter drums (Rs 6,500); searching for 5-liter or 10-liter retail pack.",
            clarification: "Dispute over commercial responsibility between client and Reach International for post-sale oil top-up.",
            pendingIssue: "Finalize commercial clearance and procure 5L engine oil through site mechanic for immediate top-up.",
            status: "Oil Top-up Pending — 5L pack unavailable locally; commercial clearance and procurement underway."
        }
    ],
    parts: [
        {
            part: "Clamper Hydraulic Hoses (3 Nos)",
            context: "Operations Fleet (Units 800-2 & 800-1)",
            statusNextSteps: "Three high-pressure hoses being fabricated locally (2 for 800-2, 1 for 800-1, plus 1 standby spare)."
        },
        {
            part: "Genuine OEM Cylinder Head Gasket",
            context: "Panipat Project Site (JLG 450)",
            statusNextSteps: "OEM specification gasket (~Rs 9,500) being sourced to permanently replace blown local gasket."
        },
        {
            part: "Fuel Injection Pump & Calibrated Nozzles",
            context: "Panipat Project Site (JLG 450)",
            statusNextSteps: "Fuel injection pump and injector nozzles sent to Praveen for overhaul and flow bench testing."
        },
        {
            part: "Z-34 Platform Electronic Control Card",
            context: "Mundra Project Site (Genie Z-34/22)",
            statusNextSteps: "Tested replacement joystick circuit board dispatched from Delhi; delivery expected in 1-2 days."
        },
        {
            part: "AGM Traction Battery Bank (4 Nos, 6V/12V)",
            context: "Mumbai Project Site (JCB Scissor Lift)",
            statusNextSteps: "Dispatched from warehouse with software calibration USB drive packed inside battery box."
        },
        {
            part: "12V AGM Traction Battery Pack (4 Nos)",
            context: "Jammu Project Site (Genie GS-4047 / Unit 1209)",
            statusNextSteps: "Dispatched from warehouse with controller configuration pen drive for technician upload."
        },
        {
            part: "15W-40 Diesel Engine Oil (5-10 Liters)",
            context: "Jammu Project Site (JCB Equipment)",
            statusNextSteps: "Site mechanic searching for retail 5L/10L container to avoid purchasing full 20L drum (Rs 6,500)."
        }
    ],
    directives: [
        {
            title: "Mandatory Railway Return Protocol for Replaced Batteries & Cores",
            points: [
                "All site supervisors must pack dead batteries and replaced parts onto Delhi-bound passenger trains without delay.",
                "Supervisors must share railway parcel booking receipts and destination porter contacts immediately with Pardeep Tomar."
            ]
        },
        {
            title: "Strict Ban on Substandard Local Engine Head Gaskets",
            points: [
                "Field teams are strictly prohibited from installing cheap local head gaskets that blow within weeks on diesel equipment.",
                "Always procure genuine OEM specification gaskets (approx Rs 9,500) to ensure long-term engine compression integrity."
            ]
        },
        {
            title: "Software Calibration Media Inclusion with AGM Battery Retrofits",
            points: [
                "Every AGM battery conversion shipment from warehouse must include a pre-loaded USB pen drive with charger algorithms.",
                "Site technicians must flash the machine controller before commissioning new AGM batteries to prevent premature damage."
            ]
        },
        {
            title: "Rigorous Equipment Serial Number Accuracy in Field Logging",
            points: [
                "Technicians and supervisors must verify physical serial number plates before logging maintenance messages or requests.",
                "Misleading or conflicting serial identifiers causing central warehouse dispatch confusion will be flagged for review."
            ]
        }
    ],
    actionItems: [
        {
            person: "Shivam Pandey",
            task: "Complete local fabrication of three clamper hydraulic hoses, fit on Unit 800-2 and 800-1, and diagnose 5-Ton steering jamming."
        },
        {
            person: "Pardeep Tomar",
            task: "Dispatch AGM batteries and software USBs to Mumbai and Jammu, dispatch Z-34 control card to Mundra, and inspect Unit 43 at Sanand."
        },
        {
            person: "Sushil Mishra",
            task: "Procure genuine OEM cylinder head gasket for Panipat JLG 450, oversee pump-nozzle overhaul, and finalize Jammu engine oil procurement."
        },
        {
            person: "Praveen Kumar",
            task: "Overhaul fuel injection pump and calibrate injector nozzles for Panipat JLG 450 and assemble with incoming OEM head gasket."
        },
        {
            person: "Durgesh & Pritam Chand",
            task: "Receive dispatched Z-34 control card at Mundra, install on machine, and conduct full operational function checks."
        },
        {
            person: "Umesh Kumar & Site Supervisors",
            task: "Load all discarded batteries and cores onto Delhi-bound trains, obtain cargo waybill, and send porter contact to Pardeep."
        }
    ]
};

// ============================================================================
// 2. MEETING: 04-11-2026 (Wednesday)
// ============================================================================
export const meeting04Nov = {
    id: "meet-2026-11-04",
    title: "04-11-2026",
    date: "2026-11-04",
    dateFormatted: "04-11-2026",
    focus: "Bhadrak Unit SX-125 outrigger sensor fault warranty escalation and pre-loading walkaround video, Unit SX-150 wheel hub spacer washer installation for tire clearance, basket leveling cylinder weld prep and intermittent foot switch overhaul, chassis structural weld crack repair before transport, Mundra JCB boom lift Gel battery procurement via Deepak Jain, and pending coal invoice clearance.",
    isHoliday: false,
    holidayName: "",
    noMeetingHeld: false,
    notRecorded: false,
    breakdowns: [
        {
            site: "Bhadrak Project Site",
            model: "Genie SX-125 Telescopic Boom Lift",
            serialNumber: "SX-125-2923",
            issue: "Retracting outriggers cuts off all boom and drive functions due to persistent sensor fault dating back to 7th August.",
            action: "Jitendra Budhauliya filing formal warranty escalation with OEM (Vishnu/Madhusudan); Banarasi recording 360-degree walkaround video.",
            logistics: "Complete 1-hour walkaround and functional video required before loading onto transport trailer.",
            clarification: "Unit is a 2024 model within 2-year warranty; limit switch replacement failed to clear underlying controller fault.",
            pendingIssue: "Record complete operational video, submit CRM docket escalation to OEM, and arrange bypass coil testing for loading.",
            status: "Warranty Escalation — Outrigger fault persists since Aug 7; pre-loading video and OEM warranty escalation in progress."
        },
        {
            site: "Bhadrak Project Site",
            model: "Genie SX-150 Telescopic Boom Lift",
            serialNumber: "Unit 150 (Tire Assembly)",
            issue: "Heavy tires rubbing against chassis structure due to oversized tire wall thickness, preventing steering travel.",
            action: "Vinod Pal guiding Banarasi and site operator to install 11-12 spacer washers on stud bolts before mounting rim.",
            logistics: "Industrial spacer washers being fitted across 12 stud bolts per hub; vendor guarantees 100% replacement warranty.",
            clarification: "Tire vendor confirmed rim offset distance can be corrected using spacer washers without mechanical risk.",
            pendingIssue: "Mount 11 washers on all 12 stud bolts, torque wheel rim, and verify zero chassis friction during steering.",
            status: "Under Assembly — Fitting 11 spacer washers per wheel stud to achieve rim clearance under vendor warranty."
        },
        {
            site: "Bhadrak Project Site",
            model: "Genie SX-150 Telescopic Boom Lift",
            serialNumber: "Unit 150 (Basket & Swing Assembly)",
            issue: "Basket leveling failing intermittently, platform foot switch cutting out, and cylinder bolts requiring welding for seal replacement.",
            action: "Banarasi mobilizing unit 1.5 km to workshop to weld 3 bolts onto cylinder for seal overhaul and service foot switch.",
            logistics: "Local workshop selected 1.5 km away as site welder is on 15-day leave and local shops closed.",
            clarification: "Swing motor mounting and basket cylinder require 3 welded bolts to enable disassembly and cylinder seal fitting.",
            pendingIssue: "Transport machine 1.5 km to workshop, weld cylinder disassembly bolts, overhaul seals, and replace foot switch.",
            status: "Repairs Scheduled — Mobilizing 1.5 km to workshop for cylinder weld prep, seal replacement, and foot switch service."
        },
        {
            site: "Bhadrak Project Site",
            model: "Genie SX-150 Telescopic Boom Lift",
            serialNumber: "Unit 150 (Chassis Structure)",
            issue: "Structural weld seam on chassis frame cracked during operations, posing safety and transport damage dispute risk.",
            action: "Banarasi photographing weld crack for records; structural welder assigned to gouge, reweld, and paint before trailer loading.",
            logistics: "Industrial welding equipment and color-matched touch-up paint arranged for on-site structural repair.",
            clarification: "Pre-existing weld fatigue must be fully documented and repaired on site so transport contractors cannot be blamed.",
            pendingIssue: "Submit photographic proof to management, complete structural welding, apply paint finish, and record post-repair video.",
            status: "Structural Welding Pending — Chassis weld crack photographed; re-welding and touch-up paint scheduled prior to loading."
        },
        {
            site: "Bhadrak Project Site",
            model: "Genie SX-150 Telescopic Boom Lift",
            serialNumber: "Unit 150 (Main Boom Cylinder)",
            issue: "Main boom hydraulic cylinder previously showed fluid weeping; monitoring required to prevent catastrophic failure in remote field.",
            action: "Jitendra Budhauliya and Banarasi reviewing cylinder seal replacement before dispatch to high-workload destination.",
            logistics: "Heavy-duty boom cylinder overhaul seal kit kept staged with site tool inventory.",
            clarification: "No active weeping observed in past 2 months, but replacement strongly advised before sending to remote area lacking technicians.",
            pendingIssue: "Decide whether to execute preventive boom seal replacement on site or ship replacement seal kit with machine.",
            status: "Preventive Review — Leakage dormant for 2 months; preventive seal overhaul evaluated prior to remote deployment."
        },
        {
            site: "Mundra Project Site",
            model: "JCB Boom Lift",
            serialNumber: "JCB-Mundra-Fleet",
            issue: "Traction battery bank depleted and past warranty, leaving equipment non-operational.",
            action: "Dinesh, Sushil Mishra, and Shiv Uniyal negotiating procurement of four to eight 6V/12V Gel batteries from Mumbai vendor.",
            logistics: "Four 6V/12V Gel batteries sourced in Mumbai via Deepak Jain at ~Rs 15,000-16,000 each (vs Rs 50,000 OEM); dispatching to Mundra.",
            clarification: "Management approved immediate Proforma Invoice (PI) generation and same-day payment release to secure inventory.",
            pendingIssue: "Contact Deepak Jain after 11:00 AM, finalize vendor PI, release advance payment, and dispatch 4 Gel batteries to Mundra.",
            status: "Procurement Approved — PI generation and advance payment approved for 4 Gel batteries from Mumbai vendor."
        }
    ],
    parts: [
        {
            part: "High-Tensile Wheel Stud Spacer Washers (11-12 per stud, 12 studs)",
            context: "Bhadrak Project Site (Genie SX-150)",
            statusNextSteps: "Sourced and fitted onto wheel stud bolts to adjust rim offset and eliminate chassis tire rubbing."
        },
        {
            part: "Basket Cylinder Seal Overhaul Kit & 3 Disassembly Weld Bolts",
            context: "Bhadrak Project Site (Genie SX-150)",
            statusNextSteps: "Three bolts being welded onto cylinder housing at workshop for disassembly and seal pack replacement."
        },
        {
            part: "Platform Electrical Foot Switch Assembly",
            context: "Bhadrak Project Site (Genie SX-150)",
            statusNextSteps: "Replacement foot switch staged to resolve intermittent basket control electrical contact cutouts."
        },
        {
            part: "Heavy-Duty Structural Welding Electrodes & Touch-up Paint",
            context: "Bhadrak Project Site (Genie SX-150)",
            statusNextSteps: "Welding consumables and color-matched paint arranged to repair chassis frame seam crack prior to transit."
        },
        {
            part: "Main Boom Hydraulic Cylinder Overhaul Seal Kit",
            context: "Bhadrak Project Site (Genie SX-150)",
            statusNextSteps: "Preventive cylinder overhaul kit staged with machine tool inventory before remote field dispatch."
        },
        {
            part: "6V/12V Deep Cycle Gel Traction Batteries (4-8 Nos)",
            context: "Mundra Project Site (JCB Boom Lift)",
            statusNextSteps: "Sourced from Mumbai vendor via Deepak Jain at Rs 15,000-16,000 each; advance payment underway."
        },
        {
            part: "Outrigger Limit Switch Bypass Connector & Diagnostic Cable",
            context: "Bhadrak Project Site (Genie SX-125)",
            statusNextSteps: "Diagnostic connector harness prepared for trailer loading bypass while warranty claim progresses."
        }
    ],
    directives: [
        {
            title: "Mandatory Pre-Loading 360-Degree Video and Defect Documentation",
            points: [
                "Technicians must record comprehensive walkaround and function videos for all heavy booms prior to loading onto transport trailers.",
                "All pre-existing chassis cracks, paint scratches, and mechanical defects must be photographed and submitted to avoid transit liability disputes."
            ]
        },
        {
            title: "Strict Formal Escalation on OEM Warranty Defects",
            points: [
                "Field supervisors must not perform unauthorized ad-hoc modifications on equipment covered under active 2-year manufacturer warranties.",
                "All recurring sensor or controller faults must be documented with CRM ticket dockets and escalated via formal reminder emails to OEM representatives."
            ]
        },
        {
            title: "Vendor-Warranted Wheel Offset Adjustments",
            points: [
                "Spacer washer installations for wheel hub clearance must be executed using verified high-tensile hardware as specified by the tire supplier.",
                "Written replacement guarantees must be maintained on record before commissioning modified wheel configurations."
            ]
        },
        {
            title: "Same-Day Commercial Clearance for High-Priority Traction Batteries",
            points: [
                "For grounded equipment awaiting non-OEM battery banks (such as Mundra Gel batteries), Proforma Invoices must be cleared on the same day.",
                "Accounts and procurement must expedite advance fund releases to avoid transit holding delays by logistics vendors."
            ]
        }
    ],
    actionItems: [
        {
            person: "Jitendra Budhauliya",
            task: "Send formal warranty escalation email to OEM (Vishnu/Madhusudan) for Genie SX-125 with CRM docket history, and check coal bill payment."
        },
        {
            person: "Banarasi Yadav",
            task: "Record 360-degree walkaround videos of SX-125 and SX-150, fit wheel spacer washers, and move SX-150 to workshop for welding."
        },
        {
            person: "Vinod Pal",
            task: "Guide site operator and Banarasi on spacer washer fitment on Unit 150 and provide electrical bypass guidance for Unit 125 trailer loading."
        },
        {
            person: "Dinesh & Shiv Uniyal",
            task: "Contact Deepak Jain after 11:00 AM, obtain PI for four Gel batteries from Mumbai vendor, and process immediate payment for Mundra dispatch."
        },
        {
            person: "Sushil Mishra",
            task: "Coordinate PI approval and funds release with accounts for Mundra batteries and verify technical specifications of incoming units."
        },
        {
            person: "Sikandar Kumar",
            task: "Verify invoice submission and accounts status for pending coal bill payment and report confirmation to management."
        }
    ]
};

export const meetingsNov0304 = [meeting03Nov, meeting04Nov];
export default meetingsNov0304;

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

export async function run() {
    console.log('====================================================');
    console.log('🚀 Reach International Daily Meeting Supabase Ingestion (03 & 04 Nov 2026)');
    console.log('====================================================');

    for (const m of meetingsNov0304) {
        console.log(`\n📥 Ingesting Meeting: ${m.title} (${m.id})...`);
        const res = await syncDailyMeeting(m);
        console.log(`✅ Successfully synced ${res.meetingId}:`);
        console.log(`   - ${res.counts.breakdowns} breakdown machines`);
        console.log(`   - ${res.counts.parts} parts`);
        console.log(`   - ${res.counts.directives} directives`);
        console.log(`   - ${res.counts.actionItems} action items`);
        await verifyMeeting(m);
    }

    console.log('\n====================================================');
    console.log('🎉 BOTH MEETINGS (03 & 04 NOV 2026) SUCCESSFULLY INGESTED & VERIFIED IN SUPABASE!');
    console.log('====================================================');
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
    run().catch(err => {
        console.error('❌ Ingestion or verification failed:', err);
        process.exit(1);
    });
}
