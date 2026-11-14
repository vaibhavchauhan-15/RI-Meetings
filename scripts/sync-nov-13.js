/**
 * Reach International Operations - Daily Meeting Sync (13 Nov 2026)
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
// MEETING: 13-11-2026 (Friday)
// ============================================================================
export const meeting13Nov = {
    id: "meet-2026-11-13",
    title: "13-11-2026",
    date: "2026-11-13",
    dateFormatted: "13-11-2026",
    focus: "Bhadrak Unit 150 basket welding and cylinder chuck-nut electric weld setup for Tuesday loading, Sanand Unit E-45 cylinder leak overhaul by Deepak and Unit 45-50 pump motor replacement, Bina Unit 60ft sheared stud bolts and laptop dispatch, Korba Unit 1201 starting defect emergency flight mobilization for Rohit, Mundra GS-4047 and JCB 45 traction battery bank procurement, Yanam Unit 5415 cable drag chain installation by Durvesh, and Google Play Store CRM app rollout.",
    isHoliday: false,
    holidayName: "",
    noMeetingHeld: false,
    notRecorded: false,
    breakdowns: [
        {
            site: "Bhadrak / Haldia Project Site (Deenanath Maurya & Banarasi Yadav)",
            model: "JLG 1500SJ Telescopic Boom Lift",
            serialNumber: "Unit 150",
            issue: "Basket fabrication welding pending, cylinder chuck-nut unbolting delayed by lack of electric welder, and heavy tyre unmounted due to manpower shortage.",
            action: "Deenanath engaging local mechanic at 1:00 PM for basket, sourcing electric arc welder for chuck-nut, and preparing loading by Tuesday.",
            logistics: "Technician Anil Rai arriving Monday; machine loading scheduled for Tuesday transport to Haldia.",
            clarification: "Hydraulic cylinder currently has zero active oil leakage; cylinder seal replacement is preventive before client dispatch.",
            pendingIssue: "Complete basket fabrication, source electric arc welding to loosen chuck-nut bolts, and mount inverted tyre.",
            status: "Maintenance In Progress — Basket repair underway, electric welder needed for cylinder chuck-nut, and loading targeted for Tuesday."
        },
        {
            site: "Regional Workshop / Fleet Operations (Deenanath Maurya & Vinod Pal)",
            model: "Heavy Fleet Diesel Engine / Generator",
            serialNumber: "Unit DG-Diesel",
            issue: "Engine expelling excess diesel fuel and producing heavy black smoke and abnormal knocking noise after internal disc/shim misplacement.",
            action: "Deenanath directing site operator to disassemble engine housing and consult technician Vinod Pal to correctly align the internal shim/valve disc.",
            logistics: "Engine internal replacement gaskets and shims available in regional workshop spares.",
            clarification: "Stoppage caused by reverse installation of internal disc during previous reassembly rather than major mechanical seizure.",
            pendingIssue: "Reopen engine valve assembly under Vinod Pal's technical guidance and seat internal shim correctly.",
            status: "Breakdown — Diesel leakage and heavy smoking due to reversed internal shim; operator reassembly in progress."
        },
        {
            site: "Sanand Project Site (Deenanath Maurya & Satendra Kumar)",
            model: "Genie Z-45 Articulating Boom Lift",
            serialNumber: "Unit E-45",
            issue: "Active hydraulic fluid leakage detected on the main boom lift cylinder.",
            action: "Technician Deepak Jangra arrived on site to disassemble cylinder and replace defective hydraulic seals.",
            logistics: "Hydraulic seal kit and overhaul tooling carried directly to site by Deepak Jangra.",
            clarification: "One machine operational on site; Unit E-45 isolated specifically for cylinder leak overhaul.",
            pendingIssue: "Complete cylinder seal replacement, perform hydraulic pressure test, and clear machine for operations.",
            status: "Under Repair — Cylinder seal leaking; technician Deepak Jangra on site executing overhaul."
        },
        {
            site: "Sanand Project Site (Deenanath Maurya)",
            model: "Zoomlion Articulating Boom Lift",
            serialNumber: "Unit 45-50",
            issue: "Auxiliary hydraulic motor pump overheating severely and failing to generate necessary operating pressure.",
            action: "Deenanath inspecting pump motor circuit and submitting emergency store requisition for replacement pump assembly.",
            logistics: "Replacement hydraulic pump motor assembly being requisitioned from central stores.",
            clarification: "Motor pump temperature spikes dangerously during continuous duty cycle, risking total motor winding burnout.",
            pendingIssue: "Test motor pump electrical windings and dispatch replacement pump unit from central inventory.",
            status: "Breakdown — Hydraulic motor pump overheating under load; replacement pump requisitioned."
        },
        {
            site: "Sanand Project Site (Satendra Kumar)",
            model: "Zoomlion Telescopic Boom Lift",
            serialNumber: "Unit 4390",
            issue: "Machine marching and steering functional, but boom elevation and basket functions remain dead since 3rd Nov.",
            action: "Satendra Kumar coordinating on-site troubleshooting of hydraulic proportional control valve coils and electrical harness.",
            logistics: "Control schematics and replacement solenoid coils staged on site for circuit isolation.",
            clarification: "Ground travel functions fully verified; defect confined strictly to upper boom hydraulic elevation circuit.",
            pendingIssue: "Isolate elevation circuit wiring and replace faulty proportional valve coils to restore vertical lift motion.",
            status: "Breakdown — Marching normal but boom elevation disabled; electrical diagnostic in progress."
        },
        {
            site: "Bina Project Site (Satendra Kumar & Ram Babu)",
            model: "Genie S-60 Telescopic Boom Lift",
            serialNumber: "Unit 60ft-Bina",
            issue: "Wheel hub stud bolts sheared and broken internally; electronic control card requires recalibration via diagnostic laptop.",
            action: "Satendra Kumar checking broken stud bolt count; store manager Pardeep dispatching replacement bolts, control card, and laptop together.",
            logistics: "Pardeep consolidating replacement stud bolts, control card, diagnostic laptop, and mounting plate for unified dispatch.",
            clarification: "Stud bolts likely sheared due to prior loosening during operation; technician Ram Babu departing tomorrow to execute site repairs.",
            pendingIssue: "Confirm exact sheared stud bolt count, ship consolidated package with laptop, and execute hub extraction.",
            status: "Breakdown — Sheared hub stud bolts and card issue; consolidated parts and diagnostic laptop dispatch scheduled."
        },
        {
            site: "Yanam Project Site (Satendra Kumar & Durvesh)",
            model: "Telescopic Boom Lift",
            serialNumber: "Unit 5415",
            issue: "Cable drag chain (cable track/drip) damaged and awaiting replacement fitment on site.",
            action: "Technician Durvesh assigned to install the newly delivered cable drag chain assembly onto the machine boom.",
            logistics: "Cable track/drip assembly safely delivered to Yanam site and staged for immediate installation.",
            clarification: "Replacement cable assembly successfully reached destination; technician mobilization underway to fit component.",
            pendingIssue: "Durvesh to complete cable drag chain alignment and harness dressing on the boom structure.",
            status: "Spares Delivered — Cable drag chain arrived on site; technician Durvesh deployed for fitment."
        },
        {
            site: "Regional Operations (Jitendra Budhauliya & Durvesh)",
            model: "Boom Lift 60ft",
            serialNumber: "Unit 6034",
            issue: "Periodic operational inspection and hydraulic function testing required before new deployment.",
            action: "Jitendra Budhauliya scheduling technician Durvesh to mobilize for comprehensive machine inspection following cable fitment.",
            logistics: "Field diagnostic kit and inspection tools staged with mobile technician team.",
            clarification: "Deployment timing being coordinated as mobile technicians are heavily committed across Korba and Haldia sites until Monday.",
            pendingIssue: "Dispatch Durvesh to inspect Unit 6034 upon completion of higher-priority site tasks.",
            status: "Inspection Scheduled — Preventive operational check assigned to Durvesh pending site availability."
        },
        {
            site: "Siliguri Project Site (Pardeep Tomar & Deenanath Maurya)",
            model: "JLG 860SJ Telescopic Boom Lift",
            serialNumber: "Unit 860",
            issue: "Preventive maintenance service overdue; specialized OEM engine and hydraulic filter kit required for client-leased machine.",
            action: "Pardeep Tomar requesting clear filter photos to verify OEM part numbers against cross-hired equipment specifications.",
            logistics: "Filter kit staging at central store pending exact serial and filter part confirmation from site.",
            clarification: "Unit 860 is a Pulkit-leased asset requiring specialized non-standard filters unlike standard fleet units.",
            pendingIssue: "Site team to resend clear filter photographs to allow central store to verify and dispatch matching filters.",
            status: "Spares Verification — Store awaiting clear filter photographs to confirm OEM part numbers before dispatch."
        },
        {
            site: "Korba Project Site (Umesh Kumar & Rohit)",
            model: "JLG 1200SJP Telescopic Boom Lift",
            serialNumber: "Unit 1201",
            issue: "Engine failing to crank/start and electronic safety position sensor malfunctioning.",
            action: "Management booking flight travel to Raipur for technician Rohit to carry replacement sensor and resolve starting defect.",
            logistics: "Air India flight via Raipur being booked as train and bus tickets are completely waitlisted; spares hand-carried by Rohit.",
            clarification: "Direct train and bus options fully exhausted; flight transit authorized due to critical client breakdown urgency at Korba.",
            pendingIssue: "Finalize Raipur flight booking for Rohit and hand over sensor and diagnostic kit from store.",
            status: "Breakdown — Engine starting failure and sensor defect; technician Rohit mobilizing via Raipur flight."
        },
        {
            site: "Korba Project Site (Umesh Kumar)",
            model: "Electric Scissor Lift",
            serialNumber: "Unit 3240 (Korba)",
            issue: "Electrical drive control and lifting platform operational snag reported on site.",
            action: "Technician Rohit instructed to inspect scissor lift controls concurrently during Korba visit.",
            logistics: "Scissor lift electrical spares and multimeters included in Rohit's dispatched tool bag.",
            clarification: "Secondary breakdown on site; inspection scheduled simultaneously with Unit 1201 engine troubleshooting.",
            pendingIssue: "Rohit to troubleshoot scissor lift platform control circuit after resolving Unit 1201 starting issue.",
            status: "Breakdown — Platform control snag reported; technician Rohit to inspect on site."
        },
        {
            site: "Jammu Project Site (Umesh Kumar)",
            model: "Telescopic Boom Lift",
            serialNumber: "Unit 1200 (Jammu)",
            issue: "Routine maintenance check and hydraulic system pressure monitoring required.",
            action: "Umesh Kumar tracking site operations and coordinating with local operator for daily performance logs.",
            logistics: "Routine maintenance consumables managed through local site inventory.",
            clarification: "Machine currently operational but flagged by site supervisor for routine system health audit.",
            pendingIssue: "Review daily operational log sheet and verify hydraulic pressure stability under load.",
            status: "Operational / Monitoring — Daily operational monitoring underway by site team."
        },
        {
            site: "Jammu Project Site (Umesh Kumar)",
            model: "Electric Scissor Lift",
            serialNumber: "Unit 3240 (Jammu)",
            issue: "Battery bank efficiency drop and platform elevation speed degradation reported.",
            action: "Umesh Kumar monitoring battery voltage readings and planning specific gravity testing.",
            logistics: "Standby charger and battery hydrometer maintained at regional site store.",
            clarification: "Unit functioning intermittently; battery cells require comprehensive load and specific gravity testing.",
            pendingIssue: "Conduct battery cell specific gravity check and submit load test report.",
            status: "Operational / Monitoring — Operating with degraded speed; battery cell audit in progress."
        },
        {
            site: "Mundra Project Site (Umesh Kumar & Sushil Mishra)",
            model: "Genie GS-4047 Electric Scissor Lift",
            serialNumber: "Unit 4047 (Mundra)",
            issue: "Traction battery bank completely drained and non-functional despite swapping 2 batteries from JCB unit.",
            action: "Sushil Mishra and Jitendra Budhauliya evaluating procurement of full replacement set of 5 batteries instead of piecemeal replacements.",
            logistics: "Replacement battery consignment arriving in Delhi store tomorrow; expedited transfer to Mundra planned.",
            clarification: "Earlier swap of 2 batteries from JCB unit by operator Devinder failed to revive the machine due to cell degradation.",
            pendingIssue: "Finalize purchase approval for full 5-battery bank to permanently resolve traction power failure.",
            status: "Breakdown — Battery bank failed despite partial swap; full 5-battery set procurement underway."
        },
        {
            site: "Mundra Project Site (Umesh Kumar & Sushil Mishra)",
            model: "JCB Electric Scissor Lift",
            serialNumber: "Unit JCB 45",
            issue: "Equipment rendered completely non-operational following cannibalization of 2 traction batteries for Unit 4047.",
            action: "Sushil Mishra coordinating delivery of fresh battery bank to Delhi depot tomorrow for immediate transshipment to Mundra.",
            logistics: "New industrial battery shipment arriving at Delhi depot tomorrow morning.",
            clarification: "Machine halted specifically because batteries were removed to troubleshoot Unit 4047 under emergency site protocol.",
            pendingIssue: "Receive Delhi battery consignment tomorrow and dispatch replacement pack to Mundra to recommission unit.",
            status: "Grounded / Parts Borrowed — Machine idle following battery removal; replacement pack arriving in Delhi tomorrow."
        },
        {
            site: "Fleet Operations / Regional Workshop (Umesh Kumar & Jitendra Budhauliya)",
            model: "Genie Z-34/22 Articulating Boom Lift",
            serialNumber: "Unit Z-34/20",
            issue: "Drive marching function completely inoperative; repaired control card returned from vendor Chuni Lal failed to function.",
            action: "Jitendra Budhauliya following up with technician Chuni Lal to re-examine or replace the defective electronic control card.",
            logistics: "Electronic drive card sent to external repair specialist; second card replacement under review.",
            clarification: "Control card was sent to Chuni Lal for bench repair but failed operational testing upon reinstallation.",
            pendingIssue: "Vendor Chuni Lal to rectify control card drive logic or supply verified replacement card.",
            status: "Breakdown — Drive marching disabled; repaired control card failed bench test, vendor follow-up underway."
        }
    ],
    parts: [
        {
            part: "JLG 1500SJ Cylinder Chuck-Nut & Seal Kit",
            context: "Bhadrak / Haldia Project Site (Unit 150)",
            statusNextSteps: "Electric arc welder required to tack weld 3 bolts and unscrew chuck-nut without fracturing."
        },
        {
            part: "Engine Internal Valve Shim / Disc & Gasket Set",
            context: "Regional Workshop / Fleet Operations (Unit DG-Diesel)",
            statusNextSteps: "Operator disassembling valve housing to consult Vinod Pal and reseat internal shim correctly."
        },
        {
            part: "Hydraulic Boom Cylinder Seal Kit",
            context: "Sanand Project Site (Unit E-45)",
            statusNextSteps: "Technician Deepak Jangra arrived on site with seal kit and tooling to execute cylinder overhaul."
        },
        {
            part: "Auxiliary Hydraulic Pump Motor Assembly",
            context: "Sanand Project Site (Unit 45-50)",
            statusNextSteps: "Emergency store requisition submitted for replacement pump motor due to severe operational overheating."
        },
        {
            part: "Hydraulic Proportional Elevation Solenoid Coils",
            context: "Sanand Project Site (Unit 4390)",
            statusNextSteps: "Satendra Kumar isolating elevation circuit and testing solenoid coils to restore vertical motion."
        },
        {
            part: "Wheel Hub Stud Bolts & Plate Assembly",
            context: "Bina Project Site (Unit 60ft-Bina)",
            statusNextSteps: "Store manager Pardeep consolidating replacement stud bolts and mounting plate for immediate dispatch."
        },
        {
            part: "Electronic Control Card & Diagnostic Laptop Kit",
            context: "Bina Project Site (Unit 60ft-Bina)",
            statusNextSteps: "Laptop, control card, bag, and number plate consolidated by Pardeep for Ram Babu's visit tomorrow."
        },
        {
            part: "Cable Drag Chain (Track / Drip) Assembly",
            context: "Yanam Project Site (Unit 5415)",
            statusNextSteps: "Consignment safely delivered to site; technician Durvesh mobilizing to install and dress harness."
        },
        {
            part: "JLG 860SJ OEM Maintenance Filter Kit",
            context: "Siliguri Project Site (Unit 860)",
            statusNextSteps: "Store awaiting clear filter photographs from site team to confirm OEM part numbers before shipping."
        },
        {
            part: "Engine Position Sensor & Starting Relay Kit",
            context: "Korba Project Site (Unit 1201)",
            statusNextSteps: "Parts hand-carried by technician Rohit departing on emergency Raipur flight for on-site fitment."
        },
        {
            part: "Scissor Lift Traction Battery Bank (Set of 5 Batteries)",
            context: "Mundra Project Site (Unit 4047)",
            statusNextSteps: "Management evaluating full 5-battery bank purchase instead of individual cell replacements."
        },
        {
            part: "JCB 45 Traction Battery Bank",
            context: "Mundra Project Site (Unit JCB 45)",
            statusNextSteps: "Replacement battery shipment reaching Delhi depot tomorrow for immediate forwarding to Mundra."
        },
        {
            part: "Genie Electronic Drive Control Card",
            context: "Fleet Operations (Unit Z-34/20)",
            statusNextSteps: "Vendor Chuni Lal being contacted to replace or re-service defective drive control card."
        },
        {
            part: "Urgent Field Spares Consignment",
            context: "Patna Project Site (Sushil Mishra)",
            statusNextSteps: "Pardeep Tomar instructed to post itemized list to operations WhatsApp group for immediate processing."
        }
    ],
    directives: [
        {
            title: "Prohibition of Gas Welding on Critical Cylinder Chuck-Nuts",
            points: [
                "Technicians must strictly utilize electric arc welding when tack-welding bolts to loosen hydraulic cylinder chuck-nuts.",
                "Gas welding tack welds lack impact strength and break under hammer blows, creating severe safety risks and damaging threads."
            ]
        },
        {
            title: "Complete Battery Bank Replacement Over Partial Cannibalization",
            points: [
                "Field teams must cease swapping isolated degraded battery cells between equipment, which leads to grounding multiple machines simultaneously.",
                "Full matched 5-battery banks must be procured and installed for traction equipment (such as Mundra 4047 and JCB 45) to ensure reliable duty cycles."
            ]
        },
        {
            title: "Priority Flight Mobilization for Critical Client Stoppages",
            points: [
                "When train and bus tickets are completely waitlisted and customer plant operations face stoppage, management authorizes emergency air transit via Raipur.",
                "Technicians (such as Rohit deploying to Korba) must carry essential sensor and diagnostic spares directly as hand luggage."
            ]
        },
        {
            title: "Mandatory Multi-Channel Escalation for Critical Field Spares",
            points: [
                "Field technicians and storekeepers must post urgent site material requirements immediately to the central operations group rather than relying on unanswered single-phone calls.",
                "All pending Patna spares requests must be prioritized and logged in the CRM system without delay."
            ]
        },
        {
            title: "Official Google Play Store Distribution for Company CRM Mobile App",
            points: [
                "Field engineers and operators must install and update the operational CRM application exclusively through Google Play Store to prevent version drift.",
                "Technicians experiencing Play Store authentication or download stalls will receive direct remote technical assistance from IT support (Vaibhav Chauhan)."
            ]
        }
    ],
    actionItems: [
        {
            person: "Jitendra Budhauliya",
            task: "Authorize Air India flight booking via Raipur for technician Rohit with hand-carried sensors for Korba Unit 1201."
        },
        {
            person: "Jitendra Budhauliya",
            task: "Finalize vendor purchase approval for full 5-battery traction set for Mundra GS-4047 and JCB 45."
        },
        {
            person: "Jitendra Budhauliya",
            task: "Align with client manager Bose regarding technician deployment schedule for Jajpur site following Monday."
        },
        {
            person: "Jitendra Budhauliya",
            task: "Follow up with technician Chuni Lal regarding rectified drive control card for Unit Z-34/20."
        },
        {
            person: "Jitendra Budhauliya",
            task: "Coordinate Tuesday loading schedule for Unit 150 transport from Bhadrak to Haldia."
        },
        {
            person: "Deenanath Maurya",
            task: "Coordinate with local welder at 1:00 PM to arrange electric arc welding for Unit 150 cylinder chuck-nut."
        },
        {
            person: "Deenanath Maurya",
            task: "Supervise site operator in disassembling diesel engine housing and consulting Vinod Pal to realign internal valve shim."
        },
        {
            person: "Deenanath Maurya",
            task: "Support technician Deepak Jangra in replacing leaking boom cylinder seals on Sanand Unit E-45."
        },
        {
            person: "Deenanath Maurya",
            task: "Submit store requisition and test electrical windings for overheating hydraulic pump motor on Unit 45-50."
        },
        {
            person: "Satendra Kumar",
            task: "Inspect and confirm exact count of sheared wheel hub stud bolts on Bina Unit 60ft."
        },
        {
            person: "Satendra Kumar",
            task: "Coordinate with Pardeep Tomar for consolidated dispatch of stud bolts, control card, and diagnostic laptop to Bina."
        },
        {
            person: "Satendra Kumar",
            task: "Trace elevation circuit wiring and solenoid valve coils on Sanand Unit 4390 to restore vertical boom motion."
        },
        {
            person: "Satendra Kumar",
            task: "Connect with Vaibhav Chauhan post-meeting to troubleshoot Google Play Store CRM app download issues."
        },
        {
            person: "Pardeep Tomar",
            task: "Package and dispatch consolidated consignment (stud bolts, control card, diagnostic laptop, and plate) to Bina."
        },
        {
            person: "Pardeep Tomar",
            task: "Review filter photographs from Siliguri site to verify OEM specifications for Pulkit-leased JLG 860SJ."
        },
        {
            person: "Pardeep Tomar",
            task: "Post urgent Patna site material indents to central operations group and process warehouse dispatch."
        },
        {
            person: "Pardeep Tomar",
            task: "Hand over Korba replacement sensor and diagnostic equipment to technician Rohit prior to departure."
        },
        {
            person: "Sushil Mishra",
            task: "Receive incoming battery consignment at Delhi depot tomorrow and coordinate express dispatch to Mundra."
        },
        {
            person: "Sushil Mishra",
            task: "Review Patna site material indents and coordinate immediate dispatch with central store team."
        },
        {
            person: "Umesh Kumar",
            task: "Monitor battery voltages and daily operational log sheets for Jammu Units 1200 and 3240."
        },
        {
            person: "Umesh Kumar",
            task: "Brief technician Rohit on Korba Unit 1201 starting failure and Unit 3240 scissor lift snag before departure."
        },
        {
            person: "Umesh Kumar",
            task: "Follow up on Mundra GS-4047 battery bank procurement and inspect drive card circuit on Unit Z-34/20."
        },
        {
            person: "Vaibhav Chauhan",
            task: "Complete Raipur flight booking for technician Rohit to mobilize for urgent Korba breakdown."
        },
        {
            person: "Vaibhav Chauhan",
            task: "Call Satendra Kumar post-meeting to resolve Google Play Store authentication and CRM app installation issues."
        },
        {
            person: "Imran Khan",
            task: "Verify technician Deepak Jangra's on-site arrival at Sanand and expedite vendor payment clearances."
        },
        {
            person: "Durvesh",
            task: "Complete installation, alignment, and cable harness dressing for the newly arrived cable drag chain on Yanam Unit 5415."
        },
        {
            person: "Durvesh",
            task: "Prepare for operational inspection and function testing of Unit 6034 upon completion of site tasks."
        },
        {
            person: "Rohit",
            task: "Collect replacement sensor and diagnostic kit from store and board scheduled flight to Raipur for Korba breakdown."
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
    console.log('🚀 Reach International Daily Meeting Supabase Ingestion (13 Nov 2026)');
    console.log('====================================================');

    console.log(`\n📥 Ingesting Meeting: ${meeting13Nov.title} (${meeting13Nov.id})...`);
    const res = await syncDailyMeeting(meeting13Nov);
    console.log(`✅ Successfully synced ${res.meetingId}:`);
    console.log(`   - ${res.counts.breakdowns} breakdown machines`);
    console.log(`   - ${res.counts.parts} parts`);
    console.log(`   - ${res.counts.directives} directives`);
    console.log(`   - ${res.counts.actionItems} action items`);

    await verifyMeeting(meeting13Nov);

    console.log('\n====================================================');
    console.log('🎉 MEETING (13 NOV 2026) SUCCESSFULLY INGESTED & VERIFIED IN SUPABASE!');
    console.log('====================================================');
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
    run().catch(err => {
        console.error('❌ Ingestion or verification failed:', err);
        process.exit(1);
    });
}
