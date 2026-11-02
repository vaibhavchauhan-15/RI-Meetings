/**
 * Reach International Operations - Daily Meeting Sync (02 Nov 2026)
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

export const meeting02Nov = {
    id: "meet-2026-11-02",
    title: "02-11-2026",
    date: "2026-11-02",
    dateFormatted: "02-11-2026",
    focus: "Bhadrak Units 150/125 pre-dispatch testing and calibration certification, Panipat 11-machine fleet maintenance and JLG 450 engine smoke diagnosis, Mundra joystick theft tagging protocol and 370Ah battery installation, Mumbai severe battery deep discharge crisis and charging cable deployment, rejection of aged March 2024 Trojan batteries, and Jammu AGM battery and wiring harness dispatches.",
    isHoliday: false,
    holidayName: "",
    noMeetingHeld: false,
    notRecorded: false,
    breakdowns: [
        {
            site: "Bhadrak Project Site",
            model: "Genie Z-150",
            serialNumber: "Unit 150",
            issue: "Intermittent basket leveling failure and upper control stalling after hydraulic cylinder seal overhaul.",
            action: "Technician testing basket hydraulic functions while head office arranges client calibration certificate.",
            logistics: "Calibration test certificate being prepared by Das at head office for dispatch with machine.",
            clarification: "Client demanding physical calibration certificate after 4 consecutive days of operational testing.",
            pendingIssue: "Resolve intermittent basket function stalling and procure head office calibration certificate.",
            status: "Under Testing — Cylinder seals completed; basket control troubleshooting and certificate pending."
        },
        {
            site: "Bhadrak Project Site",
            model: "Genie Z-125",
            serialNumber: "Unit 125",
            issue: "Retracting outriggers triggers sensor threshold overload fault, disabling boom and basket functions needed for trailer loading.",
            action: "Vishnu fitted new limit switch, but sensor requires diagnostic laptop calibration to clear fault.",
            logistics: "Diagnostic laptop requisitioned from Gujarat depot for sensor force calibration.",
            clarification: "Unit cannot fit on transport trailer with outriggers extended, while retracting locks functions.",
            pendingIssue: "Receive diagnostic laptop from Gujarat to recalibrate outrigger sensor threshold.",
            status: "Trailer Loading Blocked — Outrigger retracted sensor fault locks functions; diagnostic laptop awaited."
        },
        {
            site: "Field Operations (Imran Khan)",
            model: "Telescopic Boom Lift",
            serialNumber: "300190796",
            issue: "Hydraulic lift cylinder seal failure causing hydraulic fluid leakage during elevation cycles.",
            action: "Imran Khan submitted video diagnostics and serial number to Pardeep Tomar for emergency seal order.",
            logistics: "Cylinder seal overhaul kit being dispatched from central inventory to site.",
            clarification: "Imran logging breakdown complaint in Google Sheets to formally trigger spares dispatch.",
            pendingIssue: "Expedite seal kit dispatch and install on hydraulic lift cylinder.",
            status: "Spares Requisitioned — Cylinder seal kit ordered; Google Sheets complaint logged."
        },
        {
            site: "Guwahati (Assam) Project Site",
            model: "Genie S-135",
            serialNumber: "Unit 135",
            issue: "Machine grounded since 24th September due to exhausted and dead traction battery bank.",
            action: "Subhash Kumar Singh coordinating immediate battery collection from Guwahati transport hub today.",
            logistics: "Traction battery pack arriving at Guwahati cargo hub today for express road transport to site.",
            clarification: "Courier delay prolonged machine downtime to 8 days; technician arranged local pickup from Guwahati.",
            pendingIssue: "Collect battery bank from Guwahati cargo hub, transport 300km to site, and install.",
            status: "Grounded Since Sep 24 — Replacement batteries reaching Guwahati transport hub today."
        },
        {
            site: "Bhiwadi Project Site",
            model: "Amram 510 Telehandler",
            serialNumber: "Unit 510",
            issue: "Hydraulic pressure hose burst during operations, causing total hydraulic fluid discharge.",
            action: "Umesh Kumar fabricated replacement hydraulic hose locally; preparing for fitment and fluid top-up.",
            logistics: "Hydraulic hose crimped locally; hydraulic oil allocated for system replenishment.",
            clarification: "Hose fabrication completed; oil refill and pressure testing required before resuming operations.",
            pendingIssue: "Install crimped hose, top up hydraulic oil, and conduct leak-free pressure testing.",
            status: "Under Assembly — Replacement hose fabricated; installation and fluid top-up underway."
        },
        {
            site: "Bhiwadi Project Site",
            model: "Zoomlion 1410 Scissor Lift",
            serialNumber: "ZL-1410",
            issue: "Malfunctioning electronic controller card causing complete scissor lift function failure.",
            action: "Pardeep Tomar dispatched tested replacement controller; Rambabu scheduled installation upon arrival.",
            logistics: "Tested replacement controller card dispatched from central stock to Bhiwadi site today.",
            clarification: "Rambabu noted diagnostic laptop may be required for calibration if plug-and-play fails.",
            pendingIssue: "Install incoming replacement controller card and verify lift and drive functions.",
            status: "Spares in Transit — Replacement controller card dispatched; site delivery expected today."
        },
        {
            site: "Jammu Project Site",
            model: "Genie GS-4047 Electric Scissor Lift",
            serialNumber: "Unit 4047",
            issue: "Trojan battery pack failed with degraded specific gravity (1120-1250) and terminal damage.",
            action: "Sushil Mishra and Pardeep Tomar dispatching maintenance-free AGM batteries along with matching charger.",
            logistics: "Maintenance-free AGM battery bank and dedicated charger dispatched to Jammu site.",
            clarification: "Defective Trojan batteries to be retrieved and submitted for OEM warranty replacement claim.",
            pendingIssue: "Deliver AGM batteries with charger, install on machine, and initiate warranty claim on Trojan pack.",
            status: "Awaiting AGM Batteries — AGM battery pack and charger dispatched; Trojan warranty claim pending."
        },
        {
            site: "Jammu Project Site",
            model: "Genie S-125 Boom Lift",
            serialNumber: "Unit S-125-JMU",
            issue: "Electrical wiring harness burned out, disabling control console communications and safety interlocks.",
            action: "Durgesh booked on evening train ticket to Jammu to execute complete wiring harness replacement.",
            logistics: "Durgesh traveling to Jammu site today with replacement wiring harness assembly and tools.",
            clarification: "Praveen unavailable due to engine gasket crisis at Panipat; Durgesh deployed exclusively.",
            pendingIssue: "Durgesh to arrive at Jammu site, rewire electrical harness, and test safety circuits.",
            status: "Technician in Transit — Durgesh dispatched with travel ticket to rewire burnt electrical harness."
        },
        {
            site: "Bangalore Project Site",
            model: "2-Ton Electric Forklift (MHE)",
            serialNumber: "MH 2T-BLR",
            issue: "Material handling attachment clamp malfunctioning and failing to close fully around loads.",
            action: "Local Bangalore service engineer assigned to inspect clamp hydraulic cylinder seals and valve manifold.",
            logistics: "Hydraulic clamp seal kit and check valve staged for dispatch if on-site overhaul is required.",
            clarification: "Clamp closure failure halts warehouse stacking; suspected relief valve pressure bypass.",
            pendingIssue: "Complete hydraulic valve inspection and restore full clamping force on attachment.",
            status: "Breakdown — Attachment clamp failing to close; hydraulic valve inspection scheduled."
        },
        {
            site: "Bhiwadi Project Site",
            model: "MHE Fleet Equipment",
            serialNumber: "Bhiwadi AI-Unit",
            issue: "AI safety proximity camera triggering false obstacle alarms alongside minor hydraulic line weeping.",
            action: "Site technician tightening hydraulic fittings and rebooting AI telemetry camera system.",
            logistics: "Updated camera calibration firmware patch requested from technical vendor.",
            clarification: "Hydraulic line weep addressed on site; AI false alarm requires firmware sensitivity reset.",
            pendingIssue: "Complete AI camera recalibration and conduct operational load run without alarms.",
            status: "Under Maintenance — Minor hydraulic weeping tightened; AI camera sensor reset in progress."
        },
        {
            site: "Guwahati (Assam) Project Site",
            model: "2-Ton BX Model Forklift",
            serialNumber: "BX 2T-Guwahati",
            issue: "Brake oil top-up and filter replacement pending; client reported missing consignment.",
            action: "Shiv Uniyal shared courier proof-of-delivery confirming receipt by client representative Damru Patra.",
            logistics: "Brake oil and filter consignment delivered to Damru Patra via express surface cargo.",
            clarification: "Courier delivery confirmation shared; technician to locate parcel with Damru Patra on site.",
            pendingIssue: "Coordinate with Damru Patra to retrieve parcel and service braking system and filters.",
            status: "Delivery Verified — Consignment confirmed delivered on site; handover to technician pending."
        },
        {
            site: "Panipat Project Site",
            model: "JLG 450AJ Articulating Boom Lift",
            serialNumber: "Unit 450",
            issue: "Engine emitting heavy exhaust smoke during operation due to suspected cylinder head gasket failure.",
            action: "Praveen on site diagnosing cylinder compression, head gasket integrity, and fuel injection system.",
            logistics: "Engine cylinder head overhaul gasket kit kept on standby at Delhi central warehouse.",
            clarification: "Machine halted immediately to prevent severe engine overheating and piston seizure.",
            pendingIssue: "Conclude head gasket diagnostic and replace gasket if compression leak is confirmed.",
            status: "Under Diagnostic — Praveen inspecting engine cylinder head gasket to resolve heavy smoke."
        },
        {
            site: "Panipat Project Site",
            model: "Genie Z-60 Boom Lift",
            serialNumber: "Unit Z-60-Panipat",
            issue: "Telescopic boom cable tray damaged with internal cabling severed, preventing boom extension.",
            action: "Satendra Kumar submitted formal security entry approval email to client management for site clearance.",
            logistics: "Replacement cable tray assembly requisitioned from central stores for installation.",
            clarification: "Client security entry email pending approval; repair will commence immediately upon gate clearance.",
            pendingIssue: "Obtain client security entry approval email and replace damaged cable tray.",
            status: "Awaiting Gate Pass — Security approval email submitted; cable tray repair pending site entry."
        },
        {
            site: "Mundra Project Site",
            model: "JCB 45 Boom Lift",
            serialNumber: "Unit JCB-45",
            issue: "Traction battery bank exhausted; unit operational on borrowed batteries cannibalized from secondary machine.",
            action: "Sushil Mishra and Pritam Chand planning installation of four 370Ah buffer batteries located on site.",
            logistics: "Four 370Ah buffer batteries available in Mundra yard to be installed on donor machine.",
            clarification: "Unit JCB-45 has heavy work priority; secondary machine will run temporarily on 370Ah buffer pack.",
            pendingIssue: "Fit four 370Ah buffer batteries onto secondary machine to eliminate machine downtime.",
            status: "Operational via Borrowed Pack — Secondary machine grounded; 370Ah buffer pack installation pending."
        },
        {
            site: "Mundra Project Site",
            model: "JCB 4550 Boom Lift",
            serialNumber: "Unit 4550",
            issue: "Upper control box and joystick console stolen overnight from two machines parked on site.",
            action: "Chunni Lal and Lalit branding all site joysticks with yellow paint and permanent 'Reach International' text.",
            logistics: "Yellow industrial paint marker pens dispatched to site for identification marking on all joysticks.",
            clarification: "Suspected unauthorized removal by contractor operators; recovery and security tagging initiated.",
            pendingIssue: "Engrave serial numbers and company branding on all joysticks and submit photo verification.",
            status: "Theft Investigation & Tagging — Security tagging with yellow paint and company branding underway."
        },
        {
            site: "Mumbai Project Site",
            model: "JCB S1932E Electric Scissor Lift",
            serialNumber: "Unit 1932",
            issue: "Traction battery pack collapsed to 3.5V-4.0V under load due to continuous deep discharge below 20%.",
            action: "Manish Patel and Jitendra Budhauliya raising warranty claim for four 6V flooded lead-acid batteries.",
            logistics: "Four replacement traction batteries requisitioned under OEM warranty claim.",
            clarification: "Client failed to provide charging cables; operators repeatedly ran machine down to 0% depletion.",
            pendingIssue: "Submit warranty claim documentation and provide heavy-duty extension charging cable to site.",
            status: "Severe Deep Discharge — 4-battery bank ruined at 3.5V; warranty claim and extension cable pending."
        },
        {
            site: "Mumbai Project Site",
            model: "Genie GS-1930 Scissor Lift",
            serialNumber: "Unit 1930-1",
            issue: "Battery completely depleted as machine was stranded over 50 meters away from available power sockets.",
            action: "Sandeep and Manish Patel procuring 50-meter heavy-gauge industrial extension cables for site charging.",
            logistics: "Heavy-duty 50-meter charging cable sourced locally to bridge distance to main distribution board.",
            clarification: "Client refused to provide extension power lines; dedicated cable required to prevent deep discharge.",
            pendingIssue: "Deploy 50-meter extension cable and conduct full overnight recharge cycle.",
            status: "Discharged — Awaiting heavy-duty extension cable connection to reach distant power socket."
        },
        {
            site: "Mumbai Project Site",
            model: "Genie GS-1930 Scissor Lift",
            serialNumber: "Unit 1930-2",
            issue: "Machine grounded on site due to missing joystick controller box and depleted battery bank.",
            action: "Pramod and Sandeep demanding return of missing joystick from site contractor while tracing courier delivery.",
            logistics: "Inter Cargo consignment receipt being verified for replacement joystick dispatched earlier.",
            clarification: "Site workers notified that equipment operation remains shut down until joystick is returned or replaced.",
            pendingIssue: "Trace Inter Cargo courier delivery or retrieve original joystick controller on site.",
            status: "Grounded — Missing joystick controller; courier tracking and site retrieval in progress."
        },
        {
            site: "Mundra Project Site",
            model: "Genie Z-34/22 Articulating Boom Lift",
            serialNumber: "Unit Z-34",
            issue: "Intermittent boom elevation and slewing function failure caused by malfunctioning electronic control card.",
            action: "Site technician removed electronic control card for bench testing and soldering check at local lab.",
            logistics: "Electronic control card hand-carried to local electronics testing facility.",
            clarification: "Diagnostic bench test will establish if card can be repaired or requires complete replacement.",
            pendingIssue: "Complete bench test of control card, repair dry solder joints, and reinstall on unit.",
            status: "Card Diagnostic — Control card removed for bench testing and electronic circuit diagnosis."
        },
        {
            site: "Assam Project Site",
            model: "Genie S-125 Boom Lift",
            serialNumber: "Unit S-125-Assam",
            issue: "Boom length and elevation limit switch failing, causing safety system function cutouts during extension.",
            action: "Subhash Kumar Singh ordered OEM limit switch while keeping machine operating under monitored safety protocol.",
            logistics: "Replacement OEM limit switch ordered from central spares inventory for dispatch to Assam.",
            clarification: "Machine operating safely under monitored protocol, but permanent limit switch needed urgently.",
            pendingIssue: "Expedite dispatch and delivery of OEM limit switch to Assam project site.",
            status: "Working on Bypass — Operating safely under monitored bypass; OEM limit switch in transit."
        },
        {
            site: "Cadila Project Site",
            model: "JLG E450AJ Electric Boom Lift",
            serialNumber: "Unit E450-Cadila",
            issue: "Wiring harness card signal fault causing intermittent communication dropouts to platform console.",
            action: "Site electrician inspecting platform harness terminal pins and cleaning connector contacts.",
            logistics: "Replacement harness terminal pin connectors dispatched from Ahmedabad depot.",
            clarification: "Harness card connections temporarily stabilized; permanent re-pinning scheduled today.",
            pendingIssue: "Complete terminal pin re-crimping on platform wiring harness connector.",
            status: "Operational — Harness card connections stabilized; permanent connector re-pinning pending."
        },
        {
            site: "Bina Project Site",
            model: "JLG 600AJ Boom Lift",
            serialNumber: "Unit 600AJ",
            issue: "Wheel drive hydraulic motor leak repaired; foam-filled tire mounting and hub torquing pending.",
            action: "Rambabu completed wheel motor resealing; site team mounting replacement tire assembly today.",
            logistics: "Replacement foam-filled tire assembly delivered to Bina site.",
            clarification: "Hydraulic motor reseal successful; final wheel mounting and torque check required for handover.",
            pendingIssue: "Mount replacement tire, torque wheel hub bolts to specification, and complete drive trial.",
            status: "Final Reassembly — Wheel motor leak fixed; tire mounting and torque verification in progress."
        }
    ],
    parts: [
        {
            part: "Four 6V Trojan Deep Cycle Traction Batteries",
            context: "Central Depot / JCB Fleet",
            statusNextSteps: "Batch rejected due to cell failure (1120-1250 SG, 5.9V) and March 2024 vintage; formal rejection report and fresh 2026 stock claim initiated."
        },
        {
            part: "Maintenance-Free AGM Battery Bank & Dedicated Charger",
            context: "Jammu Project Site (Genie GS-4047)",
            statusNextSteps: "Dispatched to Jammu site to replace defective flooded batteries; old batteries to be returned for warranty claim."
        },
        {
            part: "Electronic Controller Logic Card",
            context: "Bhiwadi Project Site (Zoomlion 1410)",
            statusNextSteps: "Tested replacement card dispatched from central inventory; delivery expected today for site installation."
        },
        {
            part: "Hydraulic Lift Cylinder Seal Overhaul Kit",
            context: "Field Operations (Boom Lift Serial 300190796)",
            statusNextSteps: "Emergency seal kit ordered from central spares following video inspection; complaint logged in Google Sheets."
        },
        {
            part: "Main Boom Electrical Wiring Harness",
            context: "Jammu Project Site (Genie S-125)",
            statusNextSteps: "Durgesh traveling to Jammu today with replacement harness to repair burned-out electrical circuit."
        },
        {
            part: "50-Meter Heavy-Gauge Industrial Extension Charging Cables",
            context: "Mumbai Project Site (Fleet Charging Logistics)",
            statusNextSteps: "Procuring 50-meter heavy-duty cable to connect machines situated far from permanent power distribution boards."
        },
        {
            part: "Brake Oil & Oil Filter Consignment",
            context: "Guwahati Project Site (BX 2-Ton Forklift)",
            statusNextSteps: "Delivery proof verified with client contact Damru Patra; technician retrieving consignment for brake maintenance."
        },
        {
            part: "Diagnostic Service Laptop with OEM Software",
            context: "Gujarat Depot to Bhadrak / Haldia Sites",
            statusNextSteps: "Requisitioned from Gujarat depot to calibrate Genie 125 outrigger retracted sensor force threshold."
        },
        {
            part: "Cylinder Head Overhaul Gasket Kit",
            context: "Panipat Project Site (JLG 450AJ)",
            statusNextSteps: "Overhaul gasket kit staged at Delhi depot for immediate dispatch upon confirmation of head gasket blown seal."
        },
        {
            part: "Replacement Telescopic Boom Cable Tray Assembly",
            context: "Panipat Project Site (Genie Z-60)",
            statusNextSteps: "Requisitioned from central stores; installation pending client security gate clearance email approval."
        }
    ],
    directives: [
        {
            title: "Strict Deep Discharge Prevention & Battery Protection Policy",
            points: [
                "No electric machine or battery pack may be operated below 20% residual charge under any circumstances.",
                "Operating batteries into deep discharge permanently destroys cell chemistry, voids OEM warranties, and ruins battery life.",
                "Site technicians must conduct daily charging rounds, verify voltage under load, and train client operators on recharge schedules.",
                "Where permanent power sockets are distant, site teams must procure and deploy dedicated 50-meter heavy-gauge industrial cables."
            ]
        },
        {
            title: "Anti-Theft Marking, Security Locker & Component Accountability Protocol",
            points: [
                "All upper control boxes and joysticks across all sites must be immediately tagged with yellow industrial paint and 'Reach International' branding.",
                "Every joystick must have its unique equipment serial number painted and photographed for central inventory records.",
                "Site supervisors must arrange dedicated locked on-site storage lockers for removable controllers during off-shift hours.",
                "Handing over or borrowing equipment components between rival contractor operators is strictly prohibited and subject to termination."
            ]
        },
        {
            title: "Vendor Battery Quality Rejection & Warranty Documentation Standard",
            points: [
                "All incoming battery consignments must undergo immediate specific gravity testing, terminal inspection, and date code verification upon arrival.",
                "The four 6V Trojan batteries manufactured in March 2024 are rejected immediately due to aged cell degradation and terminal damage.",
                "Dinesh to draft a formal technical rejection report backed by voltage and hydrometer readings to demand fresh 2026 manufactured stock.",
                "Return-to-vendor (RTV) and warranty replacement procedures must be tracked rigorously in Google Sheets with courier receipts."
            ]
        },
        {
            title: "Single Site Technician Accountability & Overtime Tracking",
            points: [
                "Fleet sites with 10 to 11 machines are allocated strictly one full-time technician responsible for total maintenance and charging upkeep.",
                "Technicians must manage end-to-end charging, cleaning, defect logging, and gate pass coordination within standard 10–11 hour daily shifts.",
                "Any site reporting chronic machine discharge due to technician negligence or unmonitored shifts will face management salary deductions."
            ]
        }
    ],
    actionItems: [
        {
            person: "Jitendra Budhauliya",
            task: "Coordinate with head office (Das) to issue calibration certificate for Unit 150 before Haldia client dispatch."
        },
        {
            person: "Vinod Pal",
            task: "Conduct comprehensive operational load test on Unit 150 and finalize trailer transport schedule for Haldia."
        },
        {
            person: "Imran Khan",
            task: "Log cylinder seal complaint for machine serial 300190796 into Google Sheets and track dispatch of seal kit."
        },
        {
            person: "Subhash Kumar Singh",
            task: "Coordinate pickup of Genie 135 traction batteries from Guwahati cargo hub and arrange 300km road transit to site."
        },
        {
            person: "Pardeep Tomar",
            task: "Dispatch AGM battery pack with charger to Jammu, and ship replacement controller card for Bhiwadi Zoomlion 1410."
        },
        {
            person: "Sushil Mishra",
            task: "File formal warranty replacement claim for defective Trojan 6V batteries and install four 370Ah buffer batteries in Mundra."
        },
        {
            person: "Shiv Uniyal",
            task: "Share courier delivery proof of brake oil and filters with Damru Patra and Guwahati site technician."
        },
        {
            person: "Satendra Kumar",
            task: "Compile and submit complete equipment list of 11 machines at Panipat and follow up on cable tray gate pass email."
        },
        {
            person: "Praveen",
            task: "Inspect cylinder head gasket and injection system on Panipat JLG 450AJ to determine root cause of engine smoke."
        },
        {
            person: "Durgesh",
            task: "Travel to Jammu site on evening train with replacement wiring harness and execute full rewire of Genie S-125."
        },
        {
            person: "Chunni Lal & Lalit",
            task: "Tag all Mundra joysticks with yellow paint, write Reach International and serial numbers, and submit photographic proof."
        },
        {
            person: "Manish Patel & Sandeep",
            task: "Deploy 50-meter extension cables for Mumbai scissor lifts, prevent discharge below 20%, and file JCB 1932 warranty report."
        }
    ]
};

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
    console.log('🚀 Reach International Daily Meeting Supabase Ingestion (02 Nov 2026)');
    console.log('====================================================');

    console.log('\n📥 Ingesting Meeting: 02-11-2026...');
    const res = await syncDailyMeeting(meeting02Nov);
    console.log(`✅ Successfully synced ${res.meetingId}:`);
    console.log(`   - ${res.counts.breakdowns} breakdown machines`);
    console.log(`   - ${res.counts.parts} parts`);
    console.log(`   - ${res.counts.directives} directives`);
    console.log(`   - ${res.counts.actionItems} action items`);
    await verifyMeeting(meeting02Nov);

    console.log('\n====================================================');
    console.log('🎉 MEETING 02-NOV-2026 SUCCESSFULLY INGESTED & VERIFIED IN SUPABASE!');
    console.log('====================================================');
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
    run().catch(err => {
        console.error('❌ Ingestion or verification failed:', err);
        process.exit(1);
    });
}
