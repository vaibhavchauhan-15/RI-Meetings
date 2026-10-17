/**
 * Reach International Operations - Excel Fleet Breakdown Export Service
 * 
 * Generates beautifully formatted, optimized Excel workbooks (.xlsx).
 * Complies strictly with Reach International design system & user specifications:
 * - Exactly ONE MACHINE per row (never mixes multiple machines or serials in one row).
 * - Columns: Date, Machine Model, Serial / Unit No., Site / Location, Issue (1-line concise problem).
 * - Kept strictly Issue in Excel export (separate columns for Action, Logistics, Clarification, Pending, Status excluded).
 * - Auto-filter, frozen header panes, word wrapping, customized column widths.
 * - Brand styling: Navy (#0F2537), Teal (#0B84A5), Emerald (#10B981), Amber (#F59E0B).
 * - PERFORMANCE: Dynamically imports ExcelJS on-demand to save ~1MB on initial bundle.
 */

import { formatDateDDMMYYYY, normalizeDateToYYYYMMDD } from '../utils/meetingDateUtils.js';
import { unbundleBreakdownEntry, extractCleanMachineProblem } from '../utils/breakdownNormalizer.js';
import { fetchBreakdownMachinesFromDb } from './meetingService.js';
import { ExportError } from '../../../lib/errors/AppError.js';

// Lazy loader for ExcelJS to avoid bundling ~1MB into initial page load
let ExcelJSModule = null;
async function getExcelJS() {
    if (!ExcelJSModule) {
        const mod = await import('exceljs/dist/exceljs.min.js');
        ExcelJSModule = mod.default || mod;
    }
    return ExcelJSModule;
}

// Color definitions for ExcelJS (ARGB hex format)
const BRAND_COLORS = {
    NAVY: 'FF0F2537',
    TEAL: 'FF0B84A5',
    CYAN: 'FF00A8CC',
    EMERALD: 'FF10B981',
    EMERALD_DARK: 'FF059669',
    AMBER: 'FFF59E0B',
    AMBER_DARK: 'FFD97706',
    WHITE: 'FFFFFFFF',
    ZEBRA_BG: 'FFF8FAFC',
    BORDER_LIGHT: 'FFE2E8F0',
    TEXT_PRIMARY: 'FF0F172A',
    TEXT_SECONDARY: 'FF475569',
    TEXT_MUTED: 'FF64748B',
    SUBTITLE_BG: 'FFF1F5F9'
};

const BORDER_STYLE_THIN = {
    top: { style: 'thin', color: { argb: BRAND_COLORS.BORDER_LIGHT } },
    left: { style: 'thin', color: { argb: BRAND_COLORS.BORDER_LIGHT } },
    bottom: { style: 'thin', color: { argb: BRAND_COLORS.BORDER_LIGHT } },
    right: { style: 'thin', color: { argb: BRAND_COLORS.BORDER_LIGHT } }
};

/**
 * Helper to extract machine fields for backward compatibility
 */
export function extractMachineFields(breakdown, fallbackDate = '') {
    const list = unbundleBreakdownEntry(breakdown, fallbackDate);
    const m = list[0] || {};
    return {
        date: m.date || '',
        model: m.machine_model || 'MEWP / General Equipment',
        serialNumber: m.serial_number || 'N/A',
        location: m.site_location || 'General Fleet Site',
        siteFull: breakdown?.site || m.site_location || '',
        issue: m.short_issue || breakdown?.issue || '',
        action: m.short_action || breakdown?.action || '',
        logistics: m.short_logistics || breakdown?.logistics || '',
        status: m.short_status || breakdown?.status || '',
        pendingIssue: m.short_pending || breakdown?.pendingIssue || '',
        shortSummary: m.short_summary || ''
    };
}

function applyPrintSetup(worksheet) {
    worksheet.pageSetup = {
        orientation: 'landscape',
        paperSize: 9, // A4
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
        margins: {
            left: 0.5, right: 0.5,
            top: 0.6, bottom: 0.6,
            header: 0.3, footer: 0.3
        },
        showGridLines: true
    };
}

function applyWorksheetHeader(worksheet, title, subtitle, maxColLetter = 'F') {
    worksheet.mergeCells(`A1:${maxColLetter}1`);
    const titleCell = worksheet.getCell('A1');
    titleCell.value = title;
    titleCell.font = { name: 'Segoe UI', size: 13, bold: true, color: { argb: BRAND_COLORS.WHITE } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BRAND_COLORS.NAVY } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getRow(1).height = 34;

    worksheet.mergeCells(`A2:${maxColLetter}2`);
    const subCell = worksheet.getCell('A2');
    subCell.value = subtitle;
    subCell.font = { name: 'Segoe UI', size: 9.5, italic: true, color: { argb: BRAND_COLORS.TEXT_SECONDARY } };
    subCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BRAND_COLORS.SUBTITLE_BG } };
    subCell.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getRow(2).height = 20;

    worksheet.getRow(3).height = 8;
}

const BREAKDOWN_COLUMNS = [
    { header: '#', key: 'idx', width: 6, align: 'center' },
    { header: 'Date', key: 'date', width: 14, align: 'center' },
    { header: 'Machine Model', key: 'model', width: 28, align: 'left' },
    { header: 'Serial / Unit No.', key: 'serial', width: 18, align: 'center' },
    { header: 'Site / Location', key: 'location', width: 28, align: 'left' },
    { header: 'Issue', key: 'issue', width: 65, align: 'left' }
];

function renderBreakdownTableHeader(worksheet) {
    const headerRow = worksheet.getRow(4);
    headerRow.height = 28;

    BREAKDOWN_COLUMNS.forEach((col, idx) => {
        const cell = headerRow.getCell(idx + 1);
        cell.value = col.header;
        cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: BRAND_COLORS.WHITE } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BRAND_COLORS.TEAL } };
        cell.alignment = { vertical: 'middle', horizontal: col.align };
        cell.border = BORDER_STYLE_THIN;
        worksheet.getColumn(idx + 1).width = col.width;
    });
}

function renderMachineRows(worksheet, machineList, emptyMessage = 'No breakdown incidents reported.') {
    if (!machineList || machineList.length === 0) {
        const emptyRow = worksheet.getRow(5);
        emptyRow.height = 26;
        worksheet.mergeCells('A5:F5');
        const emptyCell = emptyRow.getCell(1);
        emptyCell.value = emptyMessage;
        emptyCell.font = { name: 'Segoe UI', size: 10, italic: true, color: { argb: BRAND_COLORS.TEXT_MUTED } };
        emptyCell.alignment = { vertical: 'middle', horizontal: 'center' };
        emptyCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BRAND_COLORS.ZEBRA_BG } };
        emptyCell.border = BORDER_STYLE_THIN;
        return;
    }

    machineList.forEach((mach, index) => {
        const rowIndex = index + 5;
        const row = worksheet.getRow(rowIndex);
        const isEven = index % 2 === 0;
        const rowBg = isEven ? BRAND_COLORS.WHITE : BRAND_COLORS.ZEBRA_BG;

        const dateStr = mach.date || formatDateDDMMYYYY(mach.rawDate || '');
        const modelStr = mach.model || mach.machine_model || 'MEWP / General Equipment';
        const serialStr = mach.serial_number || mach.serial || 'N/A';
        const siteStr = mach.site || mach.site_location || mach.location || 'General Fleet Site';

        const issueStr = mach.issue || extractCleanMachineProblem(
            mach.short_issue || mach.problem || mach.full_issue || mach.description || mach.short_summary,
            modelStr,
            serialStr
        );

        row.values = [
            index + 1,
            dateStr,
            modelStr,
            serialStr,
            siteStr,
            issueStr
        ];

        for (let c = 1; c <= 6; c++) {
            const cell = row.getCell(c);
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowBg } };
            cell.border = BORDER_STYLE_THIN;
            cell.font = { name: 'Segoe UI', size: 9.5, color: { argb: BRAND_COLORS.TEXT_PRIMARY } };
            cell.alignment = {
                vertical: 'top',
                horizontal: BREAKDOWN_COLUMNS[c - 1].align,
                wrapText: c === 6
            };

            if (c === 1) {
                cell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: BRAND_COLORS.TEXT_MUTED } };
            } else if (c === 2) {
                cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: BRAND_COLORS.NAVY } };
            } else if (c === 3) {
                cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: BRAND_COLORS.NAVY } };
            } else if (c === 4) {
                cell.font = { name: 'Segoe UI', size: 9.5, bold: serialStr !== 'N/A', color: { argb: BRAND_COLORS.TEAL } };
            } else if (c === 5) {
                cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: BRAND_COLORS.TEXT_PRIMARY } };
            }
        }

        row.height = (issueStr && issueStr.length > 70) ? 32 : 24;
    });

    if (machineList && machineList.length > 0) {
        worksheet.autoFilter = {
            from: { row: 4, column: 1 },
            to: { row: machineList.length + 4, column: 6 }
        };
    }
}

/**
 * Exports breakdowns of a single meeting to an Excel file
 * Extracts strictly ONE MACHINE per row (unbundling any composite rows).
 */
export async function exportMeetingBreakdownsToExcel(meeting) {
    if (!meeting) {
        console.warn('exportMeetingBreakdownsToExcel: No meeting provided');
        return false;
    }

    try {
        const ExcelJS = await getExcelJS();
        const meetingDate = formatDateDDMMYYYY(meeting.date || meeting.dateDisplay || meeting.dateFormatted || meeting.title);
        const meetingId = meeting.id || `meet-${meeting.date}`;

        // Fetch unbundled rows from Supabase or fallback to local
        let machineList = await fetchBreakdownMachinesFromDb({ meetingId });

        if (!machineList || machineList.length === 0) {
            const rawBreakdowns = meeting.breakdowns || [];
            machineList = [];
            rawBreakdowns.forEach(b => {
                const unbundled = unbundleBreakdownEntry(b, meeting.date || meetingDate);
                machineList.push(...unbundled);
            });
        }

        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Reach International Workflow';
        workbook.lastModifiedBy = 'Reach International System';
        workbook.created = new Date();
        workbook.modified = new Date();

        const wsBreakdowns = workbook.addWorksheet('Breakdowns Register', {
            views: [{ state: 'frozen', ySplit: 4, showGridLines: true }]
        });
        applyPrintSetup(wsBreakdowns);

        const titleText = `REACH INTERNATIONAL — FLEET BREAKDOWN REGISTER`;
        const subtitleText = `Meeting Date: ${meetingDate} | Total Machines Logged: ${machineList.length} | Exported: ${new Date().toLocaleString('en-IN')}`;
        applyWorksheetHeader(wsBreakdowns, titleText, subtitleText, 'F');
        renderBreakdownTableHeader(wsBreakdowns);

        const emptyMsg = meeting.isHoliday
            ? `Official Holiday (${meeting.holidayName || 'Holiday'}) — No Breakdowns Logged`
            : 'No breakdown incidents reported for this operational meeting.';
        renderMachineRows(wsBreakdowns, machineList, emptyMsg);

        const fileName = `Reach_Breakdowns_${meetingDate.replace(/[\/\\]/g, '-')}.xlsx`;
        await triggerWorkbookDownload(workbook, fileName);
        return true;
    } catch (err) {
        console.error('Failed to export meeting breakdowns to Excel:', err);
        throw new ExportError('Failed to generate meeting breakdown Excel file.', { cause: err });
    }
}

/**
 * Exports breakdowns for an entire month or collection across all meetings
 */
export async function exportMonthBreakdownsToExcel(meetingsList, monthLabel = 'Monthly Report') {
    if (!meetingsList || !Array.isArray(meetingsList) || meetingsList.length === 0) {
        console.warn('exportMonthBreakdownsToExcel: No meetings provided');
        return false;
    }

    try {
        const ExcelJS = await getExcelJS();
        let allMachines = null;
        const firstMeeting = meetingsList[0];
        const rawDate = firstMeeting?.date || firstMeeting?.dateDisplay || firstMeeting?.dateFormatted || '';
        const isoDate = normalizeDateToYYYYMMDD(rawDate);
        if (isoDate && isoDate.includes('-')) {
            const [y, m] = isoDate.split('-').map(Number);
            const pMonth = String(m).padStart(2, '0');
            const lastDay = new Date(y, m, 0).getDate();
            allMachines = await fetchBreakdownMachinesFromDb({
                startDate: `${y}-${pMonth}-01`,
                endDate: `${y}-${pMonth}-${String(lastDay).padStart(2, '0')}`
            });
        }

        if (!allMachines || allMachines.length === 0) {
            allMachines = [];
            meetingsList.forEach(m => {
                const mDate = m.date || m.dateDisplay || m.dateFormatted || '';
                const bks = m.breakdowns || [];
                bks.forEach(b => {
                    const unbundled = unbundleBreakdownEntry(b, mDate);
                    allMachines.push(...unbundled);
                });
            });
        }

        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Reach International Workflow';
        workbook.lastModifiedBy = 'Reach International System';
        workbook.created = new Date();
        workbook.modified = new Date();

        const wsMaster = workbook.addWorksheet('Monthly Breakdowns', {
            views: [{ state: 'frozen', ySplit: 4, showGridLines: true }]
        });
        applyPrintSetup(wsMaster);

        const titleText = `REACH INTERNATIONAL — MONTHLY FLEET BREAKDOWN REGISTER`;
        const subtitleText = `Scope: ${monthLabel} | Total Machines Logged: ${allMachines.length} | Exported: ${new Date().toLocaleString('en-IN')}`;
        applyWorksheetHeader(wsMaster, titleText, subtitleText, 'F');
        renderBreakdownTableHeader(wsMaster);
        renderMachineRows(wsMaster, allMachines, `No breakdown incidents recorded for ${monthLabel}.`);

        const cleanLabel = monthLabel.replace(/[\s\/\\]+/g, '_');
        const fileName = `Reach_Breakdowns_${cleanLabel}.xlsx`;
        await triggerWorkbookDownload(workbook, fileName);
        return true;
    } catch (err) {
        console.error('Failed to export month breakdowns to Excel:', err);
        throw new ExportError(`Failed to generate monthly breakdown Excel file for ${monthLabel}.`, { cause: err });
    }
}

/**
 * Internal helper to download workbook buffer in browser
 */
async function triggerWorkbookDownload(workbook, fileName) {
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });

    if (typeof window !== 'undefined') {
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = fileName;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        window.URL.revokeObjectURL(url);
    }
}
