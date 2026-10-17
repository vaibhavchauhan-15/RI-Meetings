# Reach International — Operations & Workflow Management System

<p align="center">
  <img src="public/favicon-96x96.png" alt="Reach International Logo" width="80" height="80" />
</p>

<p align="center">
  <strong>Enterprise Operational Workflows, Daily Meeting Reports & Standard Operating Procedures (SOP) Portal</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/Vite-5.4.10-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4.19-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Design_System-v2.1.0-00A8CC?style=flat-square" alt="Design System" />
  <img src="https://img.shields.io/badge/License-Proprietary-0f2537?style=flat-square" alt="License" />
</p>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
  - [1. Interactive SOP Flowcharts Deck](#1-interactive-sop-flowcharts-deck)
  - [2. Daily Operations & Meeting Summaries Hub](#2-daily-operations--meeting-summaries-hub)
  - [3. Operational Reports & Knowledge Base](#3-operational-reports--knowledge-base)
- [System Architecture & Tech Stack](#-system-architecture--tech-stack)
- [Design System & UI Guidelines](#-design-system--ui-guidelines)
  - [Color Palette & Theme Tokens](#color-palette--theme-tokens)
  - [5-Step Cyclic Ribbon System](#5-step-cyclic-ribbon-system)
  - [Stakeholder Role Badges](#stakeholder-role-badges)
  - [Button Hierarchy](#button-hierarchy)
- [Workflow Chapters Index](#-workflow-chapters-index)
- [Data Models & Schema Specifications](#-data-models--schema-specifications)
  - [Workflow Slide Data Schema](#workflow-slide-data-schema)
  - [Daily Meeting Summary Schema](#daily-meeting-summary-schema)
  - [Operational Report Schema](#operational-report-schema)
- [Keyboard & Gesture Navigation](#-keyboard--gesture-navigation)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
  - [Building for Production](#building-for-production)
  - [Previewing Production Build](#previewing-production-build)
- [Deployment](#-deployment)
- [Contributing & Maintenance Rules](#-contributing--maintenance-rules)

---

## 🚀 Overview

The **Reach International Workflow Management System** is a dedicated enterprise web application engineered for industrial plant operations, heavy equipment fleet management (aerial work platforms, scissor lifts, boom lifts, reach trucks, and forklifts from manufacturers such as **JCB, Hyundai, Genie, JLG, Zoomlion, and Palfinger**), store parts procurement, and executive operational coordination.

It serves as the central digital source of truth for:
1. **Interactive Standard Operating Procedures (SOPs)** across procurement, inventory inbound/outbound, machine sales, rentals, and field repairs.
2. **Daily Operations Breakdown & Coordination Meeting Logs** tracking multi-site client deployments across India (Sanand, Micron, JK Paper, Noida, Silvassa, Jammu, Haldia, Korba, Hardoi, CG Power, Mumbai, etc.).
3. **Structured ASCII Text Copy Generators** for distributing daily operational directives and breakdown statuses instantly to management WhatsApp and Slack channels.

---

## ✨ Key Features

### 1. Interactive SOP Flowcharts Deck
- **16:9 Presentation Stage**: Custom-proportioned presentation frame on desktop with horizontal timeline scroll, scroll-snap alignment, and animated direction indicators.
- **Mobile Responsive Timeline**: Automatically transitions to a full-viewport vertical timeline on mobile devices (`≤768px`) with 90° downward rotated connectors.
- **Automated Step Walkthrough Engine**: Step-by-step player that sequentially highlights and scrolls to each flowchart card with Play, Pause, Resume, and Reset controls.
- **Detailed Node Inspection Modal**: Click any card or zoom button to open high-resolution equipment photos, role assignments, full operational descriptions, decision branches, and cross-slide chapter jump links.
- **Visual Slide Deck Grid**: Fast slide indexing overlay (accessible via hotkey `G` or header button) to jump directly between workflow chapters.
- **Background Image Preloading**: Adjacent slide imagery is preloaded in the background via `requestIdleCallback` for instant transitions.

### 2. Daily Operations & Meeting Summaries Hub
- **Date-Wise Meeting Cards Grid**: Browse meetings chronologically with quick-reference tags, focus summaries, and company holiday badges.
- **4-Tier Structured Operational Document View**:
  1. **Section 1 — Machine Breakdowns & Site Updates**: Equipment serial numbers, site names, technician assignments, issues, actions, logistics, and status.
  2. **Section 2 — Parts, Procurement & Inventory**: Responsive table of equipment parts, site context, and procurement next steps.
  3. **Section 3 — Policy & Process Directives**: Executive management directives, technician protocols, and safety rules.
  4. **Section 4 — Key Action Items & Ownership**: Assigned task owners with distinctive avatar badges and bulleted action lists.
- **One-Click Formatted Text Copy**: Standardized ASCII plain-text generator powered by the modern Clipboard API (with textarea fallback) for distributing clean summaries via WhatsApp, Slack, or email.
- **Full-Text Real-Time Search**: Search meetings by date, site, machine model, serial number, technician name, spare part, directive, or owner.
- **Month Filtering Pills**: Filter meeting records by active month with one click.
- **Sequential Day Navigation**: Seamlessly step to the "← Prev Day" or "Next Day →" directly inside the document view, skipping non-working holidays.
- **Company Holiday Alerts**: Built-in official holiday banners (e.g. Rakshabandhan, National Holidays) highlighting closed operations.

### 3. Operational Reports & Knowledge Base
- Filterable repository of formal Standard Operating Procedure documents and process audit metrics.
- Visual mini-flowchart step previews.
- Key operational KPI metric scorecards (PO processing speed, GRN accuracy, dispatch fulfillment rates).

---

## 🏗 System Architecture & Tech Stack

```
+-----------------------------------------------------------------------------+
|                           REACH INTERNATIONAL WEB APP                        |
|                                                                             |
|  +--------------------+  +----------------------+  +---------------------+  |
|  |    Landing Portal  |  |  Workflows Deck      |  |  Daily Meetings Hub |  |
|  |  (Entry Navigation)|  |  (11 SOP Flowcharts) |  |  (Date-wise Logs)   |  |
|  +--------------------+  +----------------------+  +---------------------+  |
|            |                        |                         |             |
|            +------------------------+-------------------------+             |
|                                     |                                       |
|                    +--------------------------------+                       |
|                    |     Core App State & Router    |                       |
|                    |   (WorkflowPresentation.jsx)   |                       |
|                    +--------------------------------+                       |
|                                     |                                       |
|     +-------------------------------+-------------------------------+       |
|     |                               |                               |       |
|  +-------------------+    +--------------------+    +--------------------+  |
|  | Static Data Store |    |  Design System     |    | Utilities & Cache  |  |
|  | - workflowsData   |    |  - design.md       |    | - meetingService.js|  |
|  | - Static JSON DB  |    |  - Tailwind Tokens |    | - meetingUtils.js  |  |
|  |   (years/months)  |    |  - index.css       |    | - Clipboard API    |  |
|  | - reportsData     |    |  - Date Formatters |    | - In-Memory Cache  |  |
|  +-------------------+    +--------------------+    +--------------------+  |
+-----------------------------------------------------------------------------+
```

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [React 18.3](https://react.dev/) | Component architecture, state management with Hooks (`useState`, `useEffect`, `useRef`, `useCallback`, `React.memo`) |
| **Build Tool** | [Vite 5.4](https://vitejs.dev/) | Sub-second HMR development server, optimized ESNext production bundling, rollup chunk splitting |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) + PostCSS | Custom design tokens, safelisted dynamic classes, keyframe animations |
| **Typography** | [Google Fonts (Poppins)](https://fonts.google.com/specimen/Poppins) | Enterprise high-contrast typography (Weights: 300, 400, 500, 600, 700, 800) |
| **Deployment** | [Vercel](https://vercel.com/) | Edge hosting with SPA rewrites configuration (`vercel.json`) |
| **PWA / Mobile** | Web App Manifest & Apple Touch Icons | Fullscreen mobile app capability (`site.webmanifest`, viewport fit cover) |

---

## 🎨 Design System & UI Guidelines

The project strictly follows the **Reach International Design System** defined in [`design.md`](file:///c:/Users/vaibh/PROGRAMMING/PROJECTS/Reach%20International%20Workflow/design.md).

### Non-Negotiable Core Tenets:
1. **Clean Pure White Background (`#ffffff`)**: No dark mode or muddy gradients. The interface uses a clean `#ffffff` surface with a subtle `#f8fafc` stage background.
2. **High-Contrast Typography**: Primary headings in Slate 900 (`#0f172a`), body text in Slate 600 (`#475569`), and metadata in Slate 500 (`#64748b`).
3. **Standard 4px/8px Grid Scale**: Standardized spacing tokens (`4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`, `40px`).
4. **Touch Target Standard**: Minimum **44×44px** touch target for all interactive elements on mobile devices.

### Color Palette & Theme Tokens

```css
:root {
    --bg-white: #ffffff;         /* Main surface */
    --stage-bg: #f8fafc;         /* Secondary stage / table headers */
    --border-light: #e2e8f0;     /* Standard borders */
    --border-dark: #cbd5e1;      /* Input & pill borders */

    --text-primary: #0f172a;     /* Slate 900 */
    --text-secondary: #475569;   /* Slate 600 */
    --text-muted: #64748b;       /* Slate 500 */

    /* Operational Category Colors */
    --theme-breakdown: #0066cc;  /* Vivid Blue (Breakdowns & Site Updates) */
    --theme-parts: #0b84a5;      /* Steel Teal (Parts & Inventory) */
    --theme-directive: #f59e0b;  /* Amber Orange (Directives) */
    --theme-action: #10b981;     /* Emerald Green (Action Items) */
}
```

### 5-Step Cyclic Ribbon System
All workflow cards and step badges follow a mathematical 5-step cyclic sequence `(stepIndex % 5) + 1`:

| Step Index | Token | Color Hex | Visual Role |
| :--- | :--- | :--- | :--- |
| **Step 01 / 06 / 11** | `ribbon-1` | `#0f2537` | Dark Navy |
| **Step 02 / 07 / 12** | `ribbon-2` | `#f59e0b` | Amber Orange |
| **Step 03 / 08 / 13** | `ribbon-3` | `#0b84a5` | Steel Teal |
| **Step 04 / 09 / 14** | `ribbon-4` | `#00a8cc` | Vibrant Cyan |
| **Step 05 / 10 / 15** | `ribbon-5` | `#10b981` | Emerald Green |

### Stakeholder Role Badges

| Role Class | Role Label | Color Badge |
| :--- | :--- | :--- |
| `.role-mgmt` | Management / HOD (Shiv Sir, Mishra Sir, Jitendra Sir) | Navy (`#0f2537`) |
| `.role-sm` | Store Manager (Pradeep) / Service Admin | Steel Teal (`#0b84a5`) |
| `.role-guard` | Security Guard (Gate Entry) | Amber (`#f59e0b`) |
| `.role-eng` | Service Engineer / Technician | Purple (`#6b46c1`) |
| `.role-client` | Client / Customer / Finance | Royal Blue (`#2b6cb0`) |
| `.role-oem` | OEM Manufacturer (JCB, Hyundai, Genie, Zoomlion) | Indigo (`#4c51bf`) |
| `.role-logistics` | Transport / Logistics Team | Ochre (`#b7791f`) |
| `.role-sys` | System / CRM / Supervisor Alert | Crimson (`#e11d48`) |
| `.role-store` | Store & Warehouse Operations | Slate (`#475569`) |

### Button Hierarchy

- **Primary Action (`.btn-primary`)**: Cyan-to-Teal gradient (`linear-gradient(135deg, #00a8cc, #0b84a5)`), white text, hover lift, shadow.
- **Outline Neutral (`.btn-outline`)**: White background, `#e2e8f0` border, `#0f172a` text, hover accent.
- **Success Action (`.btn-success`)**: Solid Emerald Green (`#10b981`) for completed copy actions.
- **Filter Pills (`.month-pill-btn`)**: Rounded pills (`border-radius: 20px`), active `#0066cc` background with white text.

---

## 📚 Workflow Chapters Index

The workflow presentation contains 11 comprehensive Standard Operating Procedure slides:

| Slide # | Chapter | Title | Key Stakeholders Involved |
| :---: | :--- | :--- | :--- |
| **00** | Overview | **Standard Operating Procedures (Cover Slide)** | Executive Overview |
| **01** | Chapter 01 | **Procurement of Parts Workflow** | Store Manager, Purchase HOD, OEM Vendors |
| **02** | Chapter 02 | **Product In Workflow (Parts / Goods Receiving)** | Security Guard, Store Clerk, QA Inspector |
| **03** | Chapter 03 | **Product Out Workflow (Parts Issuance)** | Technician, Store Manager, ERP Admin |
| **04** | Chapter 04 | **Machine Procurement from OEM (JCB, Hyundai, Genie, JLG)** | Procurement Team, OEM Sales, Transport |
| **05** | Chapter 05 | **New Machine Sales Workflow** | Sales Team, Client, Operations HOD |
| **06** | Chapter 06 | **Machine Rental to Customer Workflow** | Rental Desk, Operations, Client Site In-Charge |
| **07** | Chapter 07 | **Own Machine Repair Workflow (Reach Fleet)** | Yard Technicians, Workshop HOD, Store |
| **08** | Chapter 08 | **Customer Machine Repair Workflow (External Client)** | Mobile Technicians, Customer, Service Admin |
| **09** | Chapter 09 | **Machine Service Overdue (Under Warranty)** | Supervisor, Warranty HOD, OEM Engineer |
| **10** | Chapter 10 | **Machine Service Overdue (Out of Warranty)** | Supervisor, Service Admin, Client Finance |

---

## 📊 Data Models & Schema Specifications

### Workflow Slide Data Schema
Located in [`src/data/workflowsData.js`](file:///c:/Users/vaibh/PROGRAMMING/PROJECTS/Reach%20International%20Workflow/src/data/workflowsData.js):

```javascript
{
    id: 1,
    tag: 'CHAPTER 01 • PROCUREMENT',
    title: 'Procurement of Parts Workflow',
    desc: 'Managing stockouts, purchase requisitions, verification, and PO issuance.',
    nodes: [
        { 
            step: 'STEP 01', 
            role: 'Store Manager (Pradeep)', 
            roleClass: 'role-sm',            // Standard role class from design system
            icon: '⚠️', 
            bgClass: 'bg-red', 
            title: 'Stock Out Detected', 
            desc: 'Store Manager identifies inventory shortage during routine audit.', 
            tag: 'Zero Stock Alert', 
            isAlert: true,                   // Optional alert styling (red border)
            isSuccess: false,                 // Optional success styling (green border)
            photo: '/images/stock-out-detected.png', // 4:3 ratio photo thumbnail
            isDecision: false,               // Optional decision branch toggle
            yesText: 'PO APPROVED ➔ Proceed',
            noText: 'HOLD ➔ Re-quote',
            linkSlide: 2                     // Optional jump to linked chapter index
        }
    ]
}
```

### Daily Meeting Summary Schema
Located in individual daily JSON files at `src/data/meetings/YYYY/MM/DD.json` (e.g. [`src/data/meetings/2026/09/02.json`](file:///c:/Users/vaibh/PROGRAMMING/PROJECTS/Reach%20International%20Workflow/src/data/meetings/2026/09/02.json)):

```json
{
    id: 'meet-2026-09-02',
    title: '02 Sep 2026',
    date: '2026-09-02',
    dateFormatted: '02 Sep 2026',
    focus: 'Fleet Breakdown Resolutions, Battery Load Tests, and Night Shift Protocols',
    isHoliday: false,                        // Set true for official holiday records
    holidayName: 'Rakshabandhan',            // Display name if isHoliday is true
    breakdowns: [
        {
            site: 'Blue Star / Micron Site (Sanand) — JCB 3246 (Unit 1)',
            issue: 'Severe battery discharge failure — machine cuts off at 50% charge.',
            action: 'Technician Deepak performing cell-by-cell load tests.',
            logistics: 'Transit battery backup arranged from Ahmedabad.',
            clarification: 'Verified 2024 OEM warranty eligibility.',
            status: 'Cell Load Test & Service Report Underway',
            pendingIssue: 'Awaiting OEM technician sign-off.'
        }
    ],
    parts: [
        {
            part: 'JCB 3246 Battery Bank (6V x 4)',
            context: 'Micron Site (Sanand) / Unit 3362500',
            statusNextSteps: 'Load tested; warranty claim filed with OEM.'
        }
    ],
    directives: [
        {
            title: 'Night Shift & Overtime Protocol',
            points: [
                'Emergency night calls (10 PM – 6 AM) credited at 2x OT rate.',
                'Mandatory gate punch documentation for night work validation.'
            ]
        }
    ],
    actionItems: [
        {
            person: 'Pardeep Tomar & Deepak',
            task: 'Complete cell voltage logging for all 5 Sanand units by 4 PM; submit report.'
        }
    ]
}
```

### Operational Report Schema
Located in [`src/data/reportsData.js`](file:///c:/Users/vaibh/PROGRAMMING/PROJECTS/Reach%20International%20Workflow/src/data/reportsData.js):

```javascript
{
    id: 'report-procurement-01',
    title: 'Procurement & Purchase Order Requisition Standard Workflow Report',
    category: 'Procurement',
    date: '2026-08-24',
    author: 'Shiv Sir / Mishra Sir',
    department: 'Purchase & Inventory Management',
    summary: 'Operational analysis of stock-out detection and vendor approvals.',
    status: 'Approved & Active',
    badgeColor: '#00a8cc',
    keyMetrics: [
        { label: 'Avg PO Processing Time', value: '1.8 Days' },
        { label: 'Vendor Approval Rate', value: '98.4%' }
    ],
    workflowTitle: 'Procurement Process Flowchart',
    workflowNodes: [
        { step: 'Step 1', title: 'Stock Out Detected', role: 'Store Manager (Pradeep)', status: 'Warning', desc: '...' }
    ],
    sections: [
        { title: 'Executive Summary', content: '...' },
        { title: 'Standard Operating Procedure Guidelines', content: '...' }
    ]
}
```

---

## ⌨️ Keyboard & Gesture Navigation

| Trigger / Key | Action | Context |
| :--- | :--- | :--- |
| <kbd>→</kbd> or <kbd>Space</kbd> | Navigate to Next Slide | Presentation Deck (`activePage: workflows`) |
| <kbd>←</kbd> | Navigate to Previous Slide | Presentation Deck (`activePage: workflows`) |
| <kbd>F</kbd> | Toggle Fullscreen Mode | Presentation Deck |
| <kbd>G</kbd> | Open Slide Deck Overview Grid | Presentation Deck |
| <kbd>Escape</kbd> | Close Active Modal / Overview Grid | Global |
| **Mouse Wheel / Trackpad** | Swipe between slides (debounced) | Presentation Stage (bypasses horizontal flowchart scroll) |
| **Touch Swipe Left / Right** | Swipe between slides (with threshold) | Presentation Stage on touch devices |

---

## 📁 Project Directory Structure

```
Reach-International-Workflow/
├── public/                    # Static public assets (logo.png, favicons, manifests)
├── scripts/                   # Automated CLI pipelines, ingestion & verification
│   ├── sync-supabase.js       # Universal atomic daily meeting ingestion & verification script
│   ├── verify-holidays.js     # 200-test assertion suite for 2026 calendar & holidays
│   ├── test-search.js         # Multi-token scoring search engine unit test suite
│   ├── test-normalizers-schemas.js # Breakdown normalizer & runtime schema test suite
│   ├── test-visual-calendar.js # Playwright visual & interactive cross-viewport test suite
│   └── seed-supabase.js       # Historical database seeder
├── src/
│   ├── components/
│   │   ├── layout/            # Shared layout components (Navbar.jsx)
│   │   ├── shared/            # Cross-feature components (MeetingShareMenu.jsx, PresentationOverlay.jsx)
│   │   └── ui/                # Generic reusable UI primitives (Badge, Button, Card, Input, ErrorBoundary, Skeleton)
│   ├── features/
│   │   ├── holidays/          # 2026 Indian & Company Holiday Calendar feature
│   │   │   ├── components/    # HolidayCalendar, CalendarGrid, CalendarHeader, HolidayDetails, UpcomingHolidays
│   │   │   ├── data/          # companyHolidays2026.js (pure dataset & date indexes)
│   │   │   ├── hooks/         # useHolidayCalendar.js
│   │   │   ├── services/      # holidayService.js (event querying & upcoming holidays)
│   │   │   ├── types/         # holidayTypes.js (JSDoc schema contracts)
│   │   │   └── utils/         # holidayDateUtils.js (calendar math, day counts & formatting)
│   │   └── meeting-reports/   # Daily Operational Meeting Reports feature
│   │       ├── components/    # MeetingSummariesPage, BreakdownCard, BreakdownSection, PartsSection, DirectivesSection, ActionItemsSection, MeetingCard, MeetingList, MeetingDetailDocument, MonthFilterBar, ChronologicalNav, TextHighlightPopup
│   │       ├── hooks/         # useMeetingData.js, useMeetingUrlSync.js, useTextHighlighter.js
│   │       ├── services/      # meetingService.js, excelExportService.js (lazy on-demand ExcelJS)
│   │       ├── schemas/       # meetingSchemas.js (runtime schema validation)
│   │       ├── types/         # meetingTypes.js (JSDoc data models)
│   │       └── utils/         # breakdownNormalizer.js, meetingDateUtils.js, meetingFormatters.js, searchEngine.js
│   ├── lib/
│   │   ├── api/               # apiClient.js (centralized query wrapper & response envelopes)
│   │   ├── config/            # env.js (validated client configuration, zero hardcoded fallback secrets)
│   │   ├── errors/            # AppError.js (DatabaseError, NotFoundError, ValidationError, ExportError)
│   │   ├── supabase/          # client.js (clean Supabase client factory)
│   │   └── validation/        # validator.js (schema assertions & ISO date validation)
│   ├── utils/                 # Backward-compatibility alias wrappers for external scripts
│   ├── App.jsx                # Application root with clean component imports
│   ├── index.css              # Design tokens & utility classes
│   └── main.jsx               # Entry point wrapped with ErrorBoundary
├── supabase/                  # PostgreSQL schema, migrations & Deno edge function webhook
├── AGENTS.md / GEMINI.md      # Strict AI agent rules & design system enforcement
├── design.md                  # Comprehensive Design System & Specification v2.1.0
├── package.json               # Dependencies, scripts, and project metadata
└── vite.config.js             # Vite build pipeline & vendor chunking rules
```

---

## 🛠 Getting Started

### Prerequisites
- **Node.js**: Version `18.0.0` or higher
- **npm**: Version `9.0.0` or higher

### Environment Configuration

Create a `.env` file in the project root based on `.env.example`:

```bash
cp .env.example .env
```

Ensure the following variables are configured:

```env
# Client-Side (Vite)
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>

# Server-Side Ingestion Scripts
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

### Installation

```bash
npm install
```

### Running Locally

```bash
npm run dev
```

### Automated Testing

Run the full automated test suite (holiday calculations, calendar rules, smart search scoring, breakdown normalizers, runtime validation schemas, and error hierarchies):

```bash
npm test
```

Run Playwright visual & interactive cross-viewport test suite:

```bash
npm run test:visual
```

### Building for Production

Compile and bundle the application into `dist/` with automated vendor chunking and lazy on-demand ExcelJS:

```bash
npm run build
```

### Previewing Production Build

Locally test the built production bundle:

```bash
npm run preview
```

---

## 🌐 Deployment

The application is fully configured for zero-configuration continuous deployment on **Vercel**.

### Vercel Configuration (`vercel.json`)
The project includes a `vercel.json` file to ensure client-side Single Page Application (SPA) routing works smoothly:

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

To deploy via Vercel CLI:
```bash
npm install -g vercel
vercel
```

---

## 🔒 Contributing & Maintenance Rules

When updating or extending this repository, all contributors and AI agents must strictly adhere to the following rules:

1. **Consult `design.md` First**: Never introduce arbitrary hex colors, one-off padding values, or deviating button styles.
2. **Preserve Clean White Canvas**: Keep the pure `#ffffff` background with `#f8fafc` stage tone. Do not introduce dark mode themes.
3. **Dual Viewport Verification**: Any new UI feature must be verified on both Desktop (`>1024px`) and Mobile (`≤768px`).
4. **Clipboard Utility Parity**: If modifying the schema in `src/data/meetings/YYYY/MM/DD.json`, you **must** update `formatMeetingSummary()` inside [`src/utils/meetingUtils.js`](file:///c:/Users/vaibh/PROGRAMMING/PROJECTS/Reach%20International%20Workflow/src/utils/meetingUtils.js) to keep text exports in sync.
5. **No Broken Touch Targets**: Ensure all buttons and touchable icons maintain at least `44×44px` on mobile screens.

---

<p align="center">
  <strong>Reach International</strong> • Operational Excellence & Fleet Management System
</p>
