import { test, expect } from '@playwright/test';

test.describe('Operations Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/operations');
  });

  test('should display operations page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Quantity Operations');
    await expect(page.getByText('Perform arithmetic operations on UCUM quantities')).toBeVisible();
  });

  test('should add compatible quantities', async ({ page }) => {
    await page.locator('input[type="number"]').first().fill('500');
    await page.locator('input').nth(1).fill('mg');
    await page.locator('input[type="number"]').nth(1).fill('250');
    await page.locator('input').nth(3).fill('mg');
    
    await page.selectOption('select', 'add');
    await page.click('button:has-text("Calculate")');
    
    await expect(page.getByText('750 mg')).toBeVisible();
  });

  test('should subtract compatible quantities', async ({ page }) => {
    await page.locator('input[type="number"]').first().fill('140');
    await page.locator('input').nth(1).fill('mm[Hg]');
    await page.locator('input[type="number"]').nth(1).fill('120');
    await page.locator('input').nth(3).fill('mm[Hg]');
    
    await page.selectOption('select', 'subtract');
    await page.click('button:has-text("Calculate")');
    
    await expect(page.getByText('20 mm[Hg]')).toBeVisible();
  });

  test('should compare quantities', async ({ page }) => {
    await page.locator('input[type="number"]').first().fill('7.5');
    await page.locator('input').nth(1).fill('mmol/L');
    await page.locator('input[type="number"]').nth(1).fill('6.0');
    await page.locator('input').nth(3).fill('mmol/L');
    
    await page.selectOption('select', 'compare');
    await page.click('button:has-text("Calculate")');
    
    await expect(page.getByText('7.5 mmol/L > 6 mmol/L')).toBeVisible();
    await expect(page.getByText('Greater than')).toBeVisible();
  });

  test('should handle incompatible units', async ({ page }) => {
    await page.locator('input[type="number"]').first().fill('100');
    await page.locator('input').nth(1).fill('kg');
    await page.locator('input[type="number"]').nth(1).fill('5');
    await page.locator('input').nth(3).fill('mmol/L');
    
    await page.selectOption('select', 'add');
    await page.click('button:has-text("Calculate")');
    
    await expect(page.getByText('Operation Error')).toBeVisible();
  });

  test('should use example operations', async ({ page }) => {
    await page.click('button:has-text("Blood Pressure Difference")');
    
    await expect(page.locator('input[type="number"]').first()).toHaveValue('140');
    await expect(page.locator('input').nth(1)).toHaveValue('mm[Hg]');
    await expect(page.locator('input[type="number"]').nth(1)).toHaveValue('120');
    await expect(page.locator('input').nth(3)).toHaveValue('mm[Hg]');
    await expect(page.locator('select')).toHaveValue('subtract');
  });
});