/**
 * Reach International Operations - Daily Meeting & Holiday Sync (23, 24, 25 & 26 Oct 2026)
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

export const meeting23 = {
    id: "meet-2026-10-23",
    title: "23-10-2026",
    date: "2026-10-23",
    dateFormatted: "23-10-2026",
    focus: "Mundra 4047 joystick transit loss investigation, Sanand 5-ton transmission overheating overhaul, Anuppur 135 China control card tracking, Mar Z-45 traction battery allocation, and fleet tyre retreading logistics.",
    isHoliday: false,
    holidayName: "",
    noMeetingHeld: false,
    notRecorded: false,
    breakdowns: [
        {
            site: "Mundra Project Site",
            model: "JLG 4047 Electric Scissor Lift",
            serialNumber: "4047-Mundra",
            issue: "Machine delivered at Mundra from Jamui with control joystick missing after carrier breakdown and transshipment in Ahmedabad.",
            action: "Jitendra Budhauliya instructed transporter Rahul and driver to trace missing joystick and arrange urgent replacement.",
            logistics: "Transporter investigating cargo transfer point at Ahmedabad truck yard; backup controller being prepared.",
            clarification: "Consignment of two machines was transshipped after first truck broke down; joystick was intact when loaded at Jamui.",
            pendingIssue: "Transporter Rahul to verify transshipment depot records and deliver missing joystick or dispatch spare controller.",
            status: "Grounded on Delivery — Transshipped unit arrived at Mundra without joystick controller; transporter inquiry underway."
        },
        {
            site: "Sanand Project Site",
            model: "Hyundai 5-Ton Diesel Forklift",
            serialNumber: "5T-Sanand",
            issue: "Transmission overheating after 2 hours of continuous operation causing gears to disengage, alongside hydraulic oil leakage.",
            action: "Sushil Mishra and Jitendra Budhauliya proposed sending standby JK Paper machine to Sanand while transmission is overhauled.",
            logistics: "Transmission overhaul cannot be completed on site; heavy transport required to swap with ready unit.",
            clarification: "Machine runs normally during first 2 hours but slips out of drive once transmission fluid reaches high operating temperature.",
            pendingIssue: "Finalize machine swap with JK Paper or Assam yard unit and schedule workshop transmission overhaul.",
            status: "Transmission Overhaul Required — Gearbox slips out after 2 operating hours; site swap planned for shop overhaul."
        },
        {
            site: "Anuppur Project Site",
            model: "Genie S-135 Telescopic Boom Lift",
            serialNumber: "135-Anuppur",
            issue: "Machine grounded awaiting replacement electronic control card and software firmware package from China via Hong Kong.",
            action: "Shiv Uniyal confirmed international shipment departed China with courier docket tracking number issued.",
            logistics: "Control card in international transit through Hong Kong courier hub; customs clearance expected within 2-3 days.",
            clarification: "Defective card suffered irreversible component damage requiring factory-flashed replacement from overseas OEM.",
            pendingIssue: "Track courier docket through Indian customs and dispatch technician upon delivery to Anuppur site.",
            status: "Electronic Card in International Transit — OEM control card dispatched from China; arrival expected within 2-3 days."
        },
        {
            site: "Mar Project Site",
            model: "Genie Z-45 Articulated Boom Lift",
            serialNumber: "Z45-Mar",
            issue: "Unit grounded due to four exhausted traction batteries completely failing to hold operational charge.",
            action: "Sajid confirmed four 2023 batteries required; Pardeep Tomar instructed to allocate 4 units from central yard inventory.",
            logistics: "Four replacement traction batteries allocated from central store for immediate freight dispatch.",
            clarification: "Machine tyres were replaced recently; power failure now isolated entirely to the 4 failed battery cells.",
            pendingIssue: "Test yard battery stock under load, pack 4 verified cells, and dispatch via express transport to site.",
            status: "Awaiting Battery Bank — Grounded due to 4 dead battery cells; replacement pack allocated from yard inventory."
        },
        {
            site: "Patna Project Site",
            model: "Rough Terrain (RT) Access Platform",
            serialNumber: "RT-Patna",
            issue: "Machine non-operational due to unresolved hydraulic valve circuit and control defect; field repair ongoing.",
            action: "Field service technicians actively troubleshooting hydraulic valve blocks to restore operational functions.",
            logistics: "Required repair spares coordinated with central technical desk.",
            clarification: "Visakhapatnam RT completed repairs successfully, while Patna RT remains non-functional pending valve repair.",
            pendingIssue: "Complete hydraulic valve disassembly, clean contaminated spools, and test boom elevation functions.",
            status: "Under Active Repair — Field technicians servicing hydraulic valve block; machine remains non-operational."
        },
        {
            site: "Sandila Project Site",
            model: "Fleet Scissor Lift",
            serialNumber: "Sandila-Unit-40",
            issue: "Engine alternator failed, preventing battery charging and causing complete electrical system shutdown.",
            action: "Replacement alternator dispatched from Delhi; technician Sudeshpal en route to install and test today.",
            logistics: "Alternator delivered to local courier depot; Sudeshpal collecting part for site fitment.",
            clarification: "Previous starting issues traced definitively to alternator diode breakdown rather than battery failure.",
            pendingIssue: "Sudeshpal to fit new alternator, verify charging voltage across battery terminals, and clear breakdown.",
            status: "Technician En Route with Part — Replacement alternator received locally; technician attending site today."
        },
        {
            site: "Wadi Project Site",
            model: "Aerial Access Platform 510",
            serialNumber: "510-Wadi",
            issue: "Grounded awaiting replacement mechanical components; parts arrived at site and await technician installation.",
            action: "Local site engineer scheduled to fit delivered components and conduct operational sign-off.",
            logistics: "Spare parts successfully delivered to site after previous dispatch delays.",
            clarification: "Machine had been idle awaiting specific replacement fittings; spares now physically at site.",
            pendingIssue: "Complete component fitment, verify system pressure, and return machine to active client billing.",
            status: "Parts Delivered to Site — Spares physically on site; technician scheduled to install and commission unit."
        }
    ],
    parts: [
        {
            part: "Electronic Control Card & Firmware Package",
            context: "Anuppur Project Site (Genie S-135)",
            statusNextSteps: "Dispatched from China via Hong Kong; airway docket number issued with arrival in 2-3 days."
        },
        {
            part: "Traction Battery Pack (4 Units - 2023 Spec)",
            context: "Mar Project Site (Genie Z-45)",
            statusNextSteps: "Pardeep Tomar to test and allocate 4 units from central yard inventory for immediate dispatch."
        },
        {
            part: "Engine Alternator Assembly",
            context: "Sandila Project Site (Unit 40)",
            statusNextSteps: "Delivered to local transport; technician Sudeshpal collecting part today for immediate on-site fitment."
        },
        {
            part: "Replacement Joystick Controller",
            context: "Mundra Project Site (JLG 4047)",
            statusNextSteps: "Transporter investigating loss during Ahmedabad transshipment; backup controller being prepared."
        },
        {
            part: "Swing Motor Oil Seal & Turntable Rotary Seal",
            context: "Ambala Project Site (Machine 120)",
            statusNextSteps: "Technician Durgesh to clarify whether swing motor seal or rotary manifold seal is required."
        },
        {
            part: "Engine Oil (Quotation ₹5,790)",
            context: "Sanand Project Site (Machine S100-9002)",
            statusNextSteps: "Quotation of ₹5,790 approved by management for immediate local procurement."
        },
        {
            part: "Solid Tyres (4 Units for 150ft & 2 Units for 80ft)",
            context: "Field Operations Yard",
            statusNextSteps: "Four 150ft tyres (1 cut, 3 depressed) and two 80ft damaged tyres staged for Muzaffarnagar retreading."
        },
        {
            part: "Heavy Equipment Batteries (50 Units Shipment)",
            context: "Central Warehouse Store",
            statusNextSteps: "Received at warehouse; Raju and Shukla assigned to unload, test voltages, and store securely."
        },
        {
            part: "3-Core 6mm Armoured Power Cable",
            context: "Field Operations Site (CG Power)",
            statusNextSteps: "Quotation collected from Polycab and alternative vendors; procurement authorization pending."
        }
    ],
    directives: [
        {
            title: "Strict Material Packing & Transit Documentation Standard",
            points: [
                "Central warehouse must properly crate, wrap, and label all dispatched spare parts to eliminate damaged goods and missing items.",
                "All consignments must include signed itemized packing lists with equipment serial numbers clearly indicated on shipping papers.",
                "Transporters must obtain written receipt signatures on consignment notes before releasing vehicles from unloading docks."
            ]
        },
        {
            title: "Mandatory Daily CRM & Group Escalation Protocol for Rental Breakdowns",
            points: [
                "Field supervisors must immediately post breakdown details to operations group specifying machine age, warranty status, and downtime days.",
                "Unattended warranty machines (such as Mumbai JCB grounded for 12+ days) must be escalated to dealer leadership daily without waiting.",
                "Technicians are prohibited from applying undocumented jumper wires or bypassing OEM safety circuits on customer fleet."
            ]
        },
        {
            title: "Battery & Heavy Core Scrap Management Protocol",
            points: [
                "All depleted battery banks and damaged core tyres must be documented with gate passes and stored in locked holding rooms.",
                "Site engineers must send high-resolution photographs of tyres before dispatching to determine retreadability versus scrap."
            ]
        }
    ],
    actionItems: [
        {
            person: "Jitendra Budhauliya",
            task: "Follow up with transporter Rahul on Mundra 4047 missing joystick and enforce group escalation on Mumbai warranty JCB."
        },
        {
            person: "Pandit Dheeraj Dubey",
            task: "Obtain plant NRGP gate pass, march M600 outside CG Power, and arrange Saturday overhaul for hydraulic cylinder leak."
        },
        {
            person: "Pardeep Tomar",
            task: "Coordinate labor to unload and test 50 newly arrived warehouse batteries and allocate 4 batteries for Mar Z-45."
        },
        {
            person: "Pravesh Yadav",
            task: "Generate gate passes and secure 12 batteries in site storeroom with clear photographic documentation."
        },
        {
            person: "Shiv Uniyal",
            task: "Track international courier docket for Anuppur 135 control card and confirm DHL delivery of Samsung forklift bearing."
        },
        {
            person: "Umesh Kumar",
            task: "Contact dynamic JCB service engineers to replace Mumbai harness and confirm truck transshipment records for Mundra 4047."
        },
        {
            person: "Sushil Mishra",
            task: "Coordinate replacement machine logistics from JK Paper to Sanand to release Hyundai 5-ton forklift for transmission overhaul."
        },
        {
            person: "Banarasi Yadav",
            task: "Submit quotation and file number for 150ft hydraulic oil and release ₹5,790 engine oil payment for machine 9002."
        }
    ]
};

export const meeting24 = {
    id: "meet-2026-10-24",
    title: "24-10-2026",
    date: "2026-10-24",
    dateFormatted: "24-10-2026",
    focus: "Central store spares dispatch reconciliation, fuse and resistor specification audit, field core return via ACPL/DTDC, Mahalakshmi hydraulic payment clearance, and bulging 100Ah battery replacement.",
    isHoliday: false,
    holidayName: "",
    noMeetingHeld: false,
    notRecorded: false,
    breakdowns: [
        {
            site: "Client Project Site",
            model: "Electric Aerial Platform",
            serialNumber: "Battery-100Ah-Ext",
            issue: "External 100Ah auxiliary battery severely bulged and swollen, posing acid rupture hazard with date markings completely erased.",
            action: "Vinod Pal submitted photographs; Pardeep Tomar approved immediate local procurement of fresh 100Ah battery.",
            logistics: "Photo shared on operations group; local supplier quotation being finalized for instant replacement.",
            clarification: "Battery casing deformed under internal short circuit; date stamp unreadable due to surface acid degradation.",
            pendingIssue: "Release payment for replacement 100Ah battery, dispose of damaged unit safely, and restore machine power.",
            status: "Swollen Battery Hazard — 100Ah battery deformed and bulged; emergency replacement approved for procurement."
        }
    ],
    parts: [
        {
            part: "Electric Fuses & Resistors (5A, 10A, 15A, 20A & 2-Center)",
            context: "Central Inventory Store",
            statusNextSteps: "Pravesh Yadav dispatched 20-piece batch; exact amperage and resistance values verified against operator indents."
        },
        {
            part: "Wiring Harness & Battery Separators",
            context: "Site Workshop (Vinod Pal Site)",
            statusNextSteps: "Pravesh Yadav confirmed battery separators dispatched; OEM wiring harness in transit."
        },
        {
            part: "Scissor Lift Replacement Components (3240 & 4047 Spares)",
            context: "Sanand Project Site",
            statusNextSteps: "Consignment of requested components dispatched from central store by Pardeep Tomar."
        },
        {
            part: "Solid Tyres (Model 45 Boom Lift)",
            context: "Fleet Operations Site",
            statusNextSteps: "Procurement order placed with tyre vendor; dispatch date confirmation awaited."
        },
        {
            part: "Decommissioned Old Machine Cores & Spare Parts",
            context: "Bina & Bathinda Project Sites",
            statusNextSteps: "Site teams instructed to pack and courier old parts back to central warehouse via lowest-cost ACPL or DTDC."
        },
        {
            part: "Hydraulic Parts Consignment (Vendor Mahalakshmi)",
            context: "Field Operations Site (150ft Boom Lift)",
            statusNextSteps: "Vendor payment of ₹11,400 confirmed cleared by finance team."
        },
        {
            part: "100Ah Deep-Cycle Auxiliary Battery",
            context: "Site Workshop (Vinod Pal)",
            statusNextSteps: "Emergency procurement requisition approved to replace swollen and ruptured battery."
        }
    ],
    directives: [
        {
            title: "Field Core Return & Reverse Logistics Mandate",
            points: [
                "All replaced spare parts, old cylinders, and core components at sites (including Bina and Bathinda) must be returned to central stores immediately.",
                "Site supervisors must utilize lowest-cost transport carriers such as ACPL or standard DTDC surface freight to prevent high courier costs.",
                "Reverse logistics shipments must be accompanied by itemized manifest photos posted in operations chat before parcel handover."
            ]
        },
        {
            title: "Inter-Site Dispatch & Courier Notification Protocol",
            points: [
                "Any direct parcel dispatches authorized to regional hubs (such as Jaipur via Dinesh) must be notified to Pardeep Tomar beforehand.",
                "Consignments dispatched without prior store notification remain charged to the site supervisor's ledger until reconciled."
            ]
        },
        {
            title: "Battery Visual Safety & Thermal Runaway Protocol",
            points: [
                "Technicians must visually inspect all battery banks for casing swelling, bulging, or acid leakage during daily pre-start checks.",
                "Any battery exhibiting physical deformation or unreadable manufacturing dates must be disconnected immediately to prevent fire hazards."
            ]
        }
    ],
    actionItems: [
        {
            person: "Pravesh Yadav",
            task: "Confirm delivery receipt for 20-piece dispatch of fuses and resistors and track arrival with site operators."
        },
        {
            person: "Pardeep Tomar",
            task: "Compile master list of outstanding field parts at Bina and Bathinda and coordinate ACPL reverse logistics."
        },
        {
            person: "Vinod Pal",
            task: "Procure replacement 100Ah battery immediately, safely decommission swollen battery, and confirm hydraulic payment receipt."
        },
        {
            person: "Khemchand",
            task: "Verify receipt of 3240 and 4047 replacement components at Sanand and report fitment status."
        },
        {
            person: "Satendra Kumar",
            task: "Audit electrical resistance and fuse requirements across active sites and ensure standard ratings are maintained."
        }
    ]
};

export const meeting25 = {
    id: "meet-2026-10-25",
    title: "25-10-2026",
    date: "2026-10-25",
    dateFormatted: "25-10-2026",
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

export const meeting26 = {
    id: "meet-2026-10-26",
    title: "26-10-2026",
    date: "2026-10-26",
    dateFormatted: "26-10-2026",
    focus: "Mundra S-85 auxiliary motor failure and gate pass deadlock, Sabarmati 860SJ chronic downtime, Cross-rental 5390 platform railing collapse, Jammu 4047 voltage mismatch, and Assam 135 emergency battery fault.",
    isHoliday: false,
    holidayName: "",
    noMeetingHeld: false,
    notRecorded: false,
    breakdowns: [
        {
            site: "Mundra Project Site",
            model: "Genie S-85 Telescopic Boom Lift",
            serialNumber: "S85-Mundra",
            issue: "Auxiliary emergency motor burned out and electrical wiring damaged, leaving machine non-operational with plant gate pass blocked.",
            action: "Jitendra Budhauliya instructed Sandeep and Manish to purchase wiring locally and push for permanent plant entry pass.",
            logistics: "Technicians purchased electrical wire locally; permanent gate pass application submitted at MPL site.",
            clarification: "Client previously rejected after-hours entry; single pass approved for Sandeep while permanent pass is processed.",
            pendingIssue: "Clear plant security gate pass for Sandeep and replace emergency motor wiring to restore boom safety descent.",
            status: "Emergency Motor Burnout — Auxiliary emergency motor defective and wiring damaged; plant gate pass clearance pending."
        },
        {
            site: "Mundra Project Site",
            model: "Genie S-80 Telescopic Boom Lift",
            serialNumber: "S80-Mundra",
            issue: "Machine experiencing recurring intermittent hydraulic control and electrical relay faults, disrupting client work.",
            action: "Technician Sandeep assigned to inspect control manifold and electrical relays once security pass is stamped.",
            logistics: "Diagnostic tools staged at site gate; access awaiting security pass confirmation.",
            clarification: "Both S-85 and S-80 at Mundra require concurrent technical attention to prevent total site shutdown.",
            pendingIssue: "Gain plant access and conduct comprehensive diagnostic on hydraulic valves and electrical relays.",
            status: "Intermittent Control Faults — Machine experiencing recurring functional glitches; awaiting security clearance for overhaul."
        },
        {
            site: "Sabarmati Project Site",
            model: "JLG 860SJ Telescopic Boom Lift",
            serialNumber: "860SJ-Sabarmati",
            issue: "Machine grounded for 3-4 consecutive days due to unresolved technical defect with zero on-site technician attendance.",
            action: "Jitendra Budhauliya reassigned breakdown from busy Pardeep to technician Ranjan Sharma for emergency same-day visit.",
            logistics: "Technician Ranjan Sharma dispatched to Sabarmati with diagnostic test equipment.",
            clarification: "Machine had been idle for several days because previously assigned technician was diverted to other urgent sites.",
            pendingIssue: "Ranjan Sharma to reach Sabarmati site today, identify root cause, and submit immediate repair plan.",
            status: "Critical 4-Day Downtime — Grounded for 3-4 days without technician visit; technician Ranjan Sharma dispatched today."
        },
        {
            site: "Client Project Site",
            model: "Haulotte 5390 Scissor Lift",
            serialNumber: "5390-CrossRental",
            issue: "Platform protective safety railing severely bent, cracked, and detached in 2-3 locations due to contractor labor abuse.",
            action: "Pritam Singh and Jitendra Budhauliya ordered immediate reinforcement with structural screws and heavy-duty bracket welding.",
            logistics: "Portable welding rig and mechanical fasteners arranged for immediate on-site structural repair.",
            clarification: "Client laborers operated machine recklessly on site while operator was away; cross-rental machine sustained damage.",
            pendingIssue: "Weld broken railing brackets, reinforce with high-tensile screws, and issue safety warning to client site supervisor.",
            status: "Structural Railing Damage — Safety railing broken in 2-3 places from contractor abuse; on-site welding and bolting underway."
        },
        {
            site: "Sanand Project Site",
            model: "JLG 4047 Electric Scissor Lift",
            serialNumber: "4047-Jammu-Sanand",
            issue: "Severe operational battery backup deficiency traced to 6V battery cells incorrectly installed instead of mandatory 12V cells.",
            action: "Satendra Kumar and site team conducting battery load testing and compiling voltage drop report for store replacement.",
            logistics: "Mismatched 6V battery bank to be replaced with correct 12V commercial traction battery set from store.",
            clarification: "Unit received from Jammu yard had incorrect battery bank fitted, causing voltage to collapse under drive loads.",
            pendingIssue: "Complete multi-hour discharge test, log cell voltages, and arrange delivery of correct 12V battery bank.",
            status: "Voltage Mismatch Breakdown — 6V batteries incorrectly fitted instead of 12V units; replacement battery set requisitioned."
        },
        {
            site: "Sanand Project Site",
            model: "JLG 3240 Electric Scissor Lift",
            serialNumber: "3240-Sanand",
            issue: "Traction battery bank failing to hold operational charge, causing machine to stall during working shifts.",
            action: "Satendra Kumar attending site today with testing instruments to evaluate individual cell gravity and capacity.",
            logistics: "Replacement battery cells identified in warehouse stock pending site test report.",
            clarification: "Unit received parts consignment but continues to suffer from rapid electrical discharge under normal duty cycles.",
            pendingIssue: "Satendra Kumar to test specific gravity and cell voltages, then initiate battery swap if cells are dead.",
            status: "Battery Backup Degradation — Machine stalling due to depleted battery capacity; technical test underway today."
        },
        {
            site: "Assam Project Site",
            model: "Genie S-135 Telescopic Boom Lift",
            serialNumber: "135-Assam",
            issue: "Emergency backup battery voltage dropping to 7V, triggering severe system error codes, automated brake locking, and sensor cutoffs.",
            action: "Vinod Yadav instructed to purchase hydrometer locally to test electrolyte specific gravity; replacement battery prepared.",
            logistics: "Hydrometer being procured locally; 12V replacement deep-cycle battery identified for dispatch.",
            clarification: "Low battery voltage destabilizes control computer, causing intermittent brake locking and false sensor trip alarms.",
            pendingIssue: "Complete electrolyte gravity measurement with new hydrometer and replace depleted battery if cells dropped.",
            status: "Voltage Drop Fault — Voltage dropping to 7V causing sensor trips and brake locking; hydrometer gravity check ordered."
        },
        {
            site: "Poling Yard",
            model: "P240 Truck-Mounted Boom Lift",
            serialNumber: "P240-PolingYard",
            issue: "Unit decommissioned in yard awaiting electronic control cards (repair pending and China OEM delayed) and solid tyres.",
            action: "Jitendra Budhauliya added unit to active breakdown register; tracking domestic PCB repair and tyre delivery.",
            logistics: "Two control cards sent for domestic repair; replacement tyres dismounted and sent for retreading.",
            clarification: "Vehicle grounded for over 15 days; PCB repair technician committed to Sunday progress update.",
            pendingIssue: "Follow up with domestic card repair vendor today and expedite delivery of refurbished wheels.",
            status: "Grounded for Cards & Tyres — Electronic control cards undergoing repair and wheels demounted; added to master register."
        },
        {
            site: "JK Paper Project Site",
            model: "Heavy Industrial Platform",
            serialNumber: "JKPaper-Unit-01",
            issue: "Machine grounded following operational crash that cracked hydraulic clamp arm, necessitating heavy-duty structural welding.",
            action: "Sushil Mishra confirmed clamp arm was dismantled and sent to specialized fabrication workshop for certified welding.",
            logistics: "Damaged clamp arm undergoing shop repair; machine remains isolated on site.",
            clarification: "Unit suffered collision during warehouse maneuvering; structural integrity must be restored before remounting.",
            pendingIssue: "Inspect welded clamp arm seam, verify load ratings, and remount component at JK Paper facility.",
            status: "Structural Clamp Fracture — Clamp arm cracked during impact and sent for workshop welding; awaiting reassembly."
        },
        {
            site: "Jamnagar Project Site",
            model: "150ft Telescopic Boom Lift",
            serialNumber: "150ft-Jamnagar",
            issue: "Three newly installed solid tyres dragging and rubbing against chassis body during travel, alongside swing motor removal.",
            action: "Banarasi Yadav and Jitendra Budhauliya consulting tyre supplier regarding rim offset mismatch while swing motor is demounted.",
            logistics: "Mobile crane hired (vendor demanded ₹6,000) to hoist swing motor; tyre clearance under technical review.",
            clarification: "Newly supplied tyres have wider profile or incorrect offset, rubbing against steel chassis plates when steered.",
            pendingIssue: "Resolve tyre rubbing interference with vendor and conclude swing motor demounting with local crane.",
            status: "Tyre Rubbing & Swing Motor Repair — New tyres rubbing against chassis body; swing motor being lifted by crane."
        },
        {
            site: "Mahipalpur Project Site",
            model: "Genie 660 Boom Lift",
            serialNumber: "660-Mahipalpur",
            issue: "Machine motor dismantled yesterday evening for emergency servicing; unit undergoing overhaul in workshop.",
            action: "Field technician Sunny dismantled motor and is executing complete internal servicing.",
            logistics: "Serviced motor parts staged in workshop; reassembly scheduled for completion tomorrow.",
            clarification: "Preventative teardown initiated following abnormal motor noise and thermal buildup during operation.",
            pendingIssue: "Complete motor overhaul, remount on machine, and conduct multi-hour load trial tomorrow.",
            status: "Motor Overhaul in Progress — Motor dismantled by technician Sunny; overhaul scheduled for completion tomorrow."
        }
    ],
    parts: [
        {
            part: "12V Traction Commercial Battery Bank",
            context: "Sanand Project Site (JLG 4047)",
            statusNextSteps: "Required to replace mismatched 6V batteries discovered on Jammu unit; requisition submitted to central stores."
        },
        {
            part: "Emergency Motor Armoured Wiring Cable",
            context: "Mundra Project Site (Genie S-85)",
            statusNextSteps: "Purchased locally by technicians to rewire auxiliary lowering motor once plant gate pass clears."
        },
        {
            part: "Electrolyte Specific Gravity Hydrometer",
            context: "Assam Project Site (Genie S-135)",
            statusNextSteps: "Technician Vinod Yadav authorized to purchase hydrometer locally to test cells discharging to 7V."
        },
        {
            part: "Main Electronic PCB Control Cards (2 Units)",
            context: "Poling Yard (P240 Truck-Mounted Lift)",
            statusNextSteps: "Sent to specialized repair workshop; technician committed to provide completion status today."
        },
        {
            part: "Structural Fasteners & Welding Electrodes",
            context: "Client Project Site (Haulotte 5390)",
            statusNextSteps: "Procured locally to secure broken platform safety railings damaged by client workforce."
        },
        {
            part: "Hydraulic Clamp Arm Assembly",
            context: "JK Paper Project Site",
            statusNextSteps: "Undergoing structural weld repair at engineering shop following on-site collision."
        },
        {
            part: "Rotary Basket Levelling Seal Kit",
            context: "Bangalore Project Site",
            statusNextSteps: "Custom fabricated seal set promised by vendor within 3 days; delivery expected tomorrow."
        },
        {
            part: "Forklift Wheel Rims (3-Ton Specifications)",
            context: "Central Inventory Store",
            statusNextSteps: "Rims for 2-ton and 5-ton stock received; final batch of 3-ton rims being ordered today."
        },
        {
            part: "Cotton Waste & Industrial Cleaning Rags",
            context: "National Fleet Operations",
            statusNextSteps: "Bulk order approved by management to supply all sites for mandatory daily machine wipe-downs."
        },
        {
            part: "Heavy Equipment Lead-Acid Scrap Batteries",
            context: "Central Yard Holding",
            statusNextSteps: "Certified scrap vendor agreed to pay 80% advance payment before collecting decommissioned batteries tomorrow."
        }
    ],
    directives: [
        {
            title: "Strict Enforcement of Battery Voltage Specifications & Audits",
            points: [
                "Central store and receiving technicians must verify cell voltage ratings (6V vs 12V) before installing batteries to prevent severe operational failures.",
                "All units transferred between sites or yards must undergo mandatory electrical load and voltage checks before being dispatched to clients.",
                "Supervisors must equip site teams with calibrated hydrometers to measure electrolyte specific gravity before condemning battery packs."
            ]
        },
        {
            title: "Mandatory Daily Machine Wipe-Down & Video Cleaning Verification",
            points: [
                "Operators across all 245 fleet machines must spend 5-10 minutes daily wiping down control consoles, booms, and chassis with cotton waste.",
                "Site supervisors must mandate daily photo and video submissions from operators confirming machine cleanliness before issuing shift log sign-offs.",
                "Reckless contractor behavior or unauthorized labor operating machines without Reach International operators must be formally reported and halted immediately."
            ]
        },
        {
            title: "Freight Cost Cap & Local Transporter Authorization Protocol",
            points: [
                "Standard road transport rates for machinery and heavy parts are strictly capped between ₹10 and ₹15 per kilogram.",
                "Any courier or freight quote exceeding ₹15/kg (such as the unauthorized ₹30-35/kg battery shipment from Sanand) is strictly rejected by management.",
                "Field supervisors must benchmark minimum three local logistics providers before dispatching cargo to eliminate predatory freight charges."
            ]
        },
        {
            title: "Chronically Grounded Machine Escalation & Reassignment",
            points: [
                "Machines grounded for more than 48 hours without progress (such as Sabarmati 860SJ) must be escalated to operations head and reassigned immediately.",
                "Field supervisors cannot let units sit idle while waiting for an unavailable technician; standby resources must be routed same-day."
            ]
        }
    ],
    actionItems: [
        {
            person: "Jitendra Budhauliya",
            task: "Follow up with domestic card repair vendor on P240 PCBs, clear Mundra gate passes, and enforce daily 245-machine cleaning reports."
        },
        {
            person: "Ranjan Sharma",
            task: "Travel to Sabarmati site today to diagnose and attend to JLG 860SJ grounded for the past 3-4 days."
        },
        {
            person: "Satendra Kumar",
            task: "Conduct battery load and voltage drop test on Sanand 4047 and 3240 and submit report for 12V replacement bank."
        },
        {
            person: "Pritam Singh",
            task: "Weld and bolt damaged platform railings on cross-rental 5390 and distribute cotton cleaning waste to operators."
        },
        {
            person: "Vinod Yadav",
            task: "Purchase hydrometer locally, test electrolyte specific gravity on Assam 135 emergency battery, and report cell status."
        },
        {
            person: "Banarasi Yadav",
            task: "Resolve Jamnagar 150ft tyre chassis rubbing defect with vendor and oversee swing motor lifting with crane."
        },
        {
            person: "Sushil Mishra",
            task: "Inspect welded clamp arm for JK Paper machine, follow up on Bangalore seal delivery, and oversee scrap battery collection."
        },
        {
            person: "Pardeep Tomar",
            task: "Coordinate with Sanand team on logistics rates, order remaining 3-ton forklift wheel rims, and dispatch cotton cleaning waste."
        },
        {
            person: "Sunny",
            task: "Complete motor overhaul on Mahipalpur 660 machine and conduct operational load testing tomorrow."
        },
        {
            person: "Sandeep",
            task: "Procure emergency motor wiring locally, obtain MPL plant security pass, and repair Genie S-85 auxiliary circuit at Mundra."
        }
    ]
};

async function verifyMeeting(meetingData) {
    console.log(`\n🔍 Verifying ${meetingData.id} directly in Supabase...`);

    // Verify master table
    const { data: mData, error: mErr } = await supabaseAdmin
        .from('meetings')
        .select('*')
        .eq('id', meetingData.id)
        .single();

    if (mErr || !mData) {
        throw new Error(`Verification failed: Master record ${meetingData.id} missing in meetings table! Error: ${mErr?.message}`);
    }

    // Verify child tables
    const [bRes, pRes, dRes, aRes] = await Promise.all([
        supabaseAdmin.from('breakdown_machines').select('id', { count: 'exact' }).eq('meeting_id', meetingData.id),
        supabaseAdmin.from('meeting_parts').select('id', { count: 'exact' }).eq('meeting_id', meetingData.id),
        supabaseAdmin.from('meeting_directives').select('id', { count: 'exact' }).eq('meeting_id', meetingData.id),
        supabaseAdmin.from('meeting_action_items').select('id', { count: 'exact' }).eq('meeting_id', meetingData.id)
    ]);

    const expectedB = meetingData.breakdowns.length;
    const expectedP = meetingData.parts.length;
    const expectedD = meetingData.directives.length;
    const expectedA = meetingData.actionItems.length;

    console.log(`📊 DB Counts for ${meetingData.id}:`);
    console.log(`   - Breakdowns:   ${bRes.count} in DB (expected: ${expectedB})`);
    console.log(`   - Parts:        ${pRes.count} in DB (expected: ${expectedP})`);
    console.log(`   - Directives:   ${dRes.count} in DB (expected: ${expectedD})`);
    console.log(`   - Action Items: ${aRes.count} in DB (expected: ${expectedA})`);

    if (bRes.count !== expectedB || pRes.count !== expectedP || dRes.count !== expectedD || aRes.count !== expectedA) {
        throw new Error(`Verification count mismatch for ${meetingData.id}! Master counts do not align with child rows.`);
    }

    console.log(`✅ All verification checks PASSED for ${meetingData.id}!`);
}

async function run() {
    console.log('====================================================');
    console.log('🚀 Reach International Daily Meeting Supabase Ingestion (23-26 Oct 2026)');
    console.log('====================================================');

    // 1. Ingest 23-10-2026
    console.log('\n📥 Ingesting Meeting: 23-10-2026...');
    const res23 = await syncDailyMeeting(meeting23);
    console.log(`✅ Successfully synced ${res23.meetingId}`);
    await verifyMeeting(meeting23);

    // 2. Ingest 24-10-2026
    console.log('\n📥 Ingesting Meeting: 24-10-2026...');
    const res24 = await syncDailyMeeting(meeting24);
    console.log(`✅ Successfully synced ${res24.meetingId}`);
    await verifyMeeting(meeting24);

    // 3. Ingest 25-10-2026 (Sunday Weekly Off)
    console.log('\n📥 Ingesting Meeting: 25-10-2026 (Sunday Weekly Off)...');
    const res25 = await syncDailyMeeting(meeting25);
    console.log(`✅ Successfully synced ${res25.meetingId}: Holiday=${res25.title}`);
    await verifyMeeting(meeting25);

    // 4. Ingest 26-10-2026 (Monday Meeting)
    console.log('\n📥 Ingesting Meeting: 26-10-2026 (Monday Meeting)...');
    const res26 = await syncDailyMeeting(meeting26);
    console.log(`✅ Successfully synced ${res26.meetingId}:`);
    console.log(`   - ${res26.counts.breakdowns} breakdown machines`);
    console.log(`   - ${res26.counts.parts} parts`);
    console.log(`   - ${res26.counts.directives} directives`);
    console.log(`   - ${res26.counts.actionItems} action items`);
    await verifyMeeting(meeting26);

    console.log('\n====================================================');
    console.log('🎉 ALL MEETINGS (23-OCT, 24-OCT, 25-OCT SUNDAY, 26-OCT MONDAY) SUCCESSFULLY INGESTED & VERIFIED!');
    console.log('====================================================');
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
    run().catch(err => {
        console.error('❌ Ingestion or verification failed:', err);
        process.exit(1);
    });
}
