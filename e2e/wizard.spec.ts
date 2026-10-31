import { test, expect } from '@playwright/test';

test('Wizard to Dashboard E2E flow', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('PlanPilot AI')).toBeVisible();

  await page.click('text=Get Started');
  await expect(page.getByText('Choose Event Type')).toBeVisible();

  // Select wedding
  await page.click('text=Wedding');
  await page.click('text=Next');

  await expect(page.getByText('Enter Event Basics')).toBeVisible();
  await page.fill('input#event-title', 'Playwright Wedding');
  await page.fill('input#event-date', '2030-08-20');
  await page.fill('input#guest-count', '150');
  await page.fill('input#total-budget', '20000');
  await page.fill('input#city', 'San Francisco');
  await page.click('text=Next');

  await expect(page.getByText('Theme & Preferences')).toBeVisible();
  await page.fill('input#theme-vibe', 'Modern Minimalist');
  await page.click('text=Generate Plan with AI');

  // Should navigate to dashboard
  await expect(page.getByText('Playwright Wedding')).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('Budget')).toBeVisible();
  await expect(page.getByText('Timeline')).toBeVisible();
});
