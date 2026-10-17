import React from 'react';
import {
    CalendarDays,
    Calendar,
    Building2,
    Sun,
    SunMedium,
    MoonStar,
    Flame,
    Church,
    Flower2,
    Flag,
    PartyPopper,
    Wheat,
    BookOpen
} from 'lucide-react';

/**
 * CategoryTabIcon
 * Renders consistent Lucide icon for religion/category filter pills.
 */
export function CategoryTabIcon({ tabId, className = 'w-3 h-3 flex-shrink-0' }) {
    switch (tabId) {
        case 'all':
            return <CalendarDays className={className} />;
        case 'company':
            return <Building2 className={className} />;
        case 'Hindu':
            return <Sun className={className} />;
        case 'Islamic':
            return <MoonStar className={className} />;
        case 'Sikh':
            return <Flame className={className} />;
        case 'Christian':
            return <Church className={className} />;
        case 'Jain':
            return <SunMedium className={className} />;
        case 'Buddhist':
            return <Flower2 className={className} />;
        case 'National':
            return <Flag className={className} />;
        default:
            return <Calendar className={className} />;
    }
}

/**
 * HolidayEventIcon
 * Maps calendar events and festival records to clean Lucide icons.
 * Replaces all raw emoji representations across the application.
 */
export function HolidayEventIcon({ item, className = 'w-3.5 h-3.5 flex-shrink-0' }) {
    if (!item) return <Calendar className={className} />;

    if (item.isCompanyHoliday) {
        return <Building2 className={className} />;
    }

    const cat = item.category || '';
    const rel = item.religion || '';
    const name = item.name || '';
    const icon = item.icon || '';

    // 1. Holy Books, Scriptures & Observances
    if (['📖', '📚', '📜'].includes(icon) || /gita|qadr|granth|constitution/i.test(name)) {
        return <BookOpen className={className} />;
    }

    // 2. Islamic Festivals & Observances
    if (cat === 'Islamic' || rel === 'Islam' || ['☪️', '🌙'].includes(icon) || /ramadan|eid|shab|muharram|laylat/i.test(name)) {
        return <MoonStar className={className} />;
    }

    // 3. Christian Observances & Feasts
    if (cat === 'Christian' || rel === 'Christianity' || ['✝️', '🎄', '🎁'].includes(icon) || /christmas|easter|friday|epiphany|advent|all saints/i.test(name)) {
        return <Church className={className} />;
    }

    // 4. National Observances & State Days
    if (cat === 'National' || rel === 'National' || ['🇮🇳', '🚩', '🕊️'].includes(icon) || /republic|independence|gandhi|army|navy|air force|youth|science/i.test(name)) {
        return <Flag className={className} />;
    }

    // 5. Sikh Festivals & Prakash Parv
    if (cat === 'Sikh' || rel === 'Sikhism' || icon === 'ੴ' || /guru|khalsa/i.test(name)) {
        if (/lohri|baisakhi|harvest/i.test(name) || icon === '🌾') {
            return <Wheat className={className} />;
        }
        return <Flame className={className} />;
    }

    // 6. Buddhist Observances
    if (cat === 'Buddhist' || rel === 'Buddhism' || icon === '☸️' || /buddha|dhamma/i.test(name)) {
        return <Flower2 className={className} />;
    }

    // 7. Jain Festivals
    if (cat === 'Jain' || rel === 'Jainism' || icon === '卐' || /mahavir|paryushan/i.test(name)) {
        return <SunMedium className={className} />;
    }

    // 8. Cultural & Regional Celebrations
    if (cat === 'Cultural' || /new year|pateti|onam|bihu/i.test(name) || ['🎉', '🎈', '🎨'].includes(icon)) {
        return <PartyPopper className={className} />;
    }

    // 9. Parsi / Zoroastrian
    if (cat === 'Parsi' || rel === 'Zoroastrianism') {
        return <Flame className={className} />;
    }

    // 10. Hindu Festivals & Vrats
    if (cat === 'Hindu' || rel === 'Hinduism' || icon === '🕉️') {
        if (/pongal|sankranti/i.test(name) || icon === '🌾') {
            return <Wheat className={className} />;
        }
        if (/diwali|deepavali|chhath|karthigai|shivaratri/i.test(name) || ['🔥', '🪔', '🕯️'].includes(icon)) {
            return <Flame className={className} />;
        }
        if (/holi|rangpanchami/i.test(name)) {
            return <PartyPopper className={className} />;
        }
        return <Sun className={className} />;
    }

    return <Calendar className={className} />;
}

export default HolidayEventIcon;
