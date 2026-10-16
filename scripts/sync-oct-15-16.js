/**
 * Reach International Operations - Daily Meeting Sync (15-10-2026 & 16-10-2026)
 *
 * Implements strict Reach International standards:
 * - 100% Cloud-Native ingestion (zero static JSON files in src/data/)
 * - Strictly ONE machine per breakdown card
 * - Concise, single-line informative fields across all sections
 * - Accurate English translation and distillation of raw Hindi meeting transcripts
 * - Direct Supabase ingestion with automated verification check (Step A, B, C)
 */

import { syncDailyMeeting, supabaseAdmin } from './sync-daily-meeting.js';

export const meeting15 = {
    id: "meet-2026-10-15",
    title: "15-10-2026",
    date: "2026-10-15",
    dateFormatted: "15-10-2026",
    focus: "Sanand M600JP hydraulic leak and burned charger, JCB electric emergency cable failure, Samsung RT gearbox bearing and battery backup, Hardoi Palfinger battery warranty recall, and Jamnagar site vehicle logistics.",
    isHoliday: false,
    holidayName: "",
    breakdowns: [
        {
            site: "Micron Project Site, Sanand",
            model: "JLG M600JP",
            serialNumber: "M600JP-Sanand",
            issue: "Hydraulic cylinder valve leakage and 48V battery charger burned during diagnostic charging.",
            action: "Pardeep Tomar dispatched replacement charger while Pandit Dheeraj plans morning charging to march unit out.",
            logistics: "Replacement 48V battery charger dispatched from central yard via express courier.",
            clarification: "Depleted battery charge prevents long marching required to exit clean plant area without recharging.",
            pendingIssue: "Receive replacement charger, charge unit, march out of clean area, and overhaul hydraulic cylinder valve.",
            status: "Electrical & Hydraulic Breakdown — Charger burned and hydraulic valve leaking; replacement charger in transit."
        },
        {
            site: "Sanand Project Site",
            model: "JCB S3240E Electric Drive",
            serialNumber: "JCB-3240-Sanand",
            issue: "Platform emergency lowering release cable snapped, leaving machine grounded.",
            action: "Dinesh ordered model-specific cable while Dhruv Sharma directed sourcing from local Ahmedabad JCB dealership.",
            logistics: "Emergency cable part number 300 requisitioned; local dealer availability under active inquiry.",
            clarification: "Common stock cables only fit hydraulic-drive models; electric-drive version requires dedicated cable.",
            pendingIssue: "Expedite local Ahmedabad dealer delivery or express courier and fit emergency release cable.",
            status: "Safety Breakdown — Platform emergency cable broken; local JCB dealer procurement underway."
        },
        {
            site: "Samsung Project Site, Noida",
            model: "Rough Terrain (RT) Boom Lift",
            serialNumber: "RT-Samsung-01",
            issue: "Gearbox and drive hub bearings failed, keeping machine grounded for nearly one month.",
            action: "Dhruv Sharma instructed finance to release payment by 12:00 PM for supplier dispatch to site by 3:00 PM today.",
            logistics: "Replacement gearbox bearings received at supplier warehouse awaiting payment release.",
            clarification: "Client head Devendra issued stern escalation threatening de-hire and cancellation of all three on-site units.",
            pendingIssue: "Clear vendor payment, secure dispatch by 3:00 PM today, and fit bearings immediately upon arrival.",
            status: "Drive Breakdown — Gearbox and hub bearing failure; vendor payment and site dispatch in progress."
        },
        {
            site: "Samsung Project Site, Noida",
            model: "Rough Terrain (RT) Scissor Lift",
            serialNumber: "RT-Samsung-02",
            issue: "Traction battery bank degraded, delivering barely one hour of operational runtime after full charge.",
            action: "Shiv Uniyal and Rahul Singh arranging replacement battery cells to restore full shift operational autonomy.",
            logistics: "Replacement battery cells identified from fleet inventory and scheduled for express site transfer.",
            clarification: "Severe runtime drop disrupts client production schedule, compounding escalation at Samsung facility.",
            pendingIssue: "Deliver replacement battery cells to site, replace degraded cells, and test discharge under load.",
            status: "Battery Breakdown — Traction runtime collapsed to 1 hour; replacement cells scheduled for installation."
        },
        {
            site: "NCR-2 Project Site",
            model: "Access Boom Lift",
            serialNumber: "NCR-2-Boom-01",
            issue: "Machine grounded for 7-8 days awaiting gearbox bearing replacement following prior 5-day tyre delay.",
            action: "Rahul Singh coordinating with Sushil Mishra and commercial stores to expedite single pending gearbox bearing.",
            logistics: "Single gearbox bearing sourced and queued for immediate delivery.",
            clarification: "Unit stood for 5 days due to tyre damage and now faces additional downtime awaiting one specific gearbox bearing.",
            pendingIssue: "Receive pending gearbox bearing, install into drive assembly, and commission machine.",
            status: "Drive Breakdown — Grounded awaiting gearbox bearing; shipment follow-up in progress."
        },
        {
            site: "Chandigarh Project Site",
            model: "Genie GS-3240",
            serialNumber: "GS-3240-Chandigarh",
            issue: "On-board 24V battery charger burned out, preventing unit from recharging.",
            action: "Pardeep Tomar requested battery specification photo (flooded vs AGM) to dispatch matching charger.",
            logistics: "Replacement 24V charger ready at central store pending battery chemistry photo confirmation.",
            clarification: "Rahul Singh confirmed flooded lead-acid battery and is sending photo from site technician Manu.",
            pendingIssue: "Verify battery specification photograph, dispatch replacement charger via passenger train courier, and return defective unit.",
            status: "Electrical Breakdown — 24V battery charger burned; photo confirmation and dispatch pending."
        },
        {
            site: "Hyderabad Project Site",
            model: "Electric Scissor Lift",
            serialNumber: "Hyd-Scissor-01",
            issue: "Traction battery bank depleted and failing to sustain charge, causing 15 to 18 days of downtime.",
            action: "Dhruv Sharma instructed logistics to transmit courier tracking/docket number to Rahul Singh for client assurance.",
            logistics: "Replacement battery bank dispatched under airway bill / docket number.",
            clarification: "Prolonged 18-day downtime caused critical client escalation regarding equipment reliability.",
            pendingIssue: "Track courier delivery, install battery pack upon arrival, and commission machine.",
            status: "Battery Breakdown — Grounded 18 days; replacement battery bank in transit with docket number issued."
        },
        {
            site: "Hardoi Project Site",
            model: "Palfinger Aerial Platform",
            serialNumber: "Palfinger-Hardoi",
            issue: "Battery bank degraded and failing to operate hydraulic boom functions.",
            action: "Dhruv Sharma ordered defective warranty batteries removed for return to central yard and AGM charger dispatched.",
            logistics: "Umesh Kumar providing site address and GST details to Pardeep Tomar for courier pickup and charger dispatch.",
            clarification: "Batteries are under active manufacturer warranty and require formal RMA testing at central workshop.",
            pendingIssue: "Pack and consign defective batteries to central yard and dispatch dedicated AGM charger.",
            status: "Warranty Recall — Defective batteries approved for yard return; AGM charger dispatch in progress."
        },
        {
            site: "Mundra Project Site",
            model: "JCB 45 Electric Boom",
            serialNumber: "JCB-45-Mundra",
            issue: "Machine grounded for 23 days due to depleted traction battery bank, triggering client de-hire threat.",
            action: "Pardeep Tomar confirmed replacement batteries dispatched and reaching Ahmedabad transit hub today.",
            logistics: "Replacement battery set routed via Ahmedabad logistics hub arriving at Mundra tomorrow.",
            clarification: "Client threatened formal de-hire due to 23 days of unresolved downtime; docket details shared to pacify client.",
            pendingIssue: "Receive battery consignment at Mundra tomorrow, complete installation, and return machine to service.",
            status: "Critical Battery Breakdown — 23 days grounded; replacement batteries arriving tomorrow via Ahmedabad."
        },
        {
            site: "Mundra Project Site",
            model: "Genie S-60",
            serialNumber: "Unit S-60-Mundra",
            issue: "Main boom power loom wiring harness burned black and rotten inside, causing severe voltage drop and platform control failure.",
            action: "Pritam Singh temporarily bypassed emergency ground controls; complete boom wiring loom replacement requested.",
            logistics: "Complete main boom wiring loom harness requisitioned from central store.",
            clarification: "Rotten power loom cable restricts current flow, disabling platform controls while ground emergency circuit functions.",
            pendingIssue: "Dispatch and pull new heavy-duty power loom cable through boom track.",
            status: "Electrical Loom Breakdown — Burned and decomposed boom power loom cable; harness replacement required."
        },
        {
            site: "Mundra Project Site",
            model: "Genie GS-5390 RT",
            serialNumber: "GS-5390-Mundra",
            issue: "Platform up/down toggle switch and jack level control lever snapped off by unauthorized client workers during night shift.",
            action: "Pritam Singh temporarily soldered the switch terminals and demanded Reach operator deployment to prevent tampering.",
            logistics: "Platform console toggle switch assembly and joystick lever requested from store.",
            clarification: "Machine operated without an assigned Reach operator during night shift, leading to rough handling and broken control levers.",
            pendingIssue: "Fit durable replacement toggle lever switch and enforce Reach operator gate pass clearance.",
            status: "Platform Console Damage — Toggle levers snapped by unauthorized night operation; temporary soldering done."
        },
        {
            site: "Central Yard (Faridabad)",
            model: "Electric Articulated Boom",
            serialNumber: "Yard-Bangalore-Prep",
            issue: "Unit undergoing mechanical overhaul, wheel rim fitment, and traction battery assembly for Bangalore deployment.",
            action: "Shiv Uniyal and Pardeep Tomar ordered wheel rims and battery cells to complete testing prior to festive rush.",
            logistics: "Replacement rims and battery pack placed on priority procurement.",
            clarification: "Bangalore client requires machine mobilization before festive holiday shutdown begins.",
            pendingIssue: "Complete rim fitment, paint touch-ups, and final PDI before loading onto Bangalore trailer.",
            status: "Yard Overhaul — Rims and battery ordered; prepping for Bangalore dispatch before festive season."
        }
    ],
    parts: [
        {
            part: "Gearbox & Wheel Bearings",
            context: "Samsung Project Site, Noida (Rough Terrain Units)",
            statusNextSteps: "Supplier payment clearing at 12:00 PM; dispatch scheduled by 3:00 PM today."
        },
        {
            part: "JCB Electric Emergency Lowering Wire",
            context: "Sanand Project Site (JCB 3240 Electric Scissor)",
            statusNextSteps: "Local Ahmedabad JCB dealership stock being checked for same-day delivery."
        },
        {
            part: "24V Battery Charger (Flooded Lead-Acid)",
            context: "Chandigarh Project Site (Genie GS-3240)",
            statusNextSteps: "Battery photo requested from Manu; charger to be dispatched via express courier."
        },
        {
            part: "JLG M600JP 48V Battery Charger",
            context: "Sanand Project Site (Micron)",
            statusNextSteps: "Dispatched from central yard by Pardeep Tomar; expected on site today."
        },
        {
            part: "Wheel Rims (Hyundai 2-Ton & 3-Ton Forklifts)",
            context: "Samsung & Bawal Fleet Maintenance",
            statusNextSteps: "Bawal shipment in transit; 1 complete set each for 2-ton and 3-ton placed on inventory order."
        },
        {
            part: "Solid Tyres (15x5)",
            context: "Jamui Project Site (JLG 4047 Electric Scissor)",
            statusNextSteps: "BOBS invoice prepared for 8 tyres; payment approval and dispatch pending."
        },
        {
            part: "Main Boom Power Loom Cable Harness",
            context: "Mundra Project Site (Genie S-60)",
            statusNextSteps: "Requisitioned from central store to replace burned and decomposed cable."
        },
        {
            part: "Platform Toggle & Jack Lever Switches",
            context: "Mundra Project Site (Genie GS-5390)",
            statusNextSteps: "Temporary solder repair completed; replacement switchgear requested from central store."
        }
    ],
    directives: [
        {
            title: "CRM 2.0 Mobile App Reporting & Manual Protocol",
            points: [
                "Every machine breakdown, part requisition, and repair closure must be logged directly through the CRM mobile application.",
                "Cross-rented machines not in CRM must be documented via manual service sheets until added by Shiv Uniyal within 5 minutes.",
                "Technicians must establish direct telephone contact with site operators before traveling to accurately diagnose symptoms."
            ]
        },
        {
            title: "Return Core Accountability & Package Labeling Standard",
            points: [
                "Every returned part box must contain a physical packing slip specifying machine model, serial number, and exact part name.",
                "Unidentified or unlabelled parts returned to the central store will not be deducted from the technician's inventory liability ledger.",
                "Laptops and high-value diagnostic tools must be packed in designated serialized bags with personal accountability."
            ]
        },
        {
            title: "Local Site Mobility & Fast-Track Logistics Approvals",
            points: [
                "Site supervisors must arrange local transportation within large industrial plants (e.g. Jamnagar) with gate-pass vehicles.",
                "Rental and transport authorizations must be fast-tracked through Jitendra Budhauliya, Sushil Mishra, or Shiv Uniyal."
            ]
        }
    ],
    actionItems: [
        { person: "Dinesh", task: "Coordinate with local Ahmedabad JCB dealership to source electric-drive emergency cable for Sanand 3240." },
        { person: "Sushil Mishra & Anil", task: "Conduct comprehensive inventory review of fast-moving JCB spare parts and maintain safety stock." },
        { person: "Shiv Uniyal", task: "Expedite vendor payment for Samsung gearbox bearings by 12:00 PM and dispatch to site by 3:00 PM today." },
        { person: "Rahul Singh", task: "Share Hyderabad battery tracking docket with client and obtain Chandigarh GS-3240 battery photograph from Manu." },
        { person: "Pardeep Tomar", task: "Dispatch 24V charger for Chandigarh GS-3240 and reconcile return parts ledger for Sanand technicians." },
        { person: "Umesh Kumar", task: "Provide GST details and Hardoi site address to Pardeep Tomar for Palfinger battery warranty return." },
        { person: "Satendra Kumar", task: "Arrange local plant vehicle entry pass for technicians inside Jamnagar refinery site." },
        { person: "Pritam Singh", task: "Re-wire emergency power circuit on Mundra S-60 and install replacement platform toggle switches on GS-5390." },
        { person: "Pandit Dheeraj Dubey", task: "Inspect plant incoming charging socket voltage at Sanand and march M600JP outside upon receiving charger." }
    ]
};

export const meeting16 = {
    id: "meet-2026-10-16",
    title: "16-10-2026",
    date: "2026-10-16",
    dateFormatted: "16-10-2026",
    focus: "Guwahati S-65 diagnostic card and hydraulic hose fabrication, Bhadrak 35-ton jack procurement, Renukoot multi-unit pre-mobilization overhaul, Sanand M600JP voltage check and march out, and Mundra starter motor repair.",
    isHoliday: false,
    holidayName: "",
    breakdowns: [
        {
            site: "Guwahati Project Site",
            model: "Genie S-65",
            serialNumber: "S-65-Guwahati",
            issue: "Machine down for electronic card configuration and custom high-pressure hydraulic hose replacement.",
            action: "Pravesh Yadav received control card, got hydraulic hose crimped at LG Hardware, and awaits diagnostic laptop tomorrow.",
            logistics: "Control card delivered; diagnostic laptop arriving tomorrow at 12:00 PM via express courier.",
            clarification: "Client clean room operation halted; laptop required to calibrate control parameters and clear interlocks.",
            pendingIssue: "Receive diagnostic laptop tomorrow noon, calibrate control card, install fabricated hydraulic hose, and commission unit.",
            status: "Card & Hydraulic Repair — Control card received and hose fabricated; diagnostic laptop arriving tomorrow for calibration."
        },
        {
            site: "Guwahati Project Site",
            model: "Telescopic Boom Lift",
            serialNumber: "Boom-Skyguard-Guwahati",
            issue: "Skyguard secondary guarding system damaged and siren triggered repeatedly due to workers hanging heavy safety belts.",
            action: "Pravesh Yadav repaired severed cable and warned site supervisor against hanging harnesses on the safety bar.",
            logistics: "Safety cable and sensor wiring restored using on-site electrical repair kit.",
            clarification: "Untrained client workers hang heavy harnesses and toolbelts on the Skyguard trigger sensor, causing false alarm cutouts.",
            pendingIssue: "Conduct tool-box safety briefing with client site supervisors to prevent harness suspension on Skyguard.",
            status: "Safety System Damage — Skyguard trigger cable repaired; supervisor safety briefing scheduled."
        },
        {
            site: "Bhadrak Project Site",
            model: "Fleet Heavy Equipment",
            serialNumber: "Fleet-Bhadrak",
            issue: "Maintenance stalled on wheel hub and cylinder assemblies due to recurring dependence on external hydra crane rentals.",
            action: "Vinod Pal procured dedicated 35-ton hydraulic jack locally to eliminate ₹7,000 per visit crane expenses.",
            logistics: "35-ton heavy-duty hydraulic jack purchased from local distributor following bank transfer confirmation.",
            clarification: "Permanent 35-ton jack enables on-site axle and cylinder servicing and can be mobilized across regional project sites.",
            pendingIssue: "Verify NEFT payment clearance at shop counter and mobilize 35-ton hydraulic jack to work area.",
            status: "Tooling Procurement — 35-ton hydraulic jack purchased to eliminate recurring external hydra rental costs."
        },
        {
            site: "Haldia Project Site",
            model: "JLG 1500SJ Ultra Boom",
            serialNumber: "1500SJ-Haldia",
            issue: "Off-rent released machine standing on site requiring comprehensive mechanical servicing and hydraulic seal inspection.",
            action: "Anil and regional service team mobilizing today following lifting of local administrative work restrictions.",
            logistics: "Standard maintenance tooling and hydraulic inspection consumables available on site.",
            clarification: "Local government administrative restrictions halted all industrial site activities across West Bengal yesterday.",
            pendingIssue: "Execute complete multi-point mechanical inspection and hydraulic cylinder seal checks.",
            status: "Off-Rent Inspection — Released unit undergoing comprehensive multi-point maintenance following work resumption."
        },
        {
            site: "Haldia Project Site",
            model: "Genie S-80",
            serialNumber: "S-80-Haldia",
            issue: "Released machine requiring engine preventive maintenance, filter replacement, and function tests before re-hire.",
            action: "Anil assigned to conduct fluid change, filter service, and full-height boom operational testing.",
            logistics: "Engine oil and OEM filter kit queued for fitment on site.",
            clarification: "Machine released from prior contractor and scheduled for immediate redeployment to upcoming refinery project.",
            pendingIssue: "Complete preventive maintenance service and document functional test run in CRM.",
            status: "Off-Rent Servicing — Scheduled for PM fluid service and functional sign-off prior to redeployment."
        },
        {
            site: "Haldia Project Site",
            model: "Genie S-125 (2024 Model)",
            serialNumber: "S-125-Haldia-2024",
            issue: "New 2024 model standing released requiring pre-delivery inspection (PDI) and diagnostic check.",
            action: "Vinod Pal coordinating with Anil to initiate PDI checklist and sensor diagnostic review today.",
            logistics: "OEM digital diagnostic interface and multi-meter arranged for sensor calibration.",
            clarification: "State administrative shutdown delayed technical handover; work initiated today without client interference.",
            pendingIssue: "Complete sensor calibration, boom telemetry inspection, and issue readiness certificate.",
            status: "PDI & Commissioning — Resuming post-shutdown technical audit and sensor calibration for redeployment."
        },
        {
            site: "Renukoot Project Site",
            model: "JLG 800AJ",
            serialNumber: "Unit 800-1-Renukoot",
            issue: "Standing off-rent with minor electrical and hydraulic defects needing rectification before direct site transfer.",
            action: "Jitendra Budhauliya directed Sudesh Pal to visit Renukoot directly from Lakhimpur to inspect and rectify all defects.",
            logistics: "Maintenance spares and technician toolkits routed directly with Sudesh Pal.",
            clarification: "Performing on-site repairs at Renukoot eliminates wasteful round-trip freight costs to the central yard.",
            pendingIssue: "Sudesh Pal to arrive on site, rectify electrical/hydraulic snags, and certify unit for immediate trucking.",
            status: "Pre-Transfer Overhaul — Assigned to Sudesh Pal for complete snag clearance prior to direct site mobilization."
        },
        {
            site: "Renukoot Project Site",
            model: "Genie S-80",
            serialNumber: "Unit S-80-Renukoot",
            issue: "Released boom lift with minor hydraulic weeping and loose platform switchgear requiring pre-mobilization tune-up.",
            action: "Sudesh Pal scheduled to conduct fluid top-up, hose tightening, and control console verification.",
            logistics: "Hydraulic seals and electrical terminal connectors assigned to mobile technician kit.",
            clarification: "Direct site-to-site transfer approved by Imran Khan once technical clearance is signed off by Sudesh.",
            pendingIssue: "Complete pre-dispatch inspection and secure commercial trailer for direct transit.",
            status: "Pre-Transfer Maintenance — Standing released; technical snag rectification assigned to Sudesh Pal."
        },
        {
            site: "Renukoot Project Site",
            model: "Boom Lift (Unit 3)",
            serialNumber: "Renukoot-Unit-03",
            issue: "Off-rent unit standing idle requiring battery charging, safety cutout inspection, and engine servicing.",
            action: "Sudesh Pal tasked with servicing engine, checking battery health, and confirming limit switch interlocks.",
            logistics: "Battery charger and engine filter consumables arranged for on-site servicing.",
            clarification: "Part of 3-4 machine fleet batch scheduled for immediate relocation to high-priority industrial site.",
            pendingIssue: "Execute battery load test and functional limit switch verification.",
            status: "Pre-Transfer Servicing — Awaiting technical inspection and battery verification by Sudesh Pal."
        },
        {
            site: "Regional Project Site (Near Renukoot)",
            model: "120ft Telescopic Boom Lift",
            serialNumber: "Boom-120-Regional",
            issue: "Hydraulic solenoid valve coil burned out, causing function interlock failure on boom functions.",
            action: "Sitaram coordinating site gate pass issuance to access machine and replace defective solenoid coil.",
            logistics: "Replacement solenoid valve coil in transit to site with technician Sitaram.",
            clarification: "Client security protocol requires 24-hour advance gate pass approval before technician can enter plant.",
            pendingIssue: "Obtain client security gate pass approval and install replacement solenoid coil.",
            status: "Solenoid Coil Breakdown — Burned solenoid coil; gate pass processing for technician Sitaram in progress."
        },
        {
            site: "Micron Project Site, Sanand",
            model: "JLG M600JP",
            serialNumber: "M600JP-Sanand",
            issue: "Hydraulic cylinder valve weeping; two consecutive replacement chargers burned due to suspect site voltage.",
            action: "Jitendra instructed Dheeraj to test plant AC supply voltage, charge unit from 7:00 AM, and march outside by noon.",
            logistics: "New replacement battery charger dispatched yesterday arriving on site today.",
            clarification: "Plant supply fluctuations suspected in burning previous chargers; full electrical supply check mandated before connection.",
            pendingIssue: "Verify supply voltage at AC outlet, connect charger at 7:00 AM, march machine out, and replace cylinder valve.",
            status: "Electrical & Hydraulic Service — Charger arriving today; supply voltage verification and march-out scheduled."
        },
        {
            site: "Dholera Project Site",
            model: "JLG 450AJ Boom Lift",
            serialNumber: "45-50-Dholera",
            issue: "Hydraulic boom pressure sensor malfunctioning, preventing boom elevation interlock release.",
            action: "Deepak mobilized to Dholera site with replacement pressure sensors to calibrate hydraulic pressure circuit.",
            logistics: "Two replacement pressure sensors issued from store and carried directly by technician Deepak.",
            clarification: "Pressure sensor signal cutoff locks out boom lift functions as a fail-safe safety mechanism.",
            pendingIssue: "Install replacement pressure sensor, calibrate hydraulic cutoff threshold, and test boom elevation.",
            status: "Sensor Breakdown — Pressure sensor defective; technician Deepak on site for installation and calibration."
        },
        {
            site: "Micron Project Site, Sanand",
            model: "Genie Electric Boom",
            serialNumber: "Genie-Sanand-01",
            issue: "Unit experienced battery terminal sulfur buildup and low voltage; serviced and test-operated for two consecutive days.",
            action: "Sandeep cleaned battery terminals, verified cell gravities, completed commissioning, and handed over to plant.",
            logistics: "Battery maintenance kit and terminal cleaning compounds utilized on site.",
            clarification: "Full shift trial operation confirmed stable voltage under heavy continuous duty cycle.",
            pendingIssue: "Log digital commissioning report in CRM and transfer technician Sandeep to Mundra site.",
            status: "Operational — Battery bank desulfated, terminals cleaned, and machine restored to full duty cycle."
        },
        {
            site: "Mundra Project Site",
            model: "Engine-Driven Boom Lift",
            serialNumber: "Boom-Starter-Mundra",
            issue: "Diesel engine starter motor burned out/failed to crank, keeping machine stranded.",
            action: "Jitendra Budhauliya issued immediate approval for local starter motor rewinding/repair in Mundra town.",
            logistics: "Local auto-electrical rewinding workshop contracted in Mundra for same-day turnaround.",
            clarification: "Technicians delayed repair awaiting corporate approvals; Jitendra clarified local repairs under ₹5,000 are pre-approved.",
            pendingIssue: "Remove starter motor, deliver to local workshop for armature rewinding, reinstall, and test crank.",
            status: "Starter Breakdown — Diesel engine starter motor failed; local rewinding repair approved and in progress."
        },
        {
            site: "Mundra Project Site",
            model: "JCB 45 Electric Boom",
            serialNumber: "JCB-45-Mundra",
            issue: "Grounded 23 days due to exhausted AGM traction batteries; client threatening formal contract de-hire.",
            action: "Pardeep Tomar tracked replacement batteries through Ahmedabad hub, reaching Mundra site tomorrow.",
            logistics: "Replacement battery consignment arriving at Mundra tomorrow; technician Sandeep ticketing tonight.",
            clarification: "Sushil Mishra pursuing warranty compensation while replacement pack is installed to save client contract.",
            pendingIssue: "Receive battery consignment tomorrow, deploy Sandeep upon arrival from Sanand, and complete installation.",
            status: "Critical Battery Breakdown — Replacement batteries arriving tomorrow; technician Sandeep traveling to install."
        }
    ],
    parts: [
        {
            part: "Custom High-Pressure Hydraulic Hose",
            context: "Guwahati Project Site (Genie S-65)",
            statusNextSteps: "Crimped and fabricated locally at LG Hardware; awaiting installation upon card calibration."
        },
        {
            part: "Genie S-65 Electronic Control Card",
            context: "Guwahati Project Site",
            statusNextSteps: "Received on site; diagnostic laptop arriving tomorrow at 12:00 PM for parameter calibration."
        },
        {
            part: "35-Ton Heavy-Duty Hydraulic Jack",
            context: "Bhadrak Maintenance Workshop",
            statusNextSteps: "Procured locally following NEFT payment confirmation to replace expensive hydra crane rentals."
        },
        {
            part: "Hydraulic Boom Pressure Sensors (Qty 2)",
            context: "Dholera Project Site (Machine 45-50)",
            statusNextSteps: "Dispatched from central store and carried by technician Deepak for immediate installation."
        },
        {
            part: "Hydraulic Solenoid Valve Coil",
            context: "Regional Project Site Near Renukoot (120ft Boom)",
            statusNextSteps: "In transit with technician Sitaram; site gate pass processing in progress."
        },
        {
            part: "JLG M600JP 48V Heavy-Duty Charger",
            context: "Sanand Project Site (Micron)",
            statusNextSteps: "Dispatched from central yard yesterday; reaching site today for controlled morning charging."
        },
        {
            part: "Engine Starter Motor Armature / Assembly",
            context: "Mundra Project Site",
            statusNextSteps: "Local auto-electrical rewinding and overhaul authorized by Jitendra Budhauliya in Mundra."
        },
        {
            part: "AGM Traction Battery Bank (6V Cells)",
            context: "Mundra Project Site (JCB 45)",
            statusNextSteps: "In transit via Ahmedabad hub; scheduled to reach Mundra project site tomorrow morning."
        }
    ],
    directives: [
        {
            title: "Incoming AC Voltage Audit for Battery Chargers",
            points: [
                "Technicians must test AC line voltage and phase stability with a multimeter before plugging in replacement chargers.",
                "Sanand site must schedule M600JP charging during early morning hours to permit clean room exit by 11:00 AM.",
                "Damaged chargers must be preserved in original casings and returned to central store for warranty analysis."
            ]
        },
        {
            title: "Local Repair Empowerment & Fast-Track Turnaround",
            points: [
                "Site supervisors are authorized to execute minor local repairs (e.g. starter rewinding, hose crimping) without delay.",
                "Emergency financial approvals must be finalized via instant group conference with Jitendra Budhauliya or Sushil Mishra.",
                "Cross-rented machines requiring filter and oil service must have quotations submitted to clients by Dinesh."
            ]
        },
        {
            title: "Store Return Ledger Reconciliation & Personal Accountability",
            points: [
                "All core returns (controllers, joysticks, batteries) must be communicated directly to Pardeep Tomar with serial numbers.",
                "Items redirected between sites (e.g. Guwahati to Jaipur) must be formally logged to clear personal store liability.",
                "Diagnostic laptops and proprietary analyzers must be tracked under personal sign-off with dedicated protective bags."
            ]
        }
    ],
    actionItems: [
        { person: "Pravesh Yadav", task: "Install fabricated hydraulic hose and calibrate S-65 control card upon receiving laptop tomorrow at 12:00 PM." },
        { person: "Vinod Pal", task: "Collect 35-ton hydraulic jack from vendor and supervise Haldia multi-unit maintenance resumption." },
        { person: "Sudesh Pal", task: "Travel from Lakhimpur to Renukoot to inspect and certify three off-rent machines for direct site transfer." },
        { person: "Sitaram", task: "Obtain client security gate pass and install replacement hydraulic solenoid coil on 120ft boom." },
        { person: "Pandit Dheeraj Dubey", task: "Test plant socket AC voltage, connect replacement charger at 7:00 AM, and march M600JP outside for valve repair." },
        { person: "Deepak", task: "Install and calibrate replacement hydraulic pressure sensors on machine 45-50 at Dholera site." },
        { person: "Sandeep", task: "Submit Sanand digital commissioning report in CRM and travel to Mundra tonight for JCB 45 battery installation." },
        { person: "Jitendra Budhauliya", task: "Follow up Mundra starter motor local repair and clear pending electricity utility bills for Bhadrak site." },
        { person: "Pardeep Tomar", task: "Reconcile personal store return ledgers for Pravesh Yadav, Satendra Kumar, and Sanand technicians." }
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

    console.log(`📊 Master Record: ${master.id} | Date: ${master.date} | Title: ${master.title}`);
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
    console.log('🚀 Reach International Daily Meeting Supabase Ingestion');
    console.log('====================================================');

    // 1. Ingest 15-10-2026
    console.log('\n📥 Ingesting Meeting: 15-10-2026...');
    const res15 = await syncDailyMeeting(meeting15);
    console.log(`✅ Successfully synced ${res15.meetingId}:`);
    console.log(`   - ${res15.counts.breakdowns} breakdown machines`);
    console.log(`   - ${res15.counts.parts} parts`);
    console.log(`   - ${res15.counts.directives} directives`);
    console.log(`   - ${res15.counts.actionItems} action items`);

    // Verify 15-10-2026
    await verifyMeeting(meeting15);

    // 2. Ingest 16-10-2026
    console.log('\n📥 Ingesting Meeting: 16-10-2026...');
    const res16 = await syncDailyMeeting(meeting16);
    console.log(`✅ Successfully synced ${res16.meetingId}:`);
    console.log(`   - ${res16.counts.breakdowns} breakdown machines`);
    console.log(`   - ${res16.counts.parts} parts`);
    console.log(`   - ${res16.counts.directives} directives`);
    console.log(`   - ${res16.counts.actionItems} action items`);

    // Verify 16-10-2026
    await verifyMeeting(meeting16);

    console.log('\n====================================================');
    console.log('🎉 ALL MEETINGS (15-OCT & 16-OCT) SUCCESSFULLY INGESTED & VERIFIED!');
    console.log('====================================================');
}

run().catch(err => {
    console.error('❌ Ingestion or verification failed:', err);
    process.exit(1);
});
