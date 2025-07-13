import { test, expect } from '@playwright/test';

test.describe('Parser Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/parser');
  });

  test('should display parser page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('UCUM Parser');
    await expect(page.getByText('Parse and validate UCUM unit expressions')).toBeVisible();
  });

  test('should parse valid UCUM expression', async ({ page }) => {
    await page.fill('input[placeholder="Enter UCUM expression (e.g., mg/dL)"]', 'mg/dL');
    await page.click('button:has-text("Parse")');
    
    await expect(page.getByText('Parsed Successfully ✓')).toBeVisible();
    await expect(page.getByText('Display Name')).toBeVisible();
  });

  test('should handle invalid expression', async ({ page }) => {
    await page.fill('input[placeholder="Enter UCUM expression (e.g., mg/dL)"]', 'invalid_unit');
    await page.click('button:has-text("Parse")');
    
    await expect(page.getByText('Parse Error')).toBeVisible();
  });

  test('should use example expressions', async ({ page }) => {
    await page.click('button:has-text("mm[Hg]")');
    await expect(page.locator('input[placeholder="Enter UCUM expression (e.g., mg/dL)"]')).toHaveValue('mm[Hg]');
    
    await page.click('button:has-text("Parse")');
    await expect(page.getByText('Parsed Successfully ✓')).toBeVisible();
  });
});