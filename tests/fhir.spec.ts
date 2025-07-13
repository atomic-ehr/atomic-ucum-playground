import { test, expect } from '@playwright/test';

test.describe('FHIR Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fhir');
  });

  test('should display FHIR page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('FHIR Quantity Builder');
    await expect(page.getByText('Create FHIR-compliant Quantity objects')).toBeVisible();
  });

  test('should build basic FHIR quantity', async ({ page }) => {
    await page.locator('input[type="number"]').fill('5.5');
    await page.locator('input[placeholder="Enter UCUM code (e.g., mmol/L)"]').fill('mmol/L');
    await page.locator('input[placeholder="Enter unit display name (optional)"]').fill('millimole per liter');
    
    await page.click('button:has-text("Build Quantity")');
    
    await expect(page.getByText('FHIR Quantity')).toBeVisible();
    await expect(page.getByText('"value": 5.5')).toBeVisible();
    await expect(page.getByText('"code": "mmol/L"')).toBeVisible();
    await expect(page.getByText('"unit": "millimole per liter"')).toBeVisible();
  });

  test('should build quantity with comparator', async ({ page }) => {
    await page.locator('input[type="number"]').fill('11.1');
    await page.locator('input[placeholder="Enter UCUM code (e.g., mmol/L)"]').fill('mmol/L');
    
    await page.click('button[role="combobox"]');
    await page.click('text="> Greater than"');
    
    await page.click('button:has-text("Build Quantity")');
    
    await expect(page.getByText('"comparator": ">"')).toBeVisible();
  });

  test('should use example quantities', async ({ page }) => {
    await page.click('button:has-text("Blood Glucose")');
    
    await expect(page.locator('input[type="number"]')).toHaveValue('5.5');
    await expect(page.locator('input[placeholder="Enter UCUM code (e.g., mmol/L)"]')).toHaveValue('mmol/L');
    await expect(page.locator('input[placeholder="Enter unit display name (optional)"]')).toHaveValue('millimole per liter');
  });

  test('should handle invalid quantity', async ({ page }) => {
    await page.locator('input[type="number"]').fill('5.5');
    await page.locator('input[placeholder="Enter UCUM code (e.g., mmol/L)"]').fill('invalid_unit');
    
    await page.click('button:has-text("Build Quantity")');
    
    await expect(page.getByText('Build Error')).toBeVisible();
  });
});