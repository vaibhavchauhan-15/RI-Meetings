/**
 * Reach International Operations - Daily Meeting & Holiday Sync (20-10-2026, 21-10-2026 & 22-10-2026)
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

export const meeting20 = {
    id: "meet-2026-10-20",
    title: "20-10-2026",
    date: "2026-10-20",
    dateFormatted: "20-10-2026",
    focus: "Official Company Holiday – Dussehra (Vijayadashami) – Corporate Offices & Fleet Operations Closed",
    isHoliday: true,
    holidayName: "Dussehra (Vijayadashami)",
    noMeetingHeld: false,
    notRecorded: false,
    breakdowns: [],
    parts: [],
    directives: [],
    actionItems: []
};

export const meeting21 = {
    id: "meet-2026-10-21",
    title: "21-10-2026",
    date: "2026-10-21",
    dateFormatted: "21-10-2026",
    focus: "Sanand M600JP pipe fabrication payment, Toyota 3-ton forklift engine overheating, Indan S-120 chronic breakdowns and harness replacement, S-65 function sticking and specialist diagnosis, Mundra Z-45 pump testing battery swap, and field 20S boom hydraulic leak.",
    isHoliday: false,
    holidayName: "",
    breakdowns: [
        {
            site: "Sanand Project Site",
            model: "Genie Z-45 Articulated Boom",
            serialNumber: "Z45-Sanand",
            issue: "Unit operational on site but awaiting 12 maintenance parts, 2 large rubber protective covers, and actuator coil.",
            action: "Satendra Kumar and Pandit Dheeraj submitted Google Form requisition and briefed Pardeep Tomar for dispatch.",
            logistics: "Requisition registered for 12 parts, 2 rubber covers, and 1 actuator coil from central store.",
            clarification: "Site manager Patel communicated urgent requirement directly to Pardeep Tomar.",
            pendingIssue: "Dispatch 2 rubber covers and 1 actuator coil from central warehouse to Sanand site.",
            status: "Operational with Parts Pending — Unit running on site while 12 parts and protective covers are processed."
        },
        {
            site: "Sanand Project Site (CG Power)",
            model: "JLG M600JP Electric Boom",
            serialNumber: "M600JP-Sanand",
            issue: "Hydraulic piping unmounted inside plant but replacement fabrication stalled over pending ₹2,891 vendor payment.",
            action: "Jitendra Budhauliya instructed Pandit Dheeraj Dubey to advance ₹2,891 payment immediately to collect pipes.",
            logistics: "Pipes dismantled on site by Pardeep; local hose fabricator awaiting ₹2,891 payment clearance.",
            clarification: "Machine could not be marched outside plant due to non-operational state; dismantling completed inside.",
            pendingIssue: "Dheeraj to release ₹2,891 payment, collect fabricated hydraulic pipes, and install immediately.",
            status: "Fabrication Stalled over Payment — Pipes unmounted inside plant; ₹2,891 payment being cleared by Dheeraj."
        },
        {
            site: "Indan Project Site",
            model: "Toyota 3-Ton Diesel Forklift",
            serialNumber: "28348",
            issue: "Engine overheating repeatedly within minutes of starting since 9:30 AM today, coupled with delayed battery dispatch.",
            action: "Jitendra Budhauliya and Vinay Singh verifying dispatch details of new battery while technicians inspect cooling circuit.",
            logistics: "Replacement battery dispatched from supplier; transit docket being tracked.",
            clarification: "Machine breaks down repeatedly due to weak battery and engine overheating rapidly during operation.",
            pendingIssue: "Inspect radiator/coolant circulation, confirm battery delivery date, and replace failed battery.",
            status: "Engine Overheating Breakdown — Overheating rapidly since 9:30 AM; replacement battery in transit."
        },
        {
            site: "Indan Project Site",
            model: "Genie S-120 Telescopic Boom Lift",
            serialNumber: "1388",
            issue: "Sensor failure and electrical wiring harness defect causing chronic breakdowns after only 4 days of operation.",
            action: "Imran Khan secured gate pass; Pardeep Tomar scheduled complete wiring harness and sensor replacement.",
            logistics: "Gate pass issued; replacement wiring harness and sensor components allocated from store.",
            clarification: "Machine stood idle for 1 month previously and broke down again after running only 4 shifts.",
            pendingIssue: "Install complete electrical wiring harness and calibrate sensor circuits to permanently resolve failures.",
            status: "Sensor & Wiring Breakdown — Gate pass issued; wiring harness replacement scheduled to end recurring breakdowns."
        },
        {
            site: "Client Project Site",
            model: "Genie S-65 Telescopic Boom Lift",
            serialNumber: "S65-Fleet",
            issue: "Boom functions sticking repeatedly due to electrical harness defect and valve bank contamination; client refusing to run it.",
            action: "Jitendra Budhauliya deploying specialist Raj Kishore and Mantu for final electrical diagnostic before recall to Delhi.",
            logistics: "Machine exited for repairs 3 times this month; replacement harness and valve bank servicing planned.",
            clarification: "Third-party inspection (TPI) passed 10 days ago, but client demands immediate machine replacement.",
            pendingIssue: "Raj Kishore to conduct comprehensive electrical inspection; if unresolvable, recall machine to Delhi yard.",
            status: "Function Sticking & Electrical Defect — Specialist Raj Kishore assigned for final diagnostic before Delhi recall."
        },
        {
            site: "Mundra Project Site",
            model: "Genie Z-45 Articulated Boom",
            serialNumber: "4343",
            issue: "Hydraulic pump replacement testing ongoing for 2 days; weak traction batteries failing to hold operational charge.",
            action: "Umesh Kumar instructed site team to remove exhausted batteries and install fresh battery set for final load testing.",
            logistics: "New battery bank allocated for installation; pump assembly already mounted.",
            clarification: "Unit stood grounded for extended period; currently undergoing multi-day pump pressure testing.",
            pendingIssue: "Swap out failed batteries, install fresh battery set, and conclude hydraulic pump load testing.",
            status: "Testing & Battery Replacement — Hydraulic pump testing ongoing; battery replacement ordered to complete sign-off."
        },
        {
            site: "Mundra Project Site",
            model: "Genie Z-40 Articulated Boom",
            serialNumber: "Z40-Mundra",
            issue: "Cartridge valve replaced; unit completed testing and restored to active operational service.",
            action: "Pardeep Tomar dispatched cartridge valve; site team completed installation and functional tests.",
            logistics: "Cartridge valve delivered from store and fitted.",
            clarification: "Machine verified running following cartridge valve overhaul.",
            pendingIssue: "None; unit cleared for client operations.",
            status: "Operational — Cartridge valve installed, testing completed, and machine returned to duty."
        },
        {
            site: "Mumbai Project Site",
            model: "JCB Access Platform (Model 35 / 715)",
            serialNumber: "Q21437",
            issue: "Steering tyre cutting failure on one side and defective wiring harness preventing JCB technician from completing repair.",
            action: "Umesh Kumar and Jitendra Budhauliya tracking replacement wiring harness and swapped joystick controller.",
            logistics: "Replacement harness ordered from OEM; joystick controller tested to isolate steering defect.",
            clarification: "JCB service technician inspected unit on Monday and diagnosed faulty wiring harness and steering circuit.",
            pendingIssue: "Receive OEM wiring harness and replacement joystick controller to restore bidirectional tyre steering.",
            status: "Harness & Steering Defect — One-way steering cut failure; awaiting OEM wiring harness and controller."
        },
        {
            site: "Field Operations Site",
            model: "Genie S-120 Telescopic Boom (20S)",
            serialNumber: "20S-Fleet",
            issue: "Severe internal boom hydraulic oil leakage consuming 40-50 liters of hydraulic fluid monthly with zero gauge reading.",
            action: "Vinod Kumar Yadav requesting technician Mantu Dada to demount telescopic boom assembly and locate cylinder barrel crack.",
            logistics: "Hydraulic oil top-up consumed; heavy maintenance tools required to dismantle telescopic boom.",
            clarification: "Cylinder seal kit replaced last year did not resolve leak; barrel crack or internal pipe rupture suspected.",
            pendingIssue: "Deploy Mantu Dada, dismantle boom sections, trace internal barrel rupture, and execute structural repair.",
            status: "Severe Hydraulic Leakage — Losing 40-50L oil monthly; boom demounting required to locate internal leak."
        },
        {
            site: "Fleet Operations Site",
            model: "Fleet Machinery (Serial Plate Defect)",
            serialNumber: "30047",
            issue: "Serial identification plate erased during solvent cleaning because manufacturer printed numbers in standard paint ink.",
            action: "Banarasi Yadav requested embossed or stamped metal serial plate replacement from central store.",
            logistics: "Requisition submitted for engraved/embossed serial specification plate.",
            clarification: "Painted plate illegibility creates severe client compliance and gate entry audit violations.",
            pendingIssue: "Manufacture and courier stamped metal serial number plate 30047 to site for riveting.",
            status: "Identification Plate Erased — Inked numbers washed off; engraved replacement plate requisitioned."
        },
        {
            site: "Dholera Project Site",
            model: "Fleet Equipment",
            serialNumber: "Dholera-Unit",
            issue: "Unit restored to active operational status following technician Deepak's visit and on-site servicing.",
            action: "Deepak mobilized to Dholera, completed required repairs, and verified machine running.",
            logistics: "Required spares and tools carried on site by Deepak.",
            clarification: "Site confirmed machine operational without recurring snags.",
            pendingIssue: "None; unit operational on site.",
            status: "Operational — Repaired and commissioned by technician Deepak; currently running."
        },
        {
            site: "Hardoi Project Site",
            model: "Palfinger Aerial Platform",
            serialNumber: "Hardoi-Unit-01",
            issue: "Depleted battery bank replaced with fresh batteries and unit successfully commissioned.",
            action: "Umesh Kumar and site technician installed replacement battery bank and verified starting.",
            logistics: "Battery bank delivered and installed on site.",
            clarification: "Machine restored to normal client operational shifts.",
            pendingIssue: "None; machine commissioned and operational.",
            status: "Operational — Fresh battery bank installed; machine running on site."
        }
    ],
    parts: [
        {
            part: "Actuator Coil & Rubber Protective Covers (2 Units)",
            context: "Indan / Sanand Site (120ft Boom & Z45)",
            statusNextSteps: "Google Form requisition submitted by Patel ji and Dheeraj; Pardeep Tomar processing store dispatch."
        },
        {
            part: "Hydraulic Hose Pipes (Fabricated Set)",
            context: "Sanand Project Site (CG Power - JLG M600JP)",
            statusNextSteps: "Piping unmounted on site; Dheeraj Dubey releasing ₹2,891 payment today to collect pipes from workshop."
        },
        {
            part: "Toyota 3-Ton Diesel Starter Battery Bank",
            context: "Indan Project Site (Serial 28348)",
            statusNextSteps: "Dispatched from supplier; transit docket and delivery timeline being confirmed by Jitendra Budhauliya."
        },
        {
            part: "S120 Wiring Harness & Sensor Assembly",
            context: "Indan Project Site (Serial 1388)",
            statusNextSteps: "Gate pass prepared; full electrical wiring harness and sensor kit being organized by Pardeep Tomar."
        },
        {
            part: "Genie S-65 Valve Bank & Electrical Harness",
            context: "Client Project Site (S-65 Boom Lift)",
            statusNextSteps: "Specialist Raj Kishore assigned to inspect harness and valve bank before initiating Delhi yard recall."
        },
        {
            part: "Traction Battery Bank (Fresh Set)",
            context: "Mundra Project Site (Genie Z-45 - Serial 4343)",
            statusNextSteps: "Site team ordered to swap exhausted batteries with fresh units to conclude 2-day hydraulic pump testing."
        },
        {
            part: "JCB Wiring Harness & Steering Joystick Controller",
            context: "Mumbai Project Site (Serial Q21437)",
            statusNextSteps: "OEM harness ordered; replacement joystick controller being arranged to resolve one-way tyre cutting issue."
        },
        {
            part: "S-120 Internal Boom Cylinder Seal Kit",
            context: "Field Operations Site (20S Boom Lift)",
            statusNextSteps: "Boom demounting required to trace internal barrel leakage; technician Mantu Dada assigned to inspect."
        },
        {
            part: "Engraved Metal Serial Number Plate",
            context: "Fleet Operations Site (Machine 30047)",
            statusNextSteps: "Original inked plate erased during cleaning; stamped replacement plate requisitioned from central store."
        },
        {
            part: "Hydraulic Fluid (60 Liters)",
            context: "Field Operations Site (Doli / 150ft Boom)",
            statusNextSteps: "Indent submitted by Vinod Kumar Yadav; finance payment approval pending verification."
        }
    ],
    directives: [
        {
            title: "Site Attendance & CRM Punching Device Protocol",
            points: [
                "Technicians facing personal smartphone freezing, storage failure, or app crashes must report immediately to Jay Prakash to avoid absentee marks.",
                "Company evaluation underway regarding standard enterprise operational tablets with dedicated SIMs to isolate heavy ERP work from personal phones.",
                "Backup mechanisms and Google Play Store distribution mandated for all mobile applications to prevent lost expense vouchers and data corruption."
            ]
        },
        {
            title: "Preventive Maintenance & Overhaul for Chronic Breakdowns",
            points: [
                "Machines breaking down repeatedly within 10 days of service (e.g. S-65, S-120) must receive root-cause electrical overhaul rather than piecemeal fixes.",
                "If specialist inspection by Raj Kishore fails to achieve dependable uptime on S-65, unit must be recalled immediately to Delhi yard."
            ]
        },
        {
            title: "Local Workshop Repair Cash Flow Clearance",
            points: [
                "Minor vendor payments for hydraulic hose crimping and pipe fabrication (such as ₹2,891 at Sanand) must be settled instantly to prevent downtime.",
                "Field supervisors authorized to disburse emergency payments from site imprest cash with instant phone approval from Jitendra Budhauliya."
            ]
        }
    ],
    actionItems: [
        {
            person: "Jitendra Budhauliya",
            task: "Track Toyota 3-ton battery transit docket, approve S-65 specialist inspection by Raj Kishore, and expedite M600JP pipe payment."
        },
        {
            person: "Vinay Singh",
            task: "Follow up on Toyota diesel forklift battery dispatch timeline and audit S-65 cumulative breakdown hours for October."
        },
        {
            person: "Pandit Dheeraj Dubey",
            task: "Disburse ₹2,891 vendor payment, collect fabricated hydraulic pipes for M600JP, and fit S-65 replacement components."
        },
        {
            person: "Imran Khan",
            task: "Share hydraulic hose fabricator contact details and facilitate gate pass clearance for Indan S-120 technician."
        },
        {
            person: "Umesh Kumar",
            task: "Replace weak batteries on Mundra Z-45 to conclude pump testing and coordinate OEM harness dispatch for Mumbai JCB Q21437."
        },
        {
            person: "Vinod Kumar Yadav",
            task: "Coordinate with Mantu Dada to demount 20S boom, locate internal cylinder barrel leakage, and confirm hydraulic oil payment."
        },
        {
            person: "Banarasi Yadav",
            task: "Track payment release for 60L hydraulic oil indent, requisition engraved metal serial plate 30047, and alert Jay Prakash on mobile punching issues."
        }
    ]
};

export const meeting22 = {
    id: "meet-2026-10-22",
    title: "22-10-2026",
    date: "2026-10-22",
    dateFormatted: "22-10-2026",
    focus: "Forklift clamp model inventory audit, purchase team coordination, TVH vs local contactor benchmarking, contaminated diesel client escalation, Mumbai JCB bypass wiring investigation, Sanand blown fuse, and same-day CRM reporting mandate.",
    isHoliday: false,
    holidayName: "",
    breakdowns: [
        {
            site: "Sanand Project Site (Blue Star)",
            model: "JLG 2040 Electric Scissor Lift",
            serialNumber: "JLG-2040-Sanand",
            issue: "Chronic operational failures from water ingress and frequent breakdowns; client requested urgent unit replacement.",
            action: "Satendra Kumar and Jitendra Budhauliya initiating formal machine replacement to preserve client account.",
            logistics: "Replacement scissor lift being allocated from fleet stock to swap out failing unit.",
            clarification: "Repeated failures under wet site conditions prompted client management to issue de-hire warning.",
            pendingIssue: "Finalize replacement machine allocation, arrange transit trailer, and swap unit at Sanand.",
            status: "Machine Replacement Authorized — Client requested immediate replacement; swap logistics in progress."
        },
        {
            site: "Fleet Operations Site",
            model: "Genie Z-45 Articulated Boom",
            serialNumber: "Z45-Redan",
            issue: "Brand-new contactor procured from India Liner defective and malfunctioning upon installation.",
            action: "Jitendra Budhauliya instructed Pardeep Tomar to procure sample contactors from both TVH and local vendors for comparison.",
            logistics: "Defective contactor returned to vendor; trial orders being placed with TVH and local suppliers.",
            clarification: "Pardeep to inspect decommissioned original machines to identify OEM manufacturer brand for standardization.",
            pendingIssue: "Source TVH and local contactor samples, evaluate price versus build quality, and standardize fleet supplier.",
            status: "Defective Contactor Replacement — India Liner contactor failed; comparative TVH trial order authorized."
        },
        {
            site: "Client Operations Sites (Sun City)",
            model: "Diesel Heavy Fleet (Multiple Units)",
            serialNumber: "Fleet-Diesel-SunCity",
            issue: "Severe diesel fuel contamination with water and sludge delivered by client, causing fuel pump and injector failures.",
            action: "Satendra Kumar and Ranjan shared video proof; Jitendra Budhauliya scheduling conference call with client leadership.",
            logistics: "Fuel samples and video documentation compiled to present to client management.",
            clarification: "Client-supplied fuel is heavily contaminated; contractor contractually responsible for fuel quality.",
            pendingIssue: "Hold client executive conference call, present fuel contamination evidence, and demand clean diesel supply.",
            status: "Client Fuel Contamination — Water-mixed diesel causing machine failures; client escalation call scheduled."
        },
        {
            site: "Mumbai Project Site",
            model: "JCB Access Platform",
            serialNumber: "JCB-Mumbai-Cross",
            issue: "Unit grounded for 12 days; inspection revealed unauthorized bypass wiring that voided OEM repair clearance.",
            action: "Umesh Kumar and Sushil Mishra demanding photographs of bypassed wiring and ordering OEM replacement harness.",
            logistics: "OEM wiring harness requisitioned from JCB distributor; arrival expected within 2-3 days.",
            clarification: "Service engineer refused to energize machine due to unauthorized jumper wire installed by unknown previous technician.",
            pendingIssue: "Receive photos of bypassed wiring, investigate technician responsibility, and install replacement harness.",
            status: "Critical 12-Day Breakdown — Unauthorized bypass wiring discovered; awaiting replacement harness from OEM."
        },
        {
            site: "Mumbai Project Site",
            model: "Genie Electric Scissor Lift",
            serialNumber: "Genie-Scissor-Mumbai",
            issue: "One-way tyre cutting failure traced to defective joystick controller; test unit confirmed steering functionality.",
            action: "Umesh Kumar coordinating with Pardeep Tomar to dispatch ready P-Con controller with technician Manish Patel.",
            logistics: "P-Con controller to be dismantled from spare machine and dispatched to Mumbai.",
            clarification: "Steering cuts out on one side with original joystick but functions normally with test controller.",
            pendingIssue: "Dismantle ready P-Con controller, dispatch with Manish Patel, and install on machine in Mumbai.",
            status: "Controller Fault — Joystick controller causing one-way tyre cutting; replacement P-Con being dispatched."
        },
        {
            site: "Sanand Project Site",
            model: "JLG 3240 Electric Scissor Lift",
            serialNumber: "B2000138800202",
            issue: "Unit grounded due to blown specialized high-amperage fuse unavailable across local Ahmedabad electrical markets.",
            action: "Khemchand and Pardeep Tomar circulating component photographs across national vendor network for sourcing.",
            logistics: "Detailed fuse photo shared on operations group; express courier dispatch planned upon sourcing.",
            clarification: "Local Ahmedabad distributors could not provide matching specification fuse.",
            pendingIssue: "Source matching high-amperage fuse from Delhi or specialized supplier and courier to Sanand site.",
            status: "Specialized Fuse Blown — Unavailable in Ahmedabad markets; photo circulated for emergency sourcing."
        },
        {
            site: "Sanand Project Site",
            model: "Genie Z-45/30 Electric Boom Lift",
            serialNumber: "Z45-30-Tyres",
            issue: "Severe solid tyre damage requiring replacement; 15-day procurement timeline approved but CRM logging pending.",
            action: "Khemchand submitted Google Form and photos; Jitendra Budhauliya ordered immediate CRM Job Card generation.",
            logistics: "Tyre photos uploaded; requisition registered under 15-day procurement cycle.",
            clarification: "Delay in opening Job Card in CRM obscures actual fleet downtime; same-day reporting mandated.",
            pendingIssue: "Open official CRM Job Card today and track solid tyre shipment from vendor.",
            status: "Tyre Replacement Scheduled — Photos submitted; CRM Job Card being opened under 15-day delivery window."
        },
        {
            site: "Korba Project Site",
            model: "Fleet Machinery",
            serialNumber: "Korba-Unit-01",
            issue: "Diesel engine starting failure; field technician actively replacing starter motor assembly.",
            action: "Anil and Vinod Pal supervising starter motor installation; travel ticket ready if issue persists.",
            logistics: "Replacement starter motor delivered to Korba site.",
            clarification: "Continuous communication maintained with field technician during starter fitment and trial cranking.",
            pendingIssue: "Complete starter motor installation, perform crank testing, and confirm operational status.",
            status: "Starter Installation Active — Technician replacing starter on site; emergency travel ticket on standby."
        },
        {
            site: "Howrah Project Site",
            model: "Fleet Machinery",
            serialNumber: "Howrah-Unit-01",
            issue: "Machine grounded due to dead battery bank requiring new batteries and terminal cables.",
            action: "Vinod Pal submitted battery and cable requisition to central store for urgent dispatch.",
            logistics: "Battery bank and high-capacity cables requisitioned for express freight to Howrah.",
            clarification: "Machine immobilized until fresh battery pack and connecting cables arrive on site.",
            pendingIssue: "Dispatch battery bank and terminal cables to Howrah site and complete installation.",
            status: "Awaiting Battery Dispatch — Requisition logged for batteries and cables; machine grounded on site."
        },
        {
            site: "Bhadrak Project Site (Vedanta)",
            model: "Fleet Machinery",
            serialNumber: "Bhadrak-Vedanta-01",
            issue: "Intermittent starting failure shutting down for 5-10 minutes before self-recovering; gate pass pending.",
            action: "Banarasi Yadav submitted Vedanta plant gate pass; Vinod Pal preparing to trace loose electrical wiring.",
            logistics: "Gate pass application submitted to client security desk awaiting approval.",
            clarification: "Engine and fuel injection systems verified healthy; intermittent short circuit or relay trip suspected.",
            pendingIssue: "Secure approved Vedanta gate pass, enter plant, and perform wiring continuity checks.",
            status: "Gate Pass Pending — Intermittent electrical starting glitch; technician awaiting Vedanta plant gate entry."
        },
        {
            site: "NR Agarwal Project Site",
            model: "Toyota FDZ30 3-Ton Diesel Forklift",
            serialNumber: "28348",
            issue: "Engine overheating issue successfully rectified and machine restored to active running status.",
            action: "Ramavtar Sen completed repairs and verified running; Dinesh verified ticket closure in updated Reach CRM app.",
            logistics: "Cooling system serviced and tested under load.",
            clarification: "Ticket closure was delayed due to legacy CRM mobile app bug; resolved in updated version.",
            pendingIssue: "Uninstall legacy CRM app from technician phones and maintain active monitoring.",
            status: "Operational — Overheating defect resolved, machine running on site, and ticket closed in CRM."
        },
        {
            site: "Bhiwadi Project Site",
            model: "Fleet Machinery (500 Series)",
            serialNumber: "Bhiwadi-500",
            issue: "Hydraulic valve leakage causing pressure loss across boom functions.",
            action: "Service technician mobilized to Bhiwadi site today to overhaul leaking valve assembly.",
            logistics: "Technician on site equipped with replacement seals and valve repair kit.",
            clarification: "Leakage diagnosed yesterday; technician attended site today for rectification.",
            pendingIssue: "Overhaul hydraulic valve, replace worn seals, and perform pressure testing.",
            status: "Technician on Site — Service technician attending unit today to repair hydraulic valve leak."
        }
    ],
    parts: [
        {
            part: "Hydraulic Forklift Clamps (Full Model-Wise Inventory)",
            context: "Fleet Inventory Requisition",
            statusNextSteps: "Dhruv Sharma compiling inventory list by car model; purchase team meeting scheduled today."
        },
        {
            part: "Contactor Assembly (TVH vs Local Comparative Samples)",
            context: "Fleet Operations (Genie Z-45 & Boom Lifts)",
            statusNextSteps: "India Liner contactor failed; Pardeep Tomar ordering samples from TVH and local vendors for comparison."
        },
        {
            part: "JCB Access Platform Wiring Loom & Harness",
            context: "Mumbai Project Site (Cross-Rental Unit)",
            statusNextSteps: "Requisitioned from JCB OEM; awaiting delivery in 2-3 days to replace unauthorized bypass wiring."
        },
        {
            part: "P-Con / J-Con Joystick Steering Controller",
            context: "Mumbai Project Site (Genie Electric Scissor)",
            statusNextSteps: "Defective joystick controller isolated; replacement P-Con controller being dispatched from store."
        },
        {
            part: "High-Amperage Electrical Fuse",
            context: "Sanand Project Site (JLG 3240 - Serial B2000138800202)",
            statusNextSteps: "Unavailable in Ahmedabad local markets; component photograph circulated for emergency Delhi sourcing."
        },
        {
            part: "Solid Industrial Tyres",
            context: "Sanand Project Site (Genie Z-45/30 Electric Boom)",
            statusNextSteps: "Google Form submitted; Job Card being opened under 15-day vendor procurement cycle."
        },
        {
            part: "Starter Motor Assembly",
            context: "Korba Project Site",
            statusNextSteps: "Delivered to site; field technician actively installing and conducting cranking trials."
        },
        {
            part: "Heavy-Duty Battery Bank & Terminal Cables",
            context: "Howrah Project Site",
            statusNextSteps: "Indent submitted to central store; express dispatch being coordinated by Vinod Pal."
        },
        {
            part: "JLG Electronic Control Boards (P-Con / G-Con)",
            context: "Central Store Safety Stock",
            statusNextSteps: "Procurement order verified by Dinesh; awaiting arrival to maintain emergency buffer stock."
        }
    ],
    directives: [
        {
            title: "Contaminated Client Diesel Quality Protocol",
            points: [
                "Technicians must immediately inspect, photograph, and record video evidence of water or sludge in client-supplied fuel.",
                "Formal conference calls must be initiated with client leadership before running engines on contaminated fuel to prevent fuel injection damage."
            ]
        },
        {
            title: "Strict Ban on Unauthorized Bypass Wiring",
            points: [
                "Field engineers and technicians are strictly forbidden from installing jumper wires or bypassing safety control harnesses.",
                "Comprehensive photos of bypassed circuits must be submitted immediately to identify responsible technicians and enforce accountability."
            ]
        },
        {
            title: "Mandatory Same-Day CRM Breakdown Reporting",
            points: [
                "Every equipment breakdown, parts requisition, and tyre replacement must have an official CRM Job Card opened on the exact day of occurrence.",
                "Delays in logging complaints conceal true machine downtime from executive management."
            ]
        },
        {
            title: "Unified Reach CRM Mobile App Migration",
            points: [
                "All field technicians and supervisors must immediately uninstall the obsolete CRM app and use only the updated official Reach app.",
                "Resolved breakdowns must be closed immediately on site to maintain accurate real-time fleet health metrics."
            ]
        }
    ],
    actionItems: [
        {
            person: "Dhruv Sharma",
            task: "Compile model-wise clamp inventory list, record OEM contactor brands, and audit outstanding purchase orders."
        },
        {
            person: "Dinesh",
            task: "Meet with purchase team this morning, confirm arrival of JLG control boards, and track heating resolution in CRM."
        },
        {
            person: "Pardeep Tomar",
            task: "Order comparative contactor samples from TVH and local vendor, dispatch P-Con controller to Mumbai, and source JLG 3240 fuse."
        },
        {
            person: "Jitendra Budhauliya",
            task: "Convene client conference call regarding contaminated diesel, track downtime on Mumbai JCB, and verify Toyota forklift status."
        },
        {
            person: "Umesh Kumar",
            task: "Inquire with operators regarding bypass wiring history on Mumbai JCB, supervise Korba starter fitment, and check electrical circuits."
        },
        {
            person: "Vinod Pal",
            task: "Supervise Korba starter motor replacement, follow up on Howrah battery dispatch, and secure Vedanta plant gate pass at Bhadrak."
        },
        {
            person: "Khemchand",
            task: "Submit detailed CRM Job Card for Z45/30 solid tyres and circulate blown fuse photograph for emergency sourcing."
        },
        {
            person: "Sushil Mishra",
            task: "Enforce immediate same-day CRM reporting across all site teams and coordinate Mumbai cross-rental machine repairs."
        },
        {
            person: "Ramavtar Sen",
            task: "Complete closure of Toyota FDZ30 overheating ticket in updated Reach app and monitor ongoing shift operation."
        }
    ]
};

async function verifyMeeting(meetingData) {
    console.log(`\n🔍 Running Mandatory Verification Check for ${meetingData.id} (${meetingData.title})...`);

    // Check Master Record
    const { data: master, error: masterErr } = await supabaseAdmin
        .from('meetings')
        .select('*')
        .eq('id', meetingData.id)
        .single();

    if (masterErr || !master) {
        throw new Error(`Master record ${meetingData.id} verification failed: ${masterErr?.message}`);
    }

    // Check Child Record Counts
    const [breakdownsRes, partsRes, directivesRes, actionsRes] = await Promise.all([
        supabaseAdmin.from('breakdown_machines').select('id', { count: 'exact' }).eq('meeting_id', meetingData.id),
        supabaseAdmin.from('meeting_parts').select('id', { count: 'exact' }).eq('meeting_id', meetingData.id),
        supabaseAdmin.from('meeting_directives').select('id', { count: 'exact' }).eq('meeting_id', meetingData.id),
        supabaseAdmin.from('meeting_action_items').select('id', { count: 'exact' }).eq('meeting_id', meetingData.id)
    ]);

    console.log(`📊 Master Record: ${master.id} | Date: ${master.date} | Title: ${master.title} | Holiday: ${master.is_holiday}`);
    console.log(`   - Breakdowns count: DB=${breakdownsRes.count} | Payload=${meetingData.breakdowns.length}`);
    console.log(`   - Parts count: DB=${partsRes.count} | Payload=${meetingData.parts.length}`);
    console.log(`   - Directives count: DB=${directivesRes.count} | Payload=${meetingData.directives.length}`);
    console.log(`   - Action Items count: DB=${actionsRes.count} | Payload=${meetingData.actionItems.length}`);

    const countsMatch = (
        breakdownsRes.count === meetingData.breakdowns.length &&
        partsRes.count === meetingData.parts.length &&
        directivesRes.count === meetingData.directives.length &&
        actionsRes.count === meetingData.actionItems.length
    );

    if (!countsMatch) {
        throw new Error(`❌ Verification failed for ${meetingData.id}: Child counts in DB do not match payload!`);
    }

    console.log(`✅ All verification checks PASSED for ${meetingData.id}!`);
}

async function run() {
    console.log('====================================================');
    console.log('🚀 Reach International Daily Meeting Supabase Ingestion (20-22 Oct 2026)');
    console.log('====================================================');

    // 1. Ingest 20-10-2026 (Dussehra Holiday)
    console.log('\n📥 Ingesting Meeting: 20-10-2026 (Dussehra Holiday)...');
    const res20 = await syncDailyMeeting(meeting20);
    console.log(`✅ Successfully synced ${res20.meetingId}: Holiday=${res20.title}`);
    await verifyMeeting(meeting20);

    // 2. Ingest 21-10-2026
    console.log('\n📥 Ingesting Meeting: 21-10-2026...');
    const res21 = await syncDailyMeeting(meeting21);
    console.log(`✅ Successfully synced ${res21.meetingId}:`);
    console.log(`   - ${res21.counts.breakdowns} breakdown machines`);
    console.log(`   - ${res21.counts.parts} parts`);
    console.log(`   - ${res21.counts.directives} directives`);
    console.log(`   - ${res21.counts.actionItems} action items`);
    await verifyMeeting(meeting21);

    // 3. Ingest 22-10-2026
    console.log('\n📥 Ingesting Meeting: 22-10-2026...');
    const res22 = await syncDailyMeeting(meeting22);
    console.log(`✅ Successfully synced ${res22.meetingId}:`);
    console.log(`   - ${res22.counts.breakdowns} breakdown machines`);
    console.log(`   - ${res22.counts.parts} parts`);
    console.log(`   - ${res22.counts.directives} directives`);
    console.log(`   - ${res22.counts.actionItems} action items`);
    await verifyMeeting(meeting22);

    console.log('\n====================================================');
    console.log('🎉 ALL MEETINGS (20-OCT, 21-OCT, 22-OCT) SUCCESSFULLY INGESTED & VERIFIED IN SUPABASE!');
    console.log('====================================================');
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
    run().catch(err => {
        console.error('❌ Ingestion or verification failed:', err);
        process.exit(1);
    });
}
