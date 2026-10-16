# AI AGENT RULES: REACH INTERNATIONAL DESIGN SYSTEM ENFORCEMENT

All AI agents working within this workspace MUST strictly follow the design specifications, visual guidelines, padding scales, button hierarchies, component structures, and responsive rules defined in [`design.md`](file:///c:/Users/vaibh/PROGRAMMING/PROJECTS/Reach%20International%20Workflow/design.md).

---

## 1. Core Mandates & Universal Web App Consistency

1. **Strict Adherence to `design.md`**:
   - Before adding or modifying any UI component, CSS styles, presentation slides, or meeting summaries, consult [`design.md`](file:///c:/Users/vaibh/PROGRAMMING/PROJECTS/Reach%20International%20Workflow/design.md).
   - Do NOT introduce arbitrary hex colors, arbitrary fonts, or deviating layout structures.

2. **Clean Plain White Background & High Contrast Aesthetic**:
   - Maintain the crisp plain white background (`#ffffff`) and subtle stage tone (`#f8fafc`).
   - Do NOT introduce dark mode themes or muddy background gradients.
   - Text must always strictly maintain high contrast against white backgrounds (`--text-primary: #0f172a`, `--text-secondary: #475569`, `--text-muted: #64748b`).

3. **Standard Padding & Spacing Consistency**:
   - All components must use the standardized 4px/8px grid scale defined in `design.md` (`4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`, `40px`).
   - Always apply the standard component padding matrix (Desktop stage `24px 32px`, Mobile stage `8px 10px`, Desktop card `24px`, Mobile card `14px`, Table cell `14px 18px` desktop / `10px 12px` mobile).
   - Never use arbitrary one-off paddings or unaligned margins.

4. **Standard Button Hierarchy & Interactive States**:
   - Only use standardized button classes:
     - **Primary Action**: `.btn-primary` (gradient cyan to teal `#00a8cc` ➔ `#0b84a5` with white text & hover lift).
     - **Outline / Neutral**: `.btn-outline` (white background with `#e2e8f0` border & hover accent).
     - **Success Action**: `.btn-success` (`#10b981` with white text).
     - **Icon Action**: `.btn-icon` / `.open-large-btn` (standardized icon dimensions).
     - **Filter Pill**: `.month-pill-btn` (`border-radius: 20px` with active `#0066cc`).
   - Every button must define hover, active (`scale(0.98)` or `scale(0.94)` for icons), and focus states.
   - Minimum mobile touch target: **44×44px**.

5. **Mandatory Mobile & Desktop Dual-Viewport Support**:
   - Every layout addition or change MUST support both Desktop (`>1024px`) and Mobile (`≤768px` / `≤480px`).
   - Never implement a desktop-only feature without its mobile responsive equivalent (e.g. horizontal flowchart on desktop ➔ vertical timeline on mobile; 2-column grids on desktop ➔ 1-column stacks on mobile; tables in `.clean-table-responsive` with touch scroll).

---

## 2. Presentation Decks (Workflows) Standards

When adding or editing workflow slides in `src/data/workflowsData.js` or `src/components/`:

- **Node Data Schema**:
  ```js
  {
      step: 'STEP 01',                  // Step label
      role: 'Store Manager (Pradeep)',  // Stakeholder name
      roleClass: 'role-sm',             // Must use one of the standard role classes
      icon: '⚠️',                       // Emoji / Icon
      bgClass: 'bg-red',                // Background class
      title: 'Short Title',             // Concise step title
      desc: 'Detailed action description...', // 2-line clamped on card, full in modal
      tag: 'Status Tag',                // Bottom metadata tag
      photo: '/images/filename.png',    // 4:3 photo path
      isSuccess: false,                 // Optional green success highlight
      isAlert: false,                   // Optional red alert highlight
      isDecision: false,                // Optional decision branch with yesText/noText
      linkSlide: 2                      // Optional jump to chapter slide index
  }
  ```
- **5-Step Ribbon Color Cycle**:
  - Chevron ribbon and bottom accent pill colors must follow `(stepIndex % 5) + 1` corresponding to:
    1. Navy (`#0f2537`)
    2. Amber (`#f59e0b`)
    3. Steel Teal (`#0b84a5`)
    4. Vibrant Cyan (`#00a8cc`)
    5. Emerald Green (`#10b981`)
- **Role Badges**: Use only standard role badge classes (`.role-mgmt`, `.role-sm`, `.role-guard`, `.role-eng`, `.role-client`, `.role-oem`, `.role-logistics`, `.role-sys`, `.role-store`).
- **Responsive Layout**:
  - **Desktop**: 16:9 stage frame (`.ppt-stage-frame`), horizontal scroll with snap alignment, floating navigation buttons, and animated arrow connectors.
  - **Mobile (`≤768px`)**: Unlocked full-height stage (`100dvh`), vertical timeline flow, arrows rotated 90° down, touch swipe slide transitions.

---

## 3. Daily Meeting Summaries & Continuous Cloud Ingestion Workflow

### Mandatory Protocol for Every Conversation
Whenever the user provides a meeting summary and/or raw transcript (in Hindi, Hinglish, or English):

1. **Translation & Distillation into English**:
   - Translate all Hindi/Hinglish transcripts and notes into professional, polished English.
   - Accurately extract machine models, serial numbers, sites, technical defects, root causes, assigned technicians, logistics, and next steps.

2. **100% Cloud-Native Database Storage (Zero Static JSON Files)**:
   - **DO NOT** create, write, or modify static JSON files in `src/data/` or anywhere in the workspace repository.
   - All meeting records are stored directly in Supabase (`meetings`, `breakdown_machines`, `meeting_parts`, `meeting_directives`, `meeting_action_items`).
   - Use the dedicated daily ingestion pipeline:
     ```bash
     node scripts/sync-supabase.js <path-or-json>
     # or via npm script:
     npm run sync:supabase -- <path-or-json>
     # or legacy:
     npm run meeting:sync -- <path-or-json>
     ```
     Or programmatically import and execute `syncToSupabase(data)` from `scripts/sync-supabase.js`.
   - **DO NOT** use `seed-supabase.js` for daily meetings (which re-seeds historical data). The streamlined pipeline atomically upserts ONLY that specific day's meeting, preventing repetitive database re-seeding.

3. **Strict One Machine = One Breakdown Card Rule**:
   - Every breakdown card MUST represent strictly ONE machine.
   - NEVER bundle, group, or mix multiple machines, models, or serial numbers into a single card.
   - If a site discusses 3 machines, create 3 separate breakdown cards.

4. **Concise, Single-Line Informative Fields Rule**:
   - First properly analyze the meeting transcript and raw summary.
   - Distill each point to be very short, concise, and informative in ONE line for effortless reading:
     - **Meeting `focus`**: Exactly 1 short line summarizing key equipment priorities.
     - **Breakdown `issue`**: Exactly 1 short line stating the exact problem/defect.
     - **Breakdown `action`**: Exactly 1 short line stating the assigned person and action.
     - **Breakdown `logistics`**: Exactly 1 short line (omit if none).
     - **Breakdown `clarification`**: Exactly 1 short line (omit if none).
     - **Breakdown `pendingIssue`**: Exactly 1 short line stating the immediate next step.
     - **Breakdown `status`**: Exactly 1 short line stating current status.
     - **Directives `points`**: Each bullet point must be exactly 1 short line.
     - **Action Items `task`**: Exactly 1 short line per assignee.

5. **Meeting Data Schema**:
   ```json
   {
       "id": "meet-YYYY-MM-DD",
       "title": "DD-MM-YYYY",
       "date": "YYYY-MM-DD",
       "dateFormatted": "DD-MM-YYYY",
       "focus": "Single-line high-level meeting agenda & focus areas",
       "isHoliday": false,
       "holidayName": "",
       "breakdowns": [
           { 
             "site": "Site Name", 
             "model": "Machine Model", 
             "serialNumber": "Serial or N/A", 
             "issue": "1-line defect description", 
             "action": "1-line assigned action & technician", 
             "logistics": "1-line logistics/parts dispatch", 
             "clarification": "1-line operating/billing context", 
             "pendingIssue": "1-line immediate next blocker", 
             "status": "1-line machine lifecycle status" 
           }
       ],
       "parts": [
           { "part": "Part Name", "context": "Site / Equipment Context", "statusNextSteps": "1-line status & next steps" }
       ],
       "directives": [
           { "title": "Directive Name", "points": ["1-line point 1", "1-line point 2"] }
       ],
       "actionItems": [
           { "person": "Owner Name", "task": "1-line assigned task details" }
       ]
   }
   ```

6. **Mandatory Supabase Ingestion Verification Before GitHub Synchronization**:
   - **Step A (Direct Supabase Ingestion)**: Ingest the meeting data directly into Supabase using `node scripts/sync-supabase.js <path-or-json>` (or `npm run sync:supabase -- <path-or-json>`) or via the Supabase Edge Function webhook.
   - **Step B (Explicit Verification Check)**: Before staging, committing, or pushing code to GitHub, agents MUST run an explicit database verification query confirming that:
     1. The master record exists in the `meetings` table.
     2. All child records exist in `breakdown_machines`, `meeting_parts`, `meeting_directives`, and `meeting_action_items` with matching record counts.
     3. No errors or missing associations occurred during ingestion.
   - **Step C (Git Commit & Push)**: ONLY AFTER explicit confirmation that all meeting records are successfully persisted in Supabase, commit any workspace changes and push to GitHub (`git push origin main`). Under NO circumstances should changes be committed or pushed to GitHub if database ingestion is unverified or failed.

7. **Supabase Edge Function Webhook Trigger (Slack & WhatsApp Bot Ingestion)**:
   - For automated real-time ingestion from external messaging platforms (Slack bots, WhatsApp bots, n8n, Zapier):
     - **Endpoint**: `POST https://<PROJECT_REF>.supabase.co/functions/v1/sync-meeting-webhook`
     - **Authentication**: `Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>` or `x-webhook-secret: <SYNC_WEBHOOK_SECRET>` (set in Supabase Edge Function secrets).
     - **Payload**: Standard JSON body containing the meeting schema (`date`, `title`, `focus`, `breakdowns`, `parts`, `directives`, `actionItems`).
     - **Automated Handling**: The webhook automatically cleans text to concise 1-line strings, unbundles composite/multi-serial machine entries into individual breakdown cards, and atomically upserts all tables in Supabase with zero static file creation.

- **Skeleton Loading Requirements**:
  - Both Meeting Card archive list and Meeting Details operational document MUST use animated skeleton loaders while data is fetching. Do NOT use isolated loading spinners.

- **Document Layout**:
  - **Header**: Main title, formatted date, agenda focus.
  - **Section 1 (Breakdowns)**: Desktop 2-column grid (`minmax(420px, 1fr)`), mobile 1-column stack, left blue border (`border-left: 4px solid #0066cc`). Do NOT include redundant model/serial pill containers in card headers or Excel export buttons in the section header.
  - **Section 2 (Parts Table)**: Responsive table container (`.clean-table-responsive`) with horizontal touch scroll.
  - **Section 3 (Directives)**: Amber background (`#fffbeb`) with `border-left: 4px solid #f59e0b`.
  - **Section 4 (Action Items)**: Emerald background (`#f0fdf4`) with `border-left: 4px solid #10b981`.
- **Text Copy Functionality**:
  - Any updates to the meeting data structure MUST be reflected in `formatMeetingSummary()` inside [`src/utils/meetingUtils.js`](file:///c:/Users/vaibh/PROGRAMMING/PROJECTS/Reach%20International%20Workflow/src/utils/meetingUtils.js).

---

## 4. UI/UX Quality & Performance Requirements

1. **Touch Ergonomics**: Minimum touch targets of 44×44px on mobile devices.
2. **Keyboard Hotkeys**: Retain global navigation keys (`ArrowRight`, `ArrowLeft`, `F` for fullscreen, `G` for grid overview, `Escape` for closing modals). Ensure input fields do not trigger slide changes.
3. **GPU Animations**: Use CSS `transform: translate3d` and `will-change` where appropriate to ensure buttery 60fps animations.
4. **Image Optimization**: Retain background idle preloading for adjacent slides.
