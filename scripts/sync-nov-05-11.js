/**
 * Reach International Operations - Daily Meeting Sync (05 Nov - 11 Nov 2026)
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
// 1. MEETING: 05-11-2026 (Thursday)
// ============================================================================
export const meeting05Nov = {
    id: "meet-2026-11-05",
    title: "05-11-2026",
    date: "2026-11-05",
    dateFormatted: "05-11-2026",
    focus: "Siliguri Unit 5390 servicing cost clearance, Bhadrak Unit 150 basket dismantling and tyre stud torqueing, JLG E-450 main cylinder seal replacement, Genie Z-45 client safety speed reduction and green tag inspection, Genie resistance circuit breakdown, and Diwali site staffing roster.",
    isHoliday: false,
    holidayName: "",
    noMeetingHeld: false,
    notRecorded: false,
    breakdowns: [
        {
            site: "Bhadrak Project Site (Banarasi Yadav)",
            model: "JLG 1500SJ Telescopic Boom Lift",
            serialNumber: "Unit 150-Bhadrak",
            issue: "Security prohibited on-site basket welding due to VIP visit; wheel tyre stud bolt setting requires extra manpower.",
            action: "Banarasi Yadav coordinating with arriving technician Anil to dismantle basket for workshop transfer and set wheel bolts.",
            logistics: "Security cleared off-site transport; dismantling video recorded for engineering review.",
            clarification: "Unit cannot march safely 1 km on public highway with damaged basket; dismantling basket required for transit.",
            pendingIssue: "Anil to arrive on site, dismantle basket assembly, and assemble full crew to torque wheel stud bolts.",
            status: "Breakdown / Maintenance — Basket dismantling and tyre stud torqueing pending Anil's arrival."
        },
        {
            site: "Siliguri Project Site (Pravesh Yadav & Banarasi Yadav)",
            model: "Fleet Boom Lift",
            serialNumber: "Unit 5390",
            issue: "Routine maintenance and engine servicing overdue by more than 200 operating hours.",
            action: "Pravesh Yadav awaiting accounts approval of Rs 5,230 engine service estimate to procure local consumables.",
            logistics: "Service estimate slip (Rs 5,230) submitted to Jitendra; bank account details pending submission.",
            clarification: "Last serviced in January/February; unit running but requires immediate oil and filter renewal.",
            pendingIssue: "Submit vendor bank account details, secure fund clearance, and procure servicing kit.",
            status: "Servicing Overdue — Over 200 operating hours logged; procurement pending vendor account submission."
        },
        {
            site: "Field Project Site (Pandit Dheeraj Dubey)",
            model: "JLG E450AJ Electric Articulating Boom Lift",
            serialNumber: "0300190796",
            issue: "Boom elevation main hydraulic cylinder seal ruptured and blowing by, generating severe grinding noise under lift.",
            action: "Dheeraj Dubey recorded diagnostic video and shared in group; monitoring machine as client continues operation.",
            logistics: "Main lift cylinder seal kit requisitioned for emergency shipment to site.",
            clarification: "Machine currently running to fulfill client demand; client safety team complaining about lift cylinder noise.",
            pendingIssue: "Stage replacement cylinder seal kit and schedule downtime permit to repack main cylinder.",
            status: "Breakdown / Active Leak — Main lift cylinder seal blown with high noise; replacement seal kit required."
        },
        {
            site: "Field Project Site (Pandit Dheeraj Dubey)",
            model: "Genie Z-45/25 Articulating Boom Lift",
            serialNumber: "Unit Z-45/25",
            issue: "Travel/drive speed excessively fast, causing client safety inspector to withhold monthly operational green tag.",
            action: "Dheeraj Dubey coordinating with client safety team while seeking technician to calibrate drive speed controller.",
            logistics: "Calibration handset or drive controller service technician required; OEM refused site visit.",
            clarification: "Unit mechanically sound; breakdown state imposed by client safety withholding green tag approval.",
            pendingIssue: "Calibrate drive motor controller speed parameters and secure client safety green tag sign-off.",
            status: "Safety Hold — Travel speed excessively fast; client green tag withheld pending speed recalibration."
        },
        {
            site: "Field Project Site (Pandit Dheeraj Dubey)",
            model: "Genie Boom Lift",
            serialNumber: "Unit Resistance-Down",
            issue: "Electrical drive resistance circuit failure causing machine to remain completely grounded in breakdown state.",
            action: "Dheeraj Dubey and Jitendra Budhauliya following up on electrical diagnostic and component replacement.",
            logistics: "Replacement resistance grid / power resistor assembly under procurement review.",
            clarification: "Longstanding electrical breakdown; final engineering repair solution pending implementation.",
            pendingIssue: "Procure and install matching resistance module to restore machine electrical circuit.",
            status: "Grounded Breakdown — Power resistance circuit failed; unit grounded awaiting replacement resistor."
        }
    ],
    parts: [
        {
            part: "Main Lift Cylinder Seal Kit",
            context: "Field Project Site (JLG E450AJ / 0300190796)",
            statusNextSteps: "Emergency seal kit requisitioned to eliminate loud grinding noise during boom elevation."
        },
        {
            part: "Engine Oil & Service Consumables (Rs 5,230)",
            context: "Siliguri Project Site (Unit 5390)",
            statusNextSteps: "Accounts approval and vendor bank account details pending to execute scheduled oil and filter renewal."
        },
        {
            part: "Basket Dismantling Hardware & Rigging",
            context: "Bhadrak Project Site (Unit 150-Bhadrak)",
            statusNextSteps: "Dismantling tools staged on site to remove basket before towing unit 1 km for welding."
        },
        {
            part: "Drive Speed Calibration Controller / Handset",
            context: "Field Project Site (Unit Z-45/25)",
            statusNextSteps: "Service technician or calibration tool needed to lower travel speed for safety green tag approval."
        },
        {
            part: "Drive Power Resistance Grid Assembly",
            context: "Field Project Site (Unit Resistance-Down)",
            statusNextSteps: "Replacement resistance circuit components under sourcing review to clear persistent electrical breakdown."
        },
        {
            part: "Replaced Fleet Tyres (6 Units)",
            context: "Bhadrak Project Site (Banarasi & Client)",
            statusNextSteps: "Shiv Uniyal sending revised gate pass and RC documentation to release tyres from client premises."
        }
    ],
    directives: [
        {
            title: "Prohibition of Hazardous Public Road Machine Marching",
            points: [
                "Under no circumstances should large equipment be marched along public roads without operational foot switches and certified safety escort.",
                "Dismantling basket assemblies and transporting via flatbed trailer is mandatory when site security or local authorities restrict road movement."
            ]
        },
        {
            title: "Commercial Verification Prior to Local Maintenance Procurement",
            points: [
                "Technicians must submit formal vendor invoices and complete bank transfer details before local servicing purchases are authorized.",
                "Raw estimate slips without vendor registration will not be cleared by central accounts."
            ]
        },
        {
            title: "Diwali Roster Planning and Site Staff Equity",
            points: [
                "Site supervisors must finalize festive duty rosters early to prevent sudden operator departures on critical project sites.",
                "Operations management must ensure equitable festive support and recognition for technicians stationed on field sites during Diwali."
            ]
        }
    ],
    actionItems: [
        {
            person: "Banarasi Yadav",
            task: "Coordinate with arriving technician Anil to dismantle Unit 150 basket and torque tyre stud bolts."
        },
        {
            person: "Banarasi Yadav",
            task: "Obtain revised gate entry documents from client to clear dispatch of 6 replaced tyres from Bhadrak."
        },
        {
            person: "Jitendra Budhauliya",
            task: "Confirm Anil's arrival at Bhadrak site and monitor technician availability across Diwali shifts."
        },
        {
            person: "Jitendra Budhauliya",
            task: "Follow up with accounts to release verified local service and room expense payments."
        },
        {
            person: "Pravesh Yadav",
            task: "Provide vendor bank account details and formal invoice for Unit 5390 engine service kit (Rs 5,230)."
        },
        {
            person: "Pravesh Yadav",
            task: "Procure service materials immediately upon fund clearance and execute Unit 5390 periodic maintenance."
        },
        {
            person: "Pandit Dheeraj Dubey",
            task: "Coordinate main cylinder seal replacement on JLG E-450 (S/N: 0300190796) to eliminate lift grinding noise."
        },
        {
            person: "Pandit Dheeraj Dubey",
            task: "Liaise with client safety inspector to obtain monthly green tag clearance for Unit Z-45/25."
        },
        {
            person: "Shiv Uniyal",
            task: "Revise RC documents and gate pass paperwork to expedite client release of old tyres from Bhadrak."
        }
    ]
};

// ============================================================================
// 2. MEETING: 06-11-2026 (Friday)
// ============================================================================
export const meeting06Nov = {
    id: "meet-2026-11-06",
    title: "06-11-2026",
    date: "2026-11-06",
    dateFormatted: "06-11-2026",
    focus: "Bhadrak Unit 150 basket unbolting with local mechanic, Zoomlion dual-drive electric circuit restoration via tested JCB joystick, Jammu Genie GS-4047 battery bank failure and charger algorithm mismatch, cross-rental stolen joystick board liability, solar site hydraulic O-ring leak repair, and technician expense clearances.",
    isHoliday: false,
    holidayName: "",
    noMeetingHeld: false,
    notRecorded: false,
    breakdowns: [
        {
            site: "Bhadrak Project Site (Banarasi Yadav)",
            model: "JLG 1500SJ Telescopic Boom Lift",
            serialNumber: "Unit 150-Bhadrak",
            issue: "Complex basket assembly with integrated leveling cylinder and intermittent foot switch halts safe road transit.",
            action: "Banarasi Yadav sourcing local hydraulic mechanic to assist in safely disconnecting wiring and unbolting basket.",
            logistics: "Off-site fabrication shop arranged; local commercial vehicle mechanic being hired for mechanical help.",
            clarification: "Marching unit 1 km on public road deemed severe hazard due to erratic foot switch and heavy traffic.",
            pendingIssue: "Engage local mechanic, disconnect hydraulic lines and console wiring, and unbolt basket assembly.",
            status: "Breakdown / Complex Repair — Foot switch erratic; basket unbolting with local mechanic underway."
        },
        {
            site: "Field Workshop Site (Chunnilal Patel & Sandeep)",
            model: "Zoomlion Dual-Drive Boom Lift",
            serialNumber: "Unit Zoomlion-Dual",
            issue: "Hydraulic drive operating normally, but electric drive circuit disabled due to defective joystick controller board.",
            action: "Sandeep tested JCB joystick board which operated all functions; Chunnilal ordering matching joystick board & connector.",
            logistics: "Compatible joystick controller board and female wiring harness connector requisitioned from central spares.",
            clarification: "Diagnostic video confirmed full boom and travel functionality restored when using test JCB joystick.",
            pendingIssue: "Dispatch matching joystick controller board and female connector to site for permanent installation.",
            status: "Spares Requisitioned — Hydraulic drive functional, electric drive down; replacement joystick board on order."
        },
        {
            site: "Jammu Project Site / Depot (Chunnilal Patel)",
            model: "Genie GS-4047 Electric Scissor Lift",
            serialNumber: "Unit GS-4047",
            issue: "Three of four 6V traction batteries depleted, dropping to 2.95V under load and halting machine after 30 minutes.",
            action: "Sushil Mishra and Chunnilal Patel ordering complete bank of four replacement batteries and correct AGM charger.",
            logistics: "Requisition placed for four new traction batteries; verifying charger compatibility to avoid battery damage.",
            clarification: "Technician identified that incorrect lithium profile charger was connected to lead-acid battery bank.",
            pendingIssue: "Deliver four new traction batteries and match appropriate AGM charging unit.",
            status: "Breakdown — Three batteries defective (2.95V under load); complete battery set and AGM charger ordered."
        },
        {
            site: "Field Operations Site (Chunnilal Patel)",
            model: "Genie Z-45/25 Articulating Boom Lift",
            serialNumber: "Unit 45-BATT",
            issue: "Traction battery bank completely exhausted; machine grounded in active breakdown state awaiting fresh battery.",
            action: "Sushil Mishra placed battery purchase order with local vendor; delivery expected today.",
            logistics: "Replacement battery order processed with vendor; awaiting dispatch confirmation.",
            clarification: "Unit immobilized on site solely due to battery failure; all hydraulic systems verified functional.",
            pendingIssue: "Receive replacement battery from vendor and install on machine to resume operations.",
            status: "Breakdown — Grounded due to dead battery; vendor purchase order released for delivery."
        },
        {
            site: "Cross-Rental Site (Chunnilal Patel & Sandeep)",
            model: "Articulating Boom Lift",
            serialNumber: "Unit 45-50 (Cross-Rental)",
            issue: "All four 12V traction batteries dead, and electronic control card/joystick stolen from machine console.",
            action: "Jitendra Budhauliya coordinating with Umesh and Vinesh to finalize commercial liability for stolen board.",
            logistics: "Four 12V batteries required; card replacement quotes obtained from electronics repair vendor.",
            clarification: "Electronics vendor reviewing card repair/supply; commercial agreement needed between owners before release.",
            pendingIssue: "Management decision on stolen card cost absorption and battery bank replacement.",
            status: "Breakdown / Disputed Liability — Four dead batteries and stolen control card; executive clearance pending."
        },
        {
            site: "Field Project Site (Chunnilal Patel)",
            model: "Genie Z-34/22 Articulating Boom Lift",
            serialNumber: "Unit Z-34",
            issue: "Main electronic control card damaged; machine halted awaiting repaired controller board.",
            action: "Electronics repair technician promised to complete card testing and repair by 2:00-3:00 PM today.",
            logistics: "Control card staged at electronics workshop; pickup scheduled for 3:00 PM.",
            clarification: "If card cannot be rebuilt today, standby replacement card will be dispatched tomorrow.",
            pendingIssue: "Collect repaired control card at 3:00 PM, reinstall on machine, and conduct functional test.",
            status: "In Repair — Control card at electronics repair shop; completion expected today at 3:00 PM."
        },
        {
            site: "Solar Plant Site (Chunnilal Patel & Sandeep)",
            model: "Telescopic Boom Lift",
            serialNumber: "30016971A",
            issue: "Severe hydraulic fluid leak from damaged hydraulic drive cylinder / motor seal ring on solar site.",
            action: "Sandeep mobilized to site with replacement O-rings to dismantle cylinder fitting and eliminate leakage.",
            logistics: "Replacement hydraulic O-rings and seal rings carried directly to solar project site.",
            clarification: "Serial number 30016971A verified by Sandeep; hydraulic oil loss heavy, requiring immediate shutdown.",
            pendingIssue: "Replace blown O-ring seal, torque hydraulic fittings, and top up hydraulic oil.",
            status: "Breakdown — Heavy hydraulic oil leak from blown seal ring; technician Sandeep on site repairing."
        }
    ],
    parts: [
        {
            part: "Zoomlion Joystick Board & Female Connector",
            context: "Field Workshop Site (Unit Zoomlion-Dual)",
            statusNextSteps: "Tested compatible joystick controller and wiring connector being dispatched to restore electric drive."
        },
        {
            part: "Traction Batteries (Bank of Four) & AGM Charger",
            context: "Jammu Project Site (Genie GS-4047)",
            statusNextSteps: "Four new traction batteries and dedicated AGM charger ordered to replace dead lead-acid bank."
        },
        {
            part: "Traction Battery Pack",
            context: "Field Operations Site (Unit 45-BATT)",
            statusNextSteps: "Purchase order released with local vendor; delivery and installation scheduled today."
        },
        {
            part: "Cross-Rental Joystick Control Board & 4 Batteries",
            context: "Cross-Rental Site (Unit 45-50)",
            statusNextSteps: "Commercial settlement pending with Umesh/Vinesh to fund four 12V batteries and replacement board."
        },
        {
            part: "Repaired Electronic Control Card",
            context: "Field Project Site (Genie Z-34)",
            statusNextSteps: "Electronics repair technician scheduled to finish repair by 3:00 PM for on-site reinstallation."
        },
        {
            part: "Hydraulic Drive Motor O-Rings & Seal Rings",
            context: "Solar Plant Site (Unit 30016971A)",
            statusNextSteps: "Sandeep replacing damaged seal rings on site to arrest heavy hydraulic leakage."
        },
        {
            part: "Basket Dismantling Hardware & Rigging",
            context: "Bhadrak Project Site (Unit 150-Bhadrak)",
            statusNextSteps: "Local mechanic and rigging equipment hired to safely detach basket from integrated leveling cylinder."
        },
        {
            part: "Engine Oil, Grease & Consumables (Rs 15,400)",
            context: "Field Workshop Stores (Chunnilal Patel)",
            statusNextSteps: "Payment verification underway with Jitendra and Kaushal to settle workshop maintenance bills."
        }
    ],
    directives: [
        {
            title: "Charger Algorithm Compatibility Verification for Battery Longevity",
            points: [
                "Technicians must never connect lithium or generic chargers to lead-acid or AGM traction battery banks.",
                "Technical teams must photograph charger nameplates and ensure charger voltage profiles match installed battery chemistry."
            ]
        },
        {
            title: "Immediate Commercial Settlement for Cross-Rental & Stolen Components",
            points: [
                "Cross-rental equipment damage and stolen control cards must be escalated immediately to executive management (Umesh/Vinesh).",
                "Clear cost absorption agreements must be established within 24 hours to prevent machines sitting grounded for weeks."
            ]
        },
        {
            title: "Zero-Delay Protocol for Site Room Rent & Basic Living Allowances",
            points: [
                "Central accounts must clear technician room rent and accommodation dues on priority to prevent site landlord lockouts.",
                "Technicians facing urgent field accommodation disputes must be supported immediately through emergency transfers."
            ]
        }
    ],
    actionItems: [
        {
            person: "Banarasi Yadav",
            task: "Engage local commercial vehicle mechanic after lunch to dismantle 150-ft basket and inspect fabrication."
        },
        {
            person: "Banarasi Yadav",
            task: "Share photographs and video of 150-ft basket dismantling progress to engineering group."
        },
        {
            person: "Chunnilal Patel",
            task: "Dispatch tested joystick controller board and female connector for Zoomlion dual-drive boom lift."
        },
        {
            person: "Chunnilal Patel",
            task: "Photograph battery bank and charger nameplate on Jammu GS-4047 to verify charging algorithm compatibility."
        },
        {
            person: "Chunnilal Patel",
            task: "Resend verified invoices for Rs 7,000 net battery bill, Rs 6,500 tool expense, and diesel bills with S/N 30016971A."
        },
        {
            person: "Sushil Mishra",
            task: "Finalize vendor warranty decision for depleted batteries and approve two-battery swap into Genie unit."
        },
        {
            person: "Sushil Mishra",
            task: "Expedite vendor purchase orders for GS-4047 and Z-45 traction battery banks."
        },
        {
            person: "Jitendra Budhauliya",
            task: "Resolve stolen controller card liability for cross-rental machine with Umesh and Vinesh."
        },
        {
            person: "Jitendra Budhauliya",
            task: "Clear urgent room rent payment to resolve technician accommodation dispute with site landlord."
        },
        {
            person: "Jitendra Budhauliya",
            task: "Process verified vendor disbursements of Rs 15,400 for workshop oil/grease and Rs 7,000 for battery exchange."
        },
        {
            person: "Sandeep",
            task: "Complete O-ring seal replacement on hydraulic drive motor fitting at solar plant (S/N: 30016971A)."
        }
    ]
};

// ============================================================================
// 3. MEETING: 07-11-2026 (Saturday) - No Meeting Held
// ============================================================================
export const meeting07Nov = {
    id: "meet-2026-11-07",
    title: "07-11-2026",
    date: "2026-11-07",
    dateFormatted: "07-11-2026",
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
// 4. MEETING: 08-11-2026 (Sunday) - Official Holiday
// ============================================================================
export const meeting08Nov = {
    id: "meet-2026-11-08",
    title: "08-11-2026",
    date: "2026-11-08",
    dateFormatted: "08-11-2026",
    focus: "Official Company Holiday & Sunday Weekly Off – Diwali (Deepavali) / Lakshmi Puja",
    isHoliday: true,
    holidayName: "Diwali (Deepavali)",
    noMeetingHeld: false,
    notRecorded: false,
    breakdowns: [],
    parts: [],
    directives: [],
    actionItems: []
};

// ============================================================================
// 5. MEETING: 09-11-2026 (Monday) - Official Holiday
// ============================================================================
export const meeting09Nov = {
    id: "meet-2026-11-09",
    title: "09-11-2026",
    date: "2026-11-09",
    dateFormatted: "09-11-2026",
    focus: "Official Company Holiday – Govardhan Puja (Annakut)",
    isHoliday: true,
    holidayName: "Govardhan Puja",
    noMeetingHeld: false,
    notRecorded: false,
    breakdowns: [],
    parts: [],
    directives: [],
    actionItems: []
};

// ============================================================================
// 6. MEETING: 10-11-2026 (Tuesday) - Official Holiday
// ============================================================================
export const meeting10Nov = {
    id: "meet-2026-11-10",
    title: "10-11-2026",
    date: "2026-11-10",
    dateFormatted: "10-11-2026",
    focus: "Official Company Holiday – Holiday on Occasion of Festival (Diwali Festive Break)",
    isHoliday: true,
    holidayName: "Holiday on Occasion of Festival",
    noMeetingHeld: false,
    notRecorded: false,
    breakdowns: [],
    parts: [],
    directives: [],
    actionItems: []
};

// ============================================================================
// 7. MEETING: 11-11-2026 (Wednesday) - No Meeting Held
// ============================================================================
export const meeting11Nov = {
    id: "meet-2026-11-11",
    title: "11-11-2026",
    date: "2026-11-11",
    dateFormatted: "11-11-2026",
    focus: "Bhai Dooj Festive Period – Office Open & Fleet Operations Active • No Meeting Held",
    isHoliday: false,
    holidayName: "",
    noMeetingHeld: true,
    notRecorded: false,
    breakdowns: [],
    parts: [],
    directives: [],
    actionItems: []
};

export const allMeetingsNov05To11 = [
    meeting05Nov,
    meeting06Nov,
    meeting07Nov,
    meeting08Nov,
    meeting09Nov,
    meeting10Nov,
    meeting11Nov
];

// ============================================================================
// STEP B: Automated Verification Query
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

    console.log(`   - Master Record: Found (${dbMeeting.title}) | Holiday: ${dbMeeting.is_holiday} | NoMeeting: ${dbMeeting.no_meeting_held}`);
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
    console.log('🚀 Reach International Daily Meeting Supabase Ingestion (05 - 11 Nov 2026)');
    console.log('====================================================');

    for (const m of allMeetingsNov05To11) {
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
    console.log('🎉 ALL 7 MEETINGS (05 - 11 NOV 2026) SUCCESSFULLY INGESTED & VERIFIED IN SUPABASE!');
    console.log('====================================================');
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
    run().catch(err => {
        console.error('❌ Ingestion or verification failed:', err);
        process.exit(1);
    });
}
