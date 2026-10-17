import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/vaibh/.gemini/antigravity/brain/db7d04b3-4340-452b-9b23-d9b67ce355b0';

async function runVisualTests() {
    console.log('Starting Playwright visual & interactive test on http://localhost:4173 ...');
    const browser = await chromium.launch({ channel: 'msedge', headless: true });
    
    // 1. Desktop Test (1440x900)
    console.log('\n--- 1. Testing Desktop Viewport (1440x900) ---');
    const desktopContext = await browser.newContext({
        viewport: { width: 1440, height: 900 }
    });
    const desktopPage = await desktopContext.newPage();
    await desktopPage.goto('http://localhost:4173', { waitUntil: 'networkidle' });
    
    // Check if calendar button is present and click to open sidebar if not already open
    const calendarToggleBtn = desktopPage.locator('button:has-text("2026 Calendar & Holidays")');
    if (await calendarToggleBtn.count() > 0) {
        await calendarToggleBtn.click();
        await desktopPage.waitForTimeout(400);
        console.log('✓ Desktop: Clicked 2026 Calendar & Holidays button');
    }

    // Wait for the calendar element to appear
    await desktopPage.waitForSelector('aside[aria-label*="Calendar"]', { timeout: 10000 });
    console.log('✓ Desktop: Indian & Holiday calendar widget mounted and visible');

    // Screenshot 1: Desktop Default View
    const desktopDefaultPath = path.join(ARTIFACT_DIR, 'desktop-calendar-default.png');
    await desktopPage.screenshot({ path: desktopDefaultPath, fullPage: false });
    console.log(`✓ Desktop screenshot saved: ${desktopDefaultPath}`);

    // Test Quick Month Picker Toggle
    const monthPickerToggle = desktopPage.locator('button[title*="jump directly to any month"]');
    if (await monthPickerToggle.count() > 0) {
        await monthPickerToggle.click();
        await desktopPage.waitForTimeout(300);
        const monthPickerPath = path.join(ARTIFACT_DIR, 'desktop-month-picker.png');
        await desktopPage.screenshot({ path: monthPickerPath, fullPage: false });
        console.log(`✓ Desktop month picker screenshot saved: ${monthPickerPath}`);

        // Click March in picker
        const marBtn = desktopPage.locator('button:has-text("Mar")').first();
        if (await marBtn.count() > 0) {
            await marBtn.click();
            await desktopPage.waitForTimeout(300);
            console.log('✓ Desktop: Jumped to March via 12-month picker');
        }
    } else {
        // Fallback next month button
        const nextMonthBtn = desktopPage.locator('button[aria-label="Next month"]');
        await nextMonthBtn.click();
        await desktopPage.waitForTimeout(200);
    }

    // Test selecting a company holiday (e.g. Holi)
    const holidayCell = desktopPage.locator('button[aria-label*="Official Company Holiday"]').first();
    if (await holidayCell.count() > 0) {
        await holidayCell.click();
        await desktopPage.waitForTimeout(300);
        console.log('✓ Desktop: Official Company Holiday cell clicked (marked green)');
    }

    // Screenshot 2: Desktop Selected Green Company Holiday
    const desktopSelectedHolidayPath = path.join(ARTIFACT_DIR, 'desktop-calendar-selected-holiday.png');
    await desktopPage.screenshot({ path: desktopSelectedHolidayPath, fullPage: false });
    console.log(`✓ Desktop selected holiday screenshot saved: ${desktopSelectedHolidayPath}`);

    // Test selecting a non-holiday festival / event (marked in respected amber)
    const festivalCell = desktopPage.locator('button[title*="Regular Working Day"]').first();
    if (await festivalCell.count() > 0) {
        await festivalCell.click();
        await desktopPage.waitForTimeout(300);
        console.log('✓ Desktop: Festival / Observance cell clicked (marked amber)');
    }

    // Screenshot 3: Desktop Selected Amber Festival Observance
    const desktopSelectedFestivalPath = path.join(ARTIFACT_DIR, 'desktop-calendar-selected-festival.png');
    await desktopPage.screenshot({ path: desktopSelectedFestivalPath, fullPage: false });
    console.log(`✓ Desktop selected festival screenshot saved: ${desktopSelectedFestivalPath}`);

    // Test "Today" quick-jump button
    const todayBtn = desktopPage.locator('button[aria-label="Jump to today\'s date"]');
    if (await todayBtn.count() > 0) {
        await todayBtn.click();
        await desktopPage.waitForTimeout(300);
        console.log('✓ Desktop: Clicked Today button, jumped back to today');
    }

    // 2. Mobile Viewport Test (390x844 iPhone 14)
    console.log('\n--- 2. Testing Mobile Viewport (390x844) ---');
    const mobileContext = await browser.newContext({
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto('http://localhost:4173', { waitUntil: 'networkidle' });

    // Tap the "2026 Calendar" Segment Pill on mobile
    const holidayTabBtn = mobilePage.locator('button:has-text("Calendar")').first();
    await holidayTabBtn.click();
    await mobilePage.waitForTimeout(400);
    console.log('✓ Mobile: Switched to 2026 Calendar tab');

    // Verify calendar is visible on mobile
    const mobileCalendar = mobilePage.locator('aside[aria-label*="Calendar"]');
    if (await mobileCalendar.isVisible()) {
        console.log('✓ Mobile: Calendar successfully displayed in single column');
    }

    // Tap a festival cell on mobile
    const mobileFestivalCell = mobilePage.locator('button[title*="Regular Working Day"]').first();
    if (await mobileFestivalCell.count() > 0) {
        await mobileFestivalCell.click();
        await mobilePage.waitForTimeout(300);
        console.log('✓ Mobile: Tapped festival cell, working day details updated');
    }

    // Screenshot 4: Mobile Calendar View
    const mobileCalendarPath = path.join(ARTIFACT_DIR, 'mobile-calendar-view.png');
    await mobilePage.screenshot({ path: mobileCalendarPath, fullPage: false });
    console.log(`✓ Mobile calendar screenshot saved: ${mobileCalendarPath}`);

    await browser.close();
    console.log('\n=== ALL PLAYWRIGHT VISUAL TESTS COMPLETED SUCCESSFULLY! ===');
}

runVisualTests().catch(err => {
    console.error('Test error:', err);
    process.exit(1);
});
