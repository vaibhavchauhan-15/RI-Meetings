import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowLeft } from 'lucide-react';
import Tooltip from '../shared/Tooltip.jsx';

/**
 * Navbar Component for Reach International
 * Adheres strictly to design.md specifications:
 * - Clean plain white background (#ffffff)
 * - Standard App Header sizing (H: 64px desktop / H: 56px mobile)
 * - Standard 4px/8px padding grid (Desktop: 0 28px, Mobile: 0 12px)
 * - Accessible logo image (/logo.png) with touch-target ergonomics
 * - Fluid mobile-optimized search input with smooth expansion on focus
 * - Zero overlap architecture with flex layout integration
 */
export const Navbar = React.memo(function Navbar({ 
    onLogoClick,
    searchQuery = '',
    onSearchChange
}) {
    const [isMobile, setIsMobile] = useState(false);
    const [isMobileExpanded, setIsMobileExpanded] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 640;
            setIsMobile(mobile);
            if (!mobile) {
                setIsMobileExpanded(false);
            }
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleMobileBack = () => {
        setIsMobileExpanded(false);
        onSearchChange?.('');
        if (inputRef.current) {
            inputRef.current.blur();
        }
    };

    const handleLogoPress = () => {
        setIsMobileExpanded(false);
        onLogoClick?.();
    };

    return (
        <header 
            className="app-header relative w-full bg-white border-b border-border-light shadow-xs z-30 flex-shrink-0 select-none transition-all"
            role="banner"
        >
            <div className="h-16 px-2.5 sm:px-4 md:px-6 lg:px-8 max-w-[1440px] w-full mx-auto flex items-center justify-between gap-3 sm:gap-4">
                {/* Mobile Expanded Back Button */}
                {isMobileExpanded && (
                    <button
                        type="button"
                        onClick={handleMobileBack}
                        className="sm:hidden p-2 -ml-1 text-slate-700 hover:text-slate-950 active:scale-95 rounded-xl hover:bg-slate-100 transition-all flex items-center justify-center min-w-[40px] min-h-[40px] flex-shrink-0 cursor-pointer group"
                        title="Back to normal view"
                        aria-label="Back to normal view"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-700 transition-transform duration-200 group-hover:-translate-x-1" />
                    </button>
                )}

                {/* Brand Logo & Home Navigation Trigger */}
                <button
                    type="button"
                    onClick={handleLogoPress}
                    className={`inline-flex items-center gap-2 sm:gap-3 group p-1 -ml-1 rounded-xl transition-all duration-200 hover:bg-slate-50 active:scale-[0.98] cursor-pointer focus:outline-none focus:ring-2 focus:ring-theme-breakdown/30 min-h-[44px] min-w-[44px] flex-shrink-0 ${
                        isMobileExpanded ? 'hidden sm:inline-flex' : 'inline-flex'
                    }`}
                    title="Reach International — Return to Daily Meeting Report"
                    aria-label="Reach International — Return to Daily Meeting Report"
                >
                    <img 
                        src="/logo.png" 
                        alt="Reach International — Reaching All Heights" 
                        className="h-9 sm:h-10 w-auto max-w-[160px] sm:max-w-[220px] object-contain transition-transform duration-200 group-hover:opacity-95"
                        loading="eager"
                        decoding="async"
                    />
                </button>

                {/* Search Input Container with Tooltip */}
                {onSearchChange && (
                    <Tooltip
                        content="Search meetings by date (02-09-2026), month, site, or machine"
                        position="bottom"
                        hideOnFocus={true}
                        className={`transition-all duration-200 ${
                            isMobileExpanded 
                                ? 'w-full flex-1' 
                                : 'flex-1 max-w-[210px] min-[380px]:max-w-[240px] sm:flex-none sm:ml-auto sm:w-80'
                        }`}
                    >
                        <div className="relative flex items-center w-full group">
                            <Search className="absolute left-3 text-slate-400 pointer-events-none w-4 h-4 flex-shrink-0 transition-transform duration-300 group-focus-within:scale-110 group-focus-within:text-theme-breakdown" />
                            <input 
                                ref={inputRef}
                                type="text" 
                                className="w-full h-10 pl-9 sm:pl-9.5 pr-8 text-xs sm:text-[13px] bg-slate-50 border border-border-light rounded-xl focus:bg-white focus:border-theme-breakdown focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium shadow-2xs"
                                placeholder={
                                    isMobile && !isMobileExpanded 
                                        ? "Search meetings..." 
                                        : "Search (02-09-2026, 2 Sept, Sanand)..."
                                }
                                value={searchQuery}
                                onFocus={() => {
                                    if (window.innerWidth < 640) {
                                        setIsMobileExpanded(true);
                                    }
                                }}
                                onChange={(e) => onSearchChange(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape') {
                                        onSearchChange('');
                                        setIsMobileExpanded(false);
                                        if (inputRef.current) inputRef.current.blur();
                                    }
                                }}
                                aria-label="Search meetings across archive"
                            />
                            {searchQuery && (
                                <button 
                                    type="button"
                                    className="absolute right-2 w-6 h-6 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 text-xs font-bold transition-all active:scale-90 cursor-pointer group" 
                                    onClick={() => {
                                        onSearchChange('');
                                        if (inputRef.current) inputRef.current.focus();
                                    }}
                                    title="Clear search"
                                    aria-label="Clear search query"
                                >
                                    <X className="w-3.5 h-3.5 transition-transform duration-200 hover:rotate-90 hover:scale-110" />
                                </button>
                            )}
                        </div>
                    </Tooltip>
                )}
            </div>
        </header>
    );
});

export default Navbar;
