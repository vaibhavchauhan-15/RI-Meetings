/**
 * Reach International Operations - Daily Meeting Sync (14 to 17 Nov 2026)
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
// 1. MEETING: 14-11-2026 (Saturday)
// ============================================================================
export const meeting14Nov = {
    id: "meet-2026-11-14",
    title: "14-11-2026",
    date: "2026-11-14",
    dateFormatted: "14-11-2026",
    focus: "Mundra battery stock allocation and chronic Z-34 control card failure, Jaisalmer 660SJ suspension cylinder bolt recurrent shearing, Jammu SX-125 engine overheating diagnostics, Bhadrak basket function failure on SX-125, Saint-Gobain Bhiwadi forklift control valve seal leakages, and CRM stale complaint cleanup.",
    isHoliday: false,
    holidayName: "",
    noMeetingHeld: false,
    notRecorded: false,
    breakdowns: [
        {
            site: "Mundra Project Site (Chunnilal Patel & Pardeep Tomar)",
            model: "Zoomlion Z-30/20 Telescopic Boom Lift",
            serialNumber: "Unit 30-20",
            issue: "Old electronic control card failed repeatedly after 12 prior repairs; replacement card installed.",
            action: "Chunnilal Patel fitted new card from stores into Unit 30-20 and dispatched old failed card to Delhi central workshop.",
            logistics: "Failed control card dispatched to Pardeep Tomar at Delhi workshop for vendor review.",
            clarification: "Unit 30-20 was successfully revived using new card; machine is running.",
            pendingIssue: "Verify new card operation on site and track receipt of old card at Delhi.",
            status: "Resolved / Operational — New card installed and machine returned to duty; old card sent to Delhi."
        },
        {
            site: "Mundra Project Site (Chunnilal Patel & Sushil Mishra)",
            model: "Zoomlion Z-34/22N Articulating Boom Lift",
            serialNumber: "Unit Z-5 / 4725",
            issue: "Electronic controller card failure since 25th October with vendor repeatedly postponing promised repair.",
            action: "Dhruv Sharma instructed procurement to cancel further repair attempts and place order for a brand new OEM card.",
            logistics: "New replacement card order to be issued immediately to avoid recurring downtime.",
            clarification: "Same repaired card has failed repeatedly after 12 previous repair attempts at local Mundra vendor.",
            pendingIssue: "Place formal purchase order for new OEM card and coordinate vendor follow-up through Jitendra.",
            status: "Breakdown — Down since 25 Oct due to chronic controller card failure; ordering new card."
        },
        {
            site: "Mundra Project Site (Chunnilal Patel)",
            model: "JLG 860SJ Telescopic Boom Lift",
            serialNumber: "Unit 860-Mill",
            issue: "High pressure diesel fuel pipe ruptured and leaking while operating in the mill.",
            action: "Chunnilal Patel isolated the engine and requested urgent email authorization for diesel line procurement.",
            logistics: "Replacement diesel high-pressure fuel line sourced locally or dispatched from stores.",
            clarification: "Engine scheduled for complete overhaul; fuel line repair is immediate temporary prerequisite.",
            pendingIssue: "Procure and fit replacement diesel line to restore mill operations.",
            status: "Breakdown — Ruptured diesel fuel pipe; line replacement in progress."
        },
        {
            site: "Mundra Project Site (Chunnilal Patel)",
            model: "Articulating Boom Lift (Auxiliary Motor)",
            serialNumber: "Unit Emergency-Motor",
            issue: "Auxiliary emergency hydraulic descent motor inoperative during safety inspection.",
            action: "Chunnilal Patel dispatched technicians Sandeep and Darvinder to test emergency motor circuitry and relay.",
            logistics: "Auxiliary motor brush set and relay staged on site.",
            clarification: "Emergency descent motor failure prevents emergency lowering if primary engine fails.",
            pendingIssue: "Repair emergency motor electrical circuit and verify ground descent operation.",
            status: "Under Repair — Auxiliary emergency descent motor failure; technicians Sandeep and Darvinder assigned."
        },
        {
            site: "Mundra Project Site (Chunnilal Patel & Pardeep Tomar)",
            model: "Genie GS-4047 Electric Scissor Lift",
            serialNumber: "Unit 4047-Mundra",
            issue: "Battery bank depleted; 6 deep-cycle traction batteries required to restore machine duty.",
            action: "Two batteries sent for bench desulfation/repair returning in 1-2 hours; remaining bank being verified with AGM charger.",
            logistics: "Pardeep Tomar verifying stock of AGM chargers and battery availability for dispatch.",
            clarification: "Charger photo shared to confirm correct AGM algorithm before connecting refurbished batteries.",
            pendingIssue: "Receive repaired batteries, complete bank connection, and record hydrometer readings.",
            status: "Maintenance — Two batteries in repair returning within two hours; battery bank restoration underway."
        },
        {
            site: "Mundra Project Site (Chunnilal Patel & Sushil Mishra)",
            model: "Cross-Rental Articulating Boom Lift",
            serialNumber: "Unit Cross-Rental-Mundra",
            issue: "Client demanding urgent replacement traction battery bank for cross-rented boom lift.",
            action: "Sushil Mishra and Vishal taking vendor on three-way conference call to resolve warranty battery dispute.",
            logistics: "Replacement battery bank pending commercial clearance with supplier.",
            clarification: "Client previously released another machine for Reach International unit and is aggressively demanding resolution.",
            pendingIssue: "Conclude tripartite conference call with vendor and client to authorize battery replacement.",
            status: "Pending Commercial Clearance — Client dispute over battery replacement; vendor conference scheduled."
        },
        {
            site: "Rajasthan / Jaisalmer Project Site (Umesh Kumar & Sushil Mishra)",
            model: "JLG 660SJ Telescopic Boom Lift",
            serialNumber: "125148",
            issue: "Suspension oscillating axle cylinder mounting bolts sheared and snapped repeatedly after replacement.",
            action: "Dhruv Sharma instructed technical team to connect mechanic on conference call with operator to inspect structural alignment and safety hazards.",
            logistics: "High-tensile Grade 10.9/12.9 suspension bolts and torque wrench dispatched to site.",
            clarification: "Bolts sheared twice within 48 hours; structural misalignment or excessive hydraulic relief pressure suspected.",
            pendingIssue: "Mechanic to inspect axle oscillating pivot geometry and torque high-grade bolts correctly.",
            status: "Breakdown — Recurrent suspension cylinder bolt shearing; mechanic conference and structural inspection underway."
        },
        {
            site: "Jammu Project Site (Umesh Kumar & Pravin)",
            model: "JLG 1200SJP Telescopic Boom Lift",
            serialNumber: "Unit 1200SJP-Jammu",
            issue: "Engine running continuously but overheating; upper platform control console unable to start/stop engine.",
            action: "Technician Pravin deployed on site to test upper control console harness and inspect engine cooling system.",
            logistics: "Engine oil filters, coolant, and console starter relay supplied on site.",
            clarification: "Operator forced to start machine from ground console; starter motor was previously replaced.",
            pendingIssue: "Receive service photos, verify radiator water jacket and thermostat, and repair upper start circuit.",
            status: "Under Repair — Engine overheating and upper start defect; technician Pravin investigating."
        },
        {
            site: "Bhadrak Project Site (Vinay Singh & Vinod Pal)",
            model: "Genie SX-125 Telescopic Boom Lift",
            serialNumber: "Unit SX-125-Bhadrak",
            issue: "Boom upper basket functions completely unresponsive after site unloading on Saturday.",
            action: "Vinay Singh planning dispatch of technician Vinod Pal with diagnostic laptop after completing Unit 150 at Haldia.",
            logistics: "OEM diagnostic calibration software and service laptop required for machine commissioning.",
            clarification: "Ground transport completed and machine unloaded; electronic interlock/outrigger leveling preventing platform enablement.",
            pendingIssue: "Service engineer with laptop to clear interlock fault codes and calibrate platform controls.",
            status: "Breakdown — Platform controls dead post-unloading; diagnostic engineer and laptop dispatch planned."
        },
        {
            site: "Korba Project Site (Umesh Kumar & Sushil Mishra)",
            model: "JLG 1200SJP Telescopic Boom Lift",
            serialNumber: "Unit 120-Korba",
            issue: "Machine non-operational and parked; technician attendance pending.",
            action: "Technician Anil Rai scheduled to travel to Korba on Monday for comprehensive repairs.",
            logistics: "Travel ticketing and parts staging coordinated through central admin.",
            clarification: "Site entry prohibited on weekend; site access scheduled for Monday morning.",
            pendingIssue: "Finalize travel booking for Anil Rai and enter site on Monday.",
            status: "Breakdown — Machine parked; technician Anil Rai scheduled for site arrival on Monday."
        },
        {
            site: "Central Workshop / Fleet Yard (Vaibhav Chauhan & Pardeep Tomar)",
            model: "JLG 3246ES Electric Scissor Lift",
            serialNumber: "B2000011847",
            issue: "Steering cylinder mounting bolt sheared, battery service pending, cleaning/painting required, and four wheel hubs leaking oil.",
            action: "Pardeep Tomar received fabricated battery boxes; workshop technicians assigned to mount boxes, replace steering bolt, and seal wheel hubs.",
            logistics: "Fabricated battery containment boxes delivered to yard; wheel hub seals in inventory.",
            clarification: "Machine undergoing comprehensive overhaul in central yard before next field deployment.",
            pendingIssue: "Install battery containment boxes, torque new steering cylinder bolt, and repack hub oil seals.",
            status: "Under Overhaul — Multiple mechanical and hydraulic hub leakages; battery boxes arrived and mounting underway."
        },
        {
            site: "Sanand Project Site (Vaibhav Chauhan & Sushil Mishra)",
            model: "Hyundai 50D-9S Heavy Diesel Forklift",
            serialNumber: "935",
            issue: "Hydraulic oil leakage detected and transmission overhaul required; machine currently running with reduced capability.",
            action: "Operations decided to swap machine with operational unit from Bijnor site and send Unit 935 to central workshop for transmission rebuild.",
            logistics: "Heavy flatbed trailer coordination required for Bijnor-Sanand equipment swap.",
            clarification: "Unit is operational on site for light duties but requires complete transmission rebuild in controlled workshop.",
            pendingIssue: "Update CRM status to 'Running with Issue' and schedule transport from Bijnor.",
            status: "Running with Issue — Hydraulic leakage and pending transmission overhaul; scheduled for workshop swap."
        },
        {
            site: "Central Workshop / Fleet Yard (Vaibhav Chauhan & Shiv Uniyal)",
            model: "Genie GS-1930 Electric Scissor Lift",
            serialNumber: "Unit GS-1930-Yard",
            issue: "Electric drive motor seal worn out, G-CON box damaged, pump motor and hydraulic hoses requiring overhaul.",
            action: "Technician Sitaram dismantled drive motor and submitted sample seal; imported parts and G-CON arrived from China.",
            logistics: "Imported spares and G-CON control board received at yard; sample drive motor seal sent for local matching.",
            clarification: "Spares shipment cleared customs; only drive motor shaft oil seal remains to be procured locally.",
            pendingIssue: "Procure matched drive motor oil seal and begin reassembly of hydraulic pump and G-CON board.",
            status: "Under Overhaul — Major imported assemblies received; drive motor seal matching in progress."
        },
        {
            site: "Greater Noida Project Site (Vaibhav Chauhan & Rahul Kumar)",
            model: "Crown RR160H Electric Reach Truck",
            serialNumber: "7197736",
            issue: "Traction battery bank depleted and failing to sustain operating shifts.",
            action: "New replacement traction battery bank ordered; dispatch scheduled for site delivery by tomorrow.",
            logistics: "High-capacity traction battery bank ordered from vendor for direct Greater Noida dispatch.",
            clarification: "Machine critical for client warehouse stacking operations.",
            pendingIssue: "Receive new battery bank on site tomorrow, install, and execute load discharge test.",
            status: "Breakdown — Battery bank dead; new replacement batteries ordered for delivery tomorrow."
        },
        {
            site: "Greater Noida Project Site (Vaibhav Chauhan & Shubham Verma)",
            model: "Crown RR160H Electric Reach Truck",
            serialNumber: "719736",
            issue: "Duplicate CRM breakdown entry showing battery failure for identical equipment series.",
            action: "Vaibhav Chauhan following up with supervisor Shubham Verma and Rahul Kumar to verify actual physical fleet count.",
            logistics: "None until physical equipment validation completed.",
            clarification: "Single machine may have been logged twice under slightly mismatched serial numbers (7197736 vs 719736).",
            pendingIssue: "Call site supervisor, confirm machine serial number, and purge duplicate CRM ticket.",
            status: "Administrative Review — Potential duplicate CRM complaint logged; site verification in progress."
        },
        {
            site: "Ahmedabad Project Site (Vaibhav Chauhan & Satendra Kumar)",
            model: "Zoomlion Telescopic Boom Lift",
            serialNumber: "45394",
            issue: "Machine only marching; all upper boom elevation and basket functions dead since 3rd November.",
            action: "Satendra Kumar and Pardeep Tomar cross-referencing electronic control card part numbers to verify interchangeability.",
            logistics: "Replacement control card (Unit 3584 series) checked for stock availability.",
            clarification: "Control card failure isolated to boom elevation circuitry while traction drives operate normally.",
            pendingIssue: "Confirm replacement card compatibility and dispatch to Ahmedabad site.",
            status: "Breakdown — Marching functional but boom elevation dead; replacement control card being verified."
        },
        {
            site: "Sanand Project Site (Vaibhav Chauhan & Deenanath Maurya)",
            model: "Zoomlion Articulating Boom Lift",
            serialNumber: "30093",
            issue: "Machine fails to elevate or lower, display triggers overload fault, and hydraulic motor pump is defective.",
            action: "Deenanath Maurya ordered hydraulic pump motor inspection and replacement.",
            logistics: "Replacement hydraulic pump motor staged for immediate installation.",
            clarification: "Breakdown reported on 12th November; auxiliary pump unable to build line pressure.",
            pendingIssue: "Remove damaged hydraulic pump motor, fit replacement, and clear overload calibration.",
            status: "Breakdown — Elevation disabled and pump motor defective; replacement pump installation underway."
        },
        {
            site: "Bhuj Project Site (Vaibhav Chauhan & Pritam Chand)",
            model: "JLG Z-34/22N Articulating Boom Lift",
            serialNumber: "4724",
            issue: "Drive marching failed; CRM complaint open since 28th October with duplicate ticket error on portal.",
            action: "Vaibhav Chauhan logged issue via mobile portal and assigned technician Devender to investigate.",
            logistics: "Traction motor diagnostic tools and relays prepared.",
            clarification: "CRM system showed 'Complaint already exists' when entered from desktop; resolved via mobile app.",
            pendingIssue: "Technician Devender to test drive controller and marching motors on site.",
            status: "Breakdown — Marching defect pending since 28 Oct; assigned to technician Devender."
        },
        {
            site: "Saint-Gobain / Bhiwadi Project Site (Vaibhav Chauhan & Sushil Mishra)",
            model: "Toyota 8FBMT50 Heavy Electric Forklift",
            serialNumber: "Unit 8FBMT50-Bhiwadi",
            issue: "Severe hydraulic oil leak from main mast control valve after expensive TVH seal failed.",
            action: "Sushil Mishra dispatched technicians Babu Lal and Vikas to completely dismantle control valve and diagnose repeat seal failure.",
            logistics: "Original OEM Toyota hydraulic control valve seal kit requisitioned.",
            clarification: "Previous local seal failed immediately and TVH replacement (~Rs 1.5 lakh) began leaking within days due to valve spool scoring.",
            pendingIssue: "Babu Lal and Vikas to disassemble valve block, polish spools, and install OEM Toyota seal kit.",
            status: "Running with Issue — Severe control valve leakage; expert technicians Babu Lal and Vikas dispatched for diagnosis."
        },
        {
            site: "Bhatinda Project Site (Vaibhav Chauhan & Satendra Kumar)",
            model: "Genie Z-60/34 Articulating Boom Lift",
            serialNumber: "3455",
            issue: "Four fly-jib mounting bolts loose, free-wheeling mechanism slipping, and jib articulation unstable.",
            action: "Technician Durvesh torqued fly-jib mounting bolts, recalibrated free-wheeling gears, and completed repair.",
            logistics: "High-tensile replacement hardware fitted on site.",
            clarification: "Work executed successfully on site; formal job card sign-off pending from technician.",
            pendingIssue: "Durvesh to submit signed service report and close CRM job card.",
            status: "Operational / Report Pending — Mechanical fly-jib repairs completed; formal service report pending."
        },
        {
            site: "Patna Project Site (Vaibhav Chauhan & Saurabh Pandey)",
            model: "Crown RR200 Electric Reach Truck",
            serialNumber: "S6455695",
            issue: "Free-lift hydraulic mast cylinder leaking fluid and operator foot dead-man safety sensor malfunctioning.",
            action: "Technician Saurabh Pandey received replacement mast cylinder seals and foot sensor switch for on-site installation.",
            logistics: "Free-lift seal kit and replacement dead-man foot switch delivered to Patna.",
            clarification: "Safety sensor bypassed by operator temporarily; full restoration required before client clearance.",
            pendingIssue: "Install replacement cylinder seals, replace foot dead-man sensor, and certify machine.",
            status: "Under Repair — Mast cylinder leak and foot switch defect; spares delivered to technician Saurabh Pandey."
        },
        {
            site: "Patna Project Site (Vaibhav Chauhan & Saurabh Pandey)",
            model: "BT 15BRP Electric Reach Truck",
            serialNumber: "370",
            issue: "Reverse travel audible safety beeper/buzzer inoperative and general preventive health checkup due.",
            action: "Saurabh Pandey scheduled to install replacement audio alarm and perform comprehensive fluid and electrical audit.",
            logistics: "High-decibel reverse warning beeper and inspection checklist staged on site.",
            clarification: "Site safety audit flagged reverse alarm as mandatory warehouse compliance.",
            pendingIssue: "Mount reverse buzzer, verify electrical trigger from directional lever, and close ticket.",
            status: "Operational with Minor Issue — Reverse buzzer replacement and scheduled audit in progress."
        },
        {
            site: "Bhuj Project Site (Vaibhav Chauhan & Pritam Chand)",
            model: "Zoomlion Telescopic Boom Lift",
            serialNumber: "4343",
            issue: "Wheel hub assembly cracked and structural drive studs sheared off.",
            action: "Pritam Chand requisitioned replacement wheel hub; machine isolated until hub replacement arrives.",
            logistics: "Heavy-duty replacement drive hub assembly shipped to Bhuj project site.",
            clarification: "Machine halted immediately upon hub fissure detection to prevent drive axle collapse.",
            pendingIssue: "Receive replacement wheel hub on site, fit to drive axle, and recommission equipment.",
            status: "Breakdown — Cracked wheel hub assembly; replacement hub dispatched to site."
        }
    ],
    parts: [
        { part: "OEM Traction Battery Bank (6V x 6 Units)", context: "Genie GS-4047 & JCB 45 (Mundra Site)", statusNextSteps: "Two batteries being desulfated, 4 arriving via stock; AGM chargers configured." },
        { part: "New OEM Electronic Control Card", context: "Zoomlion Z-34/22N #4725 (Mundra Site)", statusNextSteps: "Local repair abandoned after 12 recurring failures; new OEM card order being issued." },
        { part: "High-Tensile Grade 10.9/12.9 Suspension Bolts", context: "JLG 660SJ #125148 (Jaisalmer Site)", statusNextSteps: "Recurrent shearing requiring mechanic alignment inspection and high-torque hardware." },
        { part: "Original Toyota Control Valve Seal Kit", context: "Toyota 8FBMT50 Forklift (Bhiwadi Site)", statusNextSteps: "TVH seal leaking; Babu Lal and Vikas dispatched to inspect valve spool scoring." },
        { part: "Fabricated Battery Containment Boxes", context: "JLG 3246ES #B2000011847 (Central Yard)", statusNextSteps: "Boxes delivered from fabricator; workshop team mounting onto chassis." },
        { part: "Drive Motor Shaft Seal & G-CON Control Board", context: "Genie GS-1930 (Central Yard)", statusNextSteps: "Imported spares arrived from China; drive motor oil seal sample matched locally." },
        { part: "Heavy-Duty Drive Wheel Hub Assembly", context: "Zoomlion Boom #4343 (Bhuj Site)", statusNextSteps: "Hub cracked; replacement drive hub assembly dispatched to site." }
    ],
    directives: [
        {
            title: "Cross-Rental Fleet Compliance & Asset Identification",
            points: [
                "Conduct comprehensive physical audit across Gujarat, Sanand, and all client sites to identify every cross-rental machine.",
                "Pardeep Tomar to provide verified dispatch manifest of 24 cross-rental identification stickers sent to sites.",
                "Site supervisors must immediately affix dual Reach International cross-rental stickers on scissor lifts and share photo proof."
            ]
        },
        {
            title: "Daily Operations Review Discipline & Meeting Protocol",
            points: [
                "All designated site supervisors and service engineers must join daily operations meeting strictly by 10:00 AM.",
                "Mandatory video camera enablement required throughout the meeting duration; unexcused absentees will face disciplinary review.",
                "Procure desktop microphone and speaker hardware for Bhiwadi office immediately to eliminate communication bottlenecks."
            ]
        },
        {
            title: "CRM Digital Hygiene & Stale Ticket Closure",
            points: [
                "Conduct immediate purge and closure of 23 legacy September and October tickets lingering in open/undefined status.",
                "Site supervisors must open distinct, individual job cards for newly reported equipment defects rather than reusing stale tickets.",
                "Verify and eliminate duplicate machine entries in CRM for Greater Noida and Ahmedabad before daily close."
            ]
        }
    ],
    actionItems: [
        { person: "Sushil Mishra", task: "Lead tripartite conference call with Vishal and cross-rental vendor to settle Mundra battery dispute." },
        { person: "Sushil Mishra", task: "Supervise Babu Lal and Vikas on-site diagnosis of recurring control valve seal failure at Saint-Gobain Bhiwadi." },
        { person: "Chunnilal Patel", task: "Install repaired control card in Unit 30-20 and return failed card to Delhi central workshop." },
        { person: "Chunnilal Patel", task: "Follow up with Mundra repair vendor for Unit Z-5 card and submit diesel line requisition for Unit 860." },
        { person: "Dhruv Sharma", task: "Authorize emergency purchase order for brand new OEM control card for Mundra Z-34 machine." },
        { person: "Dhruv Sharma", task: "Enforce conference call between mechanic and Jaisalmer operator to inspect 660SJ suspension bolt alignment." },
        { person: "Dhruv Sharma", task: "Direct total cleanup and reconciliation of 23 stale CRM complaints with supervisor Dinesh and Vaibhav." },
        { person: "Pardeep Tomar", task: "Verify store inventory and expedite dispatch of 5 traction batteries for 40/45 series boom lifts." },
        { person: "Pardeep Tomar", task: "Coordinate fabrication and workshop fitting of replacement battery containment boxes on JLG 3246ES." },
        { person: "Vinay Singh", task: "Resolve cross-rental battery replacement approvals with client management and commercial leads." },
        { person: "Shiv Uniyal", task: "Cross-reference electronic control card part numbers between Unit 3584 and Unit 4390 for Ahmedabad." },
        { person: "Shiv Uniyal", task: "Supervise drive motor seal sourcing and reassembly of GS-1930 scissor lift in central workshop." },
        { person: "Umesh Kumar", task: "Dispatch mechanic to Jaisalmer site to verify suspension cylinder geometry on Unit 125148." },
        { person: "Umesh Kumar", task: "Track technician Pravin's diagnostic findings on engine overheating on Jammu JLG 1200SJP." },
        { person: "Vaibhav Chauhan", task: "Verify physical equipment serial numbers for Crown reach trucks at Greater Noida to eliminate duplicate CRM ticket." },
        { person: "Vaibhav Chauhan", task: "Follow up with site supervisors on cross-rental sticker placement and receive photographic evidence." },
        { person: "Vaibhav Chauhan", task: "Reclassify Sanand forklift Unit 935 in CRM to 'Running with Issue' and schedule Bijnor exchange." }
    ]
};

// ============================================================================
// 2. MEETING: 15-11-2026 (Sunday) - Weekly Holiday
// ============================================================================
export const meeting15Nov = {
    id: "meet-2026-11-15",
    title: "15-11-2026",
    date: "2026-11-15",
    dateFormatted: "15-11-2026",
    focus: "Weekly Official Holiday (Sunday) – Corporate Offices & Fleet Operations Closed",
    isHoliday: true,
    holidayName: "Sunday (Weekly Off)",
    noMeetingHeld: false,
    notRecorded: false,
    breakdowns: [],
    parts: [],
    directives: [],
    actionItems: []
};

// ============================================================================
// 3. MEETING: 16-11-2026 (Monday)
// ============================================================================
export const meeting16Nov = {
    id: "meet-2026-11-16",
    title: "16-11-2026",
    date: "2026-11-16",
    dateFormatted: "16-11-2026",
    focus: "Mundra JLG 800 battery storage and alternator draining on cross-rental 5390, Korba 120ft starter recurrent burn-out and off-hire evaluation, Blue Star 9-machine defect escalation, Sagar bus transit spares blockage, and Bina L&T/VRC client handover coordination.",
    isHoliday: false,
    holidayName: "",
    noMeetingHeld: false,
    notRecorded: false,
    breakdowns: [
        {
            site: "Mundra Project Site (Sandip / Jai Shri Ram & Pardeep Tomar)",
            model: "JLG 800AJ Telescopic Boom Lift",
            serialNumber: "Unit 800-Mundra",
            issue: "Traction battery stored in site warehouse to prevent field theft while supplier payment remains uncleared.",
            action: "Pardeep Tomar and Shiv Uniyal coordinating immediate vendor payment release so batteries can be mounted onto machine within 5 minutes.",
            logistics: "Batteries physically available in site store; vendor invoice awaiting accounts payment clearance.",
            clarification: "Machine is mechanically operational; installation withheld strictly to safeguard unpaid high-value battery assets.",
            pendingIssue: "Clear vendor payment invoice and mount battery bank onto machine.",
            status: "Standby / Awaiting Payment — Batteries secured in site store; payment release pending before installation."
        },
        {
            site: "Mundra Project Site (Chunnilal Patel & Darvinder)",
            model: "Cross-Rental Telescopic Boom Lift",
            serialNumber: "Unit 5390",
            issue: "Alternator defective and night operator leaves emergency switch active, causing display to drain battery completely overnight.",
            action: "Chunnilal Patel deploying site technician to replace defective alternator and instructing night operators on mandatory shutdown procedure.",
            logistics: "Replacement engine alternator sourced for on-site installation.",
            clarification: "Machine suffers daily morning dead-battery breakdowns because ignition display circuit remains powered when keys are left on.",
            pendingIssue: "Replace alternator, repair ignition cutoff relay, and mandate operator pre-shift shutdown verification.",
            status: "Breakdown — Defective alternator and nocturnal battery drain; alternator replacement underway."
        },
        {
            site: "Mundra Project Site (Chunnilal Patel, Sandip & Darvinder)",
            model: "Zoomlion Z-34/22N Articulating Boom Lift",
            serialNumber: "Unit Z-34-Mundra",
            issue: "Battery terminal poles melted/burnt and electronic control card replacement pending installation.",
            action: "Technicians Darvinder and Sandip dispatched with repaired controller card and lead casting kit to rebuild battery posts.",
            logistics: "Controller card and battery terminal post repair tooling carried to site.",
            clarification: "Terminal post damage caused excessive voltage drop, accelerating card failure.",
            pendingIssue: "Rebuild lead battery terminal poles, install repaired control card, and calibrate traction speeds.",
            status: "Under Repair — Battery terminal rebuilding and control card installation by Darvinder and Sandip."
        },
        {
            site: "Mundra Project Site (Chunnilal Patel & Shiv Uniyal)",
            model: "Zoomlion Z-30/20 Telescopic Boom Lift",
            serialNumber: "Unit 30-20-Mundra",
            issue: "Repaired control card arrived from workshop; pending installation to replace temporary card.",
            action: "Chunnilal Patel installing repaired card into Unit 30-20 to commission machine and packaging old card for shipment to Delhi.",
            logistics: "Defective card packaged for courier dispatch to Delhi central inventory.",
            clarification: "Testing card on site; once confirmed operational, replaced unit will be shipped to Delhi.",
            pendingIssue: "Install card, confirm operational status, and dispatch defective unit to Delhi.",
            status: "Under Repair — Repaired card installation in progress; old card marked for Delhi dispatch."
        },
        {
            site: "Mundra Project Site (Chunnilal Patel & Shiv Uniyal)",
            model: "Zoomlion Articulating Boom Lift (Upper Control)",
            serialNumber: "Unit Zoomlion-Joy",
            issue: "Original platform control joystick defective; replacement control box and card ordered.",
            action: "Shiv Uniyal sourced replacement control box assembly; machine confirmed operable pending component swap.",
            logistics: "New upper control box assembly en route to site.",
            clarification: "Machine currently operational with workaround; replacement box arriving to eliminate erratic movements.",
            pendingIssue: "Receive new control box, plug into platform harness, and verify proportional joystick response.",
            status: "Operational with Workaround — Replacement control box and card in transit to replace worn joystick."
        },
        {
            site: "Korba Project Site (Umesh Kumar, Vinay Singh & Anil Rai)",
            model: "JLG 1200SJP Telescopic Boom Lift",
            serialNumber: "Unit 120-Korba",
            issue: "Newly rebuilt starter motor burnt out again immediately upon reinstallation; machine in recurrent breakdown.",
            action: "Site helper carrying fresh starter motor; technician Anil Rai scheduled for emergency site deployment while management evaluates off-hiring machine.",
            logistics: "Second replacement starter motor carried by site helper; Anil Rai train ticketing coordinated.",
            clarification: "Unit has suffered recurring failures and over 50 service visits; client contract nearing completion so off-hiring is under consideration.",
            pendingIssue: "Fit second starter, confirm engine crank, and finalize client release/demobilization decision.",
            status: "Breakdown — Second starter motor burnt; technician dispatch and off-hire evaluation in progress."
        },
        {
            site: "Blue Star / Nanded Project Site (Umesh Kumar & Vinay Singh)",
            model: "Electric Scissor Lift Fleet (Blue Star Fleet)",
            serialNumber: "Unit BlueStar-Fleet (9 Units Affected)",
            issue: "Client reported 9 machines defective out of 30 deployed, with 6 units completely stopped and client demanding off-hire.",
            action: "Vinay Singh and Umesh Kumar auditing fault logs, addressing client invoice disputes, and planning service technician deployment.",
            logistics: "Spares inventory and diagnostic engineers earmarked for fleet rehabilitation.",
            clarification: "Client withheld payments and issued formal de-hire notice for 6 grounded scissor lifts.",
            pendingIssue: "Meet client engineering head, reconcile machine uptime logs, and mobilize technicians to clear defects.",
            status: "Breakdown Escalation — 6 units grounded out of 9 defective; client off-hire and billing dispute under resolution."
        },
        {
            site: "Kochi Project Site (Umesh Kumar, Vinod Pal & Vinay Singh)",
            model: "Genie Telescopic Boom Lift",
            serialNumber: "Unit Kochi-Boom",
            issue: "Platform controls locked out; remote phone troubleshooting between Vinod Pal and operator for 2 hours failed to resolve issue.",
            action: "Umesh Kumar instructed to dispatch technician physically equipped with handheld diagnostic analyzer tool to site.",
            logistics: "OEM handheld analyzer tool and interface cable being transferred to Kochi technician.",
            clarification: "Control system fault codes cannot be decoded without direct analyzer tool plugged into ground control module.",
            pendingIssue: "Deploy service technician with analyzer to site to extract active error codes and reset safety circuit.",
            status: "Breakdown — Remote diagnostic failed; physical technician dispatch with analyzer tool mandated."
        },
        {
            site: "Patna Project Site (Vinay Singh & Umesh Kumar)",
            model: "JLG 800AJ Telescopic Boom Lift",
            serialNumber: "Unit 800AJ-Patna",
            issue: "Machine demobilizing from completed job for short-haul transfer (50-60 km) to newly awarded site.",
            action: "Vinay Singh arranging flatbed truck transport tomorrow; operator returning from Chhath holiday to inspect and start machine.",
            logistics: "Local low-bed transport trailer booked for site transfer tomorrow morning.",
            clarification: "Machine successfully tested before holiday; operator conducting pre-loading inspection.",
            pendingIssue: "Operator to inspect start sequence and oversee safe loading onto transport trailer tomorrow.",
            status: "Demobilization / Transit Prep — Scheduled for transport trailer loading tomorrow morning."
        },
        {
            site: "Bina Project Site (Satendra Kumar, Sudesh Pal & Ram Babu)",
            model: "Genie Boom Lift (L&T Project Work)",
            serialNumber: "Unit L&T-Bina",
            issue: "Mechanical and electrical adjustments required before formal client handover.",
            action: "Technicians Sudesh Pal and Ram Babu arrived on site to complete remaining punch list items over two-day stay.",
            logistics: "Diagnostic tools, torque equipment, and spare fasteners brought to site by technicians.",
            clarification: "Technicians will remain stationed on site for two consecutive days until handover certificate is secured.",
            pendingIssue: "Complete functional load testing and obtain formal client handover sign-off.",
            status: "Under Maintenance — Technicians Sudesh Pal and Ram Babu executing pre-handover rectification."
        },
        {
            site: "Bina Project Site (Satendra Kumar, Sudesh Pal & Ram Babu)",
            model: "Genie Boom Lift (VRC Project Work)",
            serialNumber: "Unit VRC-Bina",
            issue: "Structural bolt inspection and electrical circuit tuning required prior to commissioning.",
            action: "Sudesh Pal and Ram Babu completing overhaul on secondary VRC unit concurrently with L&T machine.",
            logistics: "Hardware consumables staged on site.",
            clarification: "Both machines being serviced concurrently to achieve unified site release within 48 hours.",
            pendingIssue: "Complete calibration and sign handover document with VRC project management.",
            status: "Under Maintenance — Concurrent overhaul by Sudesh Pal and Ram Babu; handover targeted in 48 hours."
        },
        {
            site: "CG Project Site (Sushil Mishra & Vinay Singh)",
            model: "Access Fleet Equipment (CG Project)",
            serialNumber: "Unit CG-Deployment",
            issue: "Two machines temporarily idled due to mandatory site medical and eye checkups for newly assigned operators.",
            action: "Sushil Mishra coordinated operator hospital visits for eye tests; 9 machines active on site and 1 additional unit planned.",
            logistics: "1 additional machine mobilizing from yard to fulfill 10-unit contract.",
            clarification: "Client site safety protocol mandates certified ophthalmological clearance before issuing machine operating permits.",
            pendingIssue: "Obtain ophthalmology certificates, clear site safety induction, and deploy 10th machine.",
            status: "Operational Standby — 9 units active, 2 idle awaiting operator medical clearance; 10th machine mobilizing."
        },
        {
            site: "Bijnor Project Site (Ravi Tiwari & Sushil Mishra)",
            model: "Diesel Heavy Forklift",
            serialNumber: "Unit Bijnor-Forklift",
            issue: "Machine operational but planned for fleet rotation within next 1-2 months; workshop exchange under review.",
            action: "Ravi Tiwari confirmed current machine will continue running on site for 1-2 months while replacement unit is prepared.",
            logistics: "Replacement forklift mobilization from central yard to be scheduled upon client notice.",
            clarification: "Immediate replacement deferred as machine is performing duty without active risk of failure.",
            pendingIssue: "Monitor machine performance weekly and prepare yard reserve unit for planned swap.",
            status: "Operational — Running stably; long-term replacement scheduled within 1-2 months."
        }
    ],
    parts: [
        { part: "Traction Battery Bank (800 Series)", context: "JLG 800AJ (Mundra Site)", statusNextSteps: "Stored in site warehouse; vendor invoice awaiting clearance before chassis mounting." },
        { part: "Heavy-Duty Diesel Engine Alternator", context: "Unit 5390 Cross-Rental (Mundra Site)", statusNextSteps: "Sourced for replacement to prevent chronic overnight battery drain." },
        { part: "Repaired Electronic Control Card", context: "Zoomlion Z-30/20 (Mundra Site)", statusNextSteps: "Arrived on site; being installed by Chunnilal; old failed unit returning to Delhi." },
        { part: "Heavy-Duty Starter Motor (Second Unit)", context: "JLG 1200SJP Unit 120 (Korba Site)", statusNextSteps: "First rebuild burned; helper carrying fresh unit; off-hire decision pending." },
        { part: "Cross-Rental Fleet ID Stickers", context: "Sanand & Fleet Sites", statusNextSteps: "Deenanath Maurya and Imran Khan verifying scissor lift application." },
        { part: "Bus Cargo Spares Consignment", context: "Sagar Transit Disruption", statusNextSteps: "Stranded for 3 days at bus terminal; Pardeep Tomar coordinating retrieval." }
    ],
    directives: [
        {
            title: "Operator Machine Shutdown & Ignition Isolation Enforcement",
            points: [
                "Mandate strict operator protocol to turn off ignition keys and trip emergency stops at end of shifts on all diesel and battery boom lifts.",
                "Eliminate recurrent overnight battery drain on Unit 5390 caused by illuminated instrument clusters left unattended.",
                "Impose penalty or disciplinary action against site operators leaving machines energized in night shifts."
            ]
        },
        {
            title: "Logistics Routing Policy: Train vs. Private Bus Transport",
            points: [
                "Strictly ban dispatching critical machinery spares and electronic components via unreliable private bus cargo.",
                "All inter-state consignments must be shipped via express railway parcel or authorized tracked couriers to prevent delays like the 3-day Sagar stoppage.",
                "Stores department holds full end-to-end accountability until spares consignment is physically delivered into technician's hands."
            ]
        },
        {
            title: "Cross-Rental Scissor Fleet Identification Protocol",
            points: [
                "Affix cross-rental identification stickers strictly to third-party cross-rental electric scissor lifts.",
                "Do not apply cross-rental stickers to owned fleet, articulating boom lifts, or diesel machines.",
                "Site in-charges must send timestamped photographs of each stickered machine plate to operations group."
            ]
        }
    ],
    actionItems: [
        { person: "Jai Shri Ram", task: "Confirm payment clearance for 800 series batteries and mount into machine upon receipt." },
        { person: "Jai Shri Ram", task: "Submit tool reimbursement receipts with machine serial numbers to Pardeep Tomar." },
        { person: "Shiv Uniyal", task: "Follow up with accounts to release pending vendor payment for Mundra 800 battery bank." },
        { person: "Shiv Uniyal", task: "Check travel booking status for technician Anil Rai's trip to Korba." },
        { person: "Shiv Uniyal", task: "Share technician contact numbers with site supervisors for Kochi and Patna deployments." },
        { person: "Shiv Uniyal", task: "Coordinate machine handover certification for L&T and VRC units at Bina project site." },
        { person: "Pardeep Tomar", task: "Expedite delivery of bus consignment stranded at Sagar transit hub." },
        { person: "Pardeep Tomar", task: "Receive defective control card from Unit 30-20 and manage warranty claims with vendor." },
        { person: "Chunnilal Patel", task: "Complete battery terminal pole rebuilding and install repaired card on Unit Z-34." },
        { person: "Chunnilal Patel", task: "Replace defective alternator on Unit 5390 and enforce operator shutdown protocol." },
        { person: "Chunnilal Patel", task: "Commission Zoomlion Unit 30-20 and package old control card for Delhi dispatch." },
        { person: "Umesh Kumar", task: "Dispatch field technician equipped with handheld analyzer tool to Kochi project site." },
        { person: "Umesh Kumar", task: "Coordinate with client leadership at Blue Star Nanded to audit 9 defective machines and prevent off-hire." },
        { person: "Imran Khan", task: "Coordinate with technician Deepak Jangra to attend Unit SX-125 platform control lockout." },
        { person: "Deenanath Maurya", task: "Verify machine list with Dinesh and affix cross-rental stickers on designated scissor lifts at Sanand." },
        { person: "Sushil Mishra", task: "Confirm medical clearance for CG project operators and arrange mobilization of 10th contract unit." },
        { person: "Vinay Singh", task: "Finalize transport trailer loading for Patna 80ft boom lift relocation." }
    ]
};

// ============================================================================
// 4. MEETING: 17-11-2026 (Tuesday)
// ============================================================================
export const meeting17Nov = {
    id: "meet-2026-11-17",
    title: "17-11-2026",
    date: "2026-11-17",
    dateFormatted: "17-11-2026",
    focus: "Battery connector lead bulk procurement, Mundra Unit 4022 marching-motor electronic glitch, Kochi display replacement mobilization, Vapi 8-ton clamp pad overhaul, Bangalore 2-ton Hyundai forklift cylinder scoring resolution, scissor platform safety guard spring redesign, and Jajpur Unit 150 loading.",
    isHoliday: false,
    holidayName: "",
    noMeetingHeld: false,
    notRecorded: false,
    breakdowns: [
        {
            site: "Mundra Project Site (Chunnilal Patel & Jitendra Budhauliya)",
            model: "Zoomlion Z-34/22N Articulating Boom Lift",
            serialNumber: "Unit 4022",
            issue: "Repaired electronic card installed; whenever marching travel is actuated, tension/function motor erroneously activates concurrently.",
            action: "Chunnilal Patel reporting malfunction to card repair vendor; Jitendra Budhauliya requesting vendor phone contact to troubleshoot logic wiring.",
            logistics: "Card diagnostic pin-out diagram requested from vendor.",
            clarification: "Marching travel for 100 meters causes function pump to run continuously, threatening auxiliary pump motor burnout.",
            pendingIssue: "Connect card repair technician directly with site mechanic to debug internal logic bridging.",
            status: "Breakdown — Faulty logic in repaired card triggering auxiliary motor during travel; vendor technical review underway."
        },
        {
            site: "Mundra Project Site (Chunnilal Patel, Sandip & Pardeep Tomar)",
            model: "Genie GS-4047 Electric Scissor Lift",
            serialNumber: "Unit 4047-Mundra",
            issue: "Machine non-operational awaiting 6V traction battery bank; 6 batteries previously installed failed to maintain voltage.",
            action: "Sushil Mishra confirmed battery payment approved; Pardeep Tomar instructed site team to collect batteries arriving via Raju.",
            logistics: "Traction battery bank dispatched and cleared through local supplier contact Raju.",
            clarification: "Payment cleared yesterday; batteries physically delivered to local depot.",
            pendingIssue: "Collect battery bank from local distributor, mount onto chassis, and test under load.",
            status: "Awaiting Installation — Traction battery bank cleared and delivered locally; collection and mounting underway."
        },
        {
            site: "Mundra Project Site (Chunnilal Patel & Sushil Mishra)",
            model: "Cross-Rental Boom Lift (JCB 45 Series)",
            serialNumber: "Unit JCB-45-Mundra",
            issue: "Client dispute over battery replacement cost; machine out of warranty while client demands goodwill claim.",
            action: "Sushil Mishra pursuing goodwill warranty claim with manufacturer; negotiations expected to finalize today.",
            logistics: "Commercial goodwill warranty claim processed through OEM channels.",
            clarification: "Machine technically beyond warranty window; goodwill support sought to preserve client account.",
            pendingIssue: "Conclude OEM goodwill discussions and dispatch authorized battery set.",
            status: "Commercial Dispute — Out-of-warranty battery claim under OEM goodwill negotiation."
        },
        {
            site: "Kochi / Perumbavoor Project Site (Jitendra Budhauliya & Sushil Mishra)",
            model: "Genie Telescopic Boom Lift",
            serialNumber: "Unit Kochi-Display",
            issue: "Upper platform digital display panel completely damaged and blank, preventing operator control.",
            action: "Technician Anuj deploying from Tirunelveli (~350 km distance) to install replacement display unit and configure machine.",
            logistics: "Replacement display panel sourced from local store reserves and carried by technician Anuj.",
            clarification: "Client's project is operational; rapid display replacement will restore full functionality within 24 hours.",
            pendingIssue: "Technician Anuj to arrive on site tomorrow morning, install display, and verify instrumentation.",
            status: "Under Repair — Defective display panel; technician Anuj traveling 350 km from Tirunelveli to replace."
        },
        {
            site: "Vapi Project Site (Sushil Mishra & Jitendra Budhauliya)",
            model: "Heavy 8-Ton Industrial Forklift",
            serialNumber: "Unit 8T-Vapi",
            issue: "Heavy clamp attachment grip pads worn and cracked, requiring precision machining and pin replacement.",
            action: "Clamp pads and pivot pins sent to specialized machine workshop in Songadh; expected back tomorrow after machining.",
            logistics: "Songadh machining workshop invoice processed for immediate payment clearance.",
            clarification: "Critical 8-ton clamp attachment undergoes severe paper/metal roll stress; precision machining prevents clamp slippage.",
            pendingIssue: "Receive remachined clamp pads from Songadh tomorrow, assemble pins, and test gripping pressure.",
            status: "Under Machining — Clamp pads undergoing specialized repair at Songadh workshop; arrival expected tomorrow."
        },
        {
            site: "Bhiwadi Project Site (Sushil Mishra & Jitendra Budhauliya)",
            model: "Industrial Fleet Equipment #510",
            serialNumber: "Unit 510",
            issue: "Equipment experiencing severe engine surging, erratic jerking motions, and sudden stalling under load.",
            action: "Site technician checking diesel fuel supply line, fuel filters, and governor actuator linkage.",
            logistics: "Replacement fuel filters and delivery hose staged on site.",
            clarification: "Jerking behavior indicates fuel delivery starvation or air ingress in high-pressure diesel lines.",
            pendingIssue: "Bleed fuel injection system, replace primary/secondary filters, and conduct continuous load cycle.",
            status: "Running with Issue — Severe jerking and engine stalling; fuel delivery system overhaul underway."
        },
        {
            site: "Bhiwadi Project Site (Sushil Mishra & Jitendra Budhauliya)",
            model: "Industrial Fleet Equipment #508",
            serialNumber: "Unit 508",
            issue: "Abnormal metallic grinding noise radiating from drive axle gearbox during travel.",
            action: "Technician inspecting transmission oil level, draining gearbox to inspect for metal shavings, and checking gear teeth.",
            logistics: "High-viscosity EP gearbox lubricant and replacement bearing seals staged on site.",
            clarification: "Gearbox noise poses catastrophic gear failure risk if operated without immediate oil and bearing inspection.",
            pendingIssue: "Complete gearbox fluid drain, inspect magnetic plug for metallic debris, and evaluate gear mesh.",
            status: "Running with Issue — Gearbox grinding noise; transmission inspection and lubrication in progress."
        },
        {
            site: "Bhiwadi Project Site (Sushil Mishra & Jitendra Budhauliya)",
            model: "Industrial Fleet Equipment #503",
            serialNumber: "Unit 503",
            issue: "Hydraulic mast elevation cylinder leaking oil and pressure dropping under rated payload.",
            action: "All replacement cylinder seals, packing, and hoses delivered to site; technician Saurabh executing seal overhaul today.",
            logistics: "Complete hydraulic cylinder repair kit and seals delivered to technician Saurabh.",
            clarification: "Parts arrived on site; technician executing full repacking of hydraulic lift cylinder.",
            pendingIssue: "Complete cylinder seal repacking, bleed air from hydraulic circuit, and verify pressure retention.",
            status: "Under Repair — Mast cylinder overhaul underway with newly arrived replacement parts."
        },
        {
            site: "Bangalore Project Site (Sushil Mishra & Dhruv Sharma)",
            model: "Hyundai 2-Ton Electric Forklift (Cascade Clamp)",
            serialNumber: "Unit 2T-Bangalore",
            issue: "Roll clamp cylinder piston rubbing internally against cylinder barrel, causing severe binding and repeated seal blowouts.",
            action: "Dhruv Sharma directed team to temporarily swap clamp from recently released site machine; extract damaged cylinder rod and send to Delhi via train or engage local Bangalore hydraulic repairer.",
            logistics: "Damaged cylinder rod to be shipped to Delhi workshop via train if local vendor quote exceeds limits.",
            clarification: "OEM cylinder replacement quoted at Rs 92,000; internal rod is bent causing cylinder scoring and seal failure within 3-4 days.",
            pendingIssue: "Swap clamp attachment with spare machine via Rahul and dispatch cylinder rod to machine shop.",
            status: "Breakdown — Scored cylinder barrel and bent rod; temporary clamp swap and machine shop overhaul approved."
        },
        {
            site: "Client Fleet Operations / Safety Compliance (Sushil Mishra & Jitendra Budhauliya)",
            model: "Scissor Lift Fleet (Safety Guard Railing Systems)",
            serialNumber: "Fleet Safety Guards (9 Units Grounded)",
            issue: "Client stopped 9 scissor lifts due to broken pothole safety guards and broken return springs; 30 replacement guards needed.",
            action: "Management redesigning guard mounting: mount 2 inches above railing facing inward; researching OEM spring vendor.",
            logistics: "Fabrication of 30 reinforced safety guard units and procurement of heavy-duty return springs underway.",
            clarification: "Current outward-mounted guards snag against obstacles; inward orientation and proper springs prevent breakage.",
            pendingIssue: "Identify OEM spring manufacturer from sample, finalize inward mounting geometry, and re-certify 9 machines.",
            status: "Safety Hold — 9 units grounded due to broken safety guards; redesigning mount and sourcing heavy-duty springs."
        },
        {
            site: "Jajpur Project Site (Jitendra Budhauliya & Vinod Pal)",
            model: "JLG 1500SJ Telescopic Boom Lift",
            serialNumber: "Unit 150-Jajpur",
            issue: "Major overhaul completed; transport loading scheduled for tomorrow for transit to next deployment.",
            action: "Jitendra Budhauliya arranging travel ticket for technician Anil Rai from Patna to Jajpur; technician Vinod Pal completing final checks.",
            logistics: "Heavy multi-axle trailer booked for loading tomorrow morning.",
            clarification: "Unit 150 overhaul successfully completed; will be transferred onwards to project site.",
            pendingIssue: "Complete final functional testing, oversee trailer loading tomorrow, and dispatch technicians.",
            status: "Ready for Loading — Overhaul completed; transport trailer loading scheduled for tomorrow."
        }
    ],
    parts: [
        { part: "OEM Battery Connector Leads (Positive Cable Assembly)", context: "Fleet Battery Banks (Central Stores)", statusNextSteps: "Ordering 20-50 units with volume discount (~Rs 500/piece) to prevent terminal fires." },
        { part: "Upper Digital Display Console Panel", context: "Genie Boom Lift (Kochi / Perumbavoor Site)", statusNextSteps: "Technician Anuj deploying from Tirunelveli with replacement panel for site fitting." },
        { part: "Machined Clamp Attachment Pads & Pivot Pins", context: "8-Ton Industrial Forklift (Vapi Site)", statusNextSteps: "Under precision machining at Songadh workshop; return expected tomorrow." },
        { part: "Hydraulic Clamp Cylinder Assembly / Piston Rod", context: "Hyundai 2-Ton Forklift (Bangalore Site)", statusNextSteps: "Temporary clamp swap arranged; cylinder rod being sent to machine shop." },
        { part: "Reinforced Safety Guard Railing Springs (30 Pcs)", context: "Electric Scissor Fleet (Safety Compliance)", statusNextSteps: "OEM sample identified for web sourcing; inward 2-inch elevated mounting geometry specified." },
        { part: "Hydraulic Cylinder Seal Kit & Gaskets", context: "Unit 503 Mast Cylinder (Bhiwadi Site)", statusNextSteps: "Delivered to site; technician Saurabh executing repacking today." }
    ],
    directives: [
        {
            title: "Battery Cable Standard & Connector Lead Bulk Procurement",
            points: [
                "Immediately issue bulk purchase order for 20 to 50 factory-crimped battery connector leads with heavy-duty terminal lugs.",
                "Negotiate volume discount from vendor to standardize on Rs 500 OEM-spec cable assemblies across all battery banks.",
                "Strictly ban field improvisation of battery jumper wires with uninsulated loose copper strands that cause terminal melting."
            ]
        },
        {
            title: "Scissor Lift Pothole Guard Redesign & Mounting Standard",
            points: [
                "Standardize scissor lift safety guard mounting: position 2 inches above platform railing and orient brackets facing inward.",
                "Research OEM spring manufacturer markings and technical specifications from physical sample to source durable replacement springs.",
                "Educate client safety officers on angle sensor speed governance (0.8 km/h creep speed at elevation) to dispel false defect claims."
            ]
        },
        {
            title: "Field Supervisor Communication & Travel Coordination Protocol",
            points: [
                "Managers visiting project sites must notify local site supervisors well in advance to coordinate technical decisions.",
                "Site room rent records must include room count, resident technician names, approved rental rate, and accounting file number.",
                "Coordinate multi-leg technician travel routes directly between Patna, Jajpur, and Kochi to avoid stranded equipment."
            ]
        }
    ],
    actionItems: [
        { person: "Jitendra Budhauliya", task: "Issue bulk purchase order for 20 to 50 factory-crimped battery connector leads with volume discount." },
        { person: "Jitendra Budhauliya", task: "Coordinate technician Anuj's travel from Tirunelveli to replace damaged display panel at Kochi." },
        { person: "Jitendra Budhauliya", task: "Book direct train travel ticket for technician Anil Rai from Patna to Jajpur for Unit 150 loading." },
        { person: "Jitendra Budhauliya", task: "Inspect physical sample of safety guard spring and extract OEM manufacturer details from website." },
        { person: "Sushil Mishra", task: "Verify battery connector lead part number, specifications, and volume pricing with vendor." },
        { person: "Sushil Mishra", task: "Review invoice and ensure delivery of remachined 8-ton clamp pads from Songadh workshop for Vapi site." },
        { person: "Sushil Mishra", task: "Share technical wiring schematics and card supplier contact with Chunnilal Patel for Unit 4022." },
        { person: "Sushil Mishra", task: "Explain high-elevation speed limit safety features (0.8 km/h) to client safety leadership." },
        { person: "Sushil Mishra", task: "Audit site supervisor room rent registers and consolidate room names, numbers, and expense files." },
        { person: "Chunnilal Patel", task: "Connect card repair vendor with site mechanic to debug auxiliary motor activation on Unit 4022." },
        { person: "Chunnilal Patel", task: "Dispatch two repaired electronic cards to Delhi central workshop within the hour." },
        { person: "Dhruv Sharma", task: "Authorize temporary clamp swap from released machine and evaluate local cylinder repair in Bangalore." },
        { person: "Pardeep Tomar", task: "Coordinate collection of 45-series battery bank through local vendor contact Raju at Mundra." },
        { person: "Pardeep Tomar", task: "Conduct hydrometer specific gravity test and electrolyte top-up on Surya batteries in central stores." },
        { person: "Umesh Kumar", task: "Verify technician Saurabh's cylinder seal overhaul on Unit 503 at Bhiwadi site." }
    ]
};

// ============================================================================
// EXECUTION & VERIFICATION ENGINE (Step A & Step B)
// ============================================================================
export async function runIngestionAndVerification() {
    console.log('🚀 Starting Reach International Daily Meeting Ingestion Pipeline (14 - 17 Nov 2026)...\n');

    const meetingsToSync = [
        { name: '14 Nov 2026 (Saturday)', data: meeting14Nov },
        { name: '15 Nov 2026 (Sunday - Weekly Off)', data: meeting15Nov },
        { name: '16 Nov 2026 (Monday)', data: meeting16Nov },
        { name: '17 Nov 2026 (Tuesday)', data: meeting17Nov }
    ];

    const results = [];

    for (const { name, data } of meetingsToSync) {
        console.log(`================================================================`);
        console.log(`▶ INGESTING: ${name} [${data.id}]`);
        console.log(`================================================================`);

        // Step A: Ingestion
        const syncResult = await syncDailyMeeting(data);
        console.log(`✔ Step A Completed: Ingested master + children for ${data.id}`);

        // Step B: Verification
        console.log(`🔍 Running Step B Database Verification for ${data.id}...`);

        // 1. Verify meeting master
        const { data: meetingRow, error: mErr } = await supabaseAdmin
            .from('meetings')
            .select('*')
            .eq('id', data.id)
            .single();

        if (mErr || !meetingRow) {
            throw new Error(`❌ Step B FAILED: Master meeting record ${data.id} not found in Supabase!`);
        }

        // 2. Verify breakdowns
        const { count: breakdownCount, error: bErr } = await supabaseAdmin
            .from('breakdown_machines')
            .select('*', { count: 'exact', head: true })
            .eq('meeting_id', data.id);

        if (bErr) throw new Error(`❌ Step B FAILED querying breakdown_machines: ${bErr.message}`);

        // 3. Verify parts
        const { count: partsCount, error: pErr } = await supabaseAdmin
            .from('meeting_parts')
            .select('*', { count: 'exact', head: true })
            .eq('meeting_id', data.id);

        if (pErr) throw new Error(`❌ Step B FAILED querying meeting_parts: ${pErr.message}`);

        // 4. Verify directives
        const { count: directivesCount, error: dErr } = await supabaseAdmin
            .from('meeting_directives')
            .select('*', { count: 'exact', head: true })
            .eq('meeting_id', data.id);

        if (dErr) throw new Error(`❌ Step B FAILED querying meeting_directives: ${dErr.message}`);

        // 5. Verify action items
        const { count: actionsCount, error: aErr } = await supabaseAdmin
            .from('meeting_action_items')
            .select('*', { count: 'exact', head: true })
            .eq('meeting_id', data.id);

        if (aErr) throw new Error(`❌ Step B FAILED querying meeting_action_items: ${aErr.message}`);

        const expectedBreakdowns = data.breakdowns.length;
        const expectedParts = data.parts.length;
        const expectedDirectives = data.directives.length;
        const expectedActions = data.actionItems.length;

        console.log(`  Master Record:  EXISTS (Date: ${meetingRow.date}, Holiday: ${meetingRow.is_holiday})`);
        console.log(`  Breakdowns:     Actual = ${breakdownCount} | Expected = ${expectedBreakdowns} -> ${breakdownCount === expectedBreakdowns ? 'MATCH ✅' : 'MISMATCH ❌'}`);
        console.log(`  Parts:          Actual = ${partsCount} | Expected = ${expectedParts} -> ${partsCount === expectedParts ? 'MATCH ✅' : 'MISMATCH ❌'}`);
        console.log(`  Directives:     Actual = ${directivesCount} | Expected = ${expectedDirectives} -> ${directivesCount === expectedDirectives ? 'MATCH ✅' : 'MISMATCH ❌'}`);
        console.log(`  Action Items:   Actual = ${actionsCount} | Expected = ${expectedActions} -> ${actionsCount === expectedActions ? 'MATCH ✅' : 'MISMATCH ❌'}`);

        if (breakdownCount !== expectedBreakdowns || partsCount !== expectedParts ||
            directivesCount !== expectedDirectives || actionsCount !== expectedActions) {
            throw new Error(`❌ Step B Verification count mismatch for ${data.id}!`);
        }

        console.log(`✅ VERIFICATION PASSED for ${name}\n`);
        results.push({
            id: data.id,
            date: data.date,
            isHoliday: data.isHoliday,
            breakdowns: breakdownCount,
            parts: partsCount,
            directives: directivesCount,
            actionItems: actionsCount
        });
    }

    console.log(`================================================================`);
    console.log(`🎉 ALL 4 MEETINGS SUCCESSFULLY INGESTED & VERIFIED IN SUPABASE!`);
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
            console.error('\n❌ Ingestion pipeline failed:', err);
            process.exit(1);
        });
}
