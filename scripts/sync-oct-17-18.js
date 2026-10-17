/**
 * Reach International Operations - Daily Meeting & Holiday Sync (17-10-2026 & 18-10-2026)
 *
 * Implements strict Reach International standards:
 * - 100% Cloud-Native ingestion (zero static JSON files in src/data/)
 * - Strictly ONE machine per breakdown card
 * - Concise, single-line informative fields across all sections
 * - Accurate English translation and distillation of raw Hindi meeting transcripts
 * - Direct Supabase ingestion with automated verification check (Step A, B, C)
 */

const meeting17 = {
    id: "meet-2026-10-17",
    title: "17-10-2026",
    date: "2026-10-17",
    dateFormatted: "17-10-2026",
    focus: "Anuppur Genie Z-45 OEM card procurement, Mundra S-65 RPM coil and delayed battery transit, Sanand Z-45 48V contactor and M600JP voltage surge diagnostic, Smart Rentals Noida JCB battery warranty deployment, and Renukoot off-rent fleet audit.",
    isHoliday: false,
    holidayName: "",
    breakdowns: [
        {
            site: "Anuppur Project Site",
            model: "Genie Z-45 Articulated Boom",
            serialNumber: "Z45-Anuppur",
            issue: "Electronic control card failure immobilizing machine for weeks, triggering client de-hire and replacement threat.",
            action: "Hari Shayan Tripathi and Shiv Uniyal arranged Genie OEM direct ordering after unblocking account for Monday payment.",
            logistics: "OEM control card unavailable across domestic distributors in Bombay and China; procuring via authorized Genie channel.",
            clarification: "Defect diagnosed 20 days ago by Ram Babu and Vinod Pal; client manager Ranjan issued final weekend ultimatum.",
            pendingIssue: "Execute vendor payment on Monday morning to confirm Tuesday dispatch and weekend delivery to Anuppur.",
            status: "Critical De-Hire Notice — Account cleared for Monday Genie OEM payment to avert immediate machine replacement."
        },
        {
            site: "Mundra Project Site",
            model: "JCB 45 Electric Boom",
            serialNumber: "JCB-45-Mundra",
            issue: "Machine shutdown for 6+ days awaiting delayed lead-acid battery bank transit across state bus network.",
            action: "Sushil Mishra and Jitendra Budhauliya escalated with Jaipur bus transporter and tracking agent Raju for immediate delivery.",
            logistics: "Battery bank dispatched from Delhi on 13th Oct via interstate bus, held in Jaipur 2 days, en route to Mundra depot.",
            clarification: "Rail freight prohibited for unsealed battery shipments; bus transporter failed to answer morning status calls.",
            pendingIssue: "Confirm bus arrival at Mundra depot, collect battery bank, and assign site technician to install and test today.",
            status: "Battery In Transit — Transporter delayed in Jaipur; arriving Mundra today for immediate installation by site team."
        },
        {
            site: "Mundra Project Site",
            model: "Genie S-65",
            serialNumber: "S65-1435",
            issue: "Engine RPM surging excessively and throttle governor hunting due to defective accelerator and RPM coil assembly.",
            action: "Jitendra Budhauliya dispatched technician Pritam with accelerator and RPM coils to site today to rectify governor.",
            logistics: "Replacement throttle and RPM coils packed and routed with technician Pritam for direct installation.",
            clarification: "Machine ran normally for two days before RPM control failure recurred due to unreplaced electrical actuator coils.",
            pendingIssue: "Pritam to fit accelerator and RPM coils today, calibrate electronic throttle governor, and conduct load trials.",
            status: "Throttle Governor Defect — Technician Pritam mobilized today with replacement coils to resolve recurring RPM surge."
        },
        {
            site: "Mundra Project Site",
            model: "Genie Z-40/22N",
            serialNumber: "Z40-Mundra",
            issue: "Unit idle with electrical contactors and throttle coils on site for 4 days without technician installation.",
            action: "Jitendra Budhauliya instructed technician Mantu to clear backlog and complete electrical coil installation today.",
            logistics: "Coils and contactors were expedited from Ahmedabad depot and arrived at Mundra site 4 days ago.",
            clarification: "Local technicians were diverted to priority breakdowns, leaving delivered parts pending fitment.",
            pendingIssue: "Mantu to install delivered coils and contactors today, verify boom functions, and clear machine for operations.",
            status: "Parts Awaiting Fitment — Delivered coils pending installation for 4 days; technician Mantu assigned today."
        },
        {
            site: "Sanand Project Site (Blue Star)",
            model: "Genie Z-45/25 DC",
            serialNumber: "Z45-902",
            issue: "Unit idle for 12 days awaiting 48V main line contactor after CRM request was logged on 5th October.",
            action: "Satendra Kumar and Jitendra Budhauliya tracked courier parcel dispatched by Pardeep Tomar via Tirupati Courier.",
            logistics: "Charger received at Sanand; 48V contactor dispatched from Delhi store via Tirupati Courier arriving today.",
            clarification: "Requirement pending since 5th Oct; 40ft and 45ft contactor compatibility confirmed between fleet units.",
            pendingIssue: "Receive contactor parcel this evening, install along with charger, and restore unit to Blue Star operations.",
            status: "Contactor In Transit — Charger on site; 48V contactor arriving today via Tirupati Courier for immediate fitment."
        },
        {
            site: "Sanand Project Site (CG Power)",
            model: "JLG M600JP",
            serialNumber: "M600JP-Sanand",
            issue: "Severe hydraulic fluid leak from holding valve block coupled with recurring charger burnout from site AC surges.",
            action: "Pardeep and Dheeraj Dubey installing temporary PCB charger to full capacity before driving unit outside for leak check.",
            logistics: "Replacement PCB charger delivered to Sanand; original OEM transformer charger held for bench diagnostics.",
            clarification: "Client distribution panel lacks proper earthing with severe voltage swings (100V-260V) from heavy welding units.",
            pendingIssue: "Charge machine fully by noon, drive into yard area, and perform 4-hour diagnostic to trace hydraulic leak.",
            status: "Charging & Leak Diagnostic — Battery charging underway to enable yard mobilization for holding valve leak trace."
        },
        {
            site: "Noida Project Site (Smart Rentals)",
            model: "JCB Electric Scissor Lift",
            serialNumber: "JCB-Noida-Smart",
            issue: "Machine shutdown due to 2 dead lead-acid batteries; client claiming ₹70,000 commercial damages for project halt.",
            action: "Dhruv Sharma instructed immediate dispatch of 2 Surya wet batteries from company stock to revive unit today.",
            logistics: "2 Surya tubular batteries dispatched from yard stock; Umesh Kumar instructed to record video proof beforehand.",
            clarification: "JCB OEM warranty approval stalled at head office for 4 days; temporary company batteries deployed to curb client loss.",
            pendingIssue: "Capture video of failed batteries, install 2 Surya batteries today, and escalate warranty claim with JCB HQ.",
            status: "Battery Deployment Active — 2 stock batteries dispatched under video log while OEM warranty claim is expedited."
        },
        {
            site: "Mumbai Project Site",
            model: "JCB Access Equipment",
            serialNumber: "JCB-Mumbai-535",
            issue: "Cross-rented machine down for 10 days without service response due to omission from central CRM registry.",
            action: "Dhruv Sharma and Sushil Mishra transferred field servicing responsibility directly to Dynamic Rentals Mumbai.",
            logistics: "Local service coordination handed over to Dynamic Rentals Mumbai maintenance network.",
            clarification: "Machine operates under cross-rental agreement; Umesh Kumar lacked access to the cross-rental coordination channel.",
            pendingIssue: "Dynamic Rentals to assign local Mumbai mechanic today, inspect machine, and add Umesh to operational group.",
            status: "Cross-Rental Transfer — Service transferred to Dynamic Rentals Mumbai; mechanic assignment scheduled today."
        },
        {
            site: "Ambala Project Site",
            model: "Articulated Boom Lift",
            serialNumber: "15338",
            issue: "Hydraulic cylinder rod severed/scored with high-pressure oil leak, causing complete lift function lockout.",
            action: "Vaibhav Chauhan logged breakdown in CRM on 17th Oct; Sushil Mishra initiating replacement cylinder seal kit.",
            logistics: "Technical failure report logged; cylinder dimensions and seal specifications being confirmed for dispatch.",
            clarification: "Duplicate complaint submission in mobile app cleared; physical rod damage confirmed by site operator.",
            pendingIssue: "Remove damaged cylinder assembly, finalize seal and rod dimensions, and dispatch replacement kit from store.",
            status: "CRM Registered — Cylinder damage verified; technical evaluation underway to dispatch replacement cylinder kit."
        },
        {
            site: "Patna Project Site",
            model: "Reach Stacker / Heavy Equipment",
            serialNumber: "RS-Patna",
            issue: "Intermittent electronic sensor faults and controller lockout unresolved during yesterday's maintenance shift.",
            action: "Sushil Mishra instructed field technician to resume sensor replacement and electrical diagnostic checks today.",
            logistics: "Replacement sensor components and diagnostic tools available with technician on site.",
            clarification: "Sensor wiring resistance and continuity verified yesterday; calibration required to clear error codes.",
            pendingIssue: "Complete sensor installation today, recalibrate safety interlocks, and perform full container handling trial.",
            status: "Diagnostic Continuing — Field technician resuming sensor replacement and safety circuit calibration today."
        },
        {
            site: "Renukoot Project Site",
            model: "JLG 800AJ",
            serialNumber: "Unit 800-1-Renukoot",
            issue: "Standing de-hired requiring pre-mobilization overhaul, electrical switchgear audit, and official off-rent sign-off.",
            action: "Sudesh Pal instructed to collect official de-hire list from head office (Hariom) and begin technical inspection.",
            logistics: "Mobile maintenance spares and testing tools routed with technician Sudesh Pal.",
            clarification: "On-site refurbishment enables direct redeployment to client sites without routing through central yard.",
            pendingIssue: "Obtain de-hire confirmation sheet from Hariom, complete snag rectification, and certify for next rental site.",
            status: "De-Hire Audit — Official list requested from head office; Sudesh Pal assigned for pre-transfer overhaul."
        },
        {
            site: "Renukoot Project Site",
            model: "Genie S-80",
            serialNumber: "Unit S-80-Renukoot",
            issue: "De-hired boom lift requiring fluid level top-up, hydraulic hose inspection, and control toggle refurbishment.",
            action: "Sudesh Pal assigned to inspect unit upon receiving de-hire documentation from head office team.",
            logistics: "Hydraulic seals and electrical consumables allocated for on-site servicing.",
            clarification: "3-4 machines released at Renukoot undergoing simultaneous inspection for rapid redeployment.",
            pendingIssue: "Verify de-hire paperwork, complete functional safety checks, and clear unit for outward transport.",
            status: "Pre-Mobilization Check — De-hire paperwork requested from office; technical check assigned to Sudesh Pal."
        },
        {
            site: "Renukoot Project Site",
            model: "Boom Lift (Unit 3)",
            serialNumber: "Renukoot-Unit-03",
            issue: "Released off-rent unit requiring battery bank testing, emergency descent audit, and limit switch verification.",
            action: "Sudesh Pal coordinating with head office to cross-reference machine serial numbers against de-hire schedule.",
            logistics: "Battery tester and electrical diagnostic kit available with mobile maintenance team.",
            clarification: "Comprehensive on-site certification required before clearing unit for next commercial dispatch.",
            pendingIssue: "Cross-check serial against office records, perform battery load test, and certify functional safety cutouts.",
            status: "Pre-Transfer Audit — Cross-referencing head office de-hire list to execute full battery and safety certification."
        },
        {
            site: "Guwahati Project Site",
            model: "Genie S-65",
            serialNumber: "S-65-Guwahati",
            issue: "Control card received and custom high-pressure hose fabricated; pending diagnostic laptop calibration today.",
            action: "Pravesh Yadav scheduled to connect incoming diagnostic laptop today at 12:00 PM to clear control parameters.",
            logistics: "Diagnostic laptop dispatched via express courier expected to arrive at Guwahati site at 12:00 PM today.",
            clarification: "Client clean room operation waiting on machine commissioning; control parameters locked pending laptop hookup.",
            pendingIssue: "Receive diagnostic laptop at noon, calibrate electronic control card parameters, and commission boom lift.",
            status: "Commissioning Today — Laptop arriving at 12:00 PM for electronic calibration and final functional sign-off."
        },
        {
            site: "Regional Project Site (Near Renukoot)",
            model: "120ft Telescopic Boom Lift",
            serialNumber: "Boom-120-Regional",
            issue: "Burned hydraulic solenoid valve coil causing complete hydraulic interlock failure across primary boom functions.",
            action: "Sitaram securing client gate pass approval to enter plant and install replacement solenoid coil.",
            logistics: "Replacement solenoid valve coil dispatched and available with field technician Sitaram.",
            clarification: "Client plant gate pass verification mandatory; security clearance expected today.",
            pendingIssue: "Secure approved security pass, enter client plant, and replace burned solenoid valve coil.",
            status: "Gate Pass Pending — Replacement solenoid coil on site; technician Sitaram awaiting gate pass clearance."
        },
        {
            site: "Bhadrak Maintenance Workshop",
            model: "Fleet Heavy Equipment",
            serialNumber: "Fleet-Bhadrak",
            issue: "Axle and hub maintenance delayed due to crane dependence; resuming today with newly procured 35-ton hydraulic jack.",
            action: "Vinod Pal utilizing newly purchased 35-ton hydraulic jack to execute heavy axle and cylinder maintenance.",
            logistics: "35-ton heavy-duty hydraulic jack delivered on site following bank transfer clearance.",
            clarification: "In-house heavy jack eliminates external ₹7,000 hydra crane rental costs across regional sites.",
            pendingIssue: "Position 35-ton jack, lift chassis safely, and complete wheel hub and cylinder maintenance today.",
            status: "Maintenance Resumed — 35-ton hydraulic jack deployed; heavy wheel hub and cylinder overhaul underway."
        }
    ],
    parts: [
        {
            part: "TVS Control Valve O-Ring Kit & Hub Seal",
            context: "Fleet Equipment Procurement",
            statusNextSteps: "Quotation approved at ₹17,000 for O-rings and ₹60k-70k for seals; purchase order to be placed on Monday."
        },
        {
            part: "Genie Z-45 Electronic Control Card",
            context: "Anuppur Project Site",
            statusNextSteps: "Direct Genie OEM order unblocked; payment scheduled for Monday to trigger Tuesday dispatch."
        },
        {
            part: "JCB 45 Heavy-Duty Battery Bank",
            context: "Mundra Project Site",
            statusNextSteps: "Dispatched via interstate bus from Delhi via Jaipur; arriving at Mundra depot today for immediate installation."
        },
        {
            part: "S-65 Accelerator & RPM Throttle Coils",
            context: "Mundra Project Site",
            statusNextSteps: "Dispatched with technician Pritam today to replace defective throttle actuator and calibrate governor."
        },
        {
            part: "48V Main Line Contactor",
            context: "Sanand Project Site (Blue Star)",
            statusNextSteps: "Dispatched from Delhi via Tirupati Courier; scheduled for delivery this evening to revive unit 902."
        },
        {
            part: "Surya Wet Tubular Batteries (2 Units)",
            context: "Noida Project Site (Smart Rentals)",
            statusNextSteps: "Mobilized from company stock today under video defect log to eliminate ₹70,000 client downtime penalty."
        },
        {
            part: "JLG M600JP High-Tolerance PCB Charger",
            context: "Sanand Project Site (CG Power)",
            statusNextSteps: "Delivered to site; connected to full charging cycle prior to 4-hour yard hydraulic leak diagnosis."
        },
        {
            part: "Genie Z-40 Contactor & Coils",
            context: "Mundra Project Site",
            statusNextSteps: "Delivered on site 4 days ago; technician Mantu scheduled to fit and test components today."
        },
        {
            part: "Ambala Hydraulic Cylinder Seal Kit",
            context: "Ambala Project Site (Serial 15338)",
            statusNextSteps: "CRM complaint logged; cylinder rod and seal dimensions being verified for emergency store dispatch."
        },
        {
            part: "120ft Boom Solenoid Valve Coil",
            context: "Regional Project Site (Near Renukoot)",
            statusNextSteps: "Carried by technician Sitaram on site awaiting client gate pass approval to enter plant."
        }
    ],
    directives: [
        {
            title: "Mandatory Courier Standardization via Tirupati Courier",
            points: [
                "All parts sent to and from Sanand and Gujarat sites must strictly route via Tirupati Courier (3 km from base).",
                "Field teams are prohibited from using uncoordinated bus services that lose tracking and cause 10-12 day downtimes.",
                "Pardeep Tomar and store management must immediately post this formal shipping mandate on the operations group."
            ]
        },
        {
            title: "Unified Google Sheet Dispatch & Core Return Tracking",
            points: [
                "Dinesh must add two mandatory tracking columns to the central parts sheet: Dispatch Date and Core Return Status.",
                "Site teams must log part dispatch dates immediately upon courier receipt to eliminate multiple unverified sheets.",
                "A single unified parts and core return review will be conducted every Friday across all regional clusters."
            ]
        },
        {
            title: "AC Line Fluctuation & Grounding Protocol for Battery Chargers",
            points: [
                "Technicians must measure AC line voltage and verify distribution box earthing with a multimeter prior to charging.",
                "Machines must not be connected to panels showing floating neutral or ungrounded lines during heavy welding shifts.",
                "Hari Shayan Tripathi to coordinate with charger vendor to expand operating input tolerance up to 300V."
            ]
        },
        {
            title: "Commercial Loss Mitigation & OEM Warranty Video Documentation",
            points: [
                "When OEM warranty approvals stall (e.g. JCB), company stock batteries must be deployed to avoid client loss.",
                "Field technicians must record comprehensive video evidence of serial numbers and defective parts before removal.",
                "Formal escalation notices citing client commercial downtime must be sent to OEM regional service leadership."
            ]
        },
        {
            title: "Field Technician Operational Expense Reimbursement",
            points: [
                "Dhruv Sharma to review and approve all pending field expense vouchers, operator room rent, and safety shoe claims today.",
                "Operational cash flows for site teams must not be delayed beyond 24 hours to prevent field maintenance bottlenecks."
            ]
        }
    ],
    actionItems: [
        {
            person: "Hari Shayan Tripathi",
            task: "Process Genie invoice payment on Monday morning to expedite Anuppur control card dispatch and delivery."
        },
        {
            person: "Pritam",
            task: "Travel to Mundra site today with accelerator and RPM coils, calibrate engine governor on S-65, and load test."
        },
        {
            person: "Pardeep Tomar",
            task: "Ensure all future Sanand parts dispatches strictly route through Tirupati Courier and verify contactor delivery."
        },
        {
            person: "Dheeraj Dubey",
            task: "Monitor JLG M600JP charging from grounded DB, march unit outside by noon, and trace hydraulic leak."
        },
        {
            person: "Umesh Kumar",
            task: "Record video proof of 2 failed JCB batteries at Noida, install Surya stock batteries, and submit claim footage."
        },
        {
            person: "Dinesh",
            task: "Add Dispatch Date and Core Return columns to parts sheet and issue warranty delay notice to JCB head office."
        },
        {
            person: "Sushil Mishra",
            task: "Transfer Mumbai cross-rental machine servicing to Dynamic Rentals and coordinate TVS seal purchase on Monday."
        },
        {
            person: "Sudesh Pal",
            task: "Obtain official Renukoot de-hire list from head office (Hariom) and begin pre-mobilization inspection on 3 units."
        },
        {
            person: "Mantu",
            task: "Install delivered electrical coils and contactors on Genie Z-40 at Mundra site today to clear 4-day backlog."
        },
        {
            person: "Vaibhav Chauhan",
            task: "Update CRM with Ambala cylinder damage ticket and confirm 48V contactor arrival for Sanand Blue Star unit."
        },
        {
            person: "Dhruv Sharma",
            task: "Review and clear pending field technician expense reimbursements and room rent disbursements today."
        }
    ]
};

const meeting18 = {
    id: "meet-2026-10-18",
    title: "18-10-2026",
    date: "2026-10-18",
    dateFormatted: "18-10-2026",
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

export default [meeting17, meeting18];
