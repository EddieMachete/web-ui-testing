import { test, expect } from '@playwright/test';

test(
  'basic test', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    await page.locator('text=Get started').click();
    await expect(page).toHaveTitle(/Getting started/);
  }
);

test(
  'Image comparison', async ({ page }) => {
    await page.goto('https://playwright.dev');
    expect(await page.screenshot()).toMatchSnapshot('landing.png');
  }
);
