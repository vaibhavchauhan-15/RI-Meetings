import React, { useState, useRef, useEffect, useCallback } from 'react';
import { formatMeetingSummary, copyTextToClipboard } from '../../features/meeting-reports/utils/meetingFormatters.js';
import { formatDateDDMMYYYY } from '../../features/meeting-reports/utils/meetingDateUtils.js';
import { exportMeetingBreakdownsToExcel } from '../../features/meeting-reports/services/excelExportService.js';

export default function MeetingShareMenu({ meeting, disabled = false }) {
    const [isOpen, setIsOpen] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);
    const [hasNativeShare, setHasNativeShare] = useState(false);
    const [isExportingExcel, setIsExportingExcel] = useState(false);

    const menuRef = useRef(null);
    const linkTimeoutRef = useRef(null);

    // Detect Web Share API availability
    useEffect(() => {
        setHasNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
    }, []);

    // Cleanup timeouts
    useEffect(() => {
        return () => {
            if (linkTimeoutRef.current) clearTimeout(linkTimeoutRef.current);
        };
    }, []);

    // Close on click outside or Escape key
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    // Build absolute URL for the meeting
    const getShareUrl = useCallback(() => {
        if (!meeting || typeof window === 'undefined') return '';
        const dateStr = formatDateDDMMYYYY(meeting.date || meeting.dateDisplay || meeting.dateFormatted || '');
        const url = new URL(window.location.href);
        if (dateStr) {
            url.searchParams.set('meeting', dateStr);
            url.searchParams.delete('date');
        }
        return url.toString();
    }, [meeting]);

    const displayDate = meeting 
        ? formatDateDDMMYYYY(meeting.date || meeting.dateDisplay || meeting.dateFormatted || meeting.title)
        : '';

    // Action 1: Copy Link
    const handleCopyLink = async () => {
        const shareUrl = getShareUrl();
        if (!shareUrl) return;

        const success = await copyTextToClipboard(shareUrl);
        if (success) {
            setCopiedLink(true);
            if (linkTimeoutRef.current) clearTimeout(linkTimeoutRef.current);
            linkTimeoutRef.current = setTimeout(() => {
                setCopiedLink(false);
            }, 2500);
        }
    };

    // Action 2: WhatsApp Share (direct link share)
    const handleWhatsAppShare = () => {
        if (!meeting) return;
        const shareUrl = getShareUrl();

        let waText = `🏢 *Reach International Operational Summary*\n` +
                     `📅 *Date:* ${displayDate}\n`;
        if (meeting.focus) {
            waText += `🎯 *Focus:* ${meeting.focus}\n`;
        }
        waText += `\n🔗 *Full Report Link:*\n${shareUrl}`;

        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        setIsOpen(false);
    };

    // Action 3: Email Share
    const handleEmailShare = () => {
        if (!meeting) return;
        const shareUrl = getShareUrl();
        const subject = `Operational Meeting Summary - ${displayDate}`;
        const body = `Reach International Operational Meeting Summary\n` +
                     `Date: ${displayDate}\n` +
                     `Focus: ${meeting.focus || 'Operational Review'}\n\n` +
                     `Direct Web Link:\n${shareUrl}\n\n` +
                     `--------------------------------------------------\n\n` +
                     formatMeetingSummary(meeting);

        const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoUrl;
        setIsOpen(false);
    };

    // Action 4: Native Device Share
    const handleNativeShare = async () => {
        if (!meeting || !hasNativeShare) return;
        const shareUrl = getShareUrl();
        try {
            await navigator.share({
                title: `Reach Operational Summary - ${displayDate}`,
                text: `Reach International Daily Operational Summary for ${displayDate}. Focus: ${meeting.focus || 'Operations'}`,
                url: shareUrl
            });
            setIsOpen(false);
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Error with navigator.share:', err);
            }
        }
    };

    // Action 5: Print / Save PDF
    const handlePrint = () => {
        setIsOpen(false);
        const originalTitle = document.title;
        if (meeting) {
            const dateStr = displayDate || formatDateDDMMYYYY(meeting.date || meeting.dateDisplay || meeting.dateFormatted || '');
            document.title = `Reach International - Operational Report - ${dateStr}`;
        }
        setTimeout(() => {
            window.print();
            setTimeout(() => {
                document.title = originalTitle;
            }, 1000);
        }, 150);
    };

    // Action 6: Export Breakdowns to Excel (.xlsx)
    const handleExportExcel = async () => {
        if (!meeting) return;
        setIsExportingExcel(true);
        try {
            await exportMeetingBreakdownsToExcel(meeting);
        } catch (err) {
            console.error('Failed to export breakdowns to Excel:', err);
        } finally {
            setIsExportingExcel(false);
            setIsOpen(false);
        }
    };

    return (
        <div ref={menuRef} className="relative inline-block text-left">
            {/* Trigger Share Button */}
            <button
                type="button"
                onClick={() => setIsOpen(prev => !prev)}
                disabled={disabled}
                className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all duration-200 active:scale-90 border flex-shrink-0 cursor-pointer group ${
                    isOpen 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                        : 'bg-white text-slate-500 border-border-light hover:text-theme-breakdown hover:border-theme-breakdown hover:bg-slate-50 shadow-2xs'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={isOpen ? 'Close share menu' : 'Share meeting summary'}
                aria-label="Share meeting summary"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <svg 
                    viewBox="0 0 24 24" 
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:scale-105" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                >
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>

                {/* Hover Tooltip when closed */}
                {!isOpen && (
                    <span className="absolute right-full mr-2 px-2 py-0.5 rounded-md text-[11px] font-bold whitespace-nowrap bg-slate-900 text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-all shadow-md z-30">
                        Share
                    </span>
                )}
            </button>

            {/* Share Popover Dropdown Menu */}
            {isOpen && (
                <div 
                    className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-3 animate-fade-in origin-top-right text-slate-900"
                    role="menu"
                    aria-orientation="vertical"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-theme-breakdown"></span>
                            <span className="text-xs font-extrabold text-slate-900">
                                Share Summary
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="text-slate-400 hover:text-slate-700 text-xs font-bold p-1 rounded hover:bg-slate-100 transition-colors"
                            aria-label="Close share popover"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Quick Copy Link Box */}
                    <div className="mb-2.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                            Meeting Link
                        </label>
                        <div className="flex items-center gap-1.5 p-1 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-theme-breakdown focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                            <input 
                                type="text" 
                                readOnly 
                                value={getShareUrl()} 
                                className="bg-transparent text-[11px] text-slate-600 font-mono flex-1 outline-none px-2 truncate select-all"
                                aria-label="Meeting direct URL"
                            />
                            <button 
                                type="button" 
                                onClick={handleCopyLink}
                                title={copiedLink ? 'Link copied!' : 'Copy meeting link'}
                                aria-label={copiedLink ? 'Copied link to clipboard' : 'Copy meeting link'}
                                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all shadow-2xs flex-shrink-0 cursor-pointer active:scale-95 ${
                                    copiedLink 
                                        ? 'bg-emerald-600 text-white border border-emerald-600' 
                                        : 'bg-white text-slate-600 border border-border-light hover:bg-slate-100 hover:text-theme-breakdown'
                                }`}
                            >
                                {copiedLink ? (
                                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Quick Sharing Options */}
                    <div className="space-y-1">
                        {/* WhatsApp Option */}
                        <button
                            type="button"
                            onClick={handleWhatsAppShare}
                            className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-emerald-50/70 border border-transparent hover:border-emerald-200/80 transition-all cursor-pointer group"
                        >
                            <div className="flex items-center gap-2.5">
                                <span className="w-7 h-7 rounded-lg bg-[#25D366]/15 text-[#128C7E] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.698.058-2.029-.49-1.697-.7-2.775-2.434-2.859-2.547-.084-.112-.684-.912-.684-1.74 0-.828.433-1.234.586-1.397.153-.164.333-.205.444-.205l.319.006c.11 0 .258-.041.403.308.153.367.525 1.282.571 1.376.046.094.077.204.015.328-.063.125-.094.204-.188.314-.094.11-.197.246-.282.33-.094.094-.192.196-.083.383.11.187.487.804 1.045 1.301.718.639 1.323.837 1.51.93.187.094.296.079.406-.047.11-.125.47-5.46.595-.734.125-.188.25-.157.422-.094.172.063 1.094.516 1.282.609.188.094.313.141.359.219.046.078.046.452-.098.857z"/>
                                    </svg>
                                </span>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                                        Send to WhatsApp
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-medium">
                                        Share direct meeting report link
                                    </span>
                                </div>
                            </div>
                            <span className="text-xs text-slate-400 group-hover:text-emerald-700 transition-transform group-hover:translate-x-0.5">
                                →
                            </span>
                        </button>

                        {/* Email Option */}
                        <button
                            type="button"
                            onClick={handleEmailShare}
                            className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-blue-50/70 border border-transparent hover:border-blue-200/80 transition-all cursor-pointer group"
                        >
                            <div className="flex items-center gap-2.5">
                                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                    </svg>
                                </span>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-slate-900 group-hover:text-blue-900">
                                        Send via Email
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-medium">
                                        Open draft in default email app
                                    </span>
                                </div>
                            </div>
                            <span className="text-xs text-slate-400 group-hover:text-blue-700 transition-transform group-hover:translate-x-0.5">
                                →
                            </span>
                        </button>

                        {/* Native Device Share (when supported) */}
                        {hasNativeShare && (
                            <button
                                type="button"
                                onClick={handleNativeShare}
                                className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-purple-50/70 border border-transparent hover:border-purple-200/80 transition-all cursor-pointer group"
                            >
                                <div className="flex items-center gap-2.5">
                                    <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                                            <polyline points="16 6 12 2 8 6"></polyline>
                                            <line x1="12" y1="2" x2="12" y2="15"></line>
                                        </svg>
                                    </span>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-900 group-hover:text-purple-900">
                                            More Sharing Options...
                                        </span>
                                        <span className="text-[10px] text-slate-500 font-medium">
                                            Use system share (Teams, AirDrop, etc.)
                                        </span>
                                    </div>
                                </div>
                                <span className="text-xs text-slate-400 group-hover:text-purple-700 transition-transform group-hover:translate-x-0.5">
                                    →
                                </span>
                            </button>
                        )}

                        {/* Export Breakdowns to Excel */}
                        <button
                            type="button"
                            onClick={handleExportExcel}
                            disabled={isExportingExcel}
                            className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-emerald-50/70 border border-transparent hover:border-emerald-200/80 transition-all cursor-pointer group"
                        >
                            <div className="flex items-center gap-2.5">
                                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <line x1="8" y1="13" x2="16" y2="13"></line>
                                        <line x1="8" y1="17" x2="16" y2="17"></line>
                                        <polyline points="10 9 9 9 8 9"></polyline>
                                    </svg>
                                </span>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                                        {isExportingExcel ? 'Exporting...' : 'Export Breakdowns (Excel)'}
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-medium">
                                        Download formatted .xlsx breakdown report
                                    </span>
                                </div>
                            </div>
                            <span className="text-xs text-slate-400 group-hover:text-emerald-700 transition-transform group-hover:translate-x-0.5">
                                ↓
                            </span>
                        </button>

                        {/* Print / Save PDF */}
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-100/80 border border-transparent hover:border-slate-200 transition-all cursor-pointer group"
                        >
                            <div className="flex items-center gap-2.5">
                                <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="6 9 6 2 18 2 18 9"></polyline>
                                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                                        <rect width="12" height="8" x="6" y="14"></rect>
                                    </svg>
                                </span>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-slate-900">
                                        Print / Save as PDF
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-medium">
                                        Clean formatted document printout
                                    </span>
                                </div>
                            </div>
                            <span className="text-xs text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-0.5">
                                →
                            </span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
