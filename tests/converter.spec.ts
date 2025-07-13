import { test, expect } from '@playwright/test';

test.describe('Converter Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/converter');
  });

  test('should display converter page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Unit Converter');
    await expect(page.getByText('Convert between different units of measure')).toBeVisible();
  });

  test('should convert blood glucose units', async ({ page }) => {
    await page.locator('input[type="number"]').first().fill('100');
    await page.locator('input').nth(1).fill('mg/dL');
    await page.locator('input').nth(2).fill('mmol/L');
    
    await page.click('button:has-text("Convert")');
    
    await expect(page.getByText('Conversion Result')).toBeVisible();
    await expect(page.getByText(/\d+\.\d+ mmol\/L/)).toBeVisible();
  });

  test('should handle unit conversion errors', async ({ page }) => {
    await page.locator('input[type="number"]').first().fill('100');
    await page.locator('input').nth(1).fill('kg');
    await page.locator('input').nth(2).fill('mmol/L');
    
    await page.click('button:has-text("Convert")');
    
    await expect(page.getByText('Conversion Error')).toBeVisible();
  });

  test('should use example conversions', async ({ page }) => {
    await page.click('button:has-text("Body Weight")');
    
    await expect(page.locator('input[type="number"]').first()).toHaveValue('150');
    await expect(page.locator('input').nth(1)).toHaveValue('[lb_av]');
    await expect(page.locator('input').nth(2)).toHaveValue('kg');
  });

  test('should swap units', async ({ page }) => {
    await page.locator('input').nth(1).fill('mg/dL');
    await page.locator('input').nth(2).fill('mmol/L');
    
    await page.click('button[aria-label="Swap units"]');
    
    await expect(page.locator('input').nth(1)).toHaveValue('mmol/L');
    await expect(page.locator('input').nth(2)).toHaveValue('mg/dL');
  });
});