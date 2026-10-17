/**
 * Reach International Operations - Meeting Text Summarizers & Clipboard Utilities
 * 
 * Generates formatted text documents for pasting into WhatsApp, Slack, emails, or notes.
 */

import { formatDateDDMMYYYY } from './meetingDateUtils.js';

/**
 * Formats a meeting data object into a clean, human-readable structured text document.
 * Adheres strictly to AGENTS.md rules for copying summaries.
 */
export function formatMeetingSummary(meeting) {
    if (!meeting) return '';

    const displayDate = formatDateDDMMYYYY(meeting.date || meeting.dateFormatted || meeting.title);

    let text = `==================================================\n`;
    text += `OPERATIONAL MEETING SUMMARY\n`;
    text += `==================================================\n`;
    text += `Date: ${displayDate}\n`;
    text += `Focus: ${meeting.focus || 'Operational Updates'}\n\n`;

    if (meeting.isHoliday) {
        text += `--------------------------------------------------\n`;
        text += `OFFICIAL HOLIDAY: ${(meeting.holidayName || 'COMPANY HOLIDAY').toUpperCase()}\n`;
        text += `--------------------------------------------------\n`;
        text += `• Office and general fleet operations remained closed on account of ${meeting.holidayName || 'Company Holiday'}.\n`;
        text += `• No daily operations breakdown or coordination meeting was conducted.\n\n`;
    } else if (meeting.notRecorded) {
        text += `--------------------------------------------------\n`;
        text += `OPERATIONS STATUS: MEETING NOT RECORDED (INTERNET ISSUE)\n`;
        text += `--------------------------------------------------\n`;
        text += `• Daily operations review and equipment coordination meeting was conducted.\n`;
        text += `• Meeting recording and transcript are unavailable due to internet/network connectivity issues.\n\n`;
    } else if (!meeting.breakdowns || meeting.breakdowns.length === 0) {
        text += `--------------------------------------------------\n`;
        text += `OPERATIONS STATUS: OFFICE OPEN • NO MEETING HELD\n`;
        text += `--------------------------------------------------\n`;
        text += `• Corporate offices, workshop maintenance, and site fleet operations were fully active and operational.\n`;
        text += `• No daily operations breakdown or coordination meeting was conducted on this day.\n\n`;
    }

    if (meeting.breakdowns && meeting.breakdowns.length > 0) {
        text += `--------------------------------------------------\n`;
        text += `1. MACHINE BREAKDOWNS & SITE UPDATES\n`;
        text += `--------------------------------------------------\n`;
        meeting.breakdowns.forEach((m, idx) => {
            text += `• ${m.site || m.location || 'Site'}:\n`;
            if (m.model) text += `  - Model: ${m.model}\n`;
            if (m.serialNumber) text += `  - Serial No: ${m.serialNumber}\n`;
            if (m.issue) text += `  - Issue: ${m.issue}\n`;
            if (m.action) text += `  - Action: ${m.action}\n`;
            if (m.logistics && m.logistics !== 'undefined' && String(m.logistics).trim()) text += `  - Logistics: ${m.logistics}\n`;
            if (m.clarification && m.clarification !== 'undefined' && String(m.clarification).trim()) text += `  - Clarification: ${m.clarification}\n`;
            if (m.status && m.status !== 'undefined' && String(m.status).trim()) text += `  - Status: ${m.status}\n`;
            if (m.pendingIssue && m.pendingIssue !== 'undefined' && String(m.pendingIssue).trim()) text += `  - Pending Issue: ${m.pendingIssue}\n`;
            if (idx < meeting.breakdowns.length - 1) text += `\n`;
        });
        text += `\n`;
    }

    if (meeting.parts && meeting.parts.length > 0) {
        text += `--------------------------------------------------\n`;
        text += `2. PARTS, PROCUREMENT & INVENTORY\n`;
        text += `--------------------------------------------------\n`;
        meeting.parts.forEach((p, idx) => {
            text += `• ${p.part}${p.context ? ` [${p.context}]` : ''}\n`;
            text += `  - Status & Next Steps: ${p.statusNextSteps}\n`;
            if (idx < meeting.parts.length - 1) text += `\n`;
        });
        text += `\n`;
    }

    if (meeting.directives && meeting.directives.length > 0) {
        text += `--------------------------------------------------\n`;
        text += `3. POLICY & PROCESS DIRECTIVES\n`;
        text += `--------------------------------------------------\n`;
        meeting.directives.forEach((pd, idx) => {
            text += `• ${pd.title}:\n`;
            if (pd.points && pd.points.length > 0) {
                pd.points.forEach(pt => {
                    text += `  - ${pt}\n`;
                });
            }
            if (idx < meeting.directives.length - 1) text += `\n`;
        });
        text += `\n`;
    }

    if (meeting.actionItems && meeting.actionItems.length > 0) {
        text += `--------------------------------------------------\n`;
        text += `4. KEY ACTION ITEMS & OWNERSHIP\n`;
        text += `--------------------------------------------------\n`;
        meeting.actionItems.forEach(a => {
            text += `• ${a.person}: ${a.task}\n`;
        });
        text += `\n`;
    }

    text += `==================================================\n`;
    text += `Reach International Workflow Management System\n`;
    text += `==================================================`;

    return text;
}

/**
 * Copies text to the clipboard with modern API and reliable textarea fallback
 */
export async function copyTextToClipboard(text) {
    if (!text) return false;

    // 1. Modern Clipboard API
    if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.warn('navigator.clipboard.writeText failed, falling back to textarea:', err);
        }
    }

    // 2. Fallback: temporary off-screen textarea
    if (typeof document === 'undefined') return false;
    try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = '0';
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';
        textArea.setAttribute('readonly', '');

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        textArea.setSelectionRange(0, text.length);

        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
    } catch (fallbackErr) {
        console.error('Fallback execCommand copy failed:', fallbackErr);
        return false;
    }
}
