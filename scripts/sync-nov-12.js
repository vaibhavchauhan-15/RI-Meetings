/**
 * Reach International Operations - Daily Meeting Sync (12 Nov 2026)
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
// MEETING: 12-11-2026 (Thursday)
// ============================================================================
export const meeting12Nov = {
    id: "meet-2026-11-12",
    title: "12-11-2026",
    date: "2026-11-12",
    dateFormatted: "12-11-2026",
    focus: "Fleet servicing and payment clearances for Siliguri Unit 5390, Bhadrak Unit 125 diesel fund release, Assam Units 125 and 135 stranded battery retrieval from Guwahati logistics hub, Unit 45-50 drive motor diagnostic by Deepak, Sanand Unit 4390 up-down elevation troubleshooting and Unit 3240 battery check, Unit 860 Siliguri filter dispatch, Dhanbad material pickup coordination, and strict HR barring of absconded operator Dhananjay.",
    isHoliday: false,
    holidayName: "",
    noMeetingHeld: false,
    notRecorded: false,
    breakdowns: [
        {
            site: "Siliguri Project Site (Pravesh Yadav)",
            model: "Fleet Boom Lift",
            serialNumber: "Unit 5390",
            issue: "Periodic routine maintenance and filter servicing overdue before site release.",
            action: "Pravesh Yadav executing comprehensive servicing tomorrow upon accounts releasing service funds today.",
            logistics: "Consumables procurement and painter mobilization scheduled immediately upon payment disbursement.",
            clarification: "Pravesh awaiting nameplate photo to log service entry in Google Form prior to site departure.",
            pendingIssue: "Release vendor payment, capture nameplate photograph, and complete Google Form logging.",
            status: "Servicing Scheduled — Awaiting funds release today to execute maintenance tomorrow."
        },
        {
            site: "Bhadrak Project Site (Banarasi Yadav)",
            model: "Genie SX-125 Boom Lift",
            serialNumber: "Unit 125",
            issue: "Equipment non-operational and idle due to complete fuel exhaustion with no mechanical defect.",
            action: "Jitendra Budhauliya expediting pending diesel fuel reimbursement to refill tank and resume work.",
            logistics: "Local diesel fuel procurement halted for one week pending central funds disbursement.",
            clarification: "Unit is mechanically fully operational; stoppage is entirely due to pending diesel payment.",
            pendingIssue: "Release pending fuel funds to purchase diesel and restart machine operations.",
            status: "Idle / Fuel Exhaustion — Unit halted for one week awaiting pending diesel payment clearance."
        },
        {
            site: "Assam Project Site (Subash Kumar Singh)",
            model: "Genie SX-125 Boom Lift",
            serialNumber: "Unit 125 (Assam Site)",
            issue: "Unit stalled due to discharged starting battery and ruptured fluid piping line.",
            action: "Subash Kumar Singh fitted replacement pipe and installed site battery, restoring unit to active service.",
            logistics: "Interim battery installed on site pending arrival of stranded Guwahati battery shipment.",
            clarification: "Machine successfully tested and operational at 80 ft working elevation following hose repair.",
            pendingIssue: "Swap interim battery with new unit once retrieved from Guwahati logistics hub.",
            status: "Operational — Battery replaced and pipe fitted; machine fully functional at 80 ft."
        },
        {
            site: "Assam Project Site (Subash Kumar Singh)",
            model: "Genie SX-135 Boom Lift",
            serialNumber: "Unit 135",
            issue: "Battery performance critically depleted; replacement battery consignment stranded at Guwahati hub.",
            action: "Subash Kumar Singh deploying directly to Guwahati transporter hub to retrieve consignment.",
            logistics: "Replacement battery shipment held at Guwahati transporter hub since 5th Nov.",
            clarification: "Transporter reported cargo returned after seven days of non-delivery; immediate site pickup initiated.",
            pendingIssue: "Retrieve battery package from Guwahati transport warehouse and install on machine.",
            status: "Spares Delayed — Replacement battery stranded at Guwahati hub; manual retrieval underway."
        },
        {
            site: "Field Operations / Dholera (Imran Khan)",
            model: "Zoomlion Articulating Boom Lift",
            serialNumber: "Unit 45-50",
            issue: "Drive motor running sluggishly and displaying intermittent electric fault warnings.",
            action: "Imran Khan coordinating with technician Deepak who is arriving on site to inspect motor and terminals.",
            logistics: "Electrical multimeters and testing equipment carried directly by technician Deepak.",
            clarification: "Site operator reported motor slowdown; physical inspection required to test terminals and voltage drop.",
            pendingIssue: "Deepak to complete on-site motor inspection and calibrate drive circuit.",
            status: "Breakdown — Drive motor slowdown reported; technician Deepak deployed for diagnosis."
        },
        {
            site: "Sanand Project Site (Satendra Kumar)",
            model: "Zoomlion / Fleet Boom Lift",
            serialNumber: "Unit 4390",
            issue: "Machine travel and marching functional, but vertical up-down elevation movement failed since 3rd Nov.",
            action: "Satendra Kumar diagnosing elevation hydraulic proportional valve and electrical solenoid coils.",
            logistics: "Hydraulic circuit schematics and replacement valve coils on standby at store.",
            clarification: "Travel and steering operate normally; malfunction isolated strictly to mast/boom elevation circuit.",
            pendingIssue: "Isolate and test hydraulic proportional valve coils to restore vertical lift motion.",
            status: "Breakdown — Marching functional but elevation disabled since 3rd Nov; diagnostic underway."
        },
        {
            site: "Sanand Project Site (Satendra Kumar)",
            model: "Electric Scissor Lift",
            serialNumber: "Unit 3240",
            issue: "Traction battery bank depleted and failing to sustain operating voltage under load.",
            action: "Satendra Kumar scheduling battery load testing upon assigned technician Umesh's return from leave.",
            logistics: "Standby battery pack and charger diagnostic unit staged for testing.",
            clarification: "Physical diagnostic deferred because primary site technician Umesh is on sanctioned leave.",
            pendingIssue: "Execute battery voltage load test and cell gravity inspection upon Umesh's return.",
            status: "Breakdown — Battery failure reported; physical troubleshooting pending technician Umesh's return."
        },
        {
            site: "Sanand Project Site (Satendra Kumar)",
            model: "Electric Scissor Lift",
            serialNumber: "Unit GLT-510",
            issue: "Cable tray and harness dressing requires alignment check and serial number verification.",
            action: "Satendra Kumar logging verified serial number and checking cable track tension.",
            logistics: "Cable carrier guides and ties staged on site for routing adjustment.",
            clarification: "Primary breakdown resolved earlier; current work focuses on cable tray dress audit.",
            pendingIssue: "Submit confirmed serial number and complete cable carrier routing check.",
            status: "Inspection Pending — Main breakdown cleared; cable tray dressing audit in progress."
        },
        {
            site: "Siliguri Project Site (Satendra Kumar & Banarasi Yadav)",
            model: "JLG 860SJ Telescopic Boom Lift",
            serialNumber: "Unit 860",
            issue: "Engine and hydraulic filter replacement required for scheduled preventive maintenance cycle.",
            action: "Jitendra Budhauliya dispatching maintenance filter kit from central stores to technician Verma.",
            logistics: "Single machine filter kit packed and shipped to technician Verma's Siliguri address.",
            clarification: "Satendra confirmed requirement is strictly for one machine (Unit 860).",
            pendingIssue: "Ship filter kit and provide dispatch airway bill / tracking number to Verma.",
            status: "Spares Dispatched — Preventive filter kit being shipped to technician Verma at Siliguri."
        }
    ],
    parts: [
        {
            part: "Preventive Servicing Consumables Kit",
            context: "Siliguri Project Site (Unit 5390)",
            statusNextSteps: "Accounts payment clearance pending today to enable Pravesh to purchase service items tomorrow."
        },
        {
            part: "Diesel Fuel Allocation",
            context: "Bhadrak Project Site (Unit 125)",
            statusNextSteps: "Accounts release required for one-week pending diesel payment to refuel and restart the machine."
        },
        {
            part: "Replacement Battery Consignment",
            context: "Guwahati Logistics Hub (Assam Units 125 & 135)",
            statusNextSteps: "Batteries delayed 7 days at Guwahati transporter; Subash Singh deployed to collect directly from hub."
        },
        {
            part: "Fluid & Fuel Pipe Assembly",
            context: "Assam Project Site (Unit 125)",
            statusNextSteps: "Replacement pipe installed and connected on site; unit verified operational at 80 ft elevation."
        },
        {
            part: "Drive Motor & Terminal Assembly",
            context: "Field Operations / Dholera (Unit 45-50)",
            statusNextSteps: "Technician Deepak deploying to site to inspect slowdown issue and test motor wiring terminals."
        },
        {
            part: "Hydraulic Elevation Solenoid Valve & Coils",
            context: "Sanand Project Site (Unit 4390)",
            statusNextSteps: "Diagnostic underway to isolate why marching operates but up-down elevation motion fails."
        },
        {
            part: "Traction Battery Pack",
            context: "Sanand Project Site (Unit 3240)",
            statusNextSteps: "Physical inspection and voltage test pending operator Umesh's return from approved leave."
        },
        {
            part: "Cable Tray / Cable Track Assembly",
            context: "Sanand Project Site (Unit GLT-510)",
            statusNextSteps: "Satendra recording serial number and inspecting cable tray routing and tension."
        },
        {
            part: "Preventive Maintenance Filter Kit",
            context: "Siliguri Project Site (Unit 860)",
            statusNextSteps: "Satendra and Jitendra coordinating dispatch of filter kit from store to technician Verma."
        },
        {
            part: "Ragwa Project Spares Consignment",
            context: "Dhanbad Logistics / Store (Satendra & Dubey)",
            statusNextSteps: "Satendra coordinating with Dubey to arrange pickup and dispatch of materials from Dhanbad."
        }
    ],
    directives: [
        {
            title: "Strict Re-employment Bar on Absconded Operator Dhananjay",
            points: [
                "Operator Dhananjay is permanently barred from re-employment across all Reach International sites after absconding to competitor MTNT.",
                "Management and supervisors must not entertain emotional appeals or family representations; final salary will be disbursed strictly on the scheduled pay cycle."
            ]
        },
        {
            title: "Mandatory Direct Retrieval for Delayed Logistics Consignments",
            points: [
                "When commercial transporters delay equipment or battery shipments beyond 48 hours, field supervisors must immediately retrieve consignments directly from local hubs.",
                "Subash Singh must coordinate on-site collection at the Guwahati transporter depot to prevent prolonged machine downtime in Assam."
            ]
        },
        {
            title: "Pre-Deployment Material Staging & Servicing Workflow",
            points: [
                "Technicians must ensure all servicing parts, consumables, and painter resources are staged on site before commencing maintenance work.",
                "Technicians must photograph machine serial plates and submit the official Google Form immediately upon completing equipment servicing."
            ]
        },
        {
            title: "Immediate Fuel Payment Clearance to Prevent Operational Halts",
            points: [
                "Site diesel fuel payments must not remain pending for over 48 hours to avoid grounding mechanically sound equipment.",
                "Accounts and operations must expedite pending fuel funds for Bhadrak Unit 125 to resume active client deployment."
            ]
        }
    ],
    actionItems: [
        {
            person: "Jitendra Budhauliya",
            task: "Process pending vendor payment for mesh/jali materials and Pravesh's servicing expenses today."
        },
        {
            person: "Jitendra Budhauliya",
            task: "Expedite pending diesel fuel fund release for Bhadrak Unit 125 to resume operations."
        },
        {
            person: "Jitendra Budhauliya",
            task: "Instruct Guwahati field team to immediately retrieve stranded battery consignment from transporter hub."
        },
        {
            person: "Jitendra Budhauliya",
            task: "Coordinate dispatch of preventive maintenance filter kit to technician Verma for Siliguri Unit 860."
        },
        {
            person: "Pravesh Yadav",
            task: "Photograph Unit 5390 serial number plate and submit service entry on Google Form."
        },
        {
            person: "Pravesh Yadav",
            task: "Procure servicing consumables upon payment release and complete Unit 5390 maintenance tomorrow."
        },
        {
            person: "Pravesh Yadav",
            task: "Follow up with accounts for remaining personal expense clearance following Toofan advance receipt."
        },
        {
            person: "Pardeep Tomar",
            task: "Track Golaghat replacement operator en route and ensure arrival before 4:00 PM."
        },
        {
            person: "Imran Khan",
            task: "Coordinate on-site arrival of technician Deepak to inspect drive motor and electrical terminals on Unit 45-50."
        },
        {
            person: "Banarasi Yadav",
            task: "Enforce strict permanent re-hiring ban on operator Dhananjay across all company sites and notify all supervisors."
        },
        {
            person: "Banarasi Yadav",
            task: "Ensure Siliguri maintenance materials and vendor funds are arranged before mobilizing technicians."
        },
        {
            person: "Satendra Kumar",
            task: "Share machine serial number and verify cable tray dressing condition for Unit GLT-510."
        },
        {
            person: "Satendra Kumar",
            task: "Troubleshoot vertical up-down elevation failure on Unit 4390 and inspect Unit 3240 battery upon Umesh's return."
        },
        {
            person: "Satendra Kumar",
            task: "Coordinate with Dubey regarding spares availability from Ragwa and schedule pickup from Dhanbad."
        },
        {
            person: "Subash Kumar Singh",
            task: "Mobilize immediately to Guwahati transporter hub to retrieve delayed battery shipment for Assam units."
        },
        {
            person: "Subash Kumar Singh",
            task: "Answer coordinator calls and manage reception and deployment of incoming Golaghat operator."
        }
    ]
};

// ============================================================================
// STEP B: Mandatory Automated Verification Query
// ============================================================================
export async function verifyMeeting(meeting) {
    console.log(`\n🔍 Verifying Supabase persistence for meeting: ${meeting.id} (${meeting.title})...`);

    const { data: dbMeeting, error: mErr } = await supabaseAdmin
        .from('meetings')
        .select('*')
        .eq('id', meeting.id)
        .single();

    if (mErr || !dbMeeting) {
        throw new Error(`Master meeting record ${meeting.id} not found in Supabase! Error: ${mErr?.message}`);
    }

    const expBreakdowns = meeting.breakdowns.length;
    const expParts = meeting.parts.length;
    const expDirectives = meeting.directives.length;
    const expActions = meeting.actionItems.length;

    const [bRes, pRes, dRes, aRes] = await Promise.all([
        supabaseAdmin.from('breakdown_machines').select('id', { count: 'exact' }).eq('meeting_id', meeting.id),
        supabaseAdmin.from('meeting_parts').select('id', { count: 'exact' }).eq('meeting_id', meeting.id),
        supabaseAdmin.from('meeting_directives').select('id', { count: 'exact' }).eq('meeting_id', meeting.id),
        supabaseAdmin.from('meeting_action_items').select('id', { count: 'exact' }).eq('meeting_id', meeting.id)
    ]);

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
    console.log('🚀 Reach International Daily Meeting Supabase Ingestion (12 Nov 2026)');
    console.log('====================================================');

    console.log(`\n📥 Ingesting Meeting: ${meeting12Nov.title} (${meeting12Nov.id})...`);
    const res = await syncDailyMeeting(meeting12Nov);
    console.log(`✅ Successfully synced ${res.meetingId}:`);
    console.log(`   - ${res.counts.breakdowns} breakdown machines`);
    console.log(`   - ${res.counts.parts} parts`);
    console.log(`   - ${res.counts.directives} directives`);
    console.log(`   - ${res.counts.actionItems} action items`);

    await verifyMeeting(meeting12Nov);

    console.log('\n====================================================');
    console.log('🎉 MEETING (12 NOV 2026) SUCCESSFULLY INGESTED & VERIFIED IN SUPABASE!');
    console.log('====================================================');
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
    run().catch(err => {
        console.error('❌ Ingestion or verification failed:', err);
        process.exit(1);
    });
}
