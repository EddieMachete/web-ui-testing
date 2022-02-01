import { test, expect } from '@playwright/test';

test(
  'Markets hero looks as designed', async ({ page }) => {
    // 1. Go to markets landing
    await page.goto('https://upcoming11.shopify.com/markets');

    // 2. Check if page is password protected,
    //    authenticate if so

    // 3. Hero is at top of the page, no navigation is required
    // await expect(page).toHaveTitle(/Getting started/);
    // await page.locator('text=Get started').click();

    // 4. Compare images
    expect(await page.screenshot()).toMatchSnapshot('landing.png');
  }
);
