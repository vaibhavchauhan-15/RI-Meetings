/**
 * Reach International Operations - Daily Meeting Sync (18 to 21 Nov 2026)
 *
 * Implements strict Reach International standards:
 * - 100% Cloud-Native ingestion (zero static JSON files in src/data/)
 * - Strictly ONE machine per breakdown card
 * - No duplicate breakdown entries; only new breakdowns added
 * - Concise, single-line informative fields across all sections
 * - Accurate English translation and distillation of raw Hindi meeting transcripts
 * - Direct Supabase ingestion with automated verification check (Step A, B, C)
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { syncDailyMeeting, supabaseAdmin } from './sync-daily-meeting.js';

const __filename = fileURLToPath(import.meta.url);

// ============================================================================
// 1. MEETING: 18-11-2026 (Wednesday) - No Meeting Held
// ============================================================================
export const meeting18Nov = {
    id: "meet-2026-11-18",
    title: "18-11-2026",
    date: "2026-11-18",
    dateFormatted: "18-11-2026",
    focus: "Daily Operations Review – Office Open & Site Operations Active • No Meeting Held",
    isHoliday: false,
    holidayName: "",
    noMeetingHeld: true,
    notRecorded: false,
    breakdowns: [],
    parts: [],
    directives: [],
    actionItems: []
};

// ============================================================================
// 2. MEETING: 19-11-2026 (Thursday)
// ============================================================================
export const meeting19Nov = {
    id: "meet-2026-11-19",
    title: "19-11-2026",
    date: "2026-11-19",
    dateFormatted: "19-11-2026",
    focus: "Mandatory CRM service call opening protocol, Site 143 JCB console welding damage and scissor tank leaks, Bhatinda Z-60 cylinder seal and cable tray snags, BRC and Bina boom lift breakdowns, CG Power 4390 card replacement dispatch, Mundra 45ft boom opposite-side battery bank failure, and Korba 1200SJP recurring starter burnout root cause investigation.",
    isHoliday: false,
    holidayName: "",
    noMeetingHeld: false,
    notRecorded: false,
    breakdowns: [
        {
            site: "Site 143 Project Site (Umesh Kumar & Pardeep Tomar)",
            model: "JCB Access Platform / Boom Lift",
            serialNumber: "Unit JCB-Display-1",
            issue: "Console digital display and horn push button ruined after molten spatter from nearby welding machine fell on operator interface.",
            action: "Pardeep Tomar staging replacement display console and button assembly for site dispatch.",
            logistics: "Console display panel and horn push-button switch dispatched from central stores.",
            clarification: "Welding droplets directly struck the horn button and melted internal touch membrane.",
            pendingIssue: "Receive replacement display console and install on site.",
            status: "Breakdown — Display and horn button melted by welding spatter; replacement console dispatched."
        },
        {
            site: "Site 143 Project Site (Umesh Kumar & Pardeep Tomar)",
            model: "JCB Access Platform / Boom Lift",
            serialNumber: "Unit JCB-Display-2",
            issue: "Operator digital display screen completely blackened out and unresponsive, preventing parameter readout.",
            action: "Umesh Kumar logged breakdown call in CRM for replacement display unit authorization.",
            logistics: "Second JCB digital display unit requested from central inventory.",
            clarification: "Screen blackout prevents operator from verifying tilt alarms, battery status, and height limit.",
            pendingIssue: "Dispatch and install replacement display unit to return machine to service.",
            status: "Breakdown — Display screen completely blackened out; replacement unit requested in CRM."
        },
        {
            site: "Site 143 Project Site (Umesh Kumar & Pardeep Tomar)",
            model: "Genie GS Electric Scissor Lift (Unit 19ft)",
            serialNumber: "Unit GS-Tank-1",
            issue: "Hydraulic oil reservoir tank cracked and actively leaking fluid onto client warehouse floor.",
            action: "Pardeep Tomar sourcing replacement hydraulic oil reservoir tank to replace cracked vessel.",
            logistics: "Replacement hydraulic tank being sourced or fabricated for site dispatch.",
            clarification: "Machine grounded by site safety inspectors due to oil spillage hazard.",
            pendingIssue: "Deliver replacement hydraulic tank and refill system with fresh hydraulic oil.",
            status: "Breakdown — Cracked hydraulic oil tank leaking fluid; machine grounded awaiting new tank."
        },
        {
            site: "Site 143 Project Site (Umesh Kumar & Pardeep Tomar)",
            model: "Genie GS Electric Scissor Lift (Unit 32ft)",
            serialNumber: "Unit GS-Tank-2",
            issue: "Hydraulic brake valve fitting and return hose leaking oil under operating pressure.",
            action: "Umesh Kumar assigning local site mechanic to replace defective O-rings and torque brake valve fittings.",
            logistics: "Hydraulic seal kit and replacement O-rings dispatched to site.",
            clarification: "Machine stopped to prevent total hydraulic pressure loss and floor contamination.",
            pendingIssue: "Fit replacement seals, torque fittings, and verify zero leakage under load.",
            status: "Breakdown — Hydraulic brake valve leaking oil; replacement seals and fittings dispatched."
        },
        {
            site: "Bhatinda Project Site (Satendra Kumar & Durvesh)",
            model: "Genie Z-60/34 Articulating Boom Lift",
            serialNumber: "Unit Z60-Bhatinda-1",
            issue: "Hydraulic elevation cylinder rod seal leaking oil under load during platform elevation.",
            action: "Technician Durvesh deployed inside plant after obtaining client email gate authorization to repack cylinder seals.",
            logistics: "Hydraulic cylinder seal kit and packing consumables delivered to site.",
            clarification: "Client issued formal email permit allowing technician entry for cylinder overhaul.",
            pendingIssue: "Dismantle cylinder rod gland, replace worn packings, and pressure-test elevation.",
            status: "Under Repair — Hydraulic cylinder seal leakage; technician Durvesh inside plant executing overhaul."
        },
        {
            site: "Bhatinda Project Site (Satendra Kumar & Durvesh)",
            model: "Genie Z-60/34 Articulating Boom Lift",
            serialNumber: "Unit Z60-Bhatinda-2",
            issue: "Boom internal cable drag chain tray broken and engine experiencing intermittent starting failure.",
            action: "Technician Durvesh attending to inspect cable tray structural damage and trace starter control wiring.",
            logistics: "Replacement cable drag chain links and starter relay staged for repair.",
            clarification: "Broken cable tray risks severed electrical harnesses and hydraulic hoses during boom telescoping.",
            pendingIssue: "Repair cable drag chain guide and resolve intermittent starter harness defect.",
            status: "Under Repair — Broken cable drag chain tray and starting defect; technician Durvesh assigned."
        },
        {
            site: "BRC Project Site (Satendra Kumar)",
            model: "JLG 660SJ Telescopic Boom Lift",
            serialNumber: "Unit 660-BRC",
            issue: "Machine operational breakdown reported on site halting client construction activity.",
            action: "Satendra Kumar mobilizing service technician to diagnose electrical controls and hydraulic circuits.",
            logistics: "Diagnostic multi-meter and hydraulic pressure gauges staged for site attendance.",
            clarification: "Unit reported down on BRC site; urgent priority due to client escalation.",
            pendingIssue: "Complete on-site troubleshooting to pinpoint defect and log exact part requirement.",
            status: "Breakdown — Machine down at BRC site; technician mobilization underway."
        },
        {
            site: "Bina Project Site (Satendra Kumar & Ram Babu)",
            model: "Genie Telescopic Boom Lift",
            serialNumber: "Unit Boom-Bina",
            issue: "Machine reported broken down and non-operational at Bina project site.",
            action: "Satendra Kumar directing technician Ram Babu to inspect the machine upon concluding current assignments.",
            logistics: "On-site tool kit and spare relays ready for inspection.",
            clarification: "Additional breakdown following recent L&T and VRC handover completions at Bina.",
            pendingIssue: "Perform diagnostic inspection and restore machine operation.",
            status: "Breakdown — Machine reported down at Bina site; technician inspection scheduled."
        },
        {
            site: "CG Power / Sanand Project Site (Satendra Kumar & Deepak)",
            model: "Zoomlion Telescopic Boom Lift",
            serialNumber: "Unit 4390",
            issue: "Machine down since 3rd November; replacement electronic card mismatched version and failed installation.",
            action: "Deepak confirmed local card repair impossible; Satendra Kumar arranging dispatch of defective card to Delhi central workshop.",
            logistics: "Defective control card being packed for courier/train dispatch to Delhi workshop.",
            clarification: "Previously supplied replacement card had mismatched firmware/hardware revision and could not be configured.",
            pendingIssue: "Receive card in Delhi workshop, match exact firmware version, and source replacement unit.",
            status: "Breakdown — Down since 3 Nov; mismatched card version rejected locally and routed to Delhi."
        },
        {
            site: "Mundra Project Site (Chunnilal Patel & Sushil Mishra)",
            model: "Genie Z-45/25 Electric Articulating Boom Lift",
            serialNumber: "Unit 45-Mundra",
            issue: "Secondary battery bank (all 4 batteries on opposite side) failed shortly after primary side batteries were replaced.",
            action: "Chunnilal Patel and technician Sandeep conducting thorough charging voltage and parasitic drain diagnostics.",
            logistics: "Four additional deep-cycle traction batteries requested to complete full bank renewal.",
            clarification: "Machine repeatedly drains batteries; electrical system inspection confirmed supply power is normal.",
            pendingIssue: "Identify parasitic electrical load or charger fault and install 4 replacement batteries.",
            status: "Breakdown — Secondary 4-battery bank failed; charging and parasitic drain investigation underway."
        },
        {
            site: "Mundra Project Site (Chunnilal Patel & Sushil Mishra)",
            model: "Zoomlion Z-34/22N Articulating Boom Lift",
            serialNumber: "Unit Z-34/22-Mundra",
            issue: "Actuating marching travel drive erroneously triggers hydraulic suction and function pump continuously.",
            action: "Sushil Mishra instructed Chunnilal Patel to verify card version compatibility with Unit 30-20 for test swap.",
            logistics: "Compatible controller card version being verified before executing field swap.",
            clarification: "Continuous function pump engagement during travel risks overheating hydraulic fluid and motor burnout.",
            pendingIssue: "Cross-check card version numbers between Unit 30-20 and Unit 34-22 and perform test swap.",
            status: "Breakdown — Card logic defect runs function pump during travel; card compatibility verification underway."
        },
        {
            site: "Mundra Project Site (Chunnilal Patel & Darvinder)",
            model: "JLG 800AJ Telescopic Boom Lift",
            serialNumber: "Unit 800-Mundra",
            issue: "Work platform basket swings and rotates uncommanded automatically since May mechanical intervention.",
            action: "Technician Darvinder recorded operational video and inspected rotary actuator counterbalance valve.",
            logistics: "Rotary actuator seal kit and counterbalance valve assembly staged for replacement.",
            clarification: "Client gave 10-day ultimatum to rectify uncommanded basket rotation or face off-hire penalty.",
            pendingIssue: "Overhaul basket rotary actuator and counterbalance valve to eliminate uncontrolled drift.",
            status: "Running with Issue — Platform basket swinging automatically; rotary actuator overhaul required."
        },
        {
            site: "Korba Project Site (Umesh Kumar, Vinod Pal & Sushil Mishra)",
            model: "JLG 1200SJP Telescopic Boom Lift",
            serialNumber: "Unit 120-Korba",
            issue: "Pressure sensor replaced but machine requires diagnostic laptop; recurrent starter burnout traced to fuel injection pump and injectors.",
            action: "Vinod Pal and Sushil Mishra scheduled complete removal of fuel injection pump and 4 injectors for bench overhaul.",
            logistics: "Temporary backup starter and calibrated fuel injection pump and injectors dispatched to Korba.",
            clarification: "Engine takes excessively long cranking cycles to start, overloading starter motor commutator and burning carbon brushes.",
            pendingIssue: "Obtain diagnostic laptop to clear sensor codes; extract pump and injectors for authorized Bosch bench calibration.",
            status: "Breakdown — Recurring starter burnout traced to fuel injection pump; laptop calibration and pump overhaul planned."
        },
        {
            site: "Jajpur Project Site (Vinod Pal & Umesh Kumar)",
            model: "JLG 1500SJ Telescopic Boom Lift",
            serialNumber: "Unit 150-Jajpur",
            issue: "Machine failed to crank with damaged starter; second starter installed to achieve temporary operation amid heavy cranking.",
            action: "Vinod Pal installed backup starter and recommended preventive fuel injection system calibration before transport.",
            logistics: "Replacement starter sourced locally to keep unit operational.",
            clarification: "Backup starter enabled temporary running, but long cranking indicates underlying injector delivery deficit.",
            pendingIssue: "Monitor cold start performance and prepare fuel injection system servicing upon site release.",
            status: "Operational with Workaround — Backup starter installed; permanent fuel injector overhaul recommended."
        },
        {
            site: "Mundra Project Site (Chunnilal Patel & Pardeep Tomar)",
            model: "Genie GS-4047 Electric Scissor Lift",
            serialNumber: "Unit 4047-Mundra",
            issue: "Machine awaiting 6V traction battery bank; delivery delayed by local transport and distance constraints (80 km).",
            action: "Chunnilal Patel personally dispatched to collect batteries from transport godown and transport to site today.",
            logistics: "Local auto-rickshaw arranged with Rs 250 storage clearance fee to retrieve battery bank.",
            clarification: "Batteries arrived at regional transport hub 80 km away; site collection in progress.",
            pendingIssue: "Transport batteries to site, complete electrical series connections, and verify charging cycle.",
            status: "Awaiting Installation — Traction battery bank arrived at regional hub; transport to site in progress."
        }
    ],
    parts: [
        {
            part: "JCB Operator Digital Display & Horn Push Button",
            context: "Site 143 Project Site (2 Units)",
            statusNextSteps: "Dispatched to replace console burnt by welding spatter."
        },
        {
            part: "Hydraulic Fluid Reservoir Tanks",
            context: "Site 143 Project Site (2 Units)",
            statusNextSteps: "Sourced to replace cracked reservoir and leaking fittings on Genie scissors."
        },
        {
            part: "Genie Z-60 Hydraulic Cylinder Seal Kit",
            context: "Bhatinda Project Site",
            statusNextSteps: "Consumables delivered for technician Durvesh to repack leaking elevation cylinder."
        },
        {
            part: "Boom Cable Drag Chain Links & Guide Tray",
            context: "Bhatinda Project Site",
            statusNextSteps: "Dispatched to rebuild severed drag chain tray on second Z-60 unit."
        },
        {
            part: "Traction Battery Bank (4 Deep-Cycle Batteries)",
            context: "Mundra Project Site (45ft Boom)",
            statusNextSteps: "Four units requested to replace failed secondary opposite-side bank."
        },
        {
            part: "Fuel Injection Pump & 4 Calibrated Injector Nozzles",
            context: "Korba Project Site (JLG 1200SJP)",
            statusNextSteps: "Dispatched for bench overhaul to eliminate excessive cranking and starter burnout."
        }
    ],
    directives: [
        {
            title: "Mandatory CRM Service Call Logging Protocol",
            points: [
                "Every service engineer must open a formal Service Call in CRM prior to performing scheduled machine maintenance.",
                "Restricted CRM service tracking strictly to Reach International owned equipment; cross-rental and client assets excluded.",
                "Maintain local physical service registers recording exact engine hours, service date, and parts replaced for supervisor sign-off."
            ]
        },
        {
            title: "Welding Protection & Electrical Console Safety Standard",
            points: [
                "Mandate protective canvas heat blankets over all access platform control consoles during nearby hot-work welding operations.",
                "Hold site supervisors commercially accountable when operating consoles suffer damage from preventable welding spatter or liquid burns.",
                "Prohibit improvised solvent or adhesive patches on damaged hydraulic tanks; mandate structural welding or certified tank replacement."
            ]
        },
        {
            title: "Equipment Startability & Starter Motor Diagnostic Governance",
            points: [
                "Prohibit repetitive starter motor replacements without diagnosing root cause; investigate extended cranking and fuel system pressure.",
                "Mandate bench testing of diesel fuel injection pumps and injector nozzles whenever machines exhibit prolonged cranking cycles.",
                "Ensure diagnostic laptops with licensed OEM software are routed between active project sites to calibrate replaced electronic sensors."
            ]
        }
    ],
    actionItems: [
        {
            person: "Sushil Mishra",
            task: "Provide approved preventive service filter kits for remaining fleet machines."
        },
        {
            person: "Sushil Mishra",
            task: "Verify controller card version compatibility between Unit 30-20 and Unit 34-22 for test swap."
        },
        {
            person: "Pravesh Yadav",
            task: "Open formal service calls in CRM for all recently completed scheduled maintenance."
        },
        {
            person: "Satendra Kumar",
            task: "Dispatch mismatched Zoomlion 4390 control card from Sanand to Delhi workshop."
        },
        {
            person: "Umesh Kumar",
            task: "Arrange diagnostic laptop dispatch to Korba site for pressure sensor calibration."
        },
        {
            person: "Umesh Kumar",
            task: "Log CRM breakdown complaints and submit parts requisition for all 4 damaged machines at Site 143."
        },
        {
            person: "Umesh Kumar",
            task: "Investigate hydraulic oil tank leakage on grounded Genie scissor lifts at Site 143."
        },
        {
            person: "Umesh Kumar",
            task: "Inspect starter motor circuit on JLG 1200SJP and coordinate root-cause overhaul."
        },
        {
            person: "Chunnilal Patel",
            task: "Collect GS-4047 traction battery bank from regional godown and deliver to site."
        },
        {
            person: "Chunnilal Patel",
            task: "Receive and verify dispatched spare parts at Bhadrak site."
        },
        {
            person: "Vinod Pal",
            task: "Update Jajpur boom lift running status and oversee backup starter performance."
        },
        {
            person: "Vinod Pal",
            task: "Remove fuel injection pump and 4 injectors from Korba 1200SJP for specialized bench overhaul."
        },
        {
            person: "Vinod Pal",
            task: "Coordinate delivery and safe handover of heavy transport plate at Bhadrak."
        },
        {
            person: "Pardeep Tomar",
            task: "Verify availability and dispatch 2 replacement digital displays for Site 143."
        },
        {
            person: "Pardeep Tomar",
            task: "Source and dispatch replacement hydraulic oil reservoir tank for Site 143."
        },
        {
            person: "Pardeep Tomar",
            task: "Arrange specialized repair or certified welding for second leaking hydraulic tank."
        },
        {
            person: "Pardeep Tomar",
            task: "Plan technical site visit with senior mechanic Mantu Sharma to resolve Korba machine permanently."
        }
    ]
};

// ============================================================================
// 3. MEETING: 20-11-2026 (Friday)
// ============================================================================
export const meeting20Nov = {
    id: "meet-2026-11-20",
    title: "20-11-2026",
    date: "2026-11-20",
    dateFormatted: "20-11-2026",
    focus: "Eastern regional severe cyclone and weather alert impact across Haldia and Odisha, Haldia counterweight transport arrival, Pravesh Assam 5A fuse replacement dispatch, Korba starter motor and fuel injection transit logistics, and permanent transition from road courier to direct railway cargo.",
    isHoliday: false,
    holidayName: "",
    noMeetingHeld: false,
    notRecorded: false,
    breakdowns: [], // Zero new breakdowns reported; avoids duplicate machine cards
    parts: [
        {
            part: "5-Ampere Automotive Blade Fuses (Replacement Pack)",
            context: "Fleet Electrical Spares (Pravesh Yadav / Assam Site)",
            statusNextSteps: "Dispatched to replace transit-lost fuses in torn packaging."
        },
        {
            part: "JCB Boom Lift Scheduled Service Filter Kit",
            context: "Central Stores (Pardeep Tomar & Dinesh)",
            statusNextSteps: "Packaged alongside electrical fuses for unified Assam transit."
        },
        {
            part: "Heavy-Duty Replacement Starter Motor Assembly",
            context: "Korba Project Site (JLG 1200SJP)",
            statusNextSteps: "Dispatched via train cargo to provide reliable cranking while fuel pump is prepared."
        },
        {
            part: "Calibrated Diesel Fuel Injection Pump & 4 Injectors",
            context: "Korba Project Site (JLG 1200SJP)",
            statusNextSteps: "Bench calibration completed; en route to Korba site for installation."
        },
        {
            part: "Counterweight Ballast & Mounting Hardware",
            context: "JLG 1500SJ / Fleet Equipment (Haldia Project Site)",
            statusNextSteps: "Arrived via heavy truck transport; unloading underway at site."
        },
        {
            part: "OEM Traction Battery Connector Leads",
            context: "Fleet Battery Spares (Central Warehouse)",
            statusNextSteps: "Direct railway cargo shipment organized to bypass road courier bottlenecks."
        }
    ],
    directives: [
        {
            title: "Severe Weather Safety Protocol & Site Work Governance",
            points: [
                "Enforce strict site work suspension during active cyclone, torrential rain, and gale-force wind warnings across Bengal and Odisha.",
                "Mandate safe mechanical tie-down and lowering of all elevated access equipment platforms during severe inclement weather.",
                "Prioritize technician personnel safety over site production milestones during regional storm alerts in Calcutta, Odisha, and Assam."
            ]
        },
        {
            title: "Logistics Modal Shift from Road Couriers to Railway Express Cargo",
            points: [
                "Permanently terminate reliance on third-party road couriers for heavy, critical, or urgent equipment spare parts.",
                "Mandate direct Indian Railways express parcel leasing for all inter-state technical dispatches to guarantee transit time.",
                "Require physical parcel booking receipts and station delivery tracking numbers to be shared with receiving supervisors immediately."
            ]
        },
        {
            title: "Consumables Packaging & Spare Verification Standard",
            points: [
                "Mandate reinforced tamper-evident plastic containers for small electrical hardware and blade fuses to prevent carton ruptures.",
                "Receiving technicians must inspect parcel integrity and count quantities in presence of delivery personnel prior to signing acceptance.",
                "Combine scheduled preventive maintenance filter packages with pending electrical hardware into single consolidated consignments."
            ]
        }
    ],
    actionItems: [
        {
            person: "Pardeep Tomar",
            task: "Pack and dispatch replacement 5A blade fuses in reinforced tamper-evident packaging for Assam."
        },
        {
            person: "Pardeep Tomar",
            task: "Consolidate Dinesh's JCB boom lift service filter kit into Pravesh's parcel consignment."
        },
        {
            person: "Pardeep Tomar",
            task: "Trace delayed parcel shipments directly with carrier contact Raj and share tracking details."
        },
        {
            person: "Pardeep Tomar",
            task: "Transition all forthcoming inter-state equipment spare dispatches to direct railway parcel cargo."
        },
        {
            person: "Umesh Kumar",
            task: "Coordinate dispatch of heavy-duty backup starter motor for Korba JLG 1200SJP."
        },
        {
            person: "Umesh Kumar",
            task: "Monitor technician Ram Babu's travel completion from Anuppur to Haldia (~150-200 km)."
        },
        {
            person: "Banarasi Yadav",
            task: "Supervise heavy transport unloading of counterweight ballast upon arrival at Haldia."
        },
        {
            person: "Vinod Pal",
            task: "Coordinate with technician Ram Babu for joint deployment to Korba or Haldia once weather clears."
        },
        {
            person: "Pravesh Yadav",
            task: "Inspect incoming replacement fuse package and report confirmation to central stores."
        }
    ]
};

// ============================================================================
// 4. MEETING: 21-11-2026 (Saturday) - No Formal Meeting Held
// ============================================================================
export const meeting21Nov = {
    id: "meet-2026-11-21",
    title: "21-11-2026",
    date: "2026-11-21",
    dateFormatted: "21-11-2026",
    focus: "Daily Operations Review – Office Open & Site Operations Active • No Formal Meeting Held",
    isHoliday: false,
    holidayName: "",
    noMeetingHeld: true,
    notRecorded: false,
    breakdowns: [],
    parts: [],
    directives: [],
    actionItems: []
};

export const allMeetingsNov18To21 = [
    meeting18Nov,
    meeting19Nov,
    meeting20Nov,
    meeting21Nov
];

/**
 * Executes Step A (Direct Supabase Ingestion) and Step B (Verification)
 */
export async function runIngestionAndVerification() {
    console.log(`================================================================`);
    console.log(`REACH INTERNATIONAL - SUPABASE INGESTION & VERIFICATION (18-21 NOV)`);
    console.log(`================================================================\n`);

    const meetingsToSync = [
        { name: "18-Nov-2026 (No Meeting Held)", data: meeting18Nov },
        { name: "19-Nov-2026 (Daily Operational Meeting)", data: meeting19Nov },
        { name: "20-Nov-2026 (Daily Operational Meeting)", data: meeting20Nov },
        { name: "21-Nov-2026 (No Formal Meeting Held)", data: meeting21Nov }
    ];

    const results = [];

    for (const { name, data } of meetingsToSync) {
        console.log(`----------------------------------------------------------------`);
        console.log(`ðŸš€ STEP A: Ingesting ${name} [${data.id}] into Supabase...`);
        console.log(`----------------------------------------------------------------`);

        const syncResult = await syncDailyMeeting(data);
        if (!syncResult || !syncResult.meetingId) {
            throw new Error(`❌ Step A FAILED for ${data.id}: Ingestion returned invalid result`);
        }
        console.log(`✅ Step A Ingestion Successful for ${data.id}`);

        console.log(`\nðŸ”  STEP B: Running Explicit Verification Query for ${data.id}...`);

        // 1. Verify master meeting record
        const { data: meetingRow, error: mErr } = await supabaseAdmin
            .from('meetings')
            .select('*')
            .eq('id', data.id)
            .single();

        if (mErr || !meetingRow) {
            throw new Error(`â Œ Step B FAILED: Master meeting record ${data.id} not found: ${mErr?.message}`);
        }

        // 2. Verify breakdown machines
        const { count: breakdownCount, error: bErr } = await supabaseAdmin
            .from('breakdown_machines')
            .select('*', { count: 'exact', head: true })
            .eq('meeting_id', data.id);

        if (bErr) throw new Error(`â Œ Step B FAILED querying breakdown_machines: ${bErr.message}`);

        // 3. Verify meeting parts
        const { count: partsCount, error: pErr } = await supabaseAdmin
            .from('meeting_parts')
            .select('*', { count: 'exact', head: true })
            .eq('meeting_id', data.id);

        if (pErr) throw new Error(`â Œ Step B FAILED querying meeting_parts: ${pErr.message}`);

        // 4. Verify directives
        const { count: directivesCount, error: dErr } = await supabaseAdmin
            .from('meeting_directives')
            .select('*', { count: 'exact', head: true })
            .eq('meeting_id', data.id);

        if (dErr) throw new Error(`â Œ Step B FAILED querying meeting_directives: ${dErr.message}`);

        // 5. Verify action items
        const { count: actionsCount, error: aErr } = await supabaseAdmin
            .from('meeting_action_items')
            .select('*', { count: 'exact', head: true })
            .eq('meeting_id', data.id);

        if (aErr) throw new Error(`â Œ Step B FAILED querying meeting_action_items: ${aErr.message}`);

        const expectedBreakdowns = data.breakdowns.length;
        const expectedParts = data.parts.length;
        const expectedDirectives = data.directives.length;
        const expectedActions = data.actionItems.length;

        console.log(`  Master Record:  EXISTS (Date: ${meetingRow.date}, Holiday: ${meetingRow.is_holiday}, NoMeeting: ${meetingRow.no_meeting_held})`);
        console.log(`  Breakdowns:     Actual = ${breakdownCount} | Expected = ${expectedBreakdowns} -> ${breakdownCount === expectedBreakdowns ? 'MATCH âœ…' : 'MISMATCH â Œ'}`);
        console.log(`  Parts:          Actual = ${partsCount} | Expected = ${expectedParts} -> ${partsCount === expectedParts ? 'MATCH âœ…' : 'MISMATCH â Œ'}`);
        console.log(`  Directives:     Actual = ${directivesCount} | Expected = ${expectedDirectives} -> ${directivesCount === expectedDirectives ? 'MATCH âœ…' : 'MISMATCH â Œ'}`);
        console.log(`  Action Items:   Actual = ${actionsCount} | Expected = ${expectedActions} -> ${actionsCount === expectedActions ? 'MATCH âœ…' : 'MISMATCH â Œ'}`);

        if (breakdownCount !== expectedBreakdowns || partsCount !== expectedParts ||
            directivesCount !== expectedDirectives || actionsCount !== expectedActions) {
            throw new Error(`â Œ Step B Verification count mismatch for ${data.id}!`);
        }

        console.log(`âœ… VERIFICATION PASSED for ${name}\n`);
        results.push({
            id: data.id,
            date: data.date,
            isHoliday: data.isHoliday,
            noMeetingHeld: data.noMeetingHeld,
            breakdowns: breakdownCount,
            parts: partsCount,
            directives: directivesCount,
            actionItems: actionsCount
        });
    }

    console.log(`================================================================`);
    console.log(`ðŸŽ‰ ALL 4 MEETINGS SUCCESSFULLY INGESTED & VERIFIED IN SUPABASE!`);
    console.log(`================================================================`);
    console.table(results);
    return results;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    runIngestionAndVerification()
        .then(() => {
            console.log('\nPipeline finished successfully.');
            process.exit(0);
        })
        .catch((err) => {
            console.error('\nâ Œ Ingestion pipeline failed:', err);
            process.exit(1);
        });
}
