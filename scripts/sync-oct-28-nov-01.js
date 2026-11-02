/**
 * Reach International Operations - Daily Meeting & Holiday Sync (28 Oct - 01 Nov 2026)
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

// ============================================================================
// 1. MEETING: 28-10-2026 (Wednesday)
// ============================================================================
export const meeting28 = {
    id: "meet-2026-10-28",
    title: "28-10-2026",
    date: "2026-10-28",
    dateFormatted: "28-10-2026",
    focus: "Jhajjar 1930 emergency descent failure, CRM Dahej 3-ton transmission overhaul, Ambala swing brake O-ring leak, Haldiram 45ft battery escalation, and standardized bi-weekly spare indents.",
    isHoliday: false,
    holidayName: "",
    noMeetingHeld: false,
    notRecorded: false,
    breakdowns: [
        {
            site: "Jhajjar Project Site",
            model: "Genie GS-1930 Electric Scissor Lift",
            serialNumber: "1930-Jhajjar",
            issue: "Emergency auxiliary lowering descent mechanism failed to engage during on-site safety function testing.",
            action: "Imran Khan instructed Jitendra Budhauliya to dispatch field mechanic to inspect emergency lowering circuit.",
            logistics: "Mechanic deployment coordinated from nearby Delhi-NCR cluster to attend site without dedicated operator.",
            clarification: "Unit is stationed on site without full-time operator; emergency descent required for safety clearance.",
            pendingIssue: "Mobilize technician to Jhajjar, test auxiliary emergency valve solenoids, and restore descent function.",
            status: "Emergency Descent Fault — Auxiliary lowering failed; mechanic requested for inspection on site."
        },
        {
            site: "Dahej Project Site",
            model: "Toyota 3-Ton Diesel Forklift",
            serialNumber: "Dahej-3T",
            issue: "Transmission failure preventing machine drive; unit actively grounded with open CRM breakdown ticket.",
            action: "Sushil Mishra coordinating with local on-site mechanic to complete transmission assembly overhaul.",
            logistics: "Local automotive transmission technician engaged at Dahej to avoid long-distance transit delays.",
            clarification: "Confirmed as the single unresolved active breakdown on the official CRM tracking register.",
            pendingIssue: "Complete transmission internal gear and clutch inspection and verify load traction under operation.",
            status: "Transmission Overhaul Underway — Open CRM breakdown; local mechanic actively overhauling gearbox."
        },
        {
            site: "Ambala Project Site",
            model: "Genie Articulated Boom Lift",
            serialNumber: "15338-Ambala",
            issue: "Swing brake assembly leaking hydraulic oil due to damaged internal backup O-ring seal.",
            action: "Service engineer Vinay inspected 15 local markets without match; Shiv Uniyal sourcing seals from Arun Seals.",
            logistics: "Specialized backup O-rings being dispatched via express courier from Arun Seals in Delhi.",
            clarification: "Local market O-rings exceed required dimensional thickness, causing binding in brake housing.",
            pendingIssue: "Receive custom backup O-rings from Arun Seals, replace swing brake seals, and pressure test.",
            status: "Grounded by Swing Brake Leak — Backup O-ring damaged; specialized seals being sent from Delhi."
        },
        {
            site: "Haldiram Project Site",
            model: "Genie Z-45 Electric Boom Lift",
            serialNumber: "Z45-Haldiram",
            issue: "Traction battery failure grounded 45ft electric lift; client rejected diesel standby unit for indoor work.",
            action: "Imran Khan and Jitendra Budhauliya arranged technician visit tomorrow to restore electric battery system.",
            logistics: "Technician deployment planned with battery testing equipment and replacement cell connectors.",
            clarification: "Client strictly prohibits diesel exhaust inside food manufacturing facility, requiring urgent battery fix.",
            pendingIssue: "Deploy technician team tomorrow to revive or replace battery bank and restore indoor operations.",
            status: "Client Escalation / Battery Failure — Electric boom grounded; diesel standby rejected by client."
        }
    ],
    parts: [
        {
            part: "Specialized Swing Brake Backup O-Ring Kit",
            context: "Ambala Project Site (Articulated Boom 15338)",
            statusNextSteps: "Vinay could not source correct thickness locally; Shiv Uniyal dispatching from Arun Seals Delhi."
        },
        {
            part: "Hydraulic Drive Pump & Electric Motor Armature",
            context: "Sanand Project Site (Genie Z-45-4902)",
            statusNextSteps: "Pump seizure overloaded motor melting armature solder joints; replacement pump and motor required."
        },
        {
            part: "Platform Swing Controller Logic Card",
            context: "Assam Project Site (Genie S-135)",
            statusNextSteps: "Defective card bypassed using boom up/down module; replacement card ordered from China arriving Nov 6th."
        },
        {
            part: "24V Industrial Control Relay",
            context: "Central Store / National Fleet (JLG 3246)",
            statusNextSteps: "Pardeep Tomar identified relay stock-out; Dhruv Sharma directed Mumbai depot to procure and air-ship."
        },
        {
            part: "Main Machine Logic Control Board",
            context: "Mundra Project Site (JLG 4047)",
            statusNextSteps: "Customs clearance currently scheduled for November 2nd in Delhi; tracking expedited with freight agent."
        },
        {
            part: "Surya 12V Traction Battery Set & Gate Pass",
            context: "Assam Project Site (Genie S-135)",
            statusNextSteps: "Dispatched via transport from Delhi on Monday; Raju tracking arrival and gate-in pass preparation."
        },
        {
            part: "Harness Electrical Connector Plug",
            context: "Lucknow Project Site (Genie E-450)",
            statusNextSteps: "Sourced from Mumbai supplier at ₹2,500; shipment being received in Delhi for transit to site."
        },
        {
            part: "Battery Charger & Emergency Gateway Wiring",
            context: "Sanand Project Site (CG Power - JLG 4047)",
            statusNextSteps: "Khemchand replacing damaged platform gate wiring; industrial charger being dispatched from central store."
        }
    ],
    directives: [
        {
            title: "Mandatory Single Consolidated Weekly Parts Indent via Google Sheets",
            points: [
                "All site engineers and supervisors must submit a single consolidated parts indent twice weekly instead of repeated daily submissions.",
                "Warehouse managers are strictly instructed to ignore informal WhatsApp messages and process orders only through approved Google Forms.",
                "Multiple personnel entering duplicate requests for the same machine serial number must be audited and immediately halted."
            ]
        },
        {
            title: "Dedicated Site Spares Custodian & Return of Replaced Assemblies",
            points: [
                "Each major project site must designate exactly one accountable custodian responsible for receiving, storing, and tracking spares.",
                "Defective old components, motors, and cards must be systematically preserved, tagged, and returned to Delhi yard for vendor warranty claims.",
                "Technicians must document the specific equipment serial number on which every new part is physically installed."
            ]
        },
        {
            title: "Zero Compromise on Seal Dimensions & Safety Standby Deployments",
            points: [
                "Technicians must never force oversized local O-rings or seals into critical hydraulic assemblies like swing brakes.",
                "When deploying replacement machines at sensitive facilities, ensure engine types strictly comply with indoor plant guidelines.",
                "All field batteries must undergo specific gravity testing before lodging manufacturer warranty failure claims."
            ]
        }
    ],
    actionItems: [
        {
            person: "Imran Khan",
            task: "Dispatch mechanic to Jhajjar for 1930 emergency down testing and mobilize technicians for Haldiram 45ft battery."
        },
        {
            person: "Jitendra Budhauliya",
            task: "Review CRM open breakdown register, monitor Dahej transmission overhaul, and follow up on Assam 135 transit."
        },
        {
            person: "Shiv Uniyal",
            task: "Expedite Arun Seals swing brake O-ring shipment to Ambala and monitor China platform card custom clearance."
        },
        {
            person: "Pardeep Tomar",
            task: "Dispatch JLG 4047 CG Power gate wiring and charger, source JLG 3246 relay from Mumbai, and consolidate site indents."
        },
        {
            person: "Khemchand",
            task: "Submit bi-weekly consolidated Sanand parts indent, overhaul Z-45 motor/pump, and complete CG Power 4047 gate wiring."
        },
        {
            person: "Vinay Singh",
            task: "Collect Arun Seals custom O-rings upon Delhi arrival, reassemble Ambala swing brake, and test boom rotation."
        },
        {
            person: "Vinod Kumar Yadav",
            task: "Receive Assam 135 traction battery shipment with gate pass and maintain temporary card bypass until China card arrives."
        },
        {
            person: "Sushil Mishra",
            task: "Track local mechanic transmission overhaul on Dahej 3-ton Toyota forklift and update CRM call resolution."
        },
        {
            person: "Vinod Pal",
            task: "Finish workshop swing motor sealing and basket welding on 150ft boom lift and prepare Jajpur machine seals."
        }
    ]
};

// ============================================================================
// 2. MEETING: 29-10-2026 (Thursday) - Unrecorded Meeting
// ============================================================================
export const meeting29 = {
    id: "meet-2026-10-29",
    title: "29-10-2026",
    date: "2026-10-29",
    dateFormatted: "29-10-2026",
    focus: "Daily Operations Meeting Conducted – Recording Unavailable Due to Network Connectivity Issues",
    isHoliday: false,
    holidayName: "",
    noMeetingHeld: false,
    notRecorded: true,
    breakdowns: [],
    parts: [],
    directives: [],
    actionItems: []
};

// ============================================================================
// 3. MEETING: 30-10-2026 (Friday)
// ============================================================================
export const meeting30 = {
    id: "meet-2026-10-30",
    title: "30-10-2026",
    date: "2026-10-30",
    dateFormatted: "30-10-2026",
    focus: "Zero major fleet breakdowns achieved, Bhadrak 150ft tyre stud mismatch hazard, MHE 505 morning marching jerks, TMB truck parts dispatch, and Renukoot monsoon mobilization.",
    isHoliday: false,
    holidayName: "",
    noMeetingHeld: false,
    notRecorded: false,
    breakdowns: [
        {
            site: "Bhiwadi Project Site",
            model: "Toyota 5-Ton Diesel Forklift",
            serialNumber: "Unit-505",
            issue: "Machine suffers from intermittent morning marching stalls and violent drive jerking under initial acceleration.",
            action: "Jitendra Budhauliya directed field technician to diagnose transmission fluid pressures and electronic throttle sensors.",
            logistics: "On-site diagnostic kit and transmission pressure gauge assigned to inspect machine during cold morning startup.",
            clarification: "Machine remains operational after warmup, but morning jerking poses load handling hazards in warehouse.",
            pendingIssue: "Inspect transmission control valve and throttle potentiometer to eliminate morning marching jerking.",
            status: "Morning Marching Jerks — Drive stutters during morning startup; electrical throttle and transmission under test."
        },
        {
            site: "Bhadrak Project Site",
            model: "JLG 1500SJ Telescopic Boom Lift",
            serialNumber: "150ft-Bhadrak",
            issue: "Replacement tyre bolt recess does not seat flush against hub; tightening risks shearing wheel studs under load.",
            action: "Banarasi Yadav tested inverted tyre mounting and shared video call; Dhruv Sharma evaluating safety clearance.",
            logistics: "Correct specification wheel rim assembly requested from central yard if existing tyre cannot be safely torqued.",
            clarification: "Studs fail to seat into tyre recess and cannot achieve specified torque, threatening catastrophic wheel loss.",
            pendingIssue: "Obtain executive engineering decision on tyre compatibility or immediately dispatch matching wheel from Delhi.",
            status: "Tyre Stud Mismatch Hazard — Wheel studs cannot seat into rim recess; machine halted to prevent stud shearing."
        }
    ],
    parts: [
        {
            part: "Toyota 2-Ton Return Line Filter & Hyundai Brake Coils",
            context: "Gavatia Project Site (Damru Patra Maintenance Kit)",
            statusNextSteps: "Pardeep Tomar verifying part numbers against Google Form indent to dispatch 2-ton filters and brake coils."
        },
        {
            part: "TMB Truck Spares & Heavy-Duty Alternator",
            context: "Central Fleet Transport (Babulal & Mantu)",
            statusNextSteps: "Received at depot; alternator undergoing immediate overhaul before mounting on carrier truck."
        },
        {
            part: "JLG 1500SJ Matching Rim & Wheel Stud Assembly",
            context: "Bhadrak Project Site (Vedanta - 150ft Boom)",
            statusNextSteps: "Tyre bolt gap incompatible; correct wheel hub assembly required to prevent wheel stud shearing."
        },
        {
            part: "Traction Drive Motor Spares & Potter Logistics",
            context: "Central Workshop & Field Logistics (Raju Logistics)",
            statusNextSteps: "Parts held up 2 days due to heavy rainfall; Raju instructed to send via Porter once office opens at 10 AM."
        },
        {
            part: "Electronic Logic Control Card",
            context: "Anuppur Project Site (Genie Z-135)",
            statusNextSteps: "Pardeep Tomar dispatching control card immediately; laptop programming unit withheld per management directive."
        },
        {
            part: "Raincoats & Heavy-Duty Weatherproof Tarpaulins",
            context: "Renukoot Project Site Dispatch (Satendra Kumar)",
            statusNextSteps: "Machines prepped for loading; weather protection and raincoats arranged to safeguard electricals against rain."
        }
    ],
    directives: [
        {
            title: "Absolute Safety Ban on Ill-Fitting Wheel Assemblies and Torquing Deficiencies",
            points: [
                "Under no circumstances should machines be operated with mismatched tyre hubs or partially threaded wheel studs.",
                "Video inspections with senior management are mandatory whenever replacement tyres deviate from OEM rim recesses.",
                "Technicians must never attempt reverse-mounting tyres if stud engagement and seating gaps fail manufacturer specifications."
            ]
        },
        {
            title: "Mandatory Photographic Evidence of Truck Plates and Mounted Booms",
            points: [
                "Carriers transporting fleet machines must submit clear photographs of vehicle registration plates and boom mountings before departure.",
                "Transport drivers must provide verified delivery receipts before unloading machines at client project gates.",
                "Fleet coordinators must archive photos in central records to prevent carrier transit disputes."
            ]
        },
        {
            title: "Expedited Porter Dispatch Protocols During Inclement Weather",
            points: [
                "Logistics coordinators must not let critical motor spares sit in transit depots for multiple days due to localized rainfall.",
                "Once courier offices open, critical components must be dispatched via express city Porter services without waiting for consolidated shipments.",
                "Site technicians must proceed with motor mechanical mounting while electrical components are in final courier delivery."
            ]
        }
    ],
    actionItems: [
        {
            person: "Jitendra Budhauliya",
            task: "Hand over TMB truck spares to Babulal and Mantu, inspect 505 morning marching jerks, and supervise Renukoot loading."
        },
        {
            person: "Pardeep Tomar",
            task: "Photograph truck number plates and mounted boom, dispatch Anuppur Z-135 card, and pack Gavatia filters."
        },
        {
            person: "Banarasi Yadav",
            task: "Halt Bhadrak 150ft operation pending tyre stud safety approval and report wheel bolt seating to management."
        },
        {
            person: "Shiv Uniyal",
            task: "Follow up with Raju on rain-delayed drive motor spares and dispatch Shukla to inspect site printer."
        },
        {
            person: "Sushil Mishra",
            task: "Process Gavatia service kit indent and dispatch Toyota 2-ton return line filters with Hyundai brake coils."
        },
        {
            person: "Satendra Kumar",
            task: "Finalize loading of Renukoot equipment with protective raincoats and tarpaulins against heavy rain."
        },
        {
            person: "Mantu",
            task: "Inspect and install received TMB truck spares and overhaul alternator before clearing truck for road service."
        }
    ]
};

// ============================================================================
// 4. MEETING: 31-10-2026 (Saturday)
// ============================================================================
export const meeting31 = {
    id: "meet-2026-10-31",
    title: "31-10-2026",
    date: "2026-10-31",
    dateFormatted: "31-10-2026",
    focus: "Bina 60ft cylinder seal leak & tyre hub mismatch, Bhatinda gate pass & TPI renewal mobilization, Mahipalpur 660 tyre replacement, and Jammu 4047 wet battery audit.",
    isHoliday: false,
    holidayName: "",
    noMeetingHeld: false,
    notRecorded: false,
    breakdowns: [
        {
            site: "Bina Project Site",
            model: "Genie S-60 Telescopic Boom Lift",
            serialNumber: "60ft-Bina",
            issue: "Hydraulic boom cylinder seal leaking fluid, and fitted 14-17.5 tyre failed inspection due to oversized inner hub.",
            action: "Banarasi Yadav scheduled cylinder seal overhaul for tomorrow; Pardeep Tomar sourcing correct spec wheel assembly.",
            logistics: "Cylinder seal packing kit arranged on site; correct specification wheel assembly required from central depot.",
            clarification: "Attempted fitment of 14-17.5 tyre revealed internal hub diameter is too large, leaving wheel bolts loose.",
            pendingIssue: "Dismantle boom cylinder to replace leaking seals tomorrow and install correct matching hub diameter tyre.",
            status: "Cylinder Seal Leak & Tyre Hub Incompatibility — Cylinder leaking; 14-17.5 tyre rejected due to oversize inner hub."
        }
    ],
    parts: [
        {
            part: "Turbocharger Silencer Muffler Assembly",
            context: "Bhadrak Project Site (Vedanta - Heavy Diesel Boom)",
            statusNextSteps: "Internal silencer muffler unavailable locally in Bhadrak; Delhi workshop tasked with custom steel fabrication."
        },
        {
            part: "15-19.4 Heavy-Duty Foam-Filled Tyre",
            context: "Mahipalpur Project Site (Genie 660 Boom Lift)",
            statusNextSteps: "Current tyre deeply cut and making loud knocking noise; Pardeep Tomar inspecting stock for warranty replacement."
        },
        {
            part: "Hydraulic Boom Cylinder Seal Kit & Matching Tyre",
            context: "Bina Project Site (Genie S-60 Boom Lift)",
            statusNextSteps: "Seal kit staged for tomorrow's cylinder overhaul; correct hub diameter tyre required to replace mismatched 14-17.5 wheel."
        },
        {
            part: "Industrial Wet Deep-Cycle Lead-Acid Batteries (8 Units)",
            context: "Jammu Project Site (JLG 4047 Scissor Lift)",
            statusNextSteps: "Pardeep Tomar confirmed 8 wet batteries staged at site require specific gravity testing and cell interchange."
        },
        {
            part: "Third Party Inspection (TPI) & Insurance Policy Documentation",
            context: "Bhatinda Project Site (Fleet Units)",
            statusNextSteps: "Satendra Kumar and Durvesh mobilizing on the 4th to complete TPI inspection and renew expired plant gate passes."
        },
        {
            part: "Battery Specific Gravity Hydrometer",
            context: "Jammu & North Fleet Sites",
            statusNextSteps: "Field mechanics instructed to check specific gravity on all 8 staged batteries rather than ordering new sets."
        }
    ],
    directives: [
        {
            title: "Mandatory Pre-Dispatch Verification of Tyre Rim Offsets and Hub Bore Sizes",
            points: [
                "Central warehouse must measure inner hub bore diameters, bolt pitch circle (PCD), and rim offsets before dispatching tyres.",
                "Technicians must never attempt to force undersized or oversized wheels onto boom lifts, as hub play shears mounting bolts.",
                "Any damaged tyre removed from service must be photographed with serial identification to process OEM warranty replacement."
            ]
        },
        {
            title: "Enforcing Hydrometer Gravity Audits Before Declaring Battery Banks Defective",
            points: [
                "Field mechanics are strictly prohibited from requisitioning new batteries without submitting specific gravity readings per cell.",
                "Supervisors must recharge and cross-exchange viable wet cells from staged inventory before requesting fresh shipments from Delhi.",
                "All site battery banks must be checked for proper electrolyte levels and distilled water topping weekly."
            ]
        },
        {
            title: "Proactive Renewal of Statutory TPI Certifications and Site Gate Passes",
            points: [
                "Plant gate pass validity and third-party inspection (TPI) renewals must be initiated 10 days before scheduled expiry.",
                "Technicians mobilizing for gate pass renewals must carry complete equipment compliance dossiers and calibration certificates.",
                "Equipment must never be permitted to idle at customer sites due to administrative lapses in insurance or safety paperwork."
            ]
        }
    ],
    actionItems: [
        {
            person: "Satendra Kumar",
            task: "Travel to Bhatinda with Durvesh on the 4th to renew site gate passes and coordinate TPI machine insurance."
        },
        {
            person: "Pardeep Tomar",
            task: "Check stock for 15-19.4 tyre for 660, verify hub dimensions for Bina 60ft tyre, and review 4047 wet batteries."
        },
        {
            person: "Banarasi Yadav",
            task: "Execute hydraulic cylinder seal replacement on Bina 60ft boom and coordinate Delhi fabrication of Bhadrak muffler."
        },
        {
            person: "Jitendra Budhauliya",
            task: "Expedite TPI clearance for Bhatinda machines and enforce specific gravity testing for Jammu 4047 battery bank."
        },
        {
            person: "Durvesh",
            task: "Mobilize to Bhatinda on the 4th to join Satendra Kumar for gate pass renewal and multi-machine technical inspections."
        },
        {
            person: "Tirlochan",
            task: "Perform specific gravity testing on 8 wet batteries at Jammu site and swap functional cells into JLG 4047."
        },
        {
            person: "Mantu",
            task: "Inspect salvaged tyres in central yard for rim compatibility and assist in preparing matching wheel for Bina."
        }
    ]
};

// ============================================================================
// 5. MEETING: 01-11-2026 (Sunday) - Weekly Holiday
// ============================================================================
export const meeting01 = {
    id: "meet-2026-11-01",
    title: "01-11-2026",
    date: "2026-11-01",
    dateFormatted: "01-11-2026",
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
// VERIFICATION FUNCTION (Mandatory Step B)
// ============================================================================
async function verifyMeeting(meeting) {
    console.log(`\n🔍 Verifying ${meeting.id} in Supabase...`);

    const { data: dbMeeting, error: mErr } = await supabaseAdmin
        .from('meetings')
        .select('*')
        .eq('id', meeting.id)
        .single();

    if (mErr || !dbMeeting) {
        throw new Error(`Master meeting record not found for ${meeting.id}: ${mErr?.message}`);
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

    console.log(`   - Master Record: Found (${dbMeeting.title}) | Holiday: ${dbMeeting.is_holiday} | Unrecorded: ${dbMeeting.not_recorded}`);
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
        throw new Error(`Verification count mismatch for ${meeting.id}! Master counts do not align with child rows.`);
    }

    console.log(`✅ VERIFICATION PASSED for ${meeting.id}`);
}

// ============================================================================
// MAIN RUNNER
// ============================================================================
export async function run() {
    console.log('====================================================');
    console.log('🚀 Reach International Daily Meeting Supabase Ingestion (28 Oct - 01 Nov 2026)');
    console.log('====================================================');

    const meetingsToSync = [meeting28, meeting29, meeting30, meeting31, meeting01];

    for (const m of meetingsToSync) {
        console.log(`\n📥 Ingesting Meeting: ${m.title} (${m.id})...`);
        const res = await syncDailyMeeting(m);
        console.log(`✅ Synced ${res.meetingId}`);
        await verifyMeeting(m);
    }

    console.log('\n====================================================');
    console.log('🎉 ALL 5 MEETINGS (28, 29, 30, 31 OCT & 01 NOV 2026) SUCCESSFULLY INGESTED & VERIFIED IN SUPABASE!');
    console.log('====================================================');
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
    run().catch(err => {
        console.error('❌ Ingestion or verification failed:', err);
        process.exit(1);
    });
}
